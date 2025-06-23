
import { useState, useEffect } from 'react';

interface LeaderboardEntry {
  name: string;
  distance: number;
  timestamp: number;
}

const LEADERBOARD_KEY = 'rgnt-rush-leaderboard';
const MAX_ENTRIES = 10;

export const useLocalLeaderboard = () => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const savedScores = localStorage.getItem(LEADERBOARD_KEY);
    if (savedScores) {
      try {
        setScores(JSON.parse(savedScores));
      } catch (error) {
        console.error('Error parsing leaderboard data:', error);
        setScores([]);
      }
    }
  }, []);

  const addScore = (name: string, distance: number) => {
    const newEntry: LeaderboardEntry = {
      name: name.trim() || 'Anonymous',
      distance: Math.floor(distance),
      timestamp: Date.now()
    };

    const updatedScores = [...scores, newEntry]
      .sort((a, b) => b.distance - a.distance) // Sort by distance descending
      .slice(0, MAX_ENTRIES); // Keep only top entries

    setScores(updatedScores);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updatedScores));
  };

  const clearLeaderboard = () => {
    setScores([]);
    localStorage.removeItem(LEADERBOARD_KEY);
  };

  return {
    scores,
    addScore,
    clearLeaderboard
  };
};
