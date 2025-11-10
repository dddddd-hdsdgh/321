// utils/errorHandler.js

/**
 * Supabase错误处理工具
 * 提供统一的错误处理机制，便于在整个应用中处理Supabase操作相关的错误
 */

/**
 * 错误类型枚举
 */
const ERROR_TYPES = {
  AUTHENTICATION: 'AUTHENTICATION',
  NETWORK: 'NETWORK',
  VALIDATION: 'VALIDATION',
  NOT_FOUND: 'NOT_FOUND',
  PERMISSION: 'PERMISSION',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN'
};

/**
 * 错误码映射，用于识别Supabase错误类型
 */
const ERROR_CODE_MAPPING = {
  // 认证相关错误
  '401': ERROR_TYPES.AUTHENTICATION,
  '403': ERROR_TYPES.PERMISSION,
  '404': ERROR_TYPES.NOT_FOUND,
  'PGRST116': ERROR_TYPES.VALIDATION,
  'PGRST204': ERROR_TYPES.NOT_FOUND,
  'PGRST301': ERROR_TYPES.AUTHENTICATION,
  'PGRST303': ERROR_TYPES.PERMISSION,
  'PGRST320': ERROR_TYPES.VALIDATION,
  'PGRST321': ERROR_TYPES.VALIDATION,
  'PGRST331': ERROR_TYPES.PERMISSION,
  // 网络错误
  'ECONNREFUSED': ERROR_TYPES.NETWORK,
  'ECONNRESET': ERROR_TYPES.NETWORK,
  'ENOTFOUND': ERROR_TYPES.NETWORK,
  'ETIMEDOUT': ERROR_TYPES.NETWORK
};

/**
 * 基于错误码或消息确定错误类型
 * @param {Object} error - Supabase错误对象
 * @returns {string} - 错误类型
 */
function determineErrorType(error) {
  if (!error) return ERROR_TYPES.UNKNOWN;
  
  // 检查错误码
  if (error.code && ERROR_CODE_MAPPING[error.code]) {
    return ERROR_CODE_MAPPING[error.code];
  }
  
  // 检查HTTP状态码
  if (error.status && ERROR_CODE_MAPPING[error.status.toString()]) {
    return ERROR_CODE_MAPPING[error.status.toString()];
  }
  
  // 检查错误消息
  const errorMessage = (error.message || '').toLowerCase();
  if (errorMessage.includes('network') || errorMessage.includes('连接') || 
      errorMessage.includes('timeout') || errorMessage.includes('timeout')) {
    return ERROR_TYPES.NETWORK;
  }
  
  if (errorMessage.includes('auth') || errorMessage.includes('authentication') ||
      errorMessage.includes('登录') || errorMessage.includes('认证')) {
    return ERROR_TYPES.AUTHENTICATION;
  }
  
  if (errorMessage.includes('permission') || errorMessage.includes('权限')) {
    return ERROR_TYPES.PERMISSION;
  }
  
  if (errorMessage.includes('not found') || errorMessage.includes('未找到')) {
    return ERROR_TYPES.NOT_FOUND;
  }
  
  if (errorMessage.includes('validation') || errorMessage.includes('验证')) {
    return ERROR_TYPES.VALIDATION;
  }
  
  if (errorMessage.includes('server') || errorMessage.includes('服务器')) {
    return ERROR_TYPES.SERVER;
  }
  
  return ERROR_TYPES.UNKNOWN;
}

/**
 * 生成用户友好的错误消息
 * @param {Object} error - Supabase错误对象
 * @returns {string} - 用户友好的错误消息
 */
function getFriendlyErrorMessage(error) {
  const errorType = determineErrorType(error);
  
  switch (errorType) {
    case ERROR_TYPES.AUTHENTICATION:
      return '登录已过期，请重新登录';
    case ERROR_TYPES.NETWORK:
      return '网络连接失败，请检查网络后重试';
    case ERROR_TYPES.VALIDATION:
      return `输入有误：${error.message || '请检查输入内容'}`;
    case ERROR_TYPES.NOT_FOUND:
      return '找不到请求的内容';
    case ERROR_TYPES.PERMISSION:
      return '您没有权限执行此操作';
    case ERROR_TYPES.SERVER:
      return '服务器繁忙，请稍后再试';
    default:
      return `操作失败：${error.message || '未知错误'}`;
  }
}

/**
 * 处理Supabase错误并显示用户友好的提示
 * @param {Object} error - Supabase错误对象
 * @param {Object} options - 配置选项
 * @param {boolean} options.showToast - 是否显示Toast提示
 * @param {Function} options.onAuthError - 认证错误时的回调函数
 * @param {Function} options.onNetworkError - 网络错误时的回调函数
 * @returns {Object} - 处理后的错误信息
 */
async function handleSupabaseError(error, options = {}) {
  const {
    showToast = true,
    onAuthError,
    onNetworkError
  } = options;
  
  console.error('Supabase错误:', error);
  
  const errorType = determineErrorType(error);
  const friendlyMessage = getFriendlyErrorMessage(error);
  
  // 显示错误提示
  if (showToast) {
    wx.showToast({
      title: friendlyMessage,
      icon: 'none',
      duration: 3000
    });
  }
  
  // 处理特定类型的错误
  if (errorType === ERROR_TYPES.AUTHENTICATION && onAuthError) {
    await onAuthError();
  } else if (errorType === ERROR_TYPES.NETWORK && onNetworkError) {
    await onNetworkError();
  }
  
  // 返回结构化的错误信息
  return {
    originalError: error,
    type: errorType,
    message: friendlyMessage
  };
}

/**
 * 重试函数 - 用于网络错误时的重试逻辑
 * @param {Function} fn - 要重试的函数
 * @param {number} maxRetries - 最大重试次数，默认3次
 * @param {number} delay - 重试间隔(ms)，默认1000ms
 * @returns {Promise} - 函数执行结果
 */
async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // 只有网络错误才重试
      const errorType = determineErrorType(error);
      
      if (errorType !== ERROR_TYPES.NETWORK) {
        throw error;
      }
      
      lastError = error;
      
      // 如果不是最后一次尝试，则等待后重试
      if (attempt < maxRetries) {
        // 指数退避策略
        const waitTime = delay * Math.pow(2, attempt) + Math.random() * 1000;
        console.log(`请求失败，${waitTime}ms后重试 (${attempt + 1}/${maxRetries})`);
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  // 所有重试都失败，抛出最后一个错误
  throw lastError;
}

/**
 * 统一的Supabase操作封装，包含错误处理和重试逻辑
 * @param {Function} operation - Supabase操作函数
 * @param {Object} options - 配置选项
 * @returns {Promise} - 操作结果
 */
async function withSupabaseErrorHandling(operation, options = {}) {
  try {
    return await retryWithBackoff(async () => {
      const result = await operation();
      
      // 检查操作结果中的错误
      if (result && result.error) {
        throw result.error;
      }
      
      return result;
    });
  } catch (error) {
    // 处理错误并重新抛出，以便调用者可以根据需要进一步处理
    await handleSupabaseError(error, options);
    throw error;
  }
}

/**
 * 处理认证过期的默认行为
 */
async function handleAuthExpired() {
  // 清除本地登录状态
  try {
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('token');
  } catch (e) {
    console.error('清除登录状态失败:', e);
  }
  
  // 跳转到登录页面
  setTimeout(() => {
    wx.navigateTo({
      url: '/pages/auth/Login'
    });
  }, 1000);
}

module.exports = {
  ERROR_TYPES,
  determineErrorType,
  getFriendlyErrorMessage,
  handleSupabaseError,
  retryWithBackoff,
  withSupabaseErrorHandling,
  handleAuthExpired
};