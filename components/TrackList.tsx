
import React from 'react';
import { Track } from '../types';
import { Clock3, Play, Heart, Plus } from 'lucide-react';
import { storageService } from '../services/storageService';

interface TrackListProps {
  tracks: Track[];
  onPlay: (track: Track) => void;
  currentTrackId?: number | string;
  onArtistClick?: (artistId: number | string) => void;
  onAlbumClick?: (albumId: number | string) => void;
  onAddToPlaylist?: (track: Track) => void;
  accentColor?: string;
  compactMode?: boolean;
  hideHeader?: boolean;
}

export const TrackList: React.FC<TrackListProps> = ({ 
    tracks, onPlay, currentTrackId, onArtistClick, onAlbumClick, onAddToPlaylist,
    accentColor = '#1db954', compactMode = false, hideHeader = false
}) => {
  if (!tracks || tracks.length === 0) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleLike = (e: React.MouseEvent, track: Track) => {
      e.stopPropagation();
      storageService.toggleLikeSong(track);
  };

  const handleAddPlaylist = (e: React.MouseEvent, track: Track) => {
      e.stopPropagation();
      if (onAddToPlaylist) onAddToPlaylist(track);
  };

  return (
    <div className="w-full">
      {/* Header */}
      {!hideHeader && (
          <div className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[16px_4fr_3fr_minmax(80px,auto)] gap-3 sm:gap-4 px-3 sm:px-4 py-2 border-b border-[#282828] text-[#b3b3b3] text-sm uppercase tracking-wider sticky top-16 bg-[#121212] z-10">
            <div className="text-center w-6">#</div>
            <div>Title</div>
            <div className="hidden sm:block">Album</div>
            <div className="text-right flex justify-end"><Clock3 size={16} /></div>
          </div>
      )}

      {/* Rows */}
      <div className="mt-2 flex flex-col pb-2">
        {tracks.map((track, index) => {
            const isCurrent = currentTrackId === track.id;
            return (
                <div 
                    key={track.id} 
                    onClick={() => onPlay(track)}
                    className={`grid grid-cols-[auto_1fr_auto] sm:grid-cols-[16px_4fr_3fr_minmax(80px,auto)] gap-3 sm:gap-4 px-2 sm:px-4 ${compactMode ? 'py-1' : 'py-2'} rounded-md hover:bg-white/10 group cursor-pointer transition-colors items-center ${isCurrent ? 'bg-white/10' : ''}`}
                >
                    <div className="text-center w-6 text-[#b3b3b3] group-hover:text-white relative flex justify-center items-center h-4">
                        <span 
                            className="group-hover:hidden" 
                            style={isCurrent ? { color: accentColor } : {}}
                        >
                            {index + 1}
                        </span>
                        <Play size={12} fill="white" className="hidden group-hover:block absolute" />
                    </div>
                    
                    <div className="flex items-center gap-3 overflow-hidden">
                        {!compactMode && <img src={track.album.cover} alt="" className="h-10 w-10 rounded shadow flex-shrink-0" />}
                        <div className="flex flex-col overflow-hidden min-w-0">
                            <span 
                                className={`truncate font-medium ${isCurrent ? '' : 'text-white'}`}
                                style={isCurrent ? { color: accentColor } : {}}
                            >
                                {track.title}
                            </span>
                            <span 
                                className="truncate text-xs sm:text-sm text-[#b3b3b3] group-hover:text-white hover:underline cursor-pointer"
                                style={isCurrent ? { color: accentColor, opacity: 0.8 } : {}}
                                onClick={(e) => {
                                    if (onArtistClick) {
                                        e.stopPropagation();
                                        onArtistClick(track.artist.id);
                                    }
                                }}
                            >
                                {track.artist.name}
                            </span>
                        </div>
                    </div>

                    <div 
                        className="text-sm text-[#b3b3b3] group-hover:text-white truncate hidden sm:block hover:underline cursor-pointer"
                        style={isCurrent ? { color: accentColor, opacity: 0.8 } : {}}
                        onClick={(e) => {
                            if (onAlbumClick) {
                                e.stopPropagation();
                                onAlbumClick(track.album.id);
                            }
                        }}
                    >
                        {track.album.title}
                    </div>

                    <div className="flex items-center justify-end gap-3 text-xs sm:text-sm text-[#b3b3b3] group-hover:text-white tabular-nums">
                        <button 
                            className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity hidden sm:block"
                            onClick={(e) => handleAddPlaylist(e, track)}
                            title="Add to Playlist"
                        >
                            <Plus size={16} />
                        </button>
                        <button 
                            className="opacity-0 group-hover:opacity-100 hover:text-green-500 transition-opacity hidden sm:block"
                            onClick={(e) => handleLike(e, track)}
                            title="Save to Liked Songs"
                        >
                            <Heart size={16} />
                        </button>
                        {formatDuration(track.duration)}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};
