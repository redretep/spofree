

import React, { useState, useEffect, useRef } from 'react';
import { Player } from './components/Player';
import { Sidebar } from './components/Sidebar';
import { TrackList } from './components/TrackList';
import { ImportModal } from './components/ImportModal';
import { PlaylistEditModal } from './components/PlaylistEditModal';
import { SettingsModal, SettingsTab } from './components/SettingsModal';
import { AddToPlaylistModal } from './components/AddToPlaylistModal';
import { RightSidebar } from './components/RightSidebar';
import { DownloadManager } from './components/DownloadManager';
import { ViewState, Track, Album, Artist, Playlist, RecentlyPlayedItem, RepeatMode, AudioQuality } from './types';
import { 
    searchAll, getStreamUrl, getCurrentApiUrl, 
    getAlbumTracks, getArtistTopTracks, getPlaylistTracks, getArtistAlbums, downloadTrackBlob, downloadBlobWithProgress 
} from './services/hifiService';
import { storageService } from './services/storageService';
import { ChevronLeft, ChevronRight, Search, Home, Library, Heart, Github, Pencil, Settings, Download, Archive, Loader2, Plus, Disc, Mic2, ListMusic } from 'lucide-react';
import { Button } from './components/Button';
import JSZip from 'jszip';

type CategoryFilter = 'ALL' | 'TRACKS' | 'ALBUMS' | 'ARTISTS' | 'PLAYLISTS';
type LibraryTab = 'PLAYLISTS' | 'LIKED_SONGS' | 'ALBUMS' | 'ARTISTS';

// History Item type for navigation
interface HistoryState {
    view: ViewState;
    entity?: any;
    query?: string;
    filter?: CategoryFilter;
    detailTracks?: Track[];
    detailAlbums?: Album[]; // Added for Artist view
}

// Custom CSV Icon
const CsvFileIcon = ({size=24, className=""}: {size?: number, className?: string}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M8 13h.01" />
      <path d="M8 17h.01" />
      <path d="M12 13h.01" />
      <path d="M12 17h.01" />
      <path d="M16 13h.01" />
      <path d="M16 17h.01" />
    </svg>
)

const App: React.FC = () => {
  // Navigation State
  const [historyStack, setHistoryStack] = useState<HistoryState[]>([{ view: ViewState.HOME }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Helpers to get current state from stack
  const currentState = historyStack[historyIndex];
  const view = currentState.view;
  const selectedEntity = currentState.entity;
  const searchQuery = currentState.query || '';
  const filter = currentState.filter || 'ALL';
  const detailTracks = currentState.detailTracks || [];
  const detailAlbums = currentState.detailAlbums || [];

  // Data State
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  
  // Queue Management
  const [queue, setQueue] = useState<Track[]>([]);
  const [originalQueue, setOriginalQueue] = useState<Track[]>([]); // Backup for shuffle OFF
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('OFF');

  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedItem[]>([]);
  
  // Home Recommendations State
  const [homeSections, setHomeSections] = useState<{ title: string; items: any[]; type: 'ALBUM' | 'PLAYLIST' | 'ARTIST' }[]>([]);

  // Search State
  const [searchInput, setSearchInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [resultTracks, setResultTracks] = useState<Track[]>([]);
  const [resultAlbums, setResultAlbums] = useState<Album[]>([]);
  const [resultArtists, setResultArtists] = useState<Artist[]>([]);
  const [resultPlaylists, setResultPlaylists] = useState<Playlist[]>([]);
  
  // Library State
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedSongs, setLikedSongs] = useState<Track[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<Album[]>([]);
  const [followedArtists, setFollowedArtists] = useState<Artist[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [libraryTab, setLibraryTab] = useState<LibraryTab>('PLAYLISTS');
  
  // Settings State
  const [accentColor, setAccentColor] = useState('#1db954');
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [audioQuality, setAudioQuality] = useState<AudioQuality>('LOSSLESS');
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const [compactMode, setCompactMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [grayscaleMode, setGrayscaleMode] = useState(false);
  const [squareAvatars, setSquareAvatars] = useState(false);
  const [highPerformanceMode, setHighPerformanceMode] = useState(false);
  const [disableGlow, setDisableGlow] = useState(false);
  const [updateTitle, setUpdateTitle] = useState(true);
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  
  // Download State
  const [zipDownloadState, setZipDownloadState] = useState<{ name: string, progress: number } | null>(null);
  const [singleDownloadState, setSingleDownloadState] = useState<{ name: string, progress: number } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [connectedInstance, setConnectedInstance] = useState(getCurrentApiUrl());
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Sidebar State
  const [rightSidebarMode, setRightSidebarMode] = useState<'QUEUE' | 'LYRICS' | null>(null);

  // Scroll Detection
  const [isScrolled, setIsScrolled] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Modals
  const [showImportModal, setShowImportModal] = useState(false);
  const [showPlaylistEditModal, setShowPlaylistEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsStartTab, setSettingsStartTab] = useState<SettingsTab>('QUALITY');
  const [trackToAdd, setTrackToAdd] = useState<Track | null>(null); 

  const updateConnectionStatus = () => setConnectedInstance(getCurrentApiUrl());

  const refreshLibrary = () => {
      setPlaylists(storageService.getPlaylists());
      setLikedSongs(storageService.getLikedSongs());
      setSavedAlbums(storageService.getSavedAlbums());
      setFollowedArtists(storageService.getFollowedArtists());
      setSearchHistory(storageService.getHistory());
      setRecentlyPlayed(storageService.getRecentlyPlayed());
      
      // Sync settings
      setAccentColor(storageService.getAccentColor());
      setShowVisualizer(storageService.getShowVisualizer());
      setShowStats(storageService.getShowStats());
      setAudioQuality(storageService.getQuality());
      setCompactMode(storageService.getCompactMode());
      setReducedMotion(storageService.getReducedMotion());
      setGrayscaleMode(storageService.getGrayscaleMode());
      setSquareAvatars(storageService.getSquareAvatars());
      setHighPerformanceMode(storageService.getHighPerformanceMode());
      setDisableGlow(storageService.getDisableGlow());
      setUpdateTitle(storageService.getUpdateTitle());
  };

  const fetchHomeContent = async () => {
    const sections: { title: string; items: any[]; type: 'ALBUM' | 'PLAYLIST' | 'ARTIST' }[] = [];
    const recent = storageService.getRecentlyPlayed();
    
    // 1. Personalized Recommendations
    // Find the most recent Artist interaction
    const lastArtistItem = recent.find(i => 
        i.type === 'ARTIST' || 
        (i.type === 'ALBUM' && (i.data as Album).artist) || 
        (i.type === 'TRACK' && (i.data as Track).artist)
    );

    if (lastArtistItem) {
        let artistId, artistName;
        if (lastArtistItem.type === 'ARTIST') {
            artistId = (lastArtistItem.data as Artist).id;
            artistName = (lastArtistItem.data as Artist).name;
        } else if (lastArtistItem.type === 'ALBUM') {
             artistId = (lastArtistItem.data as Album).artist?.id;
             artistName = (lastArtistItem.data as Album).artist?.name;
        } else if (lastArtistItem.type === 'TRACK') {
             artistId = (lastArtistItem.data as Track).artist.id;
             artistName = (lastArtistItem.data as Track).artist.name;
        }

        if (artistId && artistName) {
            try {
                const albums = await getArtistAlbums(artistId);
                if (albums.length > 0) {
                    sections.push({
                        title: `More from ${artistName}`,
                        items: albums.slice(0, 5),
                        type: 'ALBUM'
                    });
                }
            } catch(e) { console.error(e); }
        }
    }

    // 2. Default Popular Content
    try {
        const [popRes, hitsRes] = await Promise.all([
            searchAll('party 2010'),
            searchAll('tidal picks')
            
        ]);

        if (popRes.playlists.length > 0) {
            sections.push({
                title: 'Popular Playlists',
                items: popRes.playlists.slice(0, 5),
                type: 'PLAYLIST'
            });
        }
        
        if (hitsRes.albums.length > 0) {
            sections.push({
                title: 'Trending Albums',
                items: hitsRes.albums.slice(0, 5),
                type: 'ALBUM'
            });
        }
    } catch (e) { console.error(e); }

    setHomeSections(sections);
  };

  useEffect(() => {
    refreshLibrary();
    updateConnectionStatus();
    fetchHomeContent();
  }, []);

  // Update document title
  useEffect(() => {
      if (updateTitle && currentTrack) {
          document.title = `${currentTrack.title} • ${currentTrack.artist.name}`;
      } else {
          document.title = "SpoFree - High Fidelity Streaming";
      }
  }, [currentTrack, updateTitle]);

  // Update local search input when navigating through history
  useEffect(() => {
      if (currentState.query) {
          setSearchInput(currentState.query);
      } else {
          setSearchInput('');
      }
  }, [currentState]);

  // Scroll Handler
  useEffect(() => {
      const handleScroll = () => {
          if (mainContentRef.current) {
              setIsScrolled(mainContentRef.current.scrollTop > 10);
          }
      };
      const ref = mainContentRef.current;
      ref?.addEventListener('scroll', handleScroll);
      return () => ref?.removeEventListener('scroll', handleScroll);
  }, [view]);

  // Navigation Handler
  const navigateTo = (newState: HistoryState) => {
      const newStack = historyStack.slice(0, historyIndex + 1);
      newStack.push(newState);
      setHistoryStack(newStack);
      setHistoryIndex(newStack.length - 1);
      if (mainContentRef.current) mainContentRef.current.scrollTop = 0;
  };

  const goBack = () => {
      if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const goForward = () => {
      if (historyIndex < historyStack.length - 1) setHistoryIndex(historyIndex + 1);
  };

  // --- Playback Control & Shuffle Logic ---

  const shuffleQueue = (tracks: Track[], startTrack?: Track) => {
      let list = [...tracks];
      if (startTrack) {
          list = list.filter(t => t.id !== startTrack.id);
      }
      for (let i = list.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [list[i], list[j]] = [list[j], list[i]];
      }
      if (startTrack) list.unshift(startTrack);
      return list;
  };

  const toggleShuffle = () => {
      if (!isShuffling) {
          setOriginalQueue([...queue]); 
          const shuffled = shuffleQueue(queue, currentTrack || undefined);
          setQueue(shuffled);
          setIsShuffling(true);
      } else {
          setQueue(originalQueue);
          setIsShuffling(false);
      }
  };

  const toggleRepeat = () => {
      const modes: RepeatMode[] = ['OFF', 'ALL', 'ONE'];
      const nextIdx = (modes.indexOf(repeatMode) + 1) % modes.length;
      setRepeatMode(modes[nextIdx]);
  };

  const playTrack = async (track: Track, context: Track[] = []) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
      return;
    }
    setOriginalQueue(context);
    if (isShuffling) {
        setQueue(shuffleQueue(context, track));
    } else {
        setQueue(context);
    }
    
    setCurrentTrack(track);
    setIsPlaying(false);
    setError(null);
    
    storageService.addToRecentlyPlayed({ type: 'TRACK', data: track, timestamp: Date.now() });
    refreshLibrary();

    try {
        const streamUrl = await getStreamUrl(track.id);
        updateConnectionStatus();
        setCurrentTrack({ ...track, streamUrl });
        setIsPlaying(true);
    } catch (err: any) {
        console.error("Play error:", err);
        setError("Could not resolve stream. Trying another server...");
        updateConnectionStatus();
        setIsPlaying(false);
    }
  };

  const handleNext = () => {
      if (!currentTrack || queue.length === 0) return;
      if (repeatMode === 'ONE') {
          const t = currentTrack;
          setCurrentTrack(null);
          setTimeout(() => setCurrentTrack(t), 0);
          return;
      }
      const idx = queue.findIndex(t => t.id === currentTrack.id);
      if (idx < queue.length - 1) {
          playTrack(queue[idx + 1], queue);
      } else if (repeatMode === 'ALL') {
          playTrack(queue[0], queue);
      }
  };

  const handlePrev = () => {
      if (!currentTrack || queue.length === 0) return;
      const idx = queue.findIndex(t => t.id === currentTrack.id);
      if (idx > 0) {
          playTrack(queue[idx - 1], queue);
      } else {
          playTrack(queue[0], queue);
      }
  };

  const toggleEntitySave = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (view === ViewState.ALBUM_DETAILS && selectedEntity) {
          storageService.toggleSaveAlbum(selectedEntity);
      } else if (view === ViewState.ARTIST_DETAILS && selectedEntity) {
          storageService.toggleFollowArtist(selectedEntity);
      } else if (view === ViewState.PLAYLIST_DETAILS && selectedEntity) {
          storageService.savePlaylist(selectedEntity);
      }
      refreshLibrary();
  };

  const isEntitySaved = () => {
      if (!selectedEntity) return false;
      if (view === ViewState.ALBUM_DETAILS) return storageService.isAlbumSaved(selectedEntity.id);
      if (view === ViewState.ARTIST_DETAILS) return storageService.isArtistFollowed(selectedEntity.id);
      if (view === ViewState.PLAYLIST_DETAILS) return storageService.isPlaylistSaved(selectedEntity.uuid);
      return false;
  };

  // --- End Playback Logic ---

  const handleSearch = async (e?: React.FormEvent, override?: string) => {
    if (e) e.preventDefault();
    const query = override !== undefined ? override : searchInput;
    if (!query.trim()) return;
    
    setSearchInput(query);

    if (view !== ViewState.SEARCH || currentState.query !== query) {
        navigateTo({ view: ViewState.SEARCH, query, filter: 'ALL' });
    }

    storageService.addToHistory(query);
    refreshLibrary(); 
    
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    setResultTracks([]); setResultAlbums([]); setResultArtists([]); setResultPlaylists([]);
    
    try {
      const results = await searchAll(query);
      setResultTracks(results.tracks);
      setResultAlbums(results.albums);
      setResultArtists(results.artists);
      setResultPlaylists(results.playlists);
      updateConnectionStatus();
    } catch (err) {
      setError("Search failed. Trying next instance...");
      updateConnectionStatus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleEntityClick = async (type: 'ALBUM' | 'ARTIST' | 'PLAYLIST', item: any) => {
      setIsLoading(true);
      const loadingState = { ...item };
      try {
          let tracks: Track[] = [];
          let albums: Album[] = [];
          let viewState = ViewState.HOME;
          
          if (type === 'ALBUM') {
              viewState = ViewState.ALBUM_DETAILS;
              tracks = await getAlbumTracks(item.id);
              if (tracks.length > 0 && (item.title === 'Loading...' || !item.cover)) {
                  loadingState.title = tracks[0].album.title;
                  loadingState.cover = tracks[0].album.cover;
                  loadingState.artist = tracks[0].artist;
              }
          } else if (type === 'ARTIST') {
              viewState = ViewState.ARTIST_DETAILS;
              albums = await getArtistAlbums(item.id);
              if (albums.length > 0 && item.name === 'Loading...') {
                  loadingState.name = albums[0].artist?.name || item.name;
              }
          } else if (type === 'PLAYLIST') {
              viewState = ViewState.PLAYLIST_DETAILS;
              tracks = item.isLocal ? (item.tracks || []) : await getPlaylistTracks(item.uuid);
          }
          
          storageService.addToRecentlyPlayed({ 
            type: type as any, 
            data: loadingState, 
            timestamp: Date.now() 
          });
          refreshLibrary();

          navigateTo({ view: viewState, entity: loadingState, detailTracks: tracks, detailAlbums: albums });

      } catch (e) {
          setError("Failed to load details");
      } finally {
          setIsLoading(false);
      }
  };

  const handleArtistClick = (artistId: number | string) => {
      const dummyArtist = { id: artistId, name: 'Loading...', picture: '' };
      handleEntityClick('ARTIST', dummyArtist);
  };

  const handleAlbumClick = (albumId: number | string) => {
      const dummyAlbum = { id: albumId, title: 'Loading...', cover: '' };
      handleEntityClick('ALBUM', dummyAlbum);
  };

  const handleExportCSV = async () => {
      if (!detailTracks.length) return;
      setIsExporting(true);
      setExportProgress(0);

      const rows = [['Title', 'Artist', 'Album', 'Duration', 'Stream URL']];
      
      for (let i = 0; i < detailTracks.length; i++) {
          const t = detailTracks[i];
          let url = 'N/A';
          try {
              url = await getStreamUrl(t.id);
          } catch (e) {
              url = `Failed to resolve: ${t.id}`;
          }
          rows.push([
              `"${t.title.replace(/"/g, '""')}"`,
              `"${t.artist.name.replace(/"/g, '""')}"`,
              `"${t.album.title.replace(/"/g, '""')}"`,
              `${t.duration}`,
              url
          ]);
          setExportProgress(Math.round(((i + 1) / detailTracks.length) * 100));
      }

      const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${selectedEntity?.title || 'playlist'}_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
  };

  const handleDownloadZip = async () => {
      if (!detailTracks.length) return;
      const folderName = (selectedEntity?.title || 'album').replace(/[^a-z0-9]/gi, '_');
      setZipDownloadState({ name: folderName, progress: 0 });

      (async () => {
        try {
            const zip = new JSZip();
            const folder = zip.folder(folderName);
  
            for (let i = 0; i < detailTracks.length; i++) {
                const t = detailTracks[i];
                try {
                    const url = await getStreamUrl(t.id);
                    const blob = await downloadTrackBlob(url);
                    const ext = blob.type.includes('flac') ? 'flac' : 'm4a';
                    const filename = `${i+1}. ${t.title} - ${t.artist.name}.${ext}`.replace(/[\/\\:*?"<>|]/g, '');
                    
                    folder?.file(filename, blob);
                } catch (e) {
                    console.error(`Failed to download ${t.title}`, e);
                    folder?.file(`${i+1}. ${t.title}_ERROR.txt`, "Failed to download");
                }
                setZipDownloadState({ name: folderName, progress: Math.round(((i + 1) / detailTracks.length) * 100) });
            }
  
            const content = await zip.generateAsync({ type: "blob" });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `${folderName}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
  
        } catch (e) {
            setError("Failed to generate ZIP file.");
        } finally {
            setZipDownloadState(null);
        }
      })();
  };
  
  const handleDownloadTrack = async () => {
    if (!currentTrack) return;
    setSingleDownloadState({ name: currentTrack.title, progress: 0 });
    
    try {
        const url = await getStreamUrl(currentTrack.id);
        const blob = await downloadBlobWithProgress(url, (p) => {
             setSingleDownloadState(prev => prev ? { ...prev, progress: p } : null);
        });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const ext = blob.type === 'audio/flac' ? 'flac' : 'm4a';
        link.download = `${currentTrack.title} - ${currentTrack.artist.name}.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (e) {
        setError("Failed to download track.");
    } finally {
        setSingleDownloadState(null);
    }
  };

  const handleSaveQueueAsPlaylist = () => {
      if (queue.length === 0) return;
      const title = `Queue - ${new Date().toLocaleDateString()}`;
      const p = storageService.createPlaylist(title);
      queue.forEach(t => storageService.addTrackToPlaylist(p.uuid, t));
      refreshLibrary();
      alert(`Queue saved as playlist "${title}"`);
  };

  const MediaGrid = ({ title, items, type }: any) => {
     if (!items?.length) return null;
     return (
        <div className="mb-8 animate-fade-in">
           <h2 className="text-2xl font-bold mb-4">{title}</h2>
           <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {items.map((item: any, idx: number) => (
                 <div key={idx} onClick={() => handleEntityClick(type.toUpperCase(), item)}
                    className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] cursor-pointer group transition-colors">
                    <img src={type === 'artist' ? item.picture : (type === 'playlist' ? item.image : item.cover)} 
                         className={`w-full aspect-square object-cover shadow-lg mb-4 ${type === 'artist' && !squareAvatars ? 'rounded-full' : 'rounded-md'}`} />
                    <h3 className="font-bold truncate mb-1">{item.title || item.name}</h3>
                    <p className="text-sm text-[#b3b3b3] truncate">{type === 'album' ? item.artist.name : (type === 'playlist' ? item.creator.name : 'Artist')}</p>
                 </div>
              ))}
           </div>
        </div>
     );
  };

  const renderDetailsHeader = (type: string, title: string, subtitle: string, image: string, isSaved: boolean) => (
    <div className="flex flex-col md:flex-row gap-6 mb-8 items-center md:items-end">
        <img src={image} className={`w-48 h-48 md:w-56 md:h-56 shadow-2xl ${type === 'ARTIST' && !squareAvatars ? 'rounded-full' : 'rounded-md'}`} />
        <div className="flex flex-col gap-4 text-center md:text-left flex-1">
            <span className="text-sm font-bold uppercase tracking-wider">{type === 'LIKED_SONGS' ? 'Playlist' : type}</span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{title}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-[#b3b3b3]">
                {type !== 'ARTIST' && <span>{subtitle}</span>}
                {type === 'PLAYLIST' && <span>• {detailTracks.length} songs</span>}
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                <button 
                    onClick={() => detailTracks.length > 0 && playTrack(detailTracks[0], detailTracks)}
                    className="w-14 h-14 rounded-full bg-[#1db954] hover:scale-105 transition-transform flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: accentColor }}
                >
                    <div className="ml-1 w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-black border-b-[10px] border-b-transparent"></div>
                </button>
                {type !== 'LIKED_SONGS' && (
                    <button 
                        onClick={toggleEntitySave} 
                        className={`p-2 rounded-full border-2 transition-colors ${isSaved ? 'border-green-500 text-green-500' : 'border-[#b3b3b3] text-[#b3b3b3] hover:border-white hover:text-white'}`}
                    >
                        <Heart size={24} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                )}
                {type === 'PLAYLIST' && selectedEntity?.isLocal && (
                    <button onClick={() => setShowPlaylistEditModal(true)} className="text-[#b3b3b3] hover:text-white p-2">
                        <Pencil size={24} />
                    </button>
                )}
                {/* Export Actions */}
                <div className="flex gap-2 ml-2">
                    <button 
                        onClick={handleExportCSV} 
                        disabled={isExporting}
                        className="p-2 text-[#b3b3b3] hover:text-white disabled:opacity-50"
                        title="Export as CSV"
                    >
                        {isExporting ? <Loader2 className="animate-spin" size={24} /> : <CsvFileIcon size={24} />}
                    </button>
                    <button 
                        onClick={handleDownloadZip}
                        disabled={!!zipDownloadState}
                        className="p-2 text-[#b3b3b3] hover:text-white disabled:opacity-50"
                        title="Download as ZIP"
                    >
                        {zipDownloadState ? <Loader2 className="animate-spin" size={24} /> : <Archive size={24} />}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-black text-white" style={{ filter: grayscaleMode ? 'grayscale(100%)' : 'none' }}>
      <Sidebar 
        currentView={view} 
        onChangeView={(v) => { refreshLibrary(); navigateTo({ view: v }); }} 
        playlists={playlists}
        onPlaylistClick={(p) => handleEntityClick('PLAYLIST', p)}
        onCreatePlaylist={() => setShowImportModal(true)}
        onLikedSongsClick={() => { 
            refreshLibrary(); 
            const tracks = storageService.getLikedSongs();
            const entity = { title: 'Liked Songs', cover: 'https://misc.scdn.co/liked-songs/liked-songs-640.png', artist: { name: 'You' } };
            navigateTo({ view: ViewState.LIKED_SONGS, entity, detailTracks: tracks });
        }}
        onOpenSettings={() => { setSettingsStartTab('QUALITY'); setShowSettingsModal(true); }}
      />

      <div className="flex-1 flex flex-col relative rounded-none md:rounded-lg ml-0 md:ml-2 mt-0 md:mt-2 mr-0 md:mr-2 mb-20 md:mb-2 bg-[#121212] overflow-hidden">
        {/* Mobile Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-[56px] box-content bg-[#121212] border-t border-[#282828] flex justify-around items-center z-50 pb-safe">
             <button onClick={() => navigateTo({ view: ViewState.HOME })} className={`flex flex-col items-center ${view === ViewState.HOME ? 'text-white' : 'text-[#b3b3b3]'}`}><Home size={24}/><span className="text-[10px]">Home</span></button>
             <button onClick={() => navigateTo({ view: ViewState.SEARCH })} className={`flex flex-col items-center ${view === ViewState.SEARCH ? 'text-white' : 'text-[#b3b3b3]'}`}><Search size={24}/><span className="text-[10px]">Search</span></button>
             <button onClick={() => { refreshLibrary(); navigateTo({ view: ViewState.LIBRARY }); }} className={`flex flex-col items-center ${view === ViewState.LIBRARY ? 'text-white' : 'text-[#b3b3b3]'}`}><Library size={24}/><span className="text-[10px]">Library</span></button>
             <button onClick={() => { setSettingsStartTab('QUALITY'); setShowSettingsModal(true); }} className="flex flex-col items-center text-[#b3b3b3] hover:text-white"><Settings size={24}/><span className="text-[10px]">Settings</span></button>
        </div>

        {/* Top Bar with Dynamic Background */}
        <div className={`h-16 w-full flex items-center justify-between px-4 md:px-6 z-20 absolute top-0 transition-colors duration-300 ${isScrolled || view === ViewState.SEARCH ? (highPerformanceMode ? 'bg-[#121212]' : 'bg-[#121212]/95 backdrop-blur-md') : 'bg-transparent'}`}>
          <div className="flex gap-4 items-center w-full md:w-auto">
             <div className="hidden md:flex gap-2">
                 <button onClick={goBack} disabled={historyIndex === 0} className="bg-black/70 rounded-full p-1 disabled:opacity-30"><ChevronLeft size={22} color="white"/></button>
                 <button onClick={goForward} disabled={historyIndex === historyStack.length - 1} className="bg-black/70 rounded-full p-1 disabled:opacity-30"><ChevronRight size={22} color="white"/></button>
             </div>
             {view === ViewState.SEARCH && (
                <form onSubmit={(e) => handleSearch(e)} className="relative flex-1 md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input className="h-10 w-full rounded-full pl-10 pr-4 bg-[#242424] text-sm text-white focus:outline-none" 
                           placeholder="Songs, Artists, Albums..." 
                           value={searchInput}
                           onChange={(e) => setSearchInput(e.target.value)}
                           autoFocus />
                </form>
             )}
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Button variant="secondary" size="sm" onClick={() => window.open('https://github.com/redretep/spofree/', '_blank')} className="flex items-center gap-2">
                <Github size={16} /><span>Source Code</span>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto bg-[#121212]" ref={mainContentRef}>
            <div className="h-16"></div>
            <div className="px-4 md:px-6 pb-40">
                {error && <div className="bg-red-500/20 text-red-100 p-4 rounded mb-6 text-sm">{error}</div>}

                {view === ViewState.HOME && !isLoading && (
                    <div>
                        <h1 className="text-3xl font-bold mb-6">Good evening</h1>
                        
                        {recentlyPlayed.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold mb-4">Recently Played</h2>
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                    {recentlyPlayed.map((item, i) => (
                                        <div key={i} 
                                            onClick={() => item.type === 'TRACK' ? playTrack(item.data as Track) : handleEntityClick(item.type, item.data)}
                                            className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] cursor-pointer group transition-colors">
                                            <img src={
                                                item.type === 'TRACK' ? (item.data as Track).album.cover :
                                                item.type === 'ALBUM' ? (item.data as Album).cover :
                                                item.type === 'ARTIST' ? (item.data as Artist).picture :
                                                (item.data as Playlist).image
                                            } className={`w-full aspect-square object-cover shadow-lg mb-4 ${item.type === 'ARTIST' && !squareAvatars ? 'rounded-full' : 'rounded-md'}`} />
                                            <h3 className="font-bold truncate mb-1">{(item.data as any).title || (item.data as any).name}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Home Recommendations Sections */}
                        {homeSections.map((section, idx) => (
                            <MediaGrid 
                                key={idx}
                                title={section.title}
                                items={section.items}
                                type={section.type.toLowerCase()}
                            />
                        ))}

                        {recentlyPlayed.length === 0 && homeSections.length === 0 && (
                            <div className="text-[#b3b3b3] text-sm mt-8">Loading recommendations...</div>
                        )}
                    </div>
                )}
                
                {view === ViewState.LIBRARY && (
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <h1 className="text-3xl font-bold">Your Library</h1>
                        </div>
                        
                        {/* Library Tabs */}
                        <div className="flex gap-2 mb-6 overflow-x-auto">
                            <button onClick={() => setLibraryTab('PLAYLISTS')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${libraryTab === 'PLAYLISTS' ? 'bg-white text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#3e3e3e]'}`}>Playlists</button>
                            <button onClick={() => setLibraryTab('LIKED_SONGS')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${libraryTab === 'LIKED_SONGS' ? 'bg-white text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#3e3e3e]'}`}>Liked Songs</button>
                            <button onClick={() => setLibraryTab('ALBUMS')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${libraryTab === 'ALBUMS' ? 'bg-white text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#3e3e3e]'}`}>Albums</button>
                            <button onClick={() => setLibraryTab('ARTISTS')} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${libraryTab === 'ARTISTS' ? 'bg-white text-black' : 'bg-[#2a2a2a] text-white hover:bg-[#3e3e3e]'}`}>Artists</button>
                        </div>

                        {libraryTab === 'PLAYLISTS' && (
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                <div onClick={() => { 
                                        refreshLibrary(); 
                                        const tracks = storageService.getLikedSongs();
                                        const entity = { title: 'Liked Songs', cover: 'https://misc.scdn.co/liked-songs/liked-songs-640.png', artist: { name: 'You' } };
                                        navigateTo({ view: ViewState.LIKED_SONGS, entity, detailTracks: tracks });
                                    }}
                                    className="bg-gradient-to-br from-indigo-800 to-blue-800 p-4 rounded-md cursor-pointer aspect-square flex flex-col justify-end shadow-lg">
                                    <Heart className="text-white mb-2" size={32} fill="white" />
                                    <h3 className="font-bold text-xl">Liked Songs</h3>
                                    <p className="text-sm text-white/70">{likedSongs.length} songs</p>
                                </div>
                                
                                <div onClick={() => setShowImportModal(true)} className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] cursor-pointer aspect-square flex flex-col items-center justify-center group border-2 border-dashed border-[#282828] hover:border-[#4d4d4d] transition-colors">
                                        <div className="bg-[#282828] p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                            <Plus size={24} className="text-[#b3b3b3] group-hover:text-white" />
                                        </div>
                                        <span className="font-bold text-[#b3b3b3] group-hover:text-white">Import Playlist</span>
                                </div>

                                {playlists.map(p => (
                                    <div key={p.uuid} onClick={() => handleEntityClick('PLAYLIST', p)} className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] cursor-pointer">
                                        <img src={p.image} className="w-full aspect-square object-cover shadow-lg rounded-md mb-4" />
                                        <h3 className="font-bold truncate">{p.title}</h3>
                                        <p className="text-sm text-[#b3b3b3]">By {p.creator.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {libraryTab === 'LIKED_SONGS' && (
                             <TrackList 
                                tracks={likedSongs} 
                                onPlay={(t) => playTrack(t, likedSongs)} 
                                currentTrackId={currentTrack?.id} 
                                onArtistClick={handleArtistClick}
                                onAlbumClick={handleAlbumClick}
                                onAddToPlaylist={setTrackToAdd}
                                accentColor={accentColor}
                                compactMode={compactMode}
                            />
                        )}

                        {libraryTab === 'ALBUMS' && (
                            savedAlbums.length > 0 ? (
                                <MediaGrid title="Saved Albums" items={savedAlbums} type="album" />
                            ) : (
                                <div className="text-center text-[#b3b3b3] mt-20">
                                    <Disc size={48} className="mx-auto mb-4 opacity-50" />
                                    <h3 className="text-xl font-bold mb-2">No saved albums</h3>
                                    <p>Save albums to your library to see them here.</p>
                                </div>
                            )
                        )}

                         {libraryTab === 'ARTISTS' && (
                             followedArtists.length > 0 ? (
                                <MediaGrid title="Followed Artists" items={followedArtists} type="artist" />
                            ) : (
                                <div className="text-center text-[#b3b3b3] mt-20">
                                    <Mic2 size={48} className="mx-auto mb-4 opacity-50" />
                                    <h3 className="text-xl font-bold mb-2">No followed artists</h3>
                                    <p>Follow artists to see them here.</p>
                                </div>
                            )
                        )}
                    </div>
                )}

                {view === ViewState.SEARCH && (
                    <div>
                        {isLoading ? (
                            <div className="flex justify-center mt-20"><Loader2 className="animate-spin" size={48} /></div>
                        ) : hasSearched ? (
                            <>
                                {resultTracks.length === 0 && resultAlbums.length === 0 && resultArtists.length === 0 && (
                                    <div className="text-center text-[#b3b3b3] mt-20">No results found for "{searchHistory[0]}"</div>
                                )}
                                
                                {resultTracks.length > 0 && (
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold mb-4">Songs</h2>
                                        <TrackList 
                                            tracks={resultTracks.slice(0, 5)} 
                                            onPlay={(t) => playTrack(t, resultTracks)} 
                                            currentTrackId={currentTrack?.id} 
                                            onArtistClick={handleArtistClick}
                                            onAlbumClick={handleAlbumClick}
                                            onAddToPlaylist={setTrackToAdd}
                                            accentColor={accentColor}
                                            compactMode={compactMode}
                                        />
                                    </div>
                                )}
                                
                                <MediaGrid title="Albums" items={resultAlbums} type="album" />
                                <MediaGrid title="Artists" items={resultArtists} type="artist" />
                                <MediaGrid title="Playlists" items={resultPlaylists} type="playlist" />
                            </>
                        ) : (
                             // Recent Searches
                             searchHistory.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Recent Searches</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {searchHistory.map((q, i) => (
                                            <button key={i} onClick={() => handleSearch(undefined, q)} className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3e3e3e] rounded-full text-sm transition-colors">
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                             )
                        )}
                    </div>
                )}

                {(view === ViewState.ALBUM_DETAILS || view === ViewState.PLAYLIST_DETAILS || view === ViewState.LIKED_SONGS) && selectedEntity && (
                    <div>
                        {renderDetailsHeader(
                            view === ViewState.LIKED_SONGS ? 'LIKED_SONGS' : (view === ViewState.ALBUM_DETAILS ? 'ALBUM' : 'PLAYLIST'),
                            selectedEntity.title,
                            selectedEntity.artist?.name || selectedEntity.creator?.name || '',
                            selectedEntity.cover || selectedEntity.image,
                            isEntitySaved()
                        )}
                        <TrackList 
                            tracks={detailTracks} 
                            onPlay={(t) => playTrack(t, detailTracks)} 
                            currentTrackId={currentTrack?.id} 
                            onArtistClick={handleArtistClick}
                            onAlbumClick={handleAlbumClick}
                            onAddToPlaylist={setTrackToAdd}
                            accentColor={accentColor}
                            compactMode={compactMode}
                        />
                    </div>
                )}

                {view === ViewState.ARTIST_DETAILS && selectedEntity && (
                     <div>
                        {renderDetailsHeader(
                            'ARTIST',
                            selectedEntity.name,
                            '',
                            selectedEntity.picture,
                            isEntitySaved()
                        )}
                        <h2 className="text-2xl font-bold mb-4">Popular</h2>
                        <TrackList 
                            tracks={detailTracks} 
                            onPlay={(t) => playTrack(t, detailTracks)} 
                            currentTrackId={currentTrack?.id} 
                            onArtistClick={handleArtistClick}
                            onAlbumClick={handleAlbumClick}
                            onAddToPlaylist={setTrackToAdd}
                            accentColor={accentColor}
                            compactMode={compactMode}
                        />
                        <div className="mt-8">
                            <MediaGrid title="Albums" items={detailAlbums} type="album" />
                        </div>
                    </div>
                )}
            </div>
            </div>

            {/* Right Sidebar */}
            {rightSidebarMode && (
                <div className="w-[300px] hidden lg:block border-l border-[#282828] flex-none">
                    <RightSidebar 
                        mode={rightSidebarMode}
                        queue={queue}
                        currentTrack={currentTrack}
                        onPlay={(t) => playTrack(t, queue)}
                        onClose={() => setRightSidebarMode(null)}
                        onClearQueue={() => setQueue(currentTrack ? [currentTrack] : [])}
                        onSaveQueue={handleSaveQueueAsPlaylist}
                        accentColor={accentColor}
                    />
                </div>
            )}
        </div>
      </div>

      <Player 
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={handleNext}
        onPrev={handlePrev}
        isShuffling={isShuffling}
        repeatMode={repeatMode}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
        onArtistClick={handleArtistClick}
        onQualityClick={() => { setSettingsStartTab('QUALITY'); setShowSettingsModal(true); }}
        onDownload={handleDownloadTrack}
        accentColor={accentColor}
        showVisualizer={showVisualizer}
        showStats={showStats}
        sleepTimer={sleepTimer}
        setSleepTimer={setSleepTimer}
        highPerformanceMode={highPerformanceMode}
        disableGlow={disableGlow}
        showQueue={rightSidebarMode === 'QUEUE'}
        toggleQueue={() => setRightSidebarMode(mode => mode === 'QUEUE' ? null : 'QUEUE')}
        showLyrics={rightSidebarMode === 'LYRICS'}
        toggleLyrics={() => setRightSidebarMode(mode => mode === 'LYRICS' ? null : 'LYRICS')}
        queue={queue}
        onPlayTrack={(t) => playTrack(t, queue)}
      />

      <DownloadManager singleDownload={singleDownloadState} zipDownload={zipDownloadState} />

      {showImportModal && <ImportModal onClose={() => setShowImportModal(false)} onImport={(title, tracks) => { const p = storageService.createPlaylist(title); tracks.forEach(t => storageService.addTrackToPlaylist(p.uuid, t)); refreshLibrary(); }} />}
      {showPlaylistEditModal && selectedEntity && <PlaylistEditModal playlist={selectedEntity} onClose={() => setShowPlaylistEditModal(false)} onSave={(id, title) => { storageService.renamePlaylist(id, title); refreshLibrary(); selectedEntity.title = title; }} onDelete={(id) => { storageService.deletePlaylist(id); refreshLibrary(); navigateTo({ view: ViewState.LIBRARY }); }} />}
      {showSettingsModal && (
        <SettingsModal 
            onClose={() => setShowSettingsModal(false)} 
            defaultTab={settingsStartTab}
            quality={audioQuality} setQuality={(q) => { storageService.setQuality(q); setAudioQuality(q); }}
            accentColor={accentColor} setAccentColor={(c) => { storageService.setAccentColor(c); setAccentColor(c); }}
            showStats={showStats} setShowStats={(s) => { storageService.setShowStats(s); setShowStats(s); }}
            compactMode={compactMode} setCompactMode={(s) => { storageService.setCompactMode(s); setCompactMode(s); }}
            reducedMotion={reducedMotion} setReducedMotion={(s) => { storageService.setReducedMotion(s); setReducedMotion(s); }}
            grayscaleMode={grayscaleMode} setGrayscaleMode={(s) => { storageService.setGrayscaleMode(s); setGrayscaleMode(s); }}
            squareAvatars={squareAvatars} setSquareAvatars={(s) => { storageService.setSquareAvatars(s); setSquareAvatars(s); }}
            sleepTimer={sleepTimer} setSleepTimer={setSleepTimer}
            highPerformanceMode={highPerformanceMode} setHighPerformanceMode={(s) => { storageService.setHighPerformanceMode(s); setHighPerformanceMode(s); }}
            disableGlow={disableGlow} setDisableGlow={(s) => { storageService.setDisableGlow(s); setDisableGlow(s); }}
            updateTitle={updateTitle} setUpdateTitle={(s) => { storageService.setUpdateTitle(s); setUpdateTitle(s); }}
            showVisualizer={showVisualizer} setShowVisualizer={(s) => { storageService.setShowVisualizer(s); setShowVisualizer(s); }}
        />
      )}
      {trackToAdd && <AddToPlaylistModal track={trackToAdd} onClose={() => setTrackToAdd(null)} onCreateNew={() => setShowImportModal(true)} />}
    </div>
  );
};

export default App;
