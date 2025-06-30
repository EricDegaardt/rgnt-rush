import { useState, useEffect, useCallback, useRef } from 'react';
import { ROAD_HEIGHT } from '../components/game/constants';
import { ObstacleType, CollectibleType, CollectionEffectType, GameState, SplashEffectType } from './game/types';
import { PlayerPhysics, updatePlayerPhysics, handlePlayerJump } from './game/physics';
import { checkCollisions } from './game/collision';
import { createObstacle, createCollectible, moveObstacles, moveCollectibles } from './game/spawning';

// Re-export types for backward compatibility
export type { ObstacleType, CollectibleType, CollectionEffectType, SplashEffectType } from './game/types';

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
            jumpRecoveryRate: 0.015,            // Speed recovery rate after landing
            speedVariation: 0.08,               // Random speed variation (12km/h equivalent)
            variationFrequency: 0.1,            // How often speed varies (10% chance per frame)
            obstacleSpeedDrop: 0.4,             // Speed drop when hitting obstacle
            obstacleRecoveryRate: 0.02          // Speed recovery rate after obstacle hit
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
        jumpRecoveryRate: 0.015,
        speedVariation: 0.08,
        variationFrequency: 0.1,
        obstacleSpeedDrop: 0.4,
        obstacleRecoveryRate: 0.02
    };
};

export const useGameLogic = (running: boolean, onGameOver: (finalScore: number) => void, onSoundEvent?: (eventType: string) => void) => {
    const speeds = getGameSpeeds();
    const gameSpeedRef = useRef(speeds.gameSpeed);
    const visualSpeedRef = useRef(speeds.visualSpeed);
    const distanceMultiplierRef = useRef(speeds.distanceMultiplier);
    const energyDeclineRef = useRef(speeds.energyDecline);
    const maxSpeedRef = useRef(speeds.maxSpeed);
    const accelerationRef = useRef(speeds.acceleration);
    const jumpSpeedReductionRef = useRef(speeds.jumpSpeedReduction);
    const jumpRecoveryRateRef = useRef(speeds.jumpRecoveryRate);
    const speedVariationRef = useRef(speeds.speedVariation);
    const variationFrequencyRef = useRef(speeds.variationFrequency);
    const obstacleSpeedDropRef = useRef(speeds.obstacleSpeedDrop);
    const obstacleRecoveryRateRef = useRef(speeds.obstacleRecoveryRate);
    const distanceRef = useRef(0);
    const energyRef = useRef(100);
    const currentSpeedRef = useRef(0);
    const wasOnGroundRef = useRef(true);
    const obstacleHitRef = useRef(false);
    const obstacleHitFrameRef = useRef(0);
    const frameCountRef = useRef(0);
    const obstaclesRef = useRef<ObstacleType[]>([]);
    const collectiblesRef = useRef<CollectibleType[]>([]);
    const collectionEffectsRef = useRef<CollectionEffectType[]>([]);
    const playerPhysicsRef = useRef<PlayerPhysics>({
        playerY: ROAD_HEIGHT,
        playerVelocityY: 0,
        isOnGround: true
    });
    const isSpinningRef = useRef(false);
    const splashEffectsRef = useRef<SplashEffectType[]>([]);
    const [hasAccelerated, setHasAccelerated] = useState(false);
    
    const [distance, setDistance] = useState(0);
    const [energy, setEnergy] = useState(100);
    const [playerY, setPlayerY] = useState(ROAD_HEIGHT);
    const [obstacles, setObstacles] = useState<ObstacleType[]>([]);
    const [collectibles, setCollectibles] = useState<CollectibleType[]>([]);
    const [collectionEffects, setCollectionEffects] = useState<CollectionEffectType[]>([]);
    const [splashEffects, setSplashEffects] = useState<SplashEffectType[]>([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [currentSpeed, setCurrentSpeed] = useState(0);

    const runningRef = useRef(running);
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
        playerPhysicsRef.current = updatePlayerPhysics(playerPhysicsRef.current);

        let newSpeed = currentSpeedRef.current;
        if (!hasAccelerated) {
            // Accelerate from 0 to max speed at the start
            newSpeed = Math.min(maxSpeedRef.current, newSpeed + accelerationRef.current);
            if (newSpeed >= maxSpeedRef.current) {
                newSpeed = maxSpeedRef.current;
                setHasAccelerated(true);
            }
        } else {
            // Keep max speed after initial acceleration
            newSpeed = maxSpeedRef.current;
        }
        currentSpeedRef.current = newSpeed;
        
        // Update distance at 33m/s and energy with device-specific multipliers
        distanceRef.current += (distanceMultiplierRef.current * newSpeed); // Apply speed multiplier
        energyRef.current -= energyDeclineRef.current; // Use dynamic energy decline

        // Move obstacles and collectibles with speed multiplier
        obstaclesRef.current = moveObstacles(obstaclesRef.current, visualSpeedRef.current * newSpeed);
        collectiblesRef.current = moveCollectibles(collectiblesRef.current, visualSpeedRef.current * newSpeed);

        // Spawn new obstacles and collectibles
        const newObstacle = createObstacle(obstaclesRef.current, collectiblesRef.current);
        if (newObstacle) {
            obstaclesRef.current.push(newObstacle);
        }

        const newCollectible = createCollectible(obstaclesRef.current, collectiblesRef.current);
        if (newCollectible) {
            collectiblesRef.current.push(newCollectible);
        }

        // Check collisions
        const collisionResult = checkCollisions(
            playerPhysicsRef.current.playerY,
            obstaclesRef.current,
            collectiblesRef.current,
            collectionEffectsRef.current,
            splashEffectsRef.current
        );

        obstaclesRef.current = collisionResult.obstacles;
        collectiblesRef.current = collisionResult.collectibles;
        collectionEffectsRef.current = collisionResult.collectionEffects;
        splashEffectsRef.current = collisionResult.splashEffects;
        energyRef.current += collisionResult.energyChange;

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
            obstacleHitRef.current = true;
            obstacleHitFrameRef.current = frameCountRef.current;
            setIsSpinning(true);
            setTimeout(() => {
                isSpinningRef.current = false;
                setIsSpinning(false);
            }, 800);
        }

        // Clamp energy
        energyRef.current = Math.max(0, Math.min(100, energyRef.current));

        if (energyRef.current <= 0) {
            energyRef.current = 0;
            onGameOver(distanceRef.current);
            return; 
        }

        // Update state
        setPlayerY(playerPhysicsRef.current.playerY);
        setDistance(distanceRef.current);
        setEnergy(energyRef.current);
        setCurrentSpeed(currentSpeedRef.current);
        setObstacles([...obstaclesRef.current]);
        setCollectibles([...collectiblesRef.current]);
        setCollectionEffects([...collectionEffectsRef.current]);
        setSplashEffects([...splashEffectsRef.current]);

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
        speedVariationRef.current = speeds.speedVariation;
        variationFrequencyRef.current = speeds.variationFrequency;
        obstacleSpeedDropRef.current = speeds.obstacleSpeedDrop;
        obstacleRecoveryRateRef.current = speeds.obstacleRecoveryRate;
        
        distanceRef.current = 0;
        energyRef.current = 100;
        currentSpeedRef.current = 0;
        wasOnGroundRef.current = true;
        obstacleHitRef.current = false;
        obstacleHitFrameRef.current = 0;
        frameCountRef.current = 0;
        playerPhysicsRef.current = {
            playerY: ROAD_HEIGHT,
            playerVelocityY: 0,
            isOnGround: true
        };
        isSpinningRef.current = false;
        obstaclesRef.current = [];
        collectiblesRef.current = [];
        collectionEffectsRef.current = [];
        splashEffectsRef.current = [];
        setDistance(0);
        setEnergy(100);
        setPlayerY(ROAD_HEIGHT);
        setCurrentSpeed(0);
        setObstacles([]);
        setCollectibles([]);
        setCollectionEffects([]);
        setSplashEffects([]);
        setIsSpinning(false);
        setHasAccelerated(false);
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
        collectionEffectsRef.current = collectionEffectsRef.current.filter(effect => effect.id !== id);
    }, []);

    const handleSplashComplete = useCallback((id: number) => {
        splashEffectsRef.current = splashEffectsRef.current.filter(effect => effect.id !== id);
        setSplashEffects(prev => prev.filter(effect => effect.id !== id));
    }, []);

    return {
        distance,
        energy,
        playerY,
        obstacles,
        collectibles,
        collectionEffects,
        splashEffects,
        isSpinning,
        currentSpeed,
        resetGame,
        handleJump,
        handleEffectComplete,
        handleSplashComplete
    };
};