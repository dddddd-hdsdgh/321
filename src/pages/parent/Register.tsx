import React, { useState } from 'react';
import { Link, useNavigate } from 'umi';
import styles from './styles/Register.module.css';
import { isValidEmail, isValidPhone } from '@/utils/helpers';

const ParentRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    // 清空错误信息
    setError('');

    // 验证必填字段
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('请填写所有必填字段');
      return false;
    }

    // 验证邮箱格式
    if (!isValidEmail(formData.email)) {
      setError('请输入有效的邮箱地址');
      return false;
    }

    // 验证手机号格式（如果填写了）
    if (formData.phone && !isValidPhone(formData.phone)) {
      setError('请输入有效的手机号码');
      return false;
    }

    // 验证密码长度
    if (formData.password.length < 6) {
      setError('密码长度不能少于6位');
      return false;
    }

    // 验证两次密码是否一致
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
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
      setSuccess('注册成功！即将跳转到登录页面...');
      
      // 存储用户信息（实际应用中应该由后端处理）
      const userInfo = {
        id: Date.now().toString(),
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        role: 'parent'
      };
      
      // 模拟保存用户信息
      console.log('注册用户:', userInfo);
      
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
        <h1 className={styles.title}>家长注册</h1>
        <p className={styles.description}>创建账号，开始陪伴孩子学习语文</p>
        
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        
        <form onSubmit={handleRegister}>
          {/* 用户名 */}
          <div className={styles.inputGroup}>
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="请输入用户名"
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
              placeholder="请输入邮箱"
              required
            />
          </div>

          {/* 手机号 */}
          <div className={styles.inputGroup}>
            <label htmlFor="phone">手机号（选填）</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="请输入手机号"
            />
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
              placeholder="请输入密码（至少6位）"
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
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        {/* 登录链接 */}
        <div className={styles.loginLink}>
          已有账号？
          <Link to="/login" className={styles.link}>
            立即登录
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ParentRegister;