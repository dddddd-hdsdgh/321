import React from 'react';
import { Link } from 'umi';
import styles from './styles/Navigation.module.css';

interface NavigationProps {
  routes: Array<{
    path: string;
    title: string;
    icon?: string;
  }>;
  currentPath: string;
  type?: 'horizontal' | 'vertical';
}

const Navigation: React.FC<NavigationProps> = ({ 
  routes, 
  currentPath, 
  type = 'horizontal' 
}) => {
  return (
    <nav className={`${styles.navigation} ${styles[type]}`}>
      {routes.map((route) => (
        <Link
          key={route.path}
          to={route.path}
          className={`${styles.navItem} ${
            currentPath === route.path ? styles.active : ''
          }`}
        >
          {route.icon && <span className={styles.icon}>{route.icon}</span>}
          <span className={styles.navText}>{route.title}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;