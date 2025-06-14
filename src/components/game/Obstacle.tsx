
import React from 'react';

const Obstacle = ({ x, width, height }: { x: number; width: number; height: number; }) => {
    return (
        <div 
            className="absolute bg-red-600 border-2 border-red-800 rounded-sm"
            style={{
                left: `${x}px`,
                bottom: `80px`, // Road height
                width: `${width}px`,
                height: `${height}px`,
            }}
        />
    );
};

export default Obstacle;
