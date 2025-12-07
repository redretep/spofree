
import React, { useState } from 'react';
import { X, Trash2, Save } from 'lucide-react';
import { Button } from './Button';
import { Playlist } from '../types';

interface PlaylistEditModalProps {
    playlist: Playlist;
    onClose: () => void;
    onSave: (uuid: string, newTitle: string) => void;
    onDelete: (uuid: string) => void;
}

export const PlaylistEditModal: React.FC<PlaylistEditModalProps> = ({ playlist, onClose, onSave, onDelete }) => {
    const [title, setTitle] = useState(playlist.title);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#282828] rounded-lg shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Edit Playlist</h2>
                    <button onClick={onClose}><X /></button>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#b3b3b3]">Name</label>
                    <input 
                        className="bg-[#3e3e3e] p-3 rounded text-white focus:outline-none focus:ring-1 focus:ring-green-500 w-full"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="flex justify-between mt-4">
                    <Button 
                        variant="ghost" 
                        onClick={() => { onDelete(playlist.uuid); onClose(); }} 
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10 px-2"
                    >
                        <Trash2 size={18} className="mr-2" /> Delete
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={onClose} size="sm">Cancel</Button>
                        <Button 
                            onClick={() => { onSave(playlist.uuid, title); onClose(); }} 
                            disabled={!title.trim()}
                            size="sm"
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
