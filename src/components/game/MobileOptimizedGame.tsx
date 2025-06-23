
import React, { useState, useCallback } from 'react';
import OptimizedPlayer from './OptimizedPlayer';
import GameUI from './GameUI';
import Obstacle from './Obstacle';
import Collectible from './Collectible';
import Skyline from './Skyline';
import RealLeaderboard from './RealLeaderboard';
import CollectionEffect from './CollectionEffect';
import SoundToggle from './SoundToggle';
import SplashEffect from './SplashEffect';
import BikeSelection from './BikeSelection';
import GamePreloader from './GamePreloader';
import AuthPage from '../auth/AuthPage';
import { useOptimizedGameLogic } from '../../hooks/useOptimizedGameLogic';
import { usePlayerInput } from '../../hooks/usePlayerInput';
import { useGameAudio } from '../../hooks/useGameAudio';
import { useAuth } from '../../hooks/useAuth';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';
import { Button } from '@/components/ui/button';
import Road from './Road';

const MobileOptimizedGame = () => {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBikeSelection, setShowBikeSelection] = useState(false);
  const [selectedBike, setSelectedBike] = useState<string>('purple-rain');
  const [finalScore, setFinalScore] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  const { user, loading: authLoading, signOut } = useAuth();
  const { submitScore } = useLeaderboard();

  const {
    playSound,
    startBackgroundMusic,
    stopBackgroundMusic,
    toggleMute,
    isMuted
  } = useGameAudio();

  const handleGameOver = useCallback(async (score: number) => {
    setFinalScore(score);
    setGameOver(true);
    setRunning(false);
    setScoreSubmitted(false);
    stopBackgroundMusic();
    playSound('gameOver');

    // Auto-submit score for authenticated users
    if (user && score > 0) {
      await submitScore(score, Math.floor(score), selectedBike);
      setScoreSubmitted(true);
    }
  }, [stopBackgroundMusic, playSound, user, submitScore, selectedBike]);

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
    setScoreSubmitted(false);
    gameLogic.resetGame();
    setRunning(true);
    startBackgroundMusic();
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

  const handleScreenInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    if (!running && !gameOver && !showLeaderboard && !showBikeSelection) {
      // Let button handle start
    } else if (running && !gameOver) {
      gameLogic.handleJump();
    } else if (gameOver) {
      setShowBikeSelection(true);
    }
  }, [running, gameOver, showLeaderboard, showBikeSelection, gameLogic]);

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

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="text-2xl text-purple-400 mb-2">RGNT RUSH</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  // Show auth page if not authenticated
  if (!user) {
    return <AuthPage onSuccess={() => {}} />;
  }

  // Bike images for preloading
  const bikeImages = ['/lovable-uploads/purple-rain.png', '/lovable-uploads/black-thunder.png'];
  
  if (isPreloading) {
    return <GamePreloader onComplete={handlePreloadComplete} bikeImages={bikeImages} />;
  }

  if (showBikeSelection) {
    return <BikeSelection onBikeSelect={handleBikeSelect} onBack={() => setShowBikeSelection(false)} />;
  }

  if (!running && !gameOver) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-4 text-center">
        <div className="absolute top-4 right-4 flex gap-2">
          <SoundToggle isMuted={isMuted} onToggle={toggleMute} />
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Sign Out
          </Button>
        </div>
        
        <h1 className="text-3xl md:text-5xl mb-4 text-purple-400">RGNT RUSH</h1>
        <p className="mb-4 text-sm md:text-base">Welcome back, {user.email}!</p>
        <p className="mb-8 text-sm md:text-base">Collect batteries and jump over oil barrels by tapping the screen. Good Luck!</p>
        
        <button
          onClick={() => setShowBikeSelection(true)}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-xl md:text-2xl animate-pulse mb-4"
        >
          Start Game
        </button>
        
        <button
          onClick={() => {
            setFinalScore(0);
            setShowLeaderboard(true);
          }}
          className="text-purple-300 underline"
        >
          View Leaderboard
        </button>
        
        {showLeaderboard && (
          <RealLeaderboard onClose={() => setShowLeaderboard(false)} currentScore={0} />
        )}
      </div>
    );
  }

  const gameOverMessage = getGameOverMessage(finalScore);

  return (
    <div
      className="relative bg-black w-full overflow-hidden touch-none select-none"
      style={{
        maxWidth: `${GAME_WIDTH}px`,
        aspectRatio: '3 / 4',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
      onClick={handleScreenInteraction}
      onTouchStart={handleScreenInteraction}
    >
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <SoundToggle isMuted={isMuted} onToggle={toggleMute} />
        <Button
          onClick={signOut}
          variant="outline"
          size="sm"
          className="border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          Sign Out
        </Button>
      </div>
      
      <Skyline />
      <Road />
      
      <OptimizedPlayer y={gameLogic.playerY} isSpinning={gameLogic.isSpinning} gameOver={gameOver} selectedBike={selectedBike} isVisible={true} />
      
      {gameLogic.obstacles.map(o => <Obstacle key={o.id} {...o} />)}
      {gameLogic.collectibles.map(c => <Collectible key={c.id} {...c} />)}
      {gameLogic.collectionEffects.map(effect => <CollectionEffect key={effect.id} x={effect.x} y={effect.y} onComplete={() => gameLogic.handleEffectComplete(effect.id)} />)}
      {gameLogic.splashEffects.map(effect => <SplashEffect key={effect.id} x={effect.x} y={effect.y} onComplete={() => gameLogic.handleSplashComplete(effect.id)} />)}
      
      <GameUI distance={gameLogic.distance} energy={gameLogic.energy} />

      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-center p-4">
          <h2 className={`text-4xl ${gameOverMessage.color} font-bold`}>{gameOverMessage.title}</h2>
          <p className="text-xl mt-2">Distance: {Math.floor(finalScore)}m</p>
          {scoreSubmitted && (
            <p className="text-green-400 text-sm mt-1">✓ Score submitted to leaderboard!</p>
          )}
          <button
            onClick={() => setShowBikeSelection(true)}
            className="mt-8 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-2xl"
          >
            Play Again
          </button>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="mt-4 text-purple-300 underline"
          >
            View Leaderboard
          </button>
          {showLeaderboard && (
            <RealLeaderboard onClose={() => setShowLeaderboard(false)} currentScore={finalScore} />
          )}
        </div>
      )}
    </div>
  );
};

export default MobileOptimizedGame;
