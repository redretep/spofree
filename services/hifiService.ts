
import { API_INSTANCES } from '../constants';
import { SearchResult, Track, Album, Artist, Playlist, LyricsLine } from '../types';

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
  // Look for standard audio file extensions or tokens
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
    if (Array.isArray(root.items)) return root.items;
    if (Array.isArray(root)) return root;

    return [];
};

const parseTrack = (item: any): Track => ({
  id: item.id,
  title: item.title,
  artist: { 
    id: item.artist?.id || item.artists?.[0]?.id || 0, 
    name: item.artist?.name || item.artists?.[0]?.name || 'Unknown Artist', 
    picture: getTidalImage(item.artist?.picture, 'artist')
  },
  album: { 
    id: item.album?.id || 0, 
    title: item.album?.title || 'Unknown Album', 
    cover: getTidalImage(item.album?.cover)
  },
  duration: item.duration,
  quality: item.audioQuality || 'LOSSLESS'
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
    const albums = albumsRaw.map((item: any) => ({
        id: item.id,
        title: item.title,
        cover: getTidalImage(item.cover),
        artist: { 
            id: item.artist?.id || 0,
            name: item.artist?.name || 'Unknown' 
        },
        releaseDate: item.releaseDate
    })).filter((a: any) => a.id && a.title);

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
  // Prioritize LOSSLESS/HIGH because HI_RES often returns unplayable DASH segments
  const qualities = ['LOSSLESS', 'HIGH', 'LOW', 'HI_RES']; 
  const TIMEOUT = 15000; 

  for (const quality of qualities) {
      try {
          const response = await fetchWithFailover(`/track/?id=${trackId}&quality=${quality}`, {}, TIMEOUT);
          if (!response.ok) continue;

          const json = await response.json();
          
          // Flatten items
          let items: any[] = [];
          if (json.data) items = [json.data]; // V2 structure
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
                      // Fix base64 padding/chars
                      const base64 = item.manifest.replace(/-/g, '+').replace(/_/g, '/');
                      const decoded = atob(base64);
                      
                      // Skip segmented DASH manifests (often unplayable)
                      if (decoded.includes('SegmentTemplate') && !decoded.includes('BaseURL')) continue;

                      const url = extractUrlFromManifest(decoded);
                      if (url) {
                          console.log(`[Stream] Decoded manifest (${quality})`);
                          return url;
                      }
                  } catch (e) {
                      // Try raw
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
        // Use Feed endpoint to get full discography
        const response = await fetchWithFailover(`/artist/?f=${artistId}`);
        if (!response.ok) return [];
        const json = await response.json();

        // Recursively find tracks
        const tracks: Track[] = [];
        const scan = (obj: any) => {
            if (!obj) return;
            if (Array.isArray(obj)) obj.forEach(scan);
            else if (typeof obj === 'object') {
                if (obj.id && obj.title && obj.duration && obj.audioQuality) {
                    tracks.push(parseTrack(obj));
                }
                // Recurse known containers
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

export const getLyrics = async (trackId: string | number): Promise<LyricsLine[]> => {
    try {
        const response = await fetchWithFailover(`/lyrics/?id=${trackId}`, {}, 5000);
        if (!response.ok) return [];
        const json = await response.json();
        const data = Array.isArray(json) ? json[0] : json;
        if (!data?.lyrics) return [];
        
        if (data.subtitles) {
            return data.subtitles.split('\n').map((line: string) => {
                const m = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
                return m ? { time: parseInt(m[1]) * 60 + parseFloat(m[2]), text: m[3].trim() } : null;
            }).filter(Boolean);
        }
        return [{ time: 0, text: data.lyrics }];
    } catch (e) { return []; }
};

export const downloadTrackBlob = async (url: string): Promise<Blob> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Download failed");
    return await response.blob();
};
