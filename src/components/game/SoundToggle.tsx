import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface SoundToggleProps {
    isMuted: boolean;
    onToggle: () => void;
}

const SoundToggle = ({ isMuted, onToggle }: SoundToggleProps) => {
    // This component is now just a visual representation
    // The actual click handling is done by the parent container
    return (
        <button
            className="p-2 bg-black bg-opacity-50 rounded text-white hover:bg-opacity-70 transition-all pointer-events-none"
            title={isMuted ? 'Unmute' : 'Mute'}
            type="button"
        >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
    );
};

export default SoundToggle;