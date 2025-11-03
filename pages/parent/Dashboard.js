// pages/parent/Dashboard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    childInfo: {
      name: '小朋友',
      age: 8,
      grade: '二年级'
    },
    studyStats: {
      totalStudyTime: '12.5小时',
      completedLessons: 28,
      currentStreak: 7
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadChildInfo();
  },

  /**
   * 加载孩子信息
   */
  loadChildInfo() {
    // 从存储中获取孩子信息
    const childInfo = wx.getStorageSync('childInfo') || this.data.childInfo;
    this.setData({ childInfo });
  },

  /**
   * 返回儿童端
   */
  switchToChildMode() {
    wx.redirectTo({
      url: '/pages/child/Home'
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
   * 跳转到学习统计
   */
  goToStatistics() {
    wx.navigateTo({
      url: '/pages/parent/Statistics'
    });
  },

  /**
   * 跳转到家长设置
   */
  goToParentSettings() {
    wx.navigateTo({
      url: '/pages/parent/Settings'
    });
  }
})