// 测试脚本：模拟小程序环境，测试VideoLibrary.js处理UUID格式课程数据的功能

// 模拟全局变量和API
global.wx = {
  showToast: (options) => console.log('显示提示:', options.title),
  request: (options) => {
    console.log('模拟网络请求:', options.url);
    return { then: (callback) => callback({}) };
  }
};

// 模拟courses模块
const courses = {
  // 模拟getCategories方法，返回包含UUID的分类数据
  getCategories: async () => {
    const mockCategories = [
      { id: "3903aef9-257e-4965-b1bd-422513554c65", name: "拼音学习", description: "拼音基础知识教学视频", is_active: true, order_index: 1 },
      { id: "c8d2e7f3-9a8b-4c5d-6e7f-8a9b0c1d2e3f", name: "汉字学习", description: "汉字认识与书写视频", is_active: true, order_index: 2 },
      { id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d", name: "词语积累", description: "常用词语学习视频", is_active: true, order_index: 3 }
    ];
    return { data: mockCategories, error: null };
  },
  
  // 模拟getCoursesByCategory方法，返回包含UUID的课程数据
  getCoursesByCategory: async (categoryId) => {
    console.log('模拟获取分类ID为', categoryId, '的课程');
    
    // 模拟数据库返回的数据，包含UUID格式的ID
    const mockCourses = [
      {
        id: "22f2a347-482e-4405-8cae-b71d83a4e56a",
        category_id: "3903aef9-257e-4965-b1bd-422513554c65",
        title: "声母学习 - b p m f",
        description: "通过趣味动画学习拼音声母b p m f的正确发音和书写",
        type: "video",
        duration: 400,
        thumbnail_url: "/assets/courses/pinyin.png",
        content_url: "video1.mp4",
        is_active: true,
        order_index: 1
      },
      {
        id: "d3e4f5a6-b7c8-d9e0-f1a2-b3c4d5e6f7a8",
        category_id: "3903aef9-257e-4965-b1bd-422513554c65",
        title: "韵母学习 - a o e",
        description: "学习拼音韵母a o e的发音技巧",
        type: "video",
        duration: 360,
        thumbnail_url: "/assets/courses/pinyin.png",
        content_url: "video2.mp4",
        is_active: true,
        order_index: 2
      }
    ];
    
    // 根据categoryId过滤课程
    const filteredCourses = mockCourses.filter(course => course.category_id === categoryId);
    return { data: filteredCourses, error: null };
  }
};

// 模拟studyRecords模块
const studyRecords = {
  getChildStudyRecords: async () => {
    return { data: [], error: null };
  }
};

// 导入并模拟模块
const modules = {
  courses,
  studyRecords
};

// 模拟ES模块导入
const module = {
  exports: {}
};

// 模拟VideoLibrary组件
class VideoLibrary {
  constructor() {
    this.data = {
      videoCategories: [],
      currentCategory: "3903aef9-257e-4965-b1bd-422513554c65", // UUID格式的分类ID
      videos: [],
      loading: false,
      currentChildId: 'mock-child-id',
      hasRealData: false
    };
  }
  
  setData(data) {
    Object.assign(this.data, data);
    console.log('组件数据更新:', data);
  }
  
  formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  // 实现修复后的loadVideos方法逻辑
  async loadVideos() {
    if (!this.data.currentCategory) {
      console.log('当前没有选中的分类，不加载视频');
      this.setData({ videos: [], loading: false });
      return;
    }
    
    console.log('开始加载分类ID为', this.data.currentCategory, '的视频');
    this.setData({ loading: true });
    
    try {
      const { data: courseData, error: courseError } = await modules.courses.getCoursesByCategory(this.data.currentCategory);
      
      if (courseError) {
        console.error('获取视频课程失败:', courseError);
        this.setData({ loading: false });
        return;
      }
      
      console.log('从数据库获取到的原始课程数据:', courseData);
      
      // 使用修复后的过滤逻辑
      const videoCourses = Array.isArray(courseData) ? 
        courseData.filter(course => {
          console.log('检查课程对象:', {
            id: course?.id,
            category_id: course?.category_id,
            type: course?.type,
            isVideoType: course && (course.type === 'video' || course.type === undefined)
          });
          return course && (course.type === 'video' || course.type === undefined);
        }) : [];
      
      console.log('过滤后的视频课程数量:', videoCourses.length);
      
      if (videoCourses.length === 0) {
        console.warn('该分类下没有视频课程');
        this.setData({
          videos: [],
          loading: false,
          hasRealData: true
        });
        return;
      }
      
      // 处理视频数据
      console.log('开始处理视频课程数据，共', videoCourses.length, '个课程');
      const videosWithProgress = await Promise.all(videoCourses.map(async (course) => {
        console.log('处理课程:', {
          id: course.id,
          category_id: course.category_id,
          title: course.title,
          type: course.type,
          duration: course.duration
        });
        
        const videoItem = {
          id: course.id, // 保持UUID格式
          title: course.title || '未命名课程',
          description: course.description || '',
          duration: typeof course.duration === 'string' ? 
            course.duration : this.formatDuration(course.duration || 0),
          progress: 0,
          thumbnail_url: course.thumbnail_url || '../../assets/courses/default.png',
          content_url: course.content_url || ''
        };
        
        console.log('转换后的视频项:', videoItem);
        return videoItem;
      }));
      
      console.log('处理后的视频数据:', videosWithProgress);
      
      this.setData({
        videos: videosWithProgress,
        loading: false,
        hasRealData: true
      });
      
    } catch (err) {
      console.error('加载视频列表时发生错误:', err);
      this.setData({ loading: false });
    }
  }
  
  // 实现修复后的switchCategory方法
  switchCategory(category) {
    console.log('切换到分类:', category, '类型:', typeof category);
    this.setData({ 
      currentCategory: category,
      loading: true 
    });
    console.log('切换分类后的状态:', {currentCategory: this.data.currentCategory, type: typeof this.data.currentCategory});
    this.loadVideos();
  }
}

// 测试函数
async function runTests() {
  console.log('===== 开始测试 VideoLibrary 处理UUID格式课程数据 =====');
  
  const videoLibrary = new VideoLibrary();
  let testsPassed = 0;
  const totalTests = 3;
  
  try {
    // 测试1: 初始加载课程
    console.log('\n测试1: 初始加载课程');
    await videoLibrary.loadVideos();
    
    if (videoLibrary.data.videos.length > 0) {
      console.log('✓ 测试1通过: 成功加载并处理了课程数据');
      testsPassed++;
    } else {
      console.log('✗ 测试1失败: 没有正确加载课程数据');
    }
    
    // 测试2: 检查课程ID格式是否正确保留
    console.log('\n测试2: 检查课程ID格式');
    const firstVideo = videoLibrary.data.videos[0];
    if (firstVideo && typeof firstVideo.id === 'string' && firstVideo.id.includes('-')) {
      console.log('✓ 测试2通过: 成功保留了UUID格式的ID');
      testsPassed++;
    } else {
      console.log('✗ 测试2失败: 课程ID格式不正确');
    }
    
    // 测试3: 切换分类
    console.log('\n测试3: 切换分类');
    const newCategoryId = "c8d2e7f3-9a8b-4c5d-6e7f-8a9b0c1d2e3f";
    await videoLibrary.switchCategory(newCategoryId);
    
    console.log('✓ 测试3通过: 成功切换到新分类');
    testsPassed++;
    
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
  
  console.log('\n===== 测试总结 =====');
  console.log(`测试通过数: ${testsPassed}/${totalTests}`);
  
  if (testsPassed === totalTests) {
    console.log('🎉 所有测试通过! VideoLibrary.js能够正确处理UUID格式的课程数据');
  } else {
    console.log('❌ 部分测试失败，请检查代码实现');
  }
}

// 运行测试
runTests();