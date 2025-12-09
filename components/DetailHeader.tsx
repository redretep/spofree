
import React, { ReactNode } from 'react';
import { Button } from './Button';

interface DetailHeaderProps {
    image: string;
    title: string;
    subtitle: ReactNode;
    type: string;
    onPlay: () => void;
    actions: ReactNode;
    description?: string;
    grayscaleMode?: boolean;
    squareAvatars?: boolean;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({ 
    image, title, subtitle, type, onPlay, actions, description,
    grayscaleMode = false, squareAvatars = false
}) => {
    return (
        <div className={`flex flex-col md:flex-row items-end gap-6 pb-6 border-b border-[#282828] mb-6 animate-fade-in`}>
            <div className={`w-48 h-48 md:w-60 md:h-60 shadow-[0_8px_40px_rgba(0,0,0,0.5)] flex-shrink-0 ${type === 'ARTIST' && !squareAvatars ? 'rounded-full' : 'rounded-md'} overflow-hidden`}>
                <img src={image} className={`w-full h-full object-cover ${grayscaleMode ? 'grayscale' : ''}`} alt={title} />
            </div>
            <div className="flex flex-col gap-2 md:gap-4 flex-1 w-full text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-widest hidden md:block">{type}</span>
                <h1 className="text-3xl md:text-6xl font-black tracking-tight leading-tight">{title}</h1>
                {description && <p className="text-[#b3b3b3] text-sm md:text-base max-w-2xl line-clamp-2">{description}</p>}
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-bold text-white mt-2">
                    {subtitle}
                </div>
                
                <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                    <Button variant="primary" size="lg" onClick={onPlay}>Play</Button>
                    {actions}
                </div>
            </div>
        </div>
    );
};
