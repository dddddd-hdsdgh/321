import React, { useEffect, useState } from 'react';
import styles from './styles/Home.module.css';
import { motion } from 'framer-motion';
import { playfulScale } from '../../utils/animations';

const Home: React.FC = () => {
  const [childAge, setChildAge] = useState<number>(5);
  const [todayRecommendations, setTodayRecommendations] = useState<any[]>([]);
  
  useEffect(() => {
    // 模拟根据年龄加载推荐动画
    if (childAge <= 5) {
      setTodayRecommendations([
        {
          id: 1,
          title: '拼音精灵：a的故事',
          type: '拼音',
          duration: '03:45',
          cover: '/video-thumb1.jpg',
          videoId: 1
        },
        {
          id: 2,
          title: '汉字成长记：日的演变',
          type: '汉字',
          duration: '05:12',
          cover: '/video-thumb2.jpg',
          videoId: 2
        }
      ]);
    } else {
      setTodayRecommendations([
        {
          id: 3,
          title: '唐诗诵读：静夜思',
          type: '诗歌',
          duration: '06:30',
          cover: '/video-thumb4.jpg',
          videoId: 4
        },
        {
          id: 4,
          title: '词语接龙游戏',
          type: '词语',
          duration: '04:28',
          cover: '/video-thumb3.jpg',
          videoId: 3
        }
      ]);
    }
  }, [childAge]);
  
  const playRecommendedVideo = (videoId: number) => {
    // 跳转到动画库页面并带上视频ID参数
    window.location.href = `/child/video-library?videoId=${videoId}`;
  };
  
  const viewAllVideos = () => {
    window.location.href = '/child/video-library';
  };

  const navigateToFeature = (path: string) => {
    window.location.href = path;
  };
  
  return (
    <div className={styles.container}>
      <motion.h1 
        className={styles.welcome}
        initial="hidden"
        animate="visible"
        variants={playfulScale}
      >
        欢迎来到萌豆语文动画屋！
      </motion.h1>
      
      <motion.div 
        className={styles.todaySection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>今日推荐</h2>
          <motion.button 
            className={styles.viewAllButton} 
            onClick={viewAllVideos}
            whileHover={{ scale: 1.05, backgroundColor: '#ff6b6b' }}
            whileTap={{ scale: 0.95 }}
          >
            查看全部 ▶
          </motion.button>
        </div>
        <div className={styles.courseList}>
          {todayRecommendations.map((recommendation, index) => (
            <motion.div 
              key={recommendation.id} 
              className={styles.courseCard}
              onClick={() => playRecommendedVideo(recommendation.videoId)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.15)', transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.97 }}
            >
              <div className={styles.courseCover}>
                {recommendation.cover && <img src={recommendation.cover} alt={recommendation.title} />}
                {!recommendation.cover && <div className={styles.coverPlaceholder}>{recommendation.type}</div>}
                <motion.div 
                  className={styles.playIcon}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ▶️
                </motion.div>
              </div>
              <h3 className={styles.courseTitle}>{recommendation.title}</h3>
              <div className={styles.courseInfoRow}>
                <span className={styles.courseType}>{recommendation.type}</span>
                <span className={styles.courseDuration}>{recommendation.duration}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <motion.div 
        className={styles.featureSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <h2 className={styles.sectionTitle}>学习乐园</h2>
        <div className={styles.featureGrid}>
          {[
            { path: '/child/pinyin-paradise', icon: '🎵', title: '拼音乐园', desc: '学习拼音发音和拼写' },
            { path: '/child/hanzi-world', icon: '🔤', title: '汉字天地', desc: '认识汉字和书写练习' },
            { path: '/child/word-park', icon: '📚', title: '词语乐园', desc: '学习词语和词语搭配' },
            { path: '/child/sentence-garden', icon: '💬', title: '短句园地', desc: '学习句子和表达能力' },
            { path: '/child/video-library', icon: '🎬', title: '动画学习库', desc: '观看趣味学习动画' }
          ].map((feature, index) => (
            <motion.div 
              key={feature.path}
              className={styles.featureCard} 
              onClick={() => navigateToFeature(feature.path)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, boxShadow: '0 12px 25px rgba(0,0,0,0.15)', transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className={styles.featureIcon}
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      <motion.div 
        className={styles.achievementSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <h2 className={styles.sectionTitle}>我的成就</h2>
        <motion.div 
          className={styles.achievementCard} 
          onClick={() => navigateToFeature('/child/achievements')}
          whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.12)', transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={styles.medalIcon}>🏆</div>
          <p className={styles.achievementText}>今天已获得 0 枚勋章</p>
        </motion.div>
      </motion.div>
      
      <div className={styles.restReminder}>已学习 0 分钟，记得休息眼睛哦！</div>
    </div>
  );
};

export default Home;