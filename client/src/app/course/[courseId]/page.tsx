'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Post = {
  id: string;
  author: string;
  initial: string;
  text: string;
  tag: 'Notes' | 'Video' | 'Battle Request' | 'Practice Exam';
  time: string;
};

const TAG_STYLES: Record<string, { bg: string; color: string; emoji: string }> = {
  'Notes':          { bg: '#FFCB05', color: '#00274C', emoji: '📎' },
  'Video':          { bg: '#00274C', color: '#FFCB05', emoji: '▶' },
  'Battle Request': { bg: '#FFCB05', color: '#00274C', emoji: '⚔️' },
  'Practice Exam':  { bg: '#00274C', color: '#FFCB05', emoji: '📝' },
};

export default function CoursePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [postText, setPostText] = useState('');
  const [postTag, setPostTag] = useState<Post['tag']>('Notes');
  const [activeTab, setActiveTab] = useState<'community' | 'battles' | 'resources'>('community');

  useEffect(() => {
    const savedName = localStorage.getItem('studentName') || 'Student';
    setName(savedName);
    const savedPosts = JSON.parse(localStorage.getItem('coursePosts_eecs203') || '[]');
    setPosts(savedPosts);
  }, []);

  function submitPost() {
    if (!postText.trim()) return;
    const newPost: Post = {
      id: Date.now().toString(),
      author: name,
      initial: name[0]?.toUpperCase() || 'S',
      text: postText.trim(),
      tag: postTag,
      time: 'Just now',
    };
    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('coursePosts_eecs203', JSON.stringify(updated));
    setPostText('');
    setPostTag('Notes');
    setShowModal(false);
  }

  function deletePost(id: string) {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    localStorage.setItem('coursePosts_eecs203', JSON.stringify(updated));
  }

  const initial = name[0]?.toUpperCase() || 'S';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
              EECS · 4 Credits
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.01em', marginBottom: 6 }}>EECS 203</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Discrete Mathematics · Fall 2025 · Prof. Bhargava</p>
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
          {(['community', 'battles', 'resources'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '0.85rem 1.25rem', fontFamily: 'monospace', fontSize: 12,
              letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 700,
              cursor: 'pointer', border: 'none', background: 'none',
              color: activeTab === tab ? '#00274C' : '#8a8880',
              borderBottom: activeTab === tab ? '3px solid #FFCB05' : '3px solid transparent',
              marginBottom: -2, transition: 'color 0.15s',
            }}>
              {tab === 'community' ? 'Community' : tab === 'battles' ? 'Quiz Battles' : 'Resources'}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 2.5rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* ACTION CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            {[
              { icon: '⚔️', title: 'Make Test Room', sub: 'Host a live quiz battle', primary: true },
              { icon: '🚪', title: 'Join Test Room', sub: 'Enter a 6-digit code', primary: false },
              { icon: '📄', title: 'Community Tests', sub: 'Browse shared quizzes', primary: false },
            ].map(card => (
              <div key={card.title} style={{
                background: card.primary ? '#00274C' : '#fff',
                border: `1px solid ${card.primary ? '#00274C' : 'rgba(0,0,0,0.08)'}`,
                borderRadius: 12, padding: '1.25rem', cursor: 'pointer',
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
                <div style={{ fontSize: '1.4rem' }}>{card.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: card.primary ? '#FFCB05' : '#00274C' }}>{card.title}</div>
                <div style={{ fontSize: 11, fontFamily: 'monospace', color: card.primary ? 'rgba(255,255,255,0.5)' : '#8a8880' }}>{card.sub}</div>
              </div>
            ))}
          </div>

          {/* COMMUNITY FEED */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8a8880', fontWeight: 700 }}>
                Community Feed
              </div>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  background: '#00274C', border: 'none', color: '#FFCB05',
                  fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.07em',
                  textTransform: 'uppercase', fontWeight: 800, padding: '6px 14px',
                  borderRadius: 8, cursor: 'pointer', transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >+ Post</button>
            </div>

            {posts.length === 0 ? (
              <div style={{
                background: '#fff', border: '2px dashed rgba(0,39,76,0.15)',
                borderRadius: 12, padding: '3rem 2rem', textAlign: 'center',
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>💬</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#00274C', marginBottom: 6 }}>No posts yet</div>
                <div style={{ fontSize: 13, color: '#8a8880', marginBottom: 18 }}>Be the first to share something with the class.</div>
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    background: '#00274C', border: 'none', color: '#FFCB05',
                    fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.08em',
                    textTransform: 'uppercase', fontWeight: 800, padding: '8px 18px',
                    borderRadius: 8, cursor: 'pointer',
                  }}
                >+ Add First Post</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {posts.map(post => {
                  const style = TAG_STYLES[post.tag];
                  const isMe = post.author === name;
                  return (
                    <div key={post.id} style={{
                      background: '#fff', border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 10, padding: '1rem 1.25rem',
                      display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
                      transition: 'border-color 0.15s',
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,39,76,0.22)'}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,0,0,0.08)'}
                    >
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
                          {isMe && <span style={{
                            marginLeft: 8, fontSize: 9, fontFamily: 'monospace',
                            background: '#FFCB05', color: '#00274C',
                            padding: '1px 6px', borderRadius: 4, fontWeight: 800,
                          }}>YOU</span>}
                          &nbsp;·&nbsp; {post.time}
                        </div>
                        <div style={{ fontSize: 13, color: '#2a2926', lineHeight: 1.5 }}>{post.text}</div>
                        <div style={{
                          display: 'inline-block', marginTop: 8,
                          fontSize: 10, fontFamily: 'monospace',
                          background: style.bg, color: style.color,
                          padding: '2px 8px', borderRadius: 5, fontWeight: 800,
                          letterSpacing: '0.05em',
                        }}>{style.emoji} {post.tag}</div>
                      </div>
                      {isMe && (
                        <button
                          onClick={() => deletePost(post.id)}
                          title="Delete post"
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 15, color: 'rgba(0,0,0,0.18)', padding: '2px',
                            transition: 'color 0.15s', flexShrink: 0,
                          }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#c0392b')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.18)')}
                        >🗑</button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* PERFORMANCE */}
          <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: '1.5rem' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#00274C', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              My Performance
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#8a8880', fontWeight: 400 }}>No battles yet</span>
            </div>
            {[['Logic', 0], ['Sets', 0], ['Induction', 0], ['Graph Theory', 0], ['Relations', 0]].map(([label, pct]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                <div style={{ fontSize: 12, color: '#5a5856', width: 100, flexShrink: 0 }}>{label}</div>
                <div style={{ flex: 1, height: 7, background: 'rgba(0,39,76,0.07)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 10, background: '#00274C', width: `${pct}%`, transition: 'width 0.4s' }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#00274C', fontFamily: 'monospace', width: 36, textAlign: 'right' }}>—</div>
              </div>
            ))}
          </div>

          {/* LEADERBOARD */}
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
              Play battles to climb the board 🏆
            </div>
          </div>

          {/* UPCOMING */}
          <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: '1.5rem' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#00274C', marginBottom: '1rem' }}>Upcoming</div>
            {[
              { label: 'Midterm Exam', date: 'Thu, Nov 14 · 6:00 PM', yellow: true },
              { label: 'HW 7 Due', date: 'Fri, Nov 15 · 11:59 PM', yellow: false },
              { label: 'Quiz Battle Night', date: 'Sat, Nov 16 · 8:00 PM', yellow: true },
            ].map((item, i, arr) => (
              <div key={item.label} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.6rem 0',
                borderBottom: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.yellow ? '#FFCB05' : '#00274C', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#8a8880' }}>{item.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* POST MODAL */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, padding: '1rem',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 16, padding: '2rem',
              width: '100%', maxWidth: 480,
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 800, color: '#00274C', marginBottom: '1.25rem' }}>New Post</div>

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
              <button onClick={() => setShowModal(false)} style={{
                background: 'none', border: '1.5px solid rgba(0,0,0,0.12)',
                color: '#5a5856', padding: '8px 18px', borderRadius: 8,
                fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.07em',
                textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={submitPost} disabled={!postText.trim()} style={{
                background: postText.trim() ? '#00274C' : 'rgba(0,0,0,0.08)',
                border: 'none', color: postText.trim() ? '#FFCB05' : '#8a8880',
                padding: '8px 20px', borderRadius: 8,
                fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.07em',
                textTransform: 'uppercase', fontWeight: 800,
                cursor: postText.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.15s',
              }}>Post →</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}