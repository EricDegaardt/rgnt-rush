
import React from 'react';

const FAKE_SCORES = [
    { name: 'RGNT_MASTER', score: 9999 },
    { name: 'PixelRider', score: 8500 },
    { name: 'VoltJumper', score: 7230 },
    { name: '8BitBiker', score: 6100 },
    { name: 'USER', score: 5400 },
];

const Leaderboard = ({ onClose, currentScore }: { onClose: () => void, currentScore: number }) => {
    const scores = [...FAKE_SCORES, {name: "YOU", score: Math.floor(currentScore)}].sort((a,b) => b.score - a.score);
    return (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border-2 border-purple-500 p-4 md:p-8 rounded-lg text-white w-full max-w-md">
                <h2 className="text-xl md:text-3xl text-center mb-6 text-purple-400">Leaderboard</h2>
                <ol className="list-decimal list-inside space-y-2 text-sm md:text-lg">
                    {scores.map((score, index) => (
                        <li key={index} className={`flex justify-between p-1 rounded ${score.name === 'YOU' ? 'bg-purple-600' : ''}`}>
                            <span>{`${index + 1}. ${score.name}`}</span>
                            <span>{score.score}</span>
                        </li>
                    ))}
                </ol>
                <button
                    onClick={onClose}
                    className="mt-8 w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                >
                    Close
                </button>
                 <p className="text-xs text-center mt-4 text-gray-500">
                    Full leaderboard functionality requires a backend.
                </p>
            </div>
        </div>
    );
};

export default Leaderboard;
