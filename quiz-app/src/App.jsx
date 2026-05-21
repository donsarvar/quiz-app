import React, { useState, useEffect } from 'react';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Results from './components/Results';
import allQuestions from './data/questions.json';
import { Sun, Moon } from 'lucide-react';
import './index.css';

function App() {
  const [theme, setTheme] = useState('dark');
  const [appState, setAppState] = useState('home'); // 'home', 'quiz', 'results'
  const [settings, setSettings] = useState({
    mode: 'practice', 
    questionCount: 30, 
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);

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
    setStartTime(Date.now());
    setAppState('quiz');
  };

  const finishQuiz = (answers) => {
    setUserAnswers(answers);
    const endTime = Date.now();
    const durationInSeconds = Math.floor((endTime - startTime) / 1000);
    setTotalTimeSeconds(durationInSeconds);
    
    // Simple mock update for Gamification "Streak"
    const currentStreak = parseInt(localStorage.getItem('quiz_streak') || '0');
    const lastPlayed = localStorage.getItem('quiz_last_played');
    const today = new Date().toDateString();
    
    if (lastPlayed !== today) {
      localStorage.setItem('quiz_streak', (currentStreak + 1).toString());
      localStorage.setItem('quiz_last_played', today);
    }
    
    setAppState('results');
  };

  const goHome = () => {
    setAppState('home');
    setCurrentQuestions([]);
    setUserAnswers({});
    setTotalTimeSeconds(0);
  };

  return (
    <div className="app-container">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button 
          className="btn btn-outline" 
          style={{ width: '44px', height: '44px', padding: 0, borderRadius: '50%' }} 
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

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
          totalTime={totalTimeSeconds}
          onHome={goHome}
        />
      )}
    </div>
  );
}

export default App;
