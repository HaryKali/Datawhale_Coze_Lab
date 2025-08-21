import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GameOverModalProps {
  score: number;
  highScore: number;
  onRestart: () => void;
}

/**
 * GameOverModal component - Displays when the game ends, showing the final score
 * and providing an option to play again.
 */
const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  onRestart
}) => {
  const isNewHighScore = score >= highScore;
  
  // Animation variants for modal entrance
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 20 
      }
    }
  };
  
  // Animation variants for overlay
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.7 }
  };
  
  // Animation variants for confetti effect
  const confettiVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: 0.3,
        duration: 0.5 
      }
    }
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Modal header */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-6 text-center relative">
          {isNewHighScore && (
            <motion.div
              variants={confettiVariants}
              initial="hidden"
              animate="visible"
              className="absolute top-0 right-4"
            >
              <i class="fa-solid fa-trophy text-yellow-300 text-3xl animate-pulse"></i>
            </motion.div>
          )}
          <h2 className="text-3xl font-bold text-white mb-1">游戏结束!</h2>
          <p className="text-orange-100">时间到，看看你的成绩如何</p>
        </div>
        
        {/* Modal body */}
        <div className="p-6 text-center">
          <div className="mb-6">
            <p className="text-gray-500 dark:text-gray-400 mb-1">你的得分</p>
            <p className="text-5xl font-bold text-gray-900 dark:text-white">{score}</p>
          </div>
          
          <div className="mb-8">
            <p className="text-gray-500 dark:text-gray-400 mb-1">最高分</p>
            <p className={`text-2xl font-bold ${isNewHighScore ? 'text-yellow-500 animate-pulse' : 'text-gray-700 dark:text-gray-300'}`}>
              {highScore}
              {isNewHighScore && (
                <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  新纪录!
                </span>
              )}
            </p>
          </div>
          
          <motion.button
            onClick={onRestart}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <i class="fa-solid fa-play-circle mr-2"></i>
            再玩一次
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameOverModal;