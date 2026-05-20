import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DoughnutChart, BarChart } from './Charts';
import { Clock, CheckCircle, XCircle, Flame, Trophy, Home, Share2, Filter, RefreshCw, Layers } from 'lucide-react';

const Results = ({ questions, answers, totalTime, onHome }) => {
  const [showIncorrectOnly, setShowIncorrectOnly] = useState(false);
  const [socialPercent, setSocialPercent] = useState(85);
  const [streak, setStreak] = useState(1);

  // Calculate scores
  let correctCount = 0;
  questions.forEach(q => {
    if (answers[q.id] === q.answer) correctCount++;
  });
  const percentage = Math.round((correctCount / questions.length) * 100);
  const averageTime = questions.length > 0 ? Math.round(totalTime / questions.length) : 0;
  const isSuccess = percentage >= 60; // Assuming 60% is passing

  // Calculate Subject Performance
  const subjectStats = {};
  questions.forEach(q => {
    if (!subjectStats[q.subject]) {
      subjectStats[q.subject] = { total: 0, correct: 0 };
    }
    subjectStats[q.subject].total++;
    if (answers[q.id] === q.answer) {
      subjectStats[q.subject].correct++;
    }
  });

  const barChartData = Object.keys(subjectStats).map(subject => ({
    name: subject.length > 15 ? subject.substring(0, 15) + '...' : subject,
    fullName: subject,
    Togri: Math.round((subjectStats[subject].correct / subjectStats[subject].total) * 100),
    Xato: 100 - Math.round((subjectStats[subject].correct / subjectStats[subject].total) * 100)
  }));

  const doughnutData = [
    { name: "To'g'ri", value: correctCount, fill: "hsl(var(--primary))" }, // shadcn uses primary color for success often, or keep a muted success
    { name: "Xato", value: questions.length - correctCount, fill: "hsl(var(--muted))" } // subtle muted for incorrect
  ];

  useEffect(() => {
    // Gamification Mock Load
    setStreak(parseInt(localStorage.getItem('quiz_streak') || '1'));
    // Random social standing between 75 and 99
    setSocialPercent(Math.floor(Math.random() * (99 - 75 + 1) + 75));

    if (isSuccess) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, colors: ['#ffffff', '#a1a1aa', '#3f3f46'] }; // Monochrome-ish confetti for shadcn vibe

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    }
  }, [isSuccess]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Men Online Testda ${percentage}% natija ko'rsatdim! Sening natijang qanday?`);
    alert("Natija nusxalandi! Do'stlaringizga yuborishingiz mumkin.");
  };

  const filteredQuestions = showIncorrectOnly 
    ? questions.filter(q => answers[q.id] !== q.answer)
    : questions;

  return (
    <div className="fade-in" style={{ paddingBottom: '4rem' }}>
      <div className="bento-grid">
        
        {/* HEADER: F-Pattern Main Block */}
        <div className="bento-item bento-header" style={{
          backgroundColor: 'transparent',
          border: '1px solid hsl(var(--border))',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', color: 'hsl(var(--foreground))', letterSpacing: '-0.05em' }}>
            {isSuccess ? "Muvaffaqiyatli yakunlandi" : "Imtihondan o'ta olmadingiz"}
          </h1>
          <p style={{ color: 'hsl(var(--muted-foreground))', marginTop: '0.75rem', fontSize: '1.1rem' }}>
            Jami {questions.length} ta savoldan {correctCount} tasiga to'g'ri javob berdingiz.
          </p>
        </div>

        {/* METRICS BLOCKS */}
        <div className="bento-item bento-metric">
          <Clock size={20} color="hsl(var(--muted-foreground))" />
          <div>
            <div className="metric-label">Umumiy vaqt</div>
            <div className="metric-value">{formatTime(totalTime)}</div>
          </div>
        </div>

        <div className="bento-item bento-metric">
          <CheckCircle size={20} color="hsl(var(--muted-foreground))" />
          <div>
            <div className="metric-label">To'g'ri javoblar</div>
            <div className="metric-value">{correctCount} <span style={{fontSize: '1rem', color: 'hsl(var(--muted-foreground))', fontWeight: '500'}}>/ {questions.length}</span></div>
          </div>
        </div>

        <div className="bento-item bento-metric">
          <Layers size={20} color="hsl(var(--muted-foreground))" />
          <div>
            <div className="metric-label">O'rtacha tezlik</div>
            <div className="metric-value">{averageTime}s</div>
          </div>
        </div>

        {/* DATA VISUALIZATION: DOUGHNUT CHART */}
        <div className="bento-item bento-chart-doughnut">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '600' }}>Umumiy Nisbat</h3>
          <DoughnutChart data={doughnutData} percentage={percentage} />
        </div>

        {/* DATA VISUALIZATION: BAR CHART */}
        <div className="bento-item bento-chart-bar">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '600' }}>Fanlar bo'yicha tahlil</h3>
          <BarChart data={barChartData} />
        </div>

        {/* REVIEW ANSWERS */}
        <div className="bento-item bento-review" style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Batafsil natijalar</h2>
            <button 
              className={`btn ${showIncorrectOnly ? 'btn-secondary' : 'btn-outline'}`}
              onClick={() => setShowIncorrectOnly(!showIncorrectOnly)}
              style={{ height: '36px', fontSize: '0.875rem' }}
            >
              <Filter size={14} style={{ marginRight: '6px' }} /> 
              {showIncorrectOnly ? 'Barchasini ko\'rsatish' : 'Faqat xatolarni ko\'rsatish'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredQuestions.map((q, idx) => {
              const isCorrect = answers[q.id] === q.answer;
              return (
                <div key={q.id} className="review-item">
                  <div className="review-header">
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className="badge badge-outline">{q.subject}</span>
                        {isCorrect ? 
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(var(--success))', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12}/> To'g'ri</span> : 
                          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'hsl(var(--destructive))', display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={12}/> Xato</span>
                        }
                      </div>
                      <p style={{ fontWeight: '500', fontSize: '0.95rem', color: 'hsl(var(--foreground))', lineHeight: 1.5 }}>
                        {q.question}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ marginTop: '1rem', display: 'grid', gap: '0.5rem', padding: '0.75rem', backgroundColor: 'hsl(var(--muted) / 0.3)', borderRadius: 'calc(var(--radius) - 4px)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem' }}>
                      <span style={{ color: 'hsl(var(--muted-foreground))', minWidth: '100px' }}>Sizning javobingiz:</span>
                      <strong style={{ color: 'hsl(var(--foreground))', fontWeight: '500' }}>
                        {answers[q.id] || 'Belgilanmagan'}
                      </strong>
                    </div>
                    {!isCorrect && (
                      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem' }}>
                        <span style={{ color: 'hsl(var(--muted-foreground))', minWidth: '100px' }}>To'g'ri javob:</span>
                        <strong style={{ color: 'hsl(var(--foreground))', fontWeight: '500' }}>{q.answer}</strong>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {filteredQuestions.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'hsl(var(--muted-foreground))', border: '1px dashed hsl(var(--border))', borderRadius: 'var(--radius)' }}>
                Ko'rsatish uchun ma'lumot yo'q.
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="bento-item bento-actions" style={{ marginTop: '1rem' }}>
          <button className="btn btn-outline" onClick={handleShare}>
            <Share2 size={16} style={{ marginRight: '6px' }} /> Natijani ulashish
          </button>
          <button className="btn btn-primary" onClick={onHome}>
            {isSuccess ? <Home size={16} style={{ marginRight: '6px' }} /> : <RefreshCw size={16} style={{ marginRight: '6px' }} />}
            {isSuccess ? 'Bosh sahifaga' : 'Qayta topshirish'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Results;
