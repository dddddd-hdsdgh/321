import React, { useState, useEffect } from 'react';
import styles from './styles/FamilyGuide.module.css';

// 定义亲子互动指南数据类型
interface GuideItem {
  id: string;
  title: string;
  description: string;
  materials: string[];
  steps: string[];
  ageGroup: string;
  category: string;
  duration: string;
  thumbnailUrl: string;
}

// 定义上传照片类型
interface UploadedPhoto {
  id: string;
  url: string;
  description: string;
  date: string;
}

const FamilyGuide: React.FC = () => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [guides, setGuides] = useState<GuideItem[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<GuideItem[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<GuideItem | null>(null);
  const [showGuideDetail, setShowGuideDetail] = useState<boolean>(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState<boolean>(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoDescription, setPhotoDescription] = useState<string>('');

  // 模拟数据加载
  useEffect(() => {
    // 模拟的亲子互动指南数据
    const mockGuides: GuideItem[] = [
      {
        id: '1',
        title: '拼音卡片游戏',
        description: '通过有趣的卡片游戏帮助孩子巩固拼音知识',
        materials: ['拼音卡片', '彩色笔', '小奖励贴纸'],
        steps: [
          '准备26个拼音卡片，每个卡片写上一个拼音',
          '将卡片随机散落在地上',
          '说出一个拼音，让孩子快速找到对应的卡片',
          '答对后给予小奖励贴纸',
          '逐渐增加难度，可以组合拼音让孩子拼出简单的词语'
        ],
        ageGroup: '5-6岁',
        category: '拼音学习',
        duration: '30分钟',
        thumbnailUrl: '/pinyin-game-thumbnail.png'
      },
      {
        id: '2',
        title: '汉字拼图',
        description: '通过拼图游戏了解汉字结构，增强对汉字的认知',
        materials: ['硬纸板', '彩色笔', '剪刀', '胶水'],
        steps: [
          '在硬纸板上写出简单的汉字',
          '将汉字按照结构剪成几个部分',
          '让孩子尝试将碎片重新拼回完整的汉字',
          '可以逐步增加汉字的复杂度'
        ],
        ageGroup: '6-7岁',
        category: '汉字学习',
        duration: '45分钟',
        thumbnailUrl: '/hanzi-puzzle-thumbnail.png'
      },
      {
        id: '3',
        title: '亲子阅读时间',
        description: '每天固定15分钟，和孩子一起阅读有趣的故事书',
        materials: ['适合孩子年龄的故事书', '舒适的阅读环境'],
        steps: [
          '选择一个安静舒适的角落',
          '让孩子挑选喜欢的故事书',
          '家长富有感情地朗读',
          '适时提问，引导孩子思考故事情节',
          '鼓励孩子复述或画出故事内容'
        ],
        ageGroup: '3-5岁',
        category: '阅读培养',
        duration: '15-20分钟',
        thumbnailUrl: '/reading-time-thumbnail.png'
      },
      {
        id: '4',
        title: '成语故事表演',
        description: '将成语故事改编成简单的剧本，全家一起表演',
        materials: ['简单的道具', '成语故事书'],
        steps: [
          '选择简单有趣的成语故事，如“守株待兔”、“井底之蛙”',
          '编写简单的台词和动作',
          '分配角色，准备简单的道具',
          '一起排练并表演',
          '讨论成语的含义和应用场景'
        ],
        ageGroup: '7-8岁',
        category: '语言表达',
        duration: '1小时',
        thumbnailUrl: '/idiom-performance-thumbnail.png'
      },
      {
        id: '5',
        title: '文字接龙游戏',
        description: '通过词语接龙游戏，丰富孩子的词汇量',
        materials: ['纸', '笔（可选）'],
        steps: [
          '由家长说出第一个词语',
          '孩子接下一个词语，首字必须与前一个词语的尾字相同或谐音',
          '可以限定词语的主题，如动物、水果、日常用品等',
          '记录下接出的词语，积累词汇量'
        ],
        ageGroup: '6-8岁',
        category: '词汇扩展',
        duration: '20分钟',
        thumbnailUrl: '/word-chain-thumbnail.png'
      }
    ];

    // 模拟的上传照片数据
    const mockPhotos: UploadedPhoto[] = [
      {
        id: '1',
        url: '/family-photo1.jpg',
        description: '和宝宝一起做拼音卡片',
        date: '2024-05-10'
      },
      {
        id: '2',
        url: '/family-photo2.jpg',
        description: '亲子阅读时间',
        date: '2024-05-12'
      }
    ];

    setGuides(mockGuides);
    setFilteredGuides(mockGuides);
    setUploadedPhotos(mockPhotos);
  }, []);

  // 筛选指南
  useEffect(() => {
    let filtered = guides;

    if (selectedAgeGroup !== 'all') {
      filtered = filtered.filter(guide => guide.ageGroup === selectedAgeGroup);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(guide => guide.category === selectedCategory);
    }

    setFilteredGuides(filtered);
  }, [selectedAgeGroup, selectedCategory, guides]);

  // 处理照片上传
  const handlePhotoUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (photoFile && photoDescription) {
      const newPhoto: UploadedPhoto = {
        id: Date.now().toString(),
        url: URL.createObjectURL(photoFile),
        description: photoDescription,
        date: new Date().toISOString().split('T')[0]
      };
      setUploadedPhotos([newPhoto, ...uploadedPhotos]);
      setPhotoFile(null);
      setPhotoDescription('');
      setShowPhotoUpload(false);
    }
  };

  // 打开指南详情
  const openGuideDetail = (guide: GuideItem) => {
    setSelectedGuide(guide);
    setShowGuideDetail(true);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>亲子互动指南</h1>
      
      {/* 筛选部分 */}
      <div className={styles.filterSection}>
        <div className={styles.filterGroup}>
          <label>年龄段：</label>
          <select 
            value={selectedAgeGroup} 
            onChange={(e) => setSelectedAgeGroup(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">全部年龄段</option>
            <option value="3-5岁">3-5岁</option>
            <option value="5-6岁">5-6岁</option>
            <option value="6-7岁">6-7岁</option>
            <option value="7-8岁">7-8岁</option>
          </select>
        </div>
        
        <div className={styles.filterGroup}>
          <label>活动类型：</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">全部类型</option>
            <option value="拼音学习">拼音学习</option>
            <option value="汉字学习">汉字学习</option>
            <option value="阅读培养">阅读培养</option>
            <option value="语言表达">语言表达</option>
            <option value="词汇扩展">词汇扩展</option>
          </select>
        </div>
      </div>

      {/* 互动指南列表 */}
      <div className={styles.guideList}>
        {filteredGuides.map((guide) => (
          <div 
            key={guide.id} 
            className={styles.guideCard}
            onClick={() => openGuideDetail(guide)}
          >
            <div className={styles.guideThumbnail}>
              <img 
                src={guide.thumbnailUrl} 
                alt={guide.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-thumbnail.png';
                }}
              />
            </div>
            <div className={styles.guideInfo}>
              <h3 className={styles.guideTitle}>{guide.title}</h3>
              <p className={styles.guideDescription}>{guide.description}</p>
              <div className={styles.guideMeta}>
                <span className={styles.ageTag}>{guide.ageGroup}</span>
                <span className={styles.categoryTag}>{guide.category}</span>
                <span className={styles.durationTag}>{guide.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 亲子互动相册 */}
      <div className={styles.photoAlbum}>
        <div className={styles.albumHeader}>
          <h2 className={styles.albumTitle}>亲子互动相册</h2>
          <button 
            className={styles.uploadButton}
            onClick={() => setShowPhotoUpload(true)}
          >
            上传照片
          </button>
        </div>
        
        <div className={styles.photoGrid}>
          {uploadedPhotos.map((photo) => (
            <div key={photo.id} className={styles.photoItem}>
              <div className={styles.photoImageContainer}>
                <img src={photo.url} alt={photo.description} />
              </div>
              <p className={styles.photoDescription}>{photo.description}</p>
              <p className={styles.photoDate}>{photo.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 指南详情弹窗 */}
      {showGuideDetail && selectedGuide && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>{selectedGuide.title}</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowGuideDetail(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.guideDetail}>
              <img 
                src={selectedGuide.thumbnailUrl} 
                alt={selectedGuide.title}
                className={styles.detailImage}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-thumbnail.png';
                }}
              />
              
              <div className={styles.detailMeta}>
                <span className={styles.detailAge}>{selectedGuide.ageGroup}</span>
                <span className={styles.detailCategory}>{selectedGuide.category}</span>
                <span className={styles.detailDuration}>{selectedGuide.duration}</span>
              </div>
              
              <div className={styles.detailSection}>
                <h3>活动介绍</h3>
                <p>{selectedGuide.description}</p>
              </div>
              
              <div className={styles.detailSection}>
                <h3>准备材料</h3>
                <ul>
                  {selectedGuide.materials.map((material, index) => (
                    <li key={index}>{material}</li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.detailSection}>
                <h3>活动步骤</h3>
                <ol>
                  {selectedGuide.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 照片上传弹窗 */}
      {showPhotoUpload && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>上传亲子互动照片</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setShowPhotoUpload(false)}
              >
                ×
              </button>
            </div>
            
            <form className={styles.uploadForm} onSubmit={handlePhotoUpload}>
              <div className={styles.formGroup}>
                <label htmlFor="photoUpload">选择照片：</label>
                <input 
                  type="file" 
                  id="photoUpload"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setPhotoFile(e.target.files[0]);
                    }
                  }}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="photoDescription">照片描述：</label>
                <textarea 
                  id="photoDescription"
                  value={photoDescription}
                  onChange={(e) => setPhotoDescription(e.target.value)}
                  placeholder="描述一下这张照片中的亲子互动..."
                  rows={3}
                  required
                />
              </div>
              
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>上传</button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowPhotoUpload(false)}
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyGuide;