import React, { useState } from 'react';
import styles from './styles/SentenceGarden.module.css';
import { learningDataService } from '@/services/learningData';

const SentenceGarden: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('initial'); // initial, listen, rearrange, result
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userSentence, setUserSentence] = useState<string[]>([]);
  const [wordsPool, setWordsPool] = useState<string[]>([]);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const sentenceData = [
    {
      sentence: '我爱吃苹果',
      splitWords: ['我', '爱', '吃', '苹果'],
      image: '/sentence1.png',
      sound: '/sentence1.mp3',
      hint: '表达喜欢吃某种水果'
    },
    {
      sentence: '小猫在睡觉',
      splitWords: ['小', '猫', '在', '睡觉'],
      image: '/sentence2.png',
      sound: '/sentence2.mp3',
      hint: '描述小动物的状态'
    },
    {
      sentence: '妈妈在做饭',
      splitWords: ['妈', '妈', '在', '做饭'],
      image: '/sentence3.png',
      sound: '/sentence3.mp3',
      hint: '描述家人的活动'
    }
  ];

  const listenAndRepeat = () => {
    setCurrentSection('listen');
    setScore(0);
    setTotalQuestions(0);
    setStartTime(Date.now());
    setCurrentSentenceIndex(0);
  };

  const startRearranging = () => {
    setCurrentSection('rearrange');
    setScore(0);
    setTotalQuestions(0);
    setStartTime(Date.now());
    setCurrentSentenceIndex(0);
    initRearrangingGame();
  };

  const initRearrangingGame = () => {
    const current = sentenceData[currentSentenceIndex];
    // 创建打乱的词语池（包括原句词语和一些干扰项）
    const distractorWords = ['你', '他', '看', '玩', '跑', '走'];
    const allWords = [...current.splitWords, ...distractorWords]
      .sort(() => Math.random() - 0.5)
      .slice(0, current.splitWords.length + 2); // 比原句多2个干扰词
    
    setWordsPool(allWords);
    setUserSentence([]);
    setAnswerSubmitted(false);
  };

  const playSentenceSound = () => {
    const current = sentenceData[currentSentenceIndex];
    console.log(`播放句子 ${current.sentence} 的发音`);
    
    // 记录互动数据
    learningDataService.recordActivity({
      type: 'sentence_listen',
      contentId: `sentence_${currentSentenceIndex}`,
      duration: 1,
      success: true,
      metadata: {
        sentence: current.sentence
      }
    });
  };

  const handleListenComplete = () => {
    setScore(prev => prev + 1);
    setTotalQuestions(prev => prev + 1);
    
    // 记录互动数据
    learningDataService.recordActivity({
      type: 'sentence_repeat',
      contentId: `sentence_${currentSentenceIndex}`,
      duration: 1,
      success: true,
      metadata: {
        sentence: sentenceData[currentSentenceIndex].sentence
      }
    });
    
    // 延迟后切换到下一句或显示结果
    setTimeout(() => {
      if (currentSentenceIndex >= sentenceData.length - 1) {
        setCurrentSection('result');
        
        // 记录学习完成数据
        learningDataService.recordActivity({
          type: 'sentence_practice_complete',
          contentId: 'sentence_garden_session',
          duration: Math.floor((Date.now() - startTime) / 1000),
          success: score >= 2,
          metadata: {
            score,
            totalQuestions: totalQuestions + 1,
            mode: 'listen'
          }
        });
      } else {
        setCurrentSentenceIndex(prev => prev + 1);
      }
    }, 1000);
  };

  const handleWordSelect = (word: string) => {
    if (!answerSubmitted) {
      setUserSentence(prev => [...prev, word]);
      setWordsPool(prev => prev.filter(w => w !== word));
    }
  };

  const handleWordRemove = (index: number) => {
    if (!answerSubmitted) {
      const wordToRemove = userSentence[index];
      setUserSentence(prev => prev.filter((_, i) => i !== index));
      setWordsPool(prev => [...prev, wordToRemove]);
    }
  };

  const handleRearrangeSubmit = () => {
    const current = sentenceData[currentSentenceIndex];
    const isCorrect = userSentence.join('') === current.sentence;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setTotalQuestions(prev => prev + 1);
    setAnswerSubmitted(true);
    
    // 记录互动数据
    learningDataService.recordActivity({
      type: 'sentence_rearrange',
      contentId: `sentence_${currentSentenceIndex}`,
      duration: 1,
      success: isCorrect,
      metadata: {
        sentence: current.sentence,
        userAnswer: userSentence.join('')
      }
    });
    
    // 延迟后切换到下一题或显示结果
    setTimeout(() => {
      if (currentSentenceIndex >= sentenceData.length - 1) {
        setCurrentSection('result');
        
        // 记录学习完成数据
        learningDataService.recordActivity({
          type: 'sentence_practice_complete',
          contentId: 'sentence_garden_session',
          duration: Math.floor((Date.now() - startTime) / 1000),
          success: score >= 2,
          metadata: {
            score,
            totalQuestions: totalQuestions + 1,
            mode: 'rearrange'
          }
        });
      } else {
        setCurrentSentenceIndex(prev => prev + 1);
        initRearrangingGame();
      }
    }, 2000);
  };

  const currentSentence = sentenceData[currentSentenceIndex];
  const userSentenceString = userSentence.join('');
  const isSentenceCorrect = answerSubmitted && userSentenceString === currentSentence.sentence;

  return (
    <div className={styles.container}>
      <h1>短句园地</h1>
      
      {currentSection === 'initial' && (
        <div className={styles.initialScreen}>
          <p className={styles.intro}>欢迎来到短句园地！</p>
          <p className={styles.description}>在这里，你将学习简单的句子，玩句子排列游戏！</p>
          <div className={styles.modeButtons}>
            <button className={styles.modeButton} onClick={listenAndRepeat}>
              听听说说
            </button>
            <button className={styles.modeButton} onClick={startRearranging}>
              句子排列
            </button>
          </div>
        </div>
      )}

      {currentSection === 'listen' && (
        <div className={styles.listenScreen}>
          <h2>听听说说</h2>
          
          <div className={styles.listenHeader}>
            <span className={styles.progressText}>
              句子 {currentSentenceIndex + 1} / {sentenceData.length}
            </span>
          </div>
          
          <div className={styles.sentenceCard}>
            <div className={styles.sentenceText}>{currentSentence.sentence}</div>
            
            <div className={styles.sentenceImage}>
              {/* 图片占位 */}
              <div className={styles.placeholderImage}>{currentSentence.hint}</div>
            </div>
            
            <button className={styles.soundButton} onClick={playSentenceSound}>
              🔊 听句子
            </button>
          </div>
          
          <div className={styles.listenActions}>
            <button className={styles.completeButton} onClick={handleListenComplete}>
              我会读了！
            </button>
          </div>
        </div>
      )}

      {currentSection === 'rearrange' && (
        <div className={styles.rearrangeScreen}>
          <h2>句子排列</h2>
          
          <div className={styles.rearrangeHeader}>
            <span className={styles.progressText}>
              题目 {currentSentenceIndex + 1} / {sentenceData.length}
            </span>
            <span className={styles.hintText}>提示: {currentSentence.hint}</span>
          </div>
          
          <div className={styles.userSentenceContainer}>
            <h3>你的句子</h3>
            <div className={styles.userSentence}>
              {userSentence.length === 0 ? (
                <div className={styles.emptySentence}>请从下方选择词语组成句子</div>
              ) : (
                userSentence.map((word, index) => (
                  <div 
                    key={index} 
                    className={`${styles.sentenceWord} ${answerSubmitted && !isSentenceCorrect ? styles.incorrectWord : ''}`}
                  >
                    {word}
                    {!answerSubmitted && (
                      <button 
                        className={styles.removeButton} 
                        onClick={() => handleWordRemove(index)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
            
            {answerSubmitted && isSentenceCorrect && (
              <div className={styles.correctMessage}>✓ 正确！</div>
            )}
            
            {answerSubmitted && !isSentenceCorrect && (
              <div className={styles.correctAnswer}>
                正确句子: {currentSentence.sentence}
              </div>
            )}
          </div>
          
          <div className={styles.wordsPoolContainer}>
            <h3>词语池</h3>
            <div className={styles.wordsPool}>
              {wordsPool.map((word, index) => (
                <button
                  key={index}
                  className={`${styles.wordButton} ${!answerSubmitted ? styles.selectable : ''}`}
                  onClick={() => !answerSubmitted && handleWordSelect(word)}
                  disabled={answerSubmitted}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
          
          {!answerSubmitted && userSentence.length === currentSentence.splitWords.length && (
            <button className={styles.submitButton} onClick={handleRearrangeSubmit}>
              提交句子
            </button>
          )}
        </div>
      )}

      {currentSection === 'result' && (
        <div className={styles.resultScreen}>
          <h2>练习完成！</h2>
          <div className={styles.resultStats}>
            <p>得分: {score} / {totalQuestions}</p>
            <p>正确率: {Math.round((score / totalQuestions) * 100)}%</p>
          </div>
          <button className={styles.playAgainButton} onClick={() => setCurrentSection('initial')}>
            返回主页
          </button>
        </div>
      )}
    </div>
  );
};

export default SentenceGarden;