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
        studyStats: {
          totalStudyTime: '12.5小时',
          completedLessons: 28,
          currentStreak: 7
        }
      },
      {
        id: 'child2', 
        name: '小红',
        age: 6,
        grade: '一年级',
        studyStats: {
          totalStudyTime: '8.3小时',
          completedLessons: 15,
          currentStreak: 3
        }
      }
    ],
    currentChildIndex: 0,
    showChildSelector: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadChildrenInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.loadChildrenInfo();
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
   * 返回儿童端
   */
  switchToChildMode() {
    // 确保当前选中儿童信息已保存
    wx.setStorageSync('childInfo', this.getCurrentChild());
    wx.redirectTo({
      url: '/pages/child/Home'
    });
  },
  
  /**
   * 管理儿童信息
   */
  manageChildren() {
    // 这里可以跳转到儿童管理页面，或显示儿童管理弹窗
    wx.showToast({
      title: '儿童管理功能待实现',
      icon: 'none'
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