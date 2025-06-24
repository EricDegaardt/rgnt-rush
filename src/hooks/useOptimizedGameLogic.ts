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
    const playerPhysicsRef = useRef<PlayerPhysics>({
        playerY: ROAD_HEIGHT,
        playerVelocityY: 0,
        isOnGround: true
    });
    const isSpinningRef = useRef(false);
    const runningRef = useRef(running);
    const frameCountRef = useRef(0);
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

    // Use refs for frequent updates to prevent external interference
    const gameStateRef = useRef(gameState);
    gameStateRef.current = gameState;
    runningRef.current = running;

    // Stable game loop function that doesn't depend on external state
    const gameLoop = useCallback(() => {
        if (!runningRef.current) {
            gameLoopIdRef.current = null;
            return;
        }

        frameCountRef.current++;
        
        // Update physics - completely isolated from external state
        playerPhysicsRef.current = updatePlayerPhysics(playerPhysicsRef.current);
        
        // Update distance and energy
        const newDistance = gameStateRef.current.distance + gameSpeedRef.current * 0.08;
        const newEnergy = Math.max(0, Math.min(100, gameStateRef.current.energy - 0.06));

        // Move obstacles and collectibles
        const newObstacles = moveObstacles(gameStateRef.current.obstacles, visualSpeedRef.current);
        const newCollectibles = moveCollectibles(gameStateRef.current.collectibles, visualSpeedRef.current);

        // Spawn new obstacles and collectibles
        let finalObstacles = newObstacles;
        let finalCollectibles = newCollectibles;

        // Spawn obstacles and collectibles every frame for proper frequency
        const newObstacle = createObstacle(newObstacles, newCollectibles);
        if (newObstacle) {
            finalObstacles = [...newObstacles, newObstacle];
        }

        const newCollectible = createCollectible(finalObstacles, newCollectibles);
        if (newCollectible) {
            finalCollectibles = [...newCollectibles, newCollectible];
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
            gameLoopIdRef.current = null;
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