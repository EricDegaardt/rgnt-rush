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
import SimpleLeaderboardModal from './SimpleLeaderboardModal';
import { useOptimizedGameLogic } from '../../hooks/useOptimizedGameLogic';
import { usePlayerInput } from '../../hooks/usePlayerInput';
import { useGameAudio } from '../../hooks/useGameAudio';
import Road from './Road';
import Countdown from './Countdown';

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
  const [showSimpleLeaderboard, setShowSimpleLeaderboard] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  const {
    playSound,
    startBackgroundMusic,
    volume,
    setVolume,
    initializeAudio,
    isAudioEnabled,
    isAudioInitialized
  } = useGameAudio();
  
  // Initialize audio on any user interaction
  const handleAudioInit = useCallback(async () => {
    if (!audioInitialized) {
      console.log('Initializing audio from user interaction...');
      await initializeAudio();
      setAudioInitialized(true);
    }
  }, [initializeAudio, audioInitialized]);

  // Initialize audio on first user interaction (start screen)
  useEffect(() => {
    const handleFirstInteraction = async (event: Event) => {
      console.log('First user interaction detected:', event.type);
      await handleAudioInit();
    };

    // Add event listeners for first user interaction
    const events = ['click', 'touchstart', 'touchend', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, { once: false, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, [handleAudioInit]);
  
  const handleGameOver = useCallback((score: number) => {
    setFinalScore(score);
    setGameOver(true);
    setRunning(false);
    setShowLeaderboard(true); // Show full leaderboard after game over
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
    setShowSimpleLeaderboard(false);
    gameLogic.resetGame();
    setRunning(true);
    // Start background music when game actually starts
    console.log('Starting game, attempting to play background music...');
    startBackgroundMusic();
  };
  
  const handleStartFromMenu = async () => {
    // Initialize audio on first interaction
    await handleAudioInit();
    setShowStartScreen(false);
    setShowBikeSelection(true);
  };

  const handleViewLeaderboard = async () => {
    // Initialize audio on first interaction
    await handleAudioInit();
    setShowStartScreen(false);
    setShowSimpleLeaderboard(true); // Show simple leaderboard from start screen
  };
  
  const handleBikeSelect = (bikeId: string) => {
    setSelectedBike(bikeId);
    setShowBikeSelection(false);
    setIsPreloading(true);
  };
  
  const handlePreloadComplete = () => {
    setIsPreloading(false);
    setShowCountdown(true);
  };

  const handleCloseLeaderboard = () => {
    setShowLeaderboard(false);
    if (!gameOver) {
      // If viewing leaderboard from start screen, go back to start screen
      setShowStartScreen(true);
    }
  };

  const handleCloseSimpleLeaderboard = () => {
    setShowSimpleLeaderboard(false);
    setShowStartScreen(true);
  };

  const handleStartRacingFromLeaderboard = () => {
    setShowSimpleLeaderboard(false);
    setShowBikeSelection(true);
  };

  const handlePlayAgain = () => {
    setGameOver(false);
    setShowLeaderboard(false);
    setShowBikeSelection(true);
  };
  
  const handleScreenInteraction = useCallback(async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    // Initialize audio on any interaction
    await handleAudioInit();

    // Only handle specific game actions
    if (!running && !gameOver && !showBikeSelection && !showLeaderboard && !showSimpleLeaderboard) {
      // Let button handle start
      return;
    } else if (running && !gameOver) {
      // Only trigger jump action
      gameLogic.handleJump();
    }
    // Remove the game over screen interaction since leaderboard shows immediately
  }, [running, gameOver, showBikeSelection, showLeaderboard, showSimpleLeaderboard, gameLogic, handleAudioInit]);

  // Bike images for preloading
  const bikeImages = ['/lovable-uploads/purple-rain.png', '/lovable-uploads/black-thunder.png', '/lovable-uploads/rgnt-turbo.png'];
  
  if (showStartScreen) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Only show volume slider on desktop */}
        {!isMobile && (
          <div className="w-full p-2">
            <VolumeSlider volume={volume} onVolumeChange={setVolume} />
          </div>
        )}
        <div className="flex-1">
          <AnimatedStartScreen 
            onStartGame={handleStartFromMenu} 
            onViewLeaderboard={handleViewLeaderboard}
          />
        </div>
        {/* Audio status indicator for debugging on mobile */}
        {isMobile && (
          <div className="absolute top-2 left-2 text-xs text-white bg-black bg-opacity-50 p-1 rounded">
            Audio: {isAudioEnabled ? 'Enabled' : 'Disabled'} | Init: {isAudioInitialized ? 'Yes' : 'No'}
          </div>
        )}
      </div>
    );
  }
  
  if (isPreloading) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Only show volume slider on desktop */}
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
        {/* Only show volume slider on desktop */}
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

  // Show simple leaderboard when accessed from start screen
  if (showSimpleLeaderboard) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Only show volume slider on desktop */}
        {!isMobile && (
          <div className="w-full p-2">
            <VolumeSlider volume={volume} onVolumeChange={setVolume} />
          </div>
        )}
        <div className="flex-1 relative">
          <SimpleLeaderboardModal
            onClose={handleCloseSimpleLeaderboard}
            onStartRacing={handleStartRacingFromLeaderboard}
          />
        </div>
      </div>
    );
  }

  if (showCountdown) {
    return (
      <Countdown onComplete={() => {
        setShowCountdown(false);
        startGame();
      }} />
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-black">
      {/* Only show volume slider on desktop */}
      {!isMobile && (
        <div className="w-full p-2">
          <VolumeSlider volume={volume} onVolumeChange={setVolume} />
        </div>
      )}
      <div 
        className="flex-1 relative bg-black overflow-hidden touch-none select-none shadow-2xl border border-gray-800 text-xs md:text-sm"
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          willChange: 'transform',
          aspectRatio: '3/4', // Maintain game aspect ratio
          minHeight: 0, // Allow flex shrinking
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
        
        <GameUI distance={gameLogic.distance} energy={gameLogic.energy} selectedBike={selectedBike} />

        {/* Full Leaderboard Modal - Shows after game over with score submission */}
        {showLeaderboard && (
          <LeaderboardModal
            score={finalScore}
            selectedBike={selectedBike}
            onClose={handleCloseLeaderboard}
            onPlayAgain={handlePlayAgain}
          />
        )}

        {/* Audio status indicator for debugging on mobile */}
        {isMobile && (
          <div className="absolute top-2 left-2 text-xs text-white bg-black bg-opacity-50 p-1 rounded">
            Audio: {isAudioEnabled ? 'Enabled' : 'Disabled'} | Init: {isAudioInitialized ? 'Yes' : 'No'}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileOptimizedGame;