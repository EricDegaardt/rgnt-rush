
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
        }, 300); // Reduced time to remove particles faster

        // Start fading out
        const fadeTimer = setTimeout(() => {
            setOpacity(0);
        }, 350);

        // Complete and remove the effect
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 500); // Reduced total time

        return () => {
            clearTimeout(particleTimer);
            clearTimeout(fadeTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    // Don't render anything if particles are not showing and opacity is 0
    if (!showParticles && opacity === 0) {
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
                opacity,
                transition: 'opacity 150ms ease-out',
                zIndex: 998
            }}
        >
            <div className="w-full h-full relative">
                {/* Main splash particles - only show for a short time */}
                {showParticles && (
                    <div 
                        className="absolute inset-0"
                        style={{
                            animation: 'ping 0.3s ease-out forwards'
                        }}
                    >
                        <div 
                            className="w-4 h-4 bg-orange-500 rounded-full absolute top-2 left-2"
                            style={{
                                animation: 'bounce 0.3s ease-out forwards'
                            }}
                        ></div>
                        <div 
                            className="w-3 h-3 bg-red-500 rounded-full absolute top-4 right-3"
                            style={{
                                animation: 'bounce 0.3s ease-out forwards',
                                animationDelay: '0.05s'
                            }}
                        ></div>
                        <div 
                            className="w-2 h-2 bg-yellow-500 rounded-full absolute bottom-3 left-4"
                            style={{
                                animation: 'bounce 0.3s ease-out forwards',
                                animationDelay: '0.1s'
                            }}
                        ></div>
                        <div 
                            className="w-3 h-3 bg-orange-600 rounded-full absolute bottom-2 right-2"
                            style={{
                                animation: 'bounce 0.3s ease-out forwards',
                                animationDelay: '0.075s'
                            }}
                        ></div>
                        <div 
                            className="w-2 h-2 bg-red-600 rounded-full absolute top-6 left-8"
                            style={{
                                animation: 'bounce 0.3s ease-out forwards',
                                animationDelay: '0.125s'
                            }}
                        ></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SplashEffect;
