// pages/child/Home.js
Page({
  data: {
    todayRecommend: [
      {
        id: 1,
        title: '拼音小剧场：声母 b、p、m、f',
        type: 'video',
        duration: '15:30',
        progress: 30
      },
      {
        id: 2,
        title: '汉字故事：日、月、水、火',
        type: 'story',
        duration: '10:20',
        progress: 50
      },
      {
        id: 3,
        title: '拼音乐园：复韵母学习',
        type: 'game',
        duration: '20:45',
        progress: 15
      }
    ],
    features: [
      {
        id: 'pinyin-paradise',
        title: '拼音乐园',
        description: '通过游戏学习拼音，轻松掌握发音技巧'
      },
      {
        id: 'hanzi-world',
        title: '汉字天地',
        description: '趣味汉字学习，了解汉字起源和演变'
      },
      {
        id: 'video-library',
        title: '动画学习库',
        description: '精选语文动画，边看边学'
      },
      {
        id: 'word-park',
        title: '词语乐园',
        description: '丰富的词语积累，提升表达能力'
      },
      {
        id: 'sentence-garden',
        title: '句子花园',
        description: '学习实用句子，提升口语表达能力'
      }
    ],
    achievements: [
      {
        id: 1,
        title: '拼音小能手',
        description: '完成10次拼音练习',
        unlocked: true
      },
      {
        id: 2,
        title: '汉字探索者',
        description: '学习50个汉字',
        unlocked: true
      },
      {
        id: 3,
        title: '连续学习7天',
        description: '养成良好学习习惯',
        unlocked: false
      }
    ]
  },

  onLoad: function() {
    console.log('首页加载');
    // 获取用户信息
    this.setData({
      userInfo: wx.getStorageSync('userInfo') || null
    });
  },

  onShow: function() {
    // 页面显示时刷新数据
    console.log('首页显示');
  },

  // 跳转到推荐课程详情
  goToCourse: function(e) {
    const { id, type } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/child/${type === 'video' ? 'PinyinTheater' : type === 'story' ? 'HanziStory' : 'PinyinParadise'}`
    });
  },

  // 跳转到功能模块
  goToFeature: function(e) {
    const { id } = e.currentTarget.dataset;
    // 根据功能ID映射到正确的页面路径
    const pageMap = {
      'pinyin-paradise': 'PinyinParadise',
      'hanzi-world': 'HanziWorld',
      'video-library': 'VideoLibrary',
      'word-park': 'WordPark',
      'sentence-garden': 'SentenceGarden'
    };
    
    const pageName = pageMap[id] || id;
    wx.navigateTo({
      url: `/pages/child/${pageName}`
    });
  },

  // 查看所有推荐
  viewAllRecommend: function() {
    wx.navigateTo({
      url: '/pages/child/Courses'
    });
  },

  // 跳转到成就页面
  goToAchievements: function() {
    wx.navigateTo({
      url: '/pages/child/Achievements'
    });
  },

  // 分享页面
  onShareAppMessage: function() {
    return {
      title: '萌豆语文动画屋 - 让孩子爱上语文学习',
      path: '/pages/child/Home'
    };
  }
});