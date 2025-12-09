
import React from 'react';
import { MediaItem } from './MediaItem';

interface MediaGridProps {
    title: string;
    items: any[];
    type: 'ALBUM' | 'ARTIST' | 'PLAYLIST';
    onMore?: () => void;
    onItemClick: (item: any) => void;
    grayscaleMode?: boolean;
    squareAvatars?: boolean;
    viewMode?: 'GRID' | 'LIST';
}

export const MediaGrid: React.FC<MediaGridProps> = ({ 
    title, items, type, onMore, onItemClick, 
    grayscaleMode = false, squareAvatars = false, viewMode = 'GRID'
}) => {
    if (!items || items.length === 0) return null;
    
    return (
        <section className="mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-4 px-2">
                {title && <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>}
                {onMore && <button onClick={onMore} className="text-xs font-bold text-[#b3b3b3] hover:underline uppercase tracking-widest">Show all</button>}
            </div>
            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6`}>
                {items.map((item: any) => (
                    <MediaItem 
                        key={item.id || item.uuid} 
                        item={item} 
                        type={type} 
                        onClick={() => onItemClick(item)}
                        rounded={type === 'ARTIST' && !squareAvatars}
                        viewMode={viewMode}
                        grayscaleMode={grayscaleMode}
                    />
                ))}
            </div>
        </section>
    );
};
