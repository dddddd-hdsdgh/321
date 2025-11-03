import React, { useState, useEffect } from 'react';
import styles from './styles/ContentManagement.module.css';

interface VideoContent {
  id: string;
  title: string;
  category: 'pinyin' | 'hanzi' | 'story';
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  uploadDate: string;
  plays: number;
  status: 'published' | 'draft' | 'review';
  thumbnailUrl: string;
}

const ContentManagement: React.FC = () => {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredVideos, setFilteredVideos] = useState<VideoContent[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // 模拟数据加载
  useEffect(() => {
    setTimeout(() => {
      const mockVideos: VideoContent[] = [
        {
          id: 'v1',
          title: '声母家族大冒险',
          category: 'pinyin',
          duration: '12:30',
          level: 'beginner',
          uploadDate: '2024-05-01',
          plays: 2580,
          status: 'published',
          thumbnailUrl: '/pinyin1-thumbnail.png'
        },
        {
          id: 'v2',
          title: '韵母精灵乐园',
          category: 'pinyin',
          duration: '15:45',
          level: 'beginner',
          uploadDate: '2024-05-10',
          plays: 1876,
          status: 'published',
          thumbnailUrl: '/pinyin2-thumbnail.png'
        },
        {
          id: 'v3',
          title: '声调王国奇游记',
          category: 'pinyin',
          duration: '18:20',
          level: 'intermediate',
          uploadDate: '2024-05-20',
          plays: 1432,
          status: 'published',
          thumbnailUrl: '/pinyin3-thumbnail.png'
        },
        {
          id: 'v4',
          title: '日字的演化故事',
          category: 'hanzi',
          duration: '10:15',
          level: 'beginner',
          uploadDate: '2024-06-01',
          plays: 2154,
          status: 'published',
          thumbnailUrl: '/hanzi1-thumbnail.png'
        },
        {
          id: 'v5',
          title: '水字的奇妙旅程',
          category: 'hanzi',
          duration: '11:30',
          level: 'beginner',
          uploadDate: '2024-06-05',
          plays: 1789,
          status: 'published',
          thumbnailUrl: '/hanzi2-thumbnail.png'
        },
        {
          id: 'v6',
          title: '山字的故事',
          category: 'hanzi',
          duration: '09:45',
          level: 'beginner',
          uploadDate: '2024-06-10',
          plays: 956,
          status: 'review',
          thumbnailUrl: '/hanzi3-thumbnail.png'
        },
        {
          id: 'v7',
          title: '三只小猪学拼音',
          category: 'story',
          duration: '22:15',
          level: 'intermediate',
          uploadDate: '2024-05-15',
          plays: 3210,
          status: 'published',
          thumbnailUrl: '/story1-thumbnail.png'
        },
        {
          id: 'v8',
          title: '汉字王国大冒险',
          category: 'story',
          duration: '25:30',
          level: 'advanced',
          uploadDate: '2024-06-08',
          plays: 543,
          status: 'draft',
          thumbnailUrl: '/story2-thumbnail.png'
        }
      ];
      
      setVideos(mockVideos);
      setFilteredVideos(mockVideos);
      setLoading(false);
    }, 800);
  }, []);

  // 筛选视频
  useEffect(() => {
    let result = [...videos];
    
    // 搜索筛选
    if (searchTerm) {
      result = result.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // 类别筛选
    if (filterCategory !== 'all') {
      result = result.filter(video => video.category === filterCategory);
    }
    
    // 状态筛选
    if (filterStatus !== 'all') {
      result = result.filter(video => video.status === filterStatus);
    }
    
    setFilteredVideos(result);
  }, [searchTerm, filterCategory, filterStatus, videos]);

  // 更新视频状态
  const updateVideoStatus = (videoId: string, newStatus: 'published' | 'draft' | 'review') => {
    setVideos(videos.map(video => 
      video.id === videoId ? { ...video, status: newStatus } : video
    ));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>内容管理</h1>
      
      <div className={styles.actionBar}>
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="搜索视频标题..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">全部分类</option>
              <option value="pinyin">拼音类</option>
              <option value="hanzi">汉字类</option>
              <option value="story">故事类</option>
            </select>
          </div>
          
          <div className={styles.filterGroup}>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">全部状态</option>
              <option value="published">已发布</option>
              <option value="review">审核中</option>
              <option value="draft">草稿</option>
            </select>
          </div>
        </div>
        
        <button 
          className={styles.uploadButton}
          onClick={() => setShowUploadModal(true)}
        >
          上传新视频
        </button>
      </div>
      
      <div className={styles.videoGrid}>
        {loading ? (
          <div className={styles.loading}>加载中...</div>
        ) : filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <div key={video.id} className={styles.videoCard}>
              <div className={styles.videoThumbnail}>
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-thumbnail.png';
                  }}
                />
                <span className={styles.videoDuration}>{video.duration}</span>
                <span className={`${styles.statusBadge} ${styles[`status${video.status.charAt(0).toUpperCase() + video.status.slice(1)}`]}`}>
                  {video.status === 'published' ? '已发布' : video.status === 'review' ? '审核中' : '草稿'}
                </span>
              </div>
              
              <div className={styles.videoInfo}>
                <h3 className={styles.videoTitle}>{video.title}</h3>
                
                <div className={styles.videoMeta}>
                  <span className={`${styles.categoryBadge} ${styles[`category${video.category.charAt(0).toUpperCase() + video.category.slice(1)}`]}`}>
                    {video.category === 'pinyin' ? '拼音' : video.category === 'hanzi' ? '汉字' : '故事'}
                  </span>
                  <span className={styles.levelText}>
                    {video.level === 'beginner' ? '入门' : video.level === 'intermediate' ? '中级' : '高级'}
                  </span>
                  <span className={styles.playsText}>{video.plays} 播放</span>
                </div>
                
                <div className={styles.videoActions}>
                  <button 
                    className={styles.actionButton}
                    onClick={() => updateVideoStatus(video.id, 'published')}
                    disabled={video.status === 'published'}
                  >
                    发布
                  </button>
                  <button 
                    className={styles.actionButton}
                    onClick={() => updateVideoStatus(video.id, 'draft')}
                    disabled={video.status === 'draft'}
                  >
                    草稿
                  </button>
                  <button 
                    className={styles.actionButton}
                    onClick={() => updateVideoStatus(video.id, 'review')}
                    disabled={video.status === 'review'}
                  >
                    审核
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>没有找到匹配的视频内容</div>
        )}
      </div>
      
      {/* 上传视频弹窗 */}
      {showUploadModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>上传新视频</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowUploadModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.uploadForm}>
              <p className={styles.uploadFormPlaceholder}>视频上传功能开发中...</p>
              <div className={styles.formActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowUploadModal(false)}
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;