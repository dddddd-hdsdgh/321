// pages/parent/Statistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    children: [],
    childrenNames: [],
    currentChildIndex: 0,
    currentStats: {},
    weekData: [],
    timeDistribution: {},
    achievements: [],
    suggestions: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadChildrenData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.loadChildrenData();
  },

  /**
   * 加载儿童数据
   */
  loadChildrenData() {
    // 模拟数据，实际应从存储或服务器获取
    const children = [
      {
        id: 'child1',
        name: '小明',
        stats: {
          totalStudyTime: '12.5小时',
          completedLessons: 28,
          averageScore: 92
        },
        weekData: [
          { day: '周一', time: 1.5, courses: 3, timePercent: 60, coursesPercent: 75 },
          { day: '周二', time: 1.2, courses: 2, timePercent: 48, coursesPercent: 50 },
          { day: '周三', time: 2.0, courses: 4, timePercent: 80, coursesPercent: 100 },
          { day: '周四', time: 0.8, courses: 1, timePercent: 32, coursesPercent: 25 },
          { day: '周五', time: 1.8, courses: 3, timePercent: 72, coursesPercent: 75 },
          { day: '周六', time: 2.5, courses: 5, timePercent: 100, coursesPercent: 100 },
          { day: '周日', time: 1.7, courses: 3, timePercent: 68, coursesPercent: 75 }
        ],
        timeDistribution: {
          pinyin: 40,
          hanzi: 30,
          words: 20,
          reading: 10
        },
        achievements: [
          {
            id: 'ach1',
            name: '拼音小能手',
            description: '完成20节拼音课程',
            achieved: true,
            icon: '/assets/icons/pinyin_master.png'
          },
          {
            id: 'ach2',
            name: '汉字达人',
            description: '掌握100个常用汉字',
            achieved: true,
            icon: '/assets/icons/hanzi_master.png'
          },
          {
            id: 'ach3',
            name: '连续学习',
            description: '连续7天学习打卡',
            achieved: true,
            icon: '/assets/icons/continuous.png'
          },
          {
            id: 'ach4',
            name: '阅读之星',
            description: '完成10篇阅读练习',
            achieved: false,
            icon: '/assets/icons/reading_star.png'
          }
        ],
        suggestions: [
          '多进行阅读练习，提升理解能力',
          '可以适当增加词语练习的比例',
          '保持每周至少5天的学习频率'
        ]
      },
      {
        id: 'child2',
        name: '小红',
        stats: {
          totalStudyTime: '8.3小时',
          completedLessons: 15,
          averageScore: 85
        },
        weekData: [
          { day: '周一', time: 0.5, courses: 1, timePercent: 25, coursesPercent: 25 },
          { day: '周二', time: 1.0, courses: 2, timePercent: 50, coursesPercent: 50 },
          { day: '周三', time: 0.8, courses: 1, timePercent: 40, coursesPercent: 25 },
          { day: '周四', time: 1.2, courses: 3, timePercent: 60, coursesPercent: 75 },
          { day: '周五', time: 0.6, courses: 1, timePercent: 30, coursesPercent: 25 },
          { day: '周六', time: 2.0, courses: 4, timePercent: 100, coursesPercent: 100 },
          { day: '周日', time: 1.2, courses: 2, timePercent: 60, coursesPercent: 50 }
        ],
        timeDistribution: {
          pinyin: 30,
          hanzi: 25,
          words: 15,
          reading: 30
        },
        achievements: [
          {
            id: 'ach1',
            name: '拼音入门',
            description: '完成10节拼音课程',
            achieved: true,
            icon: '/assets/icons/pinyin_beginner.png'
          },
          {
            id: 'ach2',
            name: '汉字初识',
            description: '掌握50个常用汉字',
            achieved: true,
            icon: '/assets/icons/hanzi_beginner.png'
          },
          {
            id: 'ach3',
            name: '学习新人',
            description: '累计学习5小时',
            achieved: true,
            icon: '/assets/icons/new_learner.png'
          },
          {
            id: 'ach4',
            name: '拼音小能手',
            description: '完成20节拼音课程',
            achieved: false,
            icon: '/assets/icons/pinyin_master.png'
          }
        ],
        suggestions: [
          '拼音基础需要加强练习',
          '可以增加词语学习的时间',
          '建议每天固定时间段学习'
        ]
      }
    ];

    // 提取孩子姓名用于选择器
    const childrenNames = children.map(child => ({ name: child.name }));

    this.setData({
      children,
      childrenNames,
      currentStats: children[0].stats,
      weekData: children[0].weekData,
      timeDistribution: children[0].timeDistribution,
      achievements: children[0].achievements,
      suggestions: children[0].suggestions
    });
  },

  /**
   * 切换孩子
   */
  onChildChange(e) {
    const index = e.detail.value;
    const child = this.data.children[index];
    
    this.setData({
      currentChildIndex: index,
      currentStats: child.stats,
      weekData: child.weekData,
      timeDistribution: child.timeDistribution,
      achievements: child.achievements,
      suggestions: child.suggestions
    });
  },

  /**
   * 返回上一页
   */
  navigateBack() {
    wx.navigateBack();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.loadChildrenData();
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '学习统计报告',
      path: '/pages/parent/Statistics'
    };
  }
})