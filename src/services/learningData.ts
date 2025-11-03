// 学习数据服务

// 定义数据类型
export interface LearningActivity {
  id: string;
  title?: string;
  type: '拼音' | '汉字' | '词语' | 'pinyin_identification' | 'pinyin_practice_complete' | 
        'hanzi_identification' | 'hanzi_practice_complete' | 'word_matching' | 'word_practice_complete' | 
        'fill_blank' | 'sentence_listen' | 'sentence_repeat' | 'sentence_rearrange' | 'sentence_practice_complete';
  duration: number; // 分钟
  date: string;
  completed?: boolean;
  accuracy?: number; // 准确率
  score?: number; // 得分
  contentId?: string; // 内容ID
  success?: boolean; // 是否成功
  metadata?: Record<string, any>;
}

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  todayStudyTime: number; // 分钟
  totalStudyTime: number; // 分钟
  lastLogin?: string;
}

export interface WeeklyData {
  day: string;
  duration: number;
  completed: number;
}

export interface MasteryData {
  name: string;
  mastered: number;
  total: number;
}

// 学习数据管理类
class LearningDataService {
  private activities: LearningActivity[] = [];
  private childProfile: ChildProfile = {
    id: 'child001',
    name: '小明',
    age: 5,
    todayStudyTime: 0,
    totalStudyTime: 0,
  };

  constructor() {
    // 初始化模拟数据
    this.initializeMockData();
  }

  // 初始化模拟数据
  private initializeMockData() {
    this.activities = [
      {
        id: '1',
        title: '拼音精灵：a和b',
        type: '拼音',
        duration: 5,
        date: new Date().toLocaleString('zh-CN'),
        completed: true,
        accuracy: 90,
        score: 85,
      },
      {
        id: '2',
        title: '汉字成长记：日',
        type: '汉字',
        duration: 7,
        date: new Date().toLocaleString('zh-CN'),
        completed: true,
        accuracy: 85,
        score: 90,
      },
    ];

    this.childProfile.todayStudyTime = 12;
    this.childProfile.totalStudyTime = 120;
  }

  // 记录学习活动
  public recordActivity(activity: Omit<LearningActivity, 'id' | 'date'>): LearningActivity {
    const newActivity: LearningActivity = {
      ...activity,
      id: Date.now().toString(),
      date: new Date().toLocaleString('zh-CN'),
    };

    this.activities.unshift(newActivity);
    this.childProfile.todayStudyTime += activity.duration;
    this.childProfile.totalStudyTime += activity.duration;
    this.childProfile.lastLogin = new Date().toLocaleString('zh-CN');

    // 保存到本地存储
    this.saveToStorage();
    return newActivity;
  }

  // 获取最近活动
  public getRecentActivities(limit: number = 10): LearningActivity[] {
    return this.activities.slice(0, limit);
  }

  // 获取周学习数据
  public getWeeklyData(): WeeklyData[] {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const weekData: WeeklyData[] = [];
    
    const today = new Date().getDay();
    
    for (let i = 0; i < 7; i++) {
      weekData.push({
        day: days[i],
        duration: i === today ? this.childProfile.todayStudyTime : Math.floor(Math.random() * 20),
        completed: i === today ? 2 : Math.floor(Math.random() * 3),
      });
    }
    
    return weekData;
  }

  // 获取掌握程度数据
  public getMasteryData(): MasteryData[] {
    return [
      { name: '拼音', mastered: 12, total: 23 },
      { name: '汉字', mastered: 8, total: 15 },
      { name: '词语', mastered: 5, total: 10 },
    ];
  }

  // 获取孩子信息
  public getChildProfile(): ChildProfile {
    return this.childProfile;
  }

  // 更新孩子信息
  public updateChildProfile(profile: Partial<ChildProfile>): ChildProfile {
    this.childProfile = { ...this.childProfile, ...profile };
    this.saveToStorage();
    return this.childProfile;
  }

  // 保存到本地存储
  private saveToStorage(): void {
    try {
      localStorage.setItem('learningActivities', JSON.stringify(this.activities));
      localStorage.setItem('childProfile', JSON.stringify(this.childProfile));
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  }

  // 从本地存储加载
  public loadFromStorage(): void {
    try {
      const activitiesData = localStorage.getItem('learningActivities');
      const profileData = localStorage.getItem('childProfile');
      
      if (activitiesData) {
        this.activities = JSON.parse(activitiesData);
      }
      
      if (profileData) {
        this.childProfile = JSON.parse(profileData);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  }
}

// 导出单例
export const learningDataService = new LearningDataService();