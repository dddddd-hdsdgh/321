/**
 * 认证服务
 * 管理用户登录、注册、登出等功能
 */

// 用户类型定义
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  role: 'parent' | 'admin';
  phone?: string;
  createdAt?: string;
}

// 认证状态接口
export interface AuthState {
  isLoggedIn: boolean;
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
}

// 登录请求参数
export interface LoginParams {
  email: string;
  password: string;
  role: 'parent' | 'admin';
}

// 注册请求参数（家长）
export interface ParentRegisterParams {
  username: string;
  email: string;
  phone?: string;
  password: string;
}

// 注册请求参数（管理员）
export interface AdminRegisterParams extends ParentRegisterParams {
  adminKey: string;
}

// 模拟用户数据（实际应用中应该从后端获取）
const mockUsers: UserInfo[] = [
  // 默认管理员账号（用于测试）
  {
    id: 'admin1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z'
  },
  // 默认家长账号（用于测试）
  {
    id: 'parent1',
    username: 'parent',
    email: 'parent@example.com',
    role: 'parent',
    phone: '13800138000',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

/**
 * 认证服务类
 */
class AuthService {
  // 管理员注册密钥（实际应用中应该从后端验证）
  private readonly ADMIN_KEY = 'ADMIN2024';

  /**
   * 获取当前登录用户信息
   */
  getCurrentUser(): UserInfo | null {
    try {
      const userStr = localStorage.getItem('userInfo');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }

  /**
   * 检查是否已登录
   */
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  /**
   * 检查用户角色
   */
  hasRole(requiredRole: 'parent' | 'admin'): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === requiredRole : false;
  }

  /**
   * 用户登录
   * @param params 登录参数
   */
  async login(params: LoginParams): Promise<UserInfo> {
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟验证逻辑
      // 注意：在实际应用中，这里应该调用后端API进行验证
      // 这里简化为检查模拟数据或测试账号
      
      // 测试账号：admin@example.com / password (管理员)
      // 测试账号：parent@example.com / password (家长)
      
      if (params.password !== 'password') {
        throw new Error('密码错误');
      }

      // 查找模拟用户或创建临时用户
      let user = mockUsers.find(u => u.email === params.email && u.role === params.role);
      
      if (!user) {
        // 如果用户不存在，创建一个临时用户（仅用于演示）
        user = {
          id: Date.now().toString(),
          username: params.email.split('@')[0],
          email: params.email,
          role: params.role
        };
      }

      // 存储用户信息
      localStorage.setItem('userInfo', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');

      return user;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  }

  /**
   * 家长注册
   * @param params 注册参数
   */
  async registerParent(params: ParentRegisterParams): Promise<UserInfo> {
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟验证逻辑
      // 检查邮箱是否已存在
      const existingUser = mockUsers.find(u => u.email === params.email);
      if (existingUser) {
        throw new Error('该邮箱已被注册');
      }

      // 创建新用户
      const newUser: UserInfo = {
        id: Date.now().toString(),
        username: params.username,
        email: params.email,
        role: 'parent',
        phone: params.phone,
        createdAt: new Date().toISOString()
      };

      // 模拟保存用户（实际应用中应该调用后端API）
      mockUsers.push(newUser);

      return newUser;
    } catch (error) {
      console.error('家长注册失败:', error);
      throw error;
    }
  }

  /**
   * 管理员注册
   * @param params 注册参数
   */
  async registerAdmin(params: AdminRegisterParams): Promise<UserInfo> {
    try {
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 验证管理员密钥
      if (params.adminKey !== this.ADMIN_KEY) {
        throw new Error('无效的管理员注册密钥');
      }

      // 检查邮箱是否已存在
      const existingUser = mockUsers.find(u => u.email === params.email);
      if (existingUser) {
        throw new Error('该邮箱已被注册');
      }

      // 创建新管理员
      const newAdmin: UserInfo = {
        id: Date.now().toString(),
        username: params.username,
        email: params.email,
        role: 'admin',
        phone: params.phone,
        createdAt: new Date().toISOString()
      };

      // 模拟保存管理员（实际应用中应该调用后端API）
      mockUsers.push(newAdmin);

      return newAdmin;
    } catch (error) {
      console.error('管理员注册失败:', error);
      throw error;
    }
  }

  /**
   * 用户登出
   */
  logout(): void {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('isLoggedIn');
  }

  /**
   * 获取认证状态
   */
  getAuthState(): AuthState {
    const user = this.getCurrentUser();
    return {
      isLoggedIn: !!user,
      user,
      loading: false,
      error: null
    };
  }

  /**
   * 清除认证错误
   */
  clearError(): void {
    localStorage.removeItem('authError');
  }

  /**
   * 存储认证错误
   * @param error 错误信息
   */
  setError(error: string): void {
    localStorage.setItem('authError', error);
  }
}

// 导出单例
export const authService = new AuthService();