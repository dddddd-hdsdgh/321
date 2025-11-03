import React, { useState } from 'react';
import styles from './styles/Settings.module.css';

const Settings: React.FC = () => {
  const [studyTimeLimit, setStudyTimeLimit] = useState<number>(15);
  const [ageGroup, setAgeGroup] = useState<string>('3-5');
  const [contentFilters, setContentFilters] = useState<{
    [key: string]: boolean;
  }>({
    'pinyin': true,
    'hanzi': true,
    'words': false,
    'sentences': false
  });
  const [eyeProtection, setEyeProtection] = useState<boolean>(true);
  const [restReminder, setRestReminder] = useState<boolean>(true);
  const [dataCollection, setDataCollection] = useState<{
    [key: string]: boolean;
  }>({
    'learningDuration': true,
    'interactionAccuracy': true,
    'contentProgress': true,
    'achievementStats': true
  });
  const [devices] = useState([
    { id: 1, name: '客厅平板', status: '在线' },
    { id: 2, name: '卧室电视', status: '离线' }
  ]);
  
  const handleContentFilterChange = (key: string) => {
    setContentFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleSave = () => {
    alert('设置已保存！');
  };
  
  const handlePauseDevice = (deviceId: number) => {
    alert('已远程暂停设备播放！');
  };
  
  return (
    <div className={styles.container}>
      <h1>设置中心</h1>
      
      <div className={styles.section}>
        <h2>儿童信息</h2>
        <div className={styles.formGroup}>
          <label>年龄段</label>
          <select 
            value={ageGroup} 
            onChange={(e) => setAgeGroup(e.target.value)}
            className={styles.select}
          >
            <option value="3-5">3-5岁 (学前儿童)</option>
            <option value="6-8">6-8岁 (小学1-2年级)</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>学习时长限制 (分钟/天)</label>
          <div className={styles.sliderContainer}>
            <input 
              type="range" 
              min="5" 
              max="30" 
              step="5" 
              value={studyTimeLimit} 
              onChange={(e) => setStudyTimeLimit(Number(e.target.value))}
              className={styles.slider}
            />
            <span className={styles.sliderValue}>{studyTimeLimit}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.section}>
        <h2>内容筛选</h2>
        <div className={styles.filterGrid}>
          {Object.entries(contentFilters).map(([key, value]) => (
            <div key={key} className={styles.filterItem}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={value} 
                  onChange={() => handleContentFilterChange(key)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>
                  {key === 'pinyin' && '拼音动画'}
                  {key === 'hanzi' && '汉字绘本'}
                  {key === 'words' && '词语学习'}
                  {key === 'sentences' && '短句练习'}
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.section}>
        <h2>数据收集设置</h2>
        <div className={styles.filterGrid}>
          {Object.entries(dataCollection).map(([key, value]) => (
            <div key={key} className={styles.filterItem}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={value} 
                  onChange={() => setDataCollection(prev => ({
                    ...prev,
                    [key]: !prev[key]
                  }))}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>
                  {key === 'learningDuration' && '学习时长记录'}
                  {key === 'interactionAccuracy' && '互动正确率统计'}
                  {key === 'contentProgress' && '内容学习进度'}
                  {key === 'achievementStats' && '成就完成情况'}
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>健康设置</h2>
        <div className={styles.switchGroup}>
          <label className={styles.switchLabel}>
            <input 
              type="checkbox" 
              checked={eyeProtection} 
              onChange={(e) => setEyeProtection(e.target.checked)}
              className={styles.switch}
            />
            <span className={styles.switchText}>护眼模式</span>
          </label>
        </div>
        <div className={styles.switchGroup}>
          <label className={styles.switchLabel}>
            <input 
              type="checkbox" 
              checked={restReminder} 
              onChange={(e) => setRestReminder(e.target.checked)}
              className={styles.switch}
            />
            <span className={styles.switchText}>休息提醒</span>
          </label>
        </div>
      </div>
      
      <div className={styles.section}>
        <h2>设备管理</h2>
        <div className={styles.devicesList}>
          {devices.map(device => (
            <div key={device.id} className={styles.deviceCard}>
              <div className={styles.deviceInfo}>
                <h3 className={styles.deviceName}>{device.name}</h3>
                <span className={`${styles.deviceStatus} ${device.status === '在线' ? 'online' : 'offline'}`}>
                  {device.status}
                </span>
              </div>
              {device.status === '在线' && (
                <button 
                  className={styles.pauseButton} 
                  onClick={() => handlePauseDevice(device.id)}
                >
                  远程暂停
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className={styles.actionButtons}>
        <button className={styles.saveButton} onClick={handleSave}>
          保存设置
        </button>
        <button className={styles.resetButton}>
          恢复默认
        </button>
      </div>
    </div>
  );
};

export default Settings;