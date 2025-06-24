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
      className={`absolute top-2 right-4 flex items-center gap-2 bg-black bg-opacity-60 rounded-lg p-2 backdrop-blur-sm z-50 pointer-events-auto ${className}`}
      onClick={handleClick}
    >
      <Volume2 size={16} className="text-purple-400" />
      <div className="w-20">
        <Slider
          value={[volume]}
          onValueChange={handleVolumeChange}
          max={1}
          min={0}
          step={0.1}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default VolumeSlider;
