
import React, { useEffect, useState } from 'react';
import BikeExplosionEffect from './BikeExplosionEffect';
import { PLAYER_X_POSITION } from './constants';

// Increased size by 5% (width: 126px, height: 63px)
const Player = ({ y, isSpinning, gameOver }: { y: number; isSpinning?: boolean; gameOver?: boolean }) => {
    const [bounceOffset, setBounceOffset] = useState(0);
    const [showExplosion, setShowExplosion] = useState(false);
    const [explosionCompleted, setExplosionCompleted] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setBounceOffset(prev => prev + 0.15); // Increment for smooth bounce
        }, 16); // ~60fps

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (gameOver && !explosionCompleted) {
            setShowExplosion(true);
        }
    }, [gameOver, explosionCompleted]);

    // Create a subtle bounce effect (2-3px amplitude)
    const bounceY = Math.sin(bounceOffset) * 2.5;

    const handleExplosionComplete = () => {
        setShowExplosion(false);
        setExplosionCompleted(true);
    };

    // CSS for the spin animation
    const spinKeyframes = `
        @keyframes spinOnce {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;

    return (
        <>
            <style>{spinKeyframes}</style>
            <div
                className="absolute"
                style={{
                    left: `${PLAYER_X_POSITION}px`,
                    bottom: `${y + bounceY - 10}px`, // Position 10px lower to drive in the street
                    width: '126px',
                    height: '63px',
                    imageRendering: 'pixelated',
                    zIndex: 999, // Highest z-index to ensure bike is always on top
                    backgroundImage: `url('/lovable-uploads/eaee9891-3b63-4bc0-b704-e40d80ffe56a.png')`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    // Single 360-degree spin when hitting barrel
                    animation: isSpinning ? 'spinOnce 800ms ease-out' : 'none',
                    // Hide bike during explosion
                    opacity: showExplosion ? 0 : 1,
                }}
            />
            {showExplosion && (
                <BikeExplosionEffect
                    x={PLAYER_X_POSITION + 63} // Center of bike
                    y={y + 31.5} // Center of bike
                    onComplete={handleExplosionComplete}
                />
            )}
        </>
    );
};

export default Player;
