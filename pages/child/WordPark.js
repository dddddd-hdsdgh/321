// pages/child/WordPark.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordCategories: [
      { id: 'animals', name: '动物' },
      { id: 'fruits', name: '水果' },
      { id: 'family', name: '家庭' },
      { id: 'food', name: '食物' }
    ],
    currentCategory: 'animals',
    words: [],
    selectedWord: null,
    showWordDetail: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadWordsByCategory('animals');
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
   * 根据分类加载词语
   */
  loadWordsByCategory(category) {
    // 模拟不同分类的词语数据
    const wordsData = {
      animals: [
        { id: 1, word: '小猫', pinyin: 'xiǎo māo', meaning: 'kitten', image: '/assets/animals/cat.png', example: '这只小猫很可爱。' },
        { id: 2, word: '小狗', pinyin: 'xiǎo gǒu', meaning: 'puppy', image: '/assets/animals/dog.png', example: '小狗在院子里玩耍。' },
        { id: 3, word: '小鸟', pinyin: 'xiǎo niǎo', meaning: 'bird', image: '/assets/animals/bird.png', example: '小鸟在树上唱歌。' },
        { id: 4, word: '小鱼', pinyin: 'xiǎo yú', meaning: 'fish', image: '/assets/animals/fish.png', example: '小鱼在水中游来游去。' },
        { id: 5, word: '兔子', pinyin: 'tù zi', meaning: 'rabbit', image: '/assets/animals/rabbit.png', example: '兔子爱吃胡萝卜。' },
        { id: 6, word: '熊猫', pinyin: 'xióng māo', meaning: 'panda', image: '/assets/animals/panda.png', example: '熊猫是中国的国宝。' }
      ],
      fruits: [
        { id: 7, word: '苹果', pinyin: 'píng guǒ', meaning: 'apple', image: '/assets/fruits/apple.png', example: '我爱吃苹果。' },
        { id: 8, word: '香蕉', pinyin: 'xiāng jiāo', meaning: 'banana', image: '/assets/fruits/banana.png', example: '香蕉很香甜。' },
        { id: 9, word: '橙子', pinyin: 'chéng zi', meaning: 'orange', image: '/assets/fruits/orange.png', example: '橙子富含维生素C。' },
        { id: 10, word: '西瓜', pinyin: 'xī guā', meaning: 'watermelon', image: '/assets/fruits/watermelon.png', example: '夏天吃西瓜很解渴。' },
        { id: 11, word: '葡萄', pinyin: 'pú táo', meaning: 'grape', image: '/assets/fruits/grape.png', example: '葡萄一串一串的。' },
        { id: 12, word: '草莓', pinyin: 'cǎo méi', meaning: 'strawberry', image: '/assets/fruits/strawberry.png', example: '草莓是红色的。' }
      ],
      family: [
        { id: 13, word: '爸爸', pinyin: 'bà ba', meaning: 'father', image: '/assets/family/father.png', example: '爸爸去上班了。' },
        { id: 14, word: '妈妈', pinyin: 'mā ma', meaning: 'mother', image: '/assets/family/mother.png', example: '妈妈做饭很好吃。' },
        { id: 15, word: '哥哥', pinyin: 'gē gē', meaning: 'older brother', image: '/assets/family/brother.png', example: '哥哥在看书。' },
        { id: 16, word: '姐姐', pinyin: 'jiě jie', meaning: 'older sister', image: '/assets/family/sister.png', example: '姐姐很喜欢我。' },
        { id: 17, word: '弟弟', pinyin: 'dì di', meaning: 'younger brother', image: '/assets/family/younger_brother.png', example: '弟弟在玩玩具。' },
        { id: 18, word: '妹妹', pinyin: 'mèi mei', meaning: 'younger sister', image: '/assets/family/younger_sister.png', example: '妹妹很可爱。' }
      ],
      food: [
        { id: 19, word: '米饭', pinyin: 'mǐ fàn', meaning: 'rice', image: '/assets/food/rice.png', example: '我爱吃米饭。' },
        { id: 20, word: '面条', pinyin: 'miàn tiáo', meaning: 'noodles', image: '/assets/food/noodles.png', example: '面条很好吃。' },
        { id: 21, word: '面包', pinyin: 'miàn bāo', meaning: 'bread', image: '/assets/food/bread.png', example: '早餐吃面包。' },
        { id: 22, word: '鸡蛋', pinyin: 'jī dàn', meaning: 'egg', image: '/assets/food/egg.png', example: '鸡蛋有营养。' },
        { id: 23, word: '牛奶', pinyin: 'niú nǎi', meaning: 'milk', image: '/assets/food/milk.png', example: '每天喝牛奶。' },
        { id: 24, word: '水果', pinyin: 'shuǐ guǒ', meaning: 'fruit', image: '/assets/food/fruits.png', example: '多吃水果对身体好。' }
      ]
    };

    this.setData({
      words: wordsData[category] || [],
      currentCategory: category
    });
  },

  /**
   * 切换词语分类
   */
  switchCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.loadWordsByCategory(category);
  },

  /**
   * 查看词语详情
   */
  viewWordDetail(e) {
    const wordId = e.currentTarget.dataset.id;
    const word = this.data.words.find(item => item.id === wordId);
    this.setData({
      selectedWord: word,
      showWordDetail: true
    });
    this.playWordSound();
  },

  /**
   * 关闭词语详情
   */
  closeWordDetail() {
    this.setData({ showWordDetail: false });
  },

  /**
   * 播放词语发音
   */
  playWordSound() {
    if (this.data.soundEnabled && this.data.selectedWord) {
      console.log(`播放${this.data.selectedWord.word}(${this.data.selectedWord.pinyin})的发音`);
      wx.showToast({ 
        title: `${this.data.selectedWord.word} ${this.data.selectedWord.pinyin}`, 
        icon: 'none' 
      });
    }
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