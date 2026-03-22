'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ENROLLED_KEY = 'enrolledCourses';

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

const categoryColors: Record<string, string> = {
  EECS: '#00274C', MATH: '#1a5276', PHYS: '#154360',
  CHEM: '#0e6655', STATS: '#6e2f8a', ECON: '#784212',
};

function Navbar({ name }: { name: string }) {
  const router = useRouter();
  return (
    <nav style={{
      background: '#00274C',
      borderBottom: '3px solid #FFCB05',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 56,
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div
        onClick={() => router.push('/dashboard')}
        style={{ fontWeight: 900, fontSize: 18, color: '#fff', letterSpacing: '0.02em', cursor: 'pointer' }}
      >
        STUDY<span style={{ color: '#FFCB05' }}>ARENA</span>
        <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', marginLeft: 10, letterSpacing: '0.08em' }}>UMICH</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#FFCB05', color: '#00274C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800,
        }}>{name[0]?.toUpperCase()}</div>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{name}</span>
      </div>
    </nav>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'my' | 'catalog'>('my');

  useEffect(() => {
    const savedName = localStorage.getItem('studentName') || 'Student';
    const savedCourses = JSON.parse(localStorage.getItem(ENROLLED_KEY) || '[]');
    setName(savedName);
    setEnrolled(savedCourses);
  }, []);

  function toggleEnroll(id: string) {
    const updated = enrolled.includes(id)
      ? enrolled.filter(c => c !== id)
      : [...enrolled, id];
    setEnrolled(updated);
    localStorage.setItem(ENROLLED_KEY, JSON.stringify(updated));
  }

  const myCourses = ALL_COURSES.filter(c => enrolled.includes(c.id));
  const filtered = ALL_COURSES.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', fontFamily: 'sans-serif' }}>
      <Navbar name={name} />

      {/* Hero banner */}
      <div style={{
        background: 'linear-gradient(135deg, #00274C 0%, #003a6e 100%)',
        borderBottom: '4px solid #FFCB05',
        padding: '2rem 2rem 1.75rem',
      }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            Welcome back, {name} 👋
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
              University of Michigan
            </p>
            <span style={{
              background: '#FFCB05',
              color: '#00274C',
              fontSize: 11,
              fontFamily: 'monospace',
              fontWeight: 800,
              letterSpacing: '0.07em',
              padding: '3px 10px',
              borderRadius: 20,
            }}>
              {myCourses.length} COURSE{myCourses.length !== 1 ? 'S' : ''} ENROLLED
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
          {(['my', 'catalog'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0.75rem 1.25rem', fontSize: 13, fontFamily: 'monospace',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: activeTab === tab ? '#00274C' : '#8a8880',
              borderBottom: activeTab === tab ? '3px solid #FFCB05' : '3px solid transparent',
              marginBottom: -2, fontWeight: activeTab === tab ? 700 : 400,
              transition: 'color 0.15s',
            }}>
              {tab === 'my' ? `My Courses (${myCourses.length})` : 'Course Catalog'}
            </button>
          ))}
        </div>

        {/* MY COURSES TAB */}
        {activeTab === 'my' && (
          myCourses.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '4rem 2rem',
              border: '2px dashed rgba(0,39,76,0.18)',
              background: '#fff',
              borderRadius: 14,
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📚</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#00274C', marginBottom: 8 }}>No courses yet</div>
              <div style={{ fontSize: 14, color: '#8a8880', marginBottom: 20 }}>
                Head to the Course Catalog to add your classes.
              </div>
              <button onClick={() => setActiveTab('catalog')} style={{
                background: '#00274C', border: 'none', color: '#FFCB05',
                padding: '0.7rem 1.5rem', fontFamily: 'monospace',
                fontSize: 12, letterSpacing: '0.08em',
                textTransform: 'uppercase', cursor: 'pointer', fontWeight: 700,
                borderRadius: 8,
              }}>Browse Catalog →</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {myCourses.map(course => (
                <div
                  key={course.id}
                  onClick={() => router.push(`/course/${course.id}`)}
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 14,
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 28px rgba(0,39,76,0.13)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  {/* Top accent bar */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 5,
                    background: categoryColors[course.category] || '#00274C',
                    borderRadius: '14px 14px 0 0',
                  }} />

                  {/* Category badge — now maize */}
                  <div style={{
                    display: 'inline-block', fontSize: 10, fontFamily: 'monospace',
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    background: '#FFCB05', color: '#00274C',
                    padding: '3px 9px', marginBottom: 10, fontWeight: 800,
                    borderRadius: 6,
                  }}>{course.category}</div>

                  <div style={{ fontSize: 20, fontWeight: 800, color: '#00274C', marginBottom: 4 }}>{course.code}</div>
                  <div style={{ fontSize: 13, color: '#7a7870', marginBottom: 16, lineHeight: 1.4 }}>{course.name}</div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <div style={{
                      fontSize: 11, fontFamily: 'monospace', color: '#fff',
                      background: '#00274C', padding: '3px 9px', borderRadius: 6,
                    }}>
                      {course.credits} cr · enter →
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); toggleEnroll(course.id); }}
                      title="Remove course"
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 16, padding: '4px', color: 'rgba(0,0,0,0.2)',
                        lineHeight: 1, transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#c0392b')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.2)')}
                    >🗑</button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* CATALOG TAB */}
        {activeTab === 'catalog' && (
          <>
            <input
              type="text"
              placeholder="Search — e.g. EECS 281 or Algorithms..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '0.85rem 1rem',
                border: '2px solid rgba(0,39,76,0.15)',
                background: '#fff', fontSize: 14, color: '#1a1916',
                outline: 'none', marginBottom: '1rem',
                fontFamily: 'inherit', boxSizing: 'border-box',
                borderRadius: 10,
                transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#FFCB05')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,39,76,0.15)')}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {filtered.map(course => (
                <div key={course.id} style={{
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 10,
                  padding: '1rem 1.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'border-color 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,39,76,0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)')}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: '#00274C' }}>{course.code}</span>
                      <span style={{
                        fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.06em',
                        textTransform: 'uppercase', background: '#FFCB05',
                        color: '#00274C', padding: '2px 7px', fontWeight: 800,
                        borderRadius: 5,
                      }}>{course.category}</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#7a7870' }}>{course.name} · {course.credits} credits</div>
                  </div>
                  <button
                    onClick={() => toggleEnroll(course.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: enrolled.includes(course.id) ? 'none' : '1.5px solid rgba(0,39,76,0.25)',
                      fontFamily: 'monospace', fontSize: 11,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                      background: enrolled.includes(course.id) ? '#FFCB05' : 'transparent',
                      color: '#00274C',
                      fontWeight: 800,
                      borderRadius: 7,
                    }}
                  >
                    {enrolled.includes(course.id) ? '✓ Added' : '+ Add'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}