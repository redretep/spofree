

import React, { useState, useRef } from 'react';
import { X, Trash2, Save, GripVertical, Image as ImageIcon, Upload } from 'lucide-react';
import { Button } from './Button';
import { Playlist, Track } from '../types';

interface PlaylistEditModalProps {
    playlist: Playlist;
    onClose: () => void;
    onSave: (uuid: string, updates: { title: string, description: string, image: string }, tracks: Track[]) => void;
    onDelete: (uuid: string) => void;
}

export const PlaylistEditModal: React.FC<PlaylistEditModalProps> = ({ playlist, onClose, onSave, onDelete }) => {
    // Metadata State
    const [title, setTitle] = useState(playlist.title);
    const [description, setDescription] = useState(playlist.description || '');
    const [image, setImage] = useState(playlist.image);
    const [showUrlInput, setShowUrlInput] = useState(false);
    
    // Tracks State
    const [tracks, setTracks] = useState<Track[]>(playlist.tracks || []);
    
    // Drag and Drop State
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleSort = () => {
        if (dragItem.current === null || dragOverItem.current === null) return;
        
        const _tracks = [...tracks];
        const draggedItemContent = _tracks[dragItem.current];
        
        _tracks.splice(dragItem.current, 1);
        _tracks.splice(dragOverItem.current, 0, draggedItemContent);
        
        dragItem.current = dragOverItem.current;
        dragOverItem.current = null;
        
        setTracks(_tracks);
    };

    const handleRemoveTrack = (index: number) => {
        const newTracks = [...tracks];
        newTracks.splice(index, 1);
        setTracks(newTracks);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check size (Limit to ~1MB to allow for localStorage overhead)
            if (file.size > 1024 * 1024) {
                alert("Image is too large. Please use an image under 1MB or use a URL.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-[#121212] rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col border border-[#282828] overflow-hidden">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-[#282828] bg-[#181818]">
                    <h2 className="text-xl font-bold">Edit Playlist</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-8 mb-10">
                        {/* Image Section */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="group relative w-48 h-48 md:w-64 md:h-64 shadow-2xl rounded-lg overflow-hidden bg-[#282828]">
                                <img src={image} className="w-full h-full object-cover" alt="Playlist Cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity gap-2">
                                    <label className="cursor-pointer flex flex-col items-center gap-2 hover:text-white text-[#b3b3b3] transition-colors">
                                        <Upload size={32} />
                                        <span className="text-sm font-bold">Upload Photo</span>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                    <div className="w-2/3 h-px bg-white/20 my-2"></div>
                                    <button onClick={() => setShowUrlInput(!showUrlInput)} className="flex items-center gap-2 hover:text-white text-[#b3b3b3]">
                                        <ImageIcon size={20} />
                                        <span className="text-sm font-bold">Paste URL</span>
                                    </button>
                                </div>
                            </div>
                            {showUrlInput && (
                                <input 
                                    className="w-48 md:w-64 bg-[#282828] border border-[#3e3e3e] rounded px-3 py-2 text-sm focus:outline-none focus:border-white transition-colors"
                                    placeholder="https://..."
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                />
                            )}
                        </div>

                        {/* Text Inputs */}
                        <div className="flex-1 flex flex-col gap-4 justify-end">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase text-[#b3b3b3]">Name</label>
                                <input 
                                    className="bg-transparent text-3xl md:text-5xl font-bold placeholder-[#535353] focus:outline-none border-b border-transparent focus:border-[#3e3e3e] pb-2 transition-colors"
                                    placeholder="Playlist Name"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-xs font-bold uppercase text-[#b3b3b3]">Description</label>
                                <textarea 
                                    className="bg-[#282828] w-full h-full min-h-[100px] rounded-md p-3 text-sm placeholder-[#535353] focus:outline-none focus:ring-1 focus:ring-white/20 resize-none"
                                    placeholder="Add an optional description"
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Track List */}
                    <div className="mb-4 flex items-center justify-between">
                         <h3 className="text-lg font-bold">Tracks ({tracks.length})</h3>
                         <span className="text-xs text-[#b3b3b3] uppercase tracking-widest">Drag to reorder</span>
                    </div>
                    
                    <div className="flex flex-col bg-[#181818] rounded-lg border border-[#282828] overflow-hidden">
                        {tracks.length === 0 ? (
                            <div className="p-8 text-center text-[#b3b3b3]">No tracks in this playlist.</div>
                        ) : (
                            tracks.map((track, index) => (
                                <div 
                                    key={`${track.id}-${index}`}
                                    className="group flex items-center gap-4 p-3 hover:bg-white/5 border-b border-[#282828] last:border-0 transition-colors"
                                    draggable
                                    onDragStart={(e) => {
                                        dragItem.current = index;
                                        e.currentTarget.classList.add('opacity-50');
                                    }}
                                    onDragEnter={(e) => {
                                        dragOverItem.current = index;
                                        handleSort();
                                    }}
                                    onDragEnd={(e) => {
                                        dragItem.current = null;
                                        dragOverItem.current = null;
                                        e.currentTarget.classList.remove('opacity-50');
                                    }}
                                    onDragOver={(e) => e.preventDefault()}
                                >
                                    <div className="text-[#b3b3b3] cursor-grab active:cursor-grabbing hover:text-white p-2">
                                        <GripVertical size={20} />
                                    </div>
                                    
                                    <div className="relative w-10 h-10 flex-shrink-0">
                                        <img src={track.album.cover} className="w-full h-full rounded object-cover" />
                                    </div>

                                    <div className="flex-1 min-w-0 flex flex-col">
                                        <span className="font-bold truncate text-white">{track.title}</span>
                                        <span className="text-xs text-[#b3b3b3] truncate">{track.artist.name}</span>
                                    </div>
                                    
                                    <div className="text-xs text-[#b3b3b3] hidden md:block w-32 truncate">
                                        {track.album.title}
                                    </div>

                                    <button 
                                        onClick={() => handleRemoveTrack(index)}
                                        className="p-2 text-[#b3b3b3] hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                        title="Remove from playlist"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[#282828] bg-[#181818] flex justify-between items-center">
                     <button 
                        onClick={() => { 
                            if(window.confirm('Are you sure you want to delete this playlist?')) {
                                onDelete(playlist.uuid); 
                                onClose(); 
                            }
                        }}
                        className="text-red-500 hover:text-red-400 font-bold text-sm px-4 py-2 hover:bg-red-500/10 rounded transition-colors"
                    >
                        Delete Playlist
                    </button>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button onClick={() => { onSave(playlist.uuid, { title, description, image }, tracks); onClose(); }}>Save Changes</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};