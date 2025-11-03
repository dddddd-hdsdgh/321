import 'umi/typings';

// React 模块声明
declare module 'react' {
  // 扩展 React 类型声明
}

// JSX 运行时声明
declare module 'react/jsx-runtime' {
  // 确保 JSX 元素有正确的类型定义
}

// 确保 JSX 元素有正确的接口定义
declare namespace JSX {
  interface IntrinsicElements {
    // 基本 HTML 元素类型
    [elemName: string]: any;
  }
}