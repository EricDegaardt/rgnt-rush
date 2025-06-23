
import React from 'react';
import { useLocalLeaderboard } from '../../hooks/useLocalLeaderboard';

const Leaderboard = ({ onClose, currentScore }: { onClose: () => void, currentScore: number }) => {
    const { scores, clearLeaderboard } = useLocalLeaderboard();
    
    // Add current score to display (temporarily for this view)
    const displayScores = currentScore > 0 
        ? [...scores, { name: 'YOU (Current)', distance: Math.floor(currentScore), timestamp: Date.now() }]
            .sort((a, b) => b.distance - a.distance)
            .slice(0, 10)
        : scores;

    return (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border-2 border-purple-500 p-4 md:p-8 rounded-lg text-white w-full max-w-md">
                <h2 className="text-xl md:text-3xl text-center mb-6 text-purple-400">Leaderboard</h2>
                
                {displayScores.length === 0 ? (
                    <p className="text-center text-gray-400 mb-6">No scores yet. Be the first!</p>
                ) : (
                    <ol className="list-decimal list-inside space-y-2 text-sm md:text-lg mb-6">
                        {displayScores.map((score, index) => (
                            <li key={`${score.name}-${score.timestamp}`} 
                                className={`flex justify-between p-2 rounded ${
                                    score.name.includes('Current') ? 'bg-purple-600' : 
                                    index < 3 ? 'bg-gray-800' : ''
                                }`}>
                                <span className="truncate mr-2">
                                    {index + 1}. {score.name}
                                    {index === 0 && !score.name.includes('Current') && ' 👑'}
                                </span>
                                <span className="font-mono">{score.distance}m</span>
                            </li>
                        ))}
                    </ol>
                )}

                <div className="flex flex-col gap-2">
                    <button
                        onClick={onClose}
                        className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Close
                    </button>
                    
                    {scores.length > 0 && (
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to clear all scores?')) {
                                    clearLeaderboard();
                                }
                            }}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
                        >
                            Clear All Scores
                        </button>
                    )}
                </div>
                
                <p className="text-xs text-center mt-4 text-gray-500">
                    Scores are stored locally on your device.
                </p>
            </div>
        </div>
    );
};

export default Leaderboard;
