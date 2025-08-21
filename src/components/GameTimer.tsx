import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GameTimerProps {
  timeRemaining: number;
  gameStatus: 'ready' | 'playing' | 'paused' | 'ended';
  className?: string;
}

/**
 * Formats seconds into MM:SS format
 */
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * GameTimer component - Displays the remaining game time
 * with visual warnings when time is running low.
 */
const GameTimer: React.FC<GameTimerProps> = ({
  timeRemaining,
  gameStatus,
  className
}) => {
  const isLowTime = timeRemaining <= 10 && gameStatus === 'playing';
  const isPaused = gameStatus === 'paused';
  
  // Animation variants for time updates
  const timeVariants = {
    normal: { scale: 1 },
    update: { scale: 1.1 },
    warning: { 
      scale: [1, 1.2, 1],
      color: "#ef4444",
      transition: { 
        repeat: Infinity, 
        repeatType: "reverse",
        duration: 0.5 
      }
    }
  };
  
  // Progress bar percentage
  const totalGameTime = 60; // 60 seconds for a full game
  const timePercentage = (timeRemaining / totalGameTime) * 100;
  
  return (
    <div className={cn("rounded-lg p-4 flex flex-col items-center justify-center", className)}>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
        <i class="fa-solid fa-clock text-blue-500 mr-2"></i>
        剩余时间
      </h2>
      
      {/* Time progress bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-blue-500 dark:bg-blue-400 rounded-full"
          initial={{ width: "100%" }}
          animate={{ width: `${timePercentage}%` }}
          transition={{ type: "linear", duration: 1 }}
          style={{
            backgroundColor: isLowTime ? "#ef4444" : "#3b82f6"
          }}
        />
      </div>
      
      {/* Time display */}
      <motion.div
        className="text-4xl font-bold text-gray-900 dark:text-white"
        animate={isLowTime ? "warning" : isPaused ? "normal" : "normal"}
        transition={isLowTime ? { duration: 0.5 } : undefined}
        whileHover={{ scale: 1.05 }}
      >
        {formatTime(timeRemaining)}
      </motion.div>
      
      {/* Status message */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {gameStatus === 'ready' && '点击开始按钮开始游戏'}
        {gameStatus === 'playing' && isLowTime && '时间不多了!'}
        {gameStatus === 'paused' && '游戏已暂停'}
        {gameStatus === 'ended' && '游戏结束!'}
      </div>
    </div>
  );
};

export default GameTimer;