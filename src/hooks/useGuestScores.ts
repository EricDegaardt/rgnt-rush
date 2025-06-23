
import { useState, useEffect } from 'react';

interface GuestScore {
  id: string;
  score: number;
  distance: number;
  bikeUsed: string;
  username: string;
  timestamp: string;
}

export const useGuestScores = () => {
  const [scores, setScores] = useState<GuestScore[]>([]);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const loadScores = () => {
      try {
        const savedScores = localStorage.getItem('guestScores');
        if (savedScores) {
          const parsedScores = JSON.parse(savedScores);
          setScores(parsedScores.sort((a: GuestScore, b: GuestScore) => b.score - a.score));
        }
      } catch (error) {
        console.error('Error loading guest scores:', error);
      }
    };

    const loadUsername = () => {
      try {
        const savedUsername = localStorage.getItem('playerUsername');
        if (savedUsername) {
          setUsername(savedUsername);
        }
      } catch (error) {
        console.error('Error loading username:', error);
      }
    };

    loadScores();
    loadUsername();
  }, []);

  const updateUsername = (newUsername: string) => {
    try {
      setUsername(newUsername);
      localStorage.setItem('playerUsername', newUsername);
    } catch (error) {
      console.error('Error saving username:', error);
    }
  };

  const submitGuestScore = (score: number, distance: number, bikeUsed: string) => {
    try {
      const newScore: GuestScore = {
        id: Date.now().toString(),
        score,
        distance,
        bikeUsed,
        username: username || 'Anonymous Player',
        timestamp: new Date().toISOString(),
      };

      const updatedScores = [...scores, newScore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Keep only top 10 scores

      setScores(updatedScores);
      localStorage.setItem('guestScores', JSON.stringify(updatedScores));
    } catch (error) {
      console.error('Error saving guest score:', error);
    }
  };

  const getTopScores = (limit: number = 10): GuestScore[] => {
    return scores.slice(0, limit);
  };

  return {
    scores,
    username,
    updateUsername,
    submitGuestScore,
    getTopScores,
  };
};
