import { ObstacleType, CollectibleType } from './types';
import { getPlayerXPosition } from '../../components/game/constants';

// Get dynamic game width based on screen size
const getGameWidth = () => {
    if (typeof window !== 'undefined') {
        const container = document.querySelector('[class*="aspect-"]');
        if (container) {
            return container.clientWidth;
        }
        // Fallback based on screen size
        return window.innerWidth >= 768 ? 900 : 384; // Desktop max width or mobile max width
    }
    return 600; // Default fallback
};

// Adjust spawn rates based on device type and increased game speed
const getSpawnRate = () => {
    if (typeof window !== 'undefined') {
        return window.innerWidth >= 768 ? 0.026 : 0.022; // Increased spawn rates to match faster game speed
    }
    return 0.022;
};

export const shouldSpawnObstacle = (): boolean => {
    return Math.random() < getSpawnRate();
};

export const shouldSpawnCollectible = (): boolean => {
    return Math.random() < getSpawnRate();
};

export const canSpawnAtPosition = (
    newX: number,
    potentialWidth: number,
    obstacles: ObstacleType[],
    collectibles: CollectibleType[]
): boolean => {
    const buffer = 100; // Reduced from 120 to 100 to allow closer spawning for more frequent obstacles

    const tooCloseToObstacle = obstacles.some(
        o => (newX + potentialWidth >= o.x - buffer) && (newX <= o.x + o.width + buffer)
    );
    const tooCloseToCollectible = collectibles.some(
        c => (newX + potentialWidth >= c.x - buffer) && (newX <= c.x + 30 + buffer)
    );

    return !tooCloseToObstacle && !tooCloseToCollectible;
};

export const createObstacle = (obstacles: ObstacleType[], collectibles: CollectibleType[]): ObstacleType | null => {
    if (!shouldSpawnObstacle()) return null;

    const gameWidth = getGameWidth();
    const newX = gameWidth + 50; // Spawn from the right edge of the screen
    // 10% smaller than previous size (was 80x60, now 72x54)
    const potentialWidth = 72; // Medium size barrel, 10% smaller
    const potentialHeight = 54; // Medium size barrel, 10% smaller

    if (canSpawnAtPosition(newX, potentialWidth, obstacles, collectibles)) {
        return {
            id: Date.now() + Math.random(), // Add randomness to prevent ID conflicts
            x: newX,
            width: potentialWidth,
            height: potentialHeight,
        };
    }
    return null;
};

export const createCollectible = (obstacles: ObstacleType[], collectibles: CollectibleType[]): CollectibleType | null => {
    if (!shouldSpawnCollectible()) return null;

    const gameWidth = getGameWidth();
    const newX = gameWidth + 50; // Spawn from the right edge of the screen
    const newY = 60 + 50 + Math.random() * 250; // ROAD_HEIGHT + offset + random height
    const potentialWidth = 30;

    if (canSpawnAtPosition(newX, potentialWidth, obstacles, collectibles)) {
        return {
            id: Date.now() + Math.random(), // Add randomness to prevent ID conflicts
            x: newX,
            y: newY,
        };
    }
    return null;
};

export const moveObstacles = (obstacles: ObstacleType[], speed: number): ObstacleType[] => {
    return obstacles
        .map(o => ({...o, x: o.x - speed}))
        .filter(o => o.x > -100);
};

export const moveCollectibles = (collectibles: CollectibleType[], speed: number): CollectibleType[] => {
    return collectibles
        .map(c => ({...c, x: c.x - speed}))
        .filter(c => c.x > -100);
};