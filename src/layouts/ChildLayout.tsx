import React from 'react';
import { Outlet } from 'umi';
import styles from './styles/ChildLayout.module.css';
import { motion } from 'framer-motion';
import { playfulScale, hoverEffect } from '../utils/animations';

const ChildLayout: React.FC = () => {
  const navigateToFeature = (path: string) => {
    window.location.href = path;
  };

  // 判断是否显示返回按钮（非首页时显示）
  const shouldShowBackButton = () => {
    const path = window.location.pathname;
    return path !== '/child' && path.startsWith('/child/');
  };

  const handleBack = () => {
    window.history.back();
  };

  // 为页脚导航项添加动画变体
  const navItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    })
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <motion.div 
          className={styles.logo}
          initial="hidden"
          animate="visible"
          variants={playfulScale}
        >
          萌豆语文动画屋
        </motion.div>
        {shouldShowBackButton() && (
          <motion.button 
            className={styles.backButton} 
            onClick={handleBack}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ← 返回
          </motion.button>
        )}
        <motion.div 
          className={styles.userInfo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          宝宝乐园
        </motion.div>
        <motion.div 
          className={styles.switchButton} 
          onClick={() => navigateToFeature('/parent')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ scale: 1.05, backgroundColor: '#f0a500' }}
          whileTap={{ scale: 0.95 }}
        >
          家长模式
        </motion.div>
      </header>
      <motion.main 
        className={styles.main}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Outlet />
      </motion.main>
      <footer className={styles.footer}>
        {[
          { path: '/child', label: '首页' },
          { path: '/child/pinyin-paradise', label: '拼音乐园' },
          { path: '/child/hanzi-world', label: '汉字天地' },
          { path: '/child/word-park', label: '词语乐园' },
          { path: '/child/sentence-garden', label: '短句园地' },
          { path: '/child/achievements', label: '成就' },
          { path: '/child/settings', label: '设置' }
        ].map((item, index) => (
          <motion.div 
            key={item.path}
            className={styles.nav}
            onClick={() => navigateToFeature(item.path)}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={navItemVariants}
            whileHover={{ y: -5, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {item.label}
          </motion.div>
        ))}
      </footer>
    </div>
  );
};

export default ChildLayout;