import React, { useEffect, useState } from 'react';

interface SplashEffectProps {
    x: number;
    y: number;
    onComplete: () => void;
}

const SplashEffect = ({ x, y, onComplete }: SplashEffectProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Hide the effect after a short time
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, 150);

        // Complete and remove the effect
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 200);

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    // Don't render anything if not visible
    if (!isVisible) {
        return null;
    }

    // Custom CSS for controlled animation
    const splashKeyframes = `
        @keyframes splashBounce {
            0% { transform: translateY(0px) scale(1); opacity: 1; }
            50% { transform: translateY(-10px) scale(1.1); opacity: 0.8; }
            100% { transform: translateY(0px) scale(0.8); opacity: 0; }
        }
    `;

    return (
        <>
            <style>{splashKeyframes}</style>
            <div
                className="absolute pointer-events-none"
                style={{
                    width: '60px',
                    height: '60px',
                    transform: `translate3d(${x - 30}px, ${-y + 15}px, 0)`,
                    willChange: 'transform',
                    zIndex: 998
                }}
            >
                <div className="w-full h-full relative">
                    <div 
                        className="w-4 h-4 bg-orange-500 rounded-full absolute top-2 left-2"
                        style={{ animation: 'splashBounce 150ms ease-out forwards' }}
                    ></div>
                    <div 
                        className="w-3 h-3 bg-red-500 rounded-full absolute top-4 right-3"
                        style={{ animation: 'splashBounce 150ms ease-out forwards 20ms' }}
                    ></div>
                    <div 
                        className="w-2 h-2 bg-yellow-500 rounded-full absolute bottom-3 left-4"
                        style={{ animation: 'splashBounce 150ms ease-out forwards 40ms' }}
                    ></div>
                    <div 
                        className="w-3 h-3 bg-orange-600 rounded-full absolute bottom-2 right-2"
                        style={{ animation: 'splashBounce 150ms ease-out forwards 60ms' }}
                    ></div>
                    <div 
                        className="w-2 h-2 bg-red-600 rounded-full absolute top-6 left-8"
                        style={{ animation: 'splashBounce 150ms ease-out forwards 80ms' }}
                    ></div>
                </div>
            </div>
        </>
    );
};

export default SplashEffect;