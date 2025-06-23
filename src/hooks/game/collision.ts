
import { ObstacleType, CollectibleType, CollectionEffectType, SplashEffectType } from './types';
import { PLAYER_X_POSITION, ROAD_HEIGHT } from '../../components/game/constants';

const PLAYER_WIDTH = 126; // Updated to match new bike size
const PLAYER_HEIGHT = 63; // Updated to match new bike size

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

    // Check obstacle collisions - reduced hitbox by 30% on all sides
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        const hitboxReduction = 0.3; // 30% reduction
        const widthReduction = obstacle.width * hitboxReduction;
        const heightReduction = obstacle.height * hitboxReduction;
        
        const obstacleRect = { 
            x: obstacle.x + widthReduction / 2, 
            y: ROAD_HEIGHT + heightReduction / 2, 
            width: obstacle.width - widthReduction, 
            height: obstacle.height - heightReduction 
        };
        
        if (
            playerRect.x < obstacleRect.x + obstacleRect.width &&
            playerRect.x + playerRect.width > obstacleRect.x &&
            playerRect.y < obstacleRect.y + obstacleRect.height &&
            playerRect.y + playerRect.height > obstacleRect.y
        ) {
            energyChange -= 5;
            hitObstacle = true;
            
            // Create ONE splash effect for this specific collision
            const splashEffect: SplashEffectType = {
                id: Date.now() + Math.random(),
                x: obstacle.x + obstacle.width / 2,
                y: ROAD_HEIGHT + obstacle.height / 2,
            };
            newSplashEffects = [splashEffect]; // Replace all splash effects with just this one
            
            // Remove the hit obstacle immediately
            newObstacles.splice(i, 1);
            break; // Exit after first collision to prevent multiple hits
        }
    }

    // Check collectible collisions - increased energy gain by 4% (from 8 to 12)
    collectibles.forEach(collectible => {
        const collectibleRect = { x: collectible.x, y: collectible.y, width: 30, height: 30 };
        if (
            playerRect.x < collectibleRect.x + collectibleRect.width &&
            playerRect.x + playerRect.width > collectibleRect.x &&
            playerRect.y < collectibleRect.y + collectibleRect.height &&
            playerRect.y + playerRect.height > collectibleRect.y
        ) {
            energyChange += 12; // Increased from 8 to 12 (4% increase)
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
