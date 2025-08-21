import React from 'react';
import MoleHole from './MoleHole';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  molePositions: (number | null)[][];
  onMoleClick: (row: number, col: number) => void;
  gameStatus: 'ready' | 'playing' | 'paused' | 'ended';
  className?: string;
}

/**
 * GameBoard component - Displays the 3x3 grid of mole holes
 */
const GameBoard: React.FC<GameBoardProps> = ({
  molePositions,
  onMoleClick,
  gameStatus,
  className
}) => {
  // Check if the game is active (not paused or ended)
  const isActive = gameStatus === 'playing';
  
  return (
    <div 
      className={cn(
        "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-xl",
        "grid grid-cols-3 gap-4 sm:gap-6",
        !isActive && "opacity-70",
        className
      )}
    >
      {/* Generate 3x3 grid of mole holes */}
      {molePositions.map((row, rowIndex) => 
        row.map((mole, colIndex) => (
          <MoleHole 
            key={`${rowIndex}-${colIndex}`}
            hasMole={mole !== null}
            moleType={mole === 1 ? 'normal' : mole === 2 ? 'special' : mole === 3 ? 'bomb' : undefined}
            onClick={() => isActive && onMoleClick(rowIndex, colIndex)}
            isActive={isActive}
          />
        ))
      )}
    </div>
  );
};

export default GameBoard;