
import React, { useState, useCallback } from 'react';
import Player from './Player';
import GameUI from './GameUI';
import Obstacle from './Obstacle';
import Collectible from './Collectible';
import Skyline from './Skyline';
import Leaderboard from './Leaderboard';
import CollectionEffect from './CollectionEffect';
import SoundToggle from './SoundToggle';
import { useGameLogic } from '../../hooks/useGameLogic';
import { usePlayerInput } from '../../hooks/usePlayerInput';
import { useGameAudio } from '../../hooks/useGameAudio';
import { GAME_WIDTH, GAME_HEIGHT, ROAD_HEIGHT } from './constants';
import Road from './Road';

const Game = () => {
    const [running, setRunning] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [username, setUsername] = useState('');
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    const audio = useGameAudio();

    const handleGameOver = useCallback((score: number) => {
        setFinalScore(score);
        setGameOver(true);
        setRunning(false);
        audio.playGameOverSound();
    }, [audio]);

    const {
        distance,
        energy,
        playerY,
        obstacles,
        collectibles,
        collectionEffects,
        isSpinning,
        resetGame,
        handleJump,
        handleEffectComplete,
        lastCollected,
        lastHit
    } = useGameLogic(running, handleGameOver);

    usePlayerInput(() => {
        handleJump();
        audio.playJumpSound();
    }, gameOver);

    // Play sounds when collecting or hitting
    React.useEffect(() => {
        if (lastCollected > 0) {
            audio.playCollectSound();
        }
    }, [lastCollected, audio]);

    React.useEffect(() => {
        if (lastHit > 0) {
            audio.playHitSound();
        }
    }, [lastHit, audio]);

    const startGame = () => {
        setGameOver(false);
        setFinalScore(0);
        resetGame();
        setRunning(true);
    };

    const handleScreenInteraction = () => {
        if (!running && !gameOver && !showLeaderboard) {
             // Let button handle start
        } else if (running && !gameOver) {
            handleJump();
            audio.playJumpSound();
        } else if (gameOver) {
            startGame();
        }
    }

    if (!running && !gameOver) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-4 text-center relative">
                <SoundToggle isMuted={audio.isMuted} onToggle={audio.toggleMute} />
                
                <h1 className="text-3xl md:text-5xl mb-4 text-purple-400">RGNT RUSH</h1>
                <p className="mb-8 text-sm md:text-base">Collect batteries, dodge cars!</p>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-800 border border-purple-400 p-2 rounded mb-4 text-center w-64"
                />
                <button onClick={startGame} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-xl md:text-2xl animate-pulse">
                    Start Game
                </button>
                <button onClick={() => { setFinalScore(0); setShowLeaderboard(true); }} className="mt-4 text-purple-300 underline">
                    Leaderboard
                </button>
                {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} currentScore={0} />}
            </div>
        )
    }

    return (
        <div 
            className="relative bg-black w-full overflow-hidden"
            style={{ maxWidth: `${GAME_WIDTH}px`, aspectRatio: '3 / 4' }}
            onClick={handleScreenInteraction}
        >
            <SoundToggle isMuted={audio.isMuted} onToggle={audio.toggleMute} />
            
            <Skyline />
            <Road />
            
            <Player y={playerY} isSpinning={isSpinning} />
            
            {obstacles.map(o => <Obstacle key={o.id} {...o} />)}
            {collectibles.map(c => <Collectible key={c.id} {...c} />)}
            {collectionEffects.map(effect => (
                <CollectionEffect
                    key={effect.id}
                    x={effect.x}
                    y={effect.y}
                    onComplete={() => handleEffectComplete(effect.id)}
                />
            ))}
            
            <GameUI distance={distance} energy={energy} />

            {gameOver && (
                <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-center p-4">
                    <h2 className="text-4xl text-red-500">Game Over</h2>
                    <p className="text-xl mt-2">Distance: {Math.floor(finalScore)}m</p>
                    <button onClick={startGame} className="mt-8 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-2xl">
                        Play Again
                    </button>
                     <button onClick={() => setShowLeaderboard(true)} className="mt-4 text-purple-300 underline">
                        View Leaderboard
                    </button>
                    {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} currentScore={finalScore} />}
                </div>
            )}
        </div>
    );
};

export default Game;
