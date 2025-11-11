// pages/child/Home.js
// 导入工具 - 微信小程序兼容版
const { supabase, courses: coursesApi, studyRecords } = require('../../utils/supabase.js');

Page({
  data: {
    userInfo: { name: '小明', avatar: '👦', grade: '一年级' },
    // 今日推荐课程，初始为空数组
    todayRecommend: [],
    // 课程进度映射表
    courseProgressMap: {},
    // 加载中状态
    isLoading: false,
    // 错误信息
    error: null,
    // 功能模块
    functionModules: [
      { id: 'pinyin', name: '拼音乐园', icon: '/assets/icons/pinyin_master.png', page: 'PinyinParadise', desc: '学习拼音基础' },
      { id: 'hanzi', name: '汉字世界', icon: '/assets/icons/hanzi_master.png', page: 'HanziWorld', desc: '探索汉字奥秘' },
      { id: 'sentence', name: '句子花园', icon: '/assets/icons/suggestion.png', page: 'SentenceGarden', desc: '句子练习乐园' },
      { id: 'poetry', name: '唐诗宋词', icon: '/assets/courses/poetry.png', page: 'PoetryGarden', desc: '经典诗词欣赏' }
    ],
    // 模拟数据 - 成就列表
    achievements: [
      {
        id: '1',
        name: '拼音小能手',
        description: '完成5节拼音课程',
        icon: '/assets/icons/pinyin_master.png',
        unlocked: true,
        unlocked_at: '2024-01-15'
      },
      {
        id: '2',
        name: '汉字达人',
        description: '学习100个汉字',
        icon: '/assets/icons/hanzi_master.png',
        unlocked: true,
        unlocked_at: '2024-01-18'
      },
      {
        id: '3',
        name: '坚持学习',
        description: '连续学习7天',
        icon: '/assets/icons/continuous.png',
        unlocked: false
      }
    ],
    isLoading: false,
    error: null,
    currentChildId: 'mock-child-id-1'
  },

  onLoad: function(options) {
    // 检查是否有传递的子ID参数
    if (options.childId) {
      this.setData({ currentChildId: options.childId });
    } else {
      // 从全局数据获取当前选中的孩子
      const app = getApp();
      if (app.globalData.currentChild) {
        this.setData({ currentChildId: app.globalData.currentChild.id });
      }
    }
    
    console.log('首页加载，当前儿童ID:', this.data.currentChildId);
    // 初始化页面数据
    this.initializePageData();
  },

  onShow: function() {
    console.log('首页显示，刷新数据');
    // 每次显示页面时重新加载数据
    this.loadTodayRecommend();
  },
  
  // 初始化页面数据
  initializePageData: function() {
    this.setData({ 
      isLoading: true,
      error: null
    });
    
    // 加载今日推荐课程
    this.loadTodayRecommend();
  },
  
  // 加载今日推荐课程
  loadTodayRecommend: async function() {
    console.log('开始加载今日推荐课程...');
    try {
      this.setData({ isLoading: true, error: null });
      console.log('设置加载状态为true，清除错误信息');
      
      // 调用API获取今日推荐课程
      console.log('调用coursesApi.getRecommendedCourses，type=daily, limit=10');
      const { data: recommendedCourses, error } = await coursesApi.getRecommendedCourses('daily', 10);
      
      console.log('API调用结果:', { recommendedCourses, error });
      
      if (error) {
        console.error('获取推荐课程失败:', error);
        throw new Error('获取推荐课程失败');
      }
      
      // 如果有推荐课程，获取学习进度
      let courseProgressMap = {};
      if (Array.isArray(recommendedCourses) && recommendedCourses.length > 0 && this.data.currentChildId) {
        console.log(`获取${recommendedCourses.length}个课程的学习进度，儿童ID: ${this.data.currentChildId}`);
        const courseIds = recommendedCourses.map(course => course.id);
        console.log('课程ID列表:', courseIds);
        const { data: progressData } = await coursesApi.getChildCourseProgress(this.data.currentChildId, courseIds);
        courseProgressMap = progressData || {};
        console.log('学习进度数据:', courseProgressMap);
      } else {
        console.log('无需获取学习进度，原因:', 
          !recommendedCourses ? '没有推荐课程' : 
          !recommendedCourses.length ? '推荐课程列表为空' : 
          !this.data.currentChildId ? '缺少儿童ID' : '未知');
      }
      
      // 转换课程数据格式，添加进度信息
      console.log('开始格式化课程数据...');
      const formattedCourses = Array.isArray(recommendedCourses) ? recommendedCourses.map(course => {
        const progress = courseProgressMap[course.id] || { progress: 0, completed: false };
        
        return {
          id: course.id,
          title: course.title,
          category_id: course.category_id,
          cover_image: course.thumbnail_url || '/assets/courses/pinyin.png',
          description: course.description || '暂无描述',
          difficulty: course.difficulty || 'easy',
          total_duration: Math.ceil((course.duration || 0) / 60), // 转换为分钟
          progress: progress.progress,
          completed: progress.completed,
          type: course.type || 'video' // 添加课程类型
        };
      }) : [];
      console.log('课程数据格式化完成，共', formattedCourses.length, '个课程');
      
      this.setData({
        todayRecommend: formattedCourses,
        courseProgressMap: courseProgressMap,
        isLoading: false
      });
      
      console.log('今日推荐课程加载完成:', formattedCourses);
    } catch (error) {
      console.error('加载推荐课程失败:', error);
      console.log('切换到备用模拟数据');
      
      const fallbackData = [
        {
          id: '1',
          title: '声母韵母入门',
          category_id: '1',
          cover_image: '/assets/courses/pinyin.png',
          description: '学习拼音基础，掌握声母韵母',
          difficulty: 'easy',
          total_duration: 15,
          progress: 30,
          type: 'video'
        },
        {
          id: '2',
          title: '常用汉字启蒙',
          category_id: '2',
          cover_image: '/assets/courses/characters.png',
          description: '认识100个常用汉字',
          difficulty: 'medium',
          total_duration: 20,
          progress: 0,
          type: 'story'
        },
        {
          id: '3',
          title: '经典儿歌诵读',
          category_id: '3',
          cover_image: '/assets/courses/poetry.png',
          description: '跟着音乐朗读经典儿歌',
          difficulty: 'easy',
          total_duration: 10,
          progress: 75,
          type: 'game'
        }
      ];
      
      this.setData({
        error: '加载课程失败，请稍后重试',
        isLoading: false,
        // 如果加载失败，使用备用的模拟数据
        todayRecommend: fallbackData
      });
      
      console.log('已设置错误状态和备用数据');
    }
  },

  // 加载功能分类
  loadCategories: function() {
    // 功能分类数据保持不变，仍然使用预定义的数据
    console.log('功能分类数据已加载');
  },

  // 加载成就列表
  loadAchievements: function() {
    // 成就数据保持不变，仍然使用预定义的数据
    console.log('成就数据已加载');
  },

  // 跳转到课程详情页
  goToCourse: function(e) {
    const { id, type } = e.currentTarget.dataset;
    console.log(`用户点击推荐课程，ID: ${id}, 类型: ${type}`);
    // 根据课程类型确定跳转的页面路径
    const pagePath = type === 'story' ? 'StoryDetail' : 'CourseDetail';
    const targetUrl = `/pages/child/${pagePath}?id=${id}`;
    console.log(`准备跳转到: ${targetUrl}`);
    wx.navigateTo({
      url: targetUrl,
      success: () => {
        console.log('页面跳转成功');
      },
      fail: (err) => {
        console.error('页面跳转失败:', err);
      }
    });
  },

  // 跳转到功能模块
  goToFeature: function(e) {
    const { id } = e.currentTarget.dataset;
    // 根据功能ID映射到正确的页面路径
    const pageMap = {
      'pinyin': 'PinyinParadise',
      'hanzi': 'HanziWorld',
      'sentence': 'SentenceGarden',
      'poetry': 'PoetryGarden'
    };
    
    const pageName = pageMap[id] || id;
    // 跳转到相应页面
    wx.navigateTo({
      url: `/pages/child/${pageName}`
    });
  },

  // 查看所有推荐
  viewAllRecommend: function() {
    wx.navigateTo({
      url: '/pages/child/Courses'
    });
  },

  // 跳转到成就页面
  goToAchievements: function() {
    wx.navigateTo({
      url: '/pages/child/Achievements'
    });
  },

  // 分享页面
  onShareAppMessage: function() {
    return {
      title: '萌豆语文动画屋 - 让孩子爱上语文学习',
      path: '/pages/child/Home'
    };
  }
});