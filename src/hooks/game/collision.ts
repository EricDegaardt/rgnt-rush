
import { ObstacleType, CollectibleType, CollectionEffectType, SplashEffectType } from './types';
import { PLAYER_X_POSITION, ROAD_HEIGHT } from '../../components/game/constants';

const PLAYER_WIDTH = 120;
const PLAYER_HEIGHT = 60;

interface CollisionResult {
    obstacles: ObstacleType[];
    collectibles: CollectibleType[];
    collectionEffects: CollectionEffectType[];
    splashEffects: SplashEffectType[];
    energyChange: number;
    hitObstacle: boolean;
}

export const checkCollisions = (
    playerY: number,
    obstacles: ObstacleType[],
    collectibles: CollectibleType[],
    collectionEffects: CollectionEffectType[],
    splashEffects: SplashEffectType[]
): CollisionResult => {
    const playerRect = { x: PLAYER_X_POSITION, y: playerY, width: PLAYER_WIDTH, height: PLAYER_HEIGHT };
    let energyChange = 0;
    let hitObstacle = false;
    let newObstacles = [...obstacles];
    let newCollectibles = [...collectibles];
    let newCollectionEffects = [...collectionEffects];
    let newSplashEffects = [...splashEffects];

    // Check obstacle collisions
    obstacles.forEach(obstacle => {
        const obstacleRect = { x: obstacle.x, y: ROAD_HEIGHT, width: obstacle.width, height: obstacle.height };
        if (
            playerRect.x < obstacleRect.x + obstacleRect.width &&
            playerRect.x + playerRect.width > obstacleRect.x &&
            playerRect.y < obstacleRect.y + obstacleRect.height &&
            playerRect.y + playerRect.height > obstacleRect.y
        ) {
            energyChange -= 5;
            hitObstacle = true;
            
            // Create splash effect at obstacle position
            newSplashEffects = [...newSplashEffects, {
                id: Date.now() + Math.random(),
                x: obstacle.x + obstacle.width / 2,
                y: ROAD_HEIGHT + obstacle.height / 2,
            }];
            
            newObstacles = newObstacles.filter(o => o.id !== obstacle.id);
        }
    });

    // Check collectible collisions
    collectibles.forEach(collectible => {
        const collectibleRect = { x: collectible.x, y: collectible.y, width: 30, height: 30 };
        if (
            playerRect.x < collectibleRect.x + collectibleRect.width &&
            playerRect.x + playerRect.width > collectibleRect.x &&
            playerRect.y < collectibleRect.y + collectibleRect.height &&
            playerRect.y + playerRect.height > collectibleRect.y
        ) {
            energyChange += 8;
            newCollectionEffects = [...newCollectionEffects, {
                id: collectible.id,
                x: collectible.x + 15,
                y: collectible.y + 15,
            }];
            newCollectibles = newCollectibles.filter(c => c.id !== collectible.id);
        }
    });

    return {
        obstacles: newObstacles,
        collectibles: newCollectibles,
        collectionEffects: newCollectionEffects,
        splashEffects: newSplashEffects,
        energyChange,
        hitObstacle
    };
};
