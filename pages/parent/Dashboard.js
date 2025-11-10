// pages/parent/Dashboard.js
// 导入工具 - 微信小程序兼容版
// 注意：移除了直接的Supabase依赖，使用模拟数据

Page({
  data: {
    // 模拟数据 - 孩子列表
    children: [
      {
        id: 'child1',
        name: '小明',
        avatar: '👦',
        grade: '一年级',
        age: 6,
        created_at: '2024-01-01',
        studyStats: {
          totalDays: 15,
          totalHours: 7.5,
          completedCourses: 8,
          currentStreak: 7
        },
        recentRecords: [
          {
            courseName: '声母韵母入门',
            date: '今天',
            duration: '20分钟',
            progress: 75
          },
          {
            courseName: '常用汉字启蒙',
            date: '今天',
            duration: '15分钟',
            progress: 40
          }
        ]
      },
      {
        id: 'child2',
        name: '小红',
        avatar: '👧',
        grade: '二年级',
        age: 7,
        created_at: '2024-01-05',
        studyStats: {
          totalDays: 12,
          totalHours: 6.2,
          completedCourses: 6,
          currentStreak: 5
        },
        recentRecords: [
          {
            courseName: '经典儿歌诵读',
            date: '昨天',
            duration: '10分钟',
            progress: 100
          },
          {
            courseName: '基础数学练习',
            date: '昨天',
            duration: '25分钟',
            progress: 60
          }
        ]
      }
    ],
    currentChildIndex: 0,
    selectedDate: '今日',
    notificationCount: 2,
    showChildSelector: false,
    isLoading: false, // 使用模拟数据，无需加载
    error: null,
    refreshing: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('Dashboard页面加载，使用模拟数据');
    // 由于使用模拟数据，不需要异步初始化
    this.setData({ isLoading: false });
  },

  // 初始化仪表盘数据（简化版）
  initializeDashboard() {
    console.log('初始化仪表盘，使用模拟数据');
    // 由于使用模拟数据，这里只需更新状态
    this.setData({ 
      isLoading: false,
      error: null
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('Dashboard页面显示，使用模拟数据');
    // 由于使用模拟数据，不需要重新加载
  },

  // 加载儿童数据（简化版）
  loadChildrenData() {
    console.log('加载选中儿童数据');
    // 模拟数据已在data中定义，不需要从Supabase获取
  },

  /**
   * 设置当前日期
   */
  setCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekDay = weekDays[now.getDay()];
    
    this.setData({
      currentDate: `${year}年${month}月${day}日 星期${weekDay}`
    });
  },

  /**
   * 显示用户菜单
   */
  showUserMenu() {
    wx.showActionSheet({
      itemList: ['个人信息', '账号安全', '退出登录'],
      success: (res) => {
        if (res.tapIndex === 2) {
          this.handleLogout();
        }
      }
    });
  },

  // 获取通知数量（简化版）
  fetchNotifications() {
    // 通知数量已在模拟数据中设置
    console.log('获取通知数量');
  },

  // 格式化日期为相对时间（今天、昨天等）
  formatDate(dateString) {
    return dateString || new Date().toLocaleString('zh-CN');
  },

  // 格式化时长
  formatDuration(minutes) {
    if (!minutes) return '0分钟';
    if (minutes < 60) {
      return `${minutes}分钟`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  },

  // 下拉刷新
  onPullDownRefresh: function() {
    console.log('刷新数据');
    this.setData({ refreshing: true });
    // 模拟刷新延迟
    setTimeout(() => {
      console.log('数据刷新完成');
      wx.showToast({ title: '数据已更新', icon: 'success', duration: 1500 });
      wx.stopPullDownRefresh();
      this.setData({ refreshing: false });
    }, 500);
  },

  /**
   * 退出登录
   */
  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('children');
          wx.navigateTo({
            url: '/pages/login/login'
          });
        }
      }
    });
  },

  /**
   * 添加新孩子
   */
  addNewChild() {
    wx.navigateTo({
      url: '/pages/parent/ChildManagement?mode=add'
    });
  },

  /**
   * 加载所有孩子信息（使用模拟数据）
   */
  loadChildrenInfo() {
    console.log('加载所有孩子信息');
    // 模拟数据已在data中定义
  },

  /**
   * 切换显示儿童选择器
   */
  toggleChildSelector() {
    this.setData({
      showChildSelector: !this.data.showChildSelector
    });
  },

  /**
   * 切换到指定儿童
   */
  selectChild(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentChildIndex: index,
      showChildSelector: false
    });
    console.log('切换儿童:', this.data.children[index].name);
    // 由于使用模拟数据，不需要重新加载数据
  },

  navigateToCourseCenter: function() {
    wx.navigateTo({
      url: '../course/CourseCenter'
    });
  },

  navigateToStudyStats: function() {
    // 传递当前选择的儿童ID到统计页面
    const currentChild = this.data.children[this.data.currentChildIndex];
    wx.navigateTo({
      url: `../stats/StudyStats?childId=${currentChild.id}`
    });
  },

  navigateToSettings: function() {
    wx.navigateTo({
      url: '../settings/Settings'
    });
  },

  navigateToChildManagement: function() {
    wx.navigateTo({
      url: '../management/ChildManagement'
    });
  },

  /**
   * 切换到儿童模式
   */
  switchToChildMode() {
    // 切换到儿童模式
    // 获取全局应用实例
    const app = getApp();
    
    // 设置当前选择的儿童ID到全局数据
    const currentChild = this.data.children[this.data.currentChildIndex];
    app.globalData.currentChildId = currentChild.id;
    app.globalData.currentMode = 'child';
    
    // 跳转到儿童端首页
    wx.switchTab({
      url: '../../pages/child/Home'
    });
  }
})