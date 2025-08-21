import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import GameBoard from '@/components/GameBoard';
import ScoreDisplay from '@/components/ScoreDisplay';
import GameTimer from '@/components/GameTimer';
import ControlPanel from '@/components/ControlPanel';
import GameOverModal from '@/components/GameOverModal';
import useWhackAMoleGame from '@/hooks/useWhackAMoleGame';
import { cn } from '@/lib/utils';

export default function Home() {
  // Game state management
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const {
    score,
    highScore,
    timeRemaining,
    gameStatus,
    startGame,
    pauseGame,
    restartGame,
    handleMoleClick,
    molePositions
  } = useWhackAMoleGame(difficulty);
  
  // Hammer state for following mouse
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHammering, setIsHammering] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Update high score in localStorage when game ends
  useEffect(() => {
    if (gameStatus === 'ended') {
      const savedScores = JSON.parse(localStorage.getItem('whackAMoleHighScores') || '{}');
      if (!savedScores[difficulty] || score > savedScores[difficulty]) {
        savedScores[difficulty] = score;
        localStorage.setItem('whackAMoleHighScores', JSON.stringify(savedScores));
      }
    }
  }, [gameStatus, score, difficulty]);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gameContainerRef.current) {
        const rect = gameContainerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const container = gameContainerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  // Handle global click for hammer effect
  useEffect(() => {
    const handleClick = () => {
      if (gameStatus === 'playing') {
        setIsHammering(true);
        setTimeout(() => setIsHammering(false), 300);
      }
    };

    const container = gameContainerRef.current;
    if (container) {
      container.addEventListener('click', handleClick);
      return () => {
        container.removeEventListener('click', handleClick);
      };
    }
  }, [gameStatus]);

  // Hammer animation variants
  const hammerVariants = {
    default: { 
      rotate: 0,
      scale: 1
    },
    hammering: {
      rotate: [-20, 20, 0],
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.3,
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <div 
      ref={gameContainerRef}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative"
    >
      {/* Hammer that follows mouse */}
      <motion.div
        className="absolute pointer-events-none z-40"
        style={{ 
          left: mousePosition.x, 
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
          opacity: gameStatus === 'playing' ? 1 : 0
        }}
        variants={hammerVariants}
        animate={isHammering ? 'hammering' : 'default'}
      >
        <i class="fa-solid fa-hammer text-amber-600 text-5xl"></i>
      </motion.div>

      {/* Game Header */}
      <div className="text-center mb-8 w-full max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500 mb-2">
          打地鼠游戏
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          点击出现的地鼠获得分数，时间结束时得分越高越好！
        </p>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mb-6">
        <ScoreDisplay 
          score={score} 
          highScore={highScore} 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transform transition-all duration-300 hover:shadow-xl"
        />
        <GameTimer 
          timeRemaining={timeRemaining} 
          gameStatus={gameStatus}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 transform transition-all duration-300 hover:shadow-xl"
        />
      </div>

      {/* Game Board */}
      <GameBoard 
        molePositions={molePositions} 
        onMoleClick={handleMoleClick}
        gameStatus={gameStatus}
        className="w-full max-w-2xl mb-8"
      />

      {/* Control Panel */}
      <ControlPanel 
        gameStatus={gameStatus}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onStartGame={startGame}
        onPauseGame={pauseGame}
        onRestartGame={restartGame}
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
      />

      {/* Game Over Modal */}
      {gameStatus === 'ended' && (
        <GameOverModal 
          score={score} 
          highScore={highScore}
          onRestart={() => restartGame()}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>使用React和TypeScript构建 | 响应式设计，适配各种设备</p>
      </footer>
    </div>
  );
}