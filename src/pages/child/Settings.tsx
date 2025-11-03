import React, { useState } from 'react';
import styles from './styles/Settings.module.css';

interface SettingOption {
  value: string;
  label: string;
}

interface Setting {
  id: string;
  title: string;
  description: string;
  type: 'toggle' | 'select';
  value: boolean | string;
  options?: SettingOption[];
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([
    {
      id: 'sound',
      title: '音效',
      description: '开启或关闭应用内音效',
      type: 'toggle',
      value: true,
    },
    {
      id: 'music',
      title: '背景音乐',
      description: '开启或关闭背景音乐',
      type: 'toggle',
      value: true,
    },
    {
      id: 'difficulty',
      title: '学习难度',
      description: '选择适合的学习难度',
      type: 'select',
      value: 'easy',
      options: [
        { value: 'easy', label: '简单' },
        { value: 'medium', label: '中等' },
        { value: 'hard', label: '困难' },
      ],
    },
    {
      id: 'notifications',
      title: '学习提醒',
      description: '接收每日学习提醒',
      type: 'toggle',
      value: true,
    },
  ]);

  const handleToggleChange = (id: string) => {
    setSettings((prev: Setting[]) =>
      prev.map((setting: Setting) =>
        setting.id === id
          ? { ...setting, value: !(setting.value as boolean) }
          : setting
      )
    );
  };

  const handleSelectChange = (id: string, value: string) => {
    setSettings((prev: Setting[]) =>
      prev.map((setting: Setting) =>
        setting.id === id ? { ...setting, value } : setting
      )
    );
  };

  const saveSettings = () => {
    // 这里可以实现保存设置到本地存储或API
    console.log('Settings saved:', settings);
    alert('设置已保存！');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>设置</h1>
      
      <div className={styles.settingsList}>
        {settings.map(setting => (
          <div key={setting.id} className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <h3 className={styles.settingTitle}>{setting.title}</h3>
              <p className={styles.settingDescription}>{setting.description}</p>
            </div>
            
            {setting.type === 'toggle' && (
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={setting.value as boolean}
                  onChange={() => handleToggleChange(setting.id)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            )}
            
            {setting.type === 'select' && setting.options && (
              <select
                className={styles.selectInput}
                value={setting.value as string}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectChange(setting.id, e.target.value)}
              >
                {setting.options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
      
      <button className={styles.saveButton} onClick={saveSettings}>
        保存设置
      </button>
    </div>
  );
};

export default Settings;