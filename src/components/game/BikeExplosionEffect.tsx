
import React, { useEffect, useState } from 'react';

interface BikeExplosionEffectProps {
    x: number;
    y: number;
    onComplete: () => void;
}

const BikeExplosionEffect = ({ x, y, onComplete }: BikeExplosionEffectProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Hide the effect after animation completes
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, 800);

        // Complete and remove the effect
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 900);

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    if (!isVisible) {
        return null;
    }

    // Custom CSS for explosion animation
    const explosionKeyframes = `
        @keyframes explode {
            0% { 
                transform: translateY(0px) scale(0.5); 
                opacity: 1; 
            }
            30% { 
                transform: translateY(-20px) scale(1.2); 
                opacity: 0.9; 
            }
            70% { 
                transform: translateY(-10px) scale(1.5); 
                opacity: 0.6; 
            }
            100% { 
                transform: translateY(-30px) scale(2); 
                opacity: 0; 
            }
        }
        
        @keyframes explodeSpread {
            0% { 
                transform: translate(0px, 0px) scale(0.3); 
                opacity: 1; 
            }
            50% { 
                opacity: 0.8; 
            }
            100% { 
                opacity: 0; 
            }
        }
    `;

    return (
        <>
            <style>{explosionKeyframes}</style>
            <div
                className="absolute pointer-events-none"
                style={{
                    left: `${x - 50}px`,
                    bottom: `${y - 25}px`,
                    width: '100px',
                    height: '100px',
                    zIndex: 1000 // Higher than player to ensure visibility
                }}
            >
                <div className="w-full h-full relative">
                    {/* Central explosion */}
                    <div 
                        className="w-8 h-8 bg-red-500 rounded-full absolute top-8 left-8"
                        style={{ animation: 'explode 800ms ease-out forwards' }}
                    ></div>
                    <div 
                        className="w-6 h-6 bg-orange-400 rounded-full absolute top-9 left-9"
                        style={{ animation: 'explode 800ms ease-out forwards 50ms' }}
                    ></div>
                    <div 
                        className="w-4 h-4 bg-yellow-300 rounded-full absolute top-10 left-10"
                        style={{ animation: 'explode 800ms ease-out forwards 100ms' }}
                    ></div>
                    
                    {/* Spreading particles */}
                    <div 
                        className="w-5 h-5 bg-red-600 rounded-full absolute top-4 left-12"
                        style={{ animation: 'explodeSpread 600ms ease-out forwards', transform: 'translate(30px, -20px)' }}
                    ></div>
                    <div 
                        className="w-4 h-4 bg-orange-500 rounded-full absolute top-6 left-6"
                        style={{ animation: 'explodeSpread 600ms ease-out forwards 100ms', transform: 'translate(-25px, -15px)' }}
                    ></div>
                    <div 
                        className="w-3 h-3 bg-yellow-400 rounded-full absolute top-12 left-4"
                        style={{ animation: 'explodeSpread 600ms ease-out forwards 200ms', transform: 'translate(-30px, 10px)' }}
                    ></div>
                    <div 
                        className="w-4 h-4 bg-red-400 rounded-full absolute top-14 left-14"
                        style={{ animation: 'explodeSpread 600ms ease-out forwards 150ms', transform: 'translate(25px, 15px)' }}
                    ></div>
                    <div 
                        className="w-3 h-3 bg-orange-600 rounded-full absolute top-2 left-8"
                        style={{ animation: 'explodeSpread 600ms ease-out forwards 250ms', transform: 'translate(0px, -35px)' }}
                    ></div>
                    <div 
                        className="w-5 h-5 bg-white rounded-full absolute top-10 left-12"
                        style={{ animation: 'explodeSpread 600ms ease-out forwards 300ms', transform: 'translate(35px, 5px)' }}
                    ></div>
                </div>
            </div>
        </>
    );
};

export default BikeExplosionEffect;
