
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

interface LeaderboardEntry {
  id: string;
  username: string;
  distance: number;
  selected_bike: string;
  created_at: string;
}

export const useSupabaseLeaderboard = () => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leaderboard_scores')
        .select('*')
        .order('distance', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return;
      }

      setScores(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const addScore = async (username: string, distance: number, selectedBike: string) => {
    try {
      const { error } = await supabase
        .from('leaderboard_scores')
        .insert({
          username: username.trim() || 'Anonymous',
          distance: Math.floor(distance),
          selected_bike: selectedBike
        });

      if (error) {
        console.error('Error adding score:', error);
        return false;
      }

      // Refresh the leaderboard after adding a score
      await fetchScores();
      return true;
    } catch (error) {
      console.error('Error adding score:', error);
      return false;
    }
  };

  return {
    scores,
    loading,
    addScore,
    refreshScores: fetchScores
  };
};
