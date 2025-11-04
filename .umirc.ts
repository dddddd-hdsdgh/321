import { defineConfig } from 'umi';

export default defineConfig({
  npmClient: 'npm',
  plugins: [],
  history: { type: 'browser' },
  outputPath: 'dist',
  hash: true,
  // 全局样式引入
  styles: [
    '@/global.css',
  ],
  // 标题配置
  title: '萌豆语文动画屋',
  // 构建优化
  exportStatic: {},
  routes: [
    // 认证相关路由（无需登录即可访问）
    {
      path: '/login',
      component: '@/pages/Login',
      title: '登录 - 萌豆语文动画屋',
    },
    {
      path: '/parent/register',
      component: '@/pages/parent/Register',
      title: '家长注册 - 萌豆语文动画屋',
    },
    {
      path: '/admin/register',
      component: '@/pages/admin/Register',
      title: '管理员注册 - 萌豆语文动画屋',
    },
    // 根路径重定向
    {
      path: '/',
      redirect: '/child',
    },
    // 儿童端路由
    {
      path: '/child',
      component: '@/layouts/ChildLayout',
      title: '萌豆语文动画屋',
      routes: [
        {
          path: '/child',
          component: '@/pages/child/Home',
          title: '儿童学习主页',
        },
        {
          path: '/child/pinyin-theater',
          component: '@/pages/child/PinyinTheater',
          title: '拼音小剧场 - 萌豆语文动画屋',
        },
        {
          path: '/child/hanzi-story',
          component: '@/pages/child/HanziStory',
          title: '汉字故事 - 萌豆语文动画屋',
        },
        {
          path: '/child/pinyin-paradise',
          component: '@/pages/child/PinyinParadise',
          title: '拼音乐园 - 萌豆语文动画屋',
        },
        {
          path: '/child/hanzi-world',
          component: '@/pages/child/HanziWorld',
          title: '汉字天地 - 萌豆语文动画屋',
        },
        {
          path: '/child/word-park',
          component: '@/pages/child/WordPark',
          title: '词语乐园 - 萌豆语文动画屋',
        },
        {
          path: '/child/sentence-garden',
          component: '@/pages/child/SentenceGarden',
          title: '短句园地 - 萌豆语文动画屋',
        },
        {
          path: '/child/achievements',
          component: '@/pages/child/Achievements',
          title: '我的成就 - 萌豆语文动画屋',
        },
        {
          path: '/child/settings',
          component: '@/pages/child/Settings',
          title: '设置 - 萌豆语文动画屋',
        },
      ],
    },
    // 家长端路由
    {
      path: '/parent',
      component: '@/layouts/ParentLayout',
      title: '家长中心 - 萌豆语文动画屋',
      routes: [
        {
          path: '/parent',
          component: '@/pages/parent/Dashboard',
          title: '家长仪表盘 - 萌豆语文动画屋',
        },
        {
          path: '/parent/settings',
          component: '@/pages/parent/Settings',
          title: '家长设置 - 萌豆语文动画屋',
        },
        {
          path: '/parent/family-guide',
          component: '@/pages/parent/FamilyGuide',
          title: '亲子指南 - 萌豆语文动画屋',
        },
      ],
    },
    // 后台路由
    {
      path: '/admin',
      component: '@/layouts/AdminLayout',
      title: '管理后台 - 萌豆语文动画屋',
      routes: [
        {
          path: '/admin',
          component: '@/pages/admin/Dashboard',
          title: '数据概览 - 萌豆管理后台',
        },
        {
          path: '/admin/user-management',
          component: '@/pages/admin/UserManagement',
          title: '用户管理 - 萌豆管理后台',
        },
        {
          path: '/admin/content-management',
          name: '内容管理',
          component: '@/pages/admin/ContentManagement',
          title: '内容管理 - 萌豆管理后台',
        },
      ],
    },
    // 404页面
    { path: '/404', component: '@/pages/404', title: '页面不存在 - 萌豆语文动画屋' },
  ],
  fastRefresh: true,
});
