import React, { useState } from 'react';
import styles from './styles/HanziStory.module.css';

const HanziStory: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [dragging, setDragging] = useState<number | null>(null);
  
  const hanziStory = {
    character: '日',
    meaning: '太阳',
    steps: [
      {
        title: '甲骨文的日',
        description: '古代人画了一个圆圈，表示太阳',
        image: '/oracle-day.jpg'
      },
      {
        title: '金文的日',
        description: '圆圈里加了一点，表示太阳的光芒',
        image: '/bronze-day.jpg'
      },
      {
        title: '楷书的日',
        description: '现在我们写的"日"字',
        image: '/regular-day.jpg'
      }
    ],
    strokes: [
      { id: 1, name: '竖', position: { x: 50, y: 20 } },
      { id: 2, name: '横折', position: { x: 70, y: 20 } },
      { id: 3, name: '横', position: { x: 60, y: 40 } },
      { id: 4, name: '横', position: { x: 60, y: 60 } }
    ]
  };
  
  const handleDragStart = (strokeId: number) => {
    setDragging(strokeId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (targetId: number) => {
    if (dragging === targetId) {
      alert(`太棒了！你放对了"${hanziStory.strokes[targetId - 1].name}"！`);
    } else {
      alert('再试试看吧！');
    }
    setDragging(null);
  };
  
  const nextStep = () => {
    if (currentStep < hanziStory.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>汉字成长记：{hanziStory.character}</h1>
      
      <div className={styles.storyContainer}>
        <div className={styles.storyStep}>
          <h2 className={styles.stepTitle}>{hanziStory.steps[currentStep].title}</h2>
          <div className={styles.storyImage}>
            {hanziStory.steps[currentStep].image && (
              <img src={hanziStory.steps[currentStep].image} alt={hanziStory.steps[currentStep].title} />
            )}
            {!hanziStory.steps[currentStep].image && (
              <div className={styles.imagePlaceholder}>{hanziStory.character}</div>
            )}
          </div>
          <p className={styles.stepDescription}>{hanziStory.steps[currentStep].description}</p>
        </div>
        
        <div className={styles.stepNavigation}>
          <button 
            className={styles.stepButton} 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            上一步
          </button>
          <span className={styles.stepIndicator}>{currentStep + 1} / {hanziStory.steps.length}</span>
          <button 
            className={styles.stepButton} 
            onClick={nextStep}
            disabled={currentStep === hanziStory.steps.length - 1}
          >
            下一步
          </button>
        </div>
      </div>
      
      <div className={styles.interactionSection}>
        <h2 className={styles.sectionTitle}>笔画拼图</h2>
        <div className={styles.strokePuzzle}>
          <div className={styles.strokeArea}>
            {hanziStory.strokes.map(stroke => (
              <div 
                key={stroke.id}
                className={styles.strokeTarget}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(stroke.id)}
              >
                <span className={styles.strokeNumber}>{stroke.id}</span>
              </div>
            ))}
          </div>
          <div className={styles.strokeOptions}>
            {hanziStory.strokes.map(stroke => (
              <div 
                key={stroke.id}
                className={styles.strokeOption}
                draggable
                onDragStart={() => handleDragStart(stroke.id)}
              >
                {stroke.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <button 
        className={styles.homeButton} 
        onClick={() => window.location.href = '/child'}
      >
        返回首页
      </button>
    </div>
  );
};

export default HanziStory;