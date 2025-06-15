
import React from 'react';

const Player = ({ y }: { y: number }) => {
    return (
        <div
            className="absolute transition-all duration-100 ease-out"
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
            }}
        />
    );
};

export default Player;
