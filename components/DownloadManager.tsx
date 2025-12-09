
import React from 'react';
import { Download, Archive, Music } from 'lucide-react';

interface DownloadState {
    name: string;
    progress: number;
}

interface DownloadManagerProps {
    singleDownload: DownloadState | null;
    zipDownload: DownloadState | null;
}

export const DownloadManager: React.FC<DownloadManagerProps> = ({ singleDownload, zipDownload }) => {
    if (!singleDownload && !zipDownload) return null;

    return (
        <div className="fixed bottom-24 md:bottom-28 right-4 md:right-6 z-[100] flex flex-col gap-3 w-[90vw] md:w-80">
            {zipDownload && (
                <div className="bg-[#181818] border border-[#282828] p-4 rounded-lg shadow-2xl animate-slide-up">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/20 rounded-full">
                            <Archive size={18} className="text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-0.5">Downloading Archive</div>
                            <div className="font-medium text-sm truncate">{zipDownload.name}</div>
                        </div>
                        <span className="text-xs font-mono text-[#b3b3b3]">{zipDownload.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#3e3e3e] rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-500 transition-all duration-300 ease-out"
                            style={{ width: `${zipDownload.progress}%` }}
                        />
                    </div>
                </div>
            )}

            {singleDownload && (
                <div className="bg-[#181818] border border-[#282828] p-4 rounded-lg shadow-2xl animate-slide-up">
                    <div className="flex items-center gap-3 mb-2">
                         <div className="p-2 bg-green-500/20 rounded-full">
                            <Music size={18} className="text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                             <div className="text-xs font-bold text-green-400 uppercase tracking-wider mb-0.5">Downloading Track</div>
                            <div className="font-medium text-sm truncate">{singleDownload.name}</div>
                        </div>
                        <span className="text-xs font-mono text-[#b3b3b3]">{singleDownload.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#3e3e3e] rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-green-500 transition-all duration-200 ease-linear"
                            style={{ width: `${singleDownload.progress}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
