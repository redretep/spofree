
import React, { useEffect, useState } from 'react';
import { searchTracks } from '../services/hifiService';

interface GenreCardProps {
    genre: string;
    color: string;
    onClick: () => void;
}

export const GenreCard: React.FC<GenreCardProps> = ({ genre, color, onClick }) => {
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        // Fetch a single track for this genre to get a cover image
        searchTracks(genre).then(tracks => {
            if (mounted && tracks.length > 0) {
                setImage(tracks[0].album.cover);
            }
        });
        return () => { mounted = false; };
    }, [genre]);

    return (
        <div 
            onClick={onClick}
            className="aspect-square rounded-lg p-4 font-bold text-xl relative overflow-hidden cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: color }}
        >
            {genre}
            {image && (
                <img 
                    src={image} 
                    className="absolute -bottom-4 -right-4 w-24 h-24 rotate-[25deg] shadow-lg rounded object-cover animate-fade-in" 
                    alt={genre} 
                />
            )}
        </div>
    );
};
