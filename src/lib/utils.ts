import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 音效播放工具函数
export const playSound = (type: 'hit' | 'special' | 'bomb' | 'miss') => {
  try {
    // 使用不同频率的蜂鸣声模拟不同音效
    const contexts = new AudioContext();
    const oscillator = contexts.createOscillator();
    const gainNode = contexts.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(contexts.destination);
    
    // 根据不同类型设置不同的声音频率和持续时间
    switch(type) {
      case 'hit':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(330, contexts.currentTime); // A4音
        gainNode.gain.setValueAtTime(0.1, contexts.currentTime);
        oscillator.start();
        oscillator.stop(contexts.currentTime + 0.1);
        break;
      case 'special':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, contexts.currentTime); // C5音
        gainNode.gain.setValueAtTime(0.1, contexts.currentTime);
        oscillator.start();
        oscillator.frequency.exponentialRampToValueAtTime(659.25, contexts.currentTime + 0.1); // E5音
        oscillator.stop(contexts.currentTime + 0.2);
        break;
      case 'bomb':
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(110, contexts.currentTime); // A2音
        gainNode.gain.setValueAtTime(0.1, contexts.currentTime);
        oscillator.start();
        oscillator.frequency.exponentialRampToValueAtTime(55, contexts.currentTime + 0.3); // A1音
        oscillator.stop(contexts.currentTime + 0.3);
        break;
      case 'miss':
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(82.41, contexts.currentTime); // E2音
        gainNode.gain.setValueAtTime(0.1, contexts.currentTime);
        oscillator.start();
        oscillator.stop(contexts.currentTime + 0.1);
        break;
    }
  } catch (error) {
    console.error('Failed to play sound:', error);
  }
}
