
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface Score {
  id: string;
  username: string;
  distance: number;
  selected_bike: string;
  created_at: string;
}

export const useScoreboard = () => {
  const [scores, setScores] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTopScores = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('scoreboard')
        .select('*')
        .order('distance', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching scores:', error);
        return;
      }

      setScores(data || []);
    } catch (error) {
      console.error('Error fetching scores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveScore = async (username: string, distance: number, selectedBike: string) => {
    try {
      const { error } = await supabase
        .from('scoreboard')
        .insert({
          username: username || 'Anonymous',
          distance: Math.floor(distance),
          selected_bike: selectedBike
        });

      if (error) {
        console.error('Error saving score:', error);
        return false;
      }

      console.log('Score saved successfully');
      await fetchTopScores(); // Refresh the leaderboard
      return true;
    } catch (error) {
      console.error('Error saving score:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchTopScores();
  }, []);

  return {
    scores,
    isLoading,
    saveScore,
    refreshScores: fetchTopScores
  };
};
