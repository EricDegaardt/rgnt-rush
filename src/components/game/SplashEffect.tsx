
import React, { useEffect, useState } from 'react';

interface SplashEffectProps {
    x: number;
    y: number;
    onComplete: () => void;
}

const SplashEffect = ({ x, y, onComplete }: SplashEffectProps) => {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 600);

        const fadeTimer = setTimeout(() => {
            setOpacity(0);
        }, 400);

        return () => {
            clearTimeout(timer);
            clearTimeout(fadeTimer);
        };
    }, [onComplete]);

    return (
        <div
            className="absolute pointer-events-none"
            style={{
                left: `${x - 30}px`,
                bottom: `${y - 15}px`,
                width: '60px',
                height: '60px',
                opacity,
                transition: 'opacity 200ms ease-out',
                zIndex: 998
            }}
        >
            <div className="w-full h-full relative">
                {/* Main splash particles */}
                <div className="absolute inset-0 animate-ping">
                    <div className="w-4 h-4 bg-orange-500 rounded-full absolute top-2 left-2 animate-bounce"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full absolute top-4 right-3 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-yellow-500 rounded-full absolute bottom-3 left-4 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-3 h-3 bg-orange-600 rounded-full absolute bottom-2 right-2 animate-bounce" style={{animationDelay: '0.15s'}}></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full absolute top-6 left-8 animate-bounce" style={{animationDelay: '0.25s'}}></div>
                </div>
                
                {/* Secondary particles */}
                <div className="absolute inset-0 animate-pulse">
                    <div className="w-1 h-1 bg-orange-400 rounded-full absolute top-1 left-6"></div>
                    <div className="w-1 h-1 bg-red-400 rounded-full absolute top-8 right-1"></div>
                    <div className="w-1 h-1 bg-yellow-400 rounded-full absolute bottom-1 left-1"></div>
                    <div className="w-1 h-1 bg-orange-500 rounded-full absolute bottom-6 right-6"></div>
                </div>
            </div>
        </div>
    );
};

export default SplashEffect;
