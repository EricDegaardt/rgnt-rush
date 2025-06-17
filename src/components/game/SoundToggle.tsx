
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundToggleProps {
    isMuted: boolean;
    onToggle: () => void;
}

const SoundToggle = ({ isMuted, onToggle }: SoundToggleProps) => {
    return (
        <button
            onClick={onToggle}
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded text-white hover:bg-opacity-70 transition-all z-50"
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
        >
            {isMuted ? (
                <VolumeX size={24} className="text-red-400" />
            ) : (
                <Volume2 size={24} className="text-green-400" />
            )}
        </button>
    );
};

export default SoundToggle;
