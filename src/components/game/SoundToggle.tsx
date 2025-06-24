import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundToggleProps {
    isMuted: boolean;
    onToggle: () => void;
}

const SoundToggle = ({ isMuted, onToggle }: SoundToggleProps) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent event bubbling to game container
        onToggle();
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent touch events from bubbling
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
    };

    return (
        <button
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="absolute top-32 right-4 p-2 bg-black bg-opacity-50 rounded text-white hover:bg-opacity-70 transition-all z-50 pointer-events-auto"
            title={isMuted ? 'Unmute' : 'Mute'}
            type="button"
            style={{ touchAction: 'none' }} // Prevent default touch behaviors
        >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
    );
};

export default SoundToggle;