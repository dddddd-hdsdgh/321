import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import '@/global.css';

// 创建根节点并渲染应用
const root = createRoot(
  document.getElementById('root') as HTMLElement
);

// 在 Umi 项目中，通常不需要手动渲染根组件
// Umi 会自动处理应用的入口和渲染
// 保留这个文件以确保兼容性