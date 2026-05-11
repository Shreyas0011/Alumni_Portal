import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Briefcase, Award, Users, ArrowRight } from 'lucide-react';

const benefits = [
  { title:'Global Mentorship', desc:'Get direct guidance from industry veterans who have navigated the path before you.', icon:<Users size={20}/>, color:'#2563eb' },
  { title:'Exclusive Job Board', desc:'Access a high-trust referral network with curated roles from alumni-led companies.', icon:<Briefcase size={20}/>, color:'#0891b2' },
  { title:'Global Networking', desc:'Connect with professionals spanning 120+ countries and every major industry.', icon:<Globe size={20}/>, color:'#7c3aed' },
  { title:'Workshops & Webinars', desc:'Attend exclusive learning events hosted by senior alumni and industry experts.', icon:<Zap size={20}/>, color:'#d97706' },
  { title:'Verified Community', desc:'A professional, verified-only space built on trust and meaningful collaboration.', icon:<Shield size={20}/>, color:'#059669' },
  { title:'Spotlight Recognition', desc:'Get featured in our monthly alumni spotlight and gain visibility in the network.', icon:<Award size={20}/>, color:'#dc2626' },
];

const WhyJoin = () => (
  <section className="section-padding" style={{ background:'var(--gray-50)' }}>
    <div className="container">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', flexWrap:'wrap', gap:'1.5rem', marginBottom:'2.5rem' }}>
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <div className="section-label">Why Join Us</div>
          <h2 className="section-title">Everything you need to <span className="text-gradient">succeed</span></h2>
          <p className="section-subtitle">Your alumni network is your greatest asset. We make it easy to leverage it.</p>
        </motion.div>
        <motion.div whileHover={{ scale:1.02 }} initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
          <a href="/register" className="btn btn-outline" style={{ whiteSpace:'nowrap' }}>Join Now <ArrowRight size={15}/></a>
        </motion.div>
      </div>

      <div className="features-grid">
        {benefits.map((b, i) => (
          <motion.div key={i} className="card" style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', cursor:'default' }}
            initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: i*0.07 }}>
            <div style={{ width:46, height:46, borderRadius:'var(--radius-md)', background:`${b.color}15`, color:b.color, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.125rem', transition:'var(--transition)', flexShrink:0 }}
              className="feature-icon-custom">
              {b.icon}
            </div>
            <h3 style={{ fontSize:'0.975rem', fontWeight:700, color:'var(--text-main)', marginBottom:'0.5rem' }}>{b.title}</h3>
            <p style={{ fontSize:'0.875rem', color:'var(--text-muted)', lineHeight:1.7 }}>{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyJoin;
