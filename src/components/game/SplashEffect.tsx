
import React, { useEffect, useState } from 'react';

interface SplashEffectProps {
    x: number;
    y: number;
    onComplete: () => void;
}

const SplashEffect = ({ x, y, onComplete }: SplashEffectProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Hide the entire effect after a very short time
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, 200);

        // Complete and remove the effect
        const completeTimer = setTimeout(() => {
            onComplete();
        }, 250);

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    // Don't render anything if not visible
    if (!isVisible) {
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
                <div className="w-4 h-4 bg-orange-500 rounded-full absolute top-2 left-2 animate-bounce"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full absolute top-4 right-3 animate-bounce"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full absolute bottom-3 left-4 animate-bounce"></div>
                <div className="w-3 h-3 bg-orange-600 rounded-full absolute bottom-2 right-2 animate-bounce"></div>
                <div className="w-2 h-2 bg-red-600 rounded-full absolute top-6 left-8 animate-bounce"></div>
            </div>
        </div>
    );
};

export default SplashEffect;
