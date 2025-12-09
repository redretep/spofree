
import React, { useState } from 'react';
import { Check, Wifi, Palette, Sliders, Timer, ListCollapse, EyeOff, Square, Monitor, Gauge, Droplets, Type, Keyboard, Activity } from 'lucide-react';
import { Button } from './Button';
import { AudioQuality } from '../types';
import { ShortcutsModal } from './ShortcutsModal';

export type SettingsTab = 'QUALITY' | 'APPEARANCE' | 'PLAYBACK' | 'TWEAKS';

interface SettingsModalProps {
    onClose: () => void;
    defaultTab?: SettingsTab;
    
    quality: AudioQuality;
    setQuality: (q: AudioQuality) => void;
    
    accentColor: string;
    setAccentColor: (c: string) => void;
    
    showStats: boolean;
    setShowStats: (v: boolean) => void;
    
    compactMode: boolean;
    setCompactMode: (v: boolean) => void;
    
    reducedMotion: boolean;
    setReducedMotion: (v: boolean) => void;
    
    grayscaleMode: boolean;
    setGrayscaleMode: (v: boolean) => void;
    
    squareAvatars: boolean;
    setSquareAvatars: (v: boolean) => void;
    
    sleepTimer: number | null;
    setSleepTimer: (m: number | null) => void;

    highPerformanceMode: boolean;
    setHighPerformanceMode: (v: boolean) => void;

    disableGlow: boolean;
    setDisableGlow: (v: boolean) => void;

    updateTitle: boolean;
    setUpdateTitle: (v: boolean) => void;

    showVisualizer: boolean;
    setShowVisualizer: (v: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
    onClose, defaultTab = 'QUALITY',
    quality, setQuality, 
    accentColor, setAccentColor,
    showStats, setShowStats,
    compactMode, setCompactMode,
    reducedMotion, setReducedMotion,
    grayscaleMode, setGrayscaleMode,
    squareAvatars, setSquareAvatars,
    sleepTimer, setSleepTimer,
    highPerformanceMode, setHighPerformanceMode,
    disableGlow, setDisableGlow,
    updateTitle, setUpdateTitle,
    showVisualizer, setShowVisualizer
}) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>(defaultTab);
    const [customTimer, setCustomTimer] = useState('');
    const [showShortcuts, setShowShortcuts] = useState(false);

    const themes = ['#1db954', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444', '#10b981', '#ffffff'];

    const tabs = [
        { id: 'QUALITY', label: 'Audio Quality', icon: Wifi },
        { id: 'APPEARANCE', label: 'Appearance', icon: Palette },
        { id: 'PLAYBACK', label: 'Playback', icon: Timer },
        { id: 'TWEAKS', label: 'Tweaks', icon: Sliders },
    ];

    const qualityOptions: { value: AudioQuality; label: string; desc: string }[] = [
        { value: 'HI_RES', label: 'Hi Res', desc: 'Up to 9216 kbit/s (Master Quality)' },
        { value: 'LOSSLESS', label: 'CD Lossless', desc: '1411 kbit/s FLAC' },
        { value: 'HIGH', label: '320kbs AAC', desc: 'High Quality' },
        { value: 'LOW', label: '94kbs AAC', desc: 'Data Saver' },
    ];

    const handleCustomTimer = () => {
        const val = parseInt(customTimer);
        if (!isNaN(val) && val > 0) {
            setSleepTimer(val);
        }
    };

    const ToggleItem = ({ label, desc, icon: Icon, active, onToggle, colorClass = 'text-gray-500' }: any) => (
        <div 
            onClick={onToggle}
            className="flex items-center justify-between p-4 rounded-md cursor-pointer hover:bg-white/5"
        >
            <div className="flex items-center gap-3">
                <Icon size={20} className={active ? colorClass : 'text-gray-500'} />
                <div className="flex flex-col">
                    <span className="font-bold">{label}</span>
                    <span className="text-xs text-[#b3b3b3]">{desc}</span>
                </div>
            </div>
            <div className={`w-10 h-6 rounded-full relative transition-colors ${active ? 'bg-green-500' : 'bg-gray-600'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-5' : 'left-1'}`}></div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch(activeTab) {
            case 'QUALITY':
                return (
                    <div className="flex flex-col gap-2 animate-slide-up">
                        {qualityOptions.map((opt) => (
                            <div 
                                key={opt.value} 
                                onClick={() => setQuality(opt.value)}
                                className={`flex items-center justify-between p-4 rounded-md cursor-pointer transition-colors ${quality === opt.value ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5 border border-transparent'}`}
                            >
                                <div className="flex flex-col">
                                    <span className="font-bold">{opt.label}</span>
                                    <span className="text-xs text-[#b3b3b3]">{opt.desc}</span>
                                </div>
                                {quality === opt.value && <Check className="text-green-500" size={20} />}
                            </div>
                        ))}
                    </div>
                );
            case 'APPEARANCE':
                return (
                    <div className="animate-slide-up">
                        <div className="mb-4 text-sm text-[#b3b3b3]">Choose an accent color for the player UI and visualizations.</div>
                        <div className="grid grid-cols-4 gap-4 mb-8">
                            {themes.map(color => (
                                <button 
                                    key={color}
                                    onClick={() => setAccentColor(color)}
                                    className={`w-full aspect-square rounded-full flex items-center justify-center transition-transform hover:scale-105 ${accentColor === color ? 'ring-4 ring-white/20' : ''}`}
                                    style={{ backgroundColor: color }}
                                >
                                    {accentColor === color && <Check className="text-black/50" />}
                                </button>
                            ))}
                        </div>
                        
                        <h4 className="font-bold mb-2">Style Options</h4>
                        <div className="flex flex-col gap-2">
                            <ToggleItem 
                                label="Show Visualizer" 
                                desc="Display audio visualization in player" 
                                icon={Activity}
                                active={showVisualizer}
                                onToggle={() => setShowVisualizer(!showVisualizer)}
                                colorClass="text-green-400"
                            />
                             <ToggleItem 
                                label="Square Avatars" 
                                desc="Use square images for artists instead of circles"
                                icon={Square}
                                active={squareAvatars}
                                onToggle={() => setSquareAvatars(!squareAvatars)}
                                colorClass="text-blue-400"
                            />
                            <ToggleItem 
                                label="Grayscale Mode" 
                                desc="Remove all colors from the interface"
                                icon={Monitor}
                                active={grayscaleMode}
                                onToggle={() => setGrayscaleMode(!grayscaleMode)}
                                colorClass="text-white"
                            />
                        </div>
                    </div>
                );
            case 'PLAYBACK':
                return (
                    <div className="flex flex-col gap-6 animate-slide-up">
                        {/* Sleep Timer */}
                        <div>
                            <div className="flex items-center gap-2 font-bold mb-3">
                                <Timer size={18} /> <span>Sleep Timer</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {[15, 30, 45, 60].map(min => (
                                    <button 
                                        key={min}
                                        onClick={() => setSleepTimer(min)}
                                        className={`py-2 rounded font-medium text-sm transition-colors ${sleepTimer === min ? 'bg-white text-black' : 'bg-[#3e3e3e] hover:bg-[#4e4e4e]'}`}
                                    >
                                        {min} min
                                    </button>
                                ))}
                                <button 
                                    onClick={() => setSleepTimer(null)}
                                    className={`col-span-2 py-2 rounded font-medium text-sm transition-colors ${sleepTimer === null ? 'bg-white text-black' : 'bg-[#3e3e3e] hover:bg-[#4e4e4e]'}`}
                                >
                                    Off
                                </button>
                            </div>
                            
                            <div className="mt-4 flex gap-2">
                                <input 
                                    type="number" 
                                    placeholder="Custom (min)" 
                                    className="bg-[#3e3e3e] rounded px-3 py-2 text-sm text-white focus:outline-none flex-1"
                                    value={customTimer}
                                    onChange={(e) => setCustomTimer(e.target.value)}
                                />
                                <Button size="sm" onClick={handleCustomTimer} disabled={!customTimer}>Set</Button>
                            </div>

                            {sleepTimer && <div className="mt-4 text-xs text-green-500 bg-green-500/10 p-2 rounded">Timer active. Player will stop in {sleepTimer} minutes.</div>}
                        </div>
                    </div>
                );
            case 'TWEAKS':
                return (
                    <div className="flex flex-col gap-2 animate-slide-up">
                        <button 
                            onClick={() => setShowShortcuts(true)}
                            className="flex items-center justify-between p-4 rounded-md cursor-pointer hover:bg-white/5 bg-[#2a2a2a] mb-2"
                        >
                            <div className="flex items-center gap-3">
                                <Keyboard size={20} className="text-gray-400" />
                                <span className="font-bold">Keyboard Shortcuts</span>
                            </div>
                            <div className="bg-[#3e3e3e] px-2 py-1 rounded text-xs text-[#b3b3b3]">View All</div>
                        </button>

                         <ToggleItem 
                            label="Stats for Nerds" 
                            desc="Display technical info overlay" 
                            icon={ListCollapse}
                            active={showStats}
                            onToggle={() => setShowStats(!showStats)}
                            colorClass="text-purple-400"
                        />
                        <ToggleItem 
                            label="Compact Mode" 
                            desc="Denser layout for lists" 
                            icon={EyeOff}
                            active={compactMode}
                            onToggle={() => setCompactMode(!compactMode)}
                            colorClass="text-orange-400"
                        />
                         <ToggleItem 
                            label="Reduced Motion" 
                            desc="Disable animations and transitions" 
                            icon={EyeOff}
                            active={reducedMotion}
                            onToggle={() => setReducedMotion(!reducedMotion)}
                            colorClass="text-teal-400"
                        />
                        <ToggleItem 
                            label="High Performance" 
                            desc="Disable blur effects (Improves FPS)"
                            icon={Gauge}
                            active={highPerformanceMode}
                            onToggle={() => setHighPerformanceMode(!highPerformanceMode)}
                            colorClass="text-red-400"
                        />
                        <ToggleItem 
                            label="Disable Glow" 
                            desc="Turn off the background player glow"
                            icon={Droplets}
                            active={disableGlow}
                            onToggle={() => setDisableGlow(!disableGlow)}
                            colorClass="text-indigo-400"
                        />
                         <ToggleItem 
                            label="Dynamic Title" 
                            desc="Update tab title with song info"
                            icon={Type}
                            active={updateTitle}
                            onToggle={() => setUpdateTitle(!updateTitle)}
                            colorClass="text-white"
                        />
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-scale-in">
            <div className="bg-[#181818] rounded-xl shadow-2xl w-full max-w-2xl h-[90vh] md:h-[80vh] flex flex-col md:flex-row overflow-hidden border border-[#282828]">
                {/* Sidebar */}
                <div className="w-full md:w-1/3 bg-[#121212] border-b md:border-b-0 md:border-r border-[#282828] p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible flex-shrink-0">
                    <h2 className="text-xl font-bold px-4 mb-2 md:mb-4 hidden md:block">Settings</h2>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as SettingsTab)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors flex-shrink-0 whitespace-nowrap md:whitespace-normal ${activeTab === tab.id ? 'bg-[#282828] text-white font-bold' : 'text-[#b3b3b3] hover:text-white hover:bg-[#1f1f1f]'}`}
                        >
                            <tab.icon size={20} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                    <div className="mt-auto text-xs text-[#535353] px-4 pb-2 hidden md:block">
                        SpoFree v2.2
                        <br/>
                        Made by redretep
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex justify-between md:justify-end items-center p-4">
                         <span className="md:hidden text-xs text-[#535353] font-mono">v2.2</span>
                        <button onClick={onClose} className="p-2 hover:bg-[#282828] rounded-full transition-colors"><Check /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-0">
                        {renderContent()}
                    </div>
                </div>
            </div>
            
            {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
        </div>
    );
};
