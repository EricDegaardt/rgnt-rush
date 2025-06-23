
import React, { useState, useCallback } from 'react';
import OptimizedPlayer from './OptimizedPlayer';
import GameUI from './GameUI';
import Obstacle from './Obstacle';
import Collectible from './Collectible';
import Skyline from './Skyline';
import Leaderboard from './Leaderboard';
import CollectionEffect from './CollectionEffect';
import SoundToggle from './SoundToggle';
import SplashEffect from './SplashEffect';
import BikeSelection from './BikeSelection';
import GamePreloader from './GamePreloader';
import { useOptimizedGameLogic } from '../../hooks/useOptimizedGameLogic';
import { usePlayerInput } from '../../hooks/usePlayerInput';
import { useGameAudio } from '../../hooks/useGameAudio';
import { useSupabaseLeaderboard } from '../../hooks/useSupabaseLeaderboard';
import { GAME_WIDTH, GAME_HEIGHT } from './constants';
import Road from './Road';

const MobileOptimizedGame = () => {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [username, setUsername] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBikeSelection, setShowBikeSelection] = useState(false);
  const [selectedBike, setSelectedBike] = useState<string>('purple-rain');
  const [finalScore, setFinalScore] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  const { saveScore } = useSupabaseLeaderboard();

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
    setScoreSaved(false);
    stopBackgroundMusic();
    playSound('gameOver');

    // Auto-save score if username is provided
    if (username.trim()) {
      const success = await saveScore(username.trim(), score, selectedBike);
      if (success) {
        setScoreSaved(true);
      }
    }
  }, [stopBackgroundMusic, playSound, saveScore, username, selectedBike]);

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
    setScoreSaved(false);
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
        <SoundToggle isMuted={isMuted} onToggle={toggleMute} />
        <h1 className="text-3xl md:text-5xl mb-4 text-purple-400">RGNT RUSH</h1>
        <p className="mb-8 text-sm md:text-base">Collect batteries and jump over oil barrels by tapping the screen. Good Luck!</p>
        <input 
          type="text" 
          placeholder="Enter your name" 
          value={username} 
          onChange={e => setUsername(e.target.value)} 
          className="bg-gray-800 border border-purple-400 p-2 rounded mb-4 text-center w-64" 
        />
        <button 
          onClick={() => setShowBikeSelection(true)} 
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-xl md:text-2xl animate-pulse"
        >
          Start Game
        </button>
        <button 
          onClick={() => {
            setFinalScore(0);
            setShowLeaderboard(true);
          }} 
          className="mt-4 text-purple-300 underline"
        >
          Leaderboard
        </button>
        {showLeaderboard && (
          <Leaderboard 
            onClose={() => setShowLeaderboard(false)} 
            currentScore={0} 
          />
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
      <SoundToggle isMuted={isMuted} onToggle={toggleMute} />
      <Skyline />
      <Road />
      
      <OptimizedPlayer 
        y={gameLogic.playerY} 
        isSpinning={gameLogic.isSpinning} 
        gameOver={gameOver} 
        selectedBike={selectedBike} 
        isVisible={true} 
      />
      
      {gameLogic.obstacles.map(o => <Obstacle key={o.id} {...o} />)}
      {gameLogic.collectibles.map(c => <Collectible key={c.id} {...c} />)}
      {gameLogic.collectionEffects.map(effect => (
        <CollectionEffect 
          key={effect.id} 
          x={effect.x} 
          y={effect.y} 
          onComplete={() => gameLogic.handleEffectComplete(effect.id)} 
        />
      ))}
      {gameLogic.splashEffects.map(effect => (
        <SplashEffect 
          key={effect.id} 
          x={effect.x} 
          y={effect.y} 
          onComplete={() => gameLogic.handleSplashComplete(effect.id)} 
        />
      ))}
      
      <GameUI distance={gameLogic.distance} energy={gameLogic.energy} />

      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-center p-4">
          <h2 className={`text-4xl ${gameOverMessage.color} font-bold`}>{gameOverMessage.title}</h2>
          <p className="text-xl mt-2">Distance: {Math.floor(finalScore)}m</p>
          
          {scoreSaved && (
            <p className="text-green-400 mt-2 text-sm">✅ Score saved to leaderboard!</p>
          )}
          
          <div className="flex flex-col gap-3 mt-6 w-full max-w-xs">
            <button 
              onClick={() => setShowLeaderboard(true)} 
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded text-lg"
            >
              🏆 View Leaderboard
            </button>
            <button 
              onClick={() => setShowBikeSelection(true)} 
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-lg"
            >
              Play Again
            </button>
          </div>
          
          {showLeaderboard && (
            <Leaderboard 
              onClose={() => setShowLeaderboard(false)} 
              currentScore={finalScore}
              username={username}
              selectedBike={selectedBike}
              showSocialShare={true}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MobileOptimizedGame;
