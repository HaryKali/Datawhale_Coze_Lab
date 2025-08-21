import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ControlPanelProps {
  difficulty: 'easy' | 'medium' | 'hard';
  gameStatus: 'ready' | 'playing' | 'paused' | 'ended';
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onStartGame: () => void;
  onPauseGame: () => void;
  onRestartGame: () => void;
  className?: string;
}

/**
 * ControlPanel component - Contains game controls and difficulty selector
 */
const ControlPanel: React.FC<ControlPanelProps> = ({
  difficulty,
  gameStatus,
  onDifficultyChange,
  onStartGame,
  onPauseGame,
  onRestartGame,
  className
}) => {
  // Determine button states based on game status
  const isPlaying = gameStatus === 'playing';
  const isPaused = gameStatus === 'paused';
  const isReadyOrEnded = gameStatus === 'ready' || gameStatus === 'ended';
  
  // Button variants for animations
  const buttonVariants = {
    hover: { scale: 1.05 },
    press: { scale: 0.95 },
    disabled: { opacity: 0.5, scale: 1 }
  };
  
  // Difficulty option component
  const DifficultyOption = ({ 
    level, 
    label, 
    description 
  }: { 
    level: 'easy' | 'medium' | 'hard'; 
    label: string; 
    description: string;
  }) => (
    <button
      type="button"
      onClick={() => onDifficultyChange(level)}
      disabled={!isReadyOrEnded}
      className={`p-2 rounded-lg flex-1 transition-all ${
        difficulty === level 
          ? 'bg-blue-500 text-white shadow-md' 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
      } ${!isReadyOrEnded ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'}`}
    >
      <div className="text-center">
        <div className="font-bold">{label}</div>
        <div className="text-xs opacity-80">{description}</div>
      </div>
    </button>
  );
  
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="grid grid-cols-3 gap-2">
        <DifficultyOption 
          level="easy" 
          label="初级" 
          description="慢速度，少地鼠" 
        />
        <DifficultyOption 
          level="medium" 
          label="中级" 
          description="中等速度和数量" 
        />
        <DifficultyOption 
          level="hard" 
          label="高级" 
          description="快速度，多地鼠" 
        />
      </div>
      
      <div className="flex gap-3">
        {/* Start Button */}
        <motion.button
          type="button"
          onClick={onStartGame}
          disabled={isPlaying}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="press"
          disabledWhileTap
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fa-solid fa-play mr-2"></i>
          {isPaused ? '继续' : '开始'}
        </motion.button>
        
        {/* Pause Button */}
        <motion.button
          type="button"
          onClick={onPauseGame}
          disabled={!isPlaying}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="press"
          disabledWhileTap
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fa-solid fa-pause mr-2"></i>
          暂停
        </motion.button>
        
        {/* Restart Button */}
        <motion.button
          type="button"
          onClick={onRestartGame}
          disabled={gameStatus === 'ready'}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="press"
          disabledWhileTap
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fa-solid fa-rotate-right mr-2"></i>
          重新开始
        </motion.button>
      </div>
      
      {/* Game instructions */}
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
        <p>
          <i class="fa-solid fa-info-circle mr-1"></i>
          点击出现的地鼠得分，特殊地鼠分数更高，炸弹会扣分！
        </p>
      </div>
    </div>
  );
};

export default ControlPanel;