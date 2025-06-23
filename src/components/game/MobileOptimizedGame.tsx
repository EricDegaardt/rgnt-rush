
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
import CompetitionEntry from './CompetitionEntry';
import GuestLeaderboard from './GuestLeaderboard';
import { useOptimizedGameLogic } from '../../hooks/useOptimizedGameLogic';
import { usePlayerInput } from '../../hooks/usePlayerInput';
import { useGameAudio } from '../../hooks/useGameAudio';
import { useGuestScores } from '../../hooks/useGuestScores';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';
import Road from './Road';

const MobileOptimizedGame = () => {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBikeSelection, setShowBikeSelection] = useState(false);
  const [showCompetitionEntry, setShowCompetitionEntry] = useState(false);
  const [selectedBike, setSelectedBike] = useState<string>('purple-rain');
  const [finalScore, setFinalScore] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);

  const { submitGuestScore, getTopScores } = useGuestScores();

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
    stopBackgroundMusic();
    playSound('gameOver');

    // Auto-save score locally
    if (score > 0) {
      submitGuestScore(score, Math.floor(score), selectedBike);
    }
  }, [stopBackgroundMusic, playSound, submitGuestScore, selectedBike]);

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

  // Bike images for preloading
  const bikeImages = ['/lovable-uploads/purple-rain.png', '/lovable-uploads/black-thunder.png'];
  
  if (isPreloading) {
    return <GamePreloader onComplete={handlePreloadComplete} bikeImages={bikeImages} />;
  }

  if (showBikeSelection) {
    return <BikeSelection onBikeSelect={handleBikeSelect} onBack={() => setShowBikeSelection(false)} />;
  }

  if (showCompetitionEntry) {
    return (
      <CompetitionEntry 
        score={finalScore}
        onClose={() => setShowCompetitionEntry(false)}
        onSuccess={() => {
          setShowCompetitionEntry(false);
          setShowLeaderboard(true);
        }}
      />
    );
  }

  if (!running && !gameOver) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-4 text-center">
        <div className="absolute top-4 right-4">
          <SoundToggle isMuted={isMuted} onToggle={toggleMute} />
        </div>
        
        <h1 className="text-3xl md:text-5xl mb-4 text-purple-400">RGNT RUSH</h1>
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
          <GuestLeaderboard onClose={() => setShowLeaderboard(false)} currentScore={0} />
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
      <div className="absolute top-4 right-4 z-10">
        <SoundToggle isMuted={isMuted} onToggle={toggleMute} />
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
          
          <div className="mt-8 space-y-4">
            <button
              onClick={() => setShowBikeSelection(true)}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-2xl block"
            >
              Play Again
            </button>
            
            <button
              onClick={() => setShowCompetitionEntry(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-lg block"
            >
              Enter Competition
            </button>
            
            <button
              onClick={() => setShowLeaderboard(true)}
              className="text-purple-300 underline"
            >
              View Leaderboard
            </button>
          </div>
          
          {showLeaderboard && (
            <GuestLeaderboard onClose={() => setShowLeaderboard(false)} currentScore={finalScore} />
          )}
        </div>
      )}
    </div>
  );
};

export default MobileOptimizedGame;
