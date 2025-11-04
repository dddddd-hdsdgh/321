import React, { useState } from 'react';
import { Link, useNavigate } from 'umi';
import styles from './styles/Login.module.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'parent' | 'admin'>('parent');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟验证逻辑（实际应用中应该调用API）
      if (email && password) {
        // 存储登录状态
        localStorage.setItem('userInfo', JSON.stringify({
          email,
          role,
          id: Date.now().toString(),
          name: role === 'parent' ? '家长用户' : '管理员'
        }));
        
        // 根据角色跳转到相应页面
        if (role === 'parent') {
          navigate('/parent');
        } else {
          navigate('/admin');
        }
      } else {
        setError('请输入邮箱和密码');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>萌豆语文动画屋</h1>
        <h2 className={styles.subtitle}>用户登录</h2>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          {/* 角色选择 */}
          <div className={styles.roleSelector}>
            <label className={styles.roleLabel}>
              <input
                type="radio"
                value="parent"
                checked={role === 'parent'}
                onChange={(e) => setRole(e.target.value as 'parent' | 'admin')}
              />
              <span className={styles.roleText}>家长登录</span>
            </label>
            <label className={styles.roleLabel}>
              <input
                type="radio"
                value="admin"
                checked={role === 'admin'}
                onChange={(e) => setRole(e.target.value as 'parent' | 'admin')}
              />
              <span className={styles.roleText}>管理员登录</span>
            </label>
          </div>

          {/* 邮箱输入 */}
          <div className={styles.inputGroup}>
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              required
            />
          </div>

          {/* 密码输入 */}
          <div className={styles.inputGroup}>
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>

          {/* 登录按钮 */}
          <button type="submit" className={styles.loginButton} disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        {/* 注册链接 */}
        <div className={styles.registerLink}>
          还没有账号？
          <Link 
            to={role === 'parent' ? '/parent/register' : '/admin/register'} 
            className={styles.link}
          >
            立即注册
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;