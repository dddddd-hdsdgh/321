import React from 'react';
import { Link } from 'umi';
import styles from './styles/404.module.css';

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.errorCode}>404</div>
      <h1 className={styles.title}>页面不存在</h1>
      <p className={styles.description}>抱歉，您访问的页面不存在或已被移动</p>
      <Link to="/" className={styles.homeButton}>
        返回首页
      </Link>
    </div>
  );
};

export default NotFoundPage;