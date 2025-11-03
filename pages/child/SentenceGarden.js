// pages/child/SentenceGarden.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 学习模式：'browse'（浏览）或 'practice'（练习）
    learningMode: 'browse',
    // 句子分类
    sentenceCategories: [
      { id: 'daily', name: '日常对话' },
      { id: 'weather', name: '天气表达' },
      { id: 'food', name: '食物相关' },
      { id: 'family', name: '家庭用语' },
      { id: 'school', name: '学校用语' }
    ],
    // 当前选中的分类
    currentCategory: 'daily',
    // 句子列表
    sentences: [],
    // 选中的句子
    selectedSentence: null,
    // 是否显示句子详情
    showDetail: false,
    // 练习相关状态
    practice: {
      score: 0,
      currentQuestion: null,
      selectedOption: null,
      isCorrect: null,
      options: [],
      questionHistory: [],
      totalQuestions: 5,
      currentQuestionIndex: 0
    },
    // 设置状态
    soundEnabled: true,
    musicEnabled: true,
    // 加载状态
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadSentencesByCategory();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 更新设置状态
    try {
      if (app.globalData && app.globalData.studySettings) {
        this.setData({
          soundEnabled: app.globalData.studySettings.sound,
          musicEnabled: app.globalData.studySettings.music
        });
      }
    } catch (error) {
      console.log('无法获取全局设置，使用默认值');
    }
  },

  /**
   * 切换学习模式
   */
  switchLearningMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ learningMode: mode });
    
    if (mode === 'practice') {
      this.initPractice();
    }
  },

  /**
   * 切换句子分类
   */
  switchCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ currentCategory: category });
    this.loadSentencesByCategory();
  },

  /**
   * 根据分类加载句子
   * @param {boolean} pullRefresh - 是否是下拉刷新触发
   */
  loadSentencesByCategory(pullRefresh = false) {
    this.setData({ loading: true });
    
    // 模拟加载句子数据
    setTimeout(() => {
      let sentences = [];
      
      switch(this.data.currentCategory) {
        case 'daily':
          sentences = [
            { id: 'd1', text: '早上好！', pinyin: 'Zǎo shàng hǎo!', meaning: 'Good morning!', example: '小明对妈妈说：早上好！' },
            { id: 'd2', text: '你好！', pinyin: 'Nǐ hǎo!', meaning: 'Hello!', example: '遇到朋友时要说：你好！' },
            { id: 'd3', text: '再见！', pinyin: 'Zài jiàn!', meaning: 'Goodbye!', example: '放学时对老师说：再见！' },
            { id: 'd4', text: '谢谢！', pinyin: 'Xiè xiè!', meaning: 'Thank you!', example: '接过礼物时说：谢谢！' },
            { id: 'd5', text: '不客气！', pinyin: 'Bù kè qì!', meaning: 'You\'re welcome!', example: '别人感谢你时回答：不客气！' }
          ];
          break;
        case 'weather':
          sentences = [
            { id: 'w1', text: '今天天气真好！', pinyin: 'Jīn tiān tiān qì zhēn hǎo!', meaning: 'The weather is nice today!', example: '早上起床看到太阳说：今天天气真好！' },
            { id: 'w2', text: '下雨了。', pinyin: 'Xià yǔ le.', meaning: 'It\'s raining.', example: '看到窗外有雨滴：下雨了。' },
            { id: 'w3', text: '今天很热。', pinyin: 'Jīn tiān hěn rè.', meaning: 'It\'s very hot today.', example: '夏天出去玩：今天很热。' },
            { id: 'w4', text: '风很大。', pinyin: 'Fēng hěn dà.', meaning: 'The wind is strong.', example: '看到树叶被吹得沙沙响：风很大。' }
          ];
          break;
        case 'food':
          sentences = [
            { id: 'f1', text: '我喜欢吃苹果。', pinyin: 'Wǒ xǐ huān chī píng guǒ.', meaning: 'I like to eat apples.', example: '小明指着水果说：我喜欢吃苹果。' },
            { id: 'f2', text: '这个很好吃！', pinyin: 'Zhè ge hěn hǎo chī!', meaning: 'This is delicious!', example: '吃到美味的蛋糕说：这个很好吃！' },
            { id: 'f3', text: '我饿了。', pinyin: 'Wǒ è le.', meaning: 'I\'m hungry.', example: '中午的时候说：我饿了。' },
            { id: 'f4', text: '我想喝水。', pinyin: 'Wǒ xiǎng hē shuǐ.', meaning: 'I want to drink water.', example: '运动后说：我想喝水。' }
          ];
          break;
        case 'family':
          sentences = [
            { id: 'fa1', text: '这是我的爸爸。', pinyin: 'Zhè shì wǒ de bà ba.', meaning: 'This is my father.', example: '小明向同学介绍：这是我的爸爸。' },
            { id: 'fa2', text: '妈妈我爱你！', pinyin: 'Mā ma wǒ ài nǐ!', meaning: 'Mom, I love you!', example: '母亲节时对妈妈说：妈妈我爱你！' },
            { id: 'fa3', text: '我有一个弟弟。', pinyin: 'Wǒ yǒu yī gè dì di.', meaning: 'I have a brother.', example: '小明说：我有一个弟弟。' },
            { id: 'fa4', text: '我们是一家人。', pinyin: 'Wǒ men shì yī jiā rén.', meaning: 'We are a family.', example: '拍照时说：我们是一家人。' }
          ];
          break;
        case 'school':
          sentences = [
            { id: 's1', text: '我要去上学了。', pinyin: 'Wǒ yào qù shàng xué le.', meaning: 'I\'m going to school.', example: '早上背书包出门：我要去上学了。' },
            { id: 's2', text: '我喜欢我的老师。', pinyin: 'Wǒ xǐ huān wǒ de lǎo shī.', meaning: 'I like my teacher.', example: '小明对妈妈说：我喜欢我的老师。' },
            { id: 's3', text: '这个题目很有趣。', pinyin: 'Zhè ge tí mù hěn yǒu qù.', meaning: 'This problem is interesting.', example: '做算术题时说：这个题目很有趣。' },
            { id: 's4', text: '我们一起学习。', pinyin: 'Wǒ men yī qǐ xué xí.', meaning: 'Let\'s study together.', example: '和同学说：我们一起学习。' }
          ];
          break;
      }
      
      this.setData({ sentences, loading: false });
      
      // 如果是下拉刷新触发，加载完成后停止刷新动画
      if (pullRefresh) {
        wx.stopPullDownRefresh();
      }
    }, 500);
  },

  /**
   * 查看句子详情
   */
  viewSentenceDetail(e) {
    const sentenceId = e.currentTarget.dataset.id;
    const selectedSentence = this.data.sentences.find(sentence => sentence.id === sentenceId);
    
    if (selectedSentence) {
      this.setData({
        selectedSentence,
        showDetail: true
      });
      
      // 如果声音开启，可以播放句子发音
      if (this.data.soundEnabled) {
        this.playSentenceSound(selectedSentence.text);
      }
    }
  },

  /**
   * 关闭句子详情
   */
  closeSentenceDetail() {
    this.setData({ 
      showDetail: false,
      selectedSentence: null 
    });
  },

  /**
   * 处理播放发音按钮点击
   */
  handlePlaySound(e) {
    const text = e.currentTarget.dataset.text;
    // 虽然按钮已禁用，但仍在函数内检查声音状态作为额外保障
    if (this.data.soundEnabled) {
      this.playSentenceSound(text);
    }
  },

  /**
   * 播放句子发音
   */
  playSentenceSound(text) {
    // 模拟播放发音
    try {
      console.log(`播放句子发音: ${text}`);
      // 在实际应用中，可以使用微信的语音播放API
      // wx.playVoice({ filePath: `path/to/sounds/sentences/${text}.mp3` });
    } catch (error) {
      console.log('播放发音失败:', error);
    }
  },

  /**
   * 初始化练习
   */
  initPractice() {
    // 重置练习状态
    this.setData({
      practice: {
        score: 0,
        currentQuestion: null,
        selectedOption: null,
        isCorrect: null,
        options: [],
        questionHistory: [],
        totalQuestions: 5,
        currentQuestionIndex: 0
      }
    });
    
    this.loadNextQuestion();
  },

  /**
   * 加载下一题
   */
  loadNextQuestion() {
    const { sentences } = this.data;
    const { currentQuestionIndex, totalQuestions, questionHistory } = this.data.practice;
    
    // 检查是否所有句子都已经用过了
    if (questionHistory.length >= sentences.length) {
      wx.showToast({ title: '恭喜完成所有练习！', icon: 'success' });
      return;
    }
    
    // 生成不重复的随机题目
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * sentences.length);
    } while (questionHistory.includes(randomIndex));
    
    const question = sentences[randomIndex];
    const options = this.generateOptions(question, sentences);
    
    this.setData({
      'practice.currentQuestion': question,
      'practice.options': options,
      'practice.selectedOption': null,
      'practice.isCorrect': null,
      'practice.questionHistory': [...questionHistory, randomIndex],
      'practice.currentQuestionIndex': currentQuestionIndex + 1
    });
  },

  /**
   * 生成选择题选项
   */
  generateOptions(question, allSentences) {
    // 正确答案
    const correctOption = question.meaning;
    const options = [correctOption];
    
    // 生成错误选项
    const otherMeanings = allSentences
      .filter(s => s.id !== question.id)
      .map(s => s.meaning)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    // 合并并打乱选项
    options.push(...otherMeanings);
    return options.sort(() => Math.random() - 0.5);
  },

  /**
   * 选择答案
   */
  selectOption(e) {
    const option = e.currentTarget.dataset.option;
    this.setData({ 'practice.selectedOption': option });
  },

  /**
   * 提交答案
   */
  submitAnswer() {
    const { selectedOption, currentQuestion } = this.data.practice;
    
    if (!selectedOption) {
      wx.showToast({ title: '请选择一个答案', icon: 'none' });
      return;
    }
    
    const isCorrect = selectedOption === currentQuestion.meaning;
    const newScore = isCorrect ? this.data.practice.score + 1 : this.data.practice.score;
    
    this.setData({
      'practice.isCorrect': isCorrect,
      'practice.score': newScore
    });
    
    // 延迟显示下一题
    setTimeout(() => {
      if (this.data.practice.currentQuestionIndex >= this.data.practice.totalQuestions) {
        // 完成练习
        this.showPracticeResult();
      } else {
        // 下一题
        this.loadNextQuestion();
      }
    }, 2000);
  },

  /**
   * 显示练习结果
   */
  showPracticeResult() {
    const { score, totalQuestions } = this.data.practice;
    wx.showModal({
      title: '练习完成',
      content: `得分：${score}/${totalQuestions}\n正确率：${Math.round((score / totalQuestions) * 100)}%`,
      showCancel: false,
      success: () => {
        // 切换回浏览模式
        this.setData({ learningMode: 'browse' });
      }
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    if (this.data.learningMode === 'browse') {
      // 修改loadSentencesByCategory函数，在数据加载完成后调用wx.stopPullDownRefresh
      this.loadSentencesByCategory(true);
    } else {
      this.initPractice();
      // 练习模式初始化较快，可以直接停止下拉刷新
      setTimeout(() => wx.stopPullDownRefresh(), 500);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '萌豆语文 - 句子乐园',
      path: '/pages/child/SentenceGarden'
    };
  }
})