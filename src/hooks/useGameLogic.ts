import { useState, useEffect, useCallback, useRef } from 'react';
import { ROAD_HEIGHT } from '../components/game/constants';
import { ObstacleType, CollectibleType, CollectionEffectType, GameState, SplashEffectType } from './game/types';
import { PlayerPhysics, updatePlayerPhysics, handlePlayerJump } from './game/physics';
import { checkCollisions } from './game/collision';
import { createObstacle, createCollectible, moveObstacles, moveCollectibles } from './game/spawning';

// Re-export types for backward compatibility
export type { ObstacleType, CollectibleType, CollectionEffectType, SplashEffectType } from './game/types';

// Get device-specific game speeds
const getGameSpeeds = () => {
    if (typeof window !== 'undefined') {
        const isDesktop = window.innerWidth >= 768;
        return {
            gameSpeed: isDesktop ? 10 : 7,      // Increased from 7 to 10 for desktop
            visualSpeed: isDesktop ? 8 : 5,     // Increased from 5 to 8 for desktop
            distanceMultiplier: isDesktop ? 0.12 : 0.08  // Increased distance gain for desktop
        };
    }
    return { gameSpeed: 7, visualSpeed: 5, distanceMultiplier: 0.08 };
};

export const useGameLogic = (running: boolean, onGameOver: (finalScore: number) => void, onSoundEvent?: (eventType: string) => void) => {
    const speeds = getGameSpeeds();
    const gameSpeedRef = useRef(speeds.gameSpeed);
    const visualSpeedRef = useRef(speeds.visualSpeed);
    const distanceMultiplierRef = useRef(speeds.distanceMultiplier);
    const distanceRef = useRef(0);
    const energyRef = useRef(100);
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
    
    const [distance, setDistance] = useState(0);
    const [energy, setEnergy] = useState(100);
    const [playerY, setPlayerY] = useState(ROAD_HEIGHT);
    const [obstacles, setObstacles] = useState<ObstacleType[]>([]);
    const [collectibles, setCollectibles] = useState<CollectibleType[]>([]);
    const [collectionEffects, setCollectionEffects] = useState<CollectionEffectType[]>([]);
    const [splashEffects, setSplashEffects] = useState<SplashEffectType[]>([]);
    const [isSpinning, setIsSpinning] = useState(false);

    const runningRef = useRef(running);
    runningRef.current = running;

    // Update speeds when window resizes
    useEffect(() => {
        const handleResize = () => {
            const newSpeeds = getGameSpeeds();
            gameSpeedRef.current = newSpeeds.gameSpeed;
            visualSpeedRef.current = newSpeeds.visualSpeed;
            distanceMultiplierRef.current = newSpeeds.distanceMultiplier;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const gameLoop = useCallback(() => {
        if (!runningRef.current) return;

        // Update physics
        playerPhysicsRef.current = updatePlayerPhysics(playerPhysicsRef.current);
        
        // Update distance and energy with device-specific multipliers
        distanceRef.current += gameSpeedRef.current * distanceMultiplierRef.current;
        energyRef.current -= 0.06;

        // Move obstacles and collectibles
        obstaclesRef.current = moveObstacles(obstaclesRef.current, visualSpeedRef.current);
        collectiblesRef.current = moveCollectibles(collectiblesRef.current, visualSpeedRef.current);

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
        
        distanceRef.current = 0;
        energyRef.current = 100;
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
        setObstacles([]);
        setCollectibles([]);
        setCollectionEffects([]);
        setSplashEffects([]);
        setIsSpinning(false);
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
        resetGame,
        handleJump,
        handleEffectComplete,
        handleSplashComplete
    };
};