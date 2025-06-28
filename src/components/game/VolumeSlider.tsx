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
      className={`absolute top-2 right-4 flex bg-black bg-opacity-60 rounded-lg p-2 backdrop-blur-sm z-50 pointer-events-auto ${className} 
        md:flex-col md:items-center md:gap-2 md:h-32 md:w-auto
        flex-row items-center gap-2 w-auto h-auto`}
      onClick={handleClick}
    >
      <Volume2 size={16} className="text-purple-400" />
      <div className="md:h-20 md:w-4 w-20 h-4">
        <Slider
          value={[volume]}
          onValueChange={handleVolumeChange}
          max={1}
          min={0}
          step={0.1}
          orientation="vertical"
          className="cursor-pointer md:block hidden"
        />
        <Slider
          value={[volume]}
          onValueChange={handleVolumeChange}
          max={1}
          min={0}
          step={0.1}
          orientation="horizontal"
          className="cursor-pointer md:hidden block"
        />
      </div>
    </div>
  );
};

export default VolumeSlider;