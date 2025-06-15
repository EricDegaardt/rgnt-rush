
import React from 'react';
import { Zap, Gauge, Milestone } from 'lucide-react';

const GameUI = ({ distance, energy }: { distance: number, energy: number }) => {
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
        </div>
    );
};

export default GameUI;
