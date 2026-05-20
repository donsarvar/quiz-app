import React, { useState } from 'react';
import { BookOpen, Play, Settings2 } from 'lucide-react';

const Home = ({ onStart, totalAvailable }) => {
  const [mode, setMode] = useState('practice');
  const [questionCount, setQuestionCount] = useState('30');

  const handleStart = () => {
    onStart({ mode, questionCount });
  };

  return (
    <div className="card fade-in" style={{ maxWidth: '500px', margin: 'auto', marginTop: '10vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          width: '64px', 
          height: '64px', 
          borderRadius: '50%', 
          backgroundColor: 'hsla(var(--primary) / 0.1)',
          color: 'hsl(var(--primary))',
          marginBottom: '1rem'
        }}>
          <BookOpen size={32} />
        </div>
        <h1>Online Test</h1>
        <p style={{ color: 'hsl(var(--muted-foreground))' }}>
          Kompyuterni tashkil etish fanidan testlar ({totalAvailable} ta mavjud)
        </p>
      </div>

      <div className="setting-group">
        <label><Settings2 size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }}/> Rejimni tanlang</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="practice">Mashq qilish (Javoblarni darhol ko'rish)</option>
          <option value="exam">Imtihon (Natijani oxirida ko'rish)</option>
        </select>
      </div>

      <div className="setting-group">
        <label><Settings2 size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }}/> Savollar soni</label>
        <select value={questionCount} onChange={(e) => setQuestionCount(e.target.value)}>
          <option value="10">10 ta tasodifiy savol</option>
          <option value="30">30 ta tasodifiy savol</option>
          <option value="50">50 ta tasodifiy savol</option>
          <option value="100">100 ta tasodifiy savol</option>
          <option value="all">Barcha {totalAvailable} ta savol</option>
        </select>
      </div>

      <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handleStart}>
        <Play size={20} /> Testni boshlash
      </button>
    </div>
  );
};

export default Home;
