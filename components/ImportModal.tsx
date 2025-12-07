
import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from './Button';
import { searchAll } from '../services/hifiService';
import { Track } from '../types';

interface ImportModalProps {
    onClose: () => void;
    onImport: (title: string, tracks: Track[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ onClose, onImport }) => {
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleImport = async () => {
        if (!text.trim() || !title.trim()) return;
        setIsProcessing(true);

        const lines = text.split('\n').filter(l => l.trim().length > 0);
        const foundTracks: Track[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].replace(/[",]/g, ' ').trim(); // Simple CSV sanitization
            // Try to find "Song - Artist" or just "Song"
            try {
                const result = await searchAll(line);
                if (result.tracks.length > 0) {
                    foundTracks.push(result.tracks[0]);
                }
            } catch (e) {
                console.error(`Failed to find: ${line}`);
            }
            setProgress(Math.round(((i + 1) / lines.length) * 100));
        }

        onImport(title, foundTracks);
        setIsProcessing(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#282828] rounded-lg shadow-xl w-full max-w-lg p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Import Playlist</h2>
                    <button onClick={onClose}><X /></button>
                </div>

                <input 
                    className="bg-[#3e3e3e] p-3 rounded text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                    placeholder="Playlist Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    disabled={isProcessing}
                />

                <textarea 
                    className="bg-[#3e3e3e] p-3 rounded text-white h-40 text-sm focus:outline-none"
                    placeholder="Paste songs here (one per line).&#10;Format: Song Title - Artist"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    disabled={isProcessing}
                />

                {isProcessing && (
                    <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={onClose} disabled={isProcessing}>Cancel</Button>
                    <Button onClick={handleImport} disabled={isProcessing || !title || !text}>
                        {isProcessing ? `Importing ${progress}%` : 'Create Playlist'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
