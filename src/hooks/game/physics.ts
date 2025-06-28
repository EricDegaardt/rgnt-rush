
import { GRAVITY, ROAD_HEIGHT, PLAYER_JUMP_VELOCITY } from '../../components/game/constants';

export interface PlayerPhysics {
    playerY: number;
    playerVelocityY: number;
    isOnGround: boolean;
}

export const updatePlayerPhysics = (physics: PlayerPhysics): PlayerPhysics => {
    let { playerY, playerVelocityY, isOnGround } = physics;
    
    // Simple gravity physics - no air resistance for smoother movement
    playerVelocityY -= GRAVITY;
    
    // Update player position
    playerY += playerVelocityY;

    // Ground collision
    if (playerY <= ROAD_HEIGHT) {
        playerY = ROAD_HEIGHT;
        playerVelocityY = 0;
        isOnGround = true;
    } else {
        isOnGround = false;
    }

    return { playerY, playerVelocityY, isOnGround };
};

export const handlePlayerJump = (physics: PlayerPhysics): PlayerPhysics => {
    if (physics.isOnGround) {
        return {
            ...physics,
            playerVelocityY: PLAYER_JUMP_VELOCITY,
            isOnGround: false
        };
    }
    return physics;
};
