'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Zap, BookOpen, Trophy, ArrowLeft, Plus, Trash2, Reply, X, Calendar } from 'lucide-react';

type ContentType = 'text' | 'pdf' | 'youtube' | 'image';

type Reply = {
  id: string;
  author: string;
  initial: string;
  text: string;
  time: string;
};

type Post = {
  id: string;
  author: string;
  initial: string;
  text: string;
  tag: 'Notes' | 'Video' | 'Battle Request' | 'Practice Exam';
  contentType: ContentType;
  contentUrl?: string;
  time: string;
  replies: Reply[];
};

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
};

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  'Notes':          { bg: '#FFCB05', color: '#00274C' },
  'Video':          { bg: '#00274C', color: '#FFCB05' },
  'Battle Request': { bg: '#FFCB05', color: '#00274C' },
  'Practice Exam':  { bg: '#00274C', color: '#FFCB05' },
};

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

const PERFORMANCE_CRITERIA = [
  'Conceptual Understanding',
  'Problem Solving',
  'Speed & Accuracy',
  'Exam Readiness',
  'Consistency',
];

export default function CoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;
  const course = ALL_COURSES[courseId];

  const [name, setName] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showMakeModal, setShowMakeModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [battleTopic, setBattleTopic] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [postText, setPostText] = useState('');
  const [postTag, setPostTag] = useState<Post['tag']>('Notes');
  const [postContentType, setPostContentType] = useState<ContentType>('text');
  const [postContentUrl, setPostContentUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'competitive' | 'resources'>('competitive');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('studentName') || 'Student';
    setName(savedName);
    const savedPosts = JSON.parse(localStorage.getItem(`coursePosts_${courseId}`) || '[]');
    const savedEvents = JSON.parse(localStorage.getItem(`courseEvents_${courseId}`) || '[]');
    setPosts(savedPosts);
    setEvents(savedEvents);
  }, [courseId]);

  function submitPost() {
    if (!postText.trim()) return;
    const newPost: Post = {
      id: Date.now().toString(),
      author: name,
      initial: name[0]?.toUpperCase() || 'S',
      text: postText.trim(),
      tag: postTag,
      contentType: postContentType,
      contentUrl: postContentUrl.trim() || undefined,
      time: 'Just now',
      replies: [],
    };
    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem(`coursePosts_${courseId}`, JSON.stringify(updated));
    setPostText('');
    setPostTag('Notes');
    setPostContentType('text');
    setPostContentUrl('');
    setShowModal(false);
  }

  function deletePost(id: string) {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    localStorage.setItem(`coursePosts_${courseId}`, JSON.stringify(updated));
  }

  function submitReply(postId: string) {
    if (!replyText.trim()) return;
    const newReply: Reply = {
      id: Date.now().toString(),
      author: name,
      initial: name[0]?.toUpperCase() || 'S',
      text: replyText.trim(),
      time: 'Just now',
    };
    const updated = posts.map(p =>
      p.id === postId ? { ...p, replies: [...(p.replies || []), newReply] } : p
    );
    setPosts(updated);
    localStorage.setItem(`coursePosts_${courseId}`, JSON.stringify(updated));
    setReplyText('');
    setReplyingTo(null);
  }

  function submitEvent() {
    if (!eventTitle.trim() || !eventDate) return;
    const newEvent: Event = {
      id: Date.now().toString(),
      title: eventTitle.trim(),
      date: eventDate,
      time: eventTime,
    };
    const updated = [...events, newEvent].sort((a, b) => a.date.localeCompare(b.date));
    setEvents(updated);
    localStorage.setItem(`courseEvents_${courseId}`, JSON.stringify(updated));
    setEventTitle('');
    setEventDate('');
    setEventTime('');
    setShowEventModal(false);
  }

  function deleteEvent(id: string) {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated);
    localStorage.setItem(`courseEvents_${courseId}`, JSON.stringify(updated));
  }

  const initial = name[0]?.toUpperCase() || 'S';

  if (!course) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f4f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#00274C', marginBottom: 16 }}>Course not found</div>
          <button onClick={() => router.push('/dashboard')} style={{
            background: '#00274C', border: 'none', color: '#FFCB05',
            padding: '0.7rem 1.5rem', fontFamily: 'monospace', fontSize: 12,
            letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 700,
          }}>← Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4f0', fontFamily: 'sans-serif', color: '#1a1916' }}>

      {/* NAVBAR */}
      <nav style={{
        background: '#00274C', borderBottom: '3px solid #FFCB05',
        height: 56, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 2rem',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div
          onClick={() => router.push('/dashboard')}
          style={{ fontWeight: 900, fontSize: 17, color: '#fff', letterSpacing: '0.03em', cursor: 'pointer' }}
        >
          STUDY<span style={{ color: '#FFCB05' }}>ARENA</span>
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.3)', marginLeft: 10, letterSpacing: '0.1em' }}>UMICH</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.6)', padding: '5px 14px',
              fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.08em',
              textTransform: 'uppercase', cursor: 'pointer', borderRadius: 6, transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)';
              (e.currentTarget as HTMLButtonElement).style.color = '#fff';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)';
            }}
          >
            <ArrowLeft size={12} /> Dashboard
          </button>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#FFCB05', color: '#00274C',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800,
          }}>{initial}</div>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{name}</span>
        </div>
      </nav>

      {/* HERO BANNER */}
      <div style={{ background: '#00274C', borderBottom: '4px solid #FFCB05', padding: '2rem 2.5rem 1.75rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,203,5,0.12)', color: 'rgba(255,203,5,0.85)',
              fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.12em',
              textTransform: 'uppercase', padding: '5px 12px', borderRadius: 20, marginBottom: '0.75rem',
            }}>
              <div style={{ width: 6, height: 6, background: '#FFCB05', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              {course.category} · 4 Credits
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', marginBottom: 6 }}>{course.code}</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{course.name}</p>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[['0', 'Battles played'], ['—', 'Avg score'], ['—', 'Leaderboard']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFCB05' }}>{val}</div>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: '#f5f4f0', borderBottom: '2px solid rgba(0,0,0,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2.5rem', display: 'flex' }}>
          {(['competitive', 'resources'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '0.85rem 1.25rem', fontFamily: 'monospace', fontSize: 12,
              letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700,
              cursor: 'pointer', border: 'none', background: 'none',
              color: activeTab === tab ? '#00274C' : '#8a8880',
              borderBottom: activeTab === tab ? '3px solid #FFCB05' : '3px solid transparent',
              marginBottom: -2, transition: 'color 0.15s',
            }}>
              {tab === 'competitive' ? 'Competitive' : 'Resources'}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 2.5rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>

        {/* COMPETITIVE TAB */}
        {activeTab === 'competitive' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* ACTION CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { icon: <Zap size={20} color="#FFCB05" strokeWidth={1.5} />, title: 'Make Test Room', sub: 'Host a live quiz battle', primary: true, onClick: () => setShowMakeModal(true) },
                  { icon: <Trophy size={20} color="#00274C" strokeWidth={1.5} />, title: 'Join Test Room', sub: 'Enter a 6-digit code', primary: false, onClick: () => setShowJoinModal(true) },
                ].map(card => (
                  <div key={card.title} onClick={card.onClick} style={{
                    background: card.primary ? '#00274C' : '#fff',
                    border: `1px solid ${card.primary ? '#00274C' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: 12, padding: '1.5rem', cursor: 'pointer',
                    transition: 'all 0.15s', display: 'flex', flexDirection: 'column', gap: '0.5rem',
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(0,39,76,0.12)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: card.primary ? 'rgba(255,203,5,0.15)' : 'rgba(0,39,76,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {card.icon}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: card.primary ? '#FFCB05' : '#00274C' }}>{card.title}</div>
                    <div style={{ fontSize: 11, fontFamily: 'monospace', color: card.primary ? 'rgba(255,255,255,0.5)' : '#8a8880' }}>{card.sub}</div>
                  </div>
                ))}
              </div>

              {/* PERFORMANCE */}
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: '1.5rem' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#00274C', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  My Performance
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#8a8880', fontWeight: 400 }}>No battles yet</span>
                </div>
                {PERFORMANCE_CRITERIA.map(label => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                    <div style={{ fontSize: 12, color: '#5a5856', width: 160, flexShrink: 0 }}>{label}</div>
                    <div style={{ flex: 1, height: 7, background: 'rgba(0,39,76,0.07)', borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 10, background: '#00274C', width: '0%' }} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#00274C', fontFamily: 'monospace', width: 36, textAlign: 'right' }}>—</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: '1.5rem' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#00274C', marginBottom: '1rem' }}>Leaderboard</div>
                <div style={{
                  background: 'rgba(255,203,5,0.1)', border: '1px solid rgba(255,203,5,0.25)',
                  borderRadius: 10, padding: '0.75rem 1rem',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                  <div style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 800, color: '#8a8880', width: 20 }}>1</div>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: '#FFCB05', color: '#00274C',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800,
                  }}>{initial}</div>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#2a2926' }}>
                    {name}
                    <span style={{
                      marginLeft: 8, fontSize: 9, fontFamily: 'monospace',
                      background: '#FFCB05', color: '#00274C',
                      padding: '1px 6px', borderRadius: 4, fontWeight: 800,
                    }}>YOU</span>
                  </div>
                  <div style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 800, color: '#00274C' }}>0 pts</div>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem 0 0.25rem', fontSize: 12, color: '#8a8880' }}>
                  Play battles to climb the board
                </div>
              </div>

              {/* UPCOMING */}
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: '1.5rem' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#00274C', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Upcoming
                  <button
                    onClick={() => setShowEventModal(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      background: '#00274C', border: 'none', color: '#FFCB05',
                      fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.07em',
                      textTransform: 'uppercase', fontWeight: 800, padding: '4px 10px',
                      borderRadius: 6, cursor: 'pointer',
                    }}
                  >
                    <Plus size={10} /> Add
                  </button>
                </div>
                {events.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0', fontSize: 12, color: '#8a8880' }}>
                    Nothing scheduled yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {events.map(ev => (
                      <div key={ev.id} style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.6rem 0.75rem',
                        background: 'rgba(0,39,76,0.03)',
                        border: '1px solid rgba(0,39,76,0.07)',
                        borderRadius: 8,
                      }}>
                        <Calendar size={13} color="#FFCB05" strokeWidth={2} style={{ flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#00274C' }}>{ev.title}</div>
                          <div style={{ fontSize: 10, fontFamily: 'monospace', color: '#8a8880' }}>
                            {ev.date}{ev.time ? ` · ${ev.time}` : ''}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteEvent(ev.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.18)', padding: 2, transition: 'color 0.15s', display: 'flex' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#c0392b')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.18)')}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a8880', fontWeight: 700 }}>
                  Class Resources
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: '#00274C', border: 'none', color: '#FFCB05',
                    fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.07em',
                    textTransform: 'uppercase', fontWeight: 800, padding: '6px 14px',
                    borderRadius: 8, cursor: 'pointer',
                  }}
                >
                  <Plus size={12} /> Post
                </button>
              </div>

              {posts.length === 0 ? (
                <div style={{
                  background: '#fff', border: '2px dashed rgba(0,39,76,0.15)',
                  borderRadius: 12, padding: '3rem 2rem', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#00274C', marginBottom: 6 }}>No resources yet</div>
                  <div style={{ fontSize: 13, color: '#8a8880', marginBottom: 18 }}>Be the first to share notes, videos, or practice exams.</div>
                  <button
                    onClick={() => setShowModal(true)}
                    style={{
                      background: '#00274C', border: 'none', color: '#FFCB05',
                      fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.08em',
                      textTransform: 'uppercase', fontWeight: 800, padding: '8px 18px',
                      borderRadius: 8, cursor: 'pointer',
                    }}
                  >+ Add First Resource</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {posts.map(post => {
                    const tagStyle = TAG_STYLES[post.tag];
                    const isMe = post.author === name;
                    return (
                      <div key={post.id} style={{
                        background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: 12, overflow: 'hidden',
                        transition: 'border-color 0.15s',
                      }}>
                        <div style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: isMe ? '#FFCB05' : '#00274C',
                            color: isMe ? '#00274C' : '#FFCB05',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 800, flexShrink: 0,
                          }}>{post.initial}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 11, color: '#8a8880', marginBottom: 4 }}>
                              <strong style={{ color: '#00274C', fontWeight: 700 }}>{post.author}</strong>
                              {isMe && (
                                <span style={{
                                  marginLeft: 8, fontSize: 9, fontFamily: 'monospace',
                                  background: '#FFCB05', color: '#00274C',
                                  padding: '1px 6px', borderRadius: 4, fontWeight: 800,
                                }}>YOU</span>
                              )}
                              &nbsp;·&nbsp; {post.time}
                            </div>
                            <div style={{ fontSize: 13, color: '#2a2926', lineHeight: 1.5, marginBottom: 8 }}>{post.text}</div>

                            {/* Content attachment */}
                            {post.contentUrl && post.contentType === 'youtube' && (
                              <a href={post.contentUrl} target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                fontSize: 11, fontFamily: 'monospace', color: '#00274C',
                                background: 'rgba(0,39,76,0.06)', padding: '4px 10px',
                                borderRadius: 6, textDecoration: 'none', marginBottom: 8,
                              }}>
                                <BookOpen size={11} /> YouTube Link
                              </a>
                            )}
                            {post.contentUrl && post.contentType === 'pdf' && (
                              <a href={post.contentUrl} target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                fontSize: 11, fontFamily: 'monospace', color: '#00274C',
                                background: 'rgba(0,39,76,0.06)', padding: '4px 10px',
                                borderRadius: 6, textDecoration: 'none', marginBottom: 8,
                              }}>
                                <BookOpen size={11} /> PDF Document
                              </a>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                fontSize: 10, fontFamily: 'monospace',
                                background: tagStyle.bg, color: tagStyle.color,
                                padding: '2px 8px', borderRadius: 5, fontWeight: 800,
                                letterSpacing: '0.05em',
                              }}>{post.tag}</div>
                              <button
                                onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 4,
                                  background: 'none', border: 'none', cursor: 'pointer',
                                  fontSize: 11, fontFamily: 'monospace', color: '#8a8880',
                                  padding: 0, transition: 'color 0.15s',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#00274C')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#8a8880')}
                              >
                                <Reply size={11} /> Reply {post.replies?.length > 0 ? `(${post.replies.length})` : ''}
                              </button>
                            </div>
                          </div>
                          {isMe && (
                            <button
                              onClick={() => deletePost(post.id)}
                              style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'rgba(0,0,0,0.18)', padding: '2px', display: 'flex',
                                transition: 'color 0.15s', flexShrink: 0,
                              }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#c0392b')}
                              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.18)')}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        {/* Replies */}
                        {post.replies?.length > 0 && (
                          <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,39,76,0.02)', padding: '0.75rem 1.25rem 0.75rem 3.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {post.replies.map(reply => (
                              <div key={reply.id} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                                <div style={{
                                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                                  background: reply.author === name ? '#FFCB05' : '#00274C',
                                  color: reply.author === name ? '#00274C' : '#FFCB05',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 10, fontWeight: 800,
                                }}>{reply.initial}</div>
                                <div>
                                  <div style={{ fontSize: 11, color: '#8a8880', marginBottom: 2 }}>
                                    <strong style={{ color: '#00274C' }}>{reply.author}</strong> · {reply.time}
                                  </div>
                                  <div style={{ fontSize: 12, color: '#2a2926', lineHeight: 1.5 }}>{reply.text}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply input */}
                        {replyingTo === post.id && (
                          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '0.75rem 1.25rem', display: 'flex', gap: '0.6rem' }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                              background: '#FFCB05', color: '#00274C',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 11, fontWeight: 800,
                            }}>{initial}</div>
                            <div style={{ flex: 1, display: 'flex', gap: '0.5rem' }}>
                              <input
                                type="text"
                                placeholder="Write a reply..."
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && submitReply(post.id)}
                                autoFocus
                                style={{
                                  flex: 1, padding: '6px 10px',
                                  border: '1.5px solid rgba(0,39,76,0.2)',
                                  borderRadius: 7, fontSize: 13, fontFamily: 'inherit',
                                  color: '#1a1916', outline: 'none',
                                }}
                                onFocus={e => (e.currentTarget.style.borderColor = '#FFCB05')}
                                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,39,76,0.2)')}
                              />
                              <button
                                onClick={() => submitReply(post.id)}
                                disabled={!replyText.trim()}
                                style={{
                                  background: replyText.trim() ? '#00274C' : 'rgba(0,0,0,0.08)',
                                  border: 'none', color: replyText.trim() ? '#FFCB05' : '#8a8880',
                                  padding: '6px 12px', borderRadius: 7,
                                  fontFamily: 'monospace', fontSize: 11, fontWeight: 800,
                                  cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                                }}
                              >Send</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: '1.5rem' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#00274C', marginBottom: '0.75rem' }}>Post Types</div>
                {Object.entries(TAG_STYLES).map(([tag, style]) => (
                  <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{
                      fontSize: 10, fontFamily: 'monospace', fontWeight: 800,
                      background: style.bg, color: style.color,
                      padding: '3px 8px', borderRadius: 5, letterSpacing: '0.05em',
                    }}>{tag}</div>
                  </div>
                ))}
                <div style={{ fontSize: 12, color: '#8a8880', marginTop: 8, lineHeight: 1.6 }}>
                  Tag your post so classmates can filter what they need.
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* POST MODAL */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 500, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#00274C', marginBottom: '1.25rem' }}>New Resource</div>

            {/* Tag */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8a8880', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Tag</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(['Notes', 'Video', 'Battle Request', 'Practice Exam'] as Post['tag'][]).map(t => (
                  <button key={t} onClick={() => setPostTag(t)} style={{
                    padding: '5px 12px', border: '1.5px solid',
                    borderColor: postTag === t ? '#00274C' : 'rgba(0,0,0,0.12)',
                    background: postTag === t ? '#00274C' : 'transparent',
                    color: postTag === t ? '#FFCB05' : '#5a5856',
                    fontFamily: 'monospace', fontSize: 11, fontWeight: 800,
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    borderRadius: 7, cursor: 'pointer', transition: 'all 0.15s',
                  }}>{t}</button>
                ))}
              </div>
            </div>

            {/* Content type */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8a8880', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Content Type</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['text', 'pdf', 'youtube', 'image'] as ContentType[]).map(t => (
                  <button key={t} onClick={() => setPostContentType(t)} style={{
                    padding: '5px 12px', border: '1.5px solid',
                    borderColor: postContentType === t ? '#FFCB05' : 'rgba(0,0,0,0.12)',
                    background: postContentType === t ? '#FFCB05' : 'transparent',
                    color: postContentType === t ? '#00274C' : '#5a5856',
                    fontFamily: 'monospace', fontSize: 11, fontWeight: 800,
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                    borderRadius: 7, cursor: 'pointer', transition: 'all 0.15s',
                  }}>{t}</button>
                ))}
              </div>
            </div>

            {/* URL field for non-text types */}
            {(postContentType === 'pdf' || postContentType === 'youtube' || postContentType === 'image') && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8a8880', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>
                  {postContentType === 'youtube' ? 'YouTube URL' : postContentType === 'pdf' ? 'PDF URL' : 'Image URL'}
                </div>
                <input
                  type="text"
                  placeholder={postContentType === 'youtube' ? 'https://youtube.com/...' : 'https://...'}
                  value={postContentUrl}
                  onChange={e => setPostContentUrl(e.target.value)}
                  style={{
                    width: '100%', padding: '0.65rem 1rem',
                    border: '1.5px solid rgba(0,39,76,0.2)',
                    borderRadius: 10, fontSize: 13, fontFamily: 'inherit',
                    color: '#1a1916', outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#FFCB05')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,39,76,0.2)')}
                />
              </div>
            )}

            {/* Message */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8a8880', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Message</div>
              <textarea
                placeholder="Share something with the class..."
                value={postText}
                onChange={e => setPostText(e.target.value)}
                rows={4}
                style={{
                  width: '100%', padding: '0.75rem 1rem',
                  border: '1.5px solid rgba(0,39,76,0.2)',
                  borderRadius: 10, fontSize: 14, fontFamily: 'inherit',
                  color: '#1a1916', resize: 'none', outline: 'none',
                  transition: 'border-color 0.15s', boxSizing: 'border-box',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#FFCB05')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,39,76,0.2)')}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: '1.5px solid rgba(0,0,0,0.12)', color: '#5a5856', padding: '8px 18px', borderRadius: 8, fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              <button onClick={submitPost} disabled={!postText.trim()} style={{ background: postText.trim() ? '#00274C' : 'rgba(0,0,0,0.08)', border: 'none', color: postText.trim() ? '#FFCB05' : '#8a8880', padding: '8px 20px', borderRadius: 8, fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 800, cursor: postText.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.15s' }}>Post →</button>
            </div>
          </div>
        </div>
      )}

      {/* MAKE ROOM MODAL */}
      {showMakeModal && (
        <div onClick={() => setShowMakeModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#00274C', marginBottom: 4 }}>Create a Battle Room</div>
            <div style={{ fontSize: 12, color: '#8a8880', marginBottom: '1.5rem', fontFamily: 'monospace' }}>{course.code} · {course.name}</div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8a8880', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Topic / Chapter</div>
              <textarea
                placeholder="e.g. Chapter 3 — Graph Theory, DFS and BFS algorithms..."
                value={battleTopic}
                onChange={e => setBattleTopic(e.target.value)}
                rows={4}
                autoFocus
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1.5px solid rgba(0,39,76,0.2)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', color: '#1a1916', resize: 'none', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#FFCB05')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,39,76,0.2)')}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowMakeModal(false)} style={{ background: 'none', border: '1.5px solid rgba(0,0,0,0.12)', color: '#5a5856', padding: '8px 18px', borderRadius: 8, fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { localStorage.setItem('battleTopic', battleTopic); localStorage.setItem('battleCourse', JSON.stringify({ code: course.code, name: course.name, id: courseId })); router.push('/create'); }} disabled={!battleTopic.trim()} style={{ background: battleTopic.trim() ? '#00274C' : 'rgba(0,0,0,0.08)', border: 'none', color: battleTopic.trim() ? '#FFCB05' : '#8a8880', padding: '8px 20px', borderRadius: 8, fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 800, cursor: battleTopic.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.15s' }}>Create Room →</button>
            </div>
          </div>
        </div>
      )}

      {/* JOIN ROOM MODAL */}
      {showJoinModal && (
        <div onClick={() => setShowJoinModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#00274C', marginBottom: 4 }}>Join a Battle Room</div>
            <div style={{ fontSize: 12, color: '#8a8880', marginBottom: '1.5rem', fontFamily: 'monospace' }}>{course.code} · {course.name}</div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8a8880', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Room Code</div>
              <input
                type="text"
                placeholder="e.g. XK7M2P"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={e => { if (e.key === 'Enter' && joinCode.trim().length === 6) { localStorage.setItem('battleCourse', JSON.stringify({ code: course.code, name: course.name, id: courseId })); router.push('/join'); } }}
                maxLength={6}
                autoFocus
                style={{ width: '100%', padding: '14px 18px', border: '1.5px solid rgba(0,39,76,0.2)', borderRadius: 10, fontSize: 22, fontFamily: 'monospace', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00274C', outline: 'none', textAlign: 'center', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#FFCB05')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,39,76,0.2)')}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowJoinModal(false)} style={{ background: 'none', border: '1.5px solid rgba(0,0,0,0.12)', color: '#5a5856', padding: '8px 18px', borderRadius: 8, fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { if (joinCode.trim().length !== 6) return; localStorage.setItem('battleCourse', JSON.stringify({ code: course.code, name: course.name, id: courseId })); router.push('/join'); }} disabled={joinCode.trim().length !== 6} style={{ background: joinCode.trim().length === 6 ? '#00274C' : 'rgba(0,0,0,0.08)', border: 'none', color: joinCode.trim().length === 6 ? '#FFCB05' : '#8a8880', padding: '8px 20px', borderRadius: 8, fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 800, cursor: joinCode.trim().length === 6 ? 'pointer' : 'not-allowed', transition: 'all 0.15s' }}>Join Room →</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD EVENT MODAL */}
      {showEventModal && (
        <div onClick={() => setShowEventModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#00274C', marginBottom: '1.5rem' }}>Add Event</div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8a8880', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Title</div>
              <input
                type="text"
                placeholder="e.g. Midterm Exam, HW 3 Due..."
                value={eventTitle}
                onChange={e => setEventTitle(e.target.value)}
                autoFocus
                style={{ width: '100%', padding: '0.65rem 1rem', border: '1.5px solid rgba(0,39,76,0.2)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', color: '#1a1916', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#FFCB05')}
                onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,39,76,0.2)')}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8a8880', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Date</div>
                <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} style={{ width: '100%', padding: '0.65rem 1rem', border: '1.5px solid rgba(0,39,76,0.2)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', color: '#1a1916', outline: 'none', boxSizing: 'border-box' }} onFocus={e => (e.currentTarget.style.borderColor = '#FFCB05')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,39,76,0.2)')} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8a8880', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 700 }}>Time (optional)</div>
                <input type="time" value={eventTime} onChange={e => setEventTime(e.target.value)} style={{ width: '100%', padding: '0.65rem 1rem', border: '1.5px solid rgba(0,39,76,0.2)', borderRadius: 10, fontSize: 13, fontFamily: 'inherit', color: '#1a1916', outline: 'none', boxSizing: 'border-box' }} onFocus={e => (e.currentTarget.style.borderColor = '#FFCB05')} onBlur={e => (e.currentTarget.style.borderColor = 'rgba(0,39,76,0.2)')} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowEventModal(false)} style={{ background: 'none', border: '1.5px solid rgba(0,0,0,0.12)', color: '#5a5856', padding: '8px 18px', borderRadius: 8, fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              <button onClick={submitEvent} disabled={!eventTitle.trim() || !eventDate} style={{ background: (eventTitle.trim() && eventDate) ? '#00274C' : 'rgba(0,0,0,0.08)', border: 'none', color: (eventTitle.trim() && eventDate) ? '#FFCB05' : '#8a8880', padding: '8px 20px', borderRadius: 8, fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 800, cursor: (eventTitle.trim() && eventDate) ? 'pointer' : 'not-allowed', transition: 'all 0.15s' }}>Add →</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}