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
    <div className="absolute top-4 left-4 right-4 text-white bg-black bg-opacity-60 rounded-lg p-4 backdrop-blur-sm">
      {/* First Row: Speed and Distance */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Gauge size={24} className="text-purple-400" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-300 uppercase tracking-wide">Speed</span>
            <span className="text-lg font-bold">120 km/h</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Milestone size={24} className="text-purple-400" />
          <div className="flex flex-col text-right">
            <span className="text-xs text-gray-300 uppercase tracking-wide">Distance</span>
            <span className="text-lg font-bold">{formattedDistance}</span>
          </div>
        </div>
      </div>
      
      {/* Second Row: Energy */}
      <div className="flex items-center gap-3">
        <Zap size={24} className={getEnergyIconColor(energy)} />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-300 uppercase tracking-wide">Energy</span>
            <span className="text-sm font-medium">{Math.round(energy)}%</span>
          </div>
          <div className={`w-full h-4 bg-gray-700 rounded-full overflow-hidden border-2 ${getEnergyColor(energy).split(' ')[1]}`}>
            <div 
              className={`h-full transition-all duration-300 ${getEnergyColor(energy).split(' ')[0]}`} 
              style={{ width: `${energy}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameUI;