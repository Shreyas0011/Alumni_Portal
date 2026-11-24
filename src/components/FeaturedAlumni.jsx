import React from 'react';
import { motion } from 'framer-motion';
import { Award, Link2, Mail, MapPin } from 'lucide-react';

const alumni = [
  { name:'Sarah Jenkins', role:'Senior Investment Banker, Goldman Sachs', batch:'2012', location:'London', achievement:'M&A Dealmaker of the Year', field:'Investment Banking' },
  { name:'David Chen, CA', role:'Partner, Deloitte Audit & Assurance', batch:'2015', location:'Singapore', achievement:'CA Merit Holder (AIR 5)', field:'Auditing & Tax' },
  { name:'Elena Rodriguez', role:'Chief Financial Officer, Unilever', batch:'2010', location:'New York', achievement:'Global CFO Leader Award', field:'Corporate Finance' },
  { name:'Marcus Thorne', role:'Co-Founder, CapitalEdge Ventures', batch:'2014', location:'Mumbai', achievement:'Forbes 30 Under 30 Finance', field:'Venture Capital' },
];

const FeaturedAlumni = () => (
  <section className="section-padding" style={{ background:'var(--white)' }}>
    <div className="container">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'1.5rem', marginBottom:'2.5rem' }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <div className="section-label">Hall of Fame</div>
          <h2 className="section-title">Featured <span className="text-gradient">Alumni</span></h2>
          <p className="section-subtitle">Meet graduates making a global impact in their fields.</p>
        </motion.div>
        <motion.button className="btn btn-outline" whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>View All</motion.button>
      </div>

      <div className="alumni-grid">
        {alumni.map((p, i) => (
          <motion.div key={i} className="alumni-card premium"
            initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.09 }}>
            {/* Header: initials avatar (no photos on file yet) */}
            <div style={{ position:'relative', height:150, display:'flex', alignItems:'center', justifyContent:'center',
              background:'radial-gradient(70% 80% at 85% 0%, rgba(96,165,250,0.45), transparent 60%), linear-gradient(135deg, var(--blue-900) 0%, var(--blue-700) 100%)' }}>
              <div aria-hidden="true" style={{ width:84, height:84, borderRadius:'50%', display:'grid', placeItems:'center',
                background:'rgba(255,255,255,0.14)', border:'2px solid rgba(255,255,255,0.45)', color:'#fff',
                fontSize:'1.75rem', fontWeight:800, letterSpacing:'-0.02em', boxShadow:'0 10px 24px rgba(15,23,42,0.25)' }}>
                {p.name.split(' ').filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('')}
              </div>
              <span style={{ position:'absolute', top:'0.75rem', right:'0.75rem', background:'rgba(255,255,255,0.16)', border:'1px solid rgba(255,255,255,0.3)', borderRadius:'999px', padding:'0.2rem 0.65rem', color:'#fff', fontSize:'0.68rem', fontWeight:700, whiteSpace:'nowrap' }}>
                {p.field}
              </span>
            </div>

            {/* Info */}
            <div style={{ padding:'0 1.25rem 1.25rem', display:'flex', flexDirection:'column', flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', color:'var(--text-dim)', fontSize:'0.72rem', marginBottom:'0.3rem' }}>
                <MapPin size={11}/> {p.location} · Class of {p.batch}
              </div>
              <h3 style={{ fontSize:'1rem', fontWeight:700, color:'var(--text-main)', marginBottom:'0.2rem' }}>{p.name}</h3>
              <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:'0.75rem' }}>{p.role}</p>
              <div style={{ display:'flex', alignItems:'flex-start', gap:'0.4rem', color:'var(--blue-700)', fontSize:'0.75rem', fontWeight:700, marginBottom:'1rem', lineHeight:1.4 }}>
                <Award size={13} style={{ flexShrink:0, marginTop:1 }}/> {p.achievement}
              </div>
              <div style={{ display:'flex', gap:'0.5rem', marginTop:'auto' }}>
                {[Link2, Mail].map((Icon, j) => (
                  <a key={j} href="#" style={{ width:32, height:32, borderRadius:'var(--radius-sm)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-dim)', transition:'var(--transition)' }}
                    onMouseEnter={e=>{e.currentTarget.style.color='var(--blue-700)';e.currentTarget.style.borderColor='var(--blue-200)';e.currentTarget.style.background='var(--blue-50)';}}
                    onMouseLeave={e=>{e.currentTarget.style.color='var(--text-dim)';e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='transparent';}}
                  ><Icon size={14}/></a>
                ))}
                <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto', fontSize:'0.75rem' }}>Connect</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedAlumni;
