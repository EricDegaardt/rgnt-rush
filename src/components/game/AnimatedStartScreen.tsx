import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SoundToggle from './SoundToggle';

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
        if (prev > 800) return -200;
        return prev + 8;
      });
      setBlackBikeX(prev => {
        if (prev > 800) return -300;
        return prev + 6;
      });
    }, 50);

    return () => {
      clearTimeout(titleTimer);
      clearInterval(bikeAnimation);
    };
  }, []);

  const handleStartGame = () => {
    if (username.trim()) {
      onStartGame();
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* CSS Animations */}
      <style>{`
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
        
        @keyframes cityMove {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .speed-line {
          animation: speedLine 1.5s linear infinite;
        }
        
        .city-bg {
          animation: cityMove 20s linear infinite;
        }
      `}</style>
      
      <SoundToggle isMuted={isMuted} onToggle={onToggleMute} />
      
      {/* Animated City Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="city-bg absolute bottom-0 left-0 w-[200%] h-64 opacity-30">
          {/* City silhouette */}
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-purple-900/20 to-transparent"></div>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 bg-gray-800"
              style={{
                left: `${i * 10}%`,
                width: `${3 + Math.random() * 4}%`,
                height: `${30 + Math.random() * 60}%`,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Road */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 border-t-4 border-gray-500">
        <div className="absolute top-6 left-0 w-full h-1 bg-white opacity-30"></div>
      </div>

      {/* Racing Bikes - positioned on the gray street */}
      <div 
        className="absolute z-10 transition-transform duration-75 ease-linear"
        style={{
          left: `${purpleBikeX}px`,
          bottom: '20px', // Positioned on the gray street
          width: '126px',
          height: '63px',
          backgroundImage: "url('/lovable-uploads/purple-rain.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          imageRendering: 'pixelated',
          filter: 'drop-shadow(0 4px 8px rgba(147, 51, 234, 0.5))',
        }}
      />
      
      <div 
        className="absolute z-10 transition-transform duration-75 ease-linear"
        style={{
          left: `${blackBikeX}px`,
          bottom: '25px', // Positioned on the gray street, slightly offset
          width: '126px',
          height: '63px',
          backgroundImage: "url('/lovable-uploads/black-thunder.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          imageRendering: 'pixelated',
          filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7))',
        }}
      />

      {/* Speed lines effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 bg-white opacity-20 speed-line"
            style={{
              top: `${20 + i * 25}%`,
              left: '0%',
              width: '100%',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 text-center z-20">
        <div className={`transition-all duration-1000 ${showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-6xl mb-2 text-purple-400 font-bold tracking-wider drop-shadow-lg">
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
            Race through neon city streets on your electric bike! Tap the screen or press space to jump, collect batteries, and dodge obstacles to go the distance!
          </p>
          
          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-800/80 border-2 border-purple-400/50 p-3 rounded-lg mb-4 text-center w-72 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors backdrop-blur-sm"
              required
            />
          </div>
          
          <div className="mx-8">
            <Button
              onClick={handleStartGame}
              disabled={!username.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-lg text-xl md:text-2xl transform hover:scale-105 transition-all duration-200 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              START RACING
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedStartScreen;