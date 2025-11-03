import React from 'react';
import { Outlet } from 'umi';
import styles from './styles/AdminLayout.module.css';
import { motion } from 'framer-motion';
import { fadeIn, slideIn } from '../utils/animations';

const AdminLayout: React.FC = () => {
  // 判断是否显示返回按钮（非首页时显示）
  const shouldShowBackButton = () => {
    const path = window.location.pathname;
    return path !== '/admin' && path.startsWith('/admin/');
  };

  const handleBack = () => {
    window.history.back();
  };

  // 导航项动画
  const navItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.4
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
          萌豆管理后台
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
      </header>
      <div className={styles.content}>
        <motion.aside 
          className={styles.sidebar}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <nav className={styles.nav}>
            {[
              '数据概览',
              '动画管理',
              '用户管理',
              '系统设置'
            ].map((item, index) => (
              <motion.div
                key={item}
                className={styles.navItem}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={navItemVariants}
                whileHover={{ 
                  backgroundColor: '#2c3e50', 
                  x: 5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                {item}
              </motion.div>
            ))}
          </nav>
        </motion.aside>
        <motion.main 
          className={styles.main}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;