import React from 'react';
import { Zap, Gauge, Milestone } from 'lucide-react';

const GameUI = ({
  distance,
  energy
}: {
  distance: number;
  energy: number;
}) => {
  const formattedDistance = distance < 1000 ? `${Math.floor(distance)}m` : `${(distance / 1000).toFixed(1)}km`;
  
  // Determine energy bar color based on energy level
  const getEnergyColor = (energy: number) => {
    if (energy > 60) return 'bg-green-400 border-green-400';
    if (energy > 30) return 'bg-yellow-400 border-yellow-400';
    return 'bg-red-400 border-red-400';
  };
  
  const getEnergyIconColor = (energy: number) => {
    if (energy > 60) return 'text-green-400';
    if (energy > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white flex flex-row items-center gap-1 sm:gap-2 p-2 bg-black bg-opacity-50 rounded text-xs">
      <div className="flex items-center gap-1">
        <Gauge size={16} className="text-purple-400" />
        <span className="text-xs">120 km/h</span>
      </div>
      <div className="flex items-center gap-1">
        <Milestone size={16} className="text-purple-400" />
        <span className="text-xs">{formattedDistance}</span>
      </div>
      <div className="flex items-center gap-1">
        <Zap size={16} className={getEnergyIconColor(energy)} />
        <div className={`w-16 sm:w-20 h-3 bg-gray-700 rounded overflow-hidden border ${getEnergyColor(energy).split(' ')[1]}`}>
          <div className={`h-full ${getEnergyColor(energy).split(' ')[0]}`} style={{
            width: `${energy}%`
          }} />
        </div>
      </div>
    </div>
  );
};

export default GameUI;