import React, { useEffect } from 'react';
import { useNavigate } from 'umi';
import { authService } from '@/services/auth';
import PageLoading from './PageLoading';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'parent' | 'admin';
  redirectPath?: string;
}

/**
 * 权限控制组件
 * 用于保护需要登录才能访问的页面，并验证用户角色权限
 */
const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRole,
  redirectPath = '/login'
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    // 检查认证状态
    const checkAuth = () => {
      const isLoggedIn = authService.isLoggedIn();
      
      // 如果未登录，重定向到登录页
      if (!isLoggedIn) {
        navigate(redirectPath);
        return;
      }
      
      // 如果需要特定角色，检查用户角色
      if (requiredRole) {
        const hasRequiredRole = authService.hasRole(requiredRole);
        
        if (!hasRequiredRole) {
          // 如果角色不匹配，重定向到对应角色的首页
          navigate(requiredRole === 'parent' ? '/parent' : '/admin');
        }
      }
    };

    checkAuth();

    // 监听路由变化，确保用户始终有权限访问当前页面
    const handleRouteChange = () => {
      checkAuth();
    };

    // 模拟路由变化监听（实际项目中可能需要使用相应的路由事件）
    const unsubscribe = window.addEventListener('popstate', handleRouteChange);

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [navigate, requiredRole, redirectPath]);

  // 检查是否已登录
  if (!authService.isLoggedIn()) {
    return <PageLoading />;
  }

  // 如果需要特定角色且用户不具备该角色，显示加载状态
  if (requiredRole && !authService.hasRole(requiredRole)) {
    return <PageLoading />;
  }

  return <>{children}</>;
};

export default AuthGuard;