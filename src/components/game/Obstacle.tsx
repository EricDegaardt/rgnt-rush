import React from 'react';
import { ROAD_HEIGHT } from './constants';

const Obstacle = React.memo(({ x, width, height }: { x: number; width: number; height: number; }) => {
    return (
        <div 
            className="absolute"
            style={{
                left: `${x}px`,
                bottom: `${ROAD_HEIGHT}px`,
                width: `${width}px`,
                height: `${height}px`,
                backgroundImage: `url('/lovable-uploads/4c431529-ded5-45a9-9528-a852004e45ae.png')`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                imageRendering: 'pixelated',
                transform: 'scale(1.5)', // Make barrels 50% larger
            }}
        />
    );
});

Obstacle.displayName = 'Obstacle';

export default Obstacle;