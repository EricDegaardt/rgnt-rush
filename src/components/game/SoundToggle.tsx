import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundToggleProps {
    isMuted: boolean;
    onToggle: () => void;
}

const SoundToggle = ({ isMuted, onToggle }: SoundToggleProps) => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event bubbling
        console.log('Sound toggle clicked, current muted state:', isMuted); // Debug log
        onToggle();
    };

    return (
        <button
            onClick={handleClick}
            className="p-2 bg-black bg-opacity-50 rounded text-white hover:bg-opacity-70 transition-all z-50"
            title={isMuted ? 'Unmute' : 'Mute'}
            type="button"
        >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
    );
};

export default SoundToggle;