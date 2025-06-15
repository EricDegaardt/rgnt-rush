
import React from 'react';

const Player = ({ y }: { y: number }) => {
    return (
        <div
            className="absolute transition-all duration-75 ease-out"
            style={{
                left: `100px`,
                bottom: `${y}px`,
                width: '100px',
                height: '50px',
                imageRendering: 'pixelated',
                zIndex: 10,
                backgroundImage: `url('/lovable-uploads/eaee9891-3b63-4bc0-b704-e40d80ffe56a.png')`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                // Add subtle rotation based on vertical position for more dynamic feel
                transform: `rotate(${Math.max(-10, Math.min(10, (y - 80) * 0.1))}deg)`,
            }}
        />
    );
};

export default Player;
