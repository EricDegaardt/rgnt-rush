
import React from 'react';
import SocialShare from './SocialShare';
import CompetitionEntry from './CompetitionEntry';
import Leaderboard from './Leaderboard';

interface GameOverScreenProps {
  username: string;
  finalScore: number;
  selectedBike: string;
  currentScoreId: string | null;
  isSubmittingEmail: boolean;
  showLeaderboard: boolean;
  onEmailSubmit: (email: string) => Promise<boolean>;
  onPlayAgain: () => void;
  onShowLeaderboard: () => void;
  onCloseLeaderboard: () => void;
}

const GameOverScreen = ({
  username,
  finalScore,
  selectedBike,
  currentScoreId,
  isSubmittingEmail,
  showLeaderboard,
  onEmailSubmit,
  onPlayAgain,
  onShowLeaderboard,
  onCloseLeaderboard
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
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-center p-4 overflow-y-auto">
      <h2 className={`text-4xl ${gameOverMessage.color} font-bold`}>{gameOverMessage.title}</h2>
      <p className="text-xl mt-2">Well done {username}!</p>
      <p className="text-xl mt-1">Distance: {Math.floor(finalScore)}m</p>
      
      <SocialShare 
        score={Math.floor(finalScore)} 
        username={username} 
        selectedBike={selectedBike} 
      />
      
      {currentScoreId && (
        <CompetitionEntry 
          onEmailSubmit={onEmailSubmit}
          isSubmitting={isSubmittingEmail}
        />
      )}
      
      <button 
        onClick={onPlayAgain} 
        className="mt-8 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-2xl"
      >
        Play Again
      </button>
      <button 
        onClick={onShowLeaderboard} 
        className="mt-4 text-purple-300 underline"
      >
        View Leaderboard
      </button>
      {showLeaderboard && (
        <Leaderboard 
          onClose={onCloseLeaderboard} 
          currentScore={finalScore} 
          currentBike={selectedBike} 
        />
      )}
    </div>
  );
};

export default GameOverScreen;
