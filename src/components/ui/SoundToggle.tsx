import React from 'react';

interface SoundToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

const SoundToggle: React.FC<SoundToggleProps> = ({ isMuted, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      aria-label={isMuted ? 'Unmute' : 'Mute'}
      className="bg-black bg-opacity-60 rounded-full p-2 shadow-md hover:bg-opacity-80 transition-colors"
    >
      {isMuted ? (
        // Muted icon
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13H5v-2h4l5-5v14l-5-5zm7.707-7.707a1 1 0 00-1.414 1.414l2.293 2.293-2.293 2.293a1 1 0 101.414 1.414l2.293-2.293 2.293 2.293a1 1 0 001.414-1.414l-2.293-2.293 2.293-2.293a1 1 0 00-1.414-1.414l-2.293 2.293-2.293-2.293z" />
        </svg>
      ) : (
        // Speaker icon
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13H5v-2h4l5-5v14l-5-5zm7 0a5 5 0 000-10v10z" />
        </svg>
      )}
    </button>
  );
};

export default SoundToggle; 