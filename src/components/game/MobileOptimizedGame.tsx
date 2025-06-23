
import React, { useState, useCallback } from 'react';
import BikeSelection from './BikeSelection';
import GamePreloader from './GamePreloader';
import CompetitionEntry from './CompetitionEntry';
import StartScreen from './StartScreen';
import GameScreen from './GameScreen';
import GameOverScreen from './GameOverScreen';
import { useOptimizedGameLogic } from '../../hooks/useOptimizedGameLogic';
import { usePlayerInput } from '../../hooks/usePlayerInput';
import { useGameAudio } from '../../hooks/useGameAudio';
import { useGuestScores } from '../../hooks/useGuestScores';

const MobileOptimizedGame = () => {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBikeSelection, setShowBikeSelection] = useState(false);
  const [showCompetitionEntry, setShowCompetitionEntry] = useState(false);
  const [selectedBike, setSelectedBike] = useState<string>('purple-rain');
  const [finalScore, setFinalScore] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);

  const { submitGuestScore } = useGuestScores();

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
      <StartScreen
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onStartGame={() => setShowBikeSelection(true)}
        showLeaderboard={showLeaderboard}
        onShowLeaderboard={setShowLeaderboard}
      />
    );
  }

  return (
    <>
      <GameScreen
        playerY={gameLogic.playerY}
        isSpinning={gameLogic.isSpinning}
        selectedBike={selectedBike}
        obstacles={gameLogic.obstacles}
        collectibles={gameLogic.collectibles}
        collectionEffects={gameLogic.collectionEffects}
        splashEffects={gameLogic.splashEffects}
        distance={gameLogic.distance}
        energy={gameLogic.energy}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onScreenInteraction={handleScreenInteraction}
        onEffectComplete={gameLogic.handleEffectComplete}
        onSplashComplete={gameLogic.handleSplashComplete}
      />

      {gameOver && (
        <GameOverScreen
          finalScore={finalScore}
          showLeaderboard={showLeaderboard}
          onShowLeaderboard={setShowLeaderboard}
          onPlayAgain={() => setShowBikeSelection(true)}
          onEnterCompetition={() => setShowCompetitionEntry(true)}
        />
      )}
    </>
  );
};

export default MobileOptimizedGame;
