
import { useState, useEffect, useCallback, useRef } from 'react';
import { GRAVITY, ROAD_HEIGHT, PLAYER_JUMP_VELOCITY, GAME_WIDTH, PLAYER_X_POSITION } from '../components/game/constants';

// Type definitions
export interface ObstacleType {
    id: number;
    x: number;
    width: number;
    height: number;
}

export interface CollectibleType {
    id: number;
    x: number;
    y: number;
}

export interface CollectionEffectType {
    id: number;
    x: number;
    y: number;
}

// Update constants for player size (must match the new Player.tsx size)
const PLAYER_WIDTH = 120; // 20% bigger than before
const PLAYER_HEIGHT = 60;

export const useGameLogic = (running: boolean, onGameOver: (finalScore: number) => void) => {
    const gameSpeedRef = useRef(7); // Controls distance score
    const visualSpeedRef = useRef(5); // Controls visual speed of elements
    const distanceRef = useRef(0);
    const energyRef = useRef(100);
    const obstaclesRef = useRef<ObstacleType[]>([]);
    const collectiblesRef = useRef<CollectibleType[]>([]);
    const collectionEffectsRef = useRef<CollectionEffectType[]>([]);
    const playerYRef = useRef(ROAD_HEIGHT);
    const playerVelocityYRef = useRef(0);
    const isOnGroundRef = useRef(true);
    const isSpinningRef = useRef(false);
    
    const [distance, setDistance] = useState(0);
    const [energy, setEnergy] = useState(100);
    const [playerY, setPlayerY] = useState(playerYRef.current);
    const [obstacles, setObstacles] = useState<ObstacleType[]>([]);
    const [collectibles, setCollectibles] = useState<CollectibleType[]>([]);
    const [collectionEffects, setCollectionEffects] = useState<CollectionEffectType[]>([]);
    const [isSpinning, setIsSpinning] = useState(false);

    const runningRef = useRef(running);
    runningRef.current = running;

    const gameLoop = useCallback(() => {
        if (!runningRef.current) return;

        // Simple gravity physics - no air resistance for smoother movement
        playerVelocityYRef.current -= GRAVITY;
        
        // Update player position
        playerYRef.current += playerVelocityYRef.current;

        // Ground collision
        if (playerYRef.current <= ROAD_HEIGHT) {
            playerYRef.current = ROAD_HEIGHT;
            playerVelocityYRef.current = 0;
            isOnGroundRef.current = true;
        } else {
            isOnGroundRef.current = false;
        }
        
        distanceRef.current += gameSpeedRef.current * 0.08;

        // === ENERGY: Decrease a little bit over time ===
        energyRef.current -= 0.06; // ~5% per about 10 seconds at 60fps

        // Move obstacles left
        obstaclesRef.current = obstaclesRef.current
            .map(o => ({...o, x: o.x - visualSpeedRef.current}))
            .filter(o => o.x > -100);

        // Move collectibles left
        collectiblesRef.current = collectiblesRef.current
            .map(c => ({...c, x: c.x - visualSpeedRef.current}))
            .filter(c => c.x > -100);

        // === Spawn obstacles (with improved spacing vs all items) ===
        if (Math.random() < 0.008) {
            const newX = GAME_WIDTH + 50;
            const potentialWidth = 40 + Math.random() * 40;
            const buffer = 120; // Minimum horizontal space between items

            const tooCloseToObstacle = obstaclesRef.current.some(
                o => (newX + potentialWidth >= o.x - buffer) && (newX <= o.x + o.width + buffer)
            );
            const tooCloseToCollectible = collectiblesRef.current.some(
                c => (newX + potentialWidth >= c.x - buffer) && (newX <= c.x + 30 + buffer) // 30 is collectible width
            );

            if (!tooCloseToObstacle && !tooCloseToCollectible) {
                obstaclesRef.current.push({
                    id: Date.now(),
                    x: newX,
                    width: potentialWidth,
                    height: 30 + Math.random() * 20,
                });
            }
        }

        // === Spawn collectibles (with improved spacing vs all items) ===
        if (Math.random() < 0.01) {
            const newX = GAME_WIDTH + 50;
            const newY = ROAD_HEIGHT + 50 + Math.random() * 250;
            const potentialWidth = 30; // Collectible width
            const buffer = 120; // Minimum horizontal space between items

            const tooCloseToObstacle = obstaclesRef.current.some(
                o => (newX + potentialWidth >= o.x - buffer) && (newX <= o.x + o.width + buffer)
            );
            const tooCloseToCollectible = collectiblesRef.current.some(
                c => (newX + potentialWidth >= c.x - buffer) && (newX <= c.x + 30 + buffer)
            );
            
            if (!tooCloseToObstacle && !tooCloseToCollectible) {
                collectiblesRef.current.push({
                    id: Date.now(),
                    x: newX,
                    y: newY,
                });
            }
        }

        // COLLISION DETECTION (update to new player size for all collision checks!)
        const playerRect = { x: PLAYER_X_POSITION, y: playerYRef.current, width: PLAYER_WIDTH, height: PLAYER_HEIGHT };

        obstaclesRef.current.forEach(obstacle => {
            const obstacleRect = { x: obstacle.x, y: ROAD_HEIGHT, width: obstacle.width, height: obstacle.height };
            if (
                playerRect.x < obstacleRect.x + obstacleRect.width &&
                playerRect.x + playerRect.width > obstacleRect.x &&
                playerRect.y < obstacleRect.y + obstacleRect.height &&
                playerRect.y + playerRect.height > obstacleRect.y
            ) {
                // === ENERGY: Reduce by 5% ===
                energyRef.current -= 5;
                // Trigger spin animation
                isSpinningRef.current = true;
                setIsSpinning(true);
                setTimeout(() => {
                    isSpinningRef.current = false;
                    setIsSpinning(false);
                }, 800);
                obstaclesRef.current = obstaclesRef.current.filter(o => o.id !== obstacle.id);
            }
        });

        collectiblesRef.current.forEach(collectible => {
            const collectibleRect = { x: collectible.x, y: collectible.y, width: 30, height: 30 };
            if (
                playerRect.x < collectibleRect.x + collectibleRect.width &&
                playerRect.x + playerRect.width > collectibleRect.x &&
                playerRect.y < collectibleRect.y + collectibleRect.height &&
                playerRect.y + playerRect.height > collectibleRect.y
            ) {
                // === ENERGY: Increase by 8%, cap at 100 ===
                energyRef.current = Math.min(100, energyRef.current + 8);
                collectionEffectsRef.current.push({
                    id: collectible.id,
                    x: collectible.x + 15,
                    y: collectible.y + 15,
                });
                collectiblesRef.current = collectiblesRef.current.filter(c => c.id !== collectible.id);
            }
        });

        // Clamp energy to [0, 100]
        energyRef.current = Math.max(0, Math.min(100, energyRef.current));

        if (energyRef.current <= 0) {
            energyRef.current = 0;
            onGameOver(distanceRef.current);
            return; 
        }

        setPlayerY(playerYRef.current);
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
        playerYRef.current = ROAD_HEIGHT;
        playerVelocityYRef.current = 0;
        isOnGroundRef.current = true;
        isSpinningRef.current = false;
        obstaclesRef.current = [];
        collectiblesRef.current = [];
        collectionEffectsRef.current = [];
        setDistance(0);
        setEnergy(100);
        setPlayerY(playerYRef.current);
        setObstacles([]);
        setCollectibles([]);
        setCollectionEffects([]);
        setIsSpinning(false);
    }, []);
    
    const handleJump = useCallback(() => {
        if (isOnGroundRef.current && runningRef.current) {
            playerVelocityYRef.current = PLAYER_JUMP_VELOCITY;
            isOnGroundRef.current = false;
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
        resetGame,
        handleJump,
        handleEffectComplete
    };
};
