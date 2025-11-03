import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'umi';
import styles from './styles/PinyinTheater.module.css';
import { learningDataService } from '@/services/learningData';

const PinyinTheater: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showInteraction, setShowInteraction] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const scenes = [
    {
      id: 1,
      title: '拼音精灵：a和b',
      description: '认识波波精灵(b)和阿阿精灵(a)',
      duration: '5分钟',
      videoUrl: '/pinyin1.mp4'
    },
    {
      id: 2,
      title: '拼音精灵：a和b交朋友',
      description: '波波精灵和阿阿精灵一起玩，变成ba',
      duration: '5分钟',
      videoUrl: '/pinyin2.mp4'
    }
  ];
  
  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      // 模拟互动点出现
      setTimeout(() => {
        setShowInteraction(true);
      }, 10000); // 10秒后显示互动
    }
  };
  
  const handleInteraction = (isCorrect: boolean = true) => {
    // 模拟互动反馈
    setShowInteraction(false);
    
    // 记录互动数据
    learningDataService.recordActivity({
      title: `${scenes[currentScene].title} - 互动练习`,
      type: '拼音',
      duration: 1, // 互动练习持续1分钟
      completed: true,
      accuracy: isCorrect ? 100 : 0,
      score: isCorrect ? 100 : 0,
    });
    
    // 继续播放
    setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        setCurrentScene(currentScene + 1);
        setIsPlaying(false);
      }
    }, 2000);
  };

  // 视频播放结束处理
  const handleVideoEnd = () => {
    setIsPlaying(false);
    
    // 记录当前场景的学习数据
    learningDataService.recordActivity({
      title: scenes[currentScene].title,
      type: '拼音',
      duration: 5, // 假设每个场景5分钟
      completed: true,
      accuracy: 85, // 模拟准确率
      score: 80 + Math.floor(Math.random() * 20), // 模拟得分
    });
    
    if (currentScene === scenes.length - 1) {
      // 完成所有场景后触发成就页面导航
      setTimeout(() => {
        setShowInteraction(true);
      }, 500);
    }
  };

  // 切换场景时重置视频
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [currentScene]);
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{scenes[currentScene].title}</h1>
      
      <div className={styles.videoContainer}>
        <video 
          ref={videoRef} 
          className={styles.video}
          poster="/pinyin-poster.jpg"
          onEnded={handleVideoEnd}
        >
          <source src={scenes[currentScene].videoUrl} type="video/mp4" />
          您的浏览器不支持视频播放
        </video>
        
        {!isPlaying && (
          <button className={styles.playButton} onClick={playVideo}>
            开始学习
          </button>
        )}
        
        {showInteraction && (
          <div className={styles.interactionOverlay}>
            <div className={styles.interactionPrompt}>
              {currentScene === scenes.length - 1 ? (
                <>
                  <p>恭喜你完成所有拼音学习！</p>
                  <Link to="/child/achievements" className={styles.completeButton}>
                    查看我的成就
                  </Link>
                </>
              ) : (
                <>
                  <p>点击下方的拼音精灵！</p>
                  <div className={styles.pinyinOptions}>
                    <button className={styles.pinyinOption} onClick={() => handleInteraction(true)}>b</button>
                    <button className={styles.pinyinOption} onClick={() => handleInteraction(false)}>p</button>
                    <button className={styles.pinyinOption} onClick={() => handleInteraction(false)}>m</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${((currentScene + 1) / scenes.length) * 100}%` }}
        ></div>
      </div>
      
      <div className={styles.navigation}>
        <Link to="/child" className={styles.navButton}>
          返回首页
        </Link>
        {currentScene > 0 && (
          <button 
            className={styles.navButton} 
            onClick={() => {
              setCurrentScene(currentScene - 1);
              setIsPlaying(false);
              setShowInteraction(false);
            }}
          >
            上一集
          </button>
        )}
        {currentScene < scenes.length - 1 && !showInteraction && (
          <button 
            className={styles.navButton} 
            onClick={() => {
              setCurrentScene(currentScene + 1);
              setIsPlaying(false);
              setShowInteraction(false);
            }}
          >
            下一集
          </button>
        )}
      </div>
    </div>
  );
};

export default PinyinTheater;