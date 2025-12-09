

import { Track, Playlist, LocalStorageData, AudioQuality, RecentlyPlayedItem, Album, Artist } from '../types';

const STORAGE_KEY = 'spofreefy_data_v1';

const getStorage = (): LocalStorageData => {
  const data = localStorage.getItem(STORAGE_KEY);
  const defaultData: LocalStorageData = { 
    likedSongs: [], 
    playlists: [], 
    savedAlbums: [],
    followedArtists: [],
    searchHistory: [],
    audioQuality: 'LOSSLESS',
    recentlyPlayed: [],
    accentColor: '#1db954',
    showVisualizer: true,
    showStats: false,
    compactMode: false,
    reducedMotion: false,
    grayscaleMode: false,
    squareAvatars: false,
    highPerformanceMode: false,
    disableGlow: false,
    updateTitle: true
  };
  
  if (!data) return defaultData;
  
  try {
      const parsed = JSON.parse(data);
      return { ...defaultData, ...parsed }; // Merge to ensure new fields exist
  } catch (e) {
      return defaultData;
  }
};

const setStorage = (data: LocalStorageData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const storageService = {
  // --- Settings ---
  getQuality: (): AudioQuality => {
      return getStorage().audioQuality;
  },

  setQuality: (quality: AudioQuality) => {
      const data = getStorage();
      data.audioQuality = quality;
      setStorage(data);
  },

  getAccentColor: (): string => {
    return getStorage().accentColor;
  },

  setAccentColor: (color: string) => {
    const data = getStorage();
    data.accentColor = color;
    setStorage(data);
  },

  getShowVisualizer: (): boolean => {
    return getStorage().showVisualizer;
  },

  setShowVisualizer: (show: boolean) => {
    const data = getStorage();
    data.showVisualizer = show;
    setStorage(data);
  },

  getShowStats: (): boolean => {
    return getStorage().showStats;
  },

  setShowStats: (show: boolean) => {
    const data = getStorage();
    data.showStats = show;
    setStorage(data);
  },

  getCompactMode: (): boolean => {
    return getStorage().compactMode;
  },

  setCompactMode: (enabled: boolean) => {
    const data = getStorage();
    data.compactMode = enabled;
    setStorage(data);
  },

  getReducedMotion: (): boolean => {
    return getStorage().reducedMotion;
  },

  setReducedMotion: (enabled: boolean) => {
    const data = getStorage();
    data.reducedMotion = enabled;
    setStorage(data);
  },

  getGrayscaleMode: (): boolean => {
    return getStorage().grayscaleMode;
  },

  setGrayscaleMode: (enabled: boolean) => {
    const data = getStorage();
    data.grayscaleMode = enabled;
    setStorage(data);
  },

  getSquareAvatars: (): boolean => {
    return getStorage().squareAvatars;
  },

  setSquareAvatars: (enabled: boolean) => {
    const data = getStorage();
    data.squareAvatars = enabled;
    setStorage(data);
  },

  getHighPerformanceMode: (): boolean => {
    return getStorage().highPerformanceMode;
  },

  setHighPerformanceMode: (enabled: boolean) => {
    const data = getStorage();
    data.highPerformanceMode = enabled;
    setStorage(data);
  },
  
  getDisableGlow: (): boolean => {
    return getStorage().disableGlow;
  },

  setDisableGlow: (enabled: boolean) => {
    const data = getStorage();
    data.disableGlow = enabled;
    setStorage(data);
  },

  getUpdateTitle: (): boolean => {
    return getStorage().updateTitle;
  },

  setUpdateTitle: (enabled: boolean) => {
    const data = getStorage();
    data.updateTitle = enabled;
    setStorage(data);
  },

  // --- Liked Songs ---
  getLikedSongs: (): Track[] => {
    return getStorage().likedSongs;
  },
  
  toggleLikeSong: (track: Track): boolean => {
    const data = getStorage();
    const exists = data.likedSongs.some(t => t.id === track.id);
    
    if (exists) {
      data.likedSongs = data.likedSongs.filter(t => t.id !== track.id);
    } else {
      data.likedSongs = [track, ...data.likedSongs];
    }
    setStorage(data);
    return !exists;
  },

  isLiked: (trackId: string | number): boolean => {
    return getStorage().likedSongs.some(t => t.id === trackId);
  },

  // --- Saved Albums ---
  getSavedAlbums: (): Album[] => {
      return getStorage().savedAlbums;
  },

  toggleSaveAlbum: (album: Album): boolean => {
      const data = getStorage();
      const exists = data.savedAlbums.some(a => a.id === album.id);
      if (exists) {
          data.savedAlbums = data.savedAlbums.filter(a => a.id !== album.id);
      } else {
          data.savedAlbums = [album, ...data.savedAlbums];
      }
      setStorage(data);
      return !exists;
  },

  isAlbumSaved: (albumId: string | number): boolean => {
      return getStorage().savedAlbums.some(a => a.id === albumId);
  },

  // --- Followed Artists ---
  getFollowedArtists: (): Artist[] => {
      return getStorage().followedArtists;
  },

  toggleFollowArtist: (artist: Artist): boolean => {
      const data = getStorage();
      const exists = data.followedArtists.some(a => a.id === artist.id);
      if (exists) {
          data.followedArtists = data.followedArtists.filter(a => a.id !== artist.id);
      } else {
          data.followedArtists = [artist, ...data.followedArtists];
      }
      setStorage(data);
      return !exists;
  },

  isArtistFollowed: (artistId: string | number): boolean => {
      return getStorage().followedArtists.some(a => a.id === artistId);
  },

  // --- Playlists ---
  getPlaylists: (): Playlist[] => {
    return getStorage().playlists;
  },

  savePlaylist: (playlist: Playlist): boolean => {
      const data = getStorage();
      const exists = data.playlists.some(p => p.uuid === playlist.uuid);
      if (exists) {
          data.playlists = data.playlists.filter(p => p.uuid !== playlist.uuid);
      } else {
          data.playlists.push({ ...playlist, isLocal: playlist.isLocal ?? false });
      }
      setStorage(data);
      return !exists;
  },

  isPlaylistSaved: (uuid: string): boolean => {
      return getStorage().playlists.some(p => p.uuid === uuid);
  },

  createPlaylist: (title: string): Playlist => {
    const data = getStorage();
    const newPlaylist: Playlist = {
      uuid: crypto.randomUUID(),
      title,
      description: '',
      image: 'https://via.placeholder.com/300?text=' + encodeURIComponent(title),
      creator: { name: 'You' },
      isLocal: true,
      tracks: []
    };
    data.playlists.push(newPlaylist);
    setStorage(data);
    return newPlaylist;
  },

  updatePlaylist: (uuid: string, updates: { title?: string, description?: string, image?: string }) => {
    const data = getStorage();
    const playlist = data.playlists.find(p => p.uuid === uuid);
    if (playlist) {
      if (updates.title !== undefined) playlist.title = updates.title;
      if (updates.description !== undefined) playlist.description = updates.description;
      if (updates.image !== undefined) playlist.image = updates.image;
      setStorage(data);
    }
  },

  updatePlaylistTracks: (uuid: string, tracks: Track[]) => {
      const data = getStorage();
      const playlist = data.playlists.find(p => p.uuid === uuid);
      if (playlist) {
          playlist.tracks = tracks;
          // Update cover if needed and not custom
          if (playlist.image.includes('placeholder') && tracks.length > 0) {
               playlist.image = tracks[0].album.cover;
          }
          setStorage(data);
      }
  },

  renamePlaylist: (uuid: string, newTitle: string) => {
    // Deprecated wrapper, use updatePlaylist
    const data = getStorage();
    const playlist = data.playlists.find(p => p.uuid === uuid);
    if (playlist) {
      playlist.title = newTitle;
      setStorage(data);
    }
  },

  deletePlaylist: (uuid: string) => {
    const data = getStorage();
    data.playlists = data.playlists.filter(p => p.uuid !== uuid);
    setStorage(data);
  },

  addTrackToPlaylist: (playlistUuid: string, track: Track) => {
    const data = getStorage();
    const playlist = data.playlists.find(p => p.uuid === playlistUuid);
    if (playlist) {
      if (!playlist.tracks) playlist.tracks = [];
      if (!playlist.tracks.some(t => t.id === track.id)) {
        playlist.tracks.push(track);
        if (playlist.image.includes('placeholder') && track.album.cover) {
            playlist.image = track.album.cover;
        }
        setStorage(data);
      }
    }
  },

  // --- Search History ---
  getHistory: (): string[] => {
    return getStorage().searchHistory;
  },

  addToHistory: (query: string) => {
    const data = getStorage();
    const filtered = data.searchHistory.filter(q => q.toLowerCase() !== query.toLowerCase());
    data.searchHistory = [query, ...filtered].slice(0, 10);
    setStorage(data);
  },

  // --- Recently Played ---
  getRecentlyPlayed: (): RecentlyPlayedItem[] => {
      return getStorage().recentlyPlayed;
  },

  addToRecentlyPlayed: (item: RecentlyPlayedItem) => {
      const data = getStorage();
      const filtered = data.recentlyPlayed.filter(i => {
          const existingId = (i.data as any).id || (i.data as any).uuid;
          const newId = (item.data as any).id || (item.data as any).uuid;
          return existingId !== newId;
      });
      data.recentlyPlayed = [item, ...filtered].slice(0, 20); // Keep last 20
      setStorage(data);
  }
};