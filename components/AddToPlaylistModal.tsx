
import React, { useState, useEffect } from 'react';
import { X, Plus, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { Track, Playlist } from '../types';
import { storageService } from '../services/storageService';

interface AddToPlaylistModalProps {
    track: Track;
    onClose: () => void;
    onCreateNew: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ track, onClose, onCreateNew }) => {
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const all = storageService.getPlaylists();
        setPlaylists(all);
        const map: Record<string, boolean> = {};
        all.forEach(p => {
            if (p.tracks?.some(t => t.id === track.id)) {
                map[p.uuid] = true;
            }
        });
        setAddedMap(map);
    }, [track]);

    const handleToggle = (playlist: Playlist) => {
        if (addedMap[playlist.uuid]) return; // Already added
        storageService.addTrackToPlaylist(playlist.uuid, track);
        setAddedMap(prev => ({ ...prev, [playlist.uuid]: true }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#282828] rounded-lg shadow-xl w-full max-w-sm p-6 flex flex-col gap-4 max-h-[80vh]">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Add to Playlist</h2>
                    <button onClick={onClose}><X /></button>
                </div>

                <div className="flex flex-col gap-1 overflow-y-auto min-h-[200px]">
                    <button 
                        onClick={() => { onClose(); onCreateNew(); }}
                        className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-md text-left group"
                    >
                        <div className="w-10 h-10 bg-white/10 flex items-center justify-center rounded group-hover:bg-white/20">
                            <Plus size={20} />
                        </div>
                        <span className="font-bold">New Playlist</span>
                    </button>
                    
                    <div className="h-px bg-white/10 my-2"></div>

                    {playlists.map(p => (
                        <button 
                            key={p.uuid}
                            onClick={() => handleToggle(p)}
                            disabled={addedMap[p.uuid]}
                            className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-md text-left transition-colors"
                        >
                            <img src={p.image} className="w-10 h-10 rounded object-cover" />
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <span className={`font-medium truncate ${addedMap[p.uuid] ? 'text-green-500' : 'text-white'}`}>
                                    {p.title}
                                </span>
                                <span className="text-xs text-[#b3b3b3]">{p.tracks?.length || 0} songs</span>
                            </div>
                            {addedMap[p.uuid] && <CheckCircle size={18} className="text-green-500" />}
                        </button>
                    ))}
                    
                    {playlists.length === 0 && (
                        <div className="text-center text-[#b3b3b3] py-4 text-sm">No playlists found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
