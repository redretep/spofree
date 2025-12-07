
import React from 'react';
import { Home, Search, Library, PlusSquare, Heart, Globe, Music } from 'lucide-react';
import { ViewState, Playlist } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  playlists: Playlist[];
  onPlaylistClick: (playlist: Playlist) => void;
  onCreatePlaylist: () => void;
  onLikedSongsClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
    currentView, onChangeView, playlists, onPlaylistClick, onCreatePlaylist, onLikedSongsClick
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
    <div className="w-64 bg-black h-full flex-col pt-6 gap-2 resize-x hidden md:flex border-r border-[#282828]">
      {/* Logo Area */}
      <div className="px-6 mb-2 flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Music className="text-black" size={20} fill="currentColor" />
        </div>
        <span className="text-white font-bold text-xl tracking-tight">SpoFreeFy</span>
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
          <span className="font-bold text-sm">Import Playlist</span>
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

      {/* Install App / Hifi Info */}
      <div className="px-6 pb-6 mt-auto">
        <div className="flex items-center gap-2 text-xs text-[#b3b3b3] cursor-pointer hover:text-white">
          <Globe size={16} />
          <span>Hifi API Connected</span>
        </div>
      </div>
    </div>
  );
};
