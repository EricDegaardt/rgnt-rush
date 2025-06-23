
import React from 'react';
import { useSupabaseLeaderboard } from '../../hooks/useSupabaseLeaderboard';

const Leaderboard = ({ onClose, currentScore, currentBike }: { 
  onClose: () => void, 
  currentScore: number,
  currentBike?: string 
}) => {
    const { scores, loading } = useSupabaseLeaderboard();
    
    // Add current score to display (temporarily for this view)
    const displayScores = currentScore > 0 
        ? [...scores, { 
            id: 'current', 
            username: 'YOU (Current)', 
            distance: Math.floor(currentScore), 
            selected_bike: currentBike || 'unknown',
            created_at: new Date().toISOString()
          }]
            .sort((a, b) => b.distance - a.distance)
            .slice(0, 10)
        : scores;

    return (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border-2 border-purple-500 p-4 rounded-lg text-white w-full max-w-sm max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl text-center mb-4 text-purple-400 font-bold">Leaderboard</h2>
                
                {loading ? (
                    <p className="text-center text-gray-400 mb-4 text-sm">Loading scores...</p>
                ) : displayScores.length === 0 ? (
                    <p className="text-center text-gray-400 mb-4 text-sm">No scores yet. Be the first!</p>
                ) : (
                    <div className="mb-4">
                        {displayScores.map((score, index) => (
                            <div key={score.id} 
                                className={`flex justify-between items-center p-2 rounded mb-2 text-sm ${
                                    score.username.includes('Current') ? 'bg-purple-600' : 
                                    index < 3 ? 'bg-gray-800' : 'bg-gray-700'
                                }`}>
                                <div className="flex flex-col flex-1 mr-2">
                                    <span className="truncate text-xs">
                                        {index + 1}. {score.username}
                                        {index === 0 && !score.username.includes('Current') && ' 👑'}
                                    </span>
                                    <span className="text-xs text-gray-400 capitalize">
                                        {score.selected_bike.replace('-', ' ')}
                                    </span>
                                </div>
                                <span className="font-mono text-right text-xs font-bold">{score.distance}m</span>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={onClose}
                    className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-sm"
                >
                    Close
                </button>
                
                <p className="text-xs text-center mt-3 text-gray-500">
                    Scores are stored in the cloud and shared with all players.
                </p>
            </div>
        </div>
    );
};

export default Leaderboard;
