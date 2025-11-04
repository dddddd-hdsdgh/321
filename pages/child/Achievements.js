// pages/child/Achievements.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 扩展的成就列表，包含更多成就和解锁时间
    achievements: [
      {
        id: 1,
        title: '拼音小能手',
        description: '完成10次拼音练习',
        unlocked: true,
        unlockDate: '2023-10-15'
      },
      {
        id: 2,
        title: '汉字探索者',
        description: '学习50个汉字',
        unlocked: true,
        unlockDate: '2023-10-20'
      },
      {
        id: 3,
        title: '连续学习7天',
        description: '养成良好学习习惯',
        unlocked: false
      },
      {
        id: 4,
        title: '词语大师',
        description: '掌握100个词语',
        unlocked: false
      },
      {
        id: 5,
        title: '句子魔法师',
        description: '学会使用10个句子',
        unlocked: true,
        unlockDate: '2023-10-25'
      },
      {
        id: 6,
        title: '故事通',
        description: '完成5个汉字故事学习',
        unlocked: false
      },
      {
        id: 7,
        title: '视频达人',
        description: '观看10个学习视频',
        unlocked: false
      },
      {
        id: 8,
        title: '游戏小赢家',
        description: '游戏中获得3次胜利',
        unlocked: true,
        unlockDate: '2023-10-18'
      }
    ],
    totalAchievements: 0,
    unlockedAchievements: 0,
    achievementProgress: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.calculateAchievementStats();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 每次显示页面时重新计算成就统计
    this.calculateAchievementStats();
  },

  /**
   * 计算成就统计数据
   */
  calculateAchievementStats() {
    const total = this.data.achievements.length;
    const unlocked = this.data.achievements.filter(achievement => achievement.unlocked).length;
    const progress = total > 0 ? Math.round((unlocked / total) * 100) : 0;

    this.setData({
      totalAchievements: total,
      unlockedAchievements: unlocked,
      achievementProgress: progress
    });
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});