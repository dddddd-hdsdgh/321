import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'umi';
import styles from './styles/AdminLayout.module.css';
import AuthGuard from '@/components/AuthGuard';
import { authService } from '@/services/auth';
import { motion } from 'framer-motion';
import { fadeIn, slideIn } from '../utils/animations';

const AdminLayout: React.FC = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    // 监听用户登录状态变化
    setUser(authService.getCurrentUser());
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // 判断是否显示返回按钮（非首页时显示）
  const shouldShowBackButton = () => {
    const path = window.location.pathname;
    return path !== '/admin' && path.startsWith('/admin/');
  };

  const handleBack = () => {
    window.history.back();
  };

  const navItems = ['数据概览', '内容管理', '用户管理', '系统设置'];

  return (
    <AuthGuard requiredRole="admin">
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
          <div className={styles.headerRight}>
            <div className={styles.userInfo}>
              <span className={styles.username}>{user?.username}</span>
              <button onClick={handleLogout} className={styles.logoutButton}>
                登出
              </button>
            </div>
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
          </div>
        </header>
        <div className={styles.content}>
          <motion.aside 
            className={styles.sidebar}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <nav className={styles.nav}>
            {navItems.map((item, index) => (
              <motion.div
                key={index}
                className={styles.navItem}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
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
    </AuthGuard>
  );
};

export default AdminLayout;