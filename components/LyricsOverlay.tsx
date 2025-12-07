
import React, { useEffect, useRef } from 'react';
import { LyricsLine } from '../types';
import { X } from 'lucide-react';

interface LyricsOverlayProps {
    lyrics: LyricsLine[];
    currentTime: number;
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
}

export const LyricsOverlay: React.FC<LyricsOverlayProps> = ({ lyrics, currentTime, isOpen, onClose, isLoading }) => {
    const activeLineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeLineRef.current) {
            activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentTime]);

    if (!isOpen) return null;

    // Find active line index
    const activeIndex = lyrics.findIndex((line, i) => {
        const nextLine = lyrics[i + 1];
        return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });

    return (
        <div className="fixed inset-0 z-40 bg-gradient-to-b from-indigo-900/95 to-black/95 backdrop-blur-md flex flex-col pt-16 pb-24 px-6">
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
                <X size={24} />
            </button>

            <div className="flex-1 overflow-y-auto no-scrollbar mask-image-gradient">
                <div className="flex flex-col gap-6 max-w-2xl mx-auto py-20 text-center">
                    {isLoading ? (
                        <div className="text-2xl font-bold animate-pulse">Loading Lyrics...</div>
                    ) : lyrics.length === 0 ? (
                        <div className="text-2xl font-bold text-white/50">Lyrics not available for this track.</div>
                    ) : (
                        lyrics.map((line, index) => (
                            <div 
                                key={index}
                                ref={index === activeIndex ? activeLineRef : null}
                                className={`text-2xl md:text-4xl font-bold transition-all duration-500 ${
                                    index === activeIndex 
                                    ? 'text-white scale-105' 
                                    : 'text-white/30 hover:text-white/60 blur-[1px]'
                                }`}
                            >
                                {line.text}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
