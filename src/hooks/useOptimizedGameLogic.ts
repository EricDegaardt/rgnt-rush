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

export const useOptimizedGameLogic = (running: boolean, onGameOver: (finalScore: number) => void, onSoundEvent?: (eventType: string) => void) => {
    const gameSpeedRef = useRef(7);
    const visualSpeedRef = useRef(5);
    const distanceRef = useRef(0);
    const energyRef = useRef(100);
    const obstaclesRef = useRef<ObstacleType[]>([]);
    const collectiblesRef = useRef<CollectibleType[]>([]);
    const collectionEffectsRef = useRef<CollectionEffectType[]>([]);
    const splashEffectsRef = useRef<SplashEffectType[]>([]);
    const playerPhysicsRef = useRef<PlayerPhysics>({
        playerY: ROAD_HEIGHT,
        playerVelocityY: 0,
        isOnGround: true
    });
    const isSpinningRef = useRef(false);
    const runningRef = useRef(running);
    const gameLoopIdRef = useRef<number | null>(null);
    
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

    runningRef.current = running;

    // Stable game loop function
    const gameLoop = useCallback(() => {
        if (!runningRef.current) {
            gameLoopIdRef.current = null;
            return;
        }
        
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
            setTimeout(() => {
                isSpinningRef.current = false;
            }, 800);
        }

        // Clamp energy
        energyRef.current = Math.max(0, Math.min(100, energyRef.current));

        if (energyRef.current <= 0) {
            energyRef.current = 0;
            gameLoopIdRef.current = null;
            onGameOver(distanceRef.current);
            return; 
        }

        // Update state
        setGameState({
            distance: distanceRef.current,
            energy: energyRef.current,
            playerY: playerPhysicsRef.current.playerY,
            obstacles: [...obstaclesRef.current],
            collectibles: [...collectiblesRef.current],
            collectionEffects: [...collectionEffectsRef.current],
            splashEffects: [...splashEffectsRef.current],
            isSpinning: isSpinningRef.current,
        });

        gameLoopIdRef.current = requestAnimationFrame(gameLoop);
    }, [onGameOver, onSoundEvent]);
    
    // Start/stop game loop based on running state
    useEffect(() => {
        if (running && !gameLoopIdRef.current) {
            gameLoopIdRef.current = requestAnimationFrame(gameLoop);
        } else if (!running && gameLoopIdRef.current) {
            cancelAnimationFrame(gameLoopIdRef.current);
            gameLoopIdRef.current = null;
        }

        // Cleanup on unmount
        return () => {
            if (gameLoopIdRef.current) {
                cancelAnimationFrame(gameLoopIdRef.current);
                gameLoopIdRef.current = null;
            }
        };
    }, [running, gameLoop]);
    
    const resetGame = useCallback(() => {
        // Stop any running game loop
        if (gameLoopIdRef.current) {
            cancelAnimationFrame(gameLoopIdRef.current);
            gameLoopIdRef.current = null;
        }

        distanceRef.current = 0;
        energyRef.current = 100;
        obstaclesRef.current = [];
        collectiblesRef.current = [];
        collectionEffectsRef.current = [];
        splashEffectsRef.current = [];
        playerPhysicsRef.current = {
            playerY: ROAD_HEIGHT,
            playerVelocityY: 0,
            isOnGround: true
        };
        isSpinningRef.current = false;
        
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
        collectionEffectsRef.current = collectionEffectsRef.current.filter(effect => effect.id !== id);
        setGameState(prev => ({
            ...prev,
            collectionEffects: prev.collectionEffects.filter(effect => effect.id !== id)
        }));
    }, []);

    const handleSplashComplete = useCallback((id: number) => {
        splashEffectsRef.current = splashEffectsRef.current.filter(effect => effect.id !== id);
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