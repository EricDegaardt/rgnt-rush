
import React from 'react';
import GuestLeaderboard from './GuestLeaderboard';

interface GameOverScreenProps {
  finalScore: number;
  showLeaderboard: boolean;
  onShowLeaderboard: (show: boolean) => void;
  onPlayAgain: () => void;
  onEnterCompetition: () => void;
}

const GameOverScreen = ({
  finalScore,
  showLeaderboard,
  onShowLeaderboard,
  onPlayAgain,
  onEnterCompetition
}: GameOverScreenProps) => {
  const getGameOverMessage = (distance: number) => {
    if (distance < 500) {
      return {
        title: "Try again",
        color: "text-red-500"
      };
    } else if (distance < 1000) {
      return {
        title: "You can do better",
        color: "text-yellow-500"
      };
    } else if (distance < 1500) {
      return {
        title: "Awesome",
        color: "text-green-500"
      };
    } else {
      return {
        title: "Legendary",
        color: "text-purple-500"
      };
    }
  };

  const gameOverMessage = getGameOverMessage(finalScore);

  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-center p-4">
      <h2 className={`text-4xl ${gameOverMessage.color} font-bold`}>{gameOverMessage.title}</h2>
      <p className="text-xl mt-2">Distance: {Math.floor(finalScore)}m</p>
      
      <div className="mt-8 space-y-4">
        <button
          onClick={onPlayAgain}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-2xl block"
        >
          Play Again
        </button>
        
        <button
          onClick={onEnterCompetition}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-lg block"
        >
          Enter Competition
        </button>
        
        <button
          onClick={() => onShowLeaderboard(true)}
          className="text-purple-300 underline"
        >
          View Leaderboard
        </button>
      </div>
      
      {showLeaderboard && (
        <GuestLeaderboard onClose={() => onShowLeaderboard(false)} currentScore={finalScore} />
      )}
    </div>
  );
};

export default GameOverScreen;
