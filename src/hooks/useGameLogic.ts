
import { useState, useEffect, useCallback, useRef } from 'react';
import { ROAD_HEIGHT } from '../components/game/constants';
import { ObstacleType, CollectibleType, CollectionEffectType, GameState } from './game/types';
import { PlayerPhysics, updatePlayerPhysics, handlePlayerJump } from './game/physics';
import { checkCollisions } from './game/collision';
import { createObstacle, createCollectible, moveObstacles, moveCollectibles } from './game/spawning';

// Re-export types for backward compatibility
export type { ObstacleType, CollectibleType, CollectionEffectType } from './game/types';

export const useGameLogic = (running: boolean, onGameOver: (finalScore: number) => void) => {
    const gameSpeedRef = useRef(7);
    const visualSpeedRef = useRef(5);
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
    const lastCollectedRef = useRef(0);
    const lastHitRef = useRef(0);
    
    const [distance, setDistance] = useState(0);
    const [energy, setEnergy] = useState(100);
    const [playerY, setPlayerY] = useState(ROAD_HEIGHT);
    const [obstacles, setObstacles] = useState<ObstacleType[]>([]);
    const [collectibles, setCollectibles] = useState<CollectibleType[]>([]);
    const [collectionEffects, setCollectionEffects] = useState<CollectionEffectType[]>([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [lastCollected, setLastCollected] = useState(0);
    const [lastHit, setLastHit] = useState(0);

    const runningRef = useRef(running);
    runningRef.current = running;

    const gameLoop = useCallback(() => {
        if (!runningRef.current) return;

        // Update physics
        playerPhysicsRef.current = updatePlayerPhysics(playerPhysicsRef.current);
        
        // Update distance and energy
        distanceRef.current += gameSpeedRef.current * 0.08;
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
            collectionEffectsRef.current
        );

        obstaclesRef.current = collisionResult.obstacles;
        collectiblesRef.current = collisionResult.collectibles;
        collectionEffectsRef.current = collisionResult.collectionEffects;
        energyRef.current += collisionResult.energyChange;

        // Track sound events
        if (collisionResult.energyChange > 0) {
            lastCollectedRef.current = Date.now();
            setLastCollected(lastCollectedRef.current);
        }

        if (collisionResult.hitObstacle) {
            lastHitRef.current = Date.now();
            setLastHit(lastHitRef.current);
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

        requestAnimationFrame(gameLoop);
    }, [onGameOver]);
    
    useEffect(() => {
        if (running) {
            requestAnimationFrame(gameLoop);
        }
    }, [running, gameLoop]);
    
    const resetGame = useCallback(() => {
        distanceRef.current = 0;
        energyRef.current = 100;
        playerPhysicsRef.current = {
            playerY: ROAD_HEIGHT,
            playerVelocityY: 0,
            isOnGround: true
        };
        isSpinningRef.current = false;
        lastCollectedRef.current = 0;
        lastHitRef.current = 0;
        obstaclesRef.current = [];
        collectiblesRef.current = [];
        collectionEffectsRef.current = [];
        setDistance(0);
        setEnergy(100);
        setPlayerY(ROAD_HEIGHT);
        setObstacles([]);
        setCollectibles([]);
        setCollectionEffects([]);
        setIsSpinning(false);
        setLastCollected(0);
        setLastHit(0);
    }, []);
    
    const handleJump = useCallback(() => {
        if (playerPhysicsRef.current.isOnGround && runningRef.current) {
            playerPhysicsRef.current = handlePlayerJump(playerPhysicsRef.current);
        }
    }, []);

    const handleEffectComplete = useCallback((id: number) => {
        collectionEffectsRef.current = collectionEffectsRef.current.filter(effect => effect.id !== id);
    }, []);

    return {
        distance,
        energy,
        playerY,
        obstacles,
        collectibles,
        collectionEffects,
        isSpinning,
        lastCollected,
        lastHit,
        resetGame,
        handleJump,
        handleEffectComplete
    };
};
