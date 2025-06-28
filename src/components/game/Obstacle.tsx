import React from 'react';
import { ROAD_HEIGHT } from './constants';

const Obstacle = React.memo(({ x, width, height }: { x: number; width: number; height: number; }) => {
    // Convert from bottom-based positioning to top-based positioning
    const gameHeight = window.innerHeight;
    const topPosition = gameHeight - ROAD_HEIGHT - height - 30; // Added 30px adjustment
    
    return (
        <div 
            className="absolute"
            style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundImage: `url('/lovable-uploads/4c431529-ded5-45a9-9528-a852004e45ae.png')`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                imageRendering: 'pixelated',
                transform: `translate3d(${x}px, ${topPosition}px, 0) scale(1.5)`,
                willChange: 'transform',
            }}
        />
    );
});

Obstacle.displayName = 'Obstacle';

export default Obstacle;