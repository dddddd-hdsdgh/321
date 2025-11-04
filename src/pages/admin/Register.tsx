import React, { useState } from 'react';
import { Link, useNavigate } from 'umi';
import styles from './styles/Register.module.css';
import { isValidEmail } from '@/utils/helpers';

const AdminRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: '' // 管理员注册密钥
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // 模拟管理员密钥（实际应用中应该从后端验证）
  const VALID_ADMIN_KEY = 'ADMIN2024';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    // 清空错误信息
    setError('');

    // 验证必填字段
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword || !formData.adminKey) {
      setError('请填写所有必填字段');
      return false;
    }

    // 验证邮箱格式
    if (!isValidEmail(formData.email)) {
      setError('请输入有效的邮箱地址');
      return false;
    }

    // 验证密码长度
    if (formData.password.length < 8) {
      setError('管理员密码长度不能少于8位');
      return false;
    }

    // 验证两次密码是否一致
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return false;
    }

    // 验证管理员密钥
    if (formData.adminKey !== VALID_ADMIN_KEY) {
      setError('无效的管理员注册密钥');
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // 模拟注册请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 模拟注册成功
      setSuccess('管理员注册成功！即将跳转到登录页面...');
      
      // 存储管理员信息（实际应用中应该由后端处理）
      const adminInfo = {
        id: Date.now().toString(),
        username: formData.username,
        email: formData.email,
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      
      // 模拟保存管理员信息
      console.log('注册管理员:', adminInfo);
      
      // 延迟后跳转到登录页
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h1 className={styles.title}>管理员注册</h1>
        <p className={styles.description}>请输入管理员注册信息和授权密钥</p>
        
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        
        <form onSubmit={handleRegister}>
          {/* 用户名 */}
          <div className={styles.inputGroup}>
            <label htmlFor="username">用户名 <span className={styles.required}>*</span></label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="请输入管理员用户名"
              required
            />
          </div>

          {/* 邮箱 */}
          <div className={styles.inputGroup}>
            <label htmlFor="email">邮箱 <span className={styles.required}>*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="请输入管理员邮箱"
              required
            />
          </div>

          {/* 管理员密钥 */}
          <div className={styles.inputGroup}>
            <label htmlFor="adminKey">管理员密钥 <span className={styles.required}>*</span></label>
            <input
              type="password"
              id="adminKey"
              name="adminKey"
              value={formData.adminKey}
              onChange={handleChange}
              placeholder="请输入管理员注册密钥"
              required
            />
            <div className={styles.helperText}>请联系系统管理员获取注册密钥</div>
          </div>

          {/* 密码 */}
          <div className={styles.inputGroup}>
            <label htmlFor="password">密码 <span className={styles.required}>*</span></label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="请输入密码（至少8位）"
              required
            />
          </div>

          {/* 确认密码 */}
          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">确认密码 <span className={styles.required}>*</span></label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="请再次输入密码"
              required
            />
          </div>

          {/* 注册按钮 */}
          <button type="submit" className={styles.registerButton} disabled={loading}>
            {loading ? '注册中...' : '注册管理员'}
          </button>
        </form>

        {/* 登录链接 */}
        <div className={styles.loginLink}>
          已有账号？
          <Link to="/login" className={styles.link}>
            立即登录
          </Link>
        </div>

        {/* 安全提示 */}
        <div className={styles.securityNotice}>
          <p className={styles.noticeTitle}>安全提示：</p>
          <p className={styles.noticeText}>• 管理员账号仅限授权人员使用</p>
          <p className={styles.noticeText}>• 请勿泄露管理员密钥</p>
          <p className={styles.noticeText}>• 定期更改密码以保障安全</p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;