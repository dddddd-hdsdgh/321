import { AnimatePresence, motion } from 'framer-motion';

// 常用动画变体
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

export const slideIn = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.5 } }
};

export const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.4 } }
};

export const bounceIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 20
    }
  }
};

// 儿童友好的动画变体
export const playfulScale = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 10,
      duration: 0.6
    }
  }
};

export const wiggleAnimation = {
  initial: { rotate: -5 },
  animate: {
    rotate: 5,
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

// 页面转场动画
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: 0.3
  }
};

// 卡片悬停效果
export const hoverEffect = {
  whileHover: {
    scale: 1.03,
    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
    transition: { duration: 0.2 }
  }
};

// 导出动画组件
export { AnimatePresence, motion };