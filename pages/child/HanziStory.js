// pages/child/HanziStory.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hanziStories: [
      {
        id: 'sun',
        character: '日',
        pinyin: 'rì',
        meaning: '太阳',
        story: '古代人观察太阳的形状，画了一个圆圈，中间加一点，就形成了"日"字。太阳每天从东方升起，西方落下，给大地带来光明和温暖。',
        evolution: ['甲骨文', '金文', '小篆', '楷书'],
        strokes: 4
      },
      {
        id: 'moon',
        character: '月',
        pinyin: 'yuè',
        meaning: '月亮',
        story: '"月"字的形状像一弯新月。古人观察到月亮有阴晴圆缺的变化，就用弯曲的线条来表示月亮。',
        evolution: ['甲骨文', '金文', '小篆', '楷书'],
        strokes: 4
      },
      {
        id: 'water',
        character: '水',
        pinyin: 'shuǐ',
        meaning: '水',
        story: '"水"字的形状像流动的水。中间的竖钩代表水流的方向，两边的点和提表示水的波纹。',
        evolution: ['甲骨文', '金文', '小篆', '楷书'],
        strokes: 4
      },
      {
        id: 'mountain',
        character: '山',
        pinyin: 'shān',
        meaning: '山',
        story: '"山"字的形状像三座山峰连绵起伏。古人用三个山峰来表示山的概念，体现了汉字象形的特点。',
        evolution: ['甲骨文', '金文', '小篆', '楷书'],
        strokes: 3
      },
      {
        id: 'fire',
        character: '火',
        pinyin: 'huǒ',
        meaning: '火',
        story: '"火"字的形状像燃烧的火焰。古人观察到火焰向上跳跃的样子，用三条向上的曲线来表示火的形象。',
        evolution: ['甲骨文', '金文', '小篆', '楷书'],
        strokes: 4
      },
      {
        id: 'wood',
        character: '木',
        pinyin: 'mù',
        meaning: '树木',
        story: '"木"字的形状像一棵完整的树。上面是树冠，中间是树干，下面是树根，形象地表现了树木的形态。',
        evolution: ['甲骨文', '金文', '小篆', '楷书'],
        strokes: 4
      },
      {
        id: 'person',
        character: '人',
        pinyin: 'rén',
        meaning: '人',
        story: '"人"字的形状像一个站立的人。一撇一捺代表人的身体和两条腿，体现了人类直立行走的特点。',
        evolution: ['甲骨文', '金文', '小篆', '楷书'],
        strokes: 2
      },
      {
        id: 'hand',
        character: '手',
        pinyin: 'shǒu',
        meaning: '手',
        story: '"手"字的形状像张开的手掌。上面的笔画代表人的五个手指，下面是手腕，形象地描绘了手的样子。',
        evolution: ['甲骨文', '金文', '小篆', '楷书'],
        strokes: 4
      }
    ],
    selectedHanzi: null,
    showDetail: false,
    soundEnabled: true,
    musicEnabled: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面加载时的初始化逻辑
    wx.showLoading({ title: '加载中', mask: true });
    
    // 模拟数据加载延迟
    setTimeout(() => {
      // 可以在这里添加数据过滤或处理逻辑
      wx.hideLoading();
    }, 500);
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
   * 查看汉字故事详情
   */
  viewHanziDetail(e) {
    const hanziId = e.currentTarget.dataset.id;
    const selectedHanzi = this.data.hanziStories.find(hanzi => hanzi.id === hanziId);
    
    if (selectedHanzi) {
      this.setData({
        selectedHanzi,
        showDetail: true
      });
      
      // 如果声音开启，可以播放汉字发音
      if (this.data.soundEnabled) {
        this.playPronunciation(selectedHanzi.character);
      }
    }
  },

  /**
   * 播放汉字发音
   */
  playPronunciation(text) {
    // 模拟播放发音
    try {
      console.log(`播放发音: ${text}`);
      // 在实际应用中，可以使用微信的语音播放API
      // wx.playVoice({ filePath: `path/to/sounds/${text}.mp3` });
    } catch (error) {
      console.log('播放发音失败:', error);
    }
  },

  /**
   * 关闭汉字故事详情
   */
  closeDetail() {
    this.setData({ 
      showDetail: false,
      selectedHanzi: null 
    });
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // 模拟重新加载数据的过程，提供更好的用户体验
    wx.showLoading({ title: '刷新中', mask: false });
    
    setTimeout(() => {
      // 实际应用中可以在这里重新获取数据
      // 这里简单地重新设置数据，模拟刷新操作
      this.setData({
        hanziStories: [...this.data.hanziStories]
      });
      
      wx.hideLoading();
      wx.stopPullDownRefresh();
    }, 1000);
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