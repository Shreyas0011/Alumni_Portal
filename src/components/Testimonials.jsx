import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  { text:"The Alumni Connect Portal genuinely changed my career. The mentor I found here guided me into a VP role I thought was 5 years away.", author:'James Wilson', role:'VP Product, NextGen Ventures', initial:'JW', batch:'2014', rating:5 },
  { text:"Within two weeks of joining, I had three interviews at alumni-led startups. The community is warm, helpful, and incredibly well-connected.", author:'Samantha Reed', role:'Engineering Manager at Meta', initial:'SR', batch:'2016', rating:5 },
  { text:"The events and webinars alone are worth it. I learn something new every month from people who are actually doing the work.", author:'Robert Chang', role:'Strategy Consultant', initial:'RC', batch:'2013', rating:5 },
];

const Testimonials = () => {
  const [idx, setIdx] = useState(0);
  const t = testimonials[idx];
  return (
    <section className="testimonials-section section-padding">
      <div className="container">
        <motion.div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:'3rem', textAlign:'center' }}
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <div className="section-label" style={{ justifyContent:'center' }}>Testimonials</div>
          <h2 className="section-title">Loved by our <span className="text-gradient">alumni</span></h2>
          <p className="section-subtitle" style={{ textAlign:'center', margin:'0 auto' }}>Real stories from real members of our community.</p>
        </motion.div>

        <div style={{ maxWidth:700, margin:'0 auto' }}>
          <div className="card-flat" style={{ borderRadius:'var(--radius-xl)', padding:'2.5rem', position:'relative' }}>
            {/* Stars */}
            <div style={{ display:'flex', gap:'0.2rem', marginBottom:'1.5rem' }}>
              {Array.from({ length: t.rating }).map((_,i)=>(
                <Star key={i} size={16} fill="var(--blue-500)" color="var(--blue-500)" />
              ))}
            </div>

            <Quote size={40} style={{ color:'var(--blue-100)', marginBottom:'1rem' }} />

            <AnimatePresence mode="wait">
              <motion.div key={idx} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
                <p style={{ fontSize:'1.1rem', lineHeight:1.8, color:'var(--text-muted)', marginBottom:'2rem', fontStyle:'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                  <div style={{ width:46, height:46, borderRadius:'50%', background:'linear-gradient(135deg,var(--blue-700),var(--blue-500))', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'1rem', flexShrink:0 }}>{t.initial}</div>
                  <div>
                    <div style={{ fontWeight:700, color:'var(--text-main)', fontSize:'0.95rem' }}>{t.author}</div>
                    <div style={{ fontSize:'0.8rem', color:'var(--blue-600)', fontWeight:600 }}>{t.role} · Class of {t.batch}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'2rem', paddingTop:'1.5rem', borderTop:'1px solid var(--border)' }}>
              <div style={{ display:'flex', gap:'0.4rem' }}>
                {testimonials.map((_,i)=>(
                  <button key={i} onClick={()=>setIdx(i)} style={{ width:i===idx?22:8, height:8, borderRadius:999, background:i===idx?'var(--blue-700)':'var(--gray-200)', border:'none', cursor:'pointer', transition:'all 0.3s', padding:0 }} />
                ))}
              </div>
              <div style={{ display:'flex', gap:'0.5rem' }}>
                <button className="btn btn-ghost btn-icon" onClick={()=>setIdx(p=>(p-1+testimonials.length)%testimonials.length)}><ChevronLeft size={17}/></button>
                <button className="btn btn-ghost btn-icon" onClick={()=>setIdx(p=>(p+1)%testimonials.length)}><ChevronRight size={17}/></button>
              </div>
            </div>
          </div>

          {/* Trust bar */}
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'1.5rem', marginTop:'2rem', flexWrap:'wrap' }}>
            {['50,000+ alumni','120+ countries','4.9★ rating','Since 2010'].map((item,i)=>(
              <div key={i} style={{ fontSize:'0.8rem', color:'var(--text-dim)', fontWeight:600 }}>{item}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
