import React, { useState, useEffect } from 'react';
import styles from './styles/VideoLibrary.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { playfulScale, fadeIn } from '../../utils/animations';

interface Video {
  id: number;
  title: string;
  thumbnail: string;
  duration: string;
  category: string;
  description: string;
  url: string;
  recommended: boolean;
}

const VideoLibrary: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentCategory, setCurrentCategory] = useState<string>('全部');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // 从URL参数中获取视频ID并自动播放
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoIdParam = urlParams.get('videoId');
    
    if (videoIdParam) {
      const videoId = parseInt(videoIdParam);
      const video = videos.find(v => v.id === videoId);
      if (video) {
        setSelectedVideo(video);
        setTimeout(() => {
          setIsPlaying(true);
        }, 300); // 等待动画完成后再播放
      }
    }
  }, [videos]);

  // 模拟视频数据
  useEffect(() => {
    const mockVideos: Video[] = [
      {
        id: 1,
        title: '拼音精灵：a的故事',
        thumbnail: '/video-thumb1.jpg',
        duration: '03:45',
        category: '拼音',
        description: '通过有趣的动画故事学习拼音a的发音和书写',
        url: 'https://example.com/videos/pinyin-a.mp4',
        recommended: true
      },
      {
        id: 2,
        title: '汉字成长记：日的演变',
        thumbnail: '/video-thumb2.jpg',
        duration: '05:12',
        category: '汉字',
        description: '了解汉字"日"从古至今的演变过程',
        url: 'https://example.com/videos/hanzi-ri.mp4',
        recommended: true
      },
      {
        id: 3,
        title: '词语接龙游戏',
        thumbnail: '/video-thumb3.jpg',
        duration: '04:28',
        category: '词语',
        description: '通过游戏学习词语搭配和运用',
        url: 'https://example.com/videos/word-game.mp4',
        recommended: false
      },
      {
        id: 4,
        title: '唐诗诵读：静夜思',
        thumbnail: '/video-thumb4.jpg',
        duration: '06:30',
        category: '诗歌',
        description: '经典唐诗诵读与解析',
        url: 'https://example.com/videos/poem-jingye.mp4',
        recommended: true
      },
      {
        id: 5,
        title: '量词小课堂',
        thumbnail: '/video-thumb5.jpg',
        duration: '04:55',
        category: '语法',
        description: '学习中文量词的正确使用',
        url: 'https://example.com/videos/measure-words.mp4',
        recommended: false
      },
      {
        id: 6,
        title: '看图说话练习',
        thumbnail: '/video-thumb6.jpg',
        duration: '05:40',
        category: '表达',
        description: '通过图片学习如何组织语言描述场景',
        url: 'https://example.com/videos/describe-picture.mp4',
        recommended: false
      }
    ];

    setTimeout(() => {
      setVideos(mockVideos);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = ['全部', '拼音', '汉字', '词语', '诗歌', '语法', '表达'];

  const filteredVideos = currentCategory === '全部' 
    ? videos 
    : videos.filter(video => video.category === currentCategory);

  const playVideo = (video: Video) => {
    // 更新URL但不刷新页面
    const url = new URL(window.location.href);
    url.searchParams.set('videoId', video.id.toString());
    window.history.pushState({}, '', url.toString());
    
    setSelectedVideo(video);
    setTimeout(() => {
      setIsPlaying(true);
    }, 300); // 等待动画完成后再播放
  };

  const closeVideo = () => {
    // 移除URL参数
    const url = new URL(window.location.href);
    url.searchParams.delete('videoId');
    window.history.pushState({}, '', url.toString());
    
    setTimeout(() => {
      setSelectedVideo(null);
    }, 300); // 等待动画完成后再关闭
  };

  // 视频卡片进入动画
  const videoCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  return (
    <div className={styles.container}>
      <motion.h1 
        className={styles.pageTitle}
        initial="hidden"
        animate="visible"
        variants={playfulScale}
      >
        动画学习库
      </motion.h1>

      <AnimatePresence>
        {selectedVideo ? (
          // 视频播放界面
        <motion.div 
          className={styles.videoPlayerContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button 
            className={styles.closeButton} 
            onClick={closeVideo}
            whileHover={{ scale: 1.1, backgroundColor: '#ff6b6b' }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
          <h2 className={styles.videoTitle}>{selectedVideo.title}</h2>
          <div className={styles.videoPlayer}>
            {/* 实际项目中应该使用合适的视频播放器组件 */}
            <div className={styles.videoPlaceholder}>
              <div className={styles.playIcon}>▶️</div>
              <p>视频播放区域: {selectedVideo.title}</p>
              <p>时长: {selectedVideo.duration}</p>
            </div>
          </div>
          <div className={styles.videoInfo}>
            <div className={`${styles.categoryTag} ${styles[selectedVideo.category.toLowerCase()]}`}>
              {selectedVideo.category}
            </div>
            <p className={styles.videoDescription}>{selectedVideo.description}</p>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
        // 视频列表界面
        <div className={styles.videoListContainer}>
          <motion.div 
            className={styles.categoryFilters}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {categories.map((category, index) => (
              <motion.button
                key={category}
                className={`${styles.categoryButton} ${currentCategory === category ? styles.activeCategory : ''}`}
                onClick={() => setCurrentCategory(category)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {loading ? (
            <motion.div 
              className={styles.loadingContainer}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div className={styles.loadingText}>正在加载动画视频...</div>
            </motion.div>
          ) : (
            <motion.div 
              className={styles.videoGrid}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  className={`${styles.videoCard} ${video.recommended ? styles.recommendedVideo : ''}`}
                  onClick={() => playVideo(video)}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={videoCardVariants}
                  whileHover={{ 
                    y: -5, 
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {video.recommended && <div className={styles.recommendedBadge}>推荐</div>}
                  <div className={styles.thumbnailContainer}>
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.title} className={styles.videoThumbnail} />
                    ) : (
                      <div className={styles.thumbnailPlaceholder}>{video.category}</div>
                    )}
                    <div className={styles.durationBadge}>{video.duration}</div>
                    <div className={styles.playOverlay}>▶️</div>
                  </div>
                  <h3 className={styles.videoCardTitle}>{video.title}</h3>
                  <div className={styles.videoCardInfo}>
                    <span className={styles.categoryLabel}>{video.category}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoLibrary;