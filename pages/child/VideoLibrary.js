// pages/child/VideoLibrary.js
const app = getApp();
const { courses, studyRecords } = require('../../utils/supabase');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoCategories: [],
    currentCategory: null,
    videos: [],
    loading: false,
    currentChildId: '',
    hasRealData: false // 标记是否使用了真实API数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取当前登录的儿童ID
    this.setData({
      currentChildId: app.globalData.currentUser.id
    });
    
    // 先加载视频分类
    this.loadVideoCategories();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 更新设置状态
    this.setData({
      soundEnabled: app.globalData.studySettings.sound,
      musicEnabled: app.globalData.studySettings.music
    });
  },

  /**
   * 切换视频分类
   */
  switchCategory(e) {
    // 从事件中获取分类ID，确保正确处理
    const category = e.currentTarget.dataset.category;
    console.log('切换到分类:', category, '类型:', typeof category);
    
    // 设置当前分类，保持原始格式（可能是数字或字符串/UUID）
    this.setData({ currentCategory: category });
    console.log('切换分类后的状态:', {currentCategory: this.data.currentCategory, type: typeof this.data.currentCategory});
    
    // 显示加载状态
    this.setData({ loading: true });
    
    // 始终尝试从数据库加载课程
    this.loadVideos();
  },

  /**
   * 加载视频分类
   */
  loadVideoCategories: async function() {
    console.log('开始加载视频分类');
    this.setData({ loading: true });
    
    try {
      // 从数据库获取课程分类
      const { data, error } = await courses.getCategories();
      
      if (error) {
        console.error('获取视频分类失败:', error);
        // 显示错误信息但不立即切换到模拟数据，让用户知道连接问题
        wx.showToast({ 
          title: '数据库连接失败，请检查网络设置', 
          icon: 'none',
          duration: 3000
        });
        
        // 提供更详细的错误日志
        if (error.errMsg) {
          console.error('网络请求错误信息:', error.errMsg);
        }
        
        // 仍然尝试使用模拟数据作为备选方案
        console.log('将使用模拟数据作为备选');
        this.useMockData();
        return;
      }
      
      // 详细调试日志：记录原始数据类型和内容
      console.log('原始API返回数据类型:', typeof data);
      console.log('原始API返回数据:', data);
      
      // 处理API返回单个对象或数组的情况
      const dataArray = Array.isArray(data) ? data : (data ? [data] : []);
      console.log('转换后的数据数组长度:', dataArray.length);
      console.log('转换后的数据数组内容:', dataArray);
      
      // 过滤出有效的分类对象（确保每个对象有id和name属性）
      const validCategories = dataArray.filter(category => 
        category && category.id && category.name
      );
      console.log('过滤后的有效分类数量:', validCategories.length);
      
      // 检查是否获取到了分类数据
      if (validCategories.length === 0) {
        console.warn('未获取到有效的分类数据，将使用模拟数据');
        this.useMockData();
        return;
      }
      
      // 使用过滤后的有效分类
      const videoCategories = validCategories;
      
      // 设置分类数据，使用返回的第一个分类作为默认分类
      const defaultCategory = videoCategories[0].id;
      console.log('设置默认分类:', defaultCategory);
      
      this.setData({ 
        videoCategories,
        currentCategory: defaultCategory,
        hasRealData: true // 成功获取API数据
      });
      
      console.log('设置分类数据后的状态:', {
        videoCategoriesCount: this.data.videoCategories.length,
        currentCategory: this.data.currentCategory
      });
      
      // 加载默认分类下的视频
      console.log('加载默认分类视频:', defaultCategory);
      this.loadVideos();
      
    } catch (err) {
      console.error('加载视频分类时发生错误:', err);
      // 显示错误信息
      wx.showToast({ 
        title: '加载分类失败', 
        icon: 'none'
      });
      // 确保设置loading为false，防止界面一直显示加载状态
      this.setData({ loading: false });
      // 使用模拟数据作为备选
      console.log('捕获到异常，将使用模拟数据');
      this.useMockData();
    } finally {
      // 确保下拉刷新停止
      wx.stopPullDownRefresh();
    }
  },
  
  /**
   * 使用模拟数据（当API调用失败时）
   */
  useMockData: function() {
    console.log('使用模拟数据展示视频库');
    console.log('调用useMockData前的videoCategories:', this.data.videoCategories);
    
    // 模拟视频分类数据
    const mockCategories = [
      { id: 'pinyin', name: '拼音学习', description: '拼音基础知识教学视频' },
      { id: 'hanzi', name: '汉字学习', description: '汉字认识与书写视频' },
      { id: 'word', name: '词语学习', description: '常用词语教学视频' },
      { id: 'sentence', name: '句子学习', description: '简单句子教学视频' }
    ];
    
    // 确保mockCategories是数组格式
    const categoriesToUse = Array.isArray(mockCategories) ? mockCategories : [];
    console.log('准备使用的模拟分类数据:', categoriesToUse);
    
    // 使用categoriesToUse中的第一个分类作为默认分类，而不是硬编码为'pinyin'
      const defaultCategory = categoriesToUse.length > 0 ? categoriesToUse[0].id : null;
      this.setData({
        videoCategories: categoriesToUse,
        currentCategory: defaultCategory,
        loading: false
      });
    console.log('设置模拟数据后的状态:', {videoCategories: this.data.videoCategories, currentCategory: this.data.currentCategory});
    
    // 加载默认分类的模拟视频数据
      if (defaultCategory) {
        this.loadMockVideos(defaultCategory);
      }
      // 停止下拉刷新
      wx.stopPullDownRefresh();
  },
  
  /**
   * 加载模拟视频数据
   */
  loadMockVideos: function(categoryId) {
    // 根据分类ID提供不同的模拟视频数据
    const mockVideos = {
      pinyin: [
        {
          id: 'pinyin_1',
          title: '声母学习 - b p m f',
          duration: '05:23',
          progress: 0,
          thumbnail_url: '../../assets/courses/pinyin.png',
          content_url: ''
        },
        {
          id: 'pinyin_2',
          title: '韵母学习 - a o e',
          duration: '04:15',
          progress: 0,
          thumbnail_url: '../../assets/courses/pinyin.png',
          content_url: ''
        }
      ],
      hanzi: [
        {
          id: 'hanzi_1',
          title: '基础汉字 - 一二三',
          duration: '06:40',
          progress: 0,
          thumbnail_url: '../../assets/courses/characters.png',
          content_url: ''
        },
        {
          id: 'hanzi_2',
          title: '常用汉字 - 人口手',
          duration: '07:12',
          progress: 0,
          thumbnail_url: '../../assets/courses/characters.png',
          content_url: ''
        }
      ],
      word: [
        {
          id: 'word_1',
          title: '日常生活词汇',
          duration: '08:30',
          progress: 0,
          thumbnail_url: '../../assets/courses/reading.png',
          content_url: ''
        },
        {
          id: 'word_2',
          title: '颜色和数字词汇',
          duration: '05:55',
          progress: 0,
          thumbnail_url: '../../assets/courses/reading.png',
          content_url: ''
        }
      ],
      sentence: [
        {
          id: 'sentence_1',
          title: '简单问候语',
          duration: '06:20',
          progress: 0,
          thumbnail_url: '../../assets/courses/poetry.png',
          content_url: ''
        },
        {
          id: 'sentence_2',
          title: '日常对话',
          duration: '07:45',
          progress: 0,
          thumbnail_url: '../../assets/courses/poetry.png',
          content_url: ''
        }
      ]
    };
    
    // 确保videos数据是数组格式
    const videosToUse = Array.isArray(mockVideos[categoryId]) ? mockVideos[categoryId] : [];
    
    this.setData({
      videos: videosToUse,
      loading: false
    });
  },
  
  /**
   * 加载视频列表
   */
  loadVideos: async function() {
    if (!this.data.currentCategory) {
      console.log('当前没有选中的分类，不加载视频');
      this.setData({ videos: [], loading: false });
      return;
    }
    console.log('开始加载分类ID为', this.data.currentCategory, '的视频');
    
    this.setData({ loading: true });
    
    try {
      // 从数据库获取该分类下的视频课程
      const { data: courseData, error: courseError } = await courses.getCoursesByCategory(this.data.currentCategory);
      
      if (courseError) {
        console.error('获取视频课程失败:', courseError);
        
        // 显示友好的错误信息
        wx.showToast({ 
          title: '加载课程数据失败', 
          icon: 'none',
          duration: 2000
        });
        
        // 提供更详细的错误日志
        if (courseError.errMsg) {
          console.error('网络请求错误信息:', courseError.errMsg);
        }
        
        // 如果有模拟数据，使用模拟数据作为备选
        this.loadMockVideos(this.data.currentCategory);
        return;
      }
      
      console.log('从数据库获取到的原始课程数据:', courseData);
      
      // 处理API返回单个对象或数组的情况
      const dataArray = Array.isArray(courseData) ? courseData : (courseData ? [courseData] : []);
      console.log('转换后的数据数组长度:', dataArray.length);
      
      // 优化过滤逻辑，确保正确处理数据库返回的数据
      const videoCourses = dataArray.filter(course => {
        // 添加详细的调试信息
        console.log('检查课程对象:', {
          id: course?.id,
          category_id: course?.category_id,
          type: course?.type,
          isVideoType: course && (course.type === 'video' || course.type === undefined)
        });
        // 放宽类型检查，允许undefined类型的课程也被包含
        return course && (course.type === 'video' || course.type === undefined);
      });
      
      console.log('过滤后的视频课程数量:', videoCourses.length);
      
      // 检查是否获取到了课程数据
      if (videoCourses.length === 0) {
        console.warn('该分类下没有视频课程');
        this.setData({
          videos: [],
          loading: false,
          hasRealData: true
        });
        return;
      }
      
      // 获取每个视频的学习进度
      console.log('开始处理视频课程数据，共', videoCourses.length, '个课程');
      const videosWithProgress = await Promise.all(videoCourses.map(async (course) => {
        // 打印每个课程的详细信息，帮助调试
        console.log('处理课程:', {
          id: course.id,
          category_id: course.category_id,
          title: course.title,
          type: course.type,
          duration: course.duration
        });
        
        // 初始化视频对象，确保正确处理UUID格式的ID
        const videoItem = {
          id: course.id, // 保持原始ID格式（UUID）
          title: course.title || '未命名课程',
          description: course.description || '',
          // 处理duration可能是字符串或数字的情况
          duration: typeof course.duration === 'string' ? 
            course.duration : this.formatDuration(course.duration || 0),
          progress: 0,
          thumbnail_url: course.thumbnail_url || '../../assets/courses/default.png',
          content_url: course.content_url || ''
        };
        
        console.log('转换后的视频项:', videoItem);
        
        // 尝试获取学习记录来确定进度
        try {
          // 只有当currentChildId有效时才获取学习记录
          if (this.data.currentChildId) {
            const { data: records, error: recordsError } = await studyRecords.getChildStudyRecords(
              this.data.currentChildId,
              1,
              course.id
            );
            
            // 处理学习记录API调用失败的情况，但继续使用课程数据
            if (recordsError) {
              console.warn('获取学习记录失败，将使用默认进度:', recordsError);
            } else if (Array.isArray(records) && records.length > 0) {
              // 成功获取到学习记录，更新进度
              videoItem.progress = records[0].progress || 0;
              console.log(`课程 ${course.id} 的学习进度: ${videoItem.progress}%`);
            }
          }
        } catch (err) {
          console.error('获取学习进度失败:', err);
          // 保持默认进度为0
        }
        
        return videoItem;
      }));
      
      console.log('处理后的视频数据:', videosWithProgress);
      
      this.setData({
        videos: videosWithProgress,
        loading: false,
        hasRealData: true // 成功获取API数据
      });
      
    } catch (err) {
      console.error('加载视频列表时发生错误:', err);
      // 显示错误信息
      wx.showToast({ 
        title: '加载过程发生异常', 
        icon: 'none'
      });
      // 捕获错误时尝试使用模拟数据作为备选
      console.log('捕获到异常，将使用模拟数据');
      this.loadMockVideos(this.data.currentCategory);
    }
  },

  /**
   * 格式化视频时长
   */
  formatDuration: function(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  /**
   * 播放视频
   */
  playVideo(e) {
    const videoId = e.currentTarget.dataset.id;
    const video = this.data.videos.find(v => v.id === videoId);
    
    if (video && video.content_url) {
      wx.navigateTo({
        url: `/pages/child/VideoPlayer?id=${videoId}`
      });
    } else {
      wx.showToast({ title: '视频暂不可用', icon: 'none' });
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadVideoCategories();
    // 不在这里停止下拉刷新，而是在数据加载完成后停止
    // wx.stopPullDownRefresh();
  },

  /**
   * 分享功能
   */
  onShareAppMessage() {
    return {
      title: '儿童学习视频库',
      path: '/pages/child/VideoLibrary'
    };
  }
});