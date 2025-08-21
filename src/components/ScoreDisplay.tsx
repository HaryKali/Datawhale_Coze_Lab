import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  score: number;
  highScore: number;
  className?: string;
}

/**
 * ScoreDisplay component - Shows current score and high score
 * with animations for score changes
 */
const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  highScore,
  className
}) => {
  // Animation variants for score change
  const scoreVariants = {
    initial: { y: 0, opacity: 1 },
    update: { y: -20, opacity: 0 },
    new: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  // Track previous score for animation triggers
  const [prevScore, setPrevScore] = React.useState(score);
  const [animateScore, setAnimateScore] = React.useState(false);
  
  // Update previous score and trigger animation when score changes
  React.useEffect(() => {
    if (score !== prevScore) {
      setAnimateScore(true);
      setTimeout(() => {
        setPrevScore(score);
        setAnimateScore(false);
      }, 200);
    }
  }, [score, prevScore]);
  
  return (
    <div className={cn("rounded-lg p-4 flex flex-col items-center justify-center", className)}>
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
        <i class="fa-solid fa-star text-yellow-500 mr-2"></i>
        分数
      </h2>
      
      <div className="relative h-16 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {/* Previous score animation (moving up and fading out) */}
          {animateScore && (
            <motion.div
              key="prev-score"
              variants={scoreVariants}
              initial="initial"
              animate="update"
              exit="update"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute text-3xl font-bold text-gray-400 dark:text-gray-600"
            >
              {prevScore}
            </motion.div>
          )}
          
          {/* Current score (either static or animating in) */}
          <motion.div
            key="current-score"
            variants={scoreVariants}
            initial={animateScore ? "new" : "visible"}
            animate="visible"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="text-4xl font-bold text-gray-900 dark:text-white"
          >
            {animateScore ? score : prevScore}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* High score display */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
        <span className="font-medium">最高分:</span> {highScore}
      </div>
    </div>
  );
};

export default ScoreDisplay;