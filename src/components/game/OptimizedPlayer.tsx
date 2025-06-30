import React, { useEffect, useState, useMemo } from 'react';
import BikeExplosionEffect from './BikeExplosionEffect';
import { getPlayerXPosition } from './constants';

const bikeImages = {
  'purple-rain': '/dist/lovable-uploads/purple-rain.png',
  'black-thunder': '/dist/lovable-uploads/black-thunder.png',
  'rgnt-turbo': '/dist/lovable-uploads/rgnt-turbo.png'
};

interface OptimizedPlayerProps {
  y: number;
  isSpinning?: boolean;
  gameOver?: boolean;
  selectedBike?: string;
  isVisible?: boolean;
}

const OptimizedPlayer = React.memo(({ 
  y, 
  isSpinning, 
  gameOver, 
  selectedBike = 'purple-rain',
  isVisible = true
}: OptimizedPlayerProps) => {
    const [bounceOffset, setBounceOffset] = useState(0);
    const [showExplosion, setShowExplosion] = useState(false);
    const [explosionCompleted, setExplosionCompleted] = useState(false);
    const [playerXPosition, setPlayerXPosition] = useState(getPlayerXPosition());

    // Only run bounce animation when visible and not spinning
    useEffect(() => {
        if (!isVisible || isSpinning) return;
        
        const interval = setInterval(() => {
            setBounceOffset(prev => prev + 0.15);
        }, 16);

        return () => clearInterval(interval);
    }, [isVisible, isSpinning]);

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

    // Memoize bounce calculation
    const bounceY = useMemo(() => {
        return isSpinning ? 0 : Math.sin(bounceOffset) * 2.5;
    }, [bounceOffset, isSpinning]);

    const handleExplosionComplete = () => {
        setShowExplosion(false);
        setExplosionCompleted(true);
    };

    // Memoize bike image URL
    const bikeImageUrl = useMemo(() => {
        return bikeImages[selectedBike as keyof typeof bikeImages] || bikeImages['purple-rain'];
    }, [selectedBike]);

    // Memoize player style
    const playerStyle = useMemo(() => ({
        left: `${playerXPosition}px`,
        bottom: `${y + bounceY - 10}px`,
        width: '126px',
        height: '63px',
        imageRendering: 'pixelated' as const,
        zIndex: 999,
        backgroundImage: `url('${bikeImageUrl}')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        animation: isSpinning ? 'spinOnce 800ms ease-out' : 'none',
        opacity: showExplosion ? 0 : 1,
        transform: 'translateZ(0)', // Force hardware acceleration
        willChange: 'transform', // Optimize for animations
    }), [playerXPosition, y, bounceY, bikeImageUrl, isSpinning, showExplosion]);

    if (!isVisible) return null;

    return (
        <>
            <style>{`
                @keyframes spinOnce {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
            <div className="absolute" style={playerStyle} />
            {showExplosion && (
                <BikeExplosionEffect
                    x={playerXPosition + 63}
                    y={y + 31.5}
                    onComplete={handleExplosionComplete}
                />
            )}
        </>
    );
});

OptimizedPlayer.displayName = 'OptimizedPlayer';

export default OptimizedPlayer;