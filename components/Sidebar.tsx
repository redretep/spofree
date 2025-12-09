
import React from 'react';
import { Home, Search, Library, PlusSquare, Heart, Globe, Settings } from 'lucide-react';
import { ViewState, Playlist } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  playlists: Playlist[];
  onPlaylistClick: (playlist: Playlist) => void;
  onCreatePlaylist: () => void;
  onLikedSongsClick: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    currentView, onChangeView, playlists, onPlaylistClick, onCreatePlaylist, onLikedSongsClick, onOpenSettings
}) => {
  
  const NavItem = ({ 
    view, 
    icon: Icon, 
    label 
  }: { 
    view: ViewState, 
    icon: React.ElementType, 
    label: string 
  }) => (
    <button 
      onClick={() => onChangeView(view)}
      className={`flex items-center gap-4 px-4 py-2 transition-colors duration-200 w-full text-left
        ${currentView === view ? 'text-white' : 'text-[#b3b3b3] hover:text-white'}`}
    >
      <Icon size={24} strokeWidth={currentView === view ? 2.5 : 2} />
      <span className="font-bold text-sm truncate">{label}</span>
    </button>
  );

  return (
    <div className="w-64 bg-black h-full flex flex-col pt-6 gap-2 resize-x hidden md:flex border-r border-[#282828] pb-32">
      {/* Logo Area */}
      <div className="px-6 mb-2 flex items-center gap-2">
        {/* Upside down Spotify-ish logo */}
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center transform rotate-180">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.7 17.2C16.5 17.5 16.1 17.6 15.8 17.4C13.1 15.8 9.7 15.4 5.7 16.3C5.4 16.4 5 16.2 4.9 15.8C4.8 15.5 5 15.1 5.4 15C9.7 14 13.5 14.5 16.5 16.3C16.8 16.5 16.9 16.9 16.7 17.2ZM18.1 14C17.8 14.4 17.3 14.5 16.9 14.3C13.8 12.4 9.1 11.9 5.5 13C5.1 13.1 4.6 12.9 4.5 12.5C4.4 12.1 4.6 11.6 5 11.5C9.1 10.2 14.4 10.9 17.9 13.1C18.3 13.3 18.4 13.8 18.1 14ZM18.2 10.6C14.5 8.4 8.4 8.2 4.9 9.3C4.3 9.4 3.7 9.1 3.5 8.5C3.3 7.9 3.6 7.3 4.2 7.1C8.3 5.9 15.1 6.1 19.4 8.7C19.9 9 20.1 9.7 19.8 10.2C19.5 10.7 18.8 10.9 18.2 10.6Z" />
             </svg>
        </div>
        <span className="text-white font-bold text-xl tracking-tight">SpoFree</span>
      </div>

      {/* Main Nav */}
      <nav className="flex flex-col gap-2 px-2">
        <NavItem view={ViewState.HOME} icon={Home} label="Home" />
        <NavItem view={ViewState.SEARCH} icon={Search} label="Search" />
        <NavItem view={ViewState.LIBRARY} icon={Library} label="Your Library" />
      </nav>

      {/* Spacer / Secondary Actions */}
      <div className="mt-6 px-2 flex flex-col gap-2">
        <button 
            onClick={onCreatePlaylist}
            className="flex items-center gap-4 px-4 py-2 text-[#b3b3b3] hover:text-white transition-colors"
        >
          <div className="bg-[#b3b3b3] p-1 rounded-sm bg-opacity-20">
            <PlusSquare size={20} className="text-[#b3b3b3]" />
          </div>
          <span className="font-bold text-sm">Create Playlist</span>
        </button>
        <button 
            onClick={onLikedSongsClick}
            className={`flex items-center gap-4 px-4 py-2 transition-colors ${currentView === ViewState.LIKED_SONGS ? 'text-white' : 'text-[#b3b3b3] hover:text-white'}`}
        >
          <div className="bg-gradient-to-br from-indigo-700 to-blue-300 p-1 rounded-sm opacity-70">
            <Heart size={20} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-sm">Liked Songs</span>
        </button>
      </div>

      <div className="border-t border-[#282828] mx-6 my-2"></div>

      {/* Scrollable Playlist List */}
      <div className="flex-1 overflow-y-auto px-6 py-2">
        <ul className="flex flex-col gap-3">
          {playlists.map((playlist) => (
            <li 
                key={playlist.uuid} 
                onClick={() => onPlaylistClick(playlist)}
                className="text-[#b3b3b3] hover:text-white text-sm cursor-pointer truncate"
            >
              {playlist.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Actions */}
      <div className="px-4 mt-auto flex flex-col gap-2">
        <button 
            onClick={onOpenSettings} 
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-[#282828] hover:bg-[#3E3E3E] rounded-md transition-colors w-full"
        >
            <Settings size={20} />
            <span>Settings</span>
        </button>
        
        <div className="flex items-center justify-center gap-2 text-xs text-[#b3b3b3] pt-2">
            <Globe size={14} />
            <span>Hifi API Connected</span>
        </div>
      </div>
    </div>
  );
};
