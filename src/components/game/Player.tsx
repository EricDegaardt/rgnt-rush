import React, { useEffect, useState } from 'react';
import BikeExplosionEffect from './BikeExplosionEffect';
import { getPlayerXPosition } from './constants';

const bikeImages = {
  'purple-rain': '/lovable-uploads/purple-rain.png',
  'black-thunder': '/lovable-uploads/black-thunder.png'
};

// Increased size by 5% (width: 126px, height: 63px)
const Player = ({ 
  y, 
  isSpinning, 
  gameOver, 
  selectedBike = 'purple-rain' 
}: { 
  y: number; 
  isSpinning?: boolean; 
  gameOver?: boolean;
  selectedBike?: string;
}) => {
    const [bounceOffset, setBounceOffset] = useState(0);
    const [showExplosion, setShowExplosion] = useState(false);
    const [explosionCompleted, setExplosionCompleted] = useState(false);
    const [playerXPosition, setPlayerXPosition] = useState(getPlayerXPosition());

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

    // Update player position on window resize
    useEffect(() => {
        const handleResize = () => {
            setPlayerXPosition(getPlayerXPosition());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    // Get the correct bike image based on selection
    const bikeImageUrl = bikeImages[selectedBike as keyof typeof bikeImages] || bikeImages['purple-rain'];

    return (
        <>
            <style>{spinKeyframes}</style>
            <div
                className="absolute"
                style={{
                    left: `${playerXPosition}px`,
                    bottom: `${y + bounceY + 5}px`, // Changed from -10px to +5px (15px down)
                    width: '126px',
                    height: '63px',
                    imageRendering: 'pixelated',
                    zIndex: 999, // Highest z-index to ensure bike is always on top
                    backgroundImage: `url('${bikeImageUrl}')`,
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
                    x={playerXPosition + 63} // Center of bike
                    y={y + 31.5 + 15} // Center of bike, moved down by 15px
                    onComplete={handleExplosionComplete}
                />
            )}
        </>
    );
};

export default Player;