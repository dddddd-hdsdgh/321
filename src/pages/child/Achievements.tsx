import React, { useState } from 'react';
import styles from './styles/Achievements.module.css';

const Achievements: React.FC = () => {
  const [achievements] = useState([
    {
      id: 1,
      name: '拼音小能手',
      description: '完成5次拼音学习',
      icon: '🎵',
      unlocked: true,
      date: '2024-01-15'
    },
    {
      id: 2,
      name: '汉字达人',
      description: '认识10个汉字',
      icon: '📚',
      unlocked: true,
      date: '2024-01-20'
    },
    {
      id: 3,
      name: '坚持小明星',
      description: '连续学习7天',
      icon: '⭐',
      unlocked: false,
      progress: 5
    },
    {
      id: 4,
      name: '拼读高手',
      description: '正确拼读20个拼音',
      icon: '🏆',
      unlocked: false,
      progress: 12
    }
  ]);
  
  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const progressPercentage = (unlockedAchievements / totalAchievements) * 100;
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>我的成就</h1>
      
      <div className={styles.summaryCard}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryValue}>{unlockedAchievements}</span>
          <span className={styles.summaryLabel}>已解锁</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryValue}>{totalAchievements}</span>
          <span className={styles.summaryLabel}>总计</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryValue}>🎉</span>
          <span className={styles.summaryLabel}>太棒了！</span>
        </div>
      </div>
      
      <div className={styles.progressSection}>
        <h2 className={styles.sectionTitle}>总体进度</h2>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className={styles.progressText}>已完成 {progressPercentage.toFixed(0)}%</p>
      </div>
      
      <div className={styles.achievementsList}>
        <h2 className={styles.sectionTitle}>成就详情</h2>
        {achievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`${styles.achievementCard} ${achievement.unlocked ? styles.unlocked : styles.locked}`}
          >
            <div className={styles.achievementIcon}>{achievement.icon}</div>
            <div className={styles.achievementInfo}>
              <h3 className={styles.achievementName}>{achievement.name}</h3>
              <p className={styles.achievementDescription}>{achievement.description}</p>
              {achievement.unlocked ? (
                <p className={styles.unlockDate}>解锁日期：{achievement.date}</p>
              ) : (
                <div className={styles.achievementProgress}>
                  <div className={styles.progressBarSmall}>
                    <div 
                      className={styles.progressFillSmall} 
                      style={{ width: `${(achievement.progress! / 20) * 100}%` }}
                    ></div>
                  </div>
                  <p className={styles.progressTextSmall}>
                    {achievement.progress!}/20
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className={styles.homeButton} 
        onClick={() => window.location.href = '/child'}
      >
        继续学习
      </button>
    </div>
  );
};

export default Achievements;