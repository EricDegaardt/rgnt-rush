import { ObstacleType, CollectibleType, CollectionEffectType, SplashEffectType } from './types';
import { ROAD_HEIGHT, getPlayerXPosition } from '../../components/game/constants';

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
    const playerXPosition = getPlayerXPosition();
    const playerRect = { x: playerXPosition, y: playerY, width: PLAYER_WIDTH, height: PLAYER_HEIGHT };
    let energyChange = 0;
    let hitObstacle = false;
    let newObstacles = [...obstacles];
    let newCollectibles = [...collectibles];
    let newCollectionEffects = [...collectionEffects];
    let newSplashEffects = [...splashEffects];

    // Check obstacle collisions - significantly reduced hitbox by 50% on all sides
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        const hitboxReduction = 0.5; // Increased from 30% to 50% reduction
        const widthReduction = obstacle.width * hitboxReduction;
        const heightReduction = obstacle.height * hitboxReduction;
        
        const obstacleRect = { 
            x: obstacle.x + widthReduction / 2, 
            y: ROAD_HEIGHT + heightReduction / 2, 
            width: obstacle.width - widthReduction, 
            height: obstacle.height - heightReduction 
        };
        
        // Also reduce player hitbox for more forgiving collisions
        const playerHitboxReduction = 0.4; // 40% reduction on player hitbox
        const playerWidthReduction = PLAYER_WIDTH * playerHitboxReduction;
        const playerHeightReduction = PLAYER_HEIGHT * playerHitboxReduction;
        
        const reducedPlayerRect = {
            x: playerRect.x + playerWidthReduction / 2,
            y: playerRect.y + playerHeightReduction / 2,
            width: PLAYER_WIDTH - playerWidthReduction,
            height: PLAYER_HEIGHT - playerHeightReduction
        };
        
        if (
            reducedPlayerRect.x < obstacleRect.x + obstacleRect.width &&
            reducedPlayerRect.x + reducedPlayerRect.width > obstacleRect.x &&
            reducedPlayerRect.y < obstacleRect.y + obstacleRect.height &&
            reducedPlayerRect.y + reducedPlayerRect.height > obstacleRect.y
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