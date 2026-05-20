import React, { useState } from 'react';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Results from './components/Results';
import allQuestions from './data/questions.json';
import './index.css';

function App() {
  const [appState, setAppState] = useState('home'); // 'home', 'quiz', 'results'
  const [settings, setSettings] = useState({
    mode: 'practice', // 'practice' or 'exam'
    questionCount: 30, // 10, 30, 50, 'all'
  });
  
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});

  const startQuiz = (newSettings) => {
    setSettings(newSettings);
    
    let selectedQuestions = [...allQuestions];
    
    // Shuffle the entire array
    for (let i = selectedQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selectedQuestions[i], selectedQuestions[j]] = [selectedQuestions[j], selectedQuestions[i]];
    }
    
    if (newSettings.questionCount !== 'all') {
      selectedQuestions = selectedQuestions.slice(0, parseInt(newSettings.questionCount));
    }
    
    setCurrentQuestions(selectedQuestions);
    setUserAnswers({});
    setAppState('quiz');
  };

  const finishQuiz = (answers) => {
    setUserAnswers(answers);
    setAppState('results');
  };

  const goHome = () => {
    setAppState('home');
    setCurrentQuestions([]);
    setUserAnswers({});
  };

  return (
    <div className="app-container">
      {appState === 'home' && (
        <Home 
          onStart={startQuiz} 
          totalAvailable={allQuestions.length} 
        />
      )}
      
      {appState === 'quiz' && (
        <Quiz 
          questions={currentQuestions} 
          settings={settings}
          onFinish={finishQuiz}
          onExit={goHome}
        />
      )}
      
      {appState === 'results' && (
        <Results 
          questions={currentQuestions}
          answers={userAnswers}
          onHome={goHome}
        />
      )}
    </div>
  );
}

export default App;
