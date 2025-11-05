// pages/parent/Settings.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notificationsEnabled: true,
    fingerprintEnabled: false,
    userInfo: {
      name: '家长用户',
      phone: '138****1234'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 可以从全局状态或缓存中获取设置数据
    this.loadUserSettings();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示页面时刷新设置状态
    this.loadUserSettings();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 加载用户设置数据
   */
  loadUserSettings() {
    // 这里可以从缓存或API获取实际设置
    try {
      const notifications = wx.getStorageSync('notificationsEnabled');
      const fingerprint = wx.getStorageSync('fingerprintEnabled');
      const userInfo = wx.getStorageSync('userInfo');
      
      if (notifications !== undefined) {
        this.setData({ notificationsEnabled: notifications });
      }
      if (fingerprint !== undefined) {
        this.setData({ fingerprintEnabled: fingerprint });
      }
      if (userInfo) {
        this.setData({ userInfo });
      }
    } catch (error) {
      console.error('加载设置失败:', error);
    }
  },

  /**
   * 返回上一页
   */
  navigateBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 切换通知开关
   */
  toggleNotification(e) {
    const isEnabled = e.detail.value;
    this.setData({ notificationsEnabled: isEnabled });
    
    // 保存设置到缓存
    try {
      wx.setStorageSync('notificationsEnabled', isEnabled);
      // 这里可以调用API同步设置到服务器
    } catch (error) {
      console.error('保存通知设置失败:', error);
    }
    
    wx.showToast({
      title: isEnabled ? '已开启学习提醒' : '已关闭学习提醒',
      icon: 'none'
    });
  },

  /**
   * 切换指纹登录开关
   */
  toggleFingerprint(e) {
    const isEnabled = e.detail.value;
    
    // 检查设备是否支持指纹
    if (isEnabled) {
      wx.checkIsSupportSoterAuthentication({
        success: res => {
          if (res.supportMode.includes('fingerPrint')) {
            this.setData({ fingerprintEnabled: isEnabled });
            // 保存设置到缓存
            try {
              wx.setStorageSync('fingerprintEnabled', isEnabled);
            } catch (error) {
              console.error('保存指纹设置失败:', error);
            }
            wx.showToast({
              title: '指纹登录已开启',
              icon: 'success'
            });
          } else {
            wx.showToast({
              title: '当前设备不支持指纹功能',
              icon: 'none'
            });
          }
        }
      });
    } else {
      this.setData({ fingerprintEnabled: isEnabled });
      try {
        wx.setStorageSync('fingerprintEnabled', isEnabled);
      } catch (error) {
        console.error('保存指纹设置失败:', error);
      }
      wx.showToast({
        title: '指纹登录已关闭',
        icon: 'none'
      });
    }
  },

  /**
   * 导航到儿童管理页面
   */
  goToChildManagement() {
    wx.navigateTo({
      url: '/pages/parent/ChildManagement'
    });
  },

  /**
   * 导航到学习时间管理页面
   */
  goToStudyTimeSetting() {
    wx.navigateTo({
      url: '/pages/parent/StudyTimeSetting'
    });
  },

  /**
   * 导航到内容过滤页面
   */
  goToContentFilter() {
    wx.navigateTo({
      url: '/pages/parent/ContentFilter'
    });
  },

  /**
   * 导航到学习难度设置页面
   */
  goToDifficultySetting() {
    wx.navigateTo({
      url: '/pages/parent/DifficultySetting'
    });
  },

  /**
   * 导航到学习计划页面
   */
  goToLearningPlan() {
    wx.navigateTo({
      url: '/pages/parent/LearningPlan'
    });
  },

  /**
   * 导航到个人信息页面
   */
  goToProfile() {
    wx.navigateTo({
      url: '/pages/parent/Profile'
    });
  },

  /**
   * 导航到修改密码页面
   */
  goToChangePassword() {
    wx.navigateTo({
      url: '/pages/parent/ChangePassword'
    });
  },

  /**
   * 导航到关于我们页面
   */
  goToAbout() {
    wx.navigateTo({
      url: '/pages/common/About'
    });
  },

  /**
   * 导航到帮助中心页面
   */
  goToHelp() {
    wx.navigateTo({
      url: '/pages/common/Help'
    });
  },

  /**
   * 导航到意见反馈页面
   */
  goToFeedback() {
    wx.navigateTo({
      url: '/pages/common/Feedback'
    });
  },

  /**
   * 退出登录
   */
  handleLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: res => {
        if (res.confirm) {
          // 清除用户登录状态
          try {
            wx.removeStorageSync('token');
            wx.removeStorageSync('userInfo');
            // 跳转到登录页面
            wx.redirectTo({
              url: '/pages/common/Login'
            });
          } catch (error) {
            console.error('退出登录失败:', error);
          }
        }
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // 刷新页面数据
    this.loadUserSettings();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '萌豆语文动画屋 - 家长管理',
      path: '/pages/parent/Dashboard'
    };
  }
})