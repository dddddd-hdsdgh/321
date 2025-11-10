// app.js
// 导入Supabase配置 - 微信小程序兼容版
try {
  const supabaseModule = require('./utils/supabase.js');
  const { supabase, auth: supabaseAuth } = supabaseModule.default ? 
    { supabase: supabaseModule.default, ...supabaseModule } : 
    supabaseModule;
  global.supabase = supabase;
  global.supabaseAuth = supabaseAuth;
} catch (error) {
  console.error('Supabase模块加载失败:', error);
  // 创建一个基础的模拟对象，避免后续代码崩溃
  global.supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { unsubscribe: () => {} } })
    }
  };
  global.supabaseAuth = global.supabase.auth;
}

App({
  globalData: {
    userInfo: null,
    isLogin: false,
    currentUser: {
      type: 'child', // 'child' 或 'parent'
      id: '',
      name: '',
      avatar: ''
    },
    studySettings: {
      sound: true,
      music: true,
      difficulty: 'easy',
      notifications: true
    },
    // 添加Supabase实例到全局数据 - 确保使用全局对象
    supabase: global.supabase
  },

  onLaunch: function() {
    // 小程序初始化逻辑
    console.log('小程序初始化');
    
    // 检查登录状态
    this.checkLoginStatus();
    
    // 加载用户设置
    this.loadUserSettings();
    
    // 监听Supabase认证状态变化
    this.setupAuthListener();
  },
  
  // 设置Supabase认证监听器
  setupAuthListener: function() {
    try {
      if (global.supabase && global.supabase.auth && global.supabase.auth.onAuthStateChange) {
        global.supabase.auth.onAuthStateChange((event, session) => {
          console.log('Supabase认证状态变化:', event, session);
          if (event === 'SIGNED_IN' && session?.user) {
            this.globalData.userInfo = session.user;
            this.globalData.isLogin = true;
            wx.setStorageSync('userInfo', session.user);
            wx.setStorageSync('supabase_session', session);
          } else if (event === 'SIGNED_OUT') {
            this.logout();
          }
        });
      }
    } catch (error) {
      console.error('设置认证监听器失败:', error);
    }
  },

  onShow: function(options) {
    // 小程序启动或从后台进入前台显示时触发
    console.log('小程序显示', options);
  },

  onHide: function() {
    // 小程序从前台进入后台时触发
    console.log('小程序隐藏');
  },

  onError: function(error) {
    // 小程序发生脚本错误或 API 调用失败时触发
    console.error('小程序错误:', error);
    // 可以在这里上报错误信息
  },

  onPageNotFound: function(options) {
    // 小程序要打开的页面不存在时触发
    console.log('页面不存在:', options);
    wx.navigateTo({
      url: '/pages/child/Home'
    });
  },

  checkLoginStatus: async function() {
    try {
      // 微信小程序环境优先使用本地存储
      const userInfo = wx.getStorageSync('userInfo');
      const supabaseSession = wx.getStorageSync('supabase_session');
      
      if (userInfo) {
        this.globalData.userInfo = userInfo;
        this.globalData.isLogin = true;
        // 加载用户设置
        this.loadUserSettings();
        console.log('用户已登录（本地存储）');
        
        // 尝试恢复Supabase会话 (确保方法存在)
      if (global.supabase && global.supabase.auth) {
        // 检查setSession方法是否存在
        if (global.supabase.auth.setSession && supabaseSession) {
          try {
            await global.supabase.auth.setSession(supabaseSession);
          } catch (sessionError) {
            console.warn('恢复会话失败，使用本地数据:', sessionError);
          }
        }
      }
      } else {
        this.globalData.isLogin = false;
        this.globalData.userInfo = null;
        console.log('用户未登录');
      }
    } catch (error) {
      console.error('检查登录状态失败:', error);
      this.globalData.isLogin = false;
      this.globalData.userInfo = null;
    }
  },

  loadUserSettings: function() {
    try {
      // 仅从本地存储加载设置（微信小程序环境）
      const localSettings = wx.getStorageSync('studySettings');
      if (localSettings) {
        this.globalData.studySettings = { ...this.globalData.studySettings, ...localSettings };
        console.log('已从本地存储加载用户设置');
      }
    } catch (error) {
      console.error('加载用户设置失败:', error);
    }
  },

  saveUserSettings: function(settings) {
    try {
      // 更新全局设置
      this.globalData.studySettings = { ...this.globalData.studySettings, ...settings };
      // 仅保存到本地存储（微信小程序环境）
      wx.setStorageSync('studySettings', this.globalData.studySettings);
      console.log('用户设置已保存到本地存储');
    } catch (err) {
      console.error('保存用户设置失败:', err);
    }
  },

  login: async function(code) {
    try {
      console.log('微信登录code:', code);
      
      // 在微信小程序环境中使用简化的登录逻辑
      // 模拟登录成功，创建临时用户信息
      const mockUserInfo = {
        id: 'mock-user-' + Date.now(),
        user_metadata: {
          openid: 'mock-openid-' + Date.now(),
          nickname: '微信用户',
          avatar_url: ''
        }
      };
      
      // 保存登录状态
      this.globalData.userInfo = mockUserInfo;
      this.globalData.isLogin = true;
      this.globalData.currentUser = {
        type: 'parent',
        id: mockUserInfo.id,
        name: mockUserInfo.user_metadata.nickname || '家长',
        avatar: mockUserInfo.user_metadata.avatar_url
      };
      
      // 保存用户信息到本地存储
      wx.setStorageSync('userInfo', mockUserInfo);
      
      // 加载用户设置
      this.loadUserSettings();
      
      console.log('模拟登录成功:', mockUserInfo);
      return { success: true };
    } catch (err) {
      console.error('登录失败:', err);
      return { success: false, error: err.message || '登录失败' };
    }
  },

  logout: function() {
    try {
      // 尝试登出Supabase（如果可用）
      if (global.supabase && global.supabase.auth && global.supabase.auth.signOut) {
        try {
          global.supabase.auth.signOut();
        } catch (supabaseError) {
          console.warn('Supabase登出失败，继续清理本地数据:', supabaseError);
        }
      }
      
      // 清除本地数据
      this.globalData.userInfo = null;
      this.globalData.isLogin = false;
      this.globalData.currentUser = {
        type: 'child',
        id: '',
        name: '',
        avatar: ''
      };
      
      // 清除本地存储
      try {
        wx.removeStorageSync('userInfo');
        wx.removeStorageSync('supabase_session');
        wx.removeStorageSync('studySettings');
      } catch (e) {
        console.error('清除本地存储失败:', e);
      }
      
      console.log('用户已登出');
      return { success: true };
    } catch (err) {
      console.error('登出失败:', err);
      return { success: false, error: err.message || '登出失败' };
    }
  },
  
  // 切换到儿童模式
  switchToChildMode: function(childInfo) {
    if (childInfo) {
      this.globalData.currentUser = {
        type: 'child',
        id: childInfo.id,
        name: childInfo.name,
        avatar: childInfo.avatar
      };
      // 加载儿童设置
      this.loadUserSettings();
      return true;
    }
    return false;
  },
  
  // 切换到家长模式
  switchToParentMode: function() {
    if (this.globalData.userInfo) {
      this.globalData.currentUser = {
        type: 'parent',
        id: this.globalData.userInfo.id,
        name: this.globalData.userInfo.user_metadata.nickname || '家长',
        avatar: this.globalData.userInfo.user_metadata.avatar_url
      };
      return true;
    }
    return false;
  }
});