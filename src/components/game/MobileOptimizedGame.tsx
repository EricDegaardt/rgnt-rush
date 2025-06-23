
import React, { useCallback } from 'react';
import OptimizedPlayer from './OptimizedPlayer';
import GameUI from './GameUI';
import Obstacle from './Obstacle';
import Collectible from './Collectible';
import Skyline from './Skyline';
import CollectionEffect from './CollectionEffect';
import SoundToggle from './SoundToggle';
import SplashEffect from './SplashEffect';
import BikeSelection from './BikeSelection';
import GamePreloader from './GamePreloader';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import { useOptimizedGameLogic } from '../../hooks/useOptimizedGameLogic';
import { usePlayerInput } from '../../hooks/usePlayerInput';
import { useGameStateManager } from './GameStateManager';
import { GAME_WIDTH } from './constants';
import Road from './Road';

const MobileOptimizedGame = () => {
  const gameState = useGameStateManager();
  
  const gameLogic = useOptimizedGameLogic(
    gameState.running, 
    gameState.handleGameOver, 
    gameState.handleSoundEvent
  );
  
  usePlayerInput(gameLogic.handleJump, gameState.gameOver);
  
  const handleScreenInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    if (!gameState.running && !gameState.gameOver && !gameState.showLeaderboard && !gameState.showBikeSelection) {
      // Let button handle start
    } else if (gameState.running && !gameState.gameOver) {
      gameLogic.handleJump();
    } else if (gameState.gameOver) {
      gameState.setShowBikeSelection(true);
    }
  }, [gameState.running, gameState.gameOver, gameState.showLeaderboard, gameState.showBikeSelection, gameLogic]);

  // Bike images for preloading
  const bikeImages = ['/lovable-uploads/purple-rain.png', '/lovable-uploads/black-thunder.png'];
  
  if (gameState.isPreloading) {
    return <GamePreloader onComplete={gameState.handlePreloadComplete} bikeImages={bikeImages} />;
  }
  
  if (gameState.showBikeSelection) {
    return (
      <BikeSelection 
        onBikeSelect={gameState.handleBikeSelect} 
        onBack={() => gameState.setShowBikeSelection(false)} 
      />
    );
  }
  
  if (!gameState.running && !gameState.gameOver) {
    return (
      <StartScreen
        username={gameState.username}
        isMuted={gameState.isMuted}
        showLeaderboard={gameState.showLeaderboard}
        onUsernameChange={gameState.setUsername}
        onStartGame={() => gameState.setShowBikeSelection(true)}
        onToggleMute={gameState.toggleMute}
        onShowLeaderboard={() => gameState.setShowLeaderboard(true)}
        onCloseLeaderboard={() => gameState.setShowLeaderboard(false)}
      />
    );
  }

  return (
    <div 
      className="relative bg-black w-full overflow-hidden touch-none select-none" 
      style={{
        maxWidth: `${GAME_WIDTH}px`,
        aspectRatio: '3 / 4',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }} 
      onClick={handleScreenInteraction} 
      onTouchStart={handleScreenInteraction}
    >
      <SoundToggle isMuted={gameState.isMuted} onToggle={gameState.toggleMute} />
      <Skyline />
      <Road />
      
      <OptimizedPlayer 
        y={gameLogic.playerY} 
        isSpinning={gameLogic.isSpinning} 
        gameOver={gameState.gameOver} 
        selectedBike={gameState.selectedBike} 
        isVisible={true} 
      />
      
      {gameLogic.obstacles.map(o => <Obstacle key={o.id} {...o} />)}
      {gameLogic.collectibles.map(c => <Collectible key={c.id} {...c} />)}
      {gameLogic.collectionEffects.map(effect => 
        <CollectionEffect 
          key={effect.id} 
          x={effect.x} 
          y={effect.y} 
          onComplete={() => gameLogic.handleEffectComplete(effect.id)} 
        />
      )}
      {gameLogic.splashEffects.map(effect => 
        <SplashEffect 
          key={effect.id} 
          x={effect.x} 
          y={effect.y} 
          onComplete={() => gameLogic.handleSplashComplete(effect.id)} 
        />
      )}
      
      <GameUI distance={gameLogic.distance} energy={gameLogic.energy} />

      {gameState.gameOver && (
        <GameOverScreen
          username={gameState.username}
          finalScore={gameState.finalScore}
          selectedBike={gameState.selectedBike}
          currentScoreId={gameState.currentScoreId}
          isSubmittingEmail={gameState.isSubmittingEmail}
          showLeaderboard={gameState.showLeaderboard}
          onEmailSubmit={gameState.handleEmailSubmit}
          onPlayAgain={() => gameState.setShowBikeSelection(true)}
          onShowLeaderboard={() => gameState.setShowLeaderboard(true)}
          onCloseLeaderboard={() => gameState.setShowLeaderboard(false)}
        />
      )}
    </div>
  );
};

export default MobileOptimizedGame;
