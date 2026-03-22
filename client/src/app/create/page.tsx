'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Step = 'upload' | 'loading' | 'lobby';

interface BattleCourse {
  code: string;
  name: string;
  id: string;
}

function Navbar({ name, courseCode }: { name: string; courseCode?: string }) {
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
        {courseCode && (
          <>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>/</span>
            <span style={{ fontFamily: 'monospace', fontSize: 13, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.06em' }}>{courseCode}</span>
          </>
        )}
      </div>
      {name && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#FFCB05', color: '#00274C',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800,
          }}>{name[0]?.toUpperCase()}</div>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{name}</span>
        </div>
      )}
    </nav>
  );
}

export default function CreateRoom() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('upload');
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [roomCode] = useState('XK7M2P');
  const [course, setCourse] = useState<BattleCourse | null>(null);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('studentName') || '';
    setName(savedName);
    const savedCourse = localStorage.getItem('battleCourse');
    if (savedCourse) setCourse(JSON.parse(savedCourse));
    const savedTopic = localStorage.getItem('battleTopic') || '';
    setTopic(savedTopic);
  }, []);

  if (step === 'upload') {
    return (
      <>
        <Navbar name={name} courseCode={course?.code} />
        <PageShell>
          <Label>Create a Room</Label>
          <Title>Upload your material</Title>

          {course && (
            <div style={{
              background: 'rgba(0,39,76,0.06)', border: '1px solid rgba(0,39,76,0.15)',
              borderRadius: 8, padding: '0.75rem 1rem', marginBottom: 20, textAlign: 'left',
            }}>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8a8880', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Course</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#00274C' }}>{course.code}</div>
              <div style={{ fontSize: 12, color: '#7a7870' }}>{course.name}</div>
              {topic && (
                <>
                  <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8a8880', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 10, marginBottom: 4 }}>Topic</div>
                  <div style={{ fontSize: 13, color: '#2a2926' }}>{topic}</div>
                </>
              )}
            </div>
          )}

          <Sub>Drop in any PDF — lecture notes, past exams, study guides.</Sub>
          <label style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column',
            width: '100%', padding: '2.5rem 1rem',
            border: `2px dashed ${file ? '#00274C' : 'rgba(0,39,76,0.2)'}`,
            background: file ? 'rgba(0,39,76,0.04)' : '#faf9f7',
            cursor: 'pointer', marginBottom: 16, transition: 'all 0.2s',
            borderRadius: 8,
          }}>
            <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0] ?? null)} />
            {file ? (
              <>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#00274C' }}>{file.name}</div>
                <div style={{ fontSize: 12, color: '#8a8880', marginTop: 4 }}>Click to change</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 28, marginBottom: 8 }}>⬆️</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#00274C' }}>Click to upload a PDF</div>
                <div style={{ fontSize: 12, color: '#8a8880', marginTop: 4 }}>Max 20MB</div>
              </>
            )}
          </label>
          <Button onClick={() => { setStep('loading'); setTimeout(() => setStep('lobby'), 3000); }} disabled={!file}>
            Generate Quiz →
          </Button>
          <BackButton onClick={() => router.back()} label="← Back" />
        </PageShell>
      </>
    );
  }

  if (step === 'loading') {
    return (
      <>
        <Navbar name={name} courseCode={course?.code} />
        <PageShell>
          <div style={{ fontSize: 36, marginBottom: 16 }}>⚙️</div>
          <Title>Generating your quiz...</Title>
          <Sub>Our AI is reading your material and writing questions. This takes about 10–15 seconds.</Sub>
          <div style={{ width: '100%', height: 4, background: 'rgba(0,39,76,0.1)', overflow: 'hidden', marginTop: 8, borderRadius: 4 }}>
            <div style={{ height: '100%', background: '#00274C', animation: 'fill 3s linear forwards', borderRadius: 4 }} />
          </div>
          <div style={{ marginTop: 16, fontFamily: 'monospace', fontSize: 12, color: '#8a8880', letterSpacing: '0.06em' }}>
            Reading PDF → Generating questions → Almost done...
          </div>
          <style>{`@keyframes fill { from{width:0%} to{width:100%} }`}</style>
        </PageShell>
      </>
    );
  }

  return (
    <>
      <Navbar name={name} courseCode={course?.code} />
      <PageShell wide>
        <Label>Room Created</Label>
        <Title>Your room is ready</Title>
        <Sub>Share the code below with your friends so they can join.</Sub>

        {course && (
          <div style={{
            background: 'rgba(0,39,76,0.06)', border: '1px solid rgba(0,39,76,0.15)',
            borderRadius: 8, padding: '0.75rem 1rem', marginBottom: 20, textAlign: 'left',
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#00274C' }}>{course.code} · {course.name}</div>
            {topic && <div style={{ fontSize: 12, color: '#7a7870', marginTop: 4 }}>Topic: {topic}</div>}
          </div>
        )}

        <div style={{
          background: '#00274C', padding: '1.5rem',
          marginBottom: 20, textAlign: 'center', width: '100%', borderRadius: 8,
        }}>
          <div style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase' }}>Room Code</div>
          <div style={{ fontSize: 48, fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.2em', color: '#FFCB05' }}>{roomCode}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>Ask your friends to go to the site and enter this code</div>
        </div>

        <div style={{ width: '100%', textAlign: 'left', marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em', color: '#8a8880', marginBottom: 12, textTransform: 'uppercase' }}>Players joined</div>
          <PlayerRow name={name} isHost />
          <div style={{ fontSize: 13, color: '#8a8880', fontStyle: 'italic', marginTop: 8, textAlign: 'center' }}>Waiting for others to join...</div>
        </div>

        <Button onClick={() => router.push('/game/demo')}>Start Game →</Button>
        <div style={{ fontSize: 12, color: '#8a8880', marginTop: 8, fontFamily: 'monospace' }}>Only you (the host) can start the game</div>
      </PageShell>
    </>
  );
}

function PageShell({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div style={{
      minHeight: 'calc(100vh - 56px)', background: '#f5f4f0',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem',
      backgroundImage: 'linear-gradient(rgba(0,39,76,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,39,76,0.025) 1px, transparent 1px)',
      backgroundSize: '36px 36px',
    }}>
      <div style={{
        background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
        padding: '3rem 2.5rem', width: '100%', maxWidth: wide ? 520 : 440,
        textAlign: 'center', boxShadow: '0 2px 40px rgba(0,0,0,0.06)', position: 'relative',
        borderRadius: 12,
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#00274C', borderRadius: '12px 12px 0 0' }} />
        {children}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#00274C', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>{children}</div>;
}

function Title({ children }: { children: React.ReactNode }) {
  return <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#00274C', marginBottom: 8, lineHeight: 1.1 }}>{children}</h1>;
}

function Sub({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 14, color: '#7a7870', lineHeight: 1.7, marginBottom: 28 }}>{children}</p>;
}

function Button({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: '0.85rem',
      background: disabled ? '#e0ddd8' : '#00274C',
      border: 'none', color: disabled ? '#aaa' : '#FFCB05',
      fontFamily: 'monospace', fontSize: 13, fontWeight: 700,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      cursor: disabled ? 'not-allowed' : 'pointer', marginTop: 8,
      borderRadius: 8,
    }}>{children}</button>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', color: '#8a8880',
      fontSize: 13, fontFamily: 'monospace', cursor: 'pointer',
      marginTop: 12, letterSpacing: '0.05em',
    }}>{label}</button>
  );
}

function PlayerRow({ name, isHost }: { name: string; isHost?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px', background: '#f5f4f0',
      border: '1px solid rgba(0,0,0,0.06)', marginBottom: 6, borderRadius: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: '#00274C', color: '#FFCB05',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800,
        }}>{name[0]?.toUpperCase()}</div>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1916' }}>{name}</span>
      </div>
      {isHost && (
        <span style={{
          fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.08em',
          textTransform: 'uppercase', background: 'rgba(0,39,76,0.08)',
          color: '#00274C', padding: '3px 8px', border: '1px solid rgba(0,39,76,0.2)',
          fontWeight: 700, borderRadius: 4,
        }}>Host</span>
      )}
    </div>
  );
}