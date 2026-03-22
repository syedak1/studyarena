'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getSocket, disconnectSocket } from '../../../lib/socket';

interface QuestionData {
  questionId: string;
  questionText: string;
  options: string[];
  orderIndex: number;
  totalQuestions: number;
  timeLimit: number;
}

interface ScoreEntry {
  playerId: string;
  playerName: string;
  score: number;
  delta: number;
  rank?: number;
  correctAnswers?: number;
}

type Phase = 'waiting' | 'question' | 'result' | 'gameover';

export default function GamePage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const [phase, setPhase] = useState<Phase>('waiting');
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [finalScores, setFinalScores] = useState<ScoreEntry[]>([]);
  const [winnerId, setWinnerId] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    setName(localStorage.getItem('studentName') || 'Player');
    setUserId(localStorage.getItem('userId') || '');
  }, []);

  useEffect(() => {
    const socket = getSocket();

    // If not connected (e.g. page refresh), reconnect
    if (!socket.connected) {
      socket.connect();
      const token = localStorage.getItem('token');
      if (token) {
        socket.emit('join-room', { roomId, token });
      }
    }

    socket.on('question', (data: QuestionData) => {
      setQuestion(data);
      setSelectedAnswer(null);
      setCorrectIndex(null);
      setTimeLeft(data.timeLimit);
      setPhase('question');
    });

    socket.on('round-result', (data: { correctIndex: number; scores: ScoreEntry[] }) => {
      setCorrectIndex(data.correctIndex);
      setScores(data.scores);
      setPhase('result');
    });

    socket.on('game-over', (data: { finalScores: ScoreEntry[]; winnerId: string }) => {
      setFinalScores(data.finalScores);
      setWinnerId(data.winnerId);
      setPhase('gameover');
    });

    return () => {
      socket.off('question');
      socket.off('round-result');
      socket.off('game-over');
    };
  }, [roomId]);

  // Countdown timer
  useEffect(() => {
    if (phase !== 'question' || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, timeLeft]);

  const submitAnswer = useCallback((index: number) => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(index);
    const socket = getSocket();
    socket.emit('submit-answer', {
      roomId,
      questionId: question?.questionId,
      answerIndex: index,
    });
  }, [selectedAnswer, roomId, question]);

  function handlePlayAgain() {
    disconnectSocket();
    router.push('/dashboard');
  }

  const myScore = scores.find(s => s.playerId === userId) || finalScores.find(s => s.playerId === userId);

  // ─── WAITING ───
  if (phase === 'waiting') {
    return (
      <Shell>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>⏳</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#00274C', marginBottom: 8 }}>Get ready!</div>
          <div style={{ fontSize: 14, color: '#8a8880' }}>The first question is coming...</div>
        </div>
      </Shell>
    );
  }

  // ─── GAME OVER ───
  if (phase === 'gameover') {
    const isWinner = winnerId === userId;
    return (
      <Shell>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{isWinner ? '🏆' : '🎮'}</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#00274C', marginBottom: 4 }}>
            {isWinner ? 'You won!' : 'Game Over!'}
          </div>
          <div style={{ fontSize: 14, color: '#8a8880' }}>
            {isWinner ? 'Congratulations!' : `Winner: ${finalScores[0]?.playerName || 'N/A'}`}
          </div>
        </div>

        <div style={{ width: '100%', marginBottom: 24 }}>
          {finalScores.map((s, i) => (
            <div key={s.playerId} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', marginBottom: 6, borderRadius: 10,
              background: i === 0 ? 'rgba(255,203,5,0.15)' : s.playerId === userId ? 'rgba(0,39,76,0.06)' : '#f5f4f0',
              border: i === 0 ? '2px solid #FFCB05' : '1px solid rgba(0,0,0,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: i === 0 ? '#00274C' : '#8a8880', fontFamily: 'monospace', width: 28 }}>#{s.rank}</div>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: i === 0 ? '#FFCB05' : '#00274C', color: i === 0 ? '#00274C' : '#FFCB05', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>
                  {s.playerName[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1916' }}>
                    {s.playerName}
                    {s.playerId === userId && <span style={{ marginLeft: 6, fontSize: 10, background: '#FFCB05', color: '#00274C', padding: '1px 6px', borderRadius: 4, fontFamily: 'monospace', fontWeight: 800 }}>YOU</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#8a8880', fontFamily: 'monospace' }}>
                    {s.correctAnswers ?? 0} correct
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#00274C', fontFamily: 'monospace' }}>{s.score}</div>
            </div>
          ))}
        </div>

        <button onClick={handlePlayAgain} style={{ width: '100%', padding: '0.85rem', background: '#00274C', border: 'none', color: '#FFCB05', fontFamily: 'monospace', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 8 }}>
          Back to Dashboard →
        </button>
      </Shell>
    );
  }

  // ─── QUESTION / RESULT ───
  return (
    <Shell>
      {/* Progress bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#8a8880', letterSpacing: '0.06em' }}>
          QUESTION {(question?.orderIndex ?? 0) + 1} / {question?.totalQuestions}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {phase === 'question' && (
            <div style={{ fontSize: 20, fontWeight: 900, fontFamily: 'monospace', color: timeLeft <= 5 ? '#c0392b' : '#00274C' }}>
              {timeLeft}s
            </div>
          )}
          {phase === 'result' && myScore && (
            <div style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 800, color: '#00274C' }}>
              Score: {myScore.score}
            </div>
          )}
        </div>
      </div>

      {/* Timer bar */}
      {phase === 'question' && (
        <div style={{ width: '100%', height: 4, background: 'rgba(0,39,76,0.1)', borderRadius: 4, marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: timeLeft <= 5 ? '#c0392b' : '#00274C', borderRadius: 4, transition: 'width 1s linear', width: `${(timeLeft / (question?.timeLimit || 20)) * 100}%` }} />
        </div>
      )}

      {/* Question text */}
      <div style={{ fontSize: 18, fontWeight: 700, color: '#00274C', lineHeight: 1.5, marginBottom: 24, textAlign: 'left' }}>
        {question?.questionText}
      </div>

      {/* Answer options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {question?.options.map((opt, i) => {
          const isSelected = selectedAnswer === i;
          const isCorrect = correctIndex === i;
          const isWrong = phase === 'result' && isSelected && correctIndex !== i;

          let bg = '#f5f4f0';
          let border = '2px solid rgba(0,0,0,0.08)';
          let color = '#1a1916';

          if (phase === 'result') {
            if (isCorrect) { bg = 'rgba(5,150,105,0.15)'; border = '2px solid #059669'; color = '#065f46'; }
            else if (isWrong) { bg = 'rgba(192,57,43,0.1)'; border = '2px solid #c0392b'; color = '#7f1d1d'; }
          } else if (isSelected) {
            bg = 'rgba(0,39,76,0.1)'; border = '2px solid #00274C'; color = '#00274C';
          }

          return (
            <button
              key={i}
              onClick={() => phase === 'question' && submitAnswer(i)}
              disabled={phase !== 'question' || selectedAnswer !== null}
              style={{
                padding: '16px 14px', borderRadius: 10,
                background: bg, border, color,
                fontSize: 14, fontWeight: 600,
                textAlign: 'left', cursor: phase === 'question' && selectedAnswer === null ? 'pointer' : 'default',
                transition: 'all 0.15s', lineHeight: 1.4,
              }}
            >
              <span style={{ fontFamily: 'monospace', fontWeight: 800, marginRight: 8, opacity: 0.5 }}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Round result scores */}
      {phase === 'result' && scores.length > 0 && (
        <div style={{ width: '100%', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 16 }}>
          <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8a8880', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Round scores</div>
          {scores.map(s => (
            <div key={s.playerId} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
              <span style={{ color: '#2a2926', fontWeight: s.playerId === userId ? 700 : 400 }}>
                {s.playerName} {s.playerId === userId ? '(you)' : ''}
              </span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: s.delta > 0 ? '#059669' : '#8a8880' }}>
                {s.score} {s.delta > 0 ? `(+${s.delta})` : ''}
              </span>
            </div>
          ))}
        </div>
      )}

      {phase === 'question' && selectedAnswer !== null && (
        <div style={{ textAlign: 'center', fontSize: 13, color: '#8a8880', fontFamily: 'monospace', marginTop: 8 }}>
          Answer locked! Waiting for other players...
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', fontFamily: 'sans-serif' }}>
      <nav style={{ background: '#00274C', borderBottom: '3px solid #FFCB05', height: 56, display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
        <div style={{ fontWeight: 900, fontSize: 18, color: '#fff', letterSpacing: '0.02em' }}>
          STUDY<span style={{ color: '#FFCB05' }}>ARENA</span>
          <span style={{ marginLeft: 12, fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)' }}>LIVE</span>
        </div>
      </nav>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {children}
      </div>
    </div>
  );
}