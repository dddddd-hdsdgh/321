// API服务层，用于封装与后端的通信逻辑

const API_BASE_URL = '/api'; // 后端API基础URL

// 通用请求函数
const request = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// 用户相关API
export const userAPI = {
  // 获取用户信息
  getUserInfo: () => request<{ id: string; name: string; avatar: string }>('/user/info'),
  
  // 更新用户信息
  updateUserInfo: (data: { name?: string; avatar?: string }) => 
    request('/user/update', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
};

// 儿童学习相关API
export const learningAPI = {
  // 获取学习进度
  getLearningProgress: (childId: string) => 
    request<{ pinyin: number; hanzi: number; total: number }>(`/learning/progress/${childId}`),
  
  // 更新学习记录
  updateLearningRecord: (data: { 
    childId: string; 
    type: 'pinyin' | 'hanzi'; 
    contentId: string; 
    duration: number;
    completed: boolean;
  }) => request('/learning/record', { method: 'POST', body: JSON.stringify(data) }),
};

// 内容管理相关API
export const contentAPI = {
  // 获取拼音内容列表
  getPinyinContents: () => request<Array<{ id: string; title: string; videoUrl: string }>>('/content/pinyin'),
  
  // 获取汉字内容列表
  getHanziContents: () => request<Array<{ id: string; title: string; story: string }>>('/content/hanzi'),
  
  // 获取亲子互动指南
  getFamilyGuides: (filters?: { ageGroup?: string; category?: string }) => {
    const query = new URLSearchParams(filters).toString();
    return request(`/content/guides${query ? `?${query}` : ''}`);
  },
};

// 成就相关API
export const achievementAPI = {
  // 获取成就列表
  getAchievements: (childId: string) => 
    request<Array<{ id: string; title: string; description: string; unlocked: boolean; date?: string }>>(
      `/achievements/${childId}`
    ),
  
  // 解锁成就
  unlockAchievement: (data: { childId: string; achievementId: string }) => 
    request('/achievements/unlock', { method: 'POST', body: JSON.stringify(data) }),
};