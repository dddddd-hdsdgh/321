import React from 'react';
import { Outlet, Link } from 'umi';
import styles from './styles/ParentLayout.module.css';
import { motion } from 'framer-motion';
import { fadeIn, slideIn } from '../utils/animations';

const ParentLayout: React.FC = () => {
  // 判断是否显示返回按钮（非家长首页时显示）
  const shouldShowBackButton = () => {
    const path = window.location.pathname;
    return path !== '/parent' && path.startsWith('/parent/');
  };

  const handleBack = () => {
    window.history.back();
  };

  // 页脚导航项动画
  const footerNavVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.5
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
          variants={fadeIn}
        >
          萌豆家长助手
        </motion.div>
        {shouldShowBackButton() && (
          <motion.button 
            className={styles.backButton} 
            onClick={handleBack}
            initial="hidden"
            animate="visible"
            variants={slideIn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← 返回
          </motion.button>
        )}
        <div className={styles.headerActions}>
          <motion.div 
            className={styles.userInfo}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            家长您好
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            whileHover={{ scale: 1.05, backgroundColor: '#4CAF50' }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/child" className={styles.switchButton}>切换到儿童模式</Link>
          </motion.div>
        </div>
      </header>
      <motion.main 
        className={styles.main}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Outlet />
      </motion.main>
      <footer className={styles.footer}>
        {[
          { path: '/parent', label: '学习报告' },
          { path: '/parent/settings', label: '设置' },
          { path: '/parent/family-guide', label: '亲子互动' }
        ].map((item, index) => (
          <motion.div
            key={item.path}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={footerNavVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to={item.path} className={styles.nav}>{item.label}</Link>
          </motion.div>
        ))}
      </footer>
    </div>
  );
};

export default ParentLayout;