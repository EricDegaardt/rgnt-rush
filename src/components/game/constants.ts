export const GAME_WIDTH = 600;
export const GAME_HEIGHT = 800;
export const PLAYER_JUMP_VELOCITY = 22; // Slightly reduced for smoother arc
export const GRAVITY = 0.8; // Increased for more natural fall
export const ROAD_HEIGHT = 60;

// Responsive player positioning - moved 30px to the left
export const PLAYER_X_POSITION_MOBILE = 10; // Mobile position (was 40, now 10)
export const PLAYER_X_POSITION_DESKTOP = 60; // Desktop position (was 90, now 60)

// Helper function to get current player position
export const getPlayerXPosition = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth >= 768 ? PLAYER_X_POSITION_DESKTOP : PLAYER_X_POSITION_MOBILE;
  }
  return PLAYER_X_POSITION_MOBILE;
};