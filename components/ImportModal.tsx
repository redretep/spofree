
import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, Music } from 'lucide-react';
import { Button } from './Button';
import { searchAll } from '../services/hifiService';
import { localFileService } from '../services/localFileService';
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

    const handleImportText = async () => {
        if (!text.trim() || !title.trim()) return;
        setIsProcessing(true);

        const lines = text.split('\n').filter(l => l.trim().length > 0);
        const foundTracks: Track[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].replace(/[",]/g, ' ').trim(); 
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

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Set title from filename if empty
        if (!title) {
            setTitle(file.name.replace('.csv', ''));
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const csv = event.target?.result as string;
            if (!csv) return;

            setIsProcessing(true);
            const lines = csv.split('\n');
            const foundTracks: Track[] = [];
            
            // Skip header if it looks like our export format "Title, Artist, Album..."
            const startIndex = lines[0].toLowerCase().includes('title') && lines[0].toLowerCase().includes('artist') ? 1 : 0;

            for (let i = startIndex; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                // Simple CSV parse: try to split by comma, remove quotes
                // Format usually: "Title","Artist","Album"...
                // Split by comma BUT ignore commas inside quotes
                const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                
                let query = '';
                if (parts.length >= 2) {
                    const songTitle = parts[0].replace(/"/g, '').trim();
                    const artist = parts[1].replace(/"/g, '').trim();
                    query = `${songTitle} - ${artist}`;
                } else {
                    query = line.replace(/"/g, ' ');
                }

                try {
                    const result = await searchAll(query);
                    if (result.tracks.length > 0) {
                        foundTracks.push(result.tracks[0]);
                    }
                } catch (e) {
                    console.error(`Failed to find: ${query}`);
                }
                setProgress(Math.round(((i + 1) / lines.length) * 100));
            }

            onImport(title || 'Imported Playlist', foundTracks);
            setIsProcessing(false);
            onClose();
        };
        reader.readAsText(file);
    };

    const handleLocalFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsProcessing(true);
        if (!title) setTitle("Local Files");

        const tracks: Track[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                // Save to IndexedDB
                const id = await localFileService.saveFile(file);
                
                // Get Metadata (Duration)
                const tempUrl = URL.createObjectURL(file);
                const audio = new Audio(tempUrl);
                await new Promise((resolve) => {
                    audio.onloadedmetadata = () => {
                        resolve(null);
                    };
                    audio.onerror = () => resolve(null);
                });
                
                const duration = audio.duration || 0;
                URL.revokeObjectURL(tempUrl);

                tracks.push({
                    id: id, // Use the DB key as ID
                    title: file.name.replace(/\.[^/.]+$/, ""), // remove extension
                    artist: { id: 'local', name: 'Local File' },
                    album: { id: 'local', title: 'Local Import', cover: 'https://via.placeholder.com/300?text=Local+File' },
                    duration: duration,
                    isLocalFile: true,
                    localFileId: id,
                    quality: 'LOSSLESS' // assume best for local
                });
            } catch (err) {
                console.error("Failed to process local file", err);
            }
            setProgress(Math.round(((i + 1) / files.length) * 100));
        }

        onImport(title || 'Local Playlist', tracks);
        setIsProcessing(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-[#282828] rounded-lg shadow-xl w-full max-w-lg p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-scale-in">
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

                <div className="flex flex-col gap-2">
                    <div className="text-sm text-[#b3b3b3] uppercase font-bold text-xs">Method 1: Text</div>
                    <textarea 
                        className="bg-[#3e3e3e] p-3 rounded text-white h-24 text-sm focus:outline-none"
                        placeholder="Paste songs here (one per line).&#10;Format: Song Title - Artist"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        disabled={isProcessing}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="text-sm text-[#b3b3b3] uppercase font-bold text-xs">Method 2: CSV</div>
                        <label className="flex flex-col items-center justify-center gap-2 bg-[#3e3e3e] hover:bg-[#4e4e4e] p-4 rounded cursor-pointer transition-colors border border-dashed border-gray-600 h-24">
                            <FileSpreadsheet size={24} />
                            <span className="text-sm font-medium">Upload CSV</span>
                            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" disabled={isProcessing} />
                        </label>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="text-sm text-[#b3b3b3] uppercase font-bold text-xs">Method 3: Local Files</div>
                        <label className="flex flex-col items-center justify-center gap-2 bg-[#3e3e3e] hover:bg-[#4e4e4e] p-4 rounded cursor-pointer transition-colors border border-dashed border-gray-600 h-24">
                            <Music size={24} />
                            <span className="text-sm font-medium">Select Audio</span>
                            <input type="file" accept="audio/*,.flac,.m4a,.mp3" multiple onChange={handleLocalFiles} className="hidden" disabled={isProcessing} />
                        </label>
                    </div>
                </div>

                {isProcessing && (
                    <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                )}

                <div className="flex justify-end gap-2 mt-2">
                    <Button variant="ghost" onClick={onClose} disabled={isProcessing}>Cancel</Button>
                    <Button onClick={handleImportText} disabled={isProcessing || !text.trim()}>
                        {isProcessing ? `Processing ${progress}%` : 'Import from Text'}
                    </Button>
                </div>
            </div>
        </div>
    );
};
