# 微信小程序安装Supabase SDK详细指南

由于微信小程序环境的限制，官方的supabase-js包不能直接在微信小程序中使用，需要进行特殊处理。本指南将详细介绍如何在微信小程序中安装和配置Supabase SDK。

## 方法一：使用社区提供的微信小程序兼容版

目前，社区中有开发者提供了Supabase的微信小程序兼容版本。您可以按照以下步骤操作：

### 1. 下载微信小程序兼容版SDK

访问以下GitHub仓库下载兼容版SDK：
- https://github.com/supabase/supabase-js/issues/262
- https://github.com/linonetwo/wx-supabase

或者使用其他社区提供的兼容版本。

### 2. 将SDK文件放入小程序项目

1. 在项目的`utils`目录下创建`supabase`文件夹
2. 将下载的SDK文件（通常是`.js`文件）放入该文件夹

### 3. 配置自定义存储适配器

微信小程序使用`wx.setStorage`和`wx.getStorage`而不是浏览器的localStorage。需要创建一个自定义存储适配器：

```javascript
// utils/supabase/storage-adapter.js
const storageAdapter = {
  getItem: async (key) => {
    try {
      const { data } = await wx.getStorage({ key });
      return data;
    } catch (error) {
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      await wx.setStorage({ key, data: value });
      return true;
    } catch (error) {
      console.error('Error saving to storage:', error);
      return false;
    }
  },
  removeItem: async (key) => {
    try {
      await wx.removeStorage({ key });
      return true;
    } catch (error) {
      return false;
    }
  }
};

module.exports = storageAdapter;
```

## 方法二：使用REST API替代SDK

由于微信小程序环境的限制，使用REST API直接与Supabase交互可能是更可靠的方法：

### 1. 创建API请求工具类

```javascript
// utils/api.js
const SUPABASE_URL = 'https://buvtsudzojnuinaxyrfy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dnRzdWR6b2pudWluYXh5cmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxNTM4NjEsImV4cCI6MjA3NzcyOTg2MX0.jJj4XDbQ60gSWHvInnc_CS1A7ZQLx_yGvRxLloFa2Ew';

const request = async (endpoint, options = {}) => {
  const url = `${SUPABASE_URL}/rest/v1${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    ...options.headers
  };
  
  try {
    const response = await wx.request({
      url,
      method: options.method || 'GET',
      data: options.body,
      header: headers
    });
    
    if (response.statusCode >= 400) {
      throw new Error(`API错误: ${response.statusCode}`);
    }
    
    return response.data;
  } catch (error) {
    console.error('API请求失败:', error);
    throw error;
  }
};

module.exports = {
  request,
  SUPABASE_URL,
  SUPABASE_ANON_KEY
};
```

### 2. 创建Supabase功能封装

```javascript
// utils/supabase-api.js
const { request } = require('./api');

// 示例：获取所有课程
exports.getCourses = async () => {
  return await request('/courses?select=*');
};

// 示例：创建学习记录
exports.createStudyRecord = async (record) => {
  return await request('/study_records', {
    method: 'POST',
    body: record
  });
};

// 添加其他需要的API方法
```

## 方法三：修改现有的模拟实现

如果您不想使用REST API，也可以继续使用现有的模拟实现，但增强其功能：

1. 保持`utils/supabase.js`中的模拟客户端
2. 添加实际的API调用功能
3. 使用微信小程序的网络请求API

## 微信小程序中的网络请求配置

确保在小程序的`app.json`中配置了网络请求权限：

```json
{
  "permission": {
    "scope.userLocation": {
      "desc": "您的位置信息将用于提供本地化服务"
    }
  }
}
```

同时，需要在微信公众平台的"开发设置"中添加Supabase API域名到合法域名列表中。

## 认证配置

对于微信小程序登录，可以使用Supabase的OAuth功能：

1. 在Supabase控制台配置微信作为OAuth提供商
2. 在小程序中使用`wx.login`获取code
3. 将code发送到您的后端服务器，后端使用code与Supabase交换token
4. 将token保存到小程序的本地存储中

## 测试和调试

在实现过程中，请使用微信开发者工具的调试功能来监控网络请求和查看错误信息。如果遇到跨域问题，可能需要在Supabase控制台配置CORS设置。

## 最佳实践

1. 对于关键数据使用本地缓存，减少网络请求
2. 实现优雅的错误处理，当网络请求失败时使用缓存数据
3. 定期刷新令牌以维持认证状态
4. 注意小程序的网络请求频率限制，避免请求过于频繁

## 注意事项

- 微信小程序对网络请求有严格限制，请确保遵循微信小程序的开发规范
- 敏感信息（如API密钥）不应硬编码在前端代码中，建议使用环境变量或后端代理
- 考虑使用云开发或自建后端作为中间层，减少直接暴露API密钥的风险