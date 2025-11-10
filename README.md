# 萌豆语文动画屋 - Supabase数据库配置指南

## 项目概述

萌豆语文动画屋是一个专为儿童设计的语文学习微信小程序，采用游戏化的方式帮助儿童学习拼音、汉字、词语和句子。本项目使用Supabase作为后端数据库服务，提供用户管理、课程内容存储、学习记录追踪等功能。

## Supabase配置步骤

### 1. 创建Supabase项目

1. 访问 [Supabase官网](https://supabase.io/) 并注册账号
2. 点击「New Project」创建新项目
3. 设置项目名称、数据库密码和区域
4. 等待项目初始化完成（约2分钟）

### 2. 导入数据库结构

项目根目录下提供了完整的数据库结构文件 `supabase_schema.sql`，您可以通过以下方式导入：

#### 方法一：使用Supabase SQL编辑器

1. 进入您的Supabase项目控制台
2. 点击左侧菜单栏的「SQL Editor」
3. 点击「New query」
4. 复制 `supabase_schema.sql` 文件的全部内容到编辑器中
5. 点击「Run」执行SQL脚本

#### 方法二：使用命令行工具

如果您已安装 [Supabase CLI](https://supabase.com/docs/reference/cli/overview)，可以使用以下命令：

```bash
supabase db push --db-url "postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres"
```

### 3. 配置小程序连接信息

1. 在Supabase项目控制台中，点击左侧菜单栏的「Project Settings」
2. 选择「API」标签页
3. 复制「Project URL」和「anon key」
4. 打开小程序项目中的 `utils/supabase.js` 文件
5. 将复制的URL和Key粘贴到以下位置：

```javascript
// utils/supabase.js
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### 4. 配置认证设置

为了支持微信登录功能，需要在Supabase中配置微信作为OAuth提供商：

1. 在Supabase项目控制台中，点击左侧菜单栏的「Authentication」
2. 选择「Providers」标签页
3. 启用「WeChat」选项
4. 配置相应的AppID和AppSecret（需要您的微信小程序已在微信开放平台注册）

### 5. 配置存储策略

如果您需要使用Supabase Storage存储图片和视频等媒体文件：

1. 在Supabase项目控制台中，点击左侧菜单栏的「Storage」
2. 创建必要的存储桶（buckets）：
   - `avatars` - 用于存储用户头像
   - `course-videos` - 用于存储课程视频
   - `thumbnails` - 用于存储缩略图
3. 设置适当的访问策略，允许公共读取和认证用户写入

## 数据库表结构说明

本项目使用以下主要数据表：

### 核心表

1. **parents** - 家长用户信息表
2. **children** - 儿童用户信息表
3. **course_categories** - 课程分类表
4. **courses** - 课程内容表
5. **study_records** - 学习记录表
6. **achievements** - 成就定义表
7. **child_achievements** - 儿童成就解锁记录表
8. **study_settings** - 学习设置表
9. **favorites** - 收藏课程表
10. **recommended_courses** - 推荐课程表

### 视图

1. **child_study_stats** - 儿童学习统计视图
2. **daily_study_stats** - 每日学习统计视图

详细表结构请参考 `supabase_schema.sql` 文件。

## 使用说明

### 初始化Supabase客户端

小程序在 `app.js` 中初始化Supabase客户端，并将其添加到全局数据中，以便在各个页面中使用：

```javascript
// 获取全局Supabase实例
const app = getApp();
const supabase = app.globalData.supabase;
```

### 数据操作示例

项目中提供了一组便捷的API函数，封装了常见的数据操作：

```javascript
// 导入所需的API模块
const { courses, studyRecords, children } = require('../../utils/supabase');

// 获取推荐课程示例
async function loadRecommendedCourses() {
  const { data, error } = await courses.getRecommendedCourses('daily', 5);
  if (error) {
    console.error('获取推荐课程失败:', error);
    return;
  }
  console.log('推荐课程:', data);
}

// 创建学习记录示例
async function createStudyRecord(childId, courseId) {
  const { data, error } = await studyRecords.createStudyRecord({
    child_id: childId,
    course_id: courseId,
    start_time: new Date(),
    progress: 0
  });
  
  if (error) {
    console.error('创建学习记录失败:', error);
    return null;
  }
  
  return data;
}
```

### 错误处理

使用Supabase API时，应始终检查返回的错误对象：

```javascript
const { data, error } = await someSupabaseFunction();

if (error) {
  console.error('操作失败:', error);
  wx.showToast({
    title: '操作失败',
    icon: 'none'
  });
  return;
}

// 处理数据
handleData(data);
```

## 注意事项

1. **安全性**：生产环境中，请确保正确配置Supabase的访问策略，避免敏感数据泄露
2. **性能优化**：对于频繁访问的数据，可以使用小程序的本地存储进行缓存
3. **网络错误**：实现网络错误重试机制，提高用户体验
4. **数据备份**：定期备份Supabase数据库，确保数据安全
5. **监控**：使用Supabase的日志功能监控API调用和性能

## 故障排除

### 连接问题

- 检查 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY` 是否正确配置
- 确认网络连接正常
- 检查Supabase项目状态是否正常

### 认证问题

- 确保微信小程序已在Supabase中正确配置
- 检查微信登录返回的code是否有效
- 查看认证日志了解详细错误信息

### 数据操作问题

- 确认用户对表有正确的访问权限
- 检查SQL语句是否有语法错误
- 查看Supabase控制台中的错误日志

## 许可证

本项目采用MIT许可证。详情请参阅LICENSE文件。
