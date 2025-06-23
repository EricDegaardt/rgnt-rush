import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SoundToggle from './SoundToggle';
import Skyline from './Skyline';
import Road from './Road';

interface AnimatedStartScreenProps {
  onStartGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const AnimatedStartScreen = ({ onStartGame, isMuted, onToggleMute }: AnimatedStartScreenProps) => {
  const [username, setUsername] = useState('');
  const [purpleBikeX, setPurpleBikeX] = useState(-200);
  const [blackBikeX, setBlackBikeX] = useState(-300);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    // Animate title appearance
    const titleTimer = setTimeout(() => setShowTitle(true), 500);

    // Animate bikes racing across screen
    const bikeAnimation = setInterval(() => {
      setPurpleBikeX(prev => {
        if (prev > window.innerWidth + 200) return -200;
        return prev + 8;
      });
      setBlackBikeX(prev => {
        if (prev > window.innerWidth + 200) return -300;
        return prev + 6;
      });
    }, 50);

    return () => {
      clearTimeout(titleTimer);
      clearInterval(bikeAnimation);
    };
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      <SoundToggle isMuted={isMuted} onToggle={onToggleMute} />
      
      {/* Background */}
      <Skyline />
      <Road />
      
      {/* Racing Bikes */}
      <div 
        className="absolute transition-transform duration-75 ease-linear z-10"
        style={{
          left: `${purpleBikeX}px`,
          bottom: '80px',
          width: '126px',
          height: '63px',
          backgroundImage: "url('/lovable-uploads/purple-rain.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          imageRendering: 'pixelated',
          filter: 'drop-shadow(0 4px 8px rgba(147, 51, 234, 0.3))',
        }}
      />
      
      <div 
        className="absolute transition-transform duration-75 ease-linear z-10"
        style={{
          left: `${blackBikeX}px`,
          bottom: '90px',
          width: '126px',
          height: '63px',
          backgroundImage: "url('/lovable-uploads/black-thunder.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          imageRendering: 'pixelated',
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
        }}
      />

      {/* Speed lines effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 bg-white opacity-20"
            style={{
              top: `${20 + i * 30}%`,
              left: '0%',
              width: '100%',
              animation: `speedLine 1.5s linear infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center z-20">
        <div className={`transition-all duration-1000 ${showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-6xl mb-2 text-purple-400 font-bold tracking-wider">
            RGNT RUSH
          </h1>
          <div className="text-lg md:text-xl mb-8 text-gray-300 font-medium">
            <span className="inline-block animate-pulse">⚡</span>
            <span className="mx-2">Electric Racing Adventure</span>
            <span className="inline-block animate-pulse">⚡</span>
          </div>
        </div>

        <div className={`transition-all duration-1000 delay-500 ${showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="mb-8 text-sm md:text-base text-gray-400 max-w-md leading-relaxed">
            Race through the neon-lit city streets! Collect batteries, dodge obstacles, and see how far you can go in this high-speed electric bike adventure.
          </p>
          
          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter your rider name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-800/80 border-2 border-purple-400/50 p-3 rounded-lg mb-4 text-center w-72 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors backdrop-blur-sm"
            />
          </div>
          
          <Button
            onClick={onStartGame}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-lg text-xl md:text-2xl transform hover:scale-105 transition-all duration-200 shadow-lg shadow-purple-500/25"
          >
            <span className="flex items-center gap-3">
              🏍️ START RACING
            </span>
          </Button>
          
          <div className="mt-6 text-xs text-gray-500">
            <p>🎮 Tap screen or press SPACE to jump</p>
            <p>⚡ Collect batteries • 🛢️ Avoid oil barrels</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes speedLine {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedStartScreen;