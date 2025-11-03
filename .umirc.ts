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
    // 儿童端路由
    { path: '/child',
          component: '@/layouts/ChildLayout',
          routes: [
            {
              path: '/child',
              component: '@/pages/child/Home',
              title: '儿童学习主页',
            },
            {
              path: '/child/pinyin-theater',
              component: '@/pages/child/PinyinTheater',
              title: '拼音小剧场',
            },
            {
              path: '/child/hanzi-story',
              component: '@/pages/child/HanziStory',
              title: '汉字故事',
            },
            {
              path: '/child/pinyin-paradise',
              component: '@/pages/child/PinyinParadise',
              title: '拼音乐园',
            },
            {
              path: '/child/hanzi-world',
              component: '@/pages/child/HanziWorld',
              title: '汉字天地',
            },
            {
              path: '/child/word-park',
              component: '@/pages/child/WordPark',
              title: '词语乐园',
            },
            {
              path: '/child/sentence-garden',
              component: '@/pages/child/SentenceGarden',
              title: '短句园地',
            },
            {
              path: '/child/achievements',
              component: '@/pages/child/Achievements',
              title: '我的成就',
            },
            {
              path: '/child/settings',
              component: '@/pages/child/Settings',
              title: '设置',
            },
          ],
        },
    // 家长端路由
    {
      path: '/parent',
      component: '@/layouts/ParentLayout',
      routes: [
        {
          path: '/parent',
          component: '@/pages/parent/Dashboard',
        },
        {
          path: '/parent/settings',
          component: '@/pages/parent/Settings',
        },
        {
          path: '/parent/family-guide',
          component: '@/pages/parent/FamilyGuide',
        },
      ],
    },
    // 后台路由
    {
      path: '/admin',
      component: '@/layouts/AdminLayout',
      routes: [
        {
          path: '/admin',
          component: '@/pages/admin/Dashboard',
        },
        {
          path: '/admin/user-management',
          component: '@/pages/admin/UserManagement',
        },
        {
          path: '/admin/content-management',
          component: '@/pages/admin/ContentManagement',
        },
      ],
    },
    // 公共路由
    {
      path: '/',
      redirect: '/child',
    },
  ],
  fastRefresh: true,
});
