'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const navItems = [
  {
    label: 'About',
    items: [
      { title: 'What is StudyArena?', sub: 'Overview of the platform', href: '/about' },
      { title: 'Our Mission', sub: 'Why we built this', href: '/about#mission' },
      { title: 'How it Works', sub: 'The 3-step flow', href: '/about#how' },
    ],
  },
  {
    label: 'Team',
    items: [
      { title: 'Kazim Syed', sub: 'Frontend · UMich CS', href: '/team' },
      { title: 'Alex Johnson', sub: 'Backend · UMich CS', href: '/team' },
      { title: 'Jordan Lee', sub: 'AI Pipeline · UMich CS', href: '/team' },
    ],
  },
  {
    label: 'Features',
    items: [
      { title: 'Quiz Battles', sub: 'Real-time multiplayer', href: '/features' },
      { title: 'AI Generation', sub: 'Upload any PDF', href: '/features#ai' },
      { title: 'Course Community', sub: 'Notes + discussion', href: '/features#community' },
    ],
  },
];

export default function Navbar() {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <>
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
              style={{ position: 'relative' }}
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <div style={{
                padding: '0 1rem', height: 56,
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 13,
                color: openDropdown === item.label ? '#fff' : 'rgba(255,255,255,0.6)',
                cursor: 'pointer', transition: 'color 0.15s', userSelect: 'none',
              }}>
                {item.label}
                <span style={{
                  fontSize: 9, color: 'rgba(255,255,255,0.3)',
                  transform: openDropdown === item.label ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s', display: 'inline-block',
                }}>▼</span>
              </div>

              <div style={{
                position: 'absolute', top: 56, left: 0,
                minWidth: 220, background: '#001e3c',
                border: '1px solid rgba(255,255,255,0.08)',
                borderTop: '2px solid #FFCB05',
                opacity: openDropdown === item.label ? 1 : 0,
                pointerEvents: openDropdown === item.label ? 'all' : 'none',
                transform: openDropdown === item.label ? 'translateY(0)' : 'translateY(-6px)',
                transition: 'all 0.18s ease',
              }}>
                {item.items.map((d, i) => (
                  <div
                    key={i}
                    onClick={() => router.push(d.href)}
                    style={{
                      padding: '0.75rem 1.25rem', fontSize: 13,
                      color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                      transition: 'all 0.15s',
                      borderBottom: i < item.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,203,5,0.06)';
                      (e.currentTarget as HTMLDivElement).style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                      (e.currentTarget as HTMLDivElement).style.color = 'rgba(255,255,255,0.6)';
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>{d.title}</div>
                    <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>{d.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          fontFamily: 'monospace', fontSize: '0.62rem',
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '4px 10px', flexShrink: 0,
        }}>
          University of Michigan
        </div>
      </nav>
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 3, background: '#FFCB05', zIndex: 100 }} />
    </>
  );
}