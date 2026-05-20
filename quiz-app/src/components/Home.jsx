import React, { useState } from 'react';
import { Play, Settings2, Hash } from 'lucide-react';

const Home = ({ onStart, totalAvailable }) => {
  const [mode, setMode] = useState('practice');
  const [questionCount, setQuestionCount] = useState(30);

  const handleStart = () => {
    onStart({ mode, questionCount });
  };

  return (
    <div className="card fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'hsl(var(--foreground))' }}>Online Test</h1>
      <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '3rem', fontSize: '1.1rem' }}>
        Kompyuterni tashkil etish va boshqa fanlardan testlar ({totalAvailable} ta mavjud)
      </p>

      <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
        <div className="setting-group">
          <label><Settings2 size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }}/> Rejimni tanlang</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="practice">Mashq qilish (Javoblarni darhol ko'rish)</option>
            <option value="exam">Imtihon (Faqat oxirida ko'rish)</option>
          </select>
        </div>

        <div className="setting-group">
          <label><Hash size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }}/> Savollar soni</label>
          <select value={questionCount} onChange={(e) => setQuestionCount(e.target.value)}>
            <option value={10}>10 ta tasodifiy savol</option>
            <option value={30}>30 ta tasodifiy savol</option>
            <option value={50}>50 ta tasodifiy savol</option>
            <option value={100}>100 ta tasodifiy savol</option>
            <option value="all">Barcha {totalAvailable} ta savol</option>
          </select>
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '1rem', height: '54px', fontSize: '1.1rem' }} 
          onClick={handleStart}
        >
          <Play size={20} /> Testni boshlash
        </button>
      </div>
    </div>
  );
};

export default Home;
