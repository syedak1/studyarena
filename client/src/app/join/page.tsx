'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRoomByCode } from '../../lib/api';
import { getSocket } from '../../lib/socket';

type Step = 'details' | 'lobby';

interface BattleCourse { code: string; name: string; id: string; }
interface PlayerInfo { id: string; name: string; isHost: boolean; }

function NavbarJoin({ name, courseCode }: { name: string; courseCode?: string }) {
  const router = useRouter();
  return (
    <nav style={{ background: '#00274C', borderBottom: '3px solid #FFCB05', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div onClick={() => router.push('/dashboard')} style={{ fontWeight: 900, fontSize: 18, color: '#fff', cursor: 'pointer' }}>
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
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFCB05', color: '#00274C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{name[0]?.toUpperCase()}</div>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>{name}</span>
        </div>
      )}
    </nav>
  );
}

export default function JoinRoomPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('details');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [course, setCourse] = useState<BattleCourse | null>(null);
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('studentName');
    if (saved) setName(saved);
    const savedCourse = localStorage.getItem('battleCourse');
    if (savedCourse) setCourse(JSON.parse(savedCourse));
  }, []);

  async function handleJoin() {
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (code.trim().length !== 6) { setError('Room code must be 6 characters.'); return; }
    setError('');

    try {
      // Look up the room by join code
      const room = await getRoomByCode(code.trim());
      setRoomId(room.id);

      // Connect socket and join
      const socket = getSocket();
      socket.connect();

      const token = localStorage.getItem('token');
      socket.emit('join-room', { roomId: room.id, token });

      socket.on('room-update', (data: { players: PlayerInfo[]; status: string }) => {
        setPlayers(data.players);
        // If host started the game, navigate to game page
        if (data.status === 'ACTIVE') {
          router.push(`/game/${room.id}`);
        }
      });

      // Also listen for the first question directly (in case room-update comes late)
      socket.on('question', () => {
        router.push(`/game/${room.id}`);
      });

      socket.on('error', (data: { message: string }) => {
        setError(data.message);
      });

      localStorage.setItem('studentName', name.trim());
      setStep('lobby');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Room not found. Check the code.');
    }
  }

  if (step === 'details') {
    return (
      <>
        <NavbarJoin name={name} courseCode={course?.code} />
        <PageShell>
          <Label>Join a Room</Label>
          <Title>Enter your details</Title>
          {course && (
            <div style={{ background: 'rgba(0,39,76,0.06)', border: '1px solid rgba(0,39,76,0.15)', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: 20, textAlign: 'left' }}>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8a8880', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Course</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#00274C' }}>{course.code}</div>
              <div style={{ fontSize: 12, color: '#7a7870' }}>{course.name}</div>
            </div>
          )}
          <Sub>Type in your name and the room code from your host.</Sub>
          {error && <div style={{ fontSize: 13, color: '#c0392b', marginBottom: 8, fontFamily: 'monospace' }}>⚠ {error}</div>}
          <FieldLabel>Your name</FieldLabel>
          <input type="text" placeholder="e.g. Kazim" value={name} onChange={e => setName(e.target.value)} style={inputStyle} autoFocus />
          <FieldLabel>Room code</FieldLabel>
          <input type="text" placeholder="e.g. XK7M2P" value={code} onChange={e => setCode(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && handleJoin()} maxLength={6} style={{ ...inputStyle, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 20, textAlign: 'center' as const }} />
          <Button onClick={handleJoin} disabled={!name.trim() || code.length !== 6}>Join Room →</Button>
          <BackButton onClick={() => router.back()} />
        </PageShell>
      </>
    );
  }

  return (
    <>
      <NavbarJoin name={name} courseCode={course?.code} />
      <PageShell>
        <Label>Waiting for host</Label>
        <Title>You&apos;re in!</Title>
        <Sub>The host will start the game when everyone is ready.</Sub>
        <div style={{ background: '#00274C', padding: '1.25rem', marginBottom: 20, textAlign: 'center', width: '100%', borderRadius: 8 }}>
          <div style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', marginBottom: 6, textTransform: 'uppercase' }}>Room Code</div>
          <div style={{ fontSize: 36, fontFamily: 'monospace', fontWeight: 800, letterSpacing: '0.2em', color: '#FFCB05' }}>{code}</div>
        </div>
        <div style={{ width: '100%', textAlign: 'left', marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '0.1em', color: '#8a8880', marginBottom: 12, textTransform: 'uppercase' }}>Players in room ({players.length})</div>
          {players.map(p => (
            <PlayerRow key={p.id} name={p.name} isHost={p.isHost} />
          ))}
          {players.length < 2 && <div style={{ fontSize: 13, color: '#8a8880', fontStyle: 'italic', marginTop: 8, textAlign: 'center' }}>Waiting for more players...</div>}
        </div>
        <div style={{ width: '100%', padding: '1rem', background: 'rgba(0,39,76,0.06)', border: '1px solid rgba(0,39,76,0.15)', fontFamily: 'monospace', fontSize: 12, color: '#00274C', letterSpacing: '0.06em', textAlign: 'center', fontWeight: 600, borderRadius: 8 }}>
          ⏳ Waiting for host to start...
        </div>
      </PageShell>
    </>
  );
}

// ─── Shared Components ───
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#f5f4f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', backgroundImage: 'linear-gradient(rgba(0,39,76,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,39,76,0.025) 1px, transparent 1px)', backgroundSize: '36px 36px' }}>
      <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', padding: '3rem 2.5rem', width: '100%', maxWidth: 440, textAlign: 'center', boxShadow: '0 2px 40px rgba(0,0,0,0.06)', position: 'relative', borderRadius: 12 }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#00274C', borderRadius: '12px 12px 0 0' }} />
        {children}
      </div>
    </div>
  );
}
function Label({ children }: { children: React.ReactNode }) { return <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#00274C', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>{children}</div>; }
function Title({ children }: { children: React.ReactNode }) { return <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#00274C', marginBottom: 8, lineHeight: 1.1 }}>{children}</h1>; }
function Sub({ children }: { children: React.ReactNode }) { return <p style={{ fontSize: 14, color: '#7a7870', lineHeight: 1.7, marginBottom: 24 }}>{children}</p>; }
function FieldLabel({ children }: { children: React.ReactNode }) { return <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#00274C', letterSpacing: '0.06em', textAlign: 'left' as const, marginBottom: 6, textTransform: 'uppercase' as const, fontWeight: 700 }}>{children}</div>; }
function Button({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return <button onClick={onClick} disabled={disabled} style={{ width: '100%', padding: '0.85rem', background: disabled ? '#e0ddd8' : '#00274C', border: 'none', color: disabled ? '#aaa' : '#FFCB05', fontFamily: 'monospace', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: disabled ? 'not-allowed' : 'pointer', marginTop: 8, borderRadius: 8 }}>{children}</button>;
}
function BackButton({ onClick }: { onClick: () => void }) { return <button onClick={onClick} style={{ background: 'none', border: 'none', color: '#8a8880', fontSize: 13, fontFamily: 'monospace', cursor: 'pointer', marginTop: 12, letterSpacing: '0.05em' }}>← Back</button>; }
function PlayerRow({ name, isHost }: { name: string; isHost?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f5f4f0', border: '1px solid rgba(0,0,0,0.06)', marginBottom: 6, borderRadius: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#00274C', color: '#FFCB05', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{name[0]?.toUpperCase()}</div>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1916' }}>{name}</span>
      </div>
      {isHost && <span style={{ fontSize: 10, fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', background: 'rgba(0,39,76,0.08)', color: '#00274C', padding: '3px 8px', border: '1px solid rgba(0,39,76,0.2)', fontWeight: 700, borderRadius: 4 }}>Host</span>}
    </div>
  );
}
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.85rem 1rem', border: '1px solid rgba(0,0,0,0.12)', background: '#faf9f7', fontSize: 15, color: '#1a1916', outline: 'none', marginBottom: 16, fontFamily: 'inherit', borderRadius: 8 };