'use client';

import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

const features = [
  {
    id: 'battles',
    icon: '🏆',
    title: 'Competitive Quiz Battles',
    tag: 'Real-time Multiplayer',
    desc: 'Create a room, share a 6-digit code, and battle other friends in the same classes. Questions are served one at a time with a countdown timer. A live leaderboard updates after every question.',
    details: ['Live scoring after every question', 'Customizable tests based on direct material', 'Host controls the game flow', 'Up to 10 players per room'],
  },
  {
    id: 'ai',
    icon: '⚡',
    title: 'AI Generation',
    tag: 'Upload any PDF',
    desc: 'Drop in any PDF such as lecture slides, past exams, and textbook chapters. Our AI reads the material and generates multiple choice questions that test a students ability. Questions are ready in under 15 seconds.',
    details: ['Supports any PDF up to 20MB', 'Powered by Gemini', 'Adjustable difficulty', 'Questions ready in ~10 seconds'],
  },
  {
    id: 'community',
    icon: '👥',
    title: 'Course Community',
    tag: 'Notes + discussion',
    desc: 'Every course has its own space where students can upload resources, browse what others have shared, and discuss course material. Think of it as a course-specific GroupChat with shared notes built in.',
    details: ['Upload notes and past exams', 'Browse classmate resources', 'Course-specific discussion', 'No login required'],
  },
];

export default function Features() {
  const router = useRouter();

  return (
    <div style={{ background: '#00274C', minHeight: '100vh', fontFamily: 'sans-serif', color: '#fff' }}>
      <Navbar />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '7rem 2.5rem 5rem' }}>
        <div style={{
          fontFamily: 'monospace', fontSize: '0.68rem', letterSpacing: '0.16em',
          textTransform: 'uppercase', color: 'rgba(255,203,5,0.7)', marginBottom: '1rem',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,203,5,0.08)', padding: '6px 14px', borderRadius: 20,
        }}>
          Features
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', marginBottom: '1rem', lineHeight: 1.1, marginTop: '1rem' }}>
          Everything you need<br />to study smarter.
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 500, fontWeight: 300, marginBottom: '4rem' }}>
          Three core tools — competitive quizzing, AI generation, and a course community — all in one place.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '4rem' }}>
          {features.map(f => (
            <div key={f.id} id={f.id}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14,
                padding: '2.5rem',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,203,5,0.2)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
              }}
            >
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
                <div style={{
                  display: 'inline-block', fontSize: '0.7rem', fontFamily: 'monospace',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#00274C', background: '#FFCB05',
                  padding: '3px 9px', borderRadius: 6, fontWeight: 800,
                  marginBottom: '0.75rem',
                }}>{f.tag}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>{f.title}</div>
                <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.75 }}>{f.desc}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.75rem' }}>
                {f.details.map(d => (
                  <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 5, height: 5, background: '#FFCB05', borderRadius: '50%', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push('/')}
          style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.5)', padding: '0.75rem 1.5rem',
            fontFamily: 'monospace', fontSize: '0.75rem', letterSpacing: '0.08em',
            textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
            borderRadius: 8,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#FFCB05';
            (e.currentTarget as HTMLButtonElement).style.color = '#FFCB05';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)';
          }}
        >← Back to Home</button>
      </div>
    </div>
  );
}