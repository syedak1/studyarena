'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Trophy, Plus, Trash2, Reply, X, Calendar, ChevronDown, User, ArrowLeft } from 'lucide-react';

const ALL_COURSES: Record<string, { code: string; name: string; credits: number; category: string }> = {
  eecs281: { code: 'EECS 281', name: 'Data Structures & Algorithms', credits: 4, category: 'EECS' },
  eecs203: { code: 'EECS 203', name: 'Discrete Mathematics', credits: 4, category: 'EECS' },
  eecs280: { code: 'EECS 280', name: 'Programming & Data Structures', credits: 4, category: 'EECS' },
  eecs376: { code: 'EECS 376', name: 'Foundations of Computer Science', credits: 4, category: 'EECS' },
  eecs482: { code: 'EECS 482', name: 'Operating Systems', credits: 4, category: 'EECS' },
  eecs485: { code: 'EECS 485', name: 'Web Systems', credits: 4, category: 'EECS' },
  math215: { code: 'MATH 215', name: 'Multivariable Calculus', credits: 4, category: 'MATH' },
  math216: { code: 'MATH 216', name: 'Differential Equations', credits: 4, category: 'MATH' },
  math217: { code: 'MATH 217', name: 'Linear Algebra', credits: 4, category: 'MATH' },
  math412: { code: 'MATH 412', name: 'Introduction to Modern Algebra', credits: 3, category: 'MATH' },
  phys140: { code: 'PHYS 140', name: 'General Physics I', credits: 4, category: 'PHYS' },
  phys240: { code: 'PHYS 240', name: 'General Physics II', credits: 4, category: 'PHYS' },
  chem130: { code: 'CHEM 130', name: 'General Chemistry', credits: 3, category: 'CHEM' },
  stats426: { code: 'STATS 426', name: 'Introduction to Probability', credits: 3, category: 'STATS' },
  econ101: { code: 'ECON 101', name: 'Principles of Economics', credits: 4, category: 'ECON' },
};

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  'Notes': { bg: '#FFCB05', color: '#00274C' }, 'Video': { bg: '#00274C', color: '#FFCB05' },
  'Battle Request': { bg: '#FFCB05', color: '#00274C' }, 'Practice Exam': { bg: '#00274C', color: '#FFCB05' },
};
const PERF = ['Conceptual Understanding', 'Problem Solving', 'Speed & Accuracy', 'Exam Readiness', 'Consistency'];

type Post = { id: string; author: string; initial: string; text: string; tag: string; time: string; replies: { id: string; author: string; initial: string; text: string; time: string }[] };
type Ev = { id: string; title: string; date: string; time: string };

export default function Dashboard() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [enrolled, setEnrolled] = useState<string[]>([]);
  const [courseId, setCourseId] = useState('');
  const [showDrop, setShowDrop] = useState(false);
  const [tab, setTab] = useState<'competitive' | 'resources'>('competitive');
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Ev[]>([]);

  // Modals
  const [showMake, setShowMake] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const [battleTopic, setBattleTopic] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [postText, setPostText] = useState('');
  const [postTag, setPostTag] = useState('Notes');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [evTitle, setEvTitle] = useState('');
  const [evDate, setEvDate] = useState('');
  const [evTime, setEvTime] = useState('');

  useEffect(() => {
    const n = localStorage.getItem('studentName');
    const t = localStorage.getItem('token');
    if (!n || !t) { router.push('/'); return; }
    setName(n);
    const c: string[] = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    if (c.length === 0) { router.push('/onboarding'); return; }
    setEnrolled(c);
    const last = localStorage.getItem('lastCourseId');
    setCourseId(c.includes(last || '') ? last! : c[0]);
  }, [router]);

  useEffect(() => {
    if (!courseId) return;
    localStorage.setItem('lastCourseId', courseId);
    setPosts(JSON.parse(localStorage.getItem(`coursePosts_${courseId}`) || '[]'));
    setEvents(JSON.parse(localStorage.getItem(`courseEvents_${courseId}`) || '[]'));
  }, [courseId]);

  const course = ALL_COURSES[courseId];
  const initial = name[0]?.toUpperCase() || 'S';
  const enrolledList = enrolled.map(id => ({ id, ...ALL_COURSES[id] })).filter(c => c.code);

  // ─── Actions ───
  function doMakeRoom() {
    localStorage.setItem('battleTopic', battleTopic);
    localStorage.setItem('battleCourse', JSON.stringify({ code: course?.code, name: course?.name, id: courseId }));
    setShowMake(false);
    router.push('/create');
  }
  function doJoinRoom() {
    localStorage.setItem('pendingJoinCode', joinCode.trim().toUpperCase());
    localStorage.setItem('battleCourse', JSON.stringify({ code: course?.code, name: course?.name, id: courseId }));
    setShowJoin(false);
    router.push('/join');
  }
  function submitPost() {
    if (!postText.trim()) return;
    const p: Post = { id: Date.now().toString(), author: name, initial, text: postText.trim(), tag: postTag, time: 'Just now', replies: [] };
    const u = [p, ...posts]; setPosts(u);
    localStorage.setItem(`coursePosts_${courseId}`, JSON.stringify(u));
    setPostText(''); setPostTag('Notes'); setShowPost(false);
  }
  function deletePost(id: string) { const u = posts.filter(p => p.id !== id); setPosts(u); localStorage.setItem(`coursePosts_${courseId}`, JSON.stringify(u)); }
  function submitReply(pid: string) {
    if (!replyText.trim()) return;
    const r = { id: Date.now().toString(), author: name, initial, text: replyText.trim(), time: 'Just now' };
    const u = posts.map(p => p.id === pid ? { ...p, replies: [...p.replies, r] } : p); setPosts(u);
    localStorage.setItem(`coursePosts_${courseId}`, JSON.stringify(u));
    setReplyText(''); setReplyingTo(null);
  }
  function submitEvent() {
    if (!evTitle.trim() || !evDate) return;
    const e: Ev = { id: Date.now().toString(), title: evTitle.trim(), date: evDate, time: evTime };
    const u = [...events, e].sort((a, b) => a.date.localeCompare(b.date)); setEvents(u);
    localStorage.setItem(`courseEvents_${courseId}`, JSON.stringify(u));
    setEvTitle(''); setEvDate(''); setEvTime(''); setShowEvent(false);
  }
  function deleteEvent(id: string) { const u = events.filter(e => e.id !== id); setEvents(u); localStorage.setItem(`courseEvents_${courseId}`, JSON.stringify(u)); }

  if (!course) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', fontFamily: 'sans-serif', color: '#1a1916' }}>
      {/* NAVBAR */}
      <nav style={{ background: '#00274C', borderBottom: '3px solid #FFCB05', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontWeight: 900, fontSize: 17, color: '#fff', letterSpacing: '.03em' }}>STUDY<span style={{ color: '#FFCB05' }}>ARENA</span></div>
          {/* Course selector dropdown */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowDrop(!showDrop)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,203,5,.12)', border: '1px solid rgba(255,203,5,.25)', color: '#FFCB05', padding: '5px 12px', borderRadius: 8, fontFamily: 'monospace', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
              {course.code} <ChevronDown size={14} />
            </button>
            {showDrop && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, background: '#fff', border: '1px solid rgba(0,0,0,.1)', borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,.15)', minWidth: 240, zIndex: 200, overflow: 'hidden' }}>
                {enrolledList.map(c => (
                  <div key={c.id} onClick={() => { setCourseId(c.id); setShowDrop(false); }} style={{ padding: '10px 16px', cursor: 'pointer', background: c.id === courseId ? 'rgba(0,39,76,.06)' : 'transparent', borderLeft: c.id === courseId ? '3px solid #FFCB05' : '3px solid transparent' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#00274C' }}>{c.code}</div>
                    <div style={{ fontSize: 11, color: '#8a8880' }}>{c.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/onboarding')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.7)', padding: '5px 12px', fontFamily: 'monospace', fontSize: 11, textTransform: 'uppercase', cursor: 'pointer', borderRadius: 6 }}>
            <User size={12} /> Courses
          </button>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFCB05', color: '#00274C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{initial}</div>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,.8)' }}>{name}</span>
        </div>
      </nav>

      {/* COURSE HEADER */}
      <div style={{ background: '#00274C', borderBottom: '4px solid #FFCB05', padding: '1.5rem 2.5rem 1.25rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,203,5,.12)', color: 'rgba(255,203,5,.85)', fontFamily: 'monospace', fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 20, marginBottom: '.5rem' }}>
              <div style={{ width: 6, height: 6, background: '#FFCB05', borderRadius: '50%', animation: 'pulse 2s infinite' }} />{course.category} · {course.credits} Credits
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff', marginBottom: 4 }}>{course.code}</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)' }}>{course.name}</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: '#f5f4f0', borderBottom: '2px solid rgba(0,0,0,.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2.5rem', display: 'flex' }}>
          {(['competitive', 'resources'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: '.85rem 1.25rem', fontFamily: 'monospace', fontSize: 12, letterSpacing: '.07em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', border: 'none', background: 'none', color: tab === t ? '#00274C' : '#8a8880', borderBottom: tab === t ? '3px solid #FFCB05' : '3px solid transparent', marginBottom: -2 }}>{t}</button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 2.5rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
        {tab === 'competitive' ? (<>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Action cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
              <ActionCard dark icon={<Zap size={20} color="#FFCB05" strokeWidth={1.5} />} title="Make Test Room" sub="Host a live quiz battle" onClick={() => setShowMake(true)} />
              <ActionCard icon={<Trophy size={20} color="#00274C" strokeWidth={1.5} />} title="Join Test Room" sub="Enter a 6-digit code" onClick={() => setShowJoin(true)} />
            </div>
            {/* Performance */}
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,.08)', borderRadius: 14, padding: '1.5rem' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#00274C', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>My Performance <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#8a8880', fontWeight: 400 }}>No battles yet</span></div>
              {PERF.map(label => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '.6rem' }}>
                  <div style={{ fontSize: 12, color: '#5a5856', width: 160, flexShrink: 0 }}>{label}</div>
                  <div style={{ flex: 1, height: 7, background: 'rgba(0,39,76,.07)', borderRadius: 10 }}><div style={{ height: '100%', borderRadius: 10, background: '#00274C', width: '0%' }} /></div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#00274C', fontFamily: 'monospace', width: 36, textAlign: 'right' }}>—</div>
                </div>
              ))}
            </div>
          </div>
          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Leaderboard */}
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,.08)', borderRadius: 14, padding: '1.5rem' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#00274C', marginBottom: '1rem' }}>Leaderboard</div>
              <div style={{ background: 'rgba(255,203,5,.1)', border: '1px solid rgba(255,203,5,.25)', borderRadius: 10, padding: '.75rem 1rem', display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                <div style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 800, color: '#8a8880', width: 20 }}>1</div>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFCB05', color: '#00274C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{initial}</div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#2a2926' }}>{name} <span style={{ marginLeft: 8, fontSize: 9, fontFamily: 'monospace', background: '#FFCB05', color: '#00274C', padding: '1px 6px', borderRadius: 4, fontWeight: 800 }}>YOU</span></div>
                <div style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 800, color: '#00274C' }}>0 pts</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem 0 .25rem', fontSize: 12, color: '#8a8880' }}>Play battles to climb the board</div>
            </div>
            {/* Events */}
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,.08)', borderRadius: 14, padding: '1.5rem' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#00274C', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Upcoming <button onClick={() => setShowEvent(true)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#00274C', border: 'none', color: '#FFCB05', fontFamily: 'monospace', fontSize: 10, textTransform: 'uppercase', fontWeight: 800, padding: '4px 10px', borderRadius: 6, cursor: 'pointer' }}><Plus size={10} /> Add</button>
              </div>
              {events.length === 0 ? <div style={{ textAlign: 'center', padding: '1.5rem 0', fontSize: 12, color: '#8a8880' }}>Nothing scheduled yet.</div> : events.map(ev => (
                <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.6rem .75rem', background: 'rgba(0,39,76,.03)', border: '1px solid rgba(0,39,76,.07)', borderRadius: 8, marginBottom: 6 }}>
                  <Calendar size={13} color="#FFCB05" strokeWidth={2} />
                  <div style={{ flex: 1 }}><div style={{ fontSize: 12, fontWeight: 700, color: '#00274C' }}>{ev.title}</div><div style={{ fontSize: 10, fontFamily: 'monospace', color: '#8a8880' }}>{ev.date}{ev.time ? ` · ${ev.time}` : ''}</div></div>
                  <button onClick={() => deleteEvent(ev.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,.18)', padding: 2, display: 'flex' }}><X size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        </>) : (<>
          {/* RESOURCES TAB */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#8a8880', fontWeight: 700 }}>Class Resources</div>
              <button onClick={() => setShowPost(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#00274C', border: 'none', color: '#FFCB05', fontFamily: 'monospace', fontSize: 11, textTransform: 'uppercase', fontWeight: 800, padding: '6px 14px', borderRadius: 8, cursor: 'pointer' }}><Plus size={12} /> Post</button>
            </div>
            {posts.length === 0 ? (
              <div style={{ background: '#fff', border: '2px dashed rgba(0,39,76,.15)', borderRadius: 12, padding: '3rem 2rem', textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#00274C', marginBottom: 6 }}>No resources yet</div>
                <div style={{ fontSize: 13, color: '#8a8880', marginBottom: 18 }}>Be the first to share notes or practice exams.</div>
              </div>
            ) : posts.map(post => {
              const ts = TAG_STYLES[post.tag] || TAG_STYLES['Notes'];
              const isMe = post.author === name;
              return (
                <div key={post.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,.08)', borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ padding: '1rem 1.25rem', display: 'flex', gap: '.85rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: isMe ? '#FFCB05' : '#00274C', color: isMe ? '#00274C' : '#FFCB05', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{post.initial}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: '#8a8880', marginBottom: 4 }}><strong style={{ color: '#00274C' }}>{post.author}</strong>{isMe && <span style={{ marginLeft: 8, fontSize: 9, fontFamily: 'monospace', background: '#FFCB05', color: '#00274C', padding: '1px 6px', borderRadius: 4, fontWeight: 800 }}>YOU</span>} · {post.time}</div>
                      <div style={{ fontSize: 13, color: '#2a2926', lineHeight: 1.5, marginBottom: 8 }}>{post.text}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'monospace', background: ts.bg, color: ts.color, padding: '2px 8px', borderRadius: 5, fontWeight: 800 }}>{post.tag}</div>
                        <button onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, fontFamily: 'monospace', color: '#8a8880', padding: 0 }}><Reply size={11} /> Reply {post.replies?.length > 0 ? `(${post.replies.length})` : ''}</button>
                      </div>
                    </div>
                    {isMe && <button onClick={() => deletePost(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,.18)', padding: 2, display: 'flex', flexShrink: 0 }}><Trash2 size={14} /></button>}
                  </div>
                  {post.replies?.length > 0 && <div style={{ borderTop: '1px solid rgba(0,0,0,.05)', background: 'rgba(0,39,76,.02)', padding: '.75rem 1.25rem .75rem 3.5rem', display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                    {post.replies.map(r => <div key={r.id} style={{ display: 'flex', gap: '.6rem' }}><div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: r.author === name ? '#FFCB05' : '#00274C', color: r.author === name ? '#00274C' : '#FFCB05', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>{r.initial}</div><div><div style={{ fontSize: 11, color: '#8a8880', marginBottom: 2 }}><strong style={{ color: '#00274C' }}>{r.author}</strong> · {r.time}</div><div style={{ fontSize: 12, color: '#2a2926', lineHeight: 1.5 }}>{r.text}</div></div></div>)}
                  </div>}
                  {replyingTo === post.id && <div style={{ borderTop: '1px solid rgba(0,0,0,.06)', padding: '.75rem 1.25rem', display: 'flex', gap: '.6rem' }}>
                    <input type="text" placeholder="Write a reply..." value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === 'Enter' && submitReply(post.id)} autoFocus style={{ flex: 1, padding: '6px 10px', border: '1.5px solid rgba(0,39,76,.2)', borderRadius: 7, fontSize: 13, color: '#1a1916', outline: 'none' }} />
                    <button onClick={() => submitReply(post.id)} disabled={!replyText.trim()} style={{ background: replyText.trim() ? '#00274C' : 'rgba(0,0,0,.08)', border: 'none', color: replyText.trim() ? '#FFCB05' : '#8a8880', padding: '6px 12px', borderRadius: 7, fontFamily: 'monospace', fontSize: 11, fontWeight: 800, cursor: replyText.trim() ? 'pointer' : 'not-allowed' }}>Send</button>
                  </div>}
                </div>
              );
            })}
          </div>
          <div />
        </>)}
      </div>

      {/* MODALS */}
      {showMake && <Modal onClose={() => setShowMake(false)}>
        <MTitle>Create a Battle Room</MTitle>
        <div style={{ fontSize: 12, color: '#8a8880', marginBottom: '1.5rem', fontFamily: 'monospace' }}>{course.code} · {course.name}</div>
        <MLabel>Topic / Chapter</MLabel>
        <textarea placeholder="e.g. Chapter 3 — Graph Theory..." value={battleTopic} onChange={e => setBattleTopic(e.target.value)} rows={4} autoFocus style={{ ...inputStyle, resize: 'none' }} />
        <MActions><MBtn secondary onClick={() => setShowMake(false)}>Cancel</MBtn><MBtn onClick={doMakeRoom} disabled={!battleTopic.trim()}>Create Room →</MBtn></MActions>
      </Modal>}

      {showJoin && <Modal onClose={() => setShowJoin(false)}>
        <MTitle>Join a Battle Room</MTitle>
        <div style={{ fontSize: 12, color: '#8a8880', marginBottom: '1.5rem', fontFamily: 'monospace' }}>{course.code}</div>
        <MLabel>Room Code</MLabel>
        <input type="text" placeholder="e.g. XK7M2P" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} onKeyDown={e => { if (e.key === 'Enter' && joinCode.trim().length === 6) doJoinRoom(); }} maxLength={6} autoFocus style={{ ...inputStyle, letterSpacing: '.2em', fontSize: 22, textAlign: 'center' }} />
        <MActions><MBtn secondary onClick={() => setShowJoin(false)}>Cancel</MBtn><MBtn onClick={doJoinRoom} disabled={joinCode.trim().length !== 6}>Join Room →</MBtn></MActions>
      </Modal>}

      {showPost && <Modal onClose={() => setShowPost(false)}>
        <MTitle>New Resource</MTitle>
        <MLabel>Tag</MLabel>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {['Notes', 'Video', 'Battle Request', 'Practice Exam'].map(t => (
            <button key={t} onClick={() => setPostTag(t)} style={{ padding: '5px 12px', border: '1.5px solid', borderColor: postTag === t ? '#00274C' : 'rgba(0,0,0,.12)', background: postTag === t ? '#00274C' : 'transparent', color: postTag === t ? '#FFCB05' : '#5a5856', fontFamily: 'monospace', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', borderRadius: 7, cursor: 'pointer' }}>{t}</button>
          ))}
        </div>
        <MLabel>Message</MLabel>
        <textarea placeholder="Share something with the class..." value={postText} onChange={e => setPostText(e.target.value)} rows={4} style={{ ...inputStyle, resize: 'none' }} />
        <MActions><MBtn secondary onClick={() => setShowPost(false)}>Cancel</MBtn><MBtn onClick={submitPost} disabled={!postText.trim()}>Post →</MBtn></MActions>
      </Modal>}

      {showEvent && <Modal onClose={() => setShowEvent(false)}>
        <MTitle>Add Event</MTitle>
        <MLabel>Title</MLabel>
        <input type="text" placeholder="e.g. Midterm Exam..." value={evTitle} onChange={e => setEvTitle(e.target.value)} autoFocus style={inputStyle} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginBottom: '1.5rem' }}>
          <div><MLabel>Date</MLabel><input type="date" value={evDate} onChange={e => setEvDate(e.target.value)} style={inputStyle} /></div>
          <div><MLabel>Time</MLabel><input type="time" value={evTime} onChange={e => setEvTime(e.target.value)} style={inputStyle} /></div>
        </div>
        <MActions><MBtn secondary onClick={() => setShowEvent(false)}>Cancel</MBtn><MBtn onClick={submitEvent} disabled={!evTitle.trim() || !evDate}>Add →</MBtn></MActions>
      </Modal>}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}

// ─── Shared UI ───
function ActionCard({ dark, icon, title, sub, onClick }: { dark?: boolean; icon: React.ReactNode; title: string; sub: string; onClick: () => void }) {
  return <div onClick={onClick} style={{ background: dark ? '#00274C' : '#fff', border: `1px solid ${dark ? '#00274C' : 'rgba(0,0,0,.08)'}`, borderRadius: 12, padding: '1.5rem', cursor: 'pointer', transition: 'all .15s', display: 'flex', flexDirection: 'column', gap: '.5rem' }}
    onMouseEnter={e => { (e.currentTarget).style.transform = 'translateY(-2px)'; (e.currentTarget).style.boxShadow = '0 6px 20px rgba(0,39,76,.12)'; }}
    onMouseLeave={e => { (e.currentTarget).style.transform = 'translateY(0)'; (e.currentTarget).style.boxShadow = 'none'; }}>
    <div style={{ width: 36, height: 36, borderRadius: 8, background: dark ? 'rgba(255,203,5,.15)' : 'rgba(0,39,76,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
    <div style={{ fontSize: 14, fontWeight: 800, color: dark ? '#FFCB05' : '#00274C' }}>{title}</div>
    <div style={{ fontSize: 11, fontFamily: 'monospace', color: dark ? 'rgba(255,255,255,.5)' : '#8a8880' }}>{sub}</div>
  </div>;
}
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
    <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 500, boxShadow: '0 20px 60px rgba(0,0,0,.2)' }}>{children}</div>
  </div>;
}
function MTitle({ children }: { children: React.ReactNode }) { return <div style={{ fontSize: 16, fontWeight: 800, color: '#00274C', marginBottom: 4 }}>{children}</div>; }
function MLabel({ children }: { children: React.ReactNode }) { return <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8a8880', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>{children}</div>; }
function MActions({ children }: { children: React.ReactNode }) { return <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end' }}>{children}</div>; }
function MBtn({ children, onClick, disabled, secondary }: { children: React.ReactNode; onClick: () => void; disabled?: boolean; secondary?: boolean }) {
  if (secondary) return <button onClick={onClick} style={{ background: 'none', border: '1.5px solid rgba(0,0,0,.12)', color: '#5a5856', padding: '8px 18px', borderRadius: 8, fontFamily: 'monospace', fontSize: 11, textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer' }}>{children}</button>;
  return <button onClick={onClick} disabled={disabled} style={{ background: disabled ? 'rgba(0,0,0,.08)' : '#00274C', border: 'none', color: disabled ? '#8a8880' : '#FFCB05', padding: '8px 20px', borderRadius: 8, fontFamily: 'monospace', fontSize: 11, textTransform: 'uppercase', fontWeight: 800, cursor: disabled ? 'not-allowed' : 'pointer' }}>{children}</button>;
}
const inputStyle: React.CSSProperties = { width: '100%', padding: '.75rem 1rem', border: '1.5px solid rgba(0,39,76,.2)', borderRadius: 10, fontSize: 14, color: '#1a1916', outline: 'none', boxSizing: 'border-box', marginBottom: '1rem' };