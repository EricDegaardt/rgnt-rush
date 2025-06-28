export const GAME_WIDTH = 600;
export const GAME_HEIGHT = 800;
export const PLAYER_JUMP_VELOCITY = 22; // Slightly reduced for smoother arc
export const GRAVITY = 0.8; // Increased for more natural fall
export const ROAD_HEIGHT = 75; // Increased from 60 to 75 (15px down)

// Responsive player positioning
export const PLAYER_X_POSITION_MOBILE = 40; // Mobile position (was 40)
export const PLAYER_X_POSITION_DESKTOP = 90; // Desktop position (50px to the right)

// Helper function to get current player position
export const getPlayerXPosition = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth >= 768 ? PLAYER_X_POSITION_DESKTOP : PLAYER_X_POSITION_MOBILE;
  }
  return PLAYER_X_POSITION_MOBILE;
};