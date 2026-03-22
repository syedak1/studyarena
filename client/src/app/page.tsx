'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, BookOpen, Trophy } from 'lucide-react';
import { silentAuth } from '../lib/api';

const features = [
  { icon: Zap, title: 'Live Quiz Battles', desc: 'Challenge classmates in real-time. Answer faster, climb the board, dominate your lecture.' },
  { icon: BookOpen, title: 'Shared Note Library', desc: "Access notes from every course. Upload yours, unlock everyone else's." },
  { icon: Trophy, title: 'Course Leaderboards', desc: 'Every quiz room tracks your rank. Study more, score higher, own the semester.' },
];

export default function Home() {
  const [name, setName] = useState('');
  const [focused, setFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // If already logged in with courses, go straight to dashboard
    const token = localStorage.getItem('token');
    const courses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    if (token && courses.length > 0) {
      router.push('/dashboard');
      return;
    }
    const input = document.querySelector('input');
    if (input) input.focus({ preventScroll: true });
  }, [router]);

  async function handleEnter() {
    if (!name.trim() || loading) return;
    setLoading(true);
    setError('');
    try {
      await silentAuth(name.trim());
      // Check if user has courses already
      const courses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      if (courses.length >= 3) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Could not connect to server. Is the backend running on localhost:3001?');
      setLoading(false);
    }
  }

  const navItems = [
    { label: 'About', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'Features', href: '/features' },
  ];

  return (
    <div style={{ background: '#00274C', minHeight: '100vh', fontFamily: '"DM Sans", "Segoe UI", sans-serif', color: '#fff', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes grain { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-2%,-3%)} 30%{transform:translate(3%,2%)} 50%{transform:translate(-1%,4%)} 70%{transform:translate(4%,-1%)} 90%{transform:translate(-3%,1%)} }
        .f1{animation:fadeUp .7s ease both;animation-delay:.05s}
        .f2{animation:fadeUp .7s ease both;animation-delay:.15s}
        .f3{animation:fadeUp .7s ease both;animation-delay:.28s}
        .f4{animation:fadeUp .7s ease both;animation-delay:.42s}
        .f5{animation:fadeUp .7s ease both;animation-delay:.56s}
        input::placeholder{color:rgba(255,255,255,0.22)} input:focus{outline:none}
        .cta-btn{padding:15px 28px;background:#FFCB05;border:none;color:#00274C;font-family:'DM Mono',monospace;font-size:.78rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:all .2s;white-space:nowrap;flex-shrink:0}
        .cta-btn:hover{background:#ffe040;box-shadow:0 0 28px rgba(255,203,5,.45);transform:translateY(-1px)}
        .cta-btn:disabled{background:rgba(255,255,255,.06);color:rgba(255,255,255,.2);cursor:not-allowed;box-shadow:none;transform:none}
        .feature-card{padding:1.75rem;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:14px;transition:all .25s}
        .feature-card:hover{background:rgba(255,203,5,.05);border-color:rgba(255,203,5,.2);transform:translateY(-3px)}
        .nav-link{padding:0 1rem;height:56px;display:flex;align-items:center;font-size:13px;color:rgba(255,255,255,.55);cursor:pointer;transition:color .15s;user-select:none}
        .nav-link:hover{color:#fff}
      `}</style>

      <div style={{ position:'fixed',inset:0,zIndex:0,pointerEvents:'none',opacity:.04,backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,backgroundSize:'200px 200px',animation:'grain 8s steps(1) infinite'}} />
      <div style={{ position:'fixed',top:-250,right:-250,width:700,height:700,borderRadius:'50%',background:'radial-gradient(circle,rgba(255,203,5,.07) 0%,transparent 65%)',pointerEvents:'none',zIndex:0}} />
      <div style={{ position:'fixed',bottom:-200,left:-200,width:500,height:500,borderRadius:'50%',background:'radial-gradient(circle,rgba(0,100,180,.12) 0%,transparent 65%)',pointerEvents:'none',zIndex:0}} />
      <div style={{ position:'fixed',inset:0,zIndex:0,pointerEvents:'none',backgroundImage:'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)',backgroundSize:'60px 60px'}} />
      <div style={{ position:'fixed',bottom:0,left:0,right:0,height:3,background:'#FFCB05',zIndex:100}} />

      <nav style={{ position:'fixed',top:0,left:0,right:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 2.5rem',height:56,background:'rgba(0,39,76,.88)',backdropFilter:'blur(16px)',borderBottom:'1px solid rgba(255,255,255,.06)'}}>
        <div style={{ fontFamily:'"Bebas Neue",sans-serif',fontSize:'1.35rem',letterSpacing:'.1em',color:'#fff',cursor:'pointer',flexShrink:0}}>STUDY<span style={{color:'#FFCB05'}}>ARENA</span></div>
        <div style={{display:'flex',alignItems:'center'}}>{navItems.map(i=><div key={i.label} className="nav-link" onClick={()=>router.push(i.href)}>{i.label}</div>)}</div>
        <div style={{ fontFamily:'"DM Mono",monospace',fontSize:'.6rem',letterSpacing:'.12em',textTransform:'uppercase',color:'rgba(255,255,255,.3)',border:'1px solid rgba(255,255,255,.08)',padding:'5px 12px',flexShrink:0,borderRadius:6}}>University of Michigan</div>
      </nav>

      <section style={{ position:'relative',zIndex:1,minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'120px 2rem 6rem'}}>
        <div className={mounted?'f1':''} style={{ display:'inline-flex',alignItems:'center',gap:8,fontFamily:'"DM Mono",monospace',fontSize:'.66rem',letterSpacing:'.18em',textTransform:'uppercase',color:'rgba(255,203,5,.8)',marginBottom:'1.5rem',background:'rgba(255,203,5,.08)',padding:'6px 16px',borderRadius:20,border:'1px solid rgba(255,203,5,.15)'}}>
          <div style={{width:6,height:6,background:'#FFCB05',borderRadius:'50%',animation:'pulse 2s infinite'}} />UMich Study Community
        </div>
        <h1 className={mounted?'f2':''} style={{ fontFamily:'"Bebas Neue",sans-serif',fontSize:'clamp(2.2rem,5vw,4rem)',fontWeight:400,lineHeight:1.1,letterSpacing:'.03em',color:'#fff',marginBottom:'1.5rem',maxWidth:700}}>
          The academic network for students collaboration and <span style={{color:'#FFCB05'}}>competition.</span>
        </h1>
        <p className={mounted?'f3':''} style={{ fontSize:'1.05rem',color:'rgba(255,255,255,.55)',lineHeight:1.7,maxWidth:400,margin:'0 auto',fontWeight:300}}>
          Join your classmates, share notes, and compete<br/>in real-time quiz competitions built from and for Michigan students.
        </p>
        <div className={mounted?'f4':''} style={{ width:'100%',maxWidth:420,margin:'2rem auto 0'}}>
          <div style={{ display:'flex',borderRadius:10,overflow:'hidden',boxShadow:focused?'0 0 0 2px rgba(255,203,5,.4),0 20px 40px rgba(0,0,0,.3)':'0 20px 40px rgba(0,0,0,.25)',transition:'box-shadow .25s'}}>
            <input type="text" placeholder={loading?"Connecting...":"Enter your name..."} value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleEnter()} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} disabled={loading} style={{ flex:1,padding:'15px 20px',background:'rgba(255,255,255,.07)',border:'none',color:'#fff',fontFamily:'"DM Sans",sans-serif',fontSize:15}} />
            <button className="cta-btn" onClick={handleEnter} disabled={!name.trim()||loading}>{loading?'...':'Enter →'}</button>
          </div>
          {error && <p style={{ marginTop:'.5rem',fontSize:'.72rem',color:'#f87171',fontFamily:'"DM Mono",monospace'}}>{error}</p>}
          <p style={{ marginTop:'.75rem',fontFamily:'"DM Mono",monospace',fontSize:'.62rem',letterSpacing:'.08em',textTransform:'uppercase',color:'rgba(255,255,255,.2)',textAlign:'center'}}>No signup required · Works for any course</p>
        </div>
        <div className={mounted?'f5':''} style={{ marginTop:'3rem',fontFamily:'"DM Mono",monospace',fontSize:'.6rem',letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(255,255,255,.18)'}}>↓ See how it works</div>
      </section>

      <section style={{ position:'relative',zIndex:1,padding:'5rem 2.5rem 8rem',borderTop:'1px solid rgba(255,255,255,.05)',maxWidth:1100,margin:'0 auto'}}>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'1.25rem'}}>
          {features.map((f,i)=>{const Icon=f.icon;return(
            <div key={i} className="feature-card">
              <div style={{marginBottom:'1rem',width:46,height:46,background:'rgba(255,203,5,.1)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon size={20} color="#FFCB05" strokeWidth={1.5}/></div>
              <h3 style={{fontSize:'1rem',fontWeight:700,marginBottom:'.5rem',color:'#fff'}}>{f.title}</h3>
              <p style={{fontSize:'.85rem',color:'rgba(255,255,255,.4)',lineHeight:1.65,fontWeight:300}}>{f.desc}</p>
            </div>
          )})}
        </div>
      </section>

      <footer style={{ position:'relative',zIndex:1,padding:'1.75rem 2.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'1rem',borderTop:'1px solid rgba(255,255,255,.04)'}}>
        <div style={{fontFamily:'"Bebas Neue",sans-serif',fontSize:'1rem',letterSpacing:'.1em',color:'rgba(255,255,255,.3)'}}>STUDY<span style={{color:'rgba(255,203,5,.4)'}}>ARENA</span></div>
        <div style={{fontFamily:'"DM Mono",monospace',fontSize:'.6rem',letterSpacing:'.1em',textTransform:'uppercase',color:'rgba(255,255,255,.15)'}}>Built for Michigan Students · Go Blue</div>
      </footer>
    </div>
  );
}