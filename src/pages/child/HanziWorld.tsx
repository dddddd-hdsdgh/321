import React, { useState } from 'react';
import styles from './styles/HanziWorld.module.css';
import { learningDataService } from '@/services/learningData';

const HanziWorld: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('initial'); // initial, learn, practice, result
  const [currentHanziIndex, setCurrentHanziIndex] = useState(0);
  const [practiceMode, setPracticeMode] = useState<'reading' | 'writing'>('reading');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const hanziData = [
    {
      character: '日',
      pinyin: 'rì',
      meaning: '太阳',
      strokeOrder: ['一', '∣', '∣', '一'],
      image: '/sun.png',
      sound: '/ri.mp3'
    },
    {
      character: '月',
      pinyin: 'yuè',
      meaning: '月亮',
      strokeOrder: ['丿', '𠃌', '一', '一'],
      image: '/moon.png',
      sound: '/yue.mp3'
    },
    {
      character: '水',
      pinyin: 'shuǐ',
      meaning: '水',
      strokeOrder: ['亅', '㇇', 'ノ', '㇏'],
      image: '/water.png',
      sound: '/shui.mp3'
    },
    {
      character: '火',
      pinyin: 'huǒ',
      meaning: '火',
      strokeOrder: ['丶', '丿', '丿', '㇏'],
      image: '/fire.png',
      sound: '/huo.mp3'
    },
    {
      character: '山',
      pinyin: 'shān',
      meaning: '山',
      strokeOrder: ['丨', '㇄', '丨'],
      image: '/mountain.png',
      sound: '/shan.mp3'
    }
  ];

  const currentHanzi = hanziData[currentHanziIndex];

  const startLearning = () => {
    setCurrentSection('learn');
    setCurrentHanziIndex(0);
  };

  const startPractice = (mode: 'reading' | 'writing') => {
    setPracticeMode(mode);
    setCurrentSection('practice');
    setScore(0);
    setTotalQuestions(0);
    setStartTime(Date.now());
    setSelectedAnswer(null);
  };

  const handleAnswer = (answer: string, isCorrect: boolean) => {
    setSelectedAnswer(answer);
    setTotalQuestions(prev => prev + 1);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // 记录互动数据
    learningDataService.recordActivity({
      type: 'hanzi_identification',
      contentId: `hanzi_${currentHanzi.character}`,
      duration: 1,
      success: isCorrect,
      metadata: {
        character: currentHanzi.character,
        mode: practiceMode,
        selected: answer
      }
    });

    // 延迟后切换到下一个汉字或显示结果
    setTimeout(() => {
      if (totalQuestions >= 4) { // 5个汉字都练习完
        setCurrentSection('result');
        
        // 记录学习完成数据
        learningDataService.recordActivity({
          type: 'hanzi_practice_complete',
          contentId: 'hanzi_world_session',
          duration: Math.floor((Date.now() - startTime) / 1000),
          success: score >= 3,
          metadata: {
            score,
            totalQuestions: totalQuestions + 1,
            mode: practiceMode
          }
        });
      } else {
        setCurrentHanziIndex((prev) => (prev + 1) % hanziData.length);
        setSelectedAnswer(null);
      }
    }, 1500);
  };

  const playSound = () => {
    // 播放汉字发音
    console.log(`播放汉字 ${currentHanzi.character} 的发音`);
  };

  const getDistractorOptions = () => {
    const distractors = hanziData
      .filter(h => h.character !== currentHanzi.character)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    const options = [currentHanzi, ...distractors]
      .sort(() => Math.random() - 0.5);
    
    return options;
  };

  return (
    <div className={styles.container}>
      <h1>汉字天地</h1>
      
      {currentSection === 'initial' && (
        <div className={styles.initialScreen}>
          <p className={styles.intro}>欢迎来到汉字天地！</p>
          <p className={styles.description}>在这里，你将认识有趣的汉字，学习它们的写法和含义。</p>
          <div className={styles.modeButtons}>
            <button className={styles.modeButton} onClick={startLearning}>
              学习汉字
            </button>
            <button className={styles.modeButton} onClick={() => startPractice('reading')}>
              识字练习
            </button>
            <button className={styles.modeButton} onClick={() => startPractice('writing')}>
              写字练习
            </button>
          </div>
        </div>
      )}

      {currentSection === 'learn' && (
        <div className={styles.learnScreen}>
          <div className={styles.hanziCard}>
            <div className={styles.hanziCharacter}>{currentHanzi.character}</div>
            <div className={styles.hanziInfo}>
              <p className={styles.pinyin}>{currentHanzi.pinyin}</p>
              <p className={styles.meaning}>{currentHanzi.meaning}</p>
              <button className={styles.soundButton} onClick={playSound}>
                🔊 听发音
              </button>
            </div>
            
            <div className={styles.strokeOrder}>
              <h3>笔顺</h3>
              <div className={styles.strokeDisplay}>
                {currentHanzi.strokeOrder.map((stroke, index) => (
                  <div key={index} className={styles.stroke}>
                    {stroke}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className={styles.navigationButtons}>
            <button 
              className={styles.navButton}
              onClick={() => setCurrentHanziIndex((prev) => (prev - 1 + hanziData.length) % hanziData.length)}
            >
              上一个
            </button>
            <button 
              className={styles.navButton}
              onClick={() => setCurrentHanziIndex((prev) => (prev + 1) % hanziData.length)}
            >
              下一个
            </button>
            <button className={styles.backButton} onClick={() => setCurrentSection('initial')}>
              返回
            </button>
          </div>
        </div>
      )}

      {currentSection === 'practice' && (
        <div className={styles.practiceScreen}>
          <h2>{practiceMode === 'reading' ? '看图片，选汉字' : '看汉字，选意思'}</h2>
          
          <div className={styles.questionArea}>
            {practiceMode === 'reading' ? (
              <div className={styles.imageContainer}>
                {/* 图片占位，实际项目中可以使用真实图片 */}
                <div className={styles.placeholderImage}>{currentHanzi.meaning}图片</div>
              </div>
            ) : (
              <div className={styles.practiceHanzi}>{currentHanzi.character}</div>
            )}
          </div>
          
          <div className={styles.optionsList}>
            {getDistractorOptions().map((option, index) => (
              <button
                key={index}
                className={`${styles.optionButton} ${
                  selectedAnswer && selectedAnswer === option.character ? 
                  (option.character === currentHanzi.character ? styles.correct : styles.incorrect) : 
                  styles.selectable
                }`}
                onClick={() => !selectedAnswer && handleAnswer(
                  option.character, 
                  option.character === currentHanzi.character
                )}
              >
                {practiceMode === 'reading' ? option.character : `${option.character} - ${option.meaning}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentSection === 'result' && (
        <div className={styles.resultScreen}>
          <h2>练习完成！</h2>
          <div className={styles.resultStats}>
            <p>得分: {score} / {totalQuestions}</p>
            <p>正确率: {Math.round((score / totalQuestions) * 100)}%</p>
            <p>练习模式: {practiceMode === 'reading' ? '识字练习' : '写字练习'}</p>
          </div>
          <button className={styles.playAgainButton} onClick={() => setCurrentSection('initial')}>
            返回主页
          </button>
        </div>
      )}
    </div>
  );
};

export default HanziWorld;