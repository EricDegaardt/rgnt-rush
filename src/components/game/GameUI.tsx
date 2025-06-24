import React, { useCallback, useState, useRef } from 'react';
import { Zap, Gauge, Milestone, Volume2, VolumeX } from 'lucide-react';

const GameUI = ({
  distance,
  energy,
  volume,
  onVolumeChange
}: {
  distance: number;
  energy: number;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
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

  // Volume slider handlers
  const updateVolumeFromPosition = useCallback((clientX: number) => {
    if (!sliderRef.current || !onVolumeChange) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    onVolumeChange(Math.round(percentage));
  }, [onVolumeChange]);

  const handleSliderMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    updateVolumeFromPosition(e.clientX);
  }, [updateVolumeFromPosition]);

  const handleSliderTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    if (e.touches[0]) {
      updateVolumeFromPosition(e.touches[0].clientX);
    }
  }, [updateVolumeFromPosition]);

  // Global mouse/touch move and up handlers
  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      updateVolumeFromPosition(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches[0]) {
        updateVolumeFromPosition(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, updateVolumeFromPosition]);

  return (
    <div className="absolute top-0 left-0 right-0 text-white pointer-events-none">
      {/* Volume Slider at the very top */}
      {onVolumeChange && (
        <div className="w-full bg-black bg-opacity-40 backdrop-blur-sm p-2 pointer-events-auto">
          <div className="flex items-center gap-3 max-w-sm mx-auto">
            <div className="flex items-center gap-1">
              {volume === 0 ? (
                <VolumeX size={16} className="text-red-400" />
              ) : (
                <Volume2 size={16} className="text-gray-300" />
              )}
              <span className="text-xs text-gray-300 min-w-[2rem]">{volume}%</span>
            </div>
            
            <div 
              ref={sliderRef}
              className="flex-1 h-6 relative cursor-pointer select-none touch-manipulation"
              onMouseDown={handleSliderMouseDown}
              onTouchStart={handleSliderTouchStart}
              style={{ 
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                touchAction: 'none'
              }}
            >
              {/* Slider track */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-600 rounded-full transform -translate-y-1/2">
                {/* Slider fill */}
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-150"
                  style={{ width: `${volume || 0}%` }}
                />
                {/* Slider thumb */}
                <div 
                  className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform -translate-y-1/2 -translate-x-1/2 border-2 border-purple-400"
                  style={{ left: `${volume || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game UI below the volume slider */}
      <div className="bg-black bg-opacity-60 rounded-lg p-4 backdrop-blur-sm mx-4 mt-2">
        {/* First Row: Speed and Distance */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Gauge size={20} className="text-purple-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-300 uppercase tracking-wide">Speed</span>
              <span className="text-sm font-bold">120 km/h</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Milestone size={20} className="text-purple-400" />
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-gray-300 uppercase tracking-wide">Distance</span>
              <span className="text-sm font-bold">{formattedDistance}</span>
            </div>
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
                  transition: 'none',
                  willChange: 'width'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameUI;