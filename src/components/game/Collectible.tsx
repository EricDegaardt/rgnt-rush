import React from 'react';
import { Zap } from 'lucide-react';

const Collectible = React.memo(({ x, y }: { x: number; y: number; }) => {
    // Convert from bottom-based positioning to top-based positioning
    const gameHeight = window.innerHeight;
    const topPosition = gameHeight - y - 30 - 30; // 30 is collectible height, 30px adjustment
    
    return (
        <div 
            className="absolute bg-green-500 border-2 border-green-700 rounded-full flex items-center justify-center"
            style={{
                width: `30px`,
                height: `30px`,
                transform: `translate3d(${x}px, ${topPosition}px, 0)`,
                willChange: 'transform',
            }}
        >
            <Zap size={20} className="text-yellow-300 fill-current" />
        </div>
    );
});

Collectible.displayName = 'Collectible';

export default Collectible;