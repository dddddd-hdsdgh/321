import React, { useState } from 'react';
import styles from './styles/WordPark.module.css';
import { learningDataService } from '@/services/learningData';

const WordPark: React.FC = () => {
  const [currentSection, setCurrentSection] = useState('initial'); // initial, matching, fillBlank, result
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const wordData = [
    { word: '苹果', meaning: '水果', image: '/apple.png', sound: '/pingguo.mp3' },
    { word: '飞机', meaning: '交通工具', image: '/plane.png', sound: '/feiji.mp3' },
    { word: '小猫', meaning: '动物', image: '/cat.png', sound: '/xiaomao.mp3' },
    { word: '学校', meaning: '场所', image: '/school.png', sound: '/xuexiao.mp3' },
    { word: '书本', meaning: '学习用品', image: '/book.png', sound: '/shuben.mp3' },
  ];

  const fillBlankQuestions = [
    {
      sentence: '我喜欢吃______。',
      correctAnswer: '苹果',
      options: ['苹果', '飞机', '小猫']
    },
    {
      sentence: '______在天上飞。',
      correctAnswer: '飞机',
      options: ['飞机', '小猫', '书本']
    },
    {
      sentence: '______有很多小朋友。',
      correctAnswer: '学校',
      options: ['学校', '苹果', '小猫']
    }
  ];

  const startWordMatching = () => {
    setCurrentSection('matching');
    setScore(0);
    setTotalQuestions(0);
    setStartTime(Date.now());
    setMatchedPairs(new Set());
    setSelectedWord(null);
    setSelectedImage(null);
  };

  const startFillBlank = () => {
    setCurrentSection('fillBlank');
    setScore(0);
    setTotalQuestions(0);
    setStartTime(Date.now());
    setCurrentQuestion(0);
    setUserAnswer('');
    setAnswerSubmitted(false);
  };

  const handleWordSelect = (index: number) => {
    if (selectedImage !== null) {
      // 如果已经选了图片，就进行配对
      if (index === selectedImage) {
        // 配对成功
        setScore(prev => prev + 1);
        setTotalQuestions(prev => prev + 1);
        setMatchedPairs(prev => new Set(prev).add(index));
        
        // 记录互动数据
        learningDataService.recordActivity({
          type: 'word_matching',
          contentId: `word_${wordData[index].word}`,
          duration: 1,
          success: true,
          metadata: {
            word: wordData[index].word,
            correct: true
          }
        });
      } else {
        // 配对失败
        setTotalQuestions(prev => prev + 1);
        
        // 记录互动数据
        learningDataService.recordActivity({
          type: 'word_matching',
          contentId: `word_${wordData[index].word}`,
          duration: 1,
          success: false,
          metadata: {
            word: wordData[index].word,
            correct: false
          }
        });
      }
      
      // 重置选择，延迟后显示
      setTimeout(() => {
        setSelectedWord(null);
        setSelectedImage(null);
        
        // 检查是否所有配对都完成了
        if (matchedPairs.size >= 4) {
          setCurrentSection('result');
          
          // 记录学习完成数据
          learningDataService.recordActivity({
            type: 'word_practice_complete',
            contentId: 'word_park_session',
            duration: Math.floor((Date.now() - startTime) / 1000),
            success: score >= 3,
            metadata: {
              score,
              totalQuestions: totalQuestions + 1,
              mode: 'matching'
            }
          });
        }
      }, 1000);
    } else {
      // 如果没选图片，就选择词语
      setSelectedWord(index);
    }
  };

  const handleImageSelect = (index: number) => {
    if (selectedWord !== null) {
      // 如果已经选了词语，就进行配对
      if (index === selectedWord) {
        // 配对成功
        setScore(prev => prev + 1);
        setTotalQuestions(prev => prev + 1);
        setMatchedPairs(prev => new Set(prev).add(index));
        
        // 记录互动数据
        learningDataService.recordActivity({
          type: 'word_matching',
          contentId: `word_${wordData[index].word}`,
          duration: 1,
          success: true,
          metadata: {
            word: wordData[index].word,
            correct: true
          }
        });
      } else {
        // 配对失败
        setTotalQuestions(prev => prev + 1);
        
        // 记录互动数据
        learningDataService.recordActivity({
          type: 'word_matching',
          contentId: `word_${wordData[index].word}`,
          duration: 1,
          success: false,
          metadata: {
            word: wordData[index].word,
            correct: false
          }
        });
      }
      
      // 重置选择，延迟后显示
      setTimeout(() => {
        setSelectedWord(null);
        setSelectedImage(null);
        
        // 检查是否所有配对都完成了
        if (matchedPairs.size >= 4) {
          setCurrentSection('result');
          
          // 记录学习完成数据
          learningDataService.recordActivity({
            type: 'word_practice_complete',
            contentId: 'word_park_session',
            duration: Math.floor((Date.now() - startTime) / 1000),
            success: score >= 3,
            metadata: {
              score,
              totalQuestions: totalQuestions + 1,
              mode: 'matching'
            }
          });
        }
      }, 1000);
    } else {
      // 如果没选词语，就选择图片
      setSelectedImage(index);
    }
  };

  const handleFillBlankSubmit = () => {
    const isCorrect = userAnswer === fillBlankQuestions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setTotalQuestions(prev => prev + 1);
    setAnswerSubmitted(true);
    
    // 记录互动数据
    learningDataService.recordActivity({
      type: 'fill_blank',
      contentId: `sentence_${currentQuestion}`,
      duration: 1,
      success: isCorrect,
      metadata: {
        sentence: fillBlankQuestions[currentQuestion].sentence,
        correctAnswer: fillBlankQuestions[currentQuestion].correctAnswer,
        userAnswer
      }
    });
    
    // 延迟后切换到下一题或显示结果
    setTimeout(() => {
      if (currentQuestion >= fillBlankQuestions.length - 1) {
        setCurrentSection('result');
        
        // 记录学习完成数据
        learningDataService.recordActivity({
          type: 'word_practice_complete',
          contentId: 'word_park_session',
          duration: Math.floor((Date.now() - startTime) / 1000),
          success: score >= 2,
          metadata: {
            score,
            totalQuestions: totalQuestions + 1,
            mode: 'fillBlank'
          }
        });
      } else {
        setCurrentQuestion(prev => prev + 1);
        setUserAnswer('');
        setAnswerSubmitted(false);
      }
    }, 2000);
  };

  const playWordSound = (word: string) => {
    console.log(`播放词语 ${word} 的发音`);
  };

  const getCurrentSentence = () => {
    const question = fillBlankQuestions[currentQuestion];
    if (answerSubmitted) {
      return question.sentence.replace('______', 
        userAnswer === question.correctAnswer ? 
        `<span class="${styles.correct}">${userAnswer}</span>` : 
        `<span class="${styles.incorrect}">${userAnswer}</span> <span class="${styles.correct}">(${question.correctAnswer})</span>`
      );
    }
    return question.sentence;
  };

  return (
    <div className={styles.container}>
      <h1>词语乐园</h1>
      
      {currentSection === 'initial' && (
        <div className={styles.initialScreen}>
          <p className={styles.intro}>欢迎来到词语乐园！</p>
          <p className={styles.description}>在这里，你将学习有趣的词语，玩好玩的配对游戏！</p>
          <div className={styles.modeButtons}>
            <button className={styles.modeButton} onClick={startWordMatching}>
              词语配对
            </button>
            <button className={styles.modeButton} onClick={startFillBlank}>
              选词填空
            </button>
          </div>
        </div>
      )}

      {currentSection === 'matching' && (
        <div className={styles.matchingScreen}>
          <h2>词语配对游戏</h2>
          <p className={styles.matchInstruction}>将词语与对应的图片连起来！</p>
          
          <div className={styles.matchingContainer}>
            {/* 词语部分 */}
            <div className={styles.wordSection}>
              <h3>词语</h3>
              <div className={styles.wordsGrid}>
                {wordData.map((item, index) => (
                  <div
                    key={index}
                    className={`${styles.wordCard} ${matchedPairs.has(index) ? styles.matched : ''} ${selectedWord === index ? styles.selected : ''}`}
                    onClick={() => !matchedPairs.has(index) && handleWordSelect(index)}
                  >
                    <div className={styles.wordText}>{item.word}</div>
                    <button 
                      className={styles.soundButton} 
                      onClick={(e) => { e.stopPropagation(); playWordSound(item.word); }}
                    >
                      🔊
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 图片部分 */}
            <div className={styles.imageSection}>
              <h3>图片</h3>
              <div className={styles.imagesGrid}>
                {wordData.map((item, index) => (
                  <div
                    key={index}
                    className={`${styles.imageCard} ${matchedPairs.has(index) ? styles.matched : ''} ${selectedImage === index ? styles.selected : ''}`}
                    onClick={() => !matchedPairs.has(index) && handleImageSelect(index)}
                  >
                    {/* 图片占位 */}
                    <div className={styles.placeholderImage}>{item.word}图片</div>
                    <div className={styles.imageLabel}>{item.meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className={styles.progressInfo}>
            <p>得分: {score} / {totalQuestions}</p>
            <p>已匹配: {matchedPairs.size} / 5</p>
          </div>
        </div>
      )}

      {currentSection === 'fillBlank' && (
        <div className={styles.fillBlankScreen}>
          <h2>选词填空</h2>
          <p className={styles.fillInstruction}>选择正确的词语填空！</p>
          
          <div className={styles.questionNumber}>
            问题 {currentQuestion + 1} / {fillBlankQuestions.length}
          </div>
          
          <div className={styles.sentenceContainer}>
            <div 
              className={styles.sentence}
              dangerouslySetInnerHTML={{ __html: getCurrentSentence() }}
            />
          </div>
          
          {!answerSubmitted && (
            <div className={styles.optionsContainer}>
              {fillBlankQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`${styles.optionButton} ${userAnswer === option ? styles.selectedOption : ''}`}
                  onClick={() => setUserAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          
          {!answerSubmitted && userAnswer && (
            <button className={styles.submitButton} onClick={handleFillBlankSubmit}>
              提交答案
            </button>
          )}
        </div>
      )}

      {currentSection === 'result' && (
        <div className={styles.resultScreen}>
          <h2>游戏完成！</h2>
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

export default WordPark;