
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  distance: number;
  bike_used: string;
  created_at: string;
}

export const useLeaderboard = () => {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;
      setScores(data || []);
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitScore = async (score: number, distance: number, bikeUsed: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user profile for username
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      const { error } = await supabase
        .from('scores')
        .insert([{
          user_id: user.id,
          username: profile?.username || 'Anonymous',
          score,
          distance,
          bike_used: bikeUsed,
        }]);

      if (error) throw error;

      toast({
        title: "Score Submitted!",
        description: "Your score has been added to the leaderboard",
      });

      // Refresh leaderboard
      fetchLeaderboard();
    } catch (error: any) {
      console.error('Error submitting score:', error);
      toast({
        title: "Error",
        description: "Failed to submit score",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return {
    scores,
    loading,
    submitScore,
    refreshLeaderboard: fetchLeaderboard,
  };
};
