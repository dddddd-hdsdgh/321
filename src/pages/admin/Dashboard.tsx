import React, { useState, useEffect } from 'react';
import styles from './styles/Dashboard.module.css';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalVideos: 0,
    totalPlays: 0,
  });
  
  // 模拟数据加载
  useEffect(() => {
    // 模拟异步数据获取
    setTimeout(() => {
      setStats({
        totalUsers: 1256,
        activeUsers: 348,
        totalVideos: 48,
        totalPlays: 15892,
      });
    }, 500);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>数据概览</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>总用户数</h3>
          <p className={styles.statValue}>{stats.totalUsers}</p>
        </div>
        
        <div className={styles.statCard}>
          <h3>今日活跃</h3>
          <p className={styles.statValue}>{stats.activeUsers}</p>
        </div>
        
        <div className={styles.statCard}>
          <h3>动画总数</h3>
          <p className={styles.statValue}>{stats.totalVideos}</p>
        </div>
        
        <div className={styles.statCard}>
          <h3>总播放量</h3>
          <p className={styles.statValue}>{stats.totalPlays}</p>
        </div>
      </div>
      
      <div className={styles.chartsContainer}>
        <div className={styles.chartCard}>
          <h3>用户增长趋势</h3>
          <div className={styles.chartPlaceholder}>
            <p>图表区域 - 用户增长趋势</p>
          </div>
        </div>
        
        <div className={styles.chartCard}>
          <h3>内容播放统计</h3>
          <div className={styles.chartPlaceholder}>
            <p>图表区域 - 内容播放统计</p>
          </div>
        </div>
      </div>
      
      <div className={styles.recentActivities}>
        <h3>最近活动</h3>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <span className={styles.activityTime}>今天 14:30</span>
            <span className={styles.activityDesc}>用户ID: 1234 上传了新的家庭互动照片</span>
          </div>
          <div className={styles.activityItem}>
            <span className={styles.activityTime}>今天 13:45</span>
            <span className={styles.activityDesc}>用户ID: 5678 完成了拼音剧场《声母家族》的学习</span>
          </div>
          <div className={styles.activityItem}>
            <span className={styles.activityTime}>今天 11:20</span>
            <span className={styles.activityDesc}>用户ID: 9012 购买了高级会员服务</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;