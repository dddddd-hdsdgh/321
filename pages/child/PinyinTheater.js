// pages/child/PinyinTheater.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoId: '',
    videoInfo: {
      title: '加载中...',
      description: '',
      duration: 0
    },
    videoContext: null,
    playing: false,
    currentTime: 0,
    totalTime: 0,
    progress: 0,
    soundEnabled: true,
    controlsVisible: true,
    controlsTimer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      this.setData({ videoId: options.id });
      this.loadVideoInfo();
    }
    
    // 设置背景为黑色
    wx.setBackgroundColor({ backgroundColor: '#000000' });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 获取视频上下文
    this.setData({
      videoContext: wx.createVideoContext('player')
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 更新设置状态
    this.setData({
      soundEnabled: app.globalData.studySettings.sound
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.pauseVideo();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.pauseVideo();
    if (this.data.controlsTimer) {
      clearTimeout(this.data.controlsTimer);
    }
  },

  /**
   * 加载视频信息
   */
  loadVideoInfo() {
    // 模拟加载视频信息
    setTimeout(() => {
      let videoInfo = {};
      
      // 根据视频ID获取不同的视频信息
      switch(this.data.videoId) {
        case 'p1':
          videoInfo = {
            title: '声母b的故事',
            description: '通过生动有趣的故事学习声母b的发音和用法',
            duration: 225 // 3:45 in seconds
          };
          break;
        case 'p2':
          videoInfo = {
            title: '韵母a的发音',
            description: '学习韵母a的标准发音和常见组合',
            duration: 150 // 2:30 in seconds
          };
          break;
        case 'p3':
          videoInfo = {
            title: '声调的变化',
            description: '了解四个声调的特点和正确读法',
            duration: 255 // 4:15 in seconds
          };
          break;
        default:
          videoInfo = {
            title: '拼音学习视频',
            description: '有趣的拼音学习内容',
            duration: 200
          };
      }
      
      this.setData({ 
        videoInfo,
        totalTime: videoInfo.duration 
      });
      
      // 设置页面标题
      wx.setNavigationBarTitle({ title: videoInfo.title });
    }, 500);
  },

  /**
   * 播放/暂停视频
   */
  togglePlay() {
    const { playing, videoContext } = this.data;
    
    if (playing) {
      this.pauseVideo();
    } else {
      videoContext.play();
      this.setData({ playing: true });
      this.hideControlsWithDelay();
    }
  },

  /**
   * 暂停视频
   */
  pauseVideo() {
    const { videoContext } = this.data;
    videoContext.pause();
    this.setData({ playing: false });
  },

  /**
   * 视频播放状态变化
   */
  onPlayStateChange(e) {
    const { currentTime } = e.detail;
    const progress = (currentTime / this.data.totalTime) * 100;
    
    this.setData({ 
      currentTime,
      progress 
    });
  },

  /**
   * 视频播放结束
   */
  onEnded() {
    this.setData({ 
      playing: false,
      currentTime: 0,
      progress: 0
    });
    // 播放结束后显示控制条
    this.showControls();
  },

  /**
   * 显示控制条
   */
  showControls() {
    this.setData({ controlsVisible: true });
    this.hideControlsWithDelay();
  },

  /**
   * 延迟隐藏控制条
   */
  hideControlsWithDelay() {
    if (this.data.controlsTimer) {
      clearTimeout(this.data.controlsTimer);
    }
    
    const timer = setTimeout(() => {
      if (this.data.playing) {
        this.setData({ controlsVisible: false });
      }
    }, 3000);
    
    this.setData({ controlsTimer: timer });
  },

  /**
   * 格式化时间
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: `正在观看：${this.data.videoInfo.title}`,
      path: `/pages/child/PinyinTheater?id=${this.data.videoId}`
    };
  }
})