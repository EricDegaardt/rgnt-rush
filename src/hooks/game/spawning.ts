import { ObstacleType, CollectibleType } from './types';
import { getPlayerXPosition } from '../../components/game/constants';

// Get dynamic game width based on screen size and container
const getGameWidth = () => {
    if (typeof window !== 'undefined') {
        const container = document.querySelector('[class*="aspect-"]') || 
                         document.querySelector('div[style*="aspect-ratio"]');
        if (container) {
            return container.clientWidth;
        }
        // Desktop: 600px, Mobile: based on screen width with 3:5 ratio
        return window.innerWidth >= 768 ? 600 : Math.min(430, window.innerWidth - 32);
    }
    return 600; // Default fallback for desktop
};

export const shouldSpawnObstacle = (): boolean => {
    return Math.random() < 0.018; // Doubled from 0.009 to 0.018 to match batteries
};

export const shouldSpawnCollectible = (): boolean => {
    return Math.random() < 0.018; // Keep at 0.018 for equal distribution
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
    // Adjusted for new desktop height (400px instead of 800px)
    const maxHeight = window.innerWidth >= 768 ? 250 : 400; // Shorter height for desktop
    const newY = 75 + 50 + Math.random() * maxHeight; // Updated ROAD_HEIGHT (75) + offset + random height
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