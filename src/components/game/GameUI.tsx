import React from 'react';
import { Zap, Gauge, Milestone, Volume2, VolumeX } from 'lucide-react';

const GameUI = ({
  distance,
  energy,
  isMuted,
  onToggleMute
}: {
  distance: number;
  energy: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
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

  // Clamp energy between 0 and 100 to ensure valid percentage
  const clampedEnergy = Math.max(0, Math.min(100, energy));

  // Handle mute toggle with complete event isolation
  const handleMuteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    if (onToggleMute) {
      onToggleMute();
    }
  };

  const handleMuteTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopPropagation();
    if (onToggleMute) {
      onToggleMute();
    }
  };

  return (
    <div className="absolute top-2.5 left-4 right-4 text-white bg-black bg-opacity-60 rounded-lg p-4 backdrop-blur-sm pointer-events-none">
      {/* First Row: Speed, Distance, and Mute Toggle */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Gauge size={20} className="text-purple-400" />
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-300 uppercase tracking-wide">Speed</span>
            <span className="text-sm font-bold">120 km/h</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Milestone size={20} className="text-purple-400" />
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-gray-300 uppercase tracking-wide">Distance</span>
              <span className="text-sm font-bold">{formattedDistance}</span>
            </div>
          </div>
          
          {/* Mute Toggle Button - Completely isolated with higher z-index */}
          {onToggleMute && (
            <div 
              className="relative z-[9999]"
              onClickCapture={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchStartCapture={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <button
                onClick={handleMuteClick}
                onTouchStart={handleMuteTouch}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopPropagation();
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopPropagation();
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopPropagation();
                }}
                className="pointer-events-auto p-1.5 rounded-md bg-gray-800/80 hover:bg-gray-700/80 transition-colors border border-gray-600/50 hover:border-gray-500/50 select-none touch-manipulation relative z-[9999]"
                style={{ 
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  touchAction: 'manipulation',
                  isolation: 'isolate'
                }}
                aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
              >
                {isMuted ? (
                  <VolumeX size={16} className="text-red-400" />
                ) : (
                  <Volume2 size={16} className="text-gray-300" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Second Row: Energy */}
      <div className="flex items-center gap-3">
        <Zap size={20} className={getEnergyIconColor(clampedEnergy)} />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-300 uppercase tracking-wide">Energy</span>
            <span className="text-xs font-medium">{Math.round(clampedEnergy)}%</span>
          </div>
          <div className={`w-full h-3 bg-gray-700 rounded-full overflow-hidden border-2 ${getEnergyColor(clampedEnergy).split(' ')[1]}`}>
            <div 
              className={`h-full ${getEnergyColor(clampedEnergy).split(' ')[0]}`} 
              style={{ 
                width: `${clampedEnergy}%`,
                transition: 'none', // Remove transitions that might interfere
                willChange: 'width' // Optimize for width changes
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameUI;