import React, { useState, useEffect } from 'react';
import styles from './styles/PinyinParadise.module.css';
import { learningDataService } from '@/services/learningData';

const PinyinParadise: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('initial'); // initial, practice, result
  const [selectedPinyin, setSelectedPinyin] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  const pinyinList = [
    { text: 'b', image: '/b.png', sound: '/b.mp3' },
    { text: 'p', image: '/p.png', sound: '/p.mp3' },
    { text: 'm', image: '/m.png', sound: '/m.mp3' },
    { text: 'f', image: '/f.png', sound: '/f.mp3' },
    { text: 'd', image: '/d.png', sound: '/d.mp3' },
    { text: 't', image: '/t.png', sound: '/t.mp3' },
    { text: 'n', image: '/n.png', sound: '/n.mp3' },
    { text: 'l', image: '/l.png', sound: '/l.mp3' },
  ];

  const mixedPinyin = [...pinyinList].sort(() => Math.random() - 0.5).slice(0, 4);
  const targetPinyin = mixedPinyin[Math.floor(Math.random() * mixedPinyin.length)];

  const startPractice = () => {
    setCurrentSection('practice');
    setScore(0);
    setTotalQuestions(0);
    setStartTime(Date.now());
  };

  const handlePinyinSelect = (pinyin: string) => {
    setSelectedPinyin(pinyin);
    setTotalQuestions(prev => prev + 1);
    
    if (pinyin === targetPinyin.text) {
      setScore(prev => prev + 1);
    }

    // 记录互动数据
    learningDataService.recordActivity({
      type: 'pinyin_identification',
      contentId: `pinyin_${targetPinyin.text}`,
      duration: 1,
      success: pinyin === targetPinyin.text,
      metadata: {
        target: targetPinyin.text,
        selected: pinyin
      }
    });

    // 模拟回答后延迟，然后重置选择
    setTimeout(() => {
      setSelectedPinyin(null);
      // 达到10个问题后结束练习
      if (totalQuestions >= 9) {
        setEndTime(Date.now());
        setCurrentSection('result');
        
        // 记录学习完成数据
        learningDataService.recordActivity({
          type: 'pinyin_practice_complete',
          contentId: 'pinyin_paradise_session',
          duration: Math.floor((Date.now() - startTime) / 1000),
          success: score >= 7, // 70% 正确率为成功
          metadata: {
            score,
            totalQuestions: totalQuestions + 1
          }
        });
      }
    }, 1500);
  };

  const playSound = (pinyin: string) => {
    // 这里可以实现播放拼音发音的功能
    console.log(`播放拼音 ${pinyin} 的发音`);
  };

  return (
    <div className={styles.container}>
      <h1>拼音乐园</h1>
      
      {currentSection === 'initial' && (
        <div className={styles.initialScreen}>
          <p className={styles.intro}>欢迎来到拼音乐园！</p>
          <p className={styles.description}>在这里，你将学习汉语拼音的发音和识别。</p>
          <button className={styles.startButton} onClick={startPractice}>
            开始练习
          </button>
        </div>
      )}

      {currentSection === 'practice' && (
        <div className={styles.practiceScreen}>
          <div className={styles.targetArea}>
            <h2>听一听，选一选</h2>
            <button className={styles.soundButton} onClick={() => playSound(targetPinyin.text)}>
              🔊 播放发音
            </button>
          </div>
          
          <div className={styles.optionsGrid}>
            {mixedPinyin.map((pinyin, index) => (
              <div 
                key={index} 
                className={`${styles.pinyinCard} ${
                  selectedPinyin === pinyin.text ? 
                  (pinyin.text === targetPinyin.text ? styles.correct : styles.incorrect) : 
                  styles.selectable
                }`}
                onClick={() => selectedPinyin === null && handlePinyinSelect(pinyin.text)}
              >
                <div className={styles.pinyinText}>{pinyin.text}</div>
                <div className={styles.pinyinImage}>
                  {/* 这里可以放拼音对应的图片，暂时用文字替代 */}
                  {pinyin.text} 图
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.progressInfo}>
            <p>得分: {score} / {totalQuestions}</p>
          </div>
        </div>
      )}

      {currentSection === 'result' && (
        <div className={styles.resultScreen}>
          <h2>练习完成！</h2>
          <div className={styles.resultStats}>
            <p>得分: {score} / {totalQuestions}</p>
            <p>正确率: {Math.round((score / totalQuestions) * 100)}%</p>
            <p>用时: {Math.floor((endTime - startTime) / 1000)} 秒</p>
          </div>
          <button className={styles.playAgainButton} onClick={startPractice}>
            再玩一次
          </button>
        </div>
      )}
    </div>
  );
};

export default PinyinParadise;