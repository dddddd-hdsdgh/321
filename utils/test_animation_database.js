// utils/test_animation_database.js
// 动画库数据库关联测试工具

const { courses, studyRecords } = require('./supabase');

/**
 * 完整的动画库数据库关联测试
 * @param {string} childId - 测试用的儿童ID
 */
export const runAnimationDatabaseTests = async (childId) => {
  console.log('开始动画库数据库关联测试...');
  
  try {
    // 测试1: 获取视频分类
    console.log('\n测试1: 获取视频分类');
    const categoriesResult = await courses.getCategories();
    if (categoriesResult.error) {
      console.error('获取分类失败:', categoriesResult.error);
    } else {
      console.log(`成功获取到 ${categoriesResult.data.length} 个分类`);
      console.log('分类列表:', categoriesResult.data);
    }
    
    // 如果有分类，继续测试
    if (categoriesResult.data && categoriesResult.data.length > 0) {
      const firstCategory = categoriesResult.data[0];
      
      // 测试2: 获取分类下的视频
      console.log('\n测试2: 获取分类下的视频');
      const coursesResult = await courses.getCoursesByCategory(firstCategory.id);
      if (coursesResult.error) {
        console.error('获取视频课程失败:', coursesResult.error);
      } else {
        const videoCourses = coursesResult.data.filter(c => c.type === 'video');
        console.log(`成功获取到 ${videoCourses.length} 个视频课程`);
        
        // 如果有视频，继续测试
        if (videoCourses.length > 0) {
          const firstVideo = videoCourses[0];
          
          // 测试3: 获取视频详情
          console.log('\n测试3: 获取视频详情');
          const courseDetailResult = await courses.getCourseById(firstVideo.id);
          if (courseDetailResult.error) {
            console.error('获取视频详情失败:', courseDetailResult.error);
          } else {
            console.log('视频详情:', courseDetailResult.data);
          }
          
          // 测试4: 创建学习记录
          console.log('\n测试4: 创建学习记录');
          const now = new Date();
          const recordData = {
            child_id: childId,
            course_id: firstVideo.id,
            start_time: now,
            end_time: new Date(now.getTime() + 60000), // 1分钟后
            duration: 60,
            progress: 30,
            completed: false
          };
          
          const createResult = await studyRecords.createStudyRecord(recordData);
          if (createResult.error) {
            console.error('创建学习记录失败:', createResult.error);
          } else {
            console.log('学习记录创建成功:', createResult.data);
            const recordId = createResult.data[0].id;
            
            // 测试5: 更新学习记录
            console.log('\n测试5: 更新学习记录');
            const updateResult = await studyRecords.updateStudyRecord(recordId, {
              progress: 75,
              duration: 120
            });
            
            if (updateResult.error) {
              console.error('更新学习记录失败:', updateResult.error);
            } else {
              console.log('学习记录更新成功:', updateResult.data);
            }
          }
          
          // 测试6: 获取特定课程的学习记录
          console.log('\n测试6: 获取特定课程的学习记录');
          const specificRecordResult = await studyRecords.getChildStudyRecords(
            childId,
            1,
            firstVideo.id
          );
          
          if (specificRecordResult.error) {
            console.error('获取特定课程学习记录失败:', specificRecordResult.error);
          } else {
            console.log('特定课程学习记录:', specificRecordResult.data);
          }
        }
      }
    }
    
    console.log('\n测试完成！');
    return { success: true };
  } catch (error) {
    console.error('测试过程中发生错误:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 在VideoLibrary页面中使用的测试函数
 */
export const testVideoLibrary = async (pageInstance) => {
  console.log('测试VideoLibrary页面数据加载...');
  
  try {
    // 调用页面的方法测试
    await pageInstance.loadVideoCategories();
    
    if (pageInstance.data.videoCategories.length > 0) {
      console.log(`成功加载 ${pageInstance.data.videoCategories.length} 个视频分类`);
      
      // 尝试加载第一个分类的视频
      await pageInstance.loadVideos();
      console.log(`成功加载 ${pageInstance.data.videos.length} 个视频`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('VideoLibrary测试失败:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 调试函数：打印当前数据库连接状态
 */
export const debugDatabaseConnection = () => {
  const supabase = require('./supabase').default || require('./supabase').supabase;
  console.log('Supabase连接状态检查:');
  console.log('客户端对象存在:', !!supabase);
  console.log('认证模块存在:', !!supabase.auth);
  console.log('数据查询模块存在:', !!supabase.from);
};

module.exports = {
  runAnimationDatabaseTests,
  testVideoLibrary,
  debugDatabaseConnection
};