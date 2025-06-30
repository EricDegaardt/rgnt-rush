import React, { useState, useCallback } from 'react';
import Player from './Player';
import GameUI from './GameUI';
import Obstacle from './Obstacle';
import Collectible from './Collectible';
import Skyline from './Skyline';
import CollectionEffect from './CollectionEffect';
import SoundToggle from './SoundToggle';
import SplashEffect from './SplashEffect';
import BikeSelection from './BikeSelection';
import { useGameLogic } from '../../hooks/useGameLogic';
import { usePlayerInput } from '../../hooks/usePlayerInput';
import { useGameAudio } from '../../hooks/useGameAudio';
import { GAME_WIDTH, GAME_HEIGHT, ROAD_HEIGHT } from './constants';
import Road from './Road';

const Game = () => {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [username, setUsername] = useState('');
  const [showBikeSelection, setShowBikeSelection] = useState(false);
  const [selectedBike, setSelectedBike] = useState<string>('purple-rain');
  const [finalScore, setFinalScore] = useState(0);
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
    stopBackgroundMusic();
    playSound('gameOver');
  }, [stopBackgroundMusic, playSound]);

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

  const {
    distance,
    energy,
    playerY,
    obstacles,
    collectibles,
    collectionEffects,
    splashEffects,
    isSpinning,
    resetGame,
    handleJump,
    handleEffectComplete,
    handleSplashComplete
  } = useGameLogic(running, handleGameOver, handleSoundEvent);

  usePlayerInput(handleJump, gameOver);

  const startGame = () => {
    setGameOver(false);
    setFinalScore(0);
    resetGame();
    setRunning(true);
    startBackgroundMusic();
  };

  const handleBikeSelect = (bikeId: string) => {
    setSelectedBike(bikeId);
    setShowBikeSelection(false);
    startGame();
  };

  const handleScreenInteraction = () => {
    if (!running && !gameOver && !showBikeSelection) {
      // Let button handle start
    } else if (running && !gameOver) {
      handleJump();
    } else if (gameOver) {
      setShowBikeSelection(true);
    }
  };

  if (showBikeSelection) {
    return (
      <BikeSelection 
        onBikeSelect={handleBikeSelect}
        onBack={() => setShowBikeSelection(false)}
      />
    );
  }

  if (!running && !gameOver) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-4 text-center">
        <SoundToggle isMuted={isMuted} onToggle={toggleMute} />
        <h1 className="text-3xl md:text-5xl mb-4 text-purple-400">RGNT RUSH</h1>
        <p className="mb-8 text-sm md:text-base">Collect batteries and jump over oil barells by tapping the screen. Good Luck!</p>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-gray-800 border border-purple-400 p-2 rounded mb-4 text-center w-64"
        />
        <button
          onClick={() => setShowBikeSelection(true)}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-xl md:text-2xl animate-pulse"
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative bg-black w-full overflow-hidden"
      style={{
        maxWidth: `${GAME_WIDTH}px`,
        aspectRatio: '3 / 4'
      }}
      onClick={handleScreenInteraction}
    >
      <SoundToggle isMuted={isMuted} onToggle={toggleMute} />
      <Skyline />
      <Road />
      
      <Player y={playerY} isSpinning={isSpinning} gameOver={gameOver} selectedBike={selectedBike} />
      
      {obstacles.map(o => (
        <Obstacle key={o.id} {...o} />
      ))}
      {collectibles.map(c => (
        <Collectible key={c.id} {...c} />
      ))}
      {collectionEffects.map(effect => (
        <CollectionEffect
          key={effect.id}
          x={effect.x}
          y={effect.y}
          onComplete={() => handleEffectComplete(effect.id)}
        />
      ))}
      {splashEffects.map(effect => (
        <SplashEffect
          key={effect.id}
          x={effect.x}
          y={effect.y}
          onComplete={() => handleSplashComplete(effect.id)}
        />
      ))}
      
      <GameUI distance={distance} energy={energy} />

      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-center p-4">
          <h2 className="text-4xl text-red-500">Game Over</h2>
          <p className="text-xl mt-2">Distance: {Math.floor(finalScore)}m</p>
          <button
            onClick={() => setShowBikeSelection(true)}
            className="mt-8 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-2xl"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
