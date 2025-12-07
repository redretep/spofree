import { Track, Playlist, LocalStorageData } from '../types';

const STORAGE_KEY = 'spofreefy_data_v1';

const getStorage = (): LocalStorageData => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return { likedSongs: [], playlists: [], searchHistory: [] };
  }
  return JSON.parse(data);
};

const setStorage = (data: LocalStorageData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const storageService = {
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
    return !exists; // Returns true if liked, false if unliked
  },

  isLiked: (trackId: string | number): boolean => {
    return getStorage().likedSongs.some(t => t.id === trackId);
  },

  // --- Playlists ---
  getPlaylists: (): Playlist[] => {
    return getStorage().playlists;
  },

  createPlaylist: (title: string): Playlist => {
    const data = getStorage();
    const newPlaylist: Playlist = {
      uuid: crypto.randomUUID(),
      title,
      image: 'https://via.placeholder.com/300?text=' + encodeURIComponent(title),
      creator: { name: 'You' },
      isLocal: true,
      tracks: []
    };
    data.playlists.push(newPlaylist);
    setStorage(data);
    return newPlaylist;
  },

  renamePlaylist: (uuid: string, newTitle: string) => {
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
      // Avoid duplicates
      if (!playlist.tracks.some(t => t.id === track.id)) {
        playlist.tracks.push(track);
        // Update cover image to first track's cover if generic
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
    // Remove if exists to move to top
    const filtered = data.searchHistory.filter(q => q.toLowerCase() !== query.toLowerCase());
    data.searchHistory = [query, ...filtered].slice(0, 10); // Keep last 10
    setStorage(data);
  }
};
