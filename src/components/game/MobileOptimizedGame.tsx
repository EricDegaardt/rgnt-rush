import React, { useState, useCallback, useEffect } from 'react';
import OptimizedPlayer from './OptimizedPlayer';
import GameUI from './GameUI';
import Obstacle from './Obstacle';
import Collectible from './Collectible';
import Skyline from './Skyline';
import CollectionEffect from './CollectionEffect';
import SplashEffect from './SplashEffect';
import BikeSelection from './BikeSelection';
import GamePreloader from './GamePreloader';
import ShareScore from './ShareScore';
import AnimatedStartScreen from './AnimatedStartScreen';
import VolumeSlider from './VolumeSlider';
import Leaderboard from './Leaderboard';
import ScoreSubmission from './ScoreSubmission';
import { useOptimizedGameLogic } from '../../hooks/useOptimizedGameLogic';
import { usePlayerInput } from '../../hooks/usePlayerInput';
import { useGameAudio } from '../../hooks/useGameAudio';
import { checkIfScoreQualifies } from '../../lib/supabase';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Road from './Road';

interface MobileOptimizedGameProps {
  isMobile?: boolean;
}

const MobileOptimizedGame = ({ isMobile }: MobileOptimizedGameProps) => {
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [username, setUsername] = useState('');
  const [showBikeSelection, setShowBikeSelection] = useState(false);
  const [selectedBike, setSelectedBike] = useState<string>('purple-rain');
  const [finalScore, setFinalScore] = useState(0);
  const [isPreloading, setIsPreloading] = useState(false);
  const [showShareScore, setShowShareScore] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showScoreSubmission, setShowScoreSubmission] = useState(false);
  const [scoreQualifies, setScoreQualifies] = useState(false);
  
  const {
    playSound,
    startBackgroundMusic,
    stopBackgroundMusic,
    volume,
    setVolume
  } = useGameAudio();
  
  // Start background music when component mounts (start screen)
  useEffect(() => {
    startBackgroundMusic();
  }, [startBackgroundMusic]);
  
  const handleGameOver = useCallback(async (score: number) => {
    setFinalScore(score);
    setGameOver(true);
    setRunning(false);
    
    // Check if score qualifies for leaderboard
    const qualifies = await checkIfScoreQualifies(score);
    setScoreQualifies(qualifies);
    
    // Don't stop background music on game over - keep it playing
    playSound('gameOver');
  }, [playSound]);
  
  const handleSoundEvent = useCallback((eventType: string) => {
    switch (eventType) {
      case 'jump':
        playSound('bikeJump');
        break;
      case 'collect':
        playSound('collectingBattery');
        break;
      case 'hit':
        playSound('hittingBarrel');
        break;
    }
  }, [playSound]);
  
  const gameLogic = useOptimizedGameLogic(running, handleGameOver, handleSoundEvent);
  usePlayerInput(gameLogic.handleJump, gameOver);
  
  const startGame = () => {
    setGameOver(false);
    setFinalScore(0);
    setScoreQualifies(false);
    gameLogic.resetGame();
    setRunning(true);
    // Background music is already playing, no need to start it again
  };
  
  const handleStartFromMenu = () => {
    setShowStartScreen(false);
    setShowBikeSelection(true);
  };
  
  const handleBikeSelect = (bikeId: string) => {
    setSelectedBike(bikeId);
    setShowBikeSelection(false);
    setIsPreloading(true);
  };
  
  const handlePreloadComplete = () => {
    setIsPreloading(false);
    startGame();
  };

  const handleShareScore = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareScore(true);
  };

  const handleCloseShareScore = () => {
    setShowShareScore(false);
  };

  const handlePlayAgain = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGameOver(false);
    setShowShareScore(false);
    setShowScoreSubmission(false);
    setShowBikeSelection(true);
  };

  const handleShowLeaderboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowLeaderboard(true);
  };

  const handleCloseLeaderboard = () => {
    setShowLeaderboard(false);
  };

  const handleSubmitScore = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowScoreSubmission(true);
  };

  const handleScoreSubmitted = () => {
    setShowScoreSubmission(false);
    setShowLeaderboard(true);
  };

  const handleCloseScoreSubmission = () => {
    setShowScoreSubmission(false);
  };
  
  const handleScreenInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();

    // Only handle specific game actions
    if (!running && !gameOver && !showBikeSelection && !showShareScore && !showLeaderboard && !showScoreSubmission) {
      // Let button handle start
      return;
    } else if (running && !gameOver) {
      // Only trigger jump action
      gameLogic.handleJump();
    } else if (gameOver && !showShareScore && !showLeaderboard && !showScoreSubmission) {
      // Only trigger play again if not showing any modals
      setShowBikeSelection(true);
    }
  }, [running, gameOver, showBikeSelection, showShareScore, showLeaderboard, showScoreSubmission, gameLogic]);

  const getGameOverMessage = (distance: number) => {
    if (distance < 500) {
      return {
        title: "Try again",
        color: "text-red-500"
      };
    } else if (distance < 1000) {
      return {
        title: "You can do better",
        color: "text-yellow-500"
      };
    } else if (distance < 1500) {
      return {
        title: "Awesome",
        color: "text-green-500"
      };
    } else {
      return {
        title: "Legendary",
        color: "text-purple-500"
      };
    }
  };

  // Bike images for preloading
  const bikeImages = ['/lovable-uploads/purple-rain.png', '/lovable-uploads/black-thunder.png'];
  
  if (showStartScreen) {
    return (
      <div className="w-full h-full flex flex-col">
        {!isMobile && (
          <div className="w-full p-2">
            <VolumeSlider volume={volume} onVolumeChange={setVolume} />
          </div>
        )}
        <div className="flex-1 relative">
          <AnimatedStartScreen onStartGame={handleStartFromMenu} />
          <Button
            onClick={handleShowLeaderboard}
            className="absolute top-4 right-4 bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-lg z-30"
            size="icon"
          >
            <Trophy size={20} />
          </Button>
        </div>
      </div>
    );
  }
  
  if (isPreloading) {
    return (
      <div className="w-full h-full flex flex-col">
        {!isMobile && (
          <div className="w-full p-2">
            <VolumeSlider volume={volume} onVolumeChange={setVolume} />
          </div>
        )}
        <div className="flex-1">
          <GamePreloader onComplete={handlePreloadComplete} bikeImages={bikeImages} />
        </div>
      </div>
    );
  }
  
  if (showBikeSelection) {
    return (
      <div className="w-full h-full flex flex-col">
        {!isMobile && (
          <div className="w-full p-2">
            <VolumeSlider volume={volume} onVolumeChange={setVolume} />
          </div>
        )}
        <div className="flex-1">
          <BikeSelection onBikeSelect={handleBikeSelect} />
        </div>
      </div>
    );
  }

  const gameOverMessage = getGameOverMessage(finalScore);

  return (
    <div className="w-full h-full flex flex-col">
      {!isMobile && (
        <div className="w-full p-2">
          <VolumeSlider volume={volume} onVolumeChange={setVolume} />
        </div>
      )}
      
      <div 
        className="flex-1 relative bg-black overflow-hidden touch-none select-none"
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          willChange: 'transform',
        }}
        onClick={handleScreenInteraction}
        onTouchStart={handleScreenInteraction}
      >
        <Skyline />
        <Road />
        
        <OptimizedPlayer y={gameLogic.playerY} isSpinning={gameLogic.isSpinning} gameOver={gameOver} selectedBike={selectedBike} isVisible={true} />
        
        {gameLogic.obstacles.map(o => <Obstacle key={o.id} {...o} />)}
        {gameLogic.collectibles.map(c => <Collectible key={c.id} {...c} />)}
        {gameLogic.collectionEffects.map(effect => <CollectionEffect key={effect.id} x={effect.x} y={effect.y} onComplete={() => gameLogic.handleEffectComplete(effect.id)} />)}
        {gameLogic.splashEffects.map(effect => <SplashEffect key={effect.id} x={effect.x} y={effect.y} onComplete={() => gameLogic.handleSplashComplete(effect.id)} />)}
        
        <GameUI distance={gameLogic.distance} energy={gameLogic.energy} />

        {gameOver && !showShareScore && !showLeaderboard && !showScoreSubmission && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-center p-4">
            <h2 className={`text-4xl ${gameOverMessage.color} font-bold`}>{gameOverMessage.title}</h2>
            <p className="text-xl mt-2">Distance: {Math.floor(finalScore)}m</p>
            
            {scoreQualifies && (
              <div className="mt-4 p-3 bg-yellow-600/20 border border-yellow-600/50 rounded-lg">
                <p className="text-yellow-300 text-sm font-medium">🏆 New High Score!</p>
                <p className="text-yellow-200 text-xs">Your score qualifies for the leaderboard!</p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3 mt-6 justify-center">
              {scoreQualifies && (
                <button 
                  onClick={handleSubmitScore}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded text-lg flex items-center gap-2"
                >
                  <Trophy size={16} />
                  Submit Score
                </button>
              )}
              <button 
                onClick={handleShowLeaderboard}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-lg flex items-center gap-2"
              >
                <Trophy size={16} />
                Leaderboard
              </button>
              <button 
                onClick={handleShareScore}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-lg"
              >
                Share Score
              </button>
              <button 
                onClick={handlePlayAgain}
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-lg"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
        
        {showShareScore && (
          <ShareScore 
            score={finalScore} 
            onClose={handleCloseShareScore} 
          />
        )}
        
        {showLeaderboard && (
          <Leaderboard onClose={handleCloseLeaderboard} />
        )}
        
        {showScoreSubmission && (
          <ScoreSubmission
            score={finalScore}
            selectedBike={selectedBike}
            onClose={handleCloseScoreSubmission}
            onSubmitted={handleScoreSubmitted}
          />
        )}
      </div>
    </div>
  );
};

export default MobileOptimizedGame;