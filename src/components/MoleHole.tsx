import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { playSound } from '@/lib/utils';

interface MoleHoleProps {
  hasMole: boolean;
  moleType?: 'normal' | 'special' | 'bomb';
  onClick: () => void;
  isActive: boolean;
}

/**
 * MoleHole component - Represents a single mole hole in the game board
 * Displays a mole when hasMole is true and handles click interactions
 */
const MoleHole: React.FC<MoleHoleProps> = ({
  hasMole,
  moleType = 'normal',
  onClick,
  isActive
}) => {
  const [isHit, setIsHit] = useState(false);
  
  // Reset hit state when mole appears or disappears
  React.useEffect(() => {
    setIsHit(false);
  }, [hasMole]);
  
  // Determine mole image based on type
  const getMoleImage = () => {
    // 使用新的图片链接，不带有时效性签名
    switch(moleType) {
       case 'normal':
          return "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=cartoon%20mole%20character%20happy%20expression%20brown%20fur%20big%20eyes%20simple%20style%20transparent%20background&sign=d8ed46902502f46ddadce437d9a3128a";
      case 'special':
        return "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=cartoon%20mole%20character%20with%20golden%20fur%20sparkling%20eyes%20special%20mole%20happy%20expression%20transparent%20background&sign=0d463d01dae187df72c1e146162afb74";
      case 'bomb':
        return "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=cartoon%20bomb%20with%20fuse%20red%20and%20black%20stripes%20simple%20style%20transparent%20background&sign=8389b8fbbc897cfb726ef1c0deae2dfa";
      default:
        return "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=cartoon%20mole%20character%20happy%20expression%20brown%20fur%20big%20eyes%20simple%20style&sign=bc480266f22eb6981dfc5eda325c173c";
    }
  };
  
  // 图片加载失败时的处理函数
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // 显示一个简单的替代文本
    e.currentTarget.alt = moleType === 'bomb' ? '炸弹' : '地鼠';
    // 设置背景色以便在图片加载失败时仍能看到元素
    e.currentTarget.style.backgroundColor = moleType === 'bomb' ? '#ff4444' : '#ffcc00';
  };
  
  // Determine point value based on mole type
  const getPointValue = () => {
    switch(moleType) {
      case 'normal': return 10;
      case 'special': return 25;
      case 'bomb': return -15;
      default: return 10;
    }
  };
  
  // Handle mole click
  // Handle mole click
  const handleClick = (e: React.MouseEvent) => {
    if (hasMole && isActive && !isHit) {
      setIsHit(true);
      onClick();
      
      // 播放击中音效
      switch(moleType) {
        case 'normal':
          playSound('hit');
          break;
        case 'special':
          playSound('special');
          break;
        case 'bomb':
          playSound('bomb');
          break;
      }
    } else if (isActive && !hasMole) {
      // 点击空地播放miss音效
      playSound('miss');
    }
  };
  
  // Animation variants for mole appearance
  const moleVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    hit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };
  
  // Animation variants for hit effect
  const hitEffectVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1.5,
      transition: { duration: 0.3 }
    },
    exit: { opacity: 0, scale: 0.5 }
  };
  
  return (
    <div className="relative aspect-square">
      {/* Hole background */}
      <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 rounded-full border-4 border-gray-400 dark:border-gray-600 overflow-hidden">
        {/* Dirt texture */}
        <div className="absolute inset-0 bg-[url('https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=dirt%20texture%20brown%20natural%20pattern&sign=d7f72a07f44c186c4496925d3ca68f57')] bg-cover opacity-70"></div>
      </div>
      
      {/* Mole */}
      {hasMole && (
         <motion.div
          className="absolute inset-x-0 bottom-0 z-20 cursor-pointer"
          variants={moleVariants}
          initial="hidden"
          animate={isHit ? "hit" : "visible"}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={handleClick}
          whileHover={!isHit ? { scale: 1.05 } : undefined}
          whileTap={!isHit ? { scale: 0.95 } : undefined}
        >
          <div className="relative flex items-center justify-center h-full">
             <img 
               src={getMoleImage()} 
               alt={moleType === 'bomb' ? '炸弹 - 小心!' : `地鼠 - ${getPointValue()}分`}
               className="h-24 w-24 object-contain"
               onError={handleImageError}
                style={{ minWidth: '60px', minHeight: '60px', display: 'block', margin: '0 auto' }}
             />
            
            {/* Point value indicator */}
            <div className={cn(
              "absolute -top-6 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded-full",
              moleType === 'special' && "bg-yellow-500",
              moleType === 'bomb' && "bg-red-500"
            )}>
              {moleType === 'bomb' ? '-15' : `+${getPointValue()}`}
            </div>
          </div>
        </motion.div>
      )}

       
       {/* Hit effect animation */}
       {isHit && (
         <motion.div
           className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
           variants={hitEffectVariants}
           initial="hidden"
           animate="visible"
           exit="exit"
           onAnimationComplete={() => setIsHit(false)}
         >
           <div className={cn(
             "text-4xl font-bold animate-pulse",
             moleType === 'normal' ? "text-green-500" : 
             moleType === 'special' ? "text-yellow-500" : "text-red-500"
           )}>
             {moleType === 'bomb' ? (
               <>
                 <i class="fa-solid fa-explosion"></i>
                 <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
               </>
             ) : moleType === 'special' ? (
               <>
                 <i class="fa-solid fa-star"></i>
                 <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping"></div>
               </>
             ) : (
               <>
                 <i class="fa-solid fa-check"></i>
                 <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
               </>
             )}
           </div>
         </motion.div>
       )}
       
       {/* Hole cover when game is paused or not active */}
       {!isActive && (
         <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
           <i class="fa-solid fa-pause text-white text-xl"></i>
         </div>
       )}
    </div>
  );
};

export default MoleHole;