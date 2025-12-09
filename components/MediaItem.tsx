
import React from 'react';
import { Play } from 'lucide-react';

interface MediaItemProps {
    item: any;
    type: 'ALBUM' | 'ARTIST' | 'PLAYLIST';
    onClick: () => void;
    rounded?: boolean;
    viewMode?: 'GRID' | 'LIST';
    grayscaleMode?: boolean;
}

export const MediaItem: React.FC<MediaItemProps> = ({ 
    item, type, onClick, rounded = false, viewMode = 'GRID', grayscaleMode = false 
}) => {
    if (viewMode === 'LIST') {
        // List View Render
        return (
            <div onClick={onClick} className="flex items-center gap-4 p-2 hover:bg-white/10 rounded-md cursor-pointer transition-colors group">
                <img src={item.image || item.cover || item.picture} className={`w-12 h-12 object-cover ${rounded ? 'rounded-full' : 'rounded'} ${grayscaleMode ? 'grayscale' : ''}`} alt={item.title || item.name} />
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-white truncate">{item.title || item.name}</div>
                    <div className="text-sm text-[#b3b3b3] truncate">{type === 'ARTIST' ? 'Artist' : (item.artist?.name || item.creator?.name || 'Album')}</div>
                </div>
            </div>
        );
    }

    // Grid View Render
    return (
        <div onClick={onClick} className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition-all cursor-pointer group hover:shadow-xl flex flex-col gap-3 min-w-0">
            <div className={`relative w-full aspect-square ${rounded ? 'rounded-full' : 'rounded-md'} overflow-hidden shadow-lg mb-2`}>
                <img src={item.image || item.cover || item.picture} alt={item.title || item.name} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${grayscaleMode ? 'grayscale' : ''}`} loading="lazy" />
                {/* Play Button Overlay (only for albums/playlists) */}
                {type !== 'ARTIST' && (
                    <div className="absolute right-2 bottom-2 bg-[#1db954] rounded-full p-3 shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-black"><Play size={24} fill="black" /></span>
                    </div>
                )}
            </div>
            <div className="flex flex-col min-w-0">
                <span className="font-bold truncate text-white mb-1" title={item.title || item.name}>{item.title || item.name}</span>
                <span className="text-sm text-[#b3b3b3] truncate capitalize line-clamp-2">
                    {type === 'PLAYLIST' ? `By ${item.creator.name}` : type === 'ALBUM' ? item.artist.name : 'Artist'}
                </span>
            </div>
        </div>
    );
};
