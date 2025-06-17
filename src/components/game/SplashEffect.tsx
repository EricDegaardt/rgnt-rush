
import React, { useEffect, useState } from 'react';

interface SplashEffectProps {
    x: number;
    y: number;
    onComplete: () => void;
}

const SplashEffect = ({ x, y, onComplete }: SplashEffectProps) => {
    const [opacity, setOpacity] = useState(1);
    const [showParticles, setShowParticles] = useState(true);

    useEffect(() => {
        // Stop the particles animation early to prevent infinite looping
        const particleTimer = setTimeout(() => {
            setShowParticles(false);
        }, 400);

        // Start fading out
        const fadeTimer = setTimeout(() => {
            setOpacity(0);
        }, 400);

        // Complete and remove the effect
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 600);

        return () => {
            clearTimeout(particleTimer);
            clearTimeout(fadeTimer);
            clearTimeout(completeTimer);
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
                {/* Main splash particles - only show for a short time */}
                {showParticles && (
                    <div 
                        className="absolute inset-0"
                        style={{
                            animation: 'ping 0.4s ease-out forwards'
                        }}
                    >
                        <div 
                            className="w-4 h-4 bg-orange-500 rounded-full absolute top-2 left-2"
                            style={{
                                animation: 'bounce 0.4s ease-out forwards'
                            }}
                        ></div>
                        <div 
                            className="w-3 h-3 bg-red-500 rounded-full absolute top-4 right-3"
                            style={{
                                animation: 'bounce 0.4s ease-out forwards',
                                animationDelay: '0.1s'
                            }}
                        ></div>
                        <div 
                            className="w-2 h-2 bg-yellow-500 rounded-full absolute bottom-3 left-4"
                            style={{
                                animation: 'bounce 0.4s ease-out forwards',
                                animationDelay: '0.2s'
                            }}
                        ></div>
                        <div 
                            className="w-3 h-3 bg-orange-600 rounded-full absolute bottom-2 right-2"
                            style={{
                                animation: 'bounce 0.4s ease-out forwards',
                                animationDelay: '0.15s'
                            }}
                        ></div>
                        <div 
                            className="w-2 h-2 bg-red-600 rounded-full absolute top-6 left-8"
                            style={{
                                animation: 'bounce 0.4s ease-out forwards',
                                animationDelay: '0.25s'
                            }}
                        ></div>
                    </div>
                )}
                
                {/* Secondary particles - also limited duration */}
                {showParticles && (
                    <div 
                        className="absolute inset-0"
                        style={{
                            animation: 'pulse 0.4s ease-out forwards'
                        }}
                    >
                        <div className="w-1 h-1 bg-orange-400 rounded-full absolute top-1 left-6"></div>
                        <div className="w-1 h-1 bg-red-400 rounded-full absolute top-8 right-1"></div>
                        <div className="w-1 h-1 bg-yellow-400 rounded-full absolute bottom-1 left-1"></div>
                        <div className="w-1 h-1 bg-orange-500 rounded-full absolute bottom-6 right-6"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SplashEffect;
