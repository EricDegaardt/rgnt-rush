
import React from 'react';
import OptimizedPlayer from './OptimizedPlayer';
import GameUI from './GameUI';
import Obstacle from './Obstacle';
import Collectible from './Collectible';
import Skyline from './Skyline';
import CollectionEffect from './CollectionEffect';
import SoundToggle from './SoundToggle';
import SplashEffect from './SplashEffect';
import Road from './Road';
import { GAME_WIDTH } from './constants';
import { ObstacleType, CollectibleType, CollectionEffectType, SplashEffectType } from '../../hooks/game/types';

interface GameScreenProps {
  playerY: number;
  isSpinning: boolean;
  selectedBike: string;
  obstacles: ObstacleType[];
  collectibles: CollectibleType[];
  collectionEffects: CollectionEffectType[];
  splashEffects: SplashEffectType[];
  distance: number;
  energy: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onScreenInteraction: (e: React.MouseEvent | React.TouchEvent) => void;
  onEffectComplete: (id: number) => void;
  onSplashComplete: (id: number) => void;
}

const GameScreen = ({
  playerY,
  isSpinning,
  selectedBike,
  obstacles,
  collectibles,
  collectionEffects,
  splashEffects,
  distance,
  energy,
  isMuted,
  onToggleMute,
  onScreenInteraction,
  onEffectComplete,
  onSplashComplete
}: GameScreenProps) => {
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
      onClick={onScreenInteraction}
      onTouchStart={onScreenInteraction}
    >
      <div className="absolute top-4 right-4 z-10">
        <SoundToggle isMuted={isMuted} onToggle={onToggleMute} />
      </div>
      
      <Skyline />
      <Road />
      
      <OptimizedPlayer 
        y={playerY} 
        isSpinning={isSpinning} 
        gameOver={false} 
        selectedBike={selectedBike} 
        isVisible={true} 
      />
      
      {obstacles.map(o => <Obstacle key={o.id} {...o} />)}
      {collectibles.map(c => <Collectible key={c.id} {...c} />)}
      {collectionEffects.map(effect => 
        <CollectionEffect 
          key={effect.id} 
          x={effect.x} 
          y={effect.y} 
          onComplete={() => onEffectComplete(effect.id)} 
        />
      )}
      {splashEffects.map(effect => 
        <SplashEffect 
          key={effect.id} 
          x={effect.x} 
          y={effect.y} 
          onComplete={() => onSplashComplete(effect.id)} 
        />
      )}
      
      <GameUI distance={distance} energy={energy} />
    </div>
  );
};

export default GameScreen;
