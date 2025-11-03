import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Link } from 'umi';
import styles from './styles/Dashboard.module.css';
import { learningDataService, ChildProfile, LearningActivity, WeeklyData, MasteryData } from '@/services/learningData';

const Dashboard: React.FC = () => {
  const [childInfo, setChildInfo] = useState<ChildProfile>({
    id: '',
    name: '',
    age: 0,
    todayStudyTime: 0,
    totalStudyTime: 0
  });
  
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [recentActivities, setRecentActivities] = useState<LearningActivity[]>([]);
  const [masteryData, setMasteryData] = useState<MasteryData[]>([]);
  
  useEffect(() => {
    // 加载数据
    learningDataService.loadFromStorage();
    
    // 获取孩子信息
    setChildInfo(learningDataService.getChildProfile());
    
    // 获取每周学习数据
    setWeeklyData(learningDataService.getWeeklyData());
    
    // 获取最近活动
    setRecentActivities(learningDataService.getRecentActivities(5));
    
    // 获取掌握程度数据
    setMasteryData(learningDataService.getMasteryData());
    
    // 定期更新数据
    const interval = setInterval(() => {
      setChildInfo(learningDataService.getChildProfile());
      setRecentActivities(learningDataService.getRecentActivities(5));
    }, 30000); // 每30秒更新一次
    
    return () => clearInterval(interval);
  }, []);
  
  // 学习时长图表配置
  const timeChartOption = {
    title: {
      text: '本周学习时长',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: weeklyData.map(d => d.day)
    },
    yAxis: {
      type: 'value',
      name: '分钟'
    },
    series: [{
      data: weeklyData.map(d => d.duration),
      type: 'bar',
      itemStyle: {
        color: '#4ecdc4'
      }
    }]
  };
  
  // 知识点掌握度图表配置
  const masteryChartOption = {
    title: {
      text: '知识点掌握情况',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['已掌握', '未掌握'],
      bottom: 0
    },
    xAxis: {
      type: 'category',
      data: masteryData.map(d => d.name)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '已掌握',
        type: 'bar',
        stack: 'total',
        data: masteryData.map(d => d.mastered),
        itemStyle: {
          color: '#28a745'
        }
      },
      {
        name: '未掌握',
        type: 'bar',
        stack: 'total',
        data: masteryData.map(d => d.total - d.mastered),
        itemStyle: {
          color: '#e0e0e0'
        }
      }
    ]
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>学习数据看板</h1>
        <div className={styles.childSelector}>
          <select>
            <option>{childInfo.name} (5岁)</option>
          </select>
        </div>
      </div>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>今日学习</h3>
          <p className={styles.statValue}>{childInfo.todayStudyTime}</p>
          <p className={styles.statLabel}>分钟</p>
        </div>
        <div className={styles.statCard}>
          <h3>总学习时长</h3>
          <p className={styles.statValue}>{childInfo.totalStudyTime}</p>
          <p className={styles.statLabel}>分钟</p>
        </div>
        <div className={styles.statCard}>
          <h3>本周完成</h3>
          <p className={styles.statValue}>
            {weeklyData.reduce((sum, d) => sum + d.completed, 0)}
          </p>
          <p className={styles.statLabel}>课程</p>
        </div>
      </div>
      
      <div className={styles.chartsContainer}>
        <div className={styles.chartWrapper}>
          <ReactECharts 
            option={timeChartOption} 
            style={{ height: '300px', width: '100%' }} 
          />
        </div>
        <div className={styles.chartWrapper}>
          <ReactECharts 
            option={masteryChartOption} 
            style={{ height: '300px', width: '100%' }} 
          />
        </div>
      </div>
      
      <div className={styles.activitiesSection}>
        <h2>最近学习活动</h2>
        <div className={styles.activitiesList}>
          {recentActivities.map(activity => (
            <div key={activity.id} className={styles.activityCard}>
              <div className={styles.activityHeader}>
                <h3 className={styles.activityTitle}>{activity.title}</h3>
                <span className={`${styles.statusBadge} ${activity.completed ? 'completed' : 'pending'}`}>
                  {activity.completed ? '已完成' : '未完成'}
                </span>
              </div>
              <div className={styles.activityInfo}>
                <span className={styles.activityType}>{activity.type}</span>
                <span className={styles.activityDuration}>{activity.duration}分钟</span>
                <span className={styles.activityDate}>{activity.date}</span>
                {activity.accuracy && (
                  <span className={styles.activityAccuracy}>正确率: {activity.accuracy}%</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;