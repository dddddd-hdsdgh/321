// pages/child/PinyinParadise.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pinyinTypes: [
      { id: 'shengmu', name: '声母练习' },
      { id: 'yunmu', name: '韵母练习' },
      { id: 'shengyun', name: '声韵组合' }
    ],
    currentType: 'shengmu',
    score: 0,
    currentQuestion: null,
    questions: [],
    questionIndex: 0,
    showAnswer: false,
    selectedOption: '',
    isCorrect: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initQuestions();
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
   * 初始化题目
   */
  initQuestions() {
    const shengmuQuestions = [
      { id: 1, pinyin: 'b', options: ['b', 'p', 'm', 'f'], answer: 'b', hint: '像6不像6，发音要轻短' },
      { id: 2, pinyin: 'p', options: ['b', 'p', 'm', 'f'], answer: 'p', hint: '像个小山坡，发音要送气' },
      { id: 3, pinyin: 'm', options: ['b', 'p', 'm', 'f'], answer: 'm', hint: '两个门洞，发音时双唇闭合' },
      { id: 4, pinyin: 'f', options: ['b', 'p', 'm', 'f'], answer: 'f', hint: '像根拐棍，上齿碰下唇' }
    ];

    const yunmuQuestions = [
      { id: 5, pinyin: 'a', options: ['a', 'o', 'e', 'i'], answer: 'a', hint: '张大嘴巴aaa' },
      { id: 6, pinyin: 'o', options: ['a', 'o', 'e', 'i'], answer: 'o', hint: '圆圆嘴巴ooo' },
      { id: 7, pinyin: 'e', options: ['a', 'o', 'e', 'i'], answer: 'e', hint: '扁扁嘴巴eee' },
      { id: 8, pinyin: 'i', options: ['a', 'o', 'e', 'i'], answer: 'i', hint: '牙齿对齐iii' }
    ];

    const shengyunQuestions = [
      { id: 9, pinyin: 'ba', options: ['ba', 'pa', 'ma', 'fa'], answer: 'ba', hint: 'b+a=ba' },
      { id: 10, pinyin: 'po', options: ['bo', 'po', 'mo', 'fo'], answer: 'po', hint: 'p+o=po' },
      { id: 11, pinyin: 'mi', options: ['bi', 'pi', 'mi', 'di'], answer: 'mi', hint: 'm+i=mi' },
      { id: 12, pinyin: 'fa', options: ['fa', 'da', 'ta', 'na'], answer: 'fa', hint: 'f+a=fa' }
    ];

    this.setData({
      questions: shengmuQuestions,
      currentQuestion: shengmuQuestions[0],
      questionIndex: 0,
      score: 0,
      showAnswer: false,
      selectedOption: '',
      isCorrect: null
    });
  },

  /**
   * 切换拼音类型
   */
  switchPinyinType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ currentType: type });
    this.initQuestions();
  },

  /**
   * 选择答案选项
   */
  selectOption(e) {
    const option = e.currentTarget.dataset.option;
    this.setData({ selectedOption: option });
  },

  /**
   * 提交答案
   */
  submitAnswer() {
    if (!this.data.selectedOption) {
      wx.showToast({ title: '请选择一个答案', icon: 'none' });
      return;
    }

    const isCorrect = this.data.selectedOption === this.data.currentQuestion.answer;
    const newScore = isCorrect ? this.data.score + 10 : this.data.score;

    this.setData({
      showAnswer: true,
      isCorrect,
      score: newScore
    });

    // 如果声音开启，播放相应的提示音（这里只是模拟）
    if (this.data.soundEnabled) {
      console.log(isCorrect ? '播放正确提示音' : '播放错误提示音');
    }
  },

  /**
   * 下一题
   */
  nextQuestion() {
    const nextIndex = this.data.questionIndex + 1;
    
    if (nextIndex < this.data.questions.length) {
      this.setData({
        currentQuestion: this.data.questions[nextIndex],
        questionIndex: nextIndex,
        showAnswer: false,
        selectedOption: '',
        isCorrect: null
      });
    } else {
      // 所有题目完成
      wx.showModal({
        title: '练习完成！',
        content: `恭喜你完成了所有练习！\n得分：${this.data.score}分`,
        showCancel: false,
        success: () => {
          this.initQuestions();
        }
      });
    }
  },

  /**
   * 重新开始练习
   */
  restartPractice() {
    this.initQuestions();
  },

  /**
   * 播放拼音发音
   */
  playPinyin() {
    if (this.data.soundEnabled) {
      console.log(`播放${this.data.currentQuestion.pinyin}的发音`);
      wx.showToast({ title: `播放${this.data.currentQuestion.pinyin}`, icon: 'none' });
    }
  },

  /**
   * 显示提示
   */
  showHint() {
    wx.showToast({
      title: this.data.currentQuestion.hint,
      icon: 'none',
      duration: 2000
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