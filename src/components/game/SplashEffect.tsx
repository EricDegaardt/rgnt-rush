
import React, { useEffect, useState } from 'react';

interface SplashEffectProps {
    x: number;
    y: number;
    onComplete: () => void;
}

const SplashEffect = ({ x, y, onComplete }: SplashEffectProps) => {
    const [showParticles, setShowParticles] = useState(true);

    useEffect(() => {
        // Remove particles quickly
        const particleTimer = setTimeout(() => {
            setShowParticles(false);
        }, 200); // Very short duration

        // Complete the effect shortly after
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 300);

        return () => {
            clearTimeout(particleTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    // Don't render anything if particles should not be showing
    if (!showParticles) {
        return null;
    }

    return (
        <div
            className="absolute pointer-events-none"
            style={{
                left: `${x - 30}px`,
                bottom: `${y - 15}px`,
                width: '60px',
                height: '60px',
                zIndex: 998
            }}
        >
            <div className="w-full h-full relative">
                <div 
                    className="w-4 h-4 bg-orange-500 rounded-full absolute top-2 left-2"
                    style={{
                        animation: 'bounce 0.2s ease-out forwards'
                    }}
                ></div>
                <div 
                    className="w-3 h-3 bg-red-500 rounded-full absolute top-4 right-3"
                    style={{
                        animation: 'bounce 0.2s ease-out forwards',
                        animationDelay: '0.05s'
                    }}
                ></div>
                <div 
                    className="w-2 h-2 bg-yellow-500 rounded-full absolute bottom-3 left-4"
                    style={{
                        animation: 'bounce 0.2s ease-out forwards',
                        animationDelay: '0.1s'
                    }}
                ></div>
                <div 
                    className="w-3 h-3 bg-orange-600 rounded-full absolute bottom-2 right-2"
                    style={{
                        animation: 'bounce 0.2s ease-out forwards',
                        animationDelay: '0.075s'
                    }}
                ></div>
                <div 
                    className="w-2 h-2 bg-red-600 rounded-full absolute top-6 left-8"
                    style={{
                        animation: 'bounce 0.2s ease-out forwards',
                        animationDelay: '0.125s'
                    }}
                ></div>
            </div>
        </div>
    );
};

export default SplashEffect;
