import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Globe, Trophy, Calendar, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { icon: <Users size={20}/>, label: 'Find Alumni', path: '/directory', color: '#2563eb', bg: '#eff6ff' },
  { icon: <Briefcase size={20}/>, label: 'Job Board', path: '/directory', color: '#0891b2', bg: '#ecfeff' },
  { icon: <Calendar size={20}/>, label: 'Events', path: '/events', color: '#7c3aed', bg: '#f5f3ff' },
  { icon: <Trophy size={20}/>, label: 'Mentors', path: '/mentorship', color: '#d97706', bg: '#fffbeb' },
];

const Hero = () => (
  <section className="hero">
    {/* Diagonal blue background */}
    <div className="hero-grid container" style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:'3.5rem', alignItems:'center', padding:'4rem 2.5rem', position:'relative', zIndex:1, width:'100%' }}>

      {/* Left */}
      <motion.div className="hero-content"
        initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, ease:[0.23,1,0.32,1] }}>

        <motion.div className="badge" style={{ marginBottom:'1.25rem' }}
          initial={{ opacity:0, scale:0.88 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.2 }}>
          <Sparkles size={12}/> Transcend Alumni Network
        </motion.div>

        <h1 className="hero-title">
          Your Alumni<br/>
          <span className="text-gradient">Community Awaits</span>
        </h1>

        <p className="hero-subtitle">
          Connect with 50,000+ Transcend graduates across 120 countries. Discover mentors, exclusive jobs, and events tailored for you.
        </p>

        <div className="hero-btns">
          <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
            <Link to="/register" className="btn btn-primary">Get Started Free <ArrowRight size={16}/></Link>
          </motion.div>
          <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
            <Link to="/directory" className="btn btn-outline">Browse Alumni</Link>
          </motion.div>
        </div>

        <div className="hero-stats-preview">
          {[{val:'50K+',lbl:'Alumni'},{val:'120+',lbl:'Countries'},{val:'5K+',lbl:'Mentors'},{val:'85',lbl:'Chapters'}].map((s,i)=>(
            <React.Fragment key={i}>
              {i>0 && <div style={{width:'1px',background:'var(--border)'}}/>}
              <div className="stat-item"><div className="val">{s.val}</div><div className="lbl">{s.lbl}</div></div>
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* Right panel */}
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {/* Quick actions */}
        <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.25, duration:0.6 }}>
          <div style={{ background:'var(--white)', borderRadius:'var(--radius-xl)', border:'1px solid var(--border)', padding:'1.5rem', boxShadow:'var(--shadow-md)' }}>
            <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'1rem' }}>Quick Access</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              {quickLinks.map((q,i)=>(
                <motion.div key={i} whileHover={{ scale:1.03, y:-2 }} whileTap={{ scale:0.97 }}>
                  <Link to={q.path} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem', padding:'1rem', borderRadius:'var(--radius-md)', background:q.bg, border:`1px solid ${q.color}20`, textDecoration:'none', transition:'var(--transition)' }}>
                    <div style={{ color:q.color }}>{q.icon}</div>
                    <span style={{ fontSize:'0.8rem', fontWeight:700, color:q.color }}>{q.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Upcoming event */}
        <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.4, duration:0.6 }}>
          <div style={{ background:'linear-gradient(135deg,var(--blue-700),var(--blue-600))', borderRadius:'var(--radius-lg)', padding:'1.25rem 1.5rem', color:'#fff' }}>
            <div style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', opacity:0.75, marginBottom:'0.5rem' }}>📅 Upcoming Event</div>
            <div style={{ fontWeight:800, fontSize:'1rem', marginBottom:'0.25rem' }}>Annual Alumni Gala 2026</div>
            <div style={{ fontSize:'0.85rem', opacity:0.8, marginBottom:'1rem' }}>June 15 · Bengaluru Convention Centre</div>
            <Link to="/events" style={{ background:'rgba(255,255,255,0.2)', color:'#fff', padding:'0.4rem 1rem', borderRadius:'var(--radius-md)', fontSize:'0.78rem', fontWeight:700, display:'inline-block', border:'1px solid rgba(255,255,255,0.25)' }}>Register →</Link>
          </div>
        </motion.div>

        {/* Live activity */}
        <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.5, duration:0.6 }}>
          <div style={{ background:'var(--white)', borderRadius:'var(--radius-lg)', border:'1px solid var(--border)', padding:'1.25rem 1.5rem', boxShadow:'var(--shadow-card)' }}>
            <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.875rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e', display:'inline-block' }}/>
              Live Activity
            </div>
            {[
              {name:'Arjun M.', action:'joined the network', time:'2m ago'},
              {name:'Priya K.', action:'posted a job opening', time:'5m ago'},
            ].map((a,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.5rem 0', borderTop: i>0 ? '1px solid var(--border)':'' }}>
                <div style={{ width:30, height:30, borderRadius:'50%', background:`linear-gradient(135deg,var(--blue-${600-i*100}),var(--blue-400))`, color:'#fff', fontSize:'0.75rem', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{a.name[0]}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <span style={{ fontSize:'0.8rem', fontWeight:700 }}>{a.name} </span>
                  <span style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{a.action}</span>
                </div>
                <span style={{ fontSize:'0.7rem', color:'var(--text-dim)', flexShrink:0 }}>{a.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default Hero;
