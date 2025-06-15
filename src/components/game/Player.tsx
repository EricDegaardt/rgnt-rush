import React from 'react';
import { PLAYER_X_POSITION } from './constants';

// Increased size by 20% (width: 120px, height: 60px)
const Player = ({ y }: { y: number }) => {
    return (
        <div
            className="absolute"
            style={{
                left: `${PLAYER_X_POSITION}px`,
                bottom: `${y}px`,
                width: '120px',
                height: '60px',
                imageRendering: 'pixelated',
                zIndex: 10,
                backgroundImage: `url('/lovable-uploads/eaee9891-3b63-4bc0-b704-e40d80ffe56a.png')`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                // Adjust for bigger bike; keep similar effect
                transform: `rotate(${Math.max(-5, Math.min(5, (y - 80) * 0.05))}deg)`,
                transition: 'transform 150ms ease-linear',
            }}
        />
    );
};

export default Player;
