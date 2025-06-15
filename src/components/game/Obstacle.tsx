
import React from 'react';
import { ROAD_HEIGHT } from './constants';

const Obstacle = ({ x, width, height }: { x: number; width: number; height: number; }) => {
    return (
        <div 
            className="absolute bg-red-600 border-2 border-red-800 rounded-sm"
            style={{
                left: `${x}px`,
                bottom: `${ROAD_HEIGHT}px`,
                width: `${width}px`,
                height: `${height}px`,
            }}
        />
    );
};

export default Obstacle;
