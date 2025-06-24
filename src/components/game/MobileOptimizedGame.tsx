import React, { useState, useCallback } from 'react';
import OptimizedPlayer from './OptimizedPlayer';
import GameUI from './GameUI';
import Obstacle from './Obstacle';
import Collectible from './Collectible';
import Skyline from './Skyline';
import CollectionEffect from './CollectionEffect';
import SoundToggle from './SoundToggle';
import SplashEffect from './SplashEffect';
import BikeSelection from './BikeSelection';
import GamePreloader from './GamePreloader';
import ShareScore from './ShareScore';
import AnimatedStartScreen from './AnimatedStartScreen';
import { useOptimizedGameLogic } from '../../hooks/useOptimizedGameLogic';
import { usePlayerInput } from '../../hooks/usePlayerInput';
import { useGameAudio } from '../../hooks/useGameAudio';
import Road from './Road';

const MobileOptimizedGame = () => {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [username, setUsername] = useState('');
  const [showBikeSelection, setShowBikeSelection] = useState(false);
  const [selectedBike, setSelectedBike] = useState<string>('purple-rain');
  const [finalScore, setFinalScore] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);
  const [showShareScore, setShowShareScore] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  
  const {
    playSound,
    startBackgroundMusic,
    stopBackgroundMusic,
    toggleMute,
    isMuted
  } = useGameAudio();
  
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
    setShowShareScore(true);
  };

  const handleCloseShareScore = () => {
    setShowShareScore(false);
  };

  const handlePlayAgain = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGameOver(false);
    setShowShareScore(false);
    setShowBikeSelection(true);
  };

  // Completely isolated mute toggle handler
  const handleMuteToggle = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
    // Use setTimeout to ensure this doesn't interfere with any game state updates
    setTimeout(() => {
      toggleMute();
    }, 0);
  }, [toggleMute]);
  
  const handleScreenInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Prevent any interaction if the event originated from the mute button area
    const target = e.target as HTMLElement;
    const muteButton = target.closest('[data-mute-button]');
    if (muteButton) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Only handle specific game actions
    if (!running && !gameOver && !showBikeSelection && !showShareScore) {
      // Let button handle start
      return;
    } else if (running && !gameOver) {
      // Only trigger jump action
      gameLogic.handleJump();
    } else if (gameOver && !showShareScore) {
      // Only trigger play again if not showing share score
      setShowBikeSelection(true);
    }
  }, [running, gameOver, showBikeSelection, showShareScore, gameLogic]);

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
      <div className="w-full h-full">
        <AnimatedStartScreen onStartGame={handleStartFromMenu} isMuted={isMuted} onToggleMute={handleMuteToggle} />
      </div>
    );
  }
  
  if (isPreloading) {
    return (
      <div className="w-full h-full">
        <GamePreloader onComplete={handlePreloadComplete} bikeImages={bikeImages} />
      </div>
    );
  }
  
  if (showBikeSelection) {
    return (
      <div className="relative w-full h-full">
        <SoundToggle isMuted={isMuted} onToggle={handleMuteToggle} />
        <BikeSelection onBikeSelect={handleBikeSelect} />
      </div>
    );
  }

  const gameOverMessage = getGameOverMessage(finalScore);

  return (
    <div 
      className="relative bg-black w-full h-full overflow-hidden touch-none select-none" 
      style={{
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }} 
      onClick={handleScreenInteraction} 
      onTouchStart={handleScreenInteraction}
    >
      {/* Mute button with complete isolation */}
      <div 
        data-mute-button="true"
        className="absolute top-32 right-4 z-50 pointer-events-auto"
        onClick={handleMuteToggle}
        onTouchStart={handleMuteToggle}
        onTouchEnd={(e) => e.preventDefault()}
      >
        <SoundToggle isMuted={isMuted} onToggle={() => {}} />
      </div>
      
      <Skyline />
      <Road />
      
      <OptimizedPlayer y={gameLogic.playerY} isSpinning={gameLogic.isSpinning} gameOver={gameOver} selectedBike={selectedBike} isVisible={true} />
      
      {gameLogic.obstacles.map(o => <Obstacle key={o.id} {...o} />)}
      {gameLogic.collectibles.map(c => <Collectible key={c.id} {...c} />)}
      {gameLogic.collectionEffects.map(effect => <CollectionEffect key={effect.id} x={effect.x} y={effect.y} onComplete={() => gameLogic.handleEffectComplete(effect.id)} />)}
      {gameLogic.splashEffects.map(effect => <SplashEffect key={effect.id} x={effect.x} y={effect.y} onComplete={() => gameLogic.handleSplashComplete(effect.id)} />)}
      
      <GameUI distance={gameLogic.distance} energy={gameLogic.energy} />

      {gameOver && !showShareScore && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-center p-4">
          <h2 className={`text-4xl ${gameOverMessage.color} font-bold`}>{gameOverMessage.title}</h2>
          <p className="text-xl mt-2">Distance: {Math.floor(finalScore)}m</p>
          <div className="flex gap-4 mt-8">
            <button 
              onClick={handleShareScore}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-xl flex items-center gap-2"
            >
              Share Score
            </button>
            <button 
              onClick={handlePlayAgain}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-xl"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {showShareScore && (
        <ShareScore 
          score={finalScore} 
          onClose={handleCloseShareScore} 
        />
      )}
    </div>
  );
};

export default MobileOptimizedGame;