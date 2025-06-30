import { useState, useEffect, useCallback, useRef } from 'react';
import { ROAD_HEIGHT } from '../components/game/constants';
import { ObstacleType, CollectibleType, CollectionEffectType, SplashEffectType } from './game/types';
import { PlayerPhysics, updatePlayerPhysics, handlePlayerJump } from './game/physics';
import { checkCollisions } from './game/collision';
import { createObstacle, createCollectible, moveObstacles, moveCollectibles } from './game/spawning';

interface OptimizedGameState {
    distance: number;
    energy: number;
    playerY: number;
    obstacles: ObstacleType[];
    collectibles: CollectibleType[];
    collectionEffects: CollectionEffectType[];
    splashEffects: SplashEffectType[];
    isSpinning: boolean;
}

// Get device-specific game speeds - Updated for 33m/s distance calculation
const getGameSpeeds = () => {
    if (typeof window !== 'undefined') {
        const isDesktop = window.innerWidth >= 768;
        return {
            gameSpeed: isDesktop ? 12 : 9,      // Visual speed for obstacles/collectibles
            visualSpeed: isDesktop ? 10 : 7,    // Visual speed for obstacles/collectibles
            distanceMultiplier: 0.55,           // 33m/s at 60fps (33/60 = 0.55)
            energyDecline: isDesktop ? 0.10 : 0.08        // Energy decline rate
        };
    }
    return { gameSpeed: 9, visualSpeed: 7, distanceMultiplier: 0.55, energyDecline: 0.08 };
};

export const useOptimizedGameLogic = (running: boolean, onGameOver: (finalScore: number) => void, onSoundEvent?: (eventType: string) => void) => {
    const speeds = getGameSpeeds();
    const gameSpeedRef = useRef(speeds.gameSpeed);
    const visualSpeedRef = useRef(speeds.visualSpeed);
    const distanceMultiplierRef = useRef(speeds.distanceMultiplier);
    const energyDeclineRef = useRef(speeds.energyDecline);
    const playerPhysicsRef = useRef<PlayerPhysics>({
        playerY: ROAD_HEIGHT,
        playerVelocityY: 0,
        isOnGround: true
    });
    const isSpinningRef = useRef(false);
    const runningRef = useRef(running);
    const frameCountRef = useRef(0);
    
    // Single state object to reduce re-renders
    const [gameState, setGameState] = useState<OptimizedGameState>({
        distance: 0,
        energy: 100,
        playerY: ROAD_HEIGHT,
        obstacles: [],
        collectibles: [],
        collectionEffects: [],
        splashEffects: [],
        isSpinning: false,
    });

    // Use refs for frequent updates
    const gameStateRef = useRef(gameState);
    gameStateRef.current = gameState;
    runningRef.current = running;

    // Update speeds when window resizes
    useEffect(() => {
        const handleResize = () => {
            const newSpeeds = getGameSpeeds();
            gameSpeedRef.current = newSpeeds.gameSpeed;
            visualSpeedRef.current = newSpeeds.visualSpeed;
            distanceMultiplierRef.current = newSpeeds.distanceMultiplier;
            energyDeclineRef.current = newSpeeds.energyDecline;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const gameLoop = useCallback(() => {
        if (!runningRef.current) return;

        frameCountRef.current++;
        
        // Update physics
        playerPhysicsRef.current = updatePlayerPhysics(playerPhysicsRef.current);
        
        // Update distance at 33m/s and energy with device-specific multipliers
        const newDistance = gameStateRef.current.distance + distanceMultiplierRef.current; // 33m/s at 60fps
        const newEnergy = Math.max(0, Math.min(100, gameStateRef.current.energy - energyDeclineRef.current)); // Use dynamic energy decline

        // Move obstacles and collectibles
        const newObstacles = moveObstacles(gameStateRef.current.obstacles, visualSpeedRef.current);
        const newCollectibles = moveCollectibles(gameStateRef.current.collectibles, visualSpeedRef.current);

        // Spawn new obstacles and collectibles (less frequently on mobile, more on desktop)
        let finalObstacles = newObstacles;
        let finalCollectibles = newCollectibles;

        const spawnFrequency = typeof window !== 'undefined' && window.innerWidth >= 768 ? 2 : 3; // More frequent spawning on desktop
        if (frameCountRef.current % spawnFrequency === 0) {
            const newObstacle = createObstacle(newObstacles, newCollectibles);
            if (newObstacle) {
                finalObstacles = [...newObstacles, newObstacle];
            }

            const newCollectible = createCollectible(finalObstacles, newCollectibles);
            if (newCollectible) {
                finalCollectibles = [...newCollectibles, newCollectible];
            }
        }

        // Check collisions
        const collisionResult = checkCollisions(
            playerPhysicsRef.current.playerY,
            finalObstacles,
            finalCollectibles,
            gameStateRef.current.collectionEffects,
            gameStateRef.current.splashEffects
        );

        let finalEnergy = newEnergy + collisionResult.energyChange;
        finalEnergy = Math.max(0, Math.min(100, finalEnergy));

        // Handle sound events
        if (onSoundEvent) {
            if (collisionResult.hitObstacle) {
                onSoundEvent('hit');
            }
            if (collisionResult.energyChange > 0) {
                onSoundEvent('collect');
            }
        }

        if (collisionResult.hitObstacle) {
            isSpinningRef.current = true;
            setTimeout(() => {
                isSpinningRef.current = false;
                setGameState(prev => ({ ...prev, isSpinning: false }));
            }, 800);
        }

        if (finalEnergy <= 0) {
            onGameOver(newDistance);
            return; 
        }

        // Update state only once per frame
        setGameState({
            distance: newDistance,
            energy: finalEnergy,
            playerY: playerPhysicsRef.current.playerY,
            obstacles: collisionResult.obstacles,
            collectibles: collisionResult.collectibles,
            collectionEffects: collisionResult.collectionEffects,
            splashEffects: collisionResult.splashEffects,
            isSpinning: isSpinningRef.current,
        });

        requestAnimationFrame(gameLoop);
    }, [onGameOver, onSoundEvent]);
    
    useEffect(() => {
        if (running) {
            requestAnimationFrame(gameLoop);
        }
    }, [running, gameLoop]);
    
    const resetGame = useCallback(() => {
        const speeds = getGameSpeeds();
        gameSpeedRef.current = speeds.gameSpeed;
        visualSpeedRef.current = speeds.visualSpeed;
        distanceMultiplierRef.current = speeds.distanceMultiplier;
        energyDeclineRef.current = speeds.energyDecline;
        
        playerPhysicsRef.current = {
            playerY: ROAD_HEIGHT,
            playerVelocityY: 0,
            isOnGround: true
        };
        isSpinningRef.current = false;
        frameCountRef.current = 0;
        
        setGameState({
            distance: 0,
            energy: 100,
            playerY: ROAD_HEIGHT,
            obstacles: [],
            collectibles: [],
            collectionEffects: [],
            splashEffects: [],
            isSpinning: false,
        });
    }, []);
    
    const handleJump = useCallback(() => {
        if (playerPhysicsRef.current.isOnGround && runningRef.current) {
            playerPhysicsRef.current = handlePlayerJump(playerPhysicsRef.current);
            if (onSoundEvent) {
                onSoundEvent('jump');
            }
        }
    }, [onSoundEvent]);

    const handleEffectComplete = useCallback((id: number) => {
        setGameState(prev => ({
            ...prev,
            collectionEffects: prev.collectionEffects.filter(effect => effect.id !== id)
        }));
    }, []);

    const handleSplashComplete = useCallback((id: number) => {
        setGameState(prev => ({
            ...prev,
            splashEffects: prev.splashEffects.filter(effect => effect.id !== id)
        }));
    }, []);

    return {
        ...gameState,
        resetGame,
        handleJump,
        handleEffectComplete,
        handleSplashComplete
    };
};