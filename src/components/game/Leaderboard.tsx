
import React from 'react';
import { useSupabaseLeaderboard, LeaderboardScore } from '../../hooks/useSupabaseLeaderboard';
import SocialShare from './SocialShare';

interface LeaderboardProps {
  onClose: () => void;
  currentScore?: number;
  username?: string;
  selectedBike?: string;
  showSocialShare?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  onClose, 
  currentScore, 
  username, 
  selectedBike,
  showSocialShare = false 
}) => {
  const { scores, loading, error } = useSupabaseLeaderboard();

  const formatBikeName = (bike: string) => {
    return bike.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-purple-500 p-4 md:p-6 rounded-lg text-white w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl md:text-2xl text-center mb-4 text-purple-400">🏆 Leaderboard</h2>
        
        {loading && (
          <div className="text-center text-gray-400 py-4">Loading scores...</div>
        )}

        {error && (
          <div className="text-center text-red-400 py-4 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {scores.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-2">🏍️</div>
                <p>No scores yet!</p>
                <p className="text-sm">Be the first to make it on the leaderboard!</p>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                {scores.map((score, index) => (
                  <div 
                    key={score.id} 
                    className={`flex justify-between items-center p-2 rounded text-sm ${
                      index === 0 ? 'bg-yellow-600/20 border border-yellow-500' :
                      index === 1 ? 'bg-gray-600/20 border border-gray-400' :
                      index === 2 ? 'bg-orange-600/20 border border-orange-500' :
                      'bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-purple-300 font-bold w-6">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                      </span>
                      <div>
                        <div className="font-medium">{score.username}</div>
                        <div className="text-xs text-gray-400">
                          {formatBikeName(score.selected_bike)} • {formatDate(score.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{score.distance}m</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {showSocialShare && currentScore && username && selectedBike && (
          <SocialShare 
            username={username}
            distance={currentScore}
            selectedBike={selectedBike}
          />
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
