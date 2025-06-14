
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
            }}
        >
            <img src="/lovable-uploads/b7deb829-7ece-471d-a8a0-f31de83fbf2.png" alt="Motorcycle" className="w-full h-full object-contain" />
        </div>
    );
};

export default Player;
