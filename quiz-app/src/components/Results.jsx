import React from 'react';
import { Home, CheckCircle, XCircle } from 'lucide-react';

const Results = ({ questions, answers, onHome }) => {
  let correctCount = 0;
  
  questions.forEach(q => {
    if (answers[q.id] === q.answer) {
      correctCount++;
    }
  });

  const percentage = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="card fade-in" style={{ maxWidth: '800px', margin: 'auto', marginTop: '5vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: percentage > 70 ? 'hsl(var(--success))' : 'hsl(var(--primary))' }}>
          {percentage}%
        </h1>
        <p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '1.2rem' }}>
          Siz {questions.length} ta savoldan {correctCount} tasiga to'g'ri javob berdingiz.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <button className="btn btn-primary" onClick={onHome}>
          <Home size={20} /> Bosh sahifaga qaytish
        </button>
      </div>

      <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '0.5rem' }}>
        Batafsil natijalar:
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {questions.map((q, idx) => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.answer;

          return (
            <div key={q.id} className={`result-item ${isCorrect ? 'success-border' : 'error-border'}`}>
              <p style={{ fontWeight: '600', marginBottom: '0.75rem' }}>
                {idx + 1}. {q.question}
              </p>
              
              <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  {isCorrect ? (
                    <CheckCircle size={18} color="hsl(var(--success))" style={{ flexShrink: 0, marginTop: '2px' }} />
                  ) : (
                    <XCircle size={18} color="hsl(var(--destructive))" style={{ flexShrink: 0, marginTop: '2px' }} />
                  )}
                  <span>
                    <span style={{ color: 'hsl(var(--muted-foreground))' }}>Sizning javobingiz: </span>
                    <strong style={{ color: isCorrect ? 'hsl(var(--success))' : 'hsl(var(--destructive))' }}>
                      {userAnswer || 'Javob berilmagan'}
                    </strong>
                  </span>
                </div>
                
                {!isCorrect && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <CheckCircle size={18} color="hsl(var(--success))" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>
                      <span style={{ color: 'hsl(var(--muted-foreground))' }}>To'g'ri javob: </span>
                      <strong style={{ color: 'hsl(var(--success))' }}>{q.answer}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Results;
