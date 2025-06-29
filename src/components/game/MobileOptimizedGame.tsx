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
    setShowLeaderboard(true); // Show leaderboard immediately after game over
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
    setShowLeaderboard(false);
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
    }
    // Remove the game over screen interaction since leaderboard shows immediately
  }, [running, gameOver, showBikeSelection, showLeaderboard, gameLogic]);

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

        {/* Leaderboard Modal - Shows immediately after game over */}
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