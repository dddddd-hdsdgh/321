// pages/child/PinyinTheater.js
const app = getApp();
const { courses, studyRecords } = require('../../utils/supabase');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoId: '',
    videoInfo: {
      title: '加载中...',
      description: '',
      duration: 0,
      source: '',
      thumbnail_url: ''
    },
    videoContext: null,
    playing: false,
    currentTime: 0,
    totalTime: 0,
    progress: 0,
    soundEnabled: true,
    controlsVisible: true,
    controlsTimer: null,
    loading: true,
    musicEnabled: true,
    currentChildId: '',
    studyRecordId: null,
    startTime: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.id) {
      this.setData({ 
        videoId: options.id,
        currentChildId: app.globalData.currentUser?.id || '',
        startTime: new Date()
      });
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
    // 保存最终进度
    this.saveProgress();
  },

  /**
   * 加载视频信息
   */
  loadVideoInfo: async function() {
    try {
      // 从数据库获取视频详情
      const { data, error } = await courses.getCourseById(this.data.videoId);
      
      if (error) {
        console.error('获取视频信息失败:', error);
        wx.showToast({ title: '加载视频失败', icon: 'none' });
        this.setData({ loading: false });
        return;
      }
      
      const videoInfo = {
        title: data.title,
        description: data.description || '',
        duration: data.duration || 0,
        source: data.content_url,
        thumbnail_url: data.thumbnail_url
      };
      
      this.setData({ 
        videoInfo,
        totalTime: data.duration || 0,
        loading: false 
      });
      
      // 设置页面标题
      wx.setNavigationBarTitle({ title: videoInfo.title });
      
      // 检查是否有现有的学习记录
      this.checkExistingStudyRecord();
    } catch (err) {
      console.error('加载视频信息时发生错误:', err);
      wx.showToast({ title: '系统错误', icon: 'none' });
      this.setData({ loading: false });
    }
  },
  
  /**
   * 检查是否有现有的学习记录
   */
  checkExistingStudyRecord: async function() {
    try {
      // 从数据库获取最新的学习记录
      const { data: records, error } = await studyRecords.getChildStudyRecords(
        this.data.currentChildId,
        1,
        this.data.videoId
      );
      
      if (!error && records && records.length > 0) {
        const latestRecord = records[0];
        const savedProgress = latestRecord.progress || 0;
        
        this.setData({
          progress: savedProgress,
          studyRecordId: latestRecord.id
        });
        
        // 如果有进度，提示用户是否继续观看
        if (savedProgress > 0 && savedProgress < 100) {
          wx.showModal({
            title: '继续观看',
            content: '检测到您之前观看过该视频，是否从上次位置继续？',
            success: (res) => {
              if (res.confirm) {
                // 跳转到上次观看的位置
                const currentTime = (savedProgress / 100) * this.data.totalTime;
                this.setData({ currentTime });
                if (this.data.videoContext) {
                  this.data.videoContext.seek(currentTime);
                }
              }
            }
          });
        }
      }
    } catch (err) {
      console.error('检查学习记录失败:', err);
    }
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
    
    // 每10秒自动保存进度
    if (Math.floor(currentTime) % 10 === 0 && currentTime > 0) {
      this.saveProgress();
    }
  },
  
  /**
   * 保存学习进度
   */
  saveProgress: async function() {
    try {
      if (!this.data.currentChildId || !this.data.videoId) return;
      
      const endTime = new Date();
      const duration = Math.floor((endTime - this.data.startTime) / 1000); // 学习时长（秒）
      const isCompleted = this.data.progress >= 95; // 95%以上视为完成
      
      const recordData = {
        child_id: this.data.currentChildId,
        course_id: this.data.videoId,
        duration: duration,
        progress: this.data.progress,
        completed: isCompleted,
        end_time: endTime
      };
      
      if (this.data.studyRecordId) {
        // 更新现有记录
        await studyRecords.updateStudyRecord(this.data.studyRecordId, recordData);
      } else {
        // 创建新记录
        const { data, error } = await studyRecords.createStudyRecord({
          ...recordData,
          start_time: this.data.startTime
        });
        
        if (data && data.length > 0) {
          this.setData({ studyRecordId: data[0].id });
        }
      }
      
      console.log('保存进度:', this.data.progress);
    } catch (err) {
      console.error('保存学习进度失败:', err);
    }
  },

  /**
   * 视频播放结束
   */
  onEnded() {
    this.setData({ 
      playing: false,
      progress: 100
    });
    // 保存完成状态
    this.saveProgress();
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
   * 格式化时长（用于显示）
   */
  formatDuration: function(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
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