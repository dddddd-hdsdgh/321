// app.js
App({
  globalData: {
    userInfo: null,
    isLogin: false,
    currentUser: {
      type: 'child', // 'child' 或 'parent'
      id: '',
      name: '',
      avatar: ''
    },
    studySettings: {
      sound: true,
      music: true,
      difficulty: 'easy',
      notifications: true
    }
  },

  onLaunch: function() {
    // 小程序初始化逻辑
    console.log('小程序初始化');
    
    // 检查登录状态
    this.checkLoginStatus();
    
    // 加载用户设置
    this.loadUserSettings();
    
    // 初始化云开发环境（如果使用）
    // wx.cloud.init({
    //   env: 'your-env-id',
    //   traceUser: true
    // });
  },

  onShow: function(options) {
    // 小程序启动或从后台进入前台显示时触发
    console.log('小程序显示', options);
  },

  onHide: function() {
    // 小程序从前台进入后台时触发
    console.log('小程序隐藏');
  },

  onError: function(error) {
    // 小程序发生脚本错误或 API 调用失败时触发
    console.error('小程序错误:', error);
    // 可以在这里上报错误信息
  },

  onPageNotFound: function(options) {
    // 小程序要打开的页面不存在时触发
    console.log('页面不存在:', options);
    wx.navigateTo({
      url: '/pages/child/Home'
    });
  },

  checkLoginStatus: function() {
    // 检查登录状态的逻辑
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.isLogin = true;
      console.log('用户已登录');
    }
  },

  loadUserSettings: function() {
    // 加载用户设置
    const settings = wx.getStorageSync('studySettings');
    if (settings) {
      this.globalData.studySettings = { ...this.globalData.studySettings, ...settings };
    }
  },

  saveUserSettings: function(settings) {
    // 保存用户设置
    this.globalData.studySettings = { ...this.globalData.studySettings, ...settings };
    wx.setStorageSync('studySettings', this.globalData.studySettings);
  },

  login: function(userInfo) {
    // 用户登录逻辑
    this.globalData.userInfo = userInfo;
    this.globalData.isLogin = true;
    wx.setStorageSync('userInfo', userInfo);
  },

  logout: function() {
    // 用户登出逻辑
    this.globalData.userInfo = null;
    this.globalData.isLogin = false;
    wx.removeStorageSync('userInfo');
  }
});