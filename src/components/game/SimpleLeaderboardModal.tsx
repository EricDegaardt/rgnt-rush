import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase, LeaderboardEntry } from '@/lib/supabase';

interface SimpleLeaderboardModalProps {
  onClose: () => void;
  onStartRacing: () => void;
  isMobile?: boolean;
}

const SimpleLeaderboardModal = ({ onClose, onStartRacing, isMobile = false }: SimpleLeaderboardModalProps) => {
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
    const bikeImageUrl = bike === 'purple-rain' 
      ? '/lovable-uploads/purple-rain.png' 
      : '/lovable-uploads/black-thunder.png';
    
    return (
      <img 
        src={bikeImageUrl} 
        alt={bike} 
        className="w-10 h-auto object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
    );
  };

  // Desktop positioning: top-right corner with smaller size
  const containerClasses = isMobile 
    ? "fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]"
    : "absolute top-4 right-4 w-80 max-h-[calc(100vh-32px)] bg-black bg-opacity-90 rounded-lg shadow-2xl border border-gray-700 z-[9999] backdrop-blur-sm";

  const contentClasses = isMobile
    ? "w-full h-full max-w-lg mx-auto flex flex-col p-4 md:p-6 md:py-8 relative z-[10000]"
    : "w-full h-full flex flex-col relative z-[10000]";

  const cardClasses = isMobile
    ? "bg-gray-900 rounded-lg w-full flex flex-col overflow-hidden shadow-2xl border border-gray-700"
    : "w-full h-full flex flex-col overflow-hidden";

  const headerPadding = isMobile ? "p-4 md:p-6 pb-3 md:pb-4" : "p-3 pb-2";
  const contentPadding = isMobile ? "p-4 md:p-6 pt-3 md:pt-4" : "p-3 pt-2";
  const footerPadding = isMobile ? "p-4 md:p-6 pt-3 md:pt-4" : "p-3 pt-2";

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        <div className={cardClasses} style={{ maxHeight: '100%' }}>
          {/* Header with close button */}
          <div className={`flex-shrink-0 ${headerPadding} border-b border-gray-700 relative`}>
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 text-gray-400 hover:text-white transition-colors ${isMobile ? '' : 'top-3 right-3'}`}
            >
              <X className={isMobile ? 'w-6 h-6' : 'w-5 h-5'} />
            </button>
            <div className={isMobile ? "text-center pr-10" : "text-center pr-8"}>
              <h3 className={`font-bold text-white ${isMobile ? 'text-xl md:text-2xl' : 'text-lg'}`}>
                Top 10 Riders
              </h3>
              <p className={`text-gray-400 mt-1 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                Current leaderboard standings
              </p>
            </div>
          </div>

          {/* Scrollable leaderboard content */}
          <div className={`flex-1 overflow-y-auto ${contentPadding}`}>
            {isLoading ? (
              <div className={`text-center text-gray-400 ${isMobile ? 'py-8' : 'py-6'}`}>
                <div className={`animate-spin rounded-full border-b-2 border-purple-400 mx-auto mb-2 ${isMobile ? 'h-8 w-8' : 'h-6 w-6'}`}></div>
                <span className={isMobile ? 'text-sm' : 'text-xs'}>Loading...</span>
              </div>
            ) : error ? (
              <div className={`text-center text-red-400 ${isMobile ? 'py-8 text-sm' : 'py-6 text-xs'}`}>{error}</div>
            ) : (
              <div className={isMobile ? "space-y-3" : "space-y-2"}>
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between rounded-lg transition-all hover:scale-[1.02] ${
                      isMobile ? 'p-4' : 'p-2'
                    } ${
                      index < 3 
                        ? 'bg-gradient-to-r from-purple-900/40 to-purple-800/40 border border-purple-700/30' 
                        : 'bg-gray-800/60 border border-gray-700/30'
                    }`}
                  >
                    <div className={`flex items-center ${isMobile ? 'gap-4' : 'gap-2'}`}>
                      {getRankIcon(index)}
                      <div>
                        <div className={`text-white font-semibold ${isMobile ? 'text-base' : 'text-xs'}`}>
                          {entry.username}
                        </div>
                        <div className={`text-gray-400 mt-0.5 ${isMobile ? 'text-[10px]' : 'text-[8px]'}`}>
                          {new Date(entry.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className={`text-purple-400 font-bold ${isMobile ? 'text-lg' : 'text-sm'}`}>
                        {entry.distance}m
                      </div>
                      <div className={isMobile ? 'w-10' : 'w-6'}>
                        {getBikeImage(entry.selected_bike)}
                      </div>
                    </div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <div className={`text-center text-gray-400 ${isMobile ? 'py-8' : 'py-6'}`}>
                    <Trophy className={`mx-auto mb-3 opacity-50 ${isMobile ? 'w-12 h-12' : 'w-8 h-8'}`} />
                    <p className={isMobile ? 'text-lg' : 'text-xs'}>No scores yet. Be the first!</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer with Start Racing button */}
          <div className={`flex-shrink-0 ${footerPadding} border-t border-gray-700`}>
            <Button
              onClick={onStartRacing}
              className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] ${
                isMobile ? 'py-3 md:py-4 text-lg md:text-xl' : 'py-2 text-sm'
              }`}
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