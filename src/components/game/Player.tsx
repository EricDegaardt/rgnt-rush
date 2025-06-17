
import React, { useEffect, useState } from 'react';
import { PLAYER_X_POSITION } from './constants';

// Increased size by 20% (width: 120px, height: 60px)
const Player = ({ y, isSpinning }: { y: number; isSpinning?: boolean }) => {
    const [bounceOffset, setBounceOffset] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBounceOffset(prev => prev + 0.15); // Increment for smooth bounce
        }, 16); // ~60fps

        return () => clearInterval(interval);
    }, []);

    // Create a subtle bounce effect (2-3px amplitude)
    const bounceY = Math.sin(bounceOffset) * 2.5;

    return (
        <div
            className="absolute"
            style={{
                left: `${PLAYER_X_POSITION}px`,
                bottom: `${y + bounceY - 10}px`, // Position 10px lower to drive in the street
                width: '120px',
                height: '60px',
                imageRendering: 'pixelated',
                zIndex: 999, // Highest z-index to ensure bike is always on top
                backgroundImage: `url('/lovable-uploads/eaee9891-3b63-4bc0-b704-e40d80ffe56a.png')`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                // Combine rotation with subtle bounce tilt and controlled spin animation
                transform: `rotate(${Math.max(-5, Math.min(5, (y - 80) * 0.05))}deg)`,
                animation: isSpinning ? 'spin 800ms ease-out' : 'none',
            }}
        />
    );
};

export default Player;
