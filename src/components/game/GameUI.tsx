
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

    return (
        <div className="absolute top-4 left-4 text-white flex flex-row items-center gap-4 p-2 bg-black bg-opacity-50 rounded text-xs md:text-base">
            <div className="flex items-center gap-2">
                <Gauge size={24} className="text-purple-400" />
                <span>120 km/h</span>
            </div>
            <div className="flex items-center gap-2">
                <Milestone size={24} className="text-purple-400" />
                <span>{formattedDistance}</span>
            </div>
            <div className="flex items-center gap-2">
                <Zap size={24} className="text-green-400" />
                <div className="w-24 h-4 bg-gray-700 rounded overflow-hidden border border-green-400">
                    <div className="h-full bg-green-400" style={{ width: `${energy}%` }} />
                </div>
            </div>
            <button
                onClick={onToggleMute}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-all"
                title={isMuted ? 'Unmute' : 'Mute'}
            >
                {isMuted ? <VolumeX size={20} className="text-gray-400" /> : <Volume2 size={20} className="text-white" />}
            </button>
        </div>
    );
};

export default GameUI;
