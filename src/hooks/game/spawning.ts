
import { ObstacleType, CollectibleType } from './types';
import { GAME_WIDTH, ROAD_HEIGHT } from '../../components/game/constants';

export const shouldSpawnObstacle = (): boolean => {
    return Math.random() < 0.008;
};

export const shouldSpawnCollectible = (): boolean => {
    return Math.random() < 0.01;
};

export const canSpawnAtPosition = (
    newX: number,
    potentialWidth: number,
    obstacles: ObstacleType[],
    collectibles: CollectibleType[]
): boolean => {
    const buffer = 120;

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
    const potentialWidth = 40 + Math.random() * 40;

    if (canSpawnAtPosition(newX, potentialWidth, obstacles, collectibles)) {
        return {
            id: Date.now(),
            x: newX,
            width: potentialWidth,
            height: 30 + Math.random() * 20,
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
