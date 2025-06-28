import React from 'react';
import { Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface VolumeSliderProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
}

const VolumeSlider = ({ volume, onVolumeChange, className = "" }: VolumeSliderProps) => {
  const handleVolumeChange = (values: number[]) => {
    onVolumeChange(values[0]);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className={`w-full flex items-center gap-3 bg-black bg-opacity-60 rounded-lg p-3 backdrop-blur-sm z-40 pointer-events-auto ${className}`}
      onClick={handleClick}
    >
      <Volume2 size={18} className="text-purple-400 flex-shrink-0" />
      <div className="flex-1">
        <Slider
          value={[volume]}
          onValueChange={handleVolumeChange}
          max={1}
          min={0}
          step={0.1}
          className="cursor-pointer"
        />
      </div>
      <span className="text-xs text-gray-300 min-w-[3ch] text-right">
        {Math.round(volume * 100)}%
      </span>
    </div>
  );
};

export default VolumeSlider;