
import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Mic2, ListMusic, Volume2, Volume1, VolumeX, Download, Heart } from 'lucide-react';
import { Track } from '../types';
import { storageService } from '../services/storageService';
import { downloadTrackBlob } from '../services/hifiService';

interface PlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleLyrics: () => void;
  isLyricsOpen: boolean;
}

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const Player: React.FC<PlayerProps> = ({ 
    currentTrack, isPlaying, onPlayPause, onNext, onPrev, onToggleLyrics, isLyricsOpen 
}) => {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
      if (currentTrack) {
          setIsLiked(storageService.isLiked(currentTrack.id));
      }
  }, [currentTrack]);

  // Handle Play/Pause side effects
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
            console.error("Autoplay prevented or stream error", e);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // Volume Control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setProgress(time);
  };

  const handleDownload = async () => {
    if (!currentTrack || !currentTrack.streamUrl || isDownloading) return;
    
    try {
        setIsDownloading(true);
        const blob = await downloadTrackBlob(currentTrack.streamUrl);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentTrack.title} - ${currentTrack.artist.name}.flac`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (e) {
        console.error("Download failed", e);
        alert("Failed to download song");
    } finally {
        setIsDownloading(false);
    }
  };

  const toggleLike = () => {
      if (!currentTrack) return;
      const newState = storageService.toggleLikeSong(currentTrack);
      setIsLiked(newState);
  };

  if (!currentTrack) {
    return (
        <div className="fixed bottom-0 w-full h-20 md:h-24 bg-[#181818] border-t border-[#282828] flex items-center justify-between px-4 z-50 pb-safe">
            <div className="text-[#b3b3b3] text-sm">No track selected</div>
        </div>
    );
  }

  return (
    <div className="fixed bottom-[56px] md:bottom-0 w-full h-20 md:h-24 bg-[#181818] border-t border-[#282828] flex items-center justify-between px-2 md:px-4 z-50">
      <audio 
        ref={audioRef}
        src={currentTrack.streamUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
        autoPlay
      />

      {/* Left: Track Info */}
      <div className="flex items-center w-1/4 min-w-[120px] gap-3">
        <img 
          src={currentTrack.album.cover} 
          alt={currentTrack.album.title} 
          className="h-10 w-10 md:h-14 md:w-14 rounded bg-[#282828] shadow-lg" 
        />
        <div className="flex flex-col justify-center overflow-hidden">
          <div className="text-white hover:underline cursor-pointer text-sm font-medium truncate">
            {currentTrack.title}
          </div>
          <div className="text-[#b3b3b3] hover:text-white hover:underline cursor-pointer text-xs truncate">
            {currentTrack.artist.name}
          </div>
        </div>
        <button 
            onClick={toggleLike}
            className={`hidden md:block transition-transform hover:scale-110 ${isLiked ? 'text-green-500' : 'text-[#b3b3b3]'}`}
        >
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Center: Controls */}
      <div className="flex flex-col items-center flex-1 max-w-xl px-2">
        <div className="flex items-center gap-4 md:gap-6 mb-1 md:mb-2">
          <button className="text-[#b3b3b3] hover:text-white transition-colors hidden md:block" title="Shuffle">
            <Shuffle size={16} />
          </button>
          <button onClick={onPrev} className="text-[#b3b3b3] hover:text-white transition-colors">
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button 
            onClick={onPlayPause} 
            className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={onNext} className="text-[#b3b3b3] hover:text-white transition-colors">
            <SkipForward size={20} fill="currentColor" />
          </button>
          <button className="text-[#b3b3b3] hover:text-white transition-colors hidden md:block" title="Repeat">
            <Repeat size={16} />
          </button>
        </div>
        
        <div className="w-full flex items-center gap-2 text-xs text-[#b3b3b3]">
          <span className="min-w-[40px] text-right hidden md:block">{formatTime(progress)}</span>
          <div className="flex-1 group relative h-1 bg-[#4d4d4d] rounded-full cursor-pointer">
             <input 
                type="range"
                min={0}
                max={duration || 100}
                value={progress}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
             />
             <div 
                className="bg-white h-full rounded-full group-hover:bg-[#1db954]" 
                style={{ width: `${(progress / (duration || 1)) * 100}%` }}
             ></div>
          </div>
          <span className="min-w-[40px] hidden md:block">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume & Extras */}
      <div className="flex items-center justify-end w-1/4 min-w-[100px] gap-2 md:gap-3">
        <button 
            onClick={handleDownload} 
            className={`transition-colors ${isDownloading ? 'text-green-500 animate-pulse' : 'text-[#b3b3b3] hover:text-[#1db954]'}`}
            title="Download"
            disabled={isDownloading}
        >
            <Download size={20} />
        </button>
        <button 
            onClick={onToggleLyrics}
            className={`transition-colors hidden md:block ${isLyricsOpen ? 'text-green-500' : 'text-[#b3b3b3] hover:text-white'}`}
        >
            <Mic2 size={18} />
        </button>
        <button className="text-[#b3b3b3] hover:text-white hidden lg:block">
            <ListMusic size={18} />
        </button>
        <div className="flex items-center gap-2 w-24 hidden md:flex">
            <div className="text-[#b3b3b3]">
                {volume === 0 ? <VolumeX size={18} /> : volume < 0.5 ? <Volume1 size={18} /> : <Volume2 size={18} />}
            </div>
            <div className="h-1 bg-[#4d4d4d] rounded-full flex-1 relative group">
                <input 
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                    className="bg-[#b3b3b3] h-full rounded-full group-hover:bg-[#1db954]" 
                    style={{ width: `${volume * 100}%` }}
                ></div>
            </div>
        </div>
      </div>
    </div>
  );
};
