
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Player from './Player';
import GameUI from './GameUI';
import Obstacle from './Obstacle';
import Collectible from './Collectible';
import Skyline from './Skyline';
import Leaderboard from './Leaderboard';

const GAME_WIDTH = 600;
const GAME_HEIGHT = 800;
const PLAYER_JUMP_VELOCITY = 22; // Slightly reduced for smoother arc
const GRAVITY = 0.8; // Increased for more natural fall
const ROAD_HEIGHT = 80;

const Game = () => {
    const [running, setRunning] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [username, setUsername] = useState('');
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    const gameSpeedRef = useRef(12);
    const distanceRef = useRef(0);
    const energyRef = useRef(100);
    const obstaclesRef = useRef([]);
    const collectiblesRef = useRef([]);
    const playerYRef = useRef(ROAD_HEIGHT);
    const playerVelocityYRef = useRef(0);
    const isOnGroundRef = useRef(true);
    const jumpKeyPressedRef = useRef(false);
    
    const [distance, setDistance] = useState(0);
    const [energy, setEnergy] = useState(100);
    const [playerY, setPlayerY] = useState(playerYRef.current);
    const [obstacles, setObstacles] = useState([]);
    const [collectibles, setCollectibles] = useState([]);

    const runningRef = useRef(running);
    runningRef.current = running;

    const gameLoop = useCallback(() => {
        if (!runningRef.current) return;

        // Simple gravity physics - no air resistance for smoother movement
        playerVelocityYRef.current -= GRAVITY;
        
        // Update player position
        playerYRef.current += playerVelocityYRef.current;

        // Ground collision
        if (playerYRef.current <= ROAD_HEIGHT) {
            playerYRef.current = ROAD_HEIGHT;
            playerVelocityYRef.current = 0;
            isOnGroundRef.current = true;
        } else {
            isOnGroundRef.current = false;
        }
        
        distanceRef.current += gameSpeedRef.current * 0.05;

        obstaclesRef.current = obstaclesRef.current
            .map(o => ({...o, x: o.x - gameSpeedRef.current}))
            .filter(o => o.x > -100);
        
        if (Math.random() < 0.015) {
            obstaclesRef.current.push({
                id: Date.now(),
                x: GAME_WIDTH + 50,
                width: 40 + Math.random() * 40,
                height: 30 + Math.random() * 20,
            });
        }
        
        collectiblesRef.current = collectiblesRef.current
            .map(c => ({...c, x: c.x - gameSpeedRef.current}))
            .filter(c => c.x > -100);

        if (Math.random() < 0.01) {
             collectiblesRef.current.push({
                id: Date.now(),
                x: GAME_WIDTH + 50,
                y: ROAD_HEIGHT + 50 + Math.random() * 250, // Even higher spawn range
            });
        }

        const playerRect = { x: 100, y: playerYRef.current, width: 80, height: 40 };

        obstaclesRef.current.forEach(obstacle => {
            const obstacleRect = { x: obstacle.x, y: ROAD_HEIGHT, width: obstacle.width, height: obstacle.height };
            if (playerRect.x < obstacleRect.x + obstacleRect.width && playerRect.x + playerRect.width > obstacleRect.x && playerRect.y < obstacleRect.y + obstacleRect.height && playerRect.y + playerRect.height > obstacleRect.y) {
                energyRef.current -= 34;
                obstaclesRef.current = obstaclesRef.current.filter(o => o.id !== obstacle.id);
            }
        });

        collectiblesRef.current.forEach(collectible => {
            const collectibleRect = { x: collectible.x, y: collectible.y, width: 30, height: 30 };
            if (playerRect.x < collectibleRect.x + collectibleRect.width && playerRect.x + playerRect.width > collectibleRect.x && playerRect.y < collectibleRect.y + collectibleRect.height && playerRect.y + playerRect.height > collectibleRect.y) {
                energyRef.current = Math.min(100, energyRef.current + 25);
                collectiblesRef.current = collectiblesRef.current.filter(c => c.id !== collectible.id);
            }
        });

        if (energyRef.current <= 0) {
            energyRef.current = 0;
            setFinalScore(distanceRef.current);
            setGameOver(true);
            setRunning(false);
        }

        setPlayerY(playerYRef.current);
        setDistance(distanceRef.current);
        setEnergy(energyRef.current);
        setObstacles([...obstaclesRef.current]);
        setCollectibles([...collectiblesRef.current]);

        requestAnimationFrame(gameLoop);
    }, []);
    
    useEffect(() => {
        if (running && !gameOver) {
            requestAnimationFrame(gameLoop);
        }
    }, [running, gameOver, gameLoop]);
    
    const startGame = () => {
        setGameOver(false);
        distanceRef.current = 0;
        energyRef.current = 100;
        playerYRef.current = ROAD_HEIGHT;
        playerVelocityYRef.current = 0;
        isOnGroundRef.current = true;
        obstaclesRef.current = [];
        collectiblesRef.current = [];
        setFinalScore(0);
        setDistance(0);
        setEnergy(100);
        setPlayerY(playerYRef.current);
        setObstacles([]);
        setCollectibles([]);
        setRunning(true);
        jumpKeyPressedRef.current = false;
    };
    
    const handleJump = useCallback(() => {
        if (isOnGroundRef.current && runningRef.current) {
            playerVelocityYRef.current = PLAYER_JUMP_VELOCITY;
            isOnGroundRef.current = false;
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' && !gameOver && !jumpKeyPressedRef.current) {
                e.preventDefault(); // Prevent page scroll
                handleJump();
                jumpKeyPressedRef.current = true;
            }
        };

        const handleKeyUp = (e) => {
            if (e.code === 'Space') {
                jumpKeyPressedRef.current = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleJump, gameOver]);

    const handleScreenInteraction = () => {
        if (!running && !gameOver && !showLeaderboard) {
             // Let button handle start
        } else if (running && !gameOver) {
            handleJump();
        } else if (gameOver) {
            startGame();
        }
    }

    if (!running && !gameOver) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-4 text-center">
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
            className="relative bg-black w-full h-full overflow-hidden mx-auto"
            style={{ maxWidth: `${GAME_WIDTH}px`, maxHeight: `${GAME_HEIGHT}px`, aspectRatio: '3/4' }}
            onClick={handleScreenInteraction}
        >
            <Skyline />
            <div 
                className="absolute bottom-0 left-0 w-full bg-gray-600" 
                style={{ height: `${ROAD_HEIGHT}px`, borderTop: '4px solid #4a5568', background: 'linear-gradient(#666, #333)' }}
            />
            
            <Player y={playerY} />
            
            {obstacles.map(o => <Obstacle key={o.id} {...o} />)}
            {collectibles.map(c => <Collectible key={c.id} {...c} />)}
            
            <GameUI speed={Math.floor(gameSpeedRef.current*10)} distance={distance} energy={energy} />

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
