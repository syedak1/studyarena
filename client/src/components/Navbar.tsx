'use client';

import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const navItems = [
    { label: 'About', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'Features', href: '/features' },
  ];

  return (
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
  );
}