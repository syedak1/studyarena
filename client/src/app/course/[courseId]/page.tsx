'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const ALL_COURSES: Record<string, { code: string; name: string; category: string }> = {
  eecs281: { code: 'EECS 281', name: 'Data Structures & Algorithms', category: 'EECS' },
  eecs203: { code: 'EECS 203', name: 'Discrete Mathematics', category: 'EECS' },
  eecs280: { code: 'EECS 280', name: 'Programming & Data Structures', category: 'EECS' },
  eecs376: { code: 'EECS 376', name: 'Foundations of Computer Science', category: 'EECS' },
  eecs482: { code: 'EECS 482', name: 'Operating Systems', category: 'EECS' },
  eecs485: { code: 'EECS 485', name: 'Web Systems', category: 'EECS' },
  math215: { code: 'MATH 215', name: 'Multivariable Calculus', category: 'MATH' },
  math216: { code: 'MATH 216', name: 'Differential Equations', category: 'MATH' },
  math217: { code: 'MATH 217', name: 'Linear Algebra', category: 'MATH' },
  math412: { code: 'MATH 412', name: 'Introduction to Modern Algebra', category: 'MATH' },
  phys140: { code: 'PHYS 140', name: 'General Physics I', category: 'PHYS' },
  phys240: { code: 'PHYS 240', name: 'General Physics II', category: 'PHYS' },
  chem130: { code: 'CHEM 130', name: 'General Chemistry', category: 'CHEM' },
  stats426: { code: 'STATS 426', name: 'Introduction to Probability', category: 'STATS' },
  econ101: { code: 'ECON 101', name: 'Principles of Economics', category: 'ECON' },
};

const MODES = [
  {
    id: 'competitive',
    icon: '🏆',
    title: 'Competitive',
    description: 'Challenge your classmates to a real-time quiz battle. Upload notes, generate questions, and see who studied hardest.',
    tag: 'Live multiplayer',
    tagColor: '#c8420a',
    href: '/create',
  },
  {
    id: 'learning',
    icon: '📚',
    title: 'Learning Mode',
    description: 'Browse notes, past exams, and study guides uploaded by your classmates. Study at your own pace.',
    tag: 'Self-paced',
    tagColor: '#1a5276',
    href: 'learning',
  },
  {
    id: 'post',
    icon: '📤',
    title: 'Post a Resource',
    description: 'Share your notes, cheat sheets, or practice problems with the class. Help your classmates study better.',
    tag: 'Contribute',
    tagColor: '#0e6655',
    href: 'post',
  },
  {
    id: 'discussion',
    icon: '💬',
    title: 'Discussion',
    description: 'Ask questions, answer them, and chat with other students in this course. Like a course GroupChat.',
    tag: 'Community',
    tagColor: '#6e2f8a',
    href: 'discussion',
  },
];

function Navbar({ name, courseCode }: { name: string; courseCode: string }) {
  const router = useRouter();
  return (
    <nav style={{
      background: '#00274C', borderBottom: '3px solid #FFCB05',
      padding: '0 2rem', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', height: 56,
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          onClick={() => router.push('/dashboard')}
          style={{ fontWeight: 900, fontSize: 18, color: '#fff', cursor: 'pointer', letterSpacing: '0.02em' }}
        >
          STUDY<span style={{ color: '#FFCB05' }}>ARENA</span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>/</span>
        <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em' }}>
          {courseCode}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#FFCB05', color: '#00274C',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800,
        }}>{name[0]?.toUpperCase()}</div>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{name}</span>
      </div>
    </nav>
  );
}

export default function CourseDashboard() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const course = ALL_COURSES[courseId];

  const [name, setName] = useState('');
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('studentName') || 'Student';
    setName(savedName);
  }, []);

  if (!course) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f4f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🤔</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#00274C', marginBottom: 8 }}>Course not found</div>
          <button onClick={() => router.push('/dashboard')} style={{
            background: '#00274C', border: 'none', color: '#FFCB05',
            padding: '0.7rem 1.5rem', fontFamily: 'monospace', fontSize: 12,
            letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 700,
          }}>← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  function handleModeClick(mode: typeof MODES[0]) {
    if (mode.id === 'competitive') {
      router.push('/create');
    } else {
      router.push(`/course/${courseId}/${mode.href}`);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', fontFamily: 'sans-serif' }}>
      <Navbar name={name} courseCode={course.code} />

      {/* Course header banner */}
      <div style={{ background: '#00274C', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: 920, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block', fontSize: 10, fontFamily: 'monospace',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'rgba(255,203,5,0.15)', color: '#FFCB05',
            padding: '3px 10px', marginBottom: 12, fontWeight: 700,
            border: '1px solid rgba(255,203,5,0.3)',
          }}>{course.category}</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: 6, letterSpacing: '0.02em' }}>
            {course.code}
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 0 }}>{course.name}</p>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '2rem 1.5rem' }}>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00274C', marginBottom: 4 }}>
            What do you want to do?
          </h2>
          <p style={{ fontSize: 14, color: '#7a7870' }}>Choose a mode to get started.</p>
        </div>

        {/* Mode cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {MODES.map(mode => (
            <div
              key={mode.id}
              onClick={() => handleModeClick(mode)}
              style={{
                background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
                padding: '1.75rem', cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                position: 'relative', overflow: 'hidden',
                transform: hoveredMode === mode.id ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: hoveredMode === mode.id ? '0 8px 24px rgba(0,39,76,0.12)' : 'none',
              }}
              onMouseEnter={() => setHoveredMode(mode.id)}
              onMouseLeave={() => setHoveredMode(null)}
            >
              {/* top accent bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: mode.tagColor }} />

              {/* tag */}
              <div style={{
                display: 'inline-block', fontSize: 10, fontFamily: 'monospace',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: mode.tagColor, padding: '3px 8px', marginBottom: 16,
                background: `${mode.tagColor}15`,
                border: `1px solid ${mode.tagColor}30`,
                fontWeight: 700,
              }}>{mode.tag}</div>

              <div style={{ fontSize: 32, marginBottom: 12 }}>{mode.icon}</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#00274C', marginBottom: 8 }}>{mode.title}</div>
              <div style={{ fontSize: 13, color: '#7a7870', lineHeight: 1.6 }}>{mode.description}</div>

              <div style={{
                marginTop: 20, fontSize: 12, fontFamily: 'monospace',
                color: mode.tagColor, fontWeight: 700, letterSpacing: '0.05em',
              }}>
                {hoveredMode === mode.id ? 'Click to enter →' : ''}
              </div>
            </div>
          ))}
        </div>

        {/* back link */}
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            background: 'none', border: 'none', color: '#8a8880',
            fontSize: 13, fontFamily: 'monospace', cursor: 'pointer',
            marginTop: '2rem', letterSpacing: '0.05em',
          }}
        >← Back to My Courses</button>
      </div>
    </div>
  );
}