import React from 'react';
import { Zap } from 'lucide-react';

const Collectible = React.memo(({ x, y }: { x: number; y: number; }) => {
    return (
        <div 
            className="absolute bg-green-500 border-2 border-green-700 rounded-full flex items-center justify-center"
            style={{
                left: `${x}px`,
                bottom: `${y}px`,
                width: `30px`,
                height: `30px`,
            }}
        >
            <Zap size={20} className="text-yellow-300 fill-current" />
        </div>
    );
});

Collectible.displayName = 'Collectible';

export default Collectible;