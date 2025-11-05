// pages/parent/Courses.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    children: [
      {
        id: '1',
        name: '小明',
        avatar: '/assets/avatars/child1.png'
      },
      {
        id: '2',
        name: '小红',
        avatar: '/assets/avatars/child2.png'
      }
    ],
    currentChildId: '1',
    activeFilter: 'all',
    courses: [
      {
        id: '101',
        title: '拼音启蒙课程',
        grade: '一年级',
        lessons: 20,
        progress: 75,
        learnedMinutes: 120,
        cover: '/assets/courses/pinyin.png',
        badge: '学习中',
        status: 'learning',
        recommended: true
      },
      {
        id: '102',
        title: '古诗词鉴赏',
        grade: '二年级',
        lessons: 15,
        progress: 100,
        learnedMinutes: 90,
        cover: '/assets/courses/poetry.png',
        badge: '已完成',
        status: 'completed',
        recommended: false
      },
      {
        id: '103',
        title: '识字与写字基础',
        grade: '一年级',
        lessons: 25,
        progress: 30,
        learnedMinutes: 45,
        cover: '/assets/courses/characters.png',
        badge: '学习中',
        status: 'learning',
        recommended: true
      },
      {
        id: '104',
        title: '阅读理解提升',
        grade: '二年级',
        lessons: 18,
        progress: 0,
        learnedMinutes: 0,
        cover: '/assets/courses/reading.png',
        badge: '推荐',
        status: 'new',
        recommended: true
      }
    ],
    filteredCourses: [],
    showSearchBar: false,
    searchKeyword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.filterCourses();
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
    // 每次显示页面时刷新课程数据
    this.filterCourses();
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
   * 返回上一页
   */
  navigateBack: function() {
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 切换孩子
   */
  onChildChange: function(e) {
    const childId = e.currentTarget.dataset.id;
    this.setData({ currentChildId: childId });
    // 切换孩子后重新获取课程数据
    this.switchChildData(childId);
  },

  /**
   * 切换孩子数据
   */
  switchChildData: function(childId) {
    // 这里应该根据不同孩子ID获取对应课程数据
    // 模拟不同孩子的课程数据差异
    const childCourses = this.data.courses.map(course => {
      if (childId === '2') {
        return {
          ...course,
          progress: course.id === '101' ? 40 : course.id === '103' ? 60 : course.progress,
          learnedMinutes: course.id === '101' ? 80 : course.id === '103' ? 90 : course.learnedMinutes
        };
      }
      return course;
    });
    
    this.setData({ courses: childCourses }, () => {
      this.filterCourses();
    });
  },

  /**
   * 筛选课程
   */
  filterCourses: function() {
    const { courses, activeFilter, searchKeyword } = this.data;
    
    let filtered = [...courses];
    
    // 应用筛选条件
    if (activeFilter === 'learning') {
      filtered = filtered.filter(course => course.status === 'learning');
    } else if (activeFilter === 'completed') {
      filtered = filtered.filter(course => course.status === 'completed');
    } else if (activeFilter === 'recommended') {
      filtered = filtered.filter(course => course.recommended);
    }
    
    // 应用搜索
    if (searchKeyword) {
      filtered = filtered.filter(course => 
        course.title.includes(searchKeyword) || course.grade.includes(searchKeyword)
      );
    }
    
    this.setData({ filteredCourses: filtered });
  },

  /**
   * 切换筛选条件
   */
  onFilterChange: function(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({ activeFilter: filter }, () => {
      this.filterCourses();
    });
  },

  /**
   * 显示搜索栏
   */
  showSearch: function() {
    this.setData({ showSearchBar: true });
  },

  /**
   * 搜索课程
   */
  searchCourses: function(e) {
    this.setData({ searchKeyword: e.detail.value }, () => {
      this.filterCourses();
    });
  },

  /**
   * 清除搜索
   */
  clearSearch: function() {
    this.setData({ searchKeyword: '' }, () => {
      this.filterCourses();
    });
  },

  /**
   * 跳转到课程详情
   */
  goToCourseDetail: function(e) {
    const courseId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/parent/CourseDetail?id=${courseId}`
    });
  },

  /**
   * 探索课程
   */
  exploreCourses: function() {
    wx.navigateTo({
      url: '/pages/common/CourseCatalog'
    });
  },

  /**
   * 推荐课程
   */
  recommendCourses: function() {
    wx.showModal({
      title: '推荐课程',
      content: '系统将根据孩子的学习情况智能推荐适合的课程',
      confirmText: '立即推荐',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '推荐中...' });
          // 模拟推荐过程
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '推荐成功',
              icon: 'success'
            });
            // 更新推荐状态
            const updatedCourses = this.data.courses.map(course => ({
              ...course,
              recommended: true
            }));
            this.setData({ courses: updatedCourses }, () => {
              this.filterCourses();
            });
          }, 1500);
        }
      }
    });
  },

  /**
   * 下载课程
   */
  downloadCourses: function() {
    wx.showModal({
      title: '下载课程',
      content: '确定要下载当前筛选的课程吗？',
      confirmText: '确定',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '下载中...' });
          // 模拟下载过程
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '下载成功',
              icon: 'success'
            });
          }, 2000);
        }
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // 刷新课程数据
    setTimeout(() => {
      this.filterCourses();
      wx.stopPullDownRefresh();
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 加载更多课程
    wx.showToast({
      title: '已加载全部课程',
      icon: 'none'
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '萌豆语文动画屋 - 课程管理',
      path: '/pages/parent/Courses'
    };
  }
})