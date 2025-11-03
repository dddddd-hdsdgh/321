// pages/child/VideoLibrary.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoCategories: [
      { id: 'pinyin', name: '拼音动画' },
      { id: 'hanzi', name: '汉字故事' },
      { id: 'word', name: '词语乐园' },
      { id: 'sentence', name: '句子天地' }
    ],
    currentCategory: 'pinyin',
    videos: [],
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadVideos();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 更新设置状态
    this.setData({
      soundEnabled: app.globalData.studySettings.sound,
      musicEnabled: app.globalData.studySettings.music
    });
  },

  /**
   * 切换视频分类
   */
  switchCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ currentCategory: category });
    this.loadVideos();
  },

  /**
   * 加载视频列表
   */
  loadVideos() {
    this.setData({ loading: true });
    
    // 模拟加载视频数据
    setTimeout(() => {
      let videos = [];
      
      switch(this.data.currentCategory) {
        case 'pinyin':
          videos = [
            { id: 'p1', title: '声母b的故事', duration: '03:45', progress: 60 },
            { id: 'p2', title: '韵母a的发音', duration: '02:30', progress: 0 },
            { id: 'p3', title: '声调的变化', duration: '04:15', progress: 100 }
          ];
          break;
        case 'hanzi':
          videos = [
            { id: 'h1', title: '日字的演变', duration: '05:20', progress: 30 },
            { id: 'h2', title: '月字的故事', duration: '04:45', progress: 0 },
            { id: 'h3', title: '水的象形文字', duration: '03:50', progress: 75 }
          ];
          break;
        case 'word':
          videos = [
            { id: 'w1', title: '动物词语学习', duration: '06:10', progress: 20 },
            { id: 'w2', title: '颜色词语启蒙', duration: '04:30', progress: 0 },
            { id: 'w3', title: '数字词语游戏', duration: '05:45', progress: 90 }
          ];
          break;
        case 'sentence':
          videos = [
            { id: 's1', title: '简单句子练习', duration: '07:20', progress: 45 },
            { id: 's2', title: '日常对话学习', duration: '06:40', progress: 0 },
            { id: 's3', title: '句子结构讲解', duration: '05:15', progress: 100 }
          ];
          break;
      }
      
      this.setData({ videos, loading: false });
    }, 500);
  },

  /**
   * 播放视频
   */
  playVideo(e) {
    const videoId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/child/PinyinTheater?id=${videoId}`
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.loadVideos();
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '萌豆语文动画库',
      path: '/pages/child/VideoLibrary'
    };
  }
})