'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [name, setName] = useState('');
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  function handleEnter() {
    if (!name.trim()) return;
    localStorage.setItem('studentName', name.trim());
    router.push('/dashboard');
  }

  const navItems = [
    { label: 'About', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'Features', href: '/features' },
  ];

  return (
    <div style={{ background: '#00274C', minHeight: '100vh', fontFamily: 'sans-serif', color: '#fff', position: 'relative', overflowX: 'hidden' }}>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 3, background: '#FFCB05', zIndex: 100 }} />

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 2.5rem', height: 56,
        background: 'rgba(0,39,76,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div
          onClick={() => router.push('/')}
          style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff', letterSpacing: '0.04em', cursor: 'pointer', flexShrink: 0 }}
        >
          STUDY<span style={{ color: '#FFCB05' }}>ARENA</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          {navItems.map(item => (
            <div
              key={item.label}
              onClick={() => router.push(item.href)}
              style={{
                padding: '0 1rem', height: 56,
                display: 'flex', alignItems: 'center',
                fontSize: 13, color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer', transition: 'color 0.15s', userSelect: 'none',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.color = '#fff'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.color = 'rgba(255,255,255,0.6)'}
            >
              {item.label}
            </div>
          ))}
        </div>

        <div style={{
          fontFamily: 'monospace', fontSize: '0.62rem',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '4px 10px', flexShrink: 0,
          borderRadius: 6,
        }}>
          University of Michigan
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        position: 'relative', zIndex: 1, minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '100px 2rem 5rem',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: 'monospace', fontSize: '0.68rem',
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'rgba(255,203,5,0.7)', marginBottom: '1.75rem',
          background: 'rgba(255,203,5,0.08)',
          padding: '6px 14px',
          borderRadius: 20,
        }}>
          <div style={{ width: 6, height: 6, background: '#FFCB05', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          UMich Study Community
        </div>

        <h1 style={{
          fontSize: 'clamp(3.2rem, 9vw, 6.5rem)', fontWeight: 900,
          lineHeight: 1, letterSpacing: '-0.02em', color: '#fff', marginBottom: '1.25rem',
        }}>
          Study.<br />
          <span style={{ color: '#FFCB05' }}>Compete.</span><br />
          Win.
        </h1>

        <p style={{
          fontSize: '1rem', color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.75, maxWidth: 360,
          margin: '0 auto 2.5rem', fontWeight: 300,
        }}>
          Join your classmates, share notes,<br />
          and battle it out in real-time quiz rooms.
        </p>

        <div style={{ display: 'flex', width: '100%', maxWidth: 380, margin: '0 auto 1rem', borderRadius: 10, overflow: 'hidden' }}>
          <input
            type="text"
            placeholder="Enter your name..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEnter()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoFocus
            style={{
              flex: 1, padding: '14px 18px',
              background: 'rgba(255,255,255,0.06)',
              borderTop: focused ? '1px solid rgba(255,203,5,0.6)' : '1px solid rgba(255,255,255,0.12)',
              borderBottom: focused ? '1px solid rgba(255,203,5,0.6)' : '1px solid rgba(255,255,255,0.12)',
              borderLeft: focused ? '1px solid rgba(255,203,5,0.6)' : '1px solid rgba(255,255,255,0.12)',
              borderRight: 'none', color: '#fff',
              fontFamily: 'inherit', fontSize: 15, outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
          <button
            onClick={handleEnter}
            disabled={!name.trim()}
            style={{
              padding: '14px 22px',
              background: name.trim() ? '#FFCB05' : 'rgba(255,255,255,0.06)',
              border: 'none',
              color: name.trim() ? '#00274C' : 'rgba(255,255,255,0.2)',
              fontFamily: 'monospace', fontSize: '0.75rem',
              fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
          >
            Enter →
          </button>
        </div>

        <p style={{
          fontFamily: 'monospace', fontSize: '0.63rem',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.18)',
        }}>
          No signup required &nbsp;·&nbsp; Works for any course
        </p>
      </section>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.2} }
        input::placeholder { color: rgba(255,255,255,0.22); }
      `}</style>
    </div>
  );
}