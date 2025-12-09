
import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
    onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ onClose }) => {
    const shortcuts = [
        { key: 'Space', action: 'Play / Pause' },
        { key: 'Right Arrow', action: 'Seek Forward 5s' },
        { key: 'Left Arrow', action: 'Seek Backward 5s' },
        { key: 'Ctrl + Right', action: 'Next Track' },
        { key: 'Ctrl + Left', action: 'Previous Track' },
        { key: 'M', action: 'Mute / Unmute' },
        { key: 'Esc', action: 'Close Full Screen / Modals' },
    ];

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#181818] rounded-xl shadow-2xl w-full max-w-md border border-[#282828]">
                <div className="flex justify-between items-center p-6 border-b border-[#282828]">
                    <div className="flex items-center gap-3">
                        <Keyboard size={24} className="text-white" />
                        <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
                    </div>
                    <button onClick={onClose} className="hover:text-white text-[#b3b3b3]"><X /></button>
                </div>
                
                <div className="p-2">
                    {shortcuts.map((s, i) => (
                        <div key={i} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-lg transition-colors">
                            <span className="text-[#b3b3b3] font-medium">{s.action}</span>
                            <kbd className="bg-[#282828] px-3 py-1 rounded text-sm font-mono text-white border border-[#3e3e3e] shadow-sm">
                                {s.key}
                            </kbd>
                        </div>
                    ))}
                </div>

                <div className="p-6 text-center text-xs text-[#535353]">
                    Shortcuts work when the player is focused.
                </div>
            </div>
        </div>
    );
};
