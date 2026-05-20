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
    { name: "To'g'ri", value: correctCount, fill: "hsl(var(--success))" },
    { name: "Xato", value: questions.length - correctCount, fill: "hsl(var(--destructive))" }
  ];

  useEffect(() => {
    // Gamification Mock Load
    setStreak(parseInt(localStorage.getItem('quiz_streak') || '1'));
    // Random social standing between 75 and 99
    setSocialPercent(Math.floor(Math.random() * (99 - 75 + 1) + 75));

    if (isSuccess) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

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
          backgroundColor: isSuccess ? 'hsl(var(--success-soft))' : 'hsl(var(--destructive-soft))',
          borderColor: isSuccess ? 'hsl(var(--success))' : 'hsl(var(--destructive))',
        }}>
          <h1 style={{ fontSize: '3rem', color: isSuccess ? 'hsl(var(--success))' : 'hsl(var(--destructive))' }}>
            {isSuccess ? "Muvaffaqiyatli o'tdingiz! 🎉" : "Afsuski, ball yetmadi 😔"}
          </h1>
          <p style={{ color: 'hsl(var(--foreground))', marginTop: '0.5rem', opacity: 0.9 }}>
            Umumiy {questions.length} ta savoldan {correctCount} tasiga to'g'ri javob berdingiz.
          </p>
        </div>

        {/* METRICS BLOCKS */}
        <div className="bento-item bento-metric">
          <Clock size={28} color="hsl(var(--muted-foreground))" />
          <div className="metric-value">{formatTime(totalTime)}</div>
          <div className="metric-label">Umumiy vaqt</div>
        </div>

        <div className="bento-item bento-metric">
          <CheckCircle size={28} color="hsl(var(--success))" />
          <div className="metric-value">{correctCount} / {questions.length}</div>
          <div className="metric-label">To'g'ri javoblar</div>
        </div>

        <div className="bento-item bento-metric">
          <Layers size={28} color="hsl(var(--primary))" />
          <div className="metric-value">{averageTime}s</div>
          <div className="metric-label">O'rtacha tezlik (1 savolga)</div>
        </div>

        {/* DATA VISUALIZATION: DOUGHNUT CHART */}
        <div className="bento-item bento-chart-doughnut">
          <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Umumiy Nisbat</h3>
          <DoughnutChart data={doughnutData} percentage={percentage} />
        </div>

        {/* DATA VISUALIZATION: BAR CHART */}
        <div className="bento-item bento-chart-bar">
          <h3 style={{ marginBottom: '1rem' }}>Fanlar bo'yicha tahlil (%)</h3>
          <BarChart data={barChartData} />
        </div>

        {/* GAMIFICATION & SOCIAL */}
        <div className="bento-item bento-gamification" style={{ justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', flex: 1, borderRight: '1px solid hsl(var(--border))' }}>
            <Flame size={40} color="#ff7a00" style={{ margin: '0 auto', marginBottom: '0.5rem' }} />
            <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{streak} kun</h2>
            <p className="metric-label">Faollik (Streak)</p>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <Trophy size={40} color="#ffb800" style={{ margin: '0 auto', marginBottom: '0.5rem' }} />
            <h2 style={{ fontSize: '1.75rem', margin: 0 }}>Top {100 - socialPercent}%</h2>
            <p className="metric-label">Foydalanuvchilardan yaxshiroq</p>
          </div>
        </div>

        {/* REVIEW ANSWERS */}
        <div className="bento-item bento-review">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h2>Xatolar ustida ishlash</h2>
            <button 
              className={`btn ${showIncorrectOnly ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setShowIncorrectOnly(!showIncorrectOnly)}
              style={{ minHeight: '40px', padding: '0 1rem' }}
            >
              <Filter size={16} /> Faqat xatolarni ko'rsatish
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredQuestions.map((q, idx) => {
              const isCorrect = answers[q.id] === q.answer;
              return (
                <div key={q.id} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="review-header">
                    <p style={{ fontWeight: '600', lineHeight: 1.5 }}>
                      <span style={{ color: 'hsl(var(--muted-foreground))', marginRight: '0.5rem' }}>{q.subject}</span>
                      <br/>
                      {q.question}
                    </p>
                    {isCorrect ? 
                      <CheckCircle size={20} color="hsl(var(--success))" style={{ flexShrink: 0 }} /> : 
                      <XCircle size={20} color="hsl(var(--destructive))" style={{ flexShrink: 0 }} />
                    }
                  </div>
                  
                  <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', display: 'grid', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{ color: 'hsl(var(--muted-foreground))' }}>Sizning javobingiz:</span>
                      <strong style={{ color: isCorrect ? 'hsl(var(--success))' : 'hsl(var(--destructive))' }}>
                        {answers[q.id] || 'Belgilanmagan'}
                      </strong>
                    </div>
                    {!isCorrect && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <span style={{ color: 'hsl(var(--muted-foreground))' }}>To'g'ri javob:</span>
                        <strong style={{ color: 'hsl(var(--success))' }}>{q.answer}</strong>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {filteredQuestions.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'hsl(var(--muted-foreground))' }}>
                Hech qanday xato topilmadi! Ajoyib natija!
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="bento-item bento-actions">
          <button className="btn btn-outline" onClick={handleShare}>
            <Share2 size={20} /> Natijani ulashish
          </button>
          <button className="btn btn-primary" onClick={onHome}>
            {isSuccess ? <Home size={20} /> : <RefreshCw size={20} />}
            {isSuccess ? 'Bosh sahifaga qaytish' : 'Xatolarni qayta topshirish'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Results;
