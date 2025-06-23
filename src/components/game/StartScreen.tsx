
import React from 'react';
import SoundToggle from './SoundToggle';
import GuestLeaderboard from './GuestLeaderboard';

interface StartScreenProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onStartGame: () => void;
  showLeaderboard: boolean;
  onShowLeaderboard: (show: boolean) => void;
}

const StartScreen = ({
  isMuted,
  onToggleMute,
  onStartGame,
  showLeaderboard,
  onShowLeaderboard
}: StartScreenProps) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-4 text-center">
      <div className="absolute top-4 right-4">
        <SoundToggle isMuted={isMuted} onToggle={onToggleMute} />
      </div>
      
      <h1 className="text-3xl md:text-5xl mb-4 text-purple-400">RGNT RUSH</h1>
      <p className="mb-8 text-sm md:text-base">Collect batteries and jump over oil barrels by tapping the screen. Good Luck!</p>
      
      <button
        onClick={onStartGame}
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-xl md:text-2xl animate-pulse mb-4"
      >
        Start Game
      </button>
      
      <button
        onClick={() => onShowLeaderboard(true)}
        className="text-purple-300 underline"
      >
        View Leaderboard
      </button>
      
      {showLeaderboard && (
        <GuestLeaderboard onClose={() => onShowLeaderboard(false)} currentScore={0} />
      )}
    </div>
  );
};

export default StartScreen;
