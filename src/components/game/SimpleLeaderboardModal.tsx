import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase, LeaderboardEntry } from '@/lib/supabase';

interface SimpleLeaderboardModalProps {
  onClose: () => void;
  onStartRacing: () => void;
}

const SimpleLeaderboardModal = ({ onClose, onStartRacing }: SimpleLeaderboardModalProps) => {
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
        .from('scoreboard')
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

  const getBikeImage = (bike: string) => {
    const bikeImages = {
      'purple-rain': '/lovable-uploads/purple-rain.png',
      'black-thunder': '/lovable-uploads/black-thunder.png',
      'rgnt-turbo': '/lovable-uploads/rgnt-turbo.png'
    };
    const bikeImageUrl = bikeImages[bike as keyof typeof bikeImages] || bikeImages['purple-rain'];
    return (
      <img 
        src={bikeImageUrl} 
        alt={bike} 
        className="w-8 h-4 object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]">
      <div className="w-full h-full max-w-lg mx-auto flex flex-col p-4 md:p-6 md:py-8 relative z-[10000]">
        <div className="bg-gray-900 rounded-lg w-full flex flex-col overflow-hidden shadow-2xl border border-gray-700" style={{ maxHeight: '100%' }}>
          {/* Header with close button */}
          <div className="flex-shrink-0 p-4 md:p-6 pb-3 md:pb-4 border-b border-gray-700 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="text-center pr-10">
              <h3 className="text-xl md:text-2xl font-bold text-white">Top 10 Riders</h3>
              <p className="text-gray-400 text-sm mt-1">Current leaderboard standings</p>
            </div>
          </div>

          {/* Scrollable leaderboard content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-3 md:pt-4">
            {isLoading ? (
              <div className="text-center text-gray-400 py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                Loading...
              </div>
            ) : error ? (
              <div className="text-center text-red-400 py-8">{error}</div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all hover:scale-[1.02] ${
                      index < 3 
                        ? 'bg-gradient-to-r from-purple-900/40 to-purple-800/40 border border-purple-700/30' 
                        : 'bg-gray-800/60 border border-gray-700/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {getRankIcon(index)}
                      <div>
                        <div className="text-white font-semibold text-base">{entry.username}</div>
                        <div className="text-gray-400 text-[10px] mt-0.5">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-purple-400 font-bold text-lg">{entry.distance}m</div>
                      {getBikeImage(entry.selected_bike)}
                    </div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg">No scores yet. Be the first!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer with Start Racing button */}
          <div className="flex-shrink-0 p-4 md:p-6 pt-3 md:pt-4 border-t border-gray-700">
            <Button
              onClick={onStartRacing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 md:py-4 text-lg md:text-xl font-bold rounded-lg transition-all transform hover:scale-[1.02]"
            >
              Start Racing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLeaderboardModal;