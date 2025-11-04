// pages/child/Settings.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    studySettings: {
      sound: true,
      music: true,
      difficulty: 'easy', // 'easy', 'medium', 'hard'
      notifications: true
    },
    difficulties: [
      { value: 'easy', name: '简单' },
      { value: 'medium', name: '中等' },
      { value: 'hard', name: '困难' }
    ],
    userInfo: null,
    children: [],
    currentChildIndex: 0,
    showChildSelector: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadSettings();
    this.loadChildrenInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.loadSettings();
    this.loadChildrenInfo();
  },

  /**
   * 加载设置
   */
  loadSettings() {
    const settings = app.globalData.studySettings;
    this.setData({
      studySettings: settings
    });
  },

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    this.setData({ userInfo });
  },

  /**
   * 加载儿童信息列表
   */
  loadChildrenInfo() {
    // 从缓存或全局数据获取儿童列表
    let children = wx.getStorageSync('children') || [];
    
    // 如果没有儿童数据，使用默认数据
    if (children.length === 0) {
      children = [
        {
          id: '1',
          name: '小明',
          avatar: '👦',
          grade: '一年级'
        },
        {
          id: '2',
          name: '小红',
          avatar: '👧',
          grade: '一年级'
        }
      ];
      // 保存到缓存
      wx.setStorageSync('children', children);
    }
    
    // 获取当前选中的儿童索引
    const currentChildIndex = wx.getStorageSync('currentChildIndex') || 0;
    
    this.setData({
      children,
      currentChildIndex
    });
    
    // 设置当前用户信息
    if (children.length > 0 && children[currentChildIndex]) {
      this.setData({
        userInfo: children[currentChildIndex]
      });
    }
  },

  /**
   * 切换儿童选择器显示
   */
  toggleChildSelector() {
    this.setData({
      showChildSelector: !this.data.showChildSelector
    });
  },

  /**
   * 选择儿童
   */
  selectChild(e) {
    const index = e.currentTarget.dataset.index;
    const child = this.data.children[index];
    
    this.setData({
      currentChildIndex: index,
      userInfo: child,
      showChildSelector: false
    });
    
    // 保存当前选择到缓存
    wx.setStorageSync('currentChildIndex', index);
    
    // 显示切换成功提示
    wx.showToast({
      title: `已切换到${child.name}`,
      icon: 'success'
    });
  },

  /**
   * 切换声音设置
   */
  toggleSound(e) {
    const sound = e.detail.value;
    const newSettings = { ...this.data.studySettings, sound };
    this.updateSettings(newSettings);
  },

  /**
   * 切换音乐设置
   */
  toggleMusic(e) {
    const music = e.detail.value;
    const newSettings = { ...this.data.studySettings, music };
    this.updateSettings(newSettings);
  },

  /**
   * 切换通知设置
   */
  toggleNotifications(e) {
    const notifications = e.detail.value;
    const newSettings = { ...this.data.studySettings, notifications };
    this.updateSettings(newSettings);
  },

  /**
   * 切换难度设置
   */
  changeDifficulty(e) {
    const difficulty = e.currentTarget.dataset.difficulty;
    const newSettings = { ...this.data.studySettings, difficulty };
    this.updateSettings(newSettings);
  },

  /**
   * 更新设置
   */
  updateSettings(newSettings) {
    this.setData({ studySettings: newSettings });
    app.saveUserSettings(newSettings);
  },

  /**
   * 清除缓存
   */
  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存数据吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.showToast({
            title: '缓存已清除',
            icon: 'success'
          });
          // 重新加载设置和用户信息
          this.loadSettings();
          this.loadUserInfo();
        }
      }
    });
  },

  /**
   * 关于我们
   */
  aboutUs() {
    wx.showModal({
      title: '关于萌豆语文动画屋',
      content: '版本 1.0.0\n这是一款专为儿童设计的语文学习小程序，通过动画和互动游戏帮助孩子快乐学习拼音、汉字和句子。\n© 2024 萌豆教育',
      showCancel: false
    });
  },

  /**
   * 切换到家长端
   */
  switchToParentMode() {
    wx.showModal({
      title: '切换到家长端',
      content: '确定要切换到家长管理界面吗？',
      success: (res) => {
        if (res.confirm) {
          wx.redirectTo({
            url: '/pages/parent/Dashboard'
          });
        }
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '萌豆语文动画屋设置',
      path: '/pages/child/Settings'
    };
  }
})