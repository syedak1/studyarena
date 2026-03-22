'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();

  function handleEnter() {
    if (!name.trim()) return;
    localStorage.setItem('studentName', name.trim());
    router.push('/dashboard');
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#fafaf8',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem',
      backgroundImage: 'linear-gradient(rgba(0,39,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,39,76,0.03) 1px, transparent 1px)',
      backgroundSize: '36px 36px',
    }}>

      <div style={{
        position: 'relative', zIndex: 1,
        background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
        padding: '3.5rem 3rem 3rem', width: '100%', maxWidth: 440,
        textAlign: 'center', boxShadow: '0 2px 40px rgba(0,0,0,0.06)',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#00274C' }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          border: '1px solid rgba(0,39,76,0.2)', background: 'rgba(0,39,76,0.05)',
          color: '#00274C', fontFamily: 'monospace', fontSize: 11,
          letterSpacing: '0.12em', padding: '4px 10px',
          textTransform: 'uppercase', marginBottom: '1.75rem',
        }}>
          <div style={{ width: 5, height: 5, background: '#FFCB05', borderRadius: '50%' }} />
          UMich Study Community
        </div>

        <div style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 0.9, letterSpacing: '0.02em', marginBottom: '0.75rem', color: '#00274C' }}>
          STUDY<br />
          <span style={{ color: '#FFCB05', WebkitTextStroke: '1px #c8a000' }}>ARENA</span>
        </div>

        <p style={{ fontSize: 14, color: '#7a7870', lineHeight: 1.75, marginBottom: '2rem', fontWeight: 300 }}>
          Study with your classmates.<br />
          Compete, share notes, and discuss — all in one place.
        </p>

        <div style={{ width: '100%', height: 1, background: 'rgba(0,0,0,0.06)', marginBottom: '1.75rem' }} />

        <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#00274C', letterSpacing: '0.06em', textAlign: 'left', marginBottom: 8, textTransform: 'uppercase' }}>
          Your name
        </div>
        <input
          type="text"
          placeholder="e.g. Kazim"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleEnter()}
          autoFocus
          style={{
            width: '100%', padding: '0.85rem 1rem',
            border: '1px solid rgba(0,0,0,0.12)',
            background: '#faf9f7', fontSize: 15,
            color: '#1a1916', outline: 'none',
            marginBottom: 12, fontFamily: 'inherit',
          }}
        />

        <button
          onClick={handleEnter}
          disabled={!name.trim()}
          style={{
            width: '100%', padding: '0.85rem',
            background: name.trim() ? '#00274C' : '#e0ddd8',
            border: 'none', color: name.trim() ? '#FFCB05' : '#aaa',
            fontFamily: 'monospace', fontSize: 13,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: name.trim() ? 'pointer' : 'not-allowed',
            fontWeight: 700, transition: 'background 0.2s',
          }}
        >
          Enter →
        </button>

        <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#8a8880', marginTop: 16, letterSpacing: '0.05em' }}>
          No account needed. Just your name.
        </p>
      </div>

      <div style={{
        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'monospace', fontSize: 11, color: 'rgba(0,39,76,0.25)',
        letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap', zIndex: 1,
      }}>
        StudyArena · University of Michigan
      </div>
    </div>
  );
}