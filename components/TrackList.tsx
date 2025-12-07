
import React from 'react';
import { Track } from '../types';
import { Clock3, Play, Heart } from 'lucide-react';
import { storageService } from '../services/storageService';

interface TrackListProps {
  tracks: Track[];
  onPlay: (track: Track) => void;
  currentTrackId?: number | string;
}

export const TrackList: React.FC<TrackListProps> = ({ tracks, onPlay, currentTrackId }) => {
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

  return (
    <div className="w-full">
      {/* Header */}
      <div className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[16px_4fr_3fr_minmax(60px,1fr)] gap-3 sm:gap-4 px-3 sm:px-4 py-2 border-b border-[#282828] text-[#b3b3b3] text-sm uppercase tracking-wider sticky top-16 bg-[#121212] z-10">
        <div className="text-center w-6">#</div>
        <div>Title</div>
        <div className="hidden sm:block">Album</div>
        <div className="text-right flex justify-end"><Clock3 size={16} /></div>
      </div>

      {/* Rows */}
      <div className="mt-2 flex flex-col pb-2">
        {tracks.map((track, index) => {
            const isCurrent = currentTrackId === track.id;
            return (
                <div 
                    key={track.id} 
                    onClick={() => onPlay(track)}
                    className={`grid grid-cols-[auto_1fr_auto] sm:grid-cols-[16px_4fr_3fr_minmax(60px,1fr)] gap-3 sm:gap-4 px-2 sm:px-4 py-2 rounded-md hover:bg-white/10 group cursor-pointer transition-colors items-center ${isCurrent ? 'bg-white/10' : ''}`}
                >
                    <div className="text-center w-6 text-[#b3b3b3] group-hover:text-white relative flex justify-center items-center h-4">
                        <span className={`group-hover:hidden ${isCurrent ? 'text-[#1db954]' : ''}`}>{index + 1}</span>
                        <Play size={12} fill="white" className="hidden group-hover:block absolute" />
                    </div>
                    
                    <div className="flex items-center gap-3 overflow-hidden">
                        <img src={track.album.cover} alt="" className="h-10 w-10 rounded shadow flex-shrink-0" />
                        <div className="flex flex-col overflow-hidden min-w-0">
                            <span className={`truncate font-medium ${isCurrent ? 'text-[#1db954]' : 'text-white'}`}>
                                {track.title}
                            </span>
                            <span className="truncate text-xs sm:text-sm text-[#b3b3b3] group-hover:text-white">
                                {track.artist.name}
                            </span>
                        </div>
                    </div>

                    <div className="text-sm text-[#b3b3b3] group-hover:text-white truncate hidden sm:block">
                        {track.album.title}
                    </div>

                    <div className="flex items-center justify-end gap-3 text-xs sm:text-sm text-[#b3b3b3] group-hover:text-white tabular-nums">
                        <button 
                            className="opacity-0 group-hover:opacity-100 hover:text-green-500 transition-opacity hidden sm:block"
                            onClick={(e) => handleLike(e, track)}
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
