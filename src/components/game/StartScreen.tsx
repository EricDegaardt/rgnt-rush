
import React from 'react';
import SoundToggle from './SoundToggle';
import Leaderboard from './Leaderboard';

interface StartScreenProps {
  username: string;
  isMuted: boolean;
  showLeaderboard: boolean;
  onUsernameChange: (username: string) => void;
  onStartGame: () => void;
  onToggleMute: () => void;
  onShowLeaderboard: () => void;
  onCloseLeaderboard: () => void;
}

const StartScreen = ({
  username,
  isMuted,
  showLeaderboard,
  onUsernameChange,
  onStartGame,
  onToggleMute,
  onShowLeaderboard,
  onCloseLeaderboard
}: StartScreenProps) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-4 text-center">
      <SoundToggle isMuted={isMuted} onToggle={onToggleMute} />
      <h1 className="text-3xl md:text-5xl mb-4 text-purple-400">RGNT RUSH</h1>
      <p className="mb-8 text-sm md:text-base">Collect batteries and jump over oil barrels by tapping the screen. Good Luck!</p>
      <input 
        type="text" 
        placeholder="Enter your name" 
        value={username} 
        onChange={e => onUsernameChange(e.target.value)} 
        className="bg-gray-800 border border-purple-400 p-2 rounded mb-4 text-center w-64" 
        required
      />
      <button 
        onClick={onStartGame} 
        disabled={!username.trim()}
        className={`font-bold py-2 px-4 rounded text-xl md:text-2xl ${
          username.trim() 
            ? 'bg-purple-500 hover:bg-purple-700 text-white animate-pulse' 
            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
        }`}
      >
        Start Game
      </button>
      {!username.trim() && (
        <p className="text-red-400 text-sm mt-2">Please enter your name to start playing</p>
      )}
      <button 
        onClick={onShowLeaderboard} 
        className="mt-4 text-purple-300 underline"
      >
        Leaderboard
      </button>
      {showLeaderboard && (
        <Leaderboard 
          onClose={onCloseLeaderboard} 
          currentScore={0} 
        />
      )}
    </div>
  );
};

export default StartScreen;
