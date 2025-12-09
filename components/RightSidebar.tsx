
import React from 'react';
import { Track } from '../types';
import { Play, Mic2, ListMusic, Trash2, Save, X } from 'lucide-react';

interface RightSidebarProps {
    mode: 'QUEUE' | 'LYRICS';
    queue: Track[];
    currentTrack: Track | null;
    onPlay: (track: Track) => void;
    onClose: () => void;
    onClearQueue: () => void;
    onSaveQueue: () => void;
    accentColor: string;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ 
    mode, queue, currentTrack, onPlay, onClose, onClearQueue, onSaveQueue, accentColor
}) => {
    
    // Find index of current track to separate "Playing" from "Next"
    const currentIndex = currentTrack ? queue.findIndex(t => t.id === currentTrack.id) : -1;
    const nextTracks = currentIndex !== -1 ? queue.slice(currentIndex + 1) : queue;

    if (mode === 'LYRICS') {
        return (
            <div className="h-full flex flex-col bg-[#121212] border-l border-[#282828]">
                <div className="p-4 flex items-center justify-between border-b border-[#282828]">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Mic2 size={20} style={{ color: accentColor }} /> 
                        Lyrics
                    </h2>
                    <button onClick={onClose}><X size={20} className="text-[#b3b3b3] hover:text-white" /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
                    {currentTrack ? (
                        <div className="flex flex-col gap-6 max-w-xs">
                             <div className="flex flex-col gap-1 mb-4">
                                <span className="text-xl font-bold text-white">{currentTrack.title}</span>
                                <span className="text-sm text-[#b3b3b3]">{currentTrack.artist.name}</span>
                            </div>

                            {/* Placeholder Lyrics */}
                            <div className="space-y-6 text-xl md:text-2xl font-bold text-white/50 leading-relaxed">
                                <p className="text-white" style={{ textShadow: `0 0 20px ${accentColor}40` }}>
                                    (Instrumental or Lyrics not available)
                                </p>
                                <p>We're still working on fetching<br/>real-time lyrics for this track.</p>
                                <p>Just enjoy the vibe<br/>for now.</p>
                                <p>♫ ♫ ♫</p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-[#b3b3b3]">Play a song to see lyrics</div>
                    )}
                </div>
            </div>
        );
    }

    // Queue Mode
    return (
        <div className="h-full flex flex-col bg-[#121212] border-l border-[#282828]">
            <div className="p-4 flex items-center justify-between border-b border-[#282828]">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <ListMusic size={20} style={{ color: accentColor }} /> 
                    Queue
                </h2>
                <div className="flex items-center gap-2">
                     <button onClick={onSaveQueue} title="Save Queue as Playlist" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Save size={18} className="text-[#b3b3b3] hover:text-white" />
                    </button>
                    <button onClick={onClearQueue} title="Clear Queue" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Trash2 size={18} className="text-[#b3b3b3] hover:text-red-400" />
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full ml-1">
                        <X size={20} className="text-[#b3b3b3] hover:text-white" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {currentTrack && (
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-[#b3b3b3] mb-3 uppercase tracking-wider">Now Playing</h3>
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5 group">
                             <div className="relative w-12 h-12 flex-shrink-0">
                                <img src={currentTrack.album.cover} className="w-full h-full rounded object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: accentColor }}></div>
                                </div>
                             </div>
                             <div className="flex-1 min-w-0">
                                 <div className="font-bold text-white truncate" style={{ color: accentColor }}>{currentTrack.title}</div>
                                 <div className="text-sm text-[#b3b3b3] truncate">{currentTrack.artist.name}</div>
                             </div>
                        </div>
                    </div>
                )}

                {nextTracks.length > 0 ? (
                    <div>
                        <h3 className="text-sm font-bold text-[#b3b3b3] mb-3 uppercase tracking-wider">Next Up</h3>
                        <div className="flex flex-col gap-1">
                            {nextTracks.map((track, i) => (
                                <div 
                                    key={`${track.id}-${i}`}
                                    onClick={() => onPlay(track)}
                                    className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-md cursor-pointer group transition-colors"
                                >
                                    <div className="relative w-10 h-10 flex-shrink-0 text-[#b3b3b3] group-hover:text-white">
                                        <img src={track.album.cover} className="w-full h-full rounded object-cover group-hover:opacity-40" />
                                        <Play size={16} className="absolute inset-0 m-auto opacity-0 group-hover:opacity-100" fill="currentColor" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-white truncate group-hover:text-white">{track.title}</div>
                                        <div className="text-xs text-[#b3b3b3] truncate">{track.artist.name}</div>
                                    </div>
                                    <span className="text-xs text-[#b3b3b3] tabular-nums">
                                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-[#b3b3b3] mt-10 text-sm">
                        Queue is empty. <br/> Play some songs to fill it up!
                    </div>
                )}
            </div>
        </div>
    );
};
