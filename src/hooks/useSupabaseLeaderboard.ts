
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LeaderboardScore {
  id: string;
  username: string;
  distance: number;
  selected_bike: string;
  created_at: string;
}

export const useSupabaseLeaderboard = () => {
  const [scores, setScores] = useState<LeaderboardScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('leaderboard_scores')
        .select('*')
        .order('distance', { ascending: false })
        .limit(10);

      if (error) throw error;
      setScores(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const saveScore = async (username: string, distance: number, selectedBike: string) => {
    setError(null);
    
    try {
      const { error } = await supabase
        .from('leaderboard_scores')
        .insert({
          username: username.trim(),
          distance: Math.floor(distance),
          selected_bike: selectedBike
        });

      if (error) throw error;
      
      // Refresh leaderboard after saving
      await fetchLeaderboard();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save score');
      return false;
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return {
    scores,
    loading,
    error,
    saveScore,
    refreshLeaderboard: fetchLeaderboard
  };
};
