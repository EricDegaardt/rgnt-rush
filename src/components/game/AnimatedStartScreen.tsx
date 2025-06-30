import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface AnimatedStartScreenProps {
  onStartGame: () => void;
  onViewLeaderboard?: () => void;
}

const AnimatedStartScreen = ({ onStartGame, onViewLeaderboard }: AnimatedStartScreenProps) => {
  const [purpleBikeX, setPurpleBikeX] = useState(-200);
  const [blackBikeX, setBlackBikeX] = useState(-300);
  const [turboBikeX, setTurboBikeX] = useState(-400);
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
      setTurboBikeX(prev => {
        if (prev > 800) return -400;
        return prev + 12;
      });
    }, 50);

    return () => {
      clearTimeout(titleTimer);
      clearInterval(bikeAnimation);
    };
  }, []);

  const handleStartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onStartGame();
  };

  const handleLeaderboardClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onViewLeaderboard) {
      onViewLeaderboard();
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-b from-gray-900 via-black to-gray-900">
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

      {/* Racing Bikes - positioned on the gray street with more space */}
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

      <div 
        className="absolute z-10 transition-transform duration-75 ease-linear"
        style={{
          left: `${turboBikeX}px`,
          bottom: '30px', // Positioned on the gray street, slightly offset
          width: '126px',
          height: '63px',
          backgroundImage: "url('/lovable-uploads/rgnt-turbo.png')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          imageRendering: 'pixelated',
          filter: 'drop-shadow(0 4px 8px rgba(255, 165, 0, 0.5))',
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

      {/* Main Content - moved much closer to the top */}
      <div className="absolute top-16 left-0 right-0 flex flex-col items-center text-white p-4 text-center z-20">
        <div className={`transition-all duration-1000 ${showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-3xl md:text-5xl mb-1 text-purple-400 font-bold tracking-wider drop-shadow-lg">
            RGNT RUSH
          </h1>
          <div className="text-base md:text-lg mb-4 text-gray-300 font-medium">
            <span className="inline-block animate-pulse">⚡</span>
            <span className="mx-2">Electric Racing Adventure</span>
            <span className="inline-block animate-pulse">⚡</span>
          </div>
        </div>

        <div className={`transition-all duration-1000 delay-500 ${showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="mb-6 text-xs md:text-sm text-gray-400 max-w-md leading-relaxed">
            Race through neon city streets on your electric bike! Tap the screen or press space to jump, collect batteries, and dodge obstacles to go the distance!
          </p>
          
          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={handleStartClick}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-lg text-lg md:text-xl transform hover:scale-105 transition-all duration-200 shadow-lg shadow-purple-500/25"
            >
              START RACING
            </Button>
            
            {onViewLeaderboard && (
              <Button
                onClick={handleLeaderboardClick}
                variant="ghost"
                className="text-gray-400 hover:text-white text-sm px-4 py-2 rounded-lg border border-gray-600/50 hover:border-gray-500 transition-all duration-200 hover:bg-gray-800/30"
              >
                View Leaderboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedStartScreen;