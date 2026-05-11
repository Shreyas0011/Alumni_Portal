import React from 'react';
import { motion } from 'framer-motion';
import { Award, Link2, Mail, MapPin } from 'lucide-react';

const alumni = [
  { name:'Sarah Jenkins', role:'Senior VP, Tech Global', batch:'2012', location:'San Francisco', img:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400', achievement:'AI Ethics Pioneer', field:'Technology' },
  { name:'David Chen', role:'Founder, EcoStream', batch:'2015', location:'Singapore', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400', achievement:'Forbes 30 Under 30', field:'Entrepreneurship' },
  { name:'Elena Rodriguez', role:'Director of Policy, UN', batch:'2010', location:'Geneva', img:'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400', achievement:'Global Impact Award', field:'Policy' },
  { name:'Marcus Thorne', role:'Chief Architect, SpaceNext', batch:'2014', location:'Houston', img:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400', achievement:'Innovator of the Year', field:'Engineering' },
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
            {/* Image */}
            <div style={{ position:'relative', aspectRatio:'1.15', overflow:'hidden' }}>
              <img src={p.img} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s var(--ease)', display:'block' }}
                onMouseEnter={e=>e.currentTarget.style.transform='scale(1.07)'}
                onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
              />
              {/* Overlay badge */}
              <div style={{ position:'absolute', bottom:'0.75rem', left:'0.75rem', right:'0.75rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ background:'rgba(255,255,255,0.95)', border:'1px solid var(--blue-100)', borderRadius:'999px', padding:'0.25rem 0.7rem', display:'flex', alignItems:'center', gap:'0.35rem', color:'var(--blue-700)', fontSize:'0.7rem', fontWeight:700, backdropFilter:'blur(8px)' }}>
                  <Award size={11}/> {p.achievement}
                </div>
                <div style={{ background:'rgba(37,99,235,0.9)', borderRadius:'999px', padding:'0.25rem 0.6rem', color:'#fff', fontSize:'0.68rem', fontWeight:700 }}>
                  {p.field}
                </div>
              </div>
            </div>

            {/* Info */}
            <div style={{ padding:'1.25rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', color:'var(--text-dim)', fontSize:'0.72rem', marginBottom:'0.3rem' }}>
                <MapPin size={11}/> {p.location} · Class of {p.batch}
              </div>
              <h3 style={{ fontSize:'1rem', fontWeight:700, color:'var(--text-main)', marginBottom:'0.2rem' }}>{p.name}</h3>
              <p style={{ fontSize:'0.82rem', color:'var(--text-muted)', marginBottom:'1rem' }}>{p.role}</p>
              <div style={{ display:'flex', gap:'0.5rem' }}>
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
