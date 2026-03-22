'use client';

import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';

export default function About() {
  const router = useRouter();

  return (
    <div style={{ background: '#00274C', minHeight: '100vh', fontFamily: 'sans-serif', color: '#fff' }}>
      <Navbar />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '7rem 2.5rem 5rem' }}>

        {/* WHAT IS STUDYARENA */}
        <div id="about">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'monospace', fontSize: '0.68rem', letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'rgba(255,203,5,0.7)', marginBottom: '1rem',
            background: 'rgba(255,203,5,0.08)', padding: '6px 14px', borderRadius: 20,
          }}>
            What is StudyArena?
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', marginBottom: '1.25rem', lineHeight: 1.1, marginTop: '1rem' }}>
            Built by UMich students,<br />for UMich students.
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 640, fontWeight: 300, marginBottom: '4rem' }}>
            StudyArena is a study platform built specifically for the University of Michigan community. Upload your lecture notes, generate a quiz with AI, and challenge your classmates to a real-time battle — or use it to browse resources and discuss course material with peers.
          </p>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: '4rem' }} />

        {/* MISSION */}
        <div id="mission">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'monospace', fontSize: '0.68rem', letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'rgba(255,203,5,0.7)', marginBottom: '1rem',
            background: 'rgba(255,203,5,0.08)', padding: '6px 14px', borderRadius: 20,
          }}>
            Our Mission
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', marginBottom: '1.25rem', marginTop: '1rem' }}>
            Make studying less lonely.
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 640, fontWeight: 300, marginBottom: '4rem' }}>
            Studying alone is inefficient and demotivating. We built StudyArena to turn studying into a social experience — where competing with your classmates makes you learn faster, and sharing your notes helps everyone in the class succeed together.
          </p>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: '4rem' }} />

        {/* HOW IT WORKS */}
        <div id="how">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: 'monospace', fontSize: '0.68rem', letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'rgba(255,203,5,0.7)', marginBottom: '1rem',
            background: 'rgba(255,203,5,0.08)', padding: '6px 14px', borderRadius: 20,
          }}>
            How it Works
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', marginBottom: '2.5rem', marginTop: '1rem' }}>
            Three steps.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { num: '01', title: 'Add your courses', desc: 'Search the UMich course catalog and add the classes you are enrolled in to your dashboard.' },
              { num: '02', title: 'Upload material', desc: 'Drop in any PDF — lecture notes, past exams, study guides. AI generates quiz questions automatically.' },
              { num: '03', title: 'Battle or browse', desc: 'Challenge classmates to a real-time quiz, or browse resources and discuss in the course community.' },
            ].map(s => (
              <div key={s.num}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: '2rem 1.75rem',
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
                <div style={{ fontSize: '3rem', fontWeight: 900, color: 'rgba(255,203,5,0.2)', lineHeight: 1, marginBottom: '1rem', fontFamily: 'monospace' }}>{s.num}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{s.title}</div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push('/')}
          style={{
            marginTop: '4rem', background: 'none', border: '1px solid rgba(255,255,255,0.15)',
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
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}