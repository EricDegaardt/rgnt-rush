
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';

interface GamePreloaderProps {
  onComplete: () => void;
  bikeImages: string[];
}

const GamePreloader = ({ onComplete, bikeImages }: GamePreloaderProps) => {
  const [progress, setProgress] = useState(0);
  const [loadedAssets, setLoadedAssets] = useState(0);

  // Assets to preload
  const gameAssets = [
    ...bikeImages,
    '/lovable-uploads/sounds/background-music.mp3',
    '/lovable-uploads/sounds/bike-jump.mp3',
    '/lovable-uploads/sounds/hitting-barell.mp3',
    '/lovable-uploads/sounds/collecting-battery.mp3',
    '/lovable-uploads/sounds/game-over.mp3',
  ];

  const totalAssets = gameAssets.length;

  useEffect(() => {
    let loadedCount = 0;

    const loadAsset = (src: string) => {
      return new Promise<void>((resolve) => {
        if (src.includes('.mp3')) {
          // Preload audio
          const audio = new Audio(src);
          audio.preload = 'auto';
          audio.addEventListener('canplaythrough', () => {
            loadedCount++;
            setLoadedAssets(loadedCount);
            setProgress((loadedCount / totalAssets) * 100);
            resolve();
          });
          audio.addEventListener('error', () => {
            // Continue even if audio fails
            loadedCount++;
            setLoadedAssets(loadedCount);
            setProgress((loadedCount / totalAssets) * 100);
            resolve();
          });
        } else {
          // Preload image
          const img = new Image();
          img.onload = () => {
            loadedCount++;
            setLoadedAssets(loadedCount);
            setProgress((loadedCount / totalAssets) * 100);
            resolve();
          };
          img.onerror = () => {
            // Continue even if image fails
            loadedCount++;
            setLoadedAssets(loadedCount);
            setProgress((loadedCount / totalAssets) * 100);
            resolve();
          };
          img.src = src;
        }
      });
    };

    const loadAllAssets = async () => {
      await Promise.all(gameAssets.map(loadAsset));
      // Small delay to show completion
      setTimeout(onComplete, 300);
    };

    loadAllAssets();
  }, [gameAssets, onComplete, totalAssets]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-4">
      <h2 className="text-2xl md:text-3xl mb-8 text-purple-400">Loading Game...</h2>
      
      <div className="w-64 mb-4">
        <Progress value={progress} className="h-2" />
      </div>
      
      <p className="text-sm text-gray-400">
        {loadedAssets}/{totalAssets} assets loaded
      </p>
      
      <div className="mt-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
      </div>
    </div>
  );
};

export default GamePreloader;
