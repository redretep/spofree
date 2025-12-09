

import { API_INSTANCES } from '../constants';
import { SearchResult, Track, Album, Artist, Playlist, AudioQuality } from '../types';
import { storageService } from './storageService';

let currentInstanceIndex = 0;

export const getCurrentApiUrl = () => API_INSTANCES[currentInstanceIndex];

const rotateInstance = () => {
  currentInstanceIndex = (currentInstanceIndex + 1) % API_INSTANCES.length;
  console.warn(`[Failover] Switching to ${API_INSTANCES[currentInstanceIndex]}`);
};

const fetchWithFailover = async (endpoint: string, options?: RequestInit, timeoutMs: number = 10000): Promise<Response> => {
  const maxRetries = API_INSTANCES.length;
  let attempts = 0;

  while (attempts < maxRetries) {
    const baseUrl = API_INSTANCES[currentInstanceIndex];
    const url = `${baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.status === 429 || response.status >= 500) {
         rotateInstance();
         attempts++;
         continue;
      }
      return response;
    } catch (err: any) {
      clearTimeout(timeoutId);
      rotateInstance(); 
      attempts++;
    }
  }
  throw new Error("All API instances failed.");
};

// --- Helpers ---

const getTidalImage = (uuid: string | undefined, type: 'cover' | 'artist' | 'playlist' = 'cover'): string => {
    if (!uuid) return 'https://via.placeholder.com/300?text=No+Image';
    const path = uuid.replace(/-/g, '/');
    const size = type === 'artist' ? '320x320' : type === 'playlist' ? '480x320' : '640x640';
    return `https://resources.tidal.com/images/${path}/${size}.jpg`;
};

const enforceHttps = (url: string): string => {
    if (!url) return '';
    return url.replace(/^http:/, 'https:');
};

const extractUrlFromManifest = (manifestText: string): string | null => {
  if (!manifestText) return null;
  const text = manifestText.trim();

  // 1. Try JSON parsing (Standard for Hifi)
  if (text.startsWith('{') || text.startsWith('[')) {
      try {
          const json = JSON.parse(text);
          // Hifi V2 standard
          if (json.urls && Array.isArray(json.urls) && json.urls.length > 0) return enforceHttps(json.urls[0]);
          if (json.url) return enforceHttps(json.url);
      } catch (e) { /* Ignore */ }
  }

  // 2. XML/Regex Fallback (Simple Regex)
  const match = text.match(/(https?:\/\/[^\s"<>]+(?:\.flac|\.mp4|\.m4a|\?token=)[^\s"<>]*)/);
  if (match && match[1]) {
      const cleanUrl = match[1].replace(/&amp;/g, '&');
      return enforceHttps(cleanUrl);
  }

  return null;
};

// --- Parsers ---

const extractItems = (data: any, key?: string): any[] => {
    if (!data) return [];
    
    // V2 wrapper
    const root = data.data || data;

    // Specific key check (e.g. albums.items)
    if (key && root[key] && (Array.isArray(root[key].items) || Array.isArray(root[key]))) {
         return Array.isArray(root[key].items) ? root[key].items : root[key];
    }
    
    // Generic items check
    if (root && Array.isArray(root.items)) return root.items;
    if (Array.isArray(root)) return root;

    return [];
};

const resolveArtistName = (item: any): string => {
    if (item.artist?.name) return item.artist.name;
    if (item.artists?.[0]?.name) return item.artists[0].name;
    if (item.creator?.name) return item.creator.name; // Playlists
    if (item.mainArtist?.name) return item.mainArtist.name;
    if (item.album?.artist?.name) return item.album.artist.name; // Album artist fallback
    if (item.mix?.artist?.name) return item.mix.artist.name; // Mixes
    return 'Unknown Artist';
};

const resolveArtistId = (item: any): number | string => {
    if (item.artist?.id) return item.artist.id;
    if (item.artists?.[0]?.id) return item.artists[0].id;
    if (item.album?.artist?.id) return item.album.artist.id;
    return 0;
};

const parseTrack = (item: any): Track => ({
  id: item.id,
  title: item.title || 'Unknown Title',
  artist: { 
    id: resolveArtistId(item),
    name: resolveArtistName(item),
    picture: getTidalImage(item.artist?.picture || item.artists?.[0]?.picture, 'artist')
  },
  album: { 
    id: item.album?.id || 0, 
    title: item.album?.title || 'Unknown Album', 
    cover: getTidalImage(item.album?.cover)
  },
  duration: item.duration || 0,
  quality: item.audioQuality || 'LOSSLESS'
});

const parseAlbum = (item: any): Album => ({
    id: item.id,
    title: item.title || 'Unknown Album',
    cover: getTidalImage(item.cover),
    artist: { 
        id: resolveArtistId(item),
        name: resolveArtistName(item)
    },
    releaseDate: item.releaseDate
});

// --- Public API ---

export const searchAll = async (query: string): Promise<SearchResult> => {
  if (!query || !query.trim()) return { tracks: [], albums: [], artists: [], playlists: [] };

  const encoded = encodeURIComponent(query.trim());
  const TIMEOUT = 5000; 

  try {
    const [tracksRes, albumsRes, artistsRes, playlistsRes] = await Promise.allSettled([
        fetchWithFailover(`/search/?s=${encoded}`, {}, TIMEOUT).then(r => r.ok ? r.json() : null),
        fetchWithFailover(`/search/?al=${encoded}`, {}, TIMEOUT).then(r => r.ok ? r.json() : null),
        fetchWithFailover(`/search/?a=${encoded}`, {}, TIMEOUT).then(r => r.ok ? r.json() : null),
        fetchWithFailover(`/search/?p=${encoded}`, {}, TIMEOUT).then(r => r.ok ? r.json() : null)
    ]);

    // Tracks
    const tracksRaw = tracksRes.status === 'fulfilled' ? extractItems(tracksRes.value, 'tracks') : [];
    const tracks = tracksRaw.map(parseTrack).filter(t => t.id && t.title);

    // Albums
    const albumsRaw = albumsRes.status === 'fulfilled' ? extractItems(albumsRes.value, 'albums') : [];
    const albums = albumsRaw.map(parseAlbum).filter(a => a.id && a.title);

    // Artists
    const artistsRaw = artistsRes.status === 'fulfilled' ? extractItems(artistsRes.value, 'artists') : [];
    const artistMap = new Map();
    artistsRaw.forEach((item: any) => {
        if (item.id && item.name && !item.album && !artistMap.has(item.id)) {
            artistMap.set(item.id, {
                id: item.id,
                name: item.name,
                picture: getTidalImage(item.picture, 'artist'),
                type: item.type || 'MAIN'
            });
        }
    });
    const artists = Array.from(artistMap.values());

    // Playlists
    const playlistsRaw = playlistsRes.status === 'fulfilled' ? extractItems(playlistsRes.value, 'playlists') : [];
    const playlists = playlistsRaw.map((item: any) => ({
        uuid: item.uuid,
        title: item.title,
        image: getTidalImage(item.squareImage || item.image, 'cover'),
        creator: { name: item.creator?.name || 'Unknown' }
    })).filter((p: any) => p.uuid && p.title);

    return { tracks, albums, artists, playlists };

  } catch (error) {
    console.error("Search failed:", error);
    return { tracks: [], albums: [], artists: [], playlists: [] };
  }
};

export const getStreamUrl = async (trackId: string | number): Promise<string> => {
  // Get preferred quality from storage
  const preferredQuality = storageService.getQuality();
  
  // Create priority list based on preference
  const qualities: AudioQuality[] = [preferredQuality];
  
  // Add others as fallback
  ['LOSSLESS', 'HIGH', 'LOW', 'HI_RES'].forEach(q => {
      if (q !== preferredQuality) qualities.push(q as AudioQuality);
  });

  const TIMEOUT = 15000; 

  for (const quality of qualities) {
      try {
          const response = await fetchWithFailover(`/track/?id=${trackId}&quality=${quality}`, {}, TIMEOUT);
          if (!response.ok) continue;

          const json = await response.json();
          
          let items: any[] = [];
          if (json.data) items = [json.data]; 
          else if (Array.isArray(json)) items = json;
          else items = [json];

          // 1. Direct URL check
          for (const item of items) {
              const directUrl = item.OriginalTrackUrl || item.originalTrackUrl || item.url;
              if (directUrl && directUrl.startsWith('http')) {
                  console.log(`[Stream] Found direct URL (${quality})`);
                  return enforceHttps(directUrl);
              }
          }

          // 2. Manifest check
          for (const item of items) {
              if (item.manifest) {
                  try {
                      const base64 = item.manifest.replace(/-/g, '+').replace(/_/g, '/');
                      const decoded = atob(base64);
                      
                      if (decoded.includes('SegmentTemplate') && !decoded.includes('BaseURL')) continue;

                      const url = extractUrlFromManifest(decoded);
                      if (url) {
                          console.log(`[Stream] Decoded manifest (${quality})`);
                          return url;
                      }
                  } catch (e) {
                      const url = extractUrlFromManifest(item.manifest);
                      if (url) return url;
                  }
              }
          }
      } catch (e) { }
  }

  throw new Error("Failed to resolve a playable stream URL.");
};

export const getAlbumTracks = async (albumId: string | number): Promise<Track[]> => {
    try {
        const response = await fetchWithFailover(`/album/?id=${albumId}`);
        if (!response.ok) return [];
        const json = await response.json();
        const items = extractItems(json, 'items');
        return items.map(i => i.item ? parseTrack(i.item) : parseTrack(i)).filter(t => t.id && t.title);
    } catch (e) { return []; }
};

export const getPlaylistTracks = async (uuid: string): Promise<Track[]> => {
    try {
        const response = await fetchWithFailover(`/playlist/?id=${uuid}`);
        if (!response.ok) return [];
        const json = await response.json();
        const items = extractItems(json, 'items');
        return items.map(i => i.item ? parseTrack(i.item) : parseTrack(i)).filter(t => t.id && t.title);
    } catch (e) { return []; }
};

export const getArtistTopTracks = async (artistId: string | number): Promise<Track[]> => {
    try {
        const response = await fetchWithFailover(`/artist/?f=${artistId}`);
        if (!response.ok) return [];
        const json = await response.json();

        const tracks: Track[] = [];
        const scan = (obj: any) => {
            if (!obj) return;
            if (Array.isArray(obj)) obj.forEach(scan);
            else if (typeof obj === 'object') {
                if (obj.id && obj.title && obj.duration && obj.audioQuality) {
                    tracks.push(parseTrack(obj));
                }
                if (obj.items) scan(obj.items);
                else Object.values(obj).forEach(val => {
                    if (typeof val === 'object') scan(val);
                });
            }
        };
        scan(json);

        const unique = new Map();
        tracks.forEach(t => unique.set(t.id, t));
        return Array.from(unique.values()).slice(0, 50);
    } catch (e) { return []; }
};

export const getArtistAlbums = async (artistId: string | number): Promise<Album[]> => {
    try {
        const response = await fetchWithFailover(`/artist/?f=${artistId}`);
        if (!response.ok) return [];
        const json = await response.json();

        const albums: Album[] = [];
        const scan = (obj: any) => {
            if (!obj) return;
            if (Array.isArray(obj)) obj.forEach(scan);
            else if (typeof obj === 'object') {
                // Heuristic to detect albums in the feed (often don't have audioQuality but have cover and title)
                if (obj.id && obj.title && obj.cover && !obj.duration) {
                    albums.push(parseAlbum(obj));
                }
                if (obj.items) scan(obj.items);
                else Object.values(obj).forEach(val => {
                    if (typeof val === 'object') scan(val);
                });
            }
        };
        scan(json);

        const unique = new Map();
        albums.forEach(a => unique.set(a.id, a));
        return Array.from(unique.values()).slice(0, 50);
    } catch (e) { return []; }
};

export const downloadTrackBlob = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Download failed");
    return await response.blob();
};

export const downloadBlobWithProgress = async (url: string, onProgress: (percent: number) => void): Promise<Blob> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Download failed");
    
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    let loaded = 0;

    const reader = response.body?.getReader();
    if (!reader) {
        // Fallback if no reader
        const blob = await response.blob();
        onProgress(100);
        return blob;
    }

    const chunks = [];
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        if (total) {
            onProgress(Math.min(Math.round((loaded / total) * 100), 100));
        }
    }
    
    return new Blob(chunks, { type: response.headers.get('content-type') || 'audio/mpeg' });
};
