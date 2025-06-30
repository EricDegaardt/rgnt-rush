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
    currentSpeed: number;
}

// Get device-specific game speeds - Updated for 33m/s distance calculation
const getGameSpeeds = () => {
    if (typeof window !== 'undefined') {
        const isDesktop = window.innerWidth >= 768;
        return {
            gameSpeed: isDesktop ? 12 : 9,      // Visual speed for obstacles/collectibles
            visualSpeed: isDesktop ? 10 : 7,    // Visual speed for obstacles/collectibles
            distanceMultiplier: 0.55,           // 33m/s at 60fps (33/60 = 0.55)
            energyDecline: isDesktop ? 0.10 : 0.08,        // Energy decline rate
            maxSpeed: 1.0,                      // Maximum speed multiplier
            acceleration: 0.02,                 // Speed acceleration rate
            jumpSpeedReduction: 0.3,            // Speed reduction when jumping
            jumpRecoveryRate: 0.015             // Speed recovery rate after landing
        };
    }
    return { 
        gameSpeed: 9, 
        visualSpeed: 7, 
        distanceMultiplier: 0.55, 
        energyDecline: 0.08,
        maxSpeed: 1.0,
        acceleration: 0.02,
        jumpSpeedReduction: 0.3,
        jumpRecoveryRate: 0.015
    };
};

export const useOptimizedGameLogic = (running: boolean, onGameOver: (finalScore: number) => void, onSoundEvent?: (eventType: string) => void) => {
    const speeds = getGameSpeeds();
    const gameSpeedRef = useRef(speeds.gameSpeed);
    const visualSpeedRef = useRef(speeds.visualSpeed);
    const distanceMultiplierRef = useRef(speeds.distanceMultiplier);
    const energyDeclineRef = useRef(speeds.energyDecline);
    const maxSpeedRef = useRef(speeds.maxSpeed);
    const accelerationRef = useRef(speeds.acceleration);
    const jumpSpeedReductionRef = useRef(speeds.jumpSpeedReduction);
    const jumpRecoveryRateRef = useRef(speeds.jumpRecoveryRate);
    const playerPhysicsRef = useRef<PlayerPhysics>({
        playerY: ROAD_HEIGHT,
        playerVelocityY: 0,
        isOnGround: true
    });
    const isSpinningRef = useRef(false);
    const runningRef = useRef(running);
    const frameCountRef = useRef(0);
    const currentSpeedRef = useRef(0);
    const wasOnGroundRef = useRef(true);
    
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
        currentSpeed: 0,
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
            maxSpeedRef.current = newSpeeds.maxSpeed;
            accelerationRef.current = newSpeeds.acceleration;
            jumpSpeedReductionRef.current = newSpeeds.jumpSpeedReduction;
            jumpRecoveryRateRef.current = newSpeeds.jumpRecoveryRate;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const gameLoop = useCallback(() => {
        if (!runningRef.current) return;

        frameCountRef.current++;
        
        // Update physics
        playerPhysicsRef.current = updatePlayerPhysics(playerPhysicsRef.current);
        
        // Speed management
        let newSpeed = currentSpeedRef.current;
        
        // Check if player just landed (was in air, now on ground)
        if (!wasOnGroundRef.current && playerPhysicsRef.current.isOnGround) {
            // Player just landed, start speed recovery
            newSpeed = Math.max(0, newSpeed - jumpSpeedReductionRef.current);
        }
        
        // Update speed based on ground state
        if (playerPhysicsRef.current.isOnGround) {
            // Accelerate when on ground
            newSpeed = Math.min(maxSpeedRef.current, newSpeed + accelerationRef.current);
        } else {
            // Recover speed when in air (but slower than ground acceleration)
            newSpeed = Math.min(maxSpeedRef.current, newSpeed + jumpRecoveryRateRef.current);
        }
        
        currentSpeedRef.current = newSpeed;
        wasOnGroundRef.current = playerPhysicsRef.current.isOnGround;
        
        // Update distance at 33m/s and energy with device-specific multipliers
        const newDistance = gameStateRef.current.distance + (distanceMultiplierRef.current * newSpeed); // Apply speed multiplier
        const newEnergy = Math.max(0, Math.min(100, gameStateRef.current.energy - energyDeclineRef.current)); // Use dynamic energy decline

        // Move obstacles and collectibles with speed multiplier
        const newObstacles = moveObstacles(gameStateRef.current.obstacles, visualSpeedRef.current * newSpeed);
        const newCollectibles = moveCollectibles(gameStateRef.current.collectibles, visualSpeedRef.current * newSpeed);

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
            currentSpeed: currentSpeedRef.current,
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
        maxSpeedRef.current = speeds.maxSpeed;
        accelerationRef.current = speeds.acceleration;
        jumpSpeedReductionRef.current = speeds.jumpSpeedReduction;
        jumpRecoveryRateRef.current = speeds.jumpRecoveryRate;
        
        playerPhysicsRef.current = {
            playerY: ROAD_HEIGHT,
            playerVelocityY: 0,
            isOnGround: true
        };
        isSpinningRef.current = false;
        frameCountRef.current = 0;
        currentSpeedRef.current = 0;
        wasOnGroundRef.current = true;
        
        setGameState({
            distance: 0,
            energy: 100,
            playerY: ROAD_HEIGHT,
            obstacles: [],
            collectibles: [],
            collectionEffects: [],
            splashEffects: [],
            isSpinning: false,
            currentSpeed: 0,
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