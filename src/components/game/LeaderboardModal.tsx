import React, { useState, useEffect } from 'react';
import { X, Trophy, Medal, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase, LeaderboardEntry } from '@/lib/supabase';

interface LeaderboardModalProps {
  score: number;
  selectedBike: string;
  onClose: () => void;
  onPlayAgain: () => void;
}

const LeaderboardModal = ({ score, selectedBike, onClose, onPlayAgain }: LeaderboardModalProps) => {
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('distance', { ascending: false })
        .limit(10);

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  };

  const submitScore = async () => {
    if (!username.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const { error } = await supabase
        .from('leaderboard')
        .insert({
          username: username.trim(),
          distance: Math.floor(score),
          selected_bike: selectedBike
        });

      if (error) throw error;

      setHasSubmitted(true);
      await fetchLeaderboard(); // Refresh leaderboard after submission
    } catch (err) {
      console.error('Error submitting score:', err);
      setError('Failed to submit score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{index + 1}</span>;
    }
  };

  const getBikeEmoji = (bike: string) => {
    return bike === 'purple-rain' ? '🟣' : '⚫';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Leaderboard</h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-2"
          >
            <X size={24} />
          </Button>
        </div>
        
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-purple-400 mb-2">{Math.floor(score)}m</div>
          <p className="text-gray-300 text-sm">Your Distance</p>
        </div>

        {!hasSubmitted ? (
          <div className="mb-6">
            <p className="text-gray-300 text-sm mb-3">Enter your name to save your score:</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name"
                className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
                maxLength={20}
                disabled={isSubmitting}
              />
              <Button
                onClick={submitScore}
                disabled={!username.trim() || isSubmitting}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2"
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>
        ) : (
          <div className="mb-6 text-center">
            <p className="text-green-400 text-sm">✅ Score saved successfully!</p>
          </div>
        )}

        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3">Top 10 Riders</h4>
          {isLoading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : error && leaderboard.length === 0 ? (
            <div className="text-center text-red-400">{error}</div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    index < 3 ? 'bg-gradient-to-r from-purple-900/30 to-purple-800/30' : 'bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getRankIcon(index)}
                    <div>
                      <div className="text-white font-medium">{entry.username}</div>
                      <div className="text-gray-400 text-xs flex items-center gap-1">
                        {getBikeEmoji(entry.selected_bike)}
                        {new Date(entry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-purple-400 font-bold">{entry.distance}m</div>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <div className="text-center text-gray-400 py-4">
                  No scores yet. Be the first!
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onPlayAgain}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          >
            Play Again
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;