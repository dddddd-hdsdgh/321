// pages/child/HanziWorld.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    learningModes: [
      { id: 'recognition', name: '汉字认知' },
      { id: 'writing', name: '笔画练习' },
      { id: 'game', name: '互动游戏' }
    ],
    currentMode: 'recognition',
    hanzis: [
      { id: 1, character: '一', pinyin: 'yī', meaning: 'one', strokes: ['一'], color: '#FF6B6B' },
      { id: 2, character: '二', pinyin: 'èr', meaning: 'two', strokes: ['一', '一'], color: '#4ECDC4' },
      { id: 3, character: '三', pinyin: 'sān', meaning: 'three', strokes: ['一', '一', '一'], color: '#FFE66D' },
      { id: 4, character: '人', pinyin: 'rén', meaning: 'person', strokes: ['撇', '捺'], color: '#1A535C' },
      { id: 5, character: '口', pinyin: 'kǒu', meaning: 'mouth', strokes: ['竖', '横折', '横'], color: '#FF9F1C' },
      { id: 6, character: '日', pinyin: 'rì', meaning: 'sun', strokes: ['竖', '横折', '横', '横'], color: '#E76F51' },
      { id: 7, character: '月', pinyin: 'yuè', meaning: 'moon', strokes: ['撇', '横折钩', '横', '横'], color: '#8338EC' },
      { id: 8, character: '水', pinyin: 'shuǐ', meaning: 'water', strokes: ['竖钩', '横撇', '撇', '捺'], color: '#3A86FF' }
    ],
    currentHanzi: null,
    currentStrokeIndex: 0,
    isDrawing: false,
    score: 0,
    gameHanzi: null,
    gameOptions: [],
    selectedOption: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      currentHanzi: this.data.hanzis[0],
      soundEnabled: app.globalData.studySettings.sound
    });
    this.initGame();
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
   * 切换学习模式
   */
  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ currentMode: mode });
    if (mode === 'game') {
      this.initGame();
    }
  },

  /**
   * 选择汉字
   */
  selectHanzi(e) {
    const hanziId = e.currentTarget.dataset.id;
    const hanzi = this.data.hanzis.find(item => item.id === hanziId);
    this.setData({
      currentHanzi: hanzi,
      currentStrokeIndex: 0
    });
    this.playHanziSound();
  },

  /**
   * 播放汉字发音
   */
  playHanziSound() {
    if (this.data.soundEnabled) {
      console.log(`播放${this.data.currentHanzi.character}(${this.data.currentHanzi.pinyin})的发音`);
      wx.showToast({ 
        title: `${this.data.currentHanzi.character} ${this.data.currentHanzi.pinyin}`, 
        icon: 'none' 
      });
    }
  },

  /**
   * 下一笔
   */
  nextStroke() {
    if (this.data.currentStrokeIndex < this.data.currentHanzi.strokes.length - 1) {
      this.setData({
        currentStrokeIndex: this.data.currentStrokeIndex + 1
      });
    } else {
      wx.showToast({ title: '已完成所有笔画！', icon: 'success' });
    }
  },

  /**
   * 上一笔
   */
  prevStroke() {
    if (this.data.currentStrokeIndex > 0) {
      this.setData({
        currentStrokeIndex: this.data.currentStrokeIndex - 1
      });
    }
  },

  /**
   * 重新开始笔画
   */
  restartStrokes() {
    this.setData({ currentStrokeIndex: 0 });
  },

  /**
   * 初始化游戏
   */
  initGame() {
    // 随机选择一个汉字作为问题
    const randomIndex = Math.floor(Math.random() * this.data.hanzis.length);
    const gameHanzi = this.data.hanzis[randomIndex];
    
    // 生成选项（包含正确答案和3个干扰项）
    const allOptions = [...this.data.hanzis];
    // 移除正确答案，然后随机选3个
    const otherOptions = allOptions.filter(item => item.id !== gameHanzi.id);
    const shuffledOptions = this.shuffleArray(otherOptions);
    const threeOptions = shuffledOptions.slice(0, 3);
    
    // 合并选项并打乱顺序
    const options = [gameHanzi, ...threeOptions];
    const shuffledFinalOptions = this.shuffleArray(options);
    
    this.setData({
      gameHanzi,
      gameOptions: shuffledFinalOptions,
      selectedOption: ''
    });
  },

  /**
   * 打乱数组顺序
   */
  shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  },

  /**
   * 选择游戏选项
   */
  selectGameOption(e) {
    const optionId = e.currentTarget.dataset.id;
    this.setData({ selectedOption: optionId });
  },

  /**
   * 提交游戏答案
   */
  submitGameAnswer() {
    if (!this.data.selectedOption) {
      wx.showToast({ title: '请选择一个选项', icon: 'none' });
      return;
    }

    const isCorrect = this.data.selectedOption === this.data.gameHanzi.id.toString();
    const newScore = isCorrect ? this.data.score + 10 : this.data.score;
    
    this.setData({ score: newScore });
    
    wx.showModal({
      title: isCorrect ? '回答正确！' : '回答错误！',
      content: isCorrect ? '太棒了！' : `正确答案是：${this.data.gameHanzi.character}`,
      showCancel: false,
      success: () => {
        this.initGame();
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

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

  }
})