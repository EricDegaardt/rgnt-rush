
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
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white flex flex-row items-center gap-2 sm:gap-4 p-2 bg-black bg-opacity-50 rounded text-xs md:text-base">
      <div className="flex items-center gap-2">
        <Gauge size={20} className="text-purple-400" />
        <span>120 km/h</span>
      </div>
      <div className="flex items-center gap-2">
        <Milestone size={20} className="text-purple-400" />
        <span>{formattedDistance}</span>
      </div>
      <div className="flex items-center gap-1">
        <Zap size={20} className={getEnergyIconColor(energy)} />
        <div className={`w-20 sm:w-24 h-4 bg-gray-700 rounded overflow-hidden border ${getEnergyColor(energy).split(' ')[1]}`}>
          <div className={`h-full ${getEnergyColor(energy).split(' ')[0]}`} style={{
            width: `${energy}%`
          }} />
        </div>
      </div>
    </div>
  );
};

export default GameUI;
