import React from 'react';
import styles from './styles/PageLoading.module.css';

const PageLoading: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loadingSpinner}></div>
      <p className={styles.loadingText}>正在加载中...</p>
    </div>
  );
};

export default PageLoading;