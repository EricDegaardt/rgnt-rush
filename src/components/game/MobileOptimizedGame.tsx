import React, { useState, useCallback, useEffect } from 'react';
import OptimizedPlayer from './OptimizedPlayer';
import GameUI from './GameUI';
import Obstacle from './Obstacle';
import Collectible from './Collectible';
import Skyline from './Skyline';
import CollectionEffect from './CollectionEffect';
import SplashEffect from './SplashEffect';
import BikeSelection from './BikeSelection';
import GamePreloader from './GamePreloader';
import AnimatedStartScreen from './AnimatedStartScreen';
import VolumeSlider from './VolumeSlider';
import LeaderboardModal from './LeaderboardModal';
import { useOptimizedGameLogic } from '../../hooks/useOptimizedGameLogic';
import { usePlayerInput } from '../../hooks/usePlayerInput';
import { useGameAudio } from '../../hooks/useGameAudio';
import { Share2, Trophy } from 'lucide-react';
import Road from './Road';

interface MobileOptimizedGameProps {
  isMobile?: boolean;
}

const MobileOptimizedGame = ({ isMobile }: MobileOptimizedGameProps) => {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showBikeSelection, setShowBikeSelection] = useState(false);
  const [selectedBike, setSelectedBike] = useState<string>('purple-rain');
  const [finalScore, setFinalScore] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const {
    playSound,
    startBackgroundMusic,
    volume,
    setVolume
  } = useGameAudio();
  
  // Start background music when component mounts (start screen)
  useEffect(() => {
    startBackgroundMusic();
  }, [startBackgroundMusic]);
  
  const handleGameOver = useCallback((score: number) => {
    setFinalScore(score);
    setGameOver(true);
    setRunning(false);
    playSound('gameOver');
  }, [playSound]);
  
  const handleSoundEvent = useCallback((eventType: string) => {
    switch (eventType) {
      case 'jump':
        playSound('bikeJump');
        break;
      case 'collect':
        playSound('collectingBattery');
        break;
      case 'hit':
        playSound('hittingBarrel');
        break;
    }
  }, [playSound]);
  
  const gameLogic = useOptimizedGameLogic(running, handleGameOver, handleSoundEvent);
  usePlayerInput(gameLogic.handleJump, gameOver);
  
  const startGame = () => {
    setGameOver(false);
    setFinalScore(0);
    gameLogic.resetGame();
    setRunning(true);
  };
  
  const handleStartFromMenu = () => {
    setShowStartScreen(false);
    setShowBikeSelection(true);
  };
  
  const handleBikeSelect = (bikeId: string) => {
    setSelectedBike(bikeId);
    setShowBikeSelection(false);
    setIsPreloading(true);
  };
  
  const handlePreloadComplete = () => {
    setIsPreloading(false);
    startGame();
  };

  const handleShareScore = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const shareText = `🏍️ Just scored ${Math.floor(finalScore)}m in RGNT RUSH! Can you beat my score?`;
    const gameUrl = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'RGNT RUSH - My Score',
        text: shareText,
        url: gameUrl,
      }).catch(() => {
        // Fallback to clipboard when Web Share API fails
        console.warn('Web Share API failed, falling back to clipboard');
        navigator.clipboard.writeText(`${shareText}\n${gameUrl}`).then(() => {
          alert('Score copied to clipboard!');
        }).catch(() => {
          alert('Unable to share. Please copy the URL manually.');
        });
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText}\n${gameUrl}`).then(() => {
        alert('Score copied to clipboard!');
      }).catch(() => {
        alert('Unable to share. Please copy the URL manually.');
      });
    }
  };

  const handleShowLeaderboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowLeaderboard(true);
  };

  const handleCloseLeaderboard = () => {
    setShowLeaderboard(false);
  };

  const handlePlayAgain = () => {
    setGameOver(false);
    setShowLeaderboard(false);
    setShowBikeSelection(true);
  };
  
  const handleScreenInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    // Only handle specific game actions
    if (!running && !gameOver && !showBikeSelection && !showLeaderboard) {
      // Let button handle start
      return;
    } else if (running && !gameOver) {
      // Only trigger jump action
      gameLogic.handleJump();
    } else if (gameOver && !showLeaderboard) {
      // Only trigger play again if not showing any modals
      setShowBikeSelection(true);
    }
  }, [running, gameOver, showBikeSelection, showLeaderboard, gameLogic]);

  const getGameOverMessage = (distance: number) => {
    if (distance < 500) {
      return {
        title: "Try again",
        color: "text-red-500"
      };
    } else if (distance < 1000) {
      return {
        title: "You can do better",
        color: "text-yellow-500"
      };
    } else if (distance < 1500) {
      return {
        title: "Awesome",
        color: "text-green-500"
      };
    } else {
      return {
        title: "Legendary",
        color: "text-purple-500"
      };
    }
  };

  // Bike images for preloading
  const bikeImages = ['/lovable-uploads/purple-rain.png', '/lovable-uploads/black-thunder.png'];
  
  if (showStartScreen) {
    return (
      <div className="w-full h-full flex flex-col">
        {!isMobile && (
          <div className="w-full p-2">
            <VolumeSlider volume={volume} onVolumeChange={setVolume} />
          </div>
        )}
        <div className="flex-1">
          <AnimatedStartScreen onStartGame={handleStartFromMenu} />
        </div>
      </div>
    );
  }
  
  if (isPreloading) {
    return (
      <div className="w-full h-full flex flex-col">
        {!isMobile && (
          <div className="w-full p-2">
            <VolumeSlider volume={volume} onVolumeChange={setVolume} />
          </div>
        )}
        <div className="flex-1">
          <GamePreloader onComplete={handlePreloadComplete} bikeImages={bikeImages} />
        </div>
      </div>
    );
  }
  
  if (showBikeSelection) {
    return (
      <div className="w-full h-full flex flex-col">
        {!isMobile && (
          <div className="w-full p-2">
            <VolumeSlider volume={volume} onVolumeChange={setVolume} />
          </div>
        )}
        <div className="flex-1">
          <BikeSelection onBikeSelect={handleBikeSelect} />
        </div>
      </div>
    );
  }

  const gameOverMessage = getGameOverMessage(finalScore);

  return (
    <div className="w-full h-full flex flex-col">
      {!isMobile && (
        <div className="w-full p-2">
          <VolumeSlider volume={volume} onVolumeChange={setVolume} />
        </div>
      )}
      
      <div 
        className="flex-1 relative bg-black overflow-hidden touch-none select-none"
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          willChange: 'transform',
        }}
        onClick={handleScreenInteraction}
        onTouchStart={handleScreenInteraction}
      >
        <Skyline />
        <Road />
        
        <OptimizedPlayer y={gameLogic.playerY} isSpinning={gameLogic.isSpinning} gameOver={gameOver} selectedBike={selectedBike} isVisible={true} />
        
        {gameLogic.obstacles.map(o => <Obstacle key={o.id} {...o} />)}
        {gameLogic.collectibles.map(c => <Collectible key={c.id} {...c} />)}
        {gameLogic.collectionEffects.map(effect => <CollectionEffect key={effect.id} x={effect.x} y={effect.y} onComplete={() => gameLogic.handleEffectComplete(effect.id)} />)}
        {gameLogic.splashEffects.map(effect => <SplashEffect key={effect.id} x={effect.x} y={effect.y} onComplete={() => gameLogic.handleSplashComplete(effect.id)} />)}
        
        <GameUI distance={gameLogic.distance} energy={gameLogic.energy} />

        {/* Game Over Screen */}
        {gameOver && !showLeaderboard && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-center p-4">
            <h2 className={`text-4xl ${gameOverMessage.color} font-bold`}>{gameOverMessage.title}</h2>
            <p className="text-xl mt-2">Distance: {Math.floor(finalScore)}m</p>
            
            <div className="flex flex-col gap-3 mt-8">
              <div className="flex gap-3">
                <button 
                  onClick={handleShowLeaderboard}
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-xl flex items-center gap-2"
                >
                  <Trophy size={16} />
                  Leaderboard
                </button>
                <button 
                  onClick={handleShareScore}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-xl flex items-center gap-2"
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>
              <button 
                onClick={handlePlayAgain}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded text-xl w-full"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Leaderboard Modal */}
        {showLeaderboard && (
          <LeaderboardModal
            score={finalScore}
            selectedBike={selectedBike}
            onClose={handleCloseLeaderboard}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </div>
  );
};

export default MobileOptimizedGame;