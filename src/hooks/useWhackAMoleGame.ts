import { useState, useEffect, useRef, useCallback } from 'react';

type GameStatus = 'ready' | 'playing' | 'paused' | 'ended';
type Difficulty = 'easy' | 'medium' | 'hard';

interface UseWhackAMoleGameResult {
  score: number;
  highScore: number;
  timeRemaining: number;
  gameStatus: GameStatus;
  molePositions: (number | null)[][];
  startGame: () => void;
  pauseGame: () => void;
  restartGame: () => void;
  handleMoleClick: (row: number, col: number) => void;
}

/**
 * Custom hook for managing Whack-a-Mole game logic
 * @param difficulty - Game difficulty level (easy, medium, hard)
 * @returns Game state and control functions
 */
function useWhackAMoleGame(difficulty: Difficulty): UseWhackAMoleGameResult {
  // Game state
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [gameStatus, setGameStatus] = useState<GameStatus>('ready');
  const [molePositions, setMolePositions] = useState<(number | null)[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]);
  
  // Game timers and intervals
  const gameTimerRef = useRef<number | null>(null);
  const moleSpawnTimerRef = useRef<number | null>(null);
  
  // Get game parameters based on difficulty
  const getGameParameters = useCallback((difficulty: Difficulty) => {
    switch(difficulty) {
      case 'easy':
        return { spawnInterval: 1500, moleDuration: 1200, maxMoles: 1 };
      case 'medium':
        return { spawnInterval: 1200, moleDuration: 1000, maxMoles: 2 };
      case 'hard':
        return { spawnInterval: 900, moleDuration: 800, maxMoles: 3 };
      default:
        return { spawnInterval: 1200, moleDuration: 1000, maxMoles: 2 };
    }
  }, []);
  
  // Load high score from localStorage
  useEffect(() => {
    const savedScores = JSON.parse(localStorage.getItem('whackAMoleHighScores') || '{}');
    setHighScore(savedScores[difficulty] || 0);
  }, [difficulty]);
  
  // Clean up timers when component unmounts or difficulty changes
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (moleSpawnTimerRef.current) clearInterval(moleSpawnTimerRef.current);
    };
  }, [difficulty]);
  
  // Reset game state
  const resetGame = useCallback(() => {
    setScore(0);
    setTimeRemaining(60);
    setMolePositions([
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]);
    
    // Clear any existing timers
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (moleSpawnTimerRef.current) clearInterval(moleSpawnTimerRef.current);
  }, []);
  
     // Spawn moles randomly on the board
     const spawnMoles = useCallback((maxMoles: number, moleDuration: number) => {
       // Get current game status directly from state
        if (gameStatusRef.current !== 'playing') {
         console.log(`Spawn cancelled - Game status: ${gameStatus}`);
         return;
       }
       
       // Use functional update to get latest mole positions
       setMolePositions(prevPositions => {
         // Create a copy of current positions
         const newPositions = [...prevPositions.map(row => [...row])];
         
         // Count existing moles
         const currentMoles = newPositions.flat().filter(pos => pos !== null).length;
         
         // Always try to spawn at least one mole if game is active
         const shouldSpawn = currentMoles < maxMoles || maxMoles > 0;
         
         if (shouldSpawn) {
           // Find all empty positions
           const emptyPositions: [number, number][] = [];
           for (let row = 0; row < 3; row++) {
             for (let col = 0; col < 3; col++) {
               if (newPositions[row][col] === null) {
                 emptyPositions.push([row, col]);
               }
             }
           }
           
           // Determine how many moles to spawn
           const numToSpawn = Math.min(maxMoles, emptyPositions.length);
           const actualNumToSpawn = Math.max(1, numToSpawn);
           
           for (let i = 0; i < actualNumToSpawn; i++) {
             if (emptyPositions.length === 0) break;
             
             // Randomly select an empty position
             const randomIndex = Math.floor(Math.random() * emptyPositions.length);
             const [row, col] = emptyPositions.splice(randomIndex, 1)[0];
             
             // Randomly determine mole type (normal, special, or bomb)
             const randomValue = Math.random();
             let moleType: number;
             
             if (randomValue < 0.7) {
               moleType = 1; // Normal mole (70% chance)
             } else if (randomValue < 0.9) {
               moleType = 2; // Special mole (20% chance)
             } else {
               moleType = 3; // Bomb (10% chance)
             }
             
             // Place the mole
             newPositions[row][col] = moleType;
             
             // Set timeout to remove the mole after duration
             setTimeout(() => {
               // Use functional update to get latest positions and game status
               setMolePositions(prev => {
                 // Check if game is still active and mole is still there
                if (gameStatusRef.current === 'playing' && prev[row][col] === moleType) {
                   const updated = [...prev.map(r => [...r])];
                   updated[row][col] = null;
                   return updated;
                 }
                 return prev;
               });
             }, moleDuration);
           }
         }
         
         return newPositions;
       });
     }, [gameStatus]);

    // Create a ref to track current game status for setTimeout callbacks
    const gameStatusRef = useRef(gameStatus);
    useEffect(() => {
      gameStatusRef.current = gameStatus;
    }, [gameStatus]);

    // Start game
    const startGame = useCallback(() => {
  const wasPaused = gameStatus === 'paused';
  if (gameStatus === 'playing' && !wasPaused) return;
  
    // Set game status to playing once
    setGameStatus('playing');
    
    // Start timer if not already running
     if (!gameTimerRef.current) {
       gameTimerRef.current = window.setInterval(() => {
         setTimeRemaining(prevTime => {
           if (prevTime <= 1) {
             // Game over
             setGameStatus('ended');
             if (gameTimerRef.current) {
               clearInterval(gameTimerRef.current);
               gameTimerRef.current = null;
             }
             if (moleSpawnTimerRef.current) {
               clearInterval(moleSpawnTimerRef.current);
               moleSpawnTimerRef.current = null;
             }
             return 0;
           }
           return prevTime - 1;
         });
       }, 1000);
     }
    
    // Start mole spawning - force spawn immediately and reset interval
     const { spawnInterval, moleDuration, maxMoles } = getGameParameters(difficulty);
     
     // Clear any existing spawn timer to ensure we start fresh
     if (moleSpawnTimerRef.current) {
       clearInterval(moleSpawnTimerRef.current);
       moleSpawnTimerRef.current = null;
     }
     
   // If coming from paused state, clear existing moles first
   if (wasPaused) {
     setMolePositions([
       [null, null, null],
       [null, null, null],
       [null, null, null]
     ]);
   }
   
   // Use setTimeout to ensure game status is updated before spawning moles
   setTimeout(() => {
     // Spawn moles immediately
     spawnMoles(maxMoles, moleDuration);
     
     // Set up regular spawning
     moleSpawnTimerRef.current = setInterval(() => {
       spawnMoles(maxMoles, moleDuration);
     }, spawnInterval);
   }, 0);
     
    console.log(`Game started with difficulty ${difficulty}: spawnInterval=${spawnInterval}, moleDuration=${moleDuration}, maxMoles=${maxMoles}`);
  }, [gameStatus, difficulty, getGameParameters, spawnMoles]);
  
  // Pause game
  const pauseGame = useCallback(() => {
    if (gameStatus !== 'playing') return;
    
    setGameStatus('paused');
    
    // Clear timers but don't reset game state
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    gameTimerRef.current = null;
    if (moleSpawnTimerRef.current) clearInterval(moleSpawnTimerRef.current);
    moleSpawnTimerRef.current = null;
  }, [gameStatus]);
  
  // Restart game
  const restartGame = useCallback(() => {
    resetGame();
    setGameStatus('ready');
  }, [resetGame]);
  
  // Handle mole click
  const handleMoleClick = useCallback((row: number, col: number) => {
    if (gameStatus !== 'playing') return;
    
    const moleType = molePositions[row][col];
    if (moleType === null) return;
    
    // Remove the mole
    const newPositions = [...molePositions.map(r => [...r])];
    newPositions[row][col] = null;
    setMolePositions(newPositions);
    
    // Update score based on mole type
    switch(moleType) {
      case 1: // Normal mole
        setScore(prev => prev + 10);
        break;
      case 2: // Special mole
        setScore(prev => prev + 25);
        break;
      case 3: // Bomb
        setScore(prev => Math.max(0, prev - 15));
        break;
    }
  }, [gameStatus, molePositions]);
  
   // 调试用：暴露当前游戏状态
   console.log(`Game Status: ${gameStatus}, Score: ${score}, Time: ${timeRemaining}`);
   
   return {
     score,
     highScore,
     timeRemaining,
     gameStatus,
     molePositions,
     startGame,
     pauseGame,
     restartGame,
    handleMoleClick
  };
}

export default useWhackAMoleGame;