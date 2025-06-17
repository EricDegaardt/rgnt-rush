
import React from 'react';
import { Zap, Gauge, Milestone, Volume2, VolumeX } from 'lucide-react';

interface GameUIProps {
    distance: number;
    energy: number;
    isMuted: boolean;
    onToggleMute: () => void;
}

const GameUI = ({ distance, energy, isMuted, onToggleMute }: GameUIProps) => {
    const formattedDistance = distance < 1000 
        ? `${Math.floor(distance)}m` 
        : `${(distance / 1000).toFixed(1)}km`;

    const handleSoundToggle = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event bubbling to game container
        onToggleMute();
    };

    return (
        <div className="absolute top-4 left-4 text-white flex flex-row items-center gap-3 p-2 bg-black bg-opacity-50 rounded text-xs md:text-sm max-w-[calc(100vw-2rem)]">
            <div className="flex items-center gap-1">
                <Gauge size={18} className="text-purple-400" />
                <span className="whitespace-nowrap">120 km/h</span>
            </div>
            <div className="flex items-center gap-1">
                <Milestone size={18} className="text-purple-400" />
                <span className="whitespace-nowrap">{formattedDistance}</span>
            </div>
            <div className="flex items-center gap-1">
                <Zap size={18} className="text-green-400" />
                <div className="w-16 md:w-20 h-3 bg-gray-700 rounded overflow-hidden border border-green-400">
                    <div className="h-full bg-green-400" style={{ width: `${energy}%` }} />
                </div>
            </div>
            <button
                onClick={handleSoundToggle}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-all flex-shrink-0"
                title={isMuted ? 'Unmute' : 'Mute'}
            >
                {isMuted ? <VolumeX size={16} className="text-gray-400" /> : <Volume2 size={16} className="text-white" />}
            </button>
        </div>
    );
};

export default GameUI;
