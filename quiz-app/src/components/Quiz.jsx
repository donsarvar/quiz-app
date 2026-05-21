import React, { useState, useEffect } from 'react';
import { ChevronRight, Flag, LogOut } from 'lucide-react';

const Quiz = ({ questions, settings, onFinish, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const question = questions[currentIndex];
  const isPractice = settings.mode === 'practice';
  
  useEffect(() => {
    // Basic timer logic
    const timer = setInterval(() => {
      setTimeLeft(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (option) => {
    if (showAnswer && isPractice) return; // Prevent changing answer in practice mode once shown
    
    setAnswers(prev => ({ ...prev, [question.id]: option }));
    
    if (isPractice) {
      setShowAnswer(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      onFinish(answers);
    }
  };

  const getOptionClass = (option) => {
    const isSelected = answers[question.id] === option;
    
    if (isPractice && showAnswer) {
      if (option === question.answer) return 'option-btn correct';
      if (isSelected) return 'option-btn incorrect';
    }
    
    return isSelected ? 'option-btn selected' : 'option-btn';
  };

  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="card fade-in" style={{ maxWidth: '700px', margin: 'auto', marginTop: '5vh' }}>
      <div className="header">
        <div>
          <span className="badge">Savol {currentIndex + 1} / {questions.length}</span>
          <span className="badge" style={{ marginLeft: '0.5rem', backgroundColor: 'transparent', border: '1px solid hsl(var(--border))' }}>
            Vaqt: {formatTime(timeLeft)}
          </span>
        </div>
        <button onClick={onExit} className="btn btn-outline" style={{ padding: '0.5rem', border: 'none' }}>
          <LogOut size={20} color="hsl(var(--destructive))" />
        </button>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', lineHeight: '1.6' }}>
        {question.question}
      </h2>

      <div style={{ marginBottom: '2rem' }}>
        {question.options.map((option, idx) => (
          <button
            key={idx}
            className={getOptionClass(option)}
            onClick={() => handleSelectOption(option)}
            disabled={isPractice && showAnswer}
          >
            <span style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              minWidth: '28px',
              flexShrink: 0,
              borderRadius: '50%',
              backgroundColor: 'hsla(var(--foreground) / 0.1)',
              marginRight: '1rem',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}>
              {String.fromCharCode(65 + idx)}
            </span>
            {option}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleNext}
          disabled={!answers[question.id] && isPractice && !showAnswer}
        >
          {currentIndex === questions.length - 1 ? 'Yakunlash' : 'Keyingisi'} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Quiz;
