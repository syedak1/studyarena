'use client';

import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

const team = [
  {
    initial: 'K', name: 'Kazim Abbas', role: 'Frontend Designer',
    bio: 'UMich Dearborn student majoring in CS and Math. Built the frontend + usability of the backend.',
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Node.js'],
  },
  {
    initial: 'S', name: 'Syed Sajjad Akbari', role: 'Backend + Sockets',
    bio: 'Built the Express API, Socket.IO real-time game logic, and room management system. Handles all server-side logic and database operations.',
    tags: ['Express', 'Socket.IO', 'Prisma'],
  },
  {
    initial: 'Z', name: 'Zein El-Khatib', role: 'AI Pipeline Integration + Data Storage',
    bio: 'Built the pipeline for the AI question generator. Designed the prompting strategy that turns lecture notes into high-quality multiple choice questions.',
    tags: ['Gemini', 'PDF parsing', 'Prompt engineering', 'PostgreSQL'],
  },
];

export default function Team() {
  const router = useRouter();

  return (
    <div style={{ background: '#00274C', minHeight: '100vh', fontFamily: 'sans-serif', color: '#fff' }}>
      <Navbar />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '7rem 2.5rem 5rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: 'monospace', fontSize: '0.68rem', letterSpacing: '0.16em',
          textTransform: 'uppercase', color: 'rgba(255,203,5,0.7)', marginBottom: '1rem',
          background: 'rgba(255,203,5,0.08)', padding: '6px 14px', borderRadius: 20,
        }}>
          The Team
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', marginBottom: '1rem', lineHeight: 1.1, marginTop: '1rem' }}>
          Made at Michigan.
        </h1>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 500, fontWeight: 300, marginBottom: '3rem' }}>
          Three CS students who got tired of studying alone and decided to build something about it.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '4rem' }}>
          {team.map(t => (
            <div key={t.name}
              style={{
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14,
                background: 'rgba(255,255,255,0.03)',
                padding: '2rem',
                transition: 'border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,203,5,0.3)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: '#FFCB05', color: '#00274C',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.25rem',
              }}>{t.initial}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>{t.name}</div>
              <div style={{
                display: 'inline-block', fontSize: '0.68rem', fontFamily: 'monospace',
                color: '#00274C', background: '#FFCB05',
                letterSpacing: '0.06em', marginBottom: '1rem', textTransform: 'uppercase',
                padding: '3px 9px', borderRadius: 6, fontWeight: 800,
              }}>{t.role}</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: '1.25rem' }}>{t.bio}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {t.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.06em',
                    color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)', padding: '3px 8px',
                    borderRadius: 5,
                  }}>{tag}</span>
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