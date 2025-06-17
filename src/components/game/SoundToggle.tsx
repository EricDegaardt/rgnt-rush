
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
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded text-white hover:bg-opacity-70 transition-all"
            title={isMuted ? 'Unmute' : 'Mute'}
        >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
    );
};

export default SoundToggle;
