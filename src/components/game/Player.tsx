
import React from 'react';

const Player = ({ y }: { y: number }) => {
    return (
        <div
            className="absolute transition-all duration-50 ease-linear"
            style={{
                left: `100px`,
                bottom: `${y}px`,
                width: '100px',
                height: '50px',
                imageRendering: 'pixelated',
                zIndex: 10,
                backgroundImage: `url('/lovable-uploads/b7deb829-7ece-471d-a8a0-f31de83fbf2.png')`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        />
    );
};

export default Player;
