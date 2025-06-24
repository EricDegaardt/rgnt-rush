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
        <div className="absolute top-4 right-4 flex items-center gap-2 p-2 bg-black bg-opacity-50 rounded text-white z-50">
            <span className="text-sm text-gray-300">Sound</span>
            <button
                onClick={handleClick}
                className="hover:bg-opacity-70 transition-all p-1 rounded"
                title={isMuted ? 'Unmute' : 'Mute'}
                type="button"
            >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
        </div>
    );
};

export default SoundToggle;