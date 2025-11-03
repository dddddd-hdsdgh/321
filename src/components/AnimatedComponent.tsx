import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playfulScale, wiggleAnimation, fadeIn } from '../utils/animations';

interface AnimatedComponentProps {
  type: 'bounce' | 'wiggle' | 'fade';
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * 通用动画组件，提供多种动画效果
 */
export const AnimatedComponent: React.FC<AnimatedComponentProps> = ({
  type,
  children,
  className = '',
  delay = 0
}) => {
  // 根据类型选择动画配置
  const getAnimationConfig = () => {
    switch (type) {
      case 'bounce':
        return {
          ...playfulScale,
          visible: {
            ...playfulScale.visible,
            transition: {
              ...playfulScale.visible.transition,
              delay
            }
          }
        };
      case 'wiggle':
        return {
          ...wiggleAnimation,
          initial: {
            ...wiggleAnimation.initial,
            opacity: 0
          },
          animate: {
            ...wiggleAnimation.animate,
            opacity: 1,
            transition: {
              ...wiggleAnimation.animate.transition,
              delay
            }
          }
        };
      case 'fade':
        return {
          ...fadeIn,
          visible: {
            ...fadeIn.visible,
            transition: {
              ...fadeIn.visible.transition,
              delay
            }
          }
        };
      default:
        return fadeIn;
    }
  };

  const animationConfig = getAnimationConfig();

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={animationConfig}
    >
      {children}
    </motion.div>
  );
};

/**
 * 动画数字计数器组件
 */
export const AnimatedCounter: React.FC<{
  value: number;
  duration?: number;
  className?: string;
}> = ({ value, duration = 1, className = '' }) => {
  const countUp = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={countUp}
    >
      {value}
    </motion.div>
  );
};

/**
 * 卡片组件，带悬停效果
 */
export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => {
  const hoverEffect = {
    whileHover: {
      scale: 1.03,
      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
      transition: { duration: 0.2 }
    },
    whileTap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={playfulScale}
      {...hoverEffect}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedComponent;