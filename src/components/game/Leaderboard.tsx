
import React from 'react';
import { useScoreboard } from '../../hooks/useScoreboard';

const Leaderboard = ({ onClose, currentScore }: { onClose: () => void, currentScore: number }) => {
    const { scores, isLoading } = useScoreboard();

    return (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border-2 border-purple-500 p-4 md:p-8 rounded-lg text-white w-full max-w-md">
                <h2 className="text-xl md:text-3xl text-center mb-6 text-purple-400">Leaderboard</h2>
                
                {isLoading ? (
                    <div className="text-center text-gray-400">Loading scores...</div>
                ) : scores.length === 0 ? (
                    <div className="text-center text-gray-400">No scores yet. Be the first!</div>
                ) : (
                    <ol className="list-decimal list-inside space-y-2 text-sm md:text-lg">
                        {scores.map((score, index) => (
                            <li key={score.id} className={`flex justify-between p-1 rounded ${currentScore > 0 && Math.floor(currentScore) === score.distance ? 'bg-purple-600' : ''}`}>
                                <span>{`${index + 1}. ${score.username}`}</span>
                                <span>{score.distance}m</span>
                            </li>
                        ))}
                    </ol>
                )}
                
                <button
                    onClick={onClose}
                    className="mt-8 w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Leaderboard;
