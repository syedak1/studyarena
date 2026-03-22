'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ALL_COURSES = [
  { id: 'eecs281', code: 'EECS 281', name: 'Data Structures & Algorithms', credits: 4, category: 'EECS' },
  { id: 'eecs203', code: 'EECS 203', name: 'Discrete Mathematics', credits: 4, category: 'EECS' },
  { id: 'eecs280', code: 'EECS 280', name: 'Programming & Data Structures', credits: 4, category: 'EECS' },
  { id: 'eecs376', code: 'EECS 376', name: 'Foundations of Computer Science', credits: 4, category: 'EECS' },
  { id: 'eecs482', code: 'EECS 482', name: 'Operating Systems', credits: 4, category: 'EECS' },
  { id: 'eecs485', code: 'EECS 485', name: 'Web Systems', credits: 4, category: 'EECS' },
  { id: 'math215', code: 'MATH 215', name: 'Multivariable Calculus', credits: 4, category: 'MATH' },
  { id: 'math216', code: 'MATH 216', name: 'Differential Equations', credits: 4, category: 'MATH' },
  { id: 'math217', code: 'MATH 217', name: 'Linear Algebra', credits: 4, category: 'MATH' },
  { id: 'math412', code: 'MATH 412', name: 'Introduction to Modern Algebra', credits: 3, category: 'MATH' },
  { id: 'phys140', code: 'PHYS 140', name: 'General Physics I', credits: 4, category: 'PHYS' },
  { id: 'phys240', code: 'PHYS 240', name: 'General Physics II', credits: 4, category: 'PHYS' },
  { id: 'chem130', code: 'CHEM 130', name: 'General Chemistry', credits: 3, category: 'CHEM' },
  { id: 'stats426', code: 'STATS 426', name: 'Introduction to Probability', credits: 3, category: 'STATS' },
  { id: 'econ101', code: 'ECON 101', name: 'Principles of Economics', credits: 4, category: 'ECON' },
];

export default function Onboarding() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const n = localStorage.getItem('studentName');
    if (!n) { router.push('/'); return; }
    setName(n);
    setSelected(JSON.parse(localStorage.getItem('enrolledCourses') || '[]'));
  }, [router]);

  function toggle(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  }

  function handleContinue() {
    localStorage.setItem('enrolledCourses', JSON.stringify(selected));
    localStorage.setItem('lastCourseId', selected[0]);
    router.push('/dashboard');
  }

  const filtered = ALL_COURSES.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const initial = name[0]?.toUpperCase() || 'S';

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', fontFamily: 'sans-serif' }}>
      {/* Navbar */}
      <nav style={{ background: '#00274C', borderBottom: '3px solid #FFCB05', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontWeight: 900, fontSize: 17, color: '#fff', letterSpacing: '.03em' }}>STUDY<span style={{ color: '#FFCB05' }}>ARENA</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFCB05', color: '#00274C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{initial}</div>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,.8)' }}>{name}</span>
        </div>
      </nav>

      {/* Header */}
      <div style={{ background: '#00274C', borderBottom: '4px solid #FFCB05', padding: '2.5rem 2rem 2rem', textAlign: 'center' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,203,5,.7)', marginBottom: 12 }}>Step 1 of 1</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>Pick your courses</h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', maxWidth: 400, margin: '0 auto' }}>
          Select at least 3 courses you&apos;re taking this semester. You can change these later.
        </p>
      </div>

      {/* Course picker */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Selected count + continue */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 12, color: selected.length >= 3 ? '#059669' : '#8a8880', fontWeight: 700 }}>
            {selected.length} selected {selected.length < 3 && `(need ${3 - selected.length} more)`}
          </div>
          <button onClick={handleContinue} disabled={selected.length < 3} style={{
            background: selected.length >= 3 ? '#00274C' : 'rgba(0,0,0,.08)',
            border: 'none', color: selected.length >= 3 ? '#FFCB05' : '#8a8880',
            padding: '8px 20px', borderRadius: 8, fontFamily: 'monospace', fontSize: 12,
            letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 800,
            cursor: selected.length >= 3 ? 'pointer' : 'not-allowed', transition: 'all .15s',
          }}>
            Continue →
          </button>
        </div>

        {/* Search */}
        <input type="text" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} style={{
          width: '100%', padding: '.85rem 1rem', border: '2px solid rgba(0,39,76,.15)',
          background: '#fff', fontSize: 14, color: '#1a1916', outline: 'none',
          marginBottom: '1rem', borderRadius: 10, boxSizing: 'border-box',
        }}
          onFocus={e => (e.currentTarget.style.borderColor = '#FFCB05')}
          onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,39,76,.15)')}
        />

        {/* Course list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
          {filtered.map(course => {
            const isSelected = selected.includes(course.id);
            return (
              <div key={course.id} onClick={() => toggle(course.id)} style={{
                background: isSelected ? 'rgba(0,39,76,.06)' : '#fff',
                border: isSelected ? '2px solid #00274C' : '1px solid rgba(0,0,0,.08)',
                borderRadius: 10, padding: '1rem 1.25rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', transition: 'all .15s',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#00274C' }}>{course.code}</span>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', background: '#FFCB05', color: '#00274C', padding: '2px 7px', fontWeight: 800, borderRadius: 5 }}>{course.category}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#7a7870' }}>{course.name} · {course.credits} cr</div>
                </div>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: isSelected ? '#00274C' : 'rgba(0,0,0,.06)',
                  color: isSelected ? '#FFCB05' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800, transition: 'all .15s', flexShrink: 0,
                }}>
                  {isSelected ? '✓' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}