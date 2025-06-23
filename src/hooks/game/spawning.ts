import { ObstacleType, CollectibleType } from './types';
import { GAME_WIDTH, ROAD_HEIGHT } from '../../components/game/constants';

export const shouldSpawnObstacle = (): boolean => {
    return Math.random() < 0.006; // Reduced from 0.009 to 0.006 for more spacing
};

export const shouldSpawnCollectible = (): boolean => {
    return Math.random() < 0.009; // Keep collectible rate the same
};

export const canSpawnAtPosition = (
    newX: number,
    potentialWidth: number,
    obstacles: ObstacleType[],
    collectibles: CollectibleType[]
): boolean => {
    const buffer = 150; // Increased buffer to account for larger barrels

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

    const newX = GAME_WIDTH + 50;
    // 10% smaller than previous size (was 80x60, now 72x54)
    const potentialWidth = 72; // Medium size barrel, 10% smaller
    const potentialHeight = 54; // Medium size barrel, 10% smaller

    if (canSpawnAtPosition(newX, potentialWidth, obstacles, collectibles)) {
        return {
            id: Date.now(),
            x: newX,
            width: potentialWidth,
            height: potentialHeight,
        };
    }
    return null;
};

export const createCollectible = (obstacles: ObstacleType[], collectibles: CollectibleType[]): CollectibleType | null => {
    if (!shouldSpawnCollectible()) return null;

    const newX = GAME_WIDTH + 50;
    const newY = ROAD_HEIGHT + 50 + Math.random() * 250;
    const potentialWidth = 30;

    if (canSpawnAtPosition(newX, potentialWidth, obstacles, collectibles)) {
        return {
            id: Date.now(),
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
