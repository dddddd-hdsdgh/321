// pages/parent/Dashboard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    children: [
      {
        id: 'child1',
        name: '小明',
        age: 8,
        grade: '二年级',
        status: 'online',
        studyStats: {
          totalStudyTime: '12.5小时',
          completedLessons: 28,
          currentStreak: 7,
          achievements: 12
        },
        recentStudies: [
          {
            title: '拼音声母学习 - b p m f',
            time: '今天 10:30',
            progress: 100,
            completed: true
          },
          {
            title: '汉字故事 - 日',
            time: '昨天 16:45',
            progress: 100,
            completed: true
          },
          {
            title: '词语乐园 - 天气相关',
            time: '昨天 15:20',
            progress: 60,
            completed: false
          }
        ]
      },
      {
        id: 'child2', 
        name: '小红',
        age: 6,
        grade: '一年级',
        status: 'offline',
        studyStats: {
          totalStudyTime: '8.3小时',
          completedLessons: 15,
          currentStreak: 3,
          achievements: 5
        },
        recentStudies: [
          {
            title: '拼音小剧场 - 字母歌',
            time: '今天 09:15',
            progress: 100,
            completed: true
          },
          {
            title: '汉字故事 - 月',
            time: '前天 14:30',
            progress: 100,
            completed: true
          },
          {
            title: '拼音乐园 - a o e',
            time: '前天 13:10',
            progress: 100,
            completed: true
          }
        ]
      }
    ],
    currentChildIndex: 0,
    showChildSelector: false,
    currentDate: '',
    showNotifications: false,
    showUserMenu: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadChildrenInfo();
    this.setCurrentDate();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.loadChildrenInfo();
    this.setCurrentDate();
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
   * 显示通知
   */
  showNotifications() {
    wx.showToast({
      title: '暂无新通知',
      icon: 'none'
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
   * 加载所有孩子信息
   */
  loadChildrenInfo() {
    // 从存储中获取孩子信息数组
    const children = wx.getStorageSync('children') || this.data.children;
    const currentChildIndex = wx.getStorageSync('currentChildIndex') || 0;
    
    this.setData({
      children,
      currentChildIndex
    });
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
    
    // 保存选择状态
    wx.setStorageSync('currentChildIndex', index);
    wx.setStorageSync('childInfo', this.data.children[index]);
  },

  /**
   * 获取当前选中的儿童信息
   */
  getCurrentChild() {
    return this.data.children[this.data.currentChildIndex];
  },

  /**
   * 切换到儿童模式
   */
  switchToChildMode() {
    // 确保当前选中儿童信息已保存
    wx.setStorageSync('childInfo', this.getCurrentChild());
    wx.showToast({
      title: '切换到儿童模式',
      icon: 'success',
      duration: 1000,
      success: () => {
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/child/Home'
          });
        }, 1000);
      }
    });
  },

  /**
   * 跳转到课程管理
   */
  goToCourses() {
    wx.navigateTo({
      url: '/pages/parent/Courses'
    });
  },

  /**
   * 跳转到统计页面
   */
  goToStatistics() {
    wx.navigateTo({
      url: '/pages/parent/Statistics'
    });
  },

  /**
   * 管理儿童
   */
  manageChildren() {
    wx.navigateTo({
      url: '/pages/parent/ChildManagement'
    });
  },

  /**
   * 跳转到家长设置
   */
  goToParentSettings() {
    wx.navigateTo({
      url: '/pages/parent/Settings'
    });
  },
  
  /**
   * 查看所有学习记录
   */
  viewAllStudies() {
    wx.navigateTo({
      url: '/pages/parent/StudyRecords'
    });
  },
  
  /**
   * 跳转到课程管理
   */
  goToCourses() {
    wx.navigateTo({
      url: '/pages/parent/Courses'
    });
  }
})