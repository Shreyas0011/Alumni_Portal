import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe, Users, Trophy, Briefcase } from 'lucide-react';

const Counter = ({ value }) => {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const end = parseInt(value.replace(/\D/g, '')) || 0;
    const step = Math.max(1800 / end, 8);
    let cur = 0;
    const t = setInterval(() => { cur++; setN(cur); if (cur >= end) clearInterval(t); }, step);
    return () => clearInterval(t);
  }, [inView, value]);
  const suf = value.includes('K') ? 'K+' : value.includes('+') ? '+' : '';
  return <span ref={ref}>{n}{suf}</span>;
};

const stats = [
  { label:'Global Alumni', value:'50K+', icon:<Globe size={20}/>, desc:'across 120+ countries' },
  { label:'Total Members', value:'85K+', icon:<Users size={20}/>, desc:'and growing daily' },
  { label:'Job Referrals', value:'15K+', icon:<Briefcase size={20}/>, desc:'placed successfully' },
  { label:'Active Mentors', value:'2K+', icon:<Trophy size={20}/>, desc:'available to connect' },
];

const Stats = () => (
  <section className="stats-section">
    <div className="container">
      <div className="stats-grid">
        {stats.map((s, i) => (
          <motion.div key={i} className="stat-card"
            initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value"><Counter value={s.value}/></div>
            <div className="stat-label">{s.label}</div>
            <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.5)', marginTop:'0.35rem' }}>{s.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;
