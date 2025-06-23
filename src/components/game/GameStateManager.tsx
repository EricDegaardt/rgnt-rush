
import { useState, useCallback } from 'react';
import { useSupabaseLeaderboard } from '../../hooks/useSupabaseLeaderboard';
import { useGameAudio } from '../../hooks/useGameAudio';

export const useGameStateManager = () => {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [username, setUsername] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showBikeSelection, setShowBikeSelection] = useState(false);
  const [selectedBike, setSelectedBike] = useState<string>('purple-rain');
  const [finalScore, setFinalScore] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [currentScoreId, setCurrentScoreId] = useState<string | null>(null);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);

  const { addScore, updateScoreWithEmail } = useSupabaseLeaderboard();
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
    
    // Only submit score once per game session
    if (username.trim() && !scoreSubmitted) {
      setScoreSubmitted(true);
      console.log('Submitting score:', { username: username.trim(), score, selectedBike });
      const scoreData = await addScore(username.trim(), score, selectedBike);
      if (scoreData) {
        setCurrentScoreId(scoreData.id);
        console.log('Score submitted successfully:', scoreData.id);
      } else {
        console.error('Failed to submit score to leaderboard');
      }
    }
  }, [stopBackgroundMusic, playSound, username, selectedBike, addScore, scoreSubmitted]);

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

  const startGame = () => {
    setGameOver(false);
    setFinalScore(0);
    // Reset score submission state for new game
    setScoreSubmitted(false);
    setCurrentScoreId(null);
    setShowLeaderboard(false);
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

  const handleEmailSubmit = async (email: string): Promise<boolean> => {
    if (!currentScoreId) return false;
    
    setIsSubmittingEmail(true);
    const success = await updateScoreWithEmail(currentScoreId, email);
    setIsSubmittingEmail(false);
    return success;
  };

  return {
    // State
    running,
    gameOver,
    username,
    showLeaderboard,
    showBikeSelection,
    selectedBike,
    finalScore,
    isPreloading,
    currentScoreId,
    isSubmittingEmail,
    isMuted,
    
    // Actions
    setUsername,
    setShowLeaderboard,
    setShowBikeSelection,
    handleGameOver,
    handleSoundEvent,
    handleBikeSelect,
    handlePreloadComplete,
    handleEmailSubmit,
    toggleMute
  };
};
