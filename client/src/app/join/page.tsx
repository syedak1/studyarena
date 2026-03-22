'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getRoomByCode } from '../../lib/api';
import { getSocket } from '../../lib/socket';

interface PlayerInfo { id: string; name: string; isHost: boolean }

export default function JoinRoomPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [players, setPlayers] = useState<PlayerInfo[]>([]);
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState('');
  const tried = useRef(false);

  useEffect(() => {
    const n = localStorage.getItem('studentName');
    const t = localStorage.getItem('token');
    if (!n || !t) { router.push('/'); return; }
    setName(n);

    // If dashboard stored a pending code, auto-join immediately
    const pending = localStorage.getItem('pendingJoinCode');
    if (pending && !tried.current) {
      tried.current = true;
      localStorage.removeItem('pendingJoinCode');
      setCode(pending);
      joinRoom(pending);
    }
  }, [router]);

  async function joinRoom(joinCode: string) {
    setError('');
    try {
      const room = await getRoomByCode(joinCode);
      setRoomId(room.id);

      const socket = getSocket();
      socket.connect();
      const token = localStorage.getItem('token');
      socket.emit('join-room', { roomId: room.id, token });

      socket.on('room-update', (data: { players: PlayerInfo[]; status: string }) => {
        setPlayers(data.players);
        if (data.status === 'ACTIVE') {
          router.push(`/game/${room.id}`);
        }
      });

      socket.on('question', () => {
        router.push(`/game/${room.id}`);
      });

      socket.on('error', (data: { message: string }) => {
        setError(data.message);
      });

      setJoined(true);
    } catch {
      setError('Room not found. Check the code and try again.');
    }
  }

  function handleSubmit() {
    if (code.trim().length !== 6) { setError('Code must be 6 characters.'); return; }
    joinRoom(code.trim());
  }

  // ─── LOBBY (after joining) ───
  if (joined) {
    return (
      <Shell name={name}>
        <Label>Waiting for host</Label>
        <Title>You&apos;re in!</Title>
        <Sub>The host will start the game when everyone is ready.</Sub>
        <div style={{ background: '#00274C', padding: '1.25rem', marginBottom: 20, textAlign: 'center', width: '100%', borderRadius: 8 }}>
          <div style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '.1em', color: 'rgba(255,255,255,.5)', marginBottom: 6, textTransform: 'uppercase' }}>Room Code</div>
          <div style={{ fontSize: 36, fontFamily: 'monospace', fontWeight: 800, letterSpacing: '.2em', color: '#FFCB05' }}>{code}</div>
        </div>
        <div style={{ width: '100%', textAlign: 'left', marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontFamily: 'monospace', letterSpacing: '.1em', color: '#8a8880', marginBottom: 12, textTransform: 'uppercase' }}>Players ({players.length})</div>
          {players.map(p => <PlayerRow key={p.id} name={p.name} isHost={p.isHost} />)}
        </div>
        <div style={{ width: '100%', padding: '1rem', background: 'rgba(0,39,76,.06)', border: '1px solid rgba(0,39,76,.15)', fontFamily: 'monospace', fontSize: 12, color: '#00274C', letterSpacing: '.06em', textAlign: 'center', fontWeight: 600, borderRadius: 8 }}>⏳ Waiting for host to start...</div>
      </Shell>
    );
  }

  // ─── CODE ENTRY (only if no pending code) ───
  return (
    <Shell name={name}>
      <Label>Join a Room</Label>
      <Title>Enter the room code</Title>
      <Sub>Ask the host for their 6-character code.</Sub>
      {error && <div style={{ fontSize: 13, color: '#c0392b', marginBottom: 12, fontFamily: 'monospace', background: 'rgba(192,57,43,.08)', padding: '8px 12px', borderRadius: 8, width: '100%', textAlign: 'center' }}>⚠ {error}</div>}
      <input type="text" placeholder="XK7M2P" value={code} onChange={e => setCode(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && handleSubmit()} maxLength={6} autoFocus style={{ width: '100%', padding: '14px 18px', border: '1.5px solid rgba(0,39,76,.2)', borderRadius: 10, fontSize: 28, fontFamily: 'monospace', letterSpacing: '.25em', color: '#00274C', outline: 'none', textAlign: 'center', boxSizing: 'border-box', marginBottom: 16 }} />
      <button onClick={handleSubmit} disabled={code.trim().length !== 6} style={{ width: '100%', padding: '.85rem', background: code.trim().length === 6 ? '#00274C' : '#e0ddd8', border: 'none', color: code.trim().length === 6 ? '#FFCB05' : '#aaa', fontFamily: 'monospace', fontSize: 13, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', cursor: code.trim().length === 6 ? 'pointer' : 'not-allowed', borderRadius: 8 }}>Join Room →</button>
      <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', color: '#8a8880', fontSize: 13, fontFamily: 'monospace', cursor: 'pointer', marginTop: 12 }}>← Back</button>
    </Shell>
  );
}

function Shell({ children, name }: { children: React.ReactNode; name: string }) {
  const router = useRouter();
  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', fontFamily: 'sans-serif' }}>
      <nav style={{ background: '#00274C', borderBottom: '3px solid #FFCB05', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 10 }}>
        <div onClick={() => router.push('/dashboard')} style={{ fontWeight: 900, fontSize: 18, color: '#fff', cursor: 'pointer' }}>STUDY<span style={{ color: '#FFCB05' }}>ARENA</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFCB05', color: '#00274C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{name[0]?.toUpperCase()}</div>
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,.85)' }}>{name}</span>
        </div>
      </nav>
      <div style={{ minHeight: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', backgroundImage: 'linear-gradient(rgba(0,39,76,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,39,76,.025) 1px,transparent 1px)', backgroundSize: '36px 36px' }}>
        <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,.08)', padding: '3rem 2.5rem', width: '100%', maxWidth: 440, textAlign: 'center', boxShadow: '0 2px 40px rgba(0,0,0,.06)', position: 'relative', borderRadius: 12 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#00274C', borderRadius: '12px 12px 0 0' }} />
          {children}
        </div>
      </div>
    </div>
  );
}
function Label({ children }: { children: React.ReactNode }) { return <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#00274C', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>{children}</div>; }
function Title({ children }: { children: React.ReactNode }) { return <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#00274C', marginBottom: 8, lineHeight: 1.1 }}>{children}</h1>; }
function Sub({ children }: { children: React.ReactNode }) { return <p style={{ fontSize: 14, color: '#7a7870', lineHeight: 1.7, marginBottom: 24 }}>{children}</p>; }
function PlayerRow({ name, isHost }: { name: string; isHost?: boolean }) {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f5f4f0', border: '1px solid rgba(0,0,0,.06)', marginBottom: 6, borderRadius: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#00274C', color: '#FFCB05', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{name[0]?.toUpperCase()}</div>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1916' }}>{name}</span>
    </div>
    {isHost && <span style={{ fontSize: 10, fontFamily: 'monospace', letterSpacing: '.08em', textTransform: 'uppercase', background: 'rgba(0,39,76,.08)', color: '#00274C', padding: '3px 8px', border: '1px solid rgba(0,39,76,.2)', fontWeight: 700, borderRadius: 4 }}>Host</span>}
  </div>;
}