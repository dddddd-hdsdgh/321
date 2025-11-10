// utils/supabase.js
// Supabase连接配置文件 - 微信小程序兼容版

// 注意：微信小程序环境下，我们使用wx.request直接调用Supabase REST API

// Supabase项目信息
const SUPABASE_URL = 'https://buvtsudzojnuinaxyrfy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dnRzdWR6b2pudWluYXh5cmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNTM4NjEsImV4cCI6MjA3NzcyOTg2MX0.jJj4XDbQ60gSWHvInnc_CS1A7ZQLx_yGvRxLloFa2Ew';

// 创建Supabase客户端实例
const createSupabaseClient = () => {
  // 创建一个简单的查询构建器，确保所有方法都支持链式调用
  const createQueryBuilder = (tableName) => {
    const query = {
      tableName,
      selectColumns: '*',
      conditions: [],
      orderBy: null,
      limit: null,
      single: false,
      
      // 实现基础查询方法，确保都返回this以支持链式调用
      select(columns = '*') {
        this.selectColumns = columns;
        return this;
      },
      
      eq(column, value) {
        this.conditions.push({ type: 'eq', column, value });
        return this;
      },
      
      // 添加filter方法以支持in操作
      filter(column, operator, value) {
        this.conditions.push({ type: operator, column, value });
        return this;
      },
      
      order(column, options) {
        this.orderBy = { column, options };
        return this;
      },
      
      limit(value) {
        this.limit = value;
        return this;
      },
      
      single() {
        this.single = true;
        return this;
      },
      
      // 实现Promise接口，使其可以被await调用
      then(resolve, reject) {
        // 构建查询参数
        const params = [];
        params.push(`select=${encodeURIComponent(this.selectColumns)}`);
        
        // 添加过滤条件
        this.conditions.forEach(condition => {
          if (condition.type === 'eq') {
            params.push(`${condition.column}=eq.${encodeURIComponent(condition.value)}`);
          } else if (condition.type === 'in') {
            // 处理in操作，value应该是形如'(1,2,3)'的字符串
            params.push(`${condition.column}=in.${encodeURIComponent(condition.value)}`);
          } else if (condition.type === 'gte') {
            params.push(`${condition.column}=gte.${encodeURIComponent(condition.value)}`);
          } else if (condition.type === 'lte') {
            params.push(`${condition.column}=lte.${encodeURIComponent(condition.value)}`);
          }
        });
        
        // 添加排序
        if (this.orderBy) {
          const direction = this.orderBy.options?.ascending ? 'asc' : 'desc';
          params.push(`order=${encodeURIComponent(this.orderBy.column)}.${direction}`);
        }
        
        // 添加限制
        if (this.limit) {
          params.push(`limit=${this.limit}`);
        }
        
        const queryString = params.join('&');
        const url = `${SUPABASE_URL}/rest/v1/${this.tableName}?${queryString}`;
        
        // 发送请求
        return new Promise((resolve, reject) => {
          wx.request({
            url,
            method: 'GET',
            header: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            success: (res) => {
              let data = res.data;
              console.log(`查询表${this.tableName}结果 - 原始数据类型:`, typeof data);
              console.log(`查询表${this.tableName}结果 - 是否为数组:`, Array.isArray(data));
              console.log(`查询表${this.tableName}结果 - 数据长度:`, Array.isArray(data) ? data.length : 'N/A');
              
              // 只有在明确调用了single()方法时才返回单条数据
              if (this.single && Array.isArray(data) && data.length > 0) {
                console.log(`查询表${this.tableName} - 应用single()方法，只返回第一条数据`);
                data = data[0];
              }
              resolve({ data, error: null });
            },
            fail: (err) => {
              console.error(`查询表${this.tableName}失败:`, err);
              resolve({ data: null, error: err });
            }
          });
        }).then(resolve, reject);
      },
      
      // 添加catch方法以支持Promise链式调用
        catch(onRejected) {
          return this.then(null, onRejected);
        },
        
        // 插入数据
        async insert(data) {
          try {
            const url = `${SUPABASE_URL}/rest/v1/${this.tableName}`;
            return new Promise((resolve) => {
              wx.request({
                url,
                method: 'POST',
                header: {
                  'Content-Type': 'application/json',
                  'apikey': SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                data: data,
                success: (res) => {
                  resolve({ data: res.data, error: null });
                },
                fail: (err) => {
                  console.error('插入数据失败:', err);
                  resolve({ data: null, error: err });
                }
              });
            });
          } catch (error) {
            return { data: null, error: error };
          }
        },
        
        // 更新数据
        async update(data) {
          try {
            // 构建查询参数
            const params = [];
            this.conditions.forEach(condition => {
              if (condition.type === 'eq') {
                params.push(`${condition.column}=eq.${encodeURIComponent(condition.value)}`);
              }
            });
            
            const queryString = params.join('&');
            const url = `${SUPABASE_URL}/rest/v1/${this.tableName}${queryString ? `?${queryString}` : ''}`;
            
            return new Promise((resolve) => {
              wx.request({
                url,
                method: 'PATCH',
                header: {
                  'Content-Type': 'application/json',
                  'apikey': SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                data: data,
                success: (res) => {
                  resolve({ data: res.data, error: null });
                },
                fail: (err) => {
                  console.error('更新数据失败:', err);
                  resolve({ data: null, error: err });
                }
              });
            });
          } catch (error) {
            return { data: null, error: error };
          }
        },
        
        // 删除数据
        async delete() {
          try {
            // 构建查询参数
            const params = [];
            this.conditions.forEach(condition => {
              if (condition.type === 'eq') {
                params.push(`${condition.column}=eq.${encodeURIComponent(condition.value)}`);
              }
            });
            
            const queryString = params.join('&');
            const url = `${SUPABASE_URL}/rest/v1/${this.tableName}${queryString ? `?${queryString}` : ''}`;
            
            return new Promise((resolve) => {
              wx.request({
                url,
                method: 'DELETE',
                header: {
                  'Content-Type': 'application/json',
                  'apikey': SUPABASE_ANON_KEY,
                  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                success: (res) => {
                  resolve({ data: res.data, error: null });
                },
                fail: (err) => {
                  console.error('删除数据失败:', err);
                  resolve({ data: null, error: err });
                }
              });
            });
          } catch (error) {
            return { data: null, error: error };
          }
        }
      };
      
      return query;
  };
  
  // 返回客户端对象
  return {
    // 表操作入口，返回查询构建器
    from(tableName) {
      return createQueryBuilder(tableName);
    },
    
    // 认证相关（简化版）
    auth: {
      signInWithOAuth: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    }
  };
};

const supabase = createSupabaseClient();

// 用户相关操作
export const auth = {
  // 微信登录
  loginWithWechat: async (code) => {
    try {
      // 微信小程序中应使用wx.login和自定义后端处理
      // 这里使用模拟数据进行开发测试
      console.log('微信登录code:', code);
      return { 
        data: { 
          user: {
            id: 'mock-user-id',
            email: 'mock@example.com'
          },
          session: {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token'
          }
        }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  // 登出
  logout: async () => {
    try {
      await supabase.auth.signOut();
      return { error: null };
    } catch (error) {
      return { error };
    }
  },
  
  // 获取当前用户
  getCurrentUser: () => {
    try {
      return supabase.auth.getUser();
    } catch (error) {
      return { data: { user: null }, error };
    }
  },
};

// 家长相关操作
export const parents = {
  // 创建家长信息
  createParent: async (parentData) => {
    try {
      const { data, error } = await supabase
        .from('parents')
        .insert(parentData);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  // 根据openid获取家长信息
  getParentByOpenid: async (openid) => {
    try {
      const { data, error } = await supabase
        .from('parents')
        .select('*')
        .eq('openid', openid)
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// 孩子相关操作
export const children = {
  // 添加孩子
  addChild: async (childData) => {
    try {
      const { data, error } = await supabase
        .from('children')
        .insert(childData);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  // 获取家长的所有孩子
  getChildrenByParentId: async (parentId) => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', parentId);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  // 更新孩子信息
  updateChild: async (childId, updates) => {
    try {
      const { data, error } = await supabase
        .from('children')
        .update(updates)
        .eq('id', childId);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// 课程相关操作
export const courses = {
  // 获取所有课程分类
  getCategories: async () => {
    try {
      // 确保使用数组模式，不使用single()
      const queryBuilder = supabase
        .from('course_categories')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      // 强制设置single为false，确保返回所有结果
      queryBuilder.single = false;
      
      const { data, error } = await queryBuilder;
      
      // 打印获取到的分类数量，用于调试
      console.log('从数据库获取到的分类数量:', data ? (Array.isArray(data) ? data.length : 1) : 0);
      
      return { data, error };
    } catch (err) {
      console.error('获取课程分类失败:', err);
      return { data: null, error: err };
    }
  },
  
  // 根据分类获取课程
  getCoursesByCategory: async (categoryId) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  // 获取推荐课程
  getRecommendedCourses: async (type = 'daily', limit = 10) => {
    try {
      // 先从recommended_courses表获取推荐课程ID和顺序
      const { data: recommendedData, error: recommendError } = await supabase
        .from('recommended_courses')
        .select('*')
        .eq('recommend_type', type)
        .order('order_index', { ascending: true })
        .limit(limit);
      
      if (recommendError || !recommendedData || recommendedData.length === 0) {
        return { data: [], error: recommendError };
      }
      
      // 提取课程ID列表
      // 处理可能是单条数据或数组的数据
      let courseIds = [];
      if (Array.isArray(recommendedData)) {
        courseIds = recommendedData.map(rec => rec.course_id);
      } else if (recommendedData && typeof recommendedData === 'object' && recommendedData.course_id) {
        // 处理单条数据情况
        console.log('检测到推荐数据为单条记录，将其转换为数组');
        courseIds = [recommendedData.course_id];
      }
      
      // 如果没有课程ID，返回空数组
      if (courseIds.length === 0) {
        return { data: [], error: null };
      }
      
      // 从courses表获取完整的课程信息
      // 使用filter方法代替in方法，以兼容当前环境
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .filter('id', 'in', `(${courseIds.join(',')})`);
      
      if (coursesError || !coursesData) {
        return { data: [], error: coursesError };
      }
      
      // 创建课程ID到课程信息的映射
      const courseMap = {};
      // 确保coursesData是数组类型
      if (Array.isArray(coursesData)) {
        coursesData.forEach(course => {
          courseMap[course.id] = course;
        });
      } else if (coursesData && typeof coursesData === 'object' && coursesData.id) {
        // 处理单条数据的情况
        console.log('检测到课程数据为单条记录');
        courseMap[coursesData.id] = coursesData;
      }
      
      // 根据recommended_courses中的顺序重构课程列表
      let orderedCourses = [];
      if (Array.isArray(recommendedData)) {
        orderedCourses = recommendedData
          .map(rec => courseMap[rec.course_id])
          .filter(course => course !== undefined); // 过滤掉可能不存在的课程
      } else if (recommendedData && typeof recommendedData === 'object' && recommendedData.course_id) {
        // 处理单条数据情况
        const course = courseMap[recommendedData.course_id];
        if (course) {
          orderedCourses = [course];
        }
      }
      
      console.log('最终返回的推荐课程数量:', orderedCourses.length);
      
      return { data: orderedCourses, error: null };
    } catch (error) {
      console.error('获取推荐课程时发生错误:', error);
      return { data: null, error };
    }
  },
  
  // 根据ID获取课程详情
  // 获取课程学习进度
  getChildCourseProgress: async (childId, courseIds) => {
    try {
      // 使用filter方法代替in方法，以兼容当前环境
      const { data: studyRecords, error } = await supabase
        .from('study_records')
        .select('course_id, progress, completed')
        .eq('child_id', childId)
        .filter('course_id', 'in', `(${courseIds.join(',')})`);
      
      if (error || !studyRecords) {
        return { data: {}, error };
      }
      
      // 创建课程ID到进度信息的映射
      const progressMap = {};
      studyRecords.forEach(record => {
        progressMap[record.course_id] = {
          progress: record.progress || 0,
          completed: record.completed || false
        };
      });
      
      return { data: progressMap, error: null };
    } catch (error) {
      console.error('获取课程进度时发生错误:', error);
      return { data: {}, error };
    }
  },
  
  // 根据ID获取课程详情
  getCourseById: async (courseId) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// 学习记录相关操作
export const studyRecords = {
  // 创建学习记录
  createStudyRecord: async (recordData) => {
    try {
      const { data, error } = await supabase
        .from('study_records')
        .insert(recordData);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  // 更新学习记录
  updateStudyRecord: async (recordId, updates) => {
    try {
      const { data, error } = await supabase
        .from('study_records')
        .update(updates)
        .eq('id', recordId);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  // 获取孩子的学习记录
  getChildStudyRecords: async (childId, limit = 20, courseId = null) => {
    try {
      let query = supabase
        .from('study_records')
        .select('*')
        .eq('child_id', childId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (courseId) {
        query = query.eq('course_id', courseId);
      }
      
      const { data, error } = await query;
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// 成就相关操作
export const achievements = {
  // 获取所有成就
  getAllAchievements: async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('order_index', { ascending: true });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  // 获取孩子的成就
  getChildAchievements: async (childId) => {
    try {
      const { data, error } = await supabase
        .from('child_achievements')
        .select('*')
        .eq('child_id', childId);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// 学习设置相关操作
export const studySettings = {
  // 获取或创建学习设置
  getOrCreateSettings: async (childId) => {
    try {
      // 先尝试获取现有设置
      let { data, error } = await supabase
        .from('study_settings')
        .select('*')
        .eq('child_id', childId)
        .single();
      
      // 如果没有找到设置，创建新的
      if (error) {
        const newSettings = {
          child_id: childId,
          daily_goal: 30,
          reminder_enabled: true,
          reminder_time: '19:00',
          sound_enabled: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const result = await supabase
          .from('study_settings')
          .insert(newSettings);
        
        return result;
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  // 更新学习设置
  updateSettings: async (settingsId, updates) => {
    try {
      updates.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('study_settings')
        .update(updates)
        .eq('id', settingsId);
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// 收藏相关操作
export const favorites = {
  // 添加收藏
  addFavorite: async (childId, courseId) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({
          child_id: childId,
          course_id: courseId,
          created_at: new Date().toISOString()
        });
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  // 取消收藏
  removeFavorite: async (childId, courseId) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .delete()
        .eq('child_id', childId)
        .eq('course_id', courseId);
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  // 获取孩子的收藏列表
  getChildFavorites: async (childId) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*, courses(*)')
        .eq('child_id', childId);
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
};

// 统计相关操作
export const statistics = {
  // 获取孩子的学习统计
  getChildStudyStats: async (childId) => {
    try {
      // 在实际应用中，这可能需要使用Supabase的聚合函数
      // 这里使用简化版本
      const { data, error } = await supabase
        .from('study_records')
        .select('*')
        .eq('child_id', childId);
      
      // 计算统计数据
      if (data && Array.isArray(data)) {
        const totalCourses = new Set(data.map(record => record.course_id)).size;
        const totalMinutes = data.reduce((sum, record) => sum + (record.duration || 0), 0);
        const totalDays = new Set(data.map(record => {
          const date = new Date(record.created_at);
          return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        })).size;
        
        return {
          data: {
            total_courses: totalCourses,
            total_minutes: totalMinutes,
            total_days: totalDays,
            recent_records: data.slice(0, 10)
          },
          error: null
        };
      }
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
  
  // 获取每日学习统计
  getDailyStudyStats: async (childId, days = 7) => {
    try {
      // 计算日期范围
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days + 1);
      
      const { data, error } = await supabase
        .from('study_records')
        .select('*')
        .eq('child_id', childId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());
      
      // 按日期分组统计
      if (data && Array.isArray(data)) {
        const dailyStats = {};
        
        // 初始化每一天的数据
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          dailyStats[dateStr] = { minutes: 0, courses: new Set() };
        }
        
        // 统计每天的学习时间和课程数
        data.forEach(record => {
          const date = new Date(record.created_at);
          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          
          if (dailyStats[dateStr]) {
            dailyStats[dateStr].minutes += (record.duration || 0);
            dailyStats[dateStr].courses.add(record.course_id);
          }
        });
        
        // 转换为数组格式
        const result = Object.keys(dailyStats)
          .sort()
          .map(dateStr => ({
            date: dateStr,
            minutes: dailyStats[dateStr].minutes,
            course_count: dailyStats[dateStr].courses.size
          }));
        
        return { data: result, error: null };
      }
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },
};

module.exports = {
  default: supabase,
  supabase: supabase,
  auth: auth,
  parents: parents,
  children: children,
  courses: courses,
  studyRecords: studyRecords,
  achievements: achievements,
  studySettings: studySettings,
  favorites: favorites,
  statistics: statistics
};