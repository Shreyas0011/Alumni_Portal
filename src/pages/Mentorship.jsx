import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Users, Send, GraduationCap, Sparkles, ChevronRight, CheckCircle2, MessageSquare } from 'lucide-react';

const Mentorship = () => {
  const services = [
    { 
      title: 'Strategic Career Pathing', 
      icon: <GraduationCap size={32} />, 
      desc: 'Map out your professional journey with veterans who have reached the peaks of their industries.',
      tag: 'Most Popular'
    },
    { 
      title: 'Precision Resume Surgery', 
      icon: <FileText size={32} />, 
      desc: 'Go beyond keywords. Get deep architectural feedback on how to tell your professional story.',
      tag: 'Critical'
    },
    { 
      title: 'High-Stakes Mock Interviews', 
      icon: <Users size={32} />, 
      desc: 'Simulate high-pressure scenarios with leaders from Fortune 500 companies.',
      tag: 'Advanced'
    },
    { 
      title: 'Academic Excellence', 
      icon: <BookOpen size={32} />, 
      desc: 'Navigate the complex landscape of global Ivy League admissions and research paths.',
      tag: 'Education'
    },
  ];

  const benefits = [
    "Priority access to global alumni leaders",
    "Tailored 1-on-1 development sessions",
    "Direct industry referral opportunities",
    "Lifelong professional support system"
  ];

  return (
    <div className="mentorship-page" style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>
      {/* Hero Section */}
      <section className="mentorship-hero" style={{ padding: '10rem 0 6rem', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
          >
            <div className="hero-badge" style={{ marginBottom: '2rem' }}>
              <Sparkles size={14} style={{ marginRight: '8px' }} />
              Exclusive Mentorship Elite
            </div>
            <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '2rem', letterSpacing: '-2px' }}>
              Elevate Your <span className="text-gradient">Trajectory.</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '3rem' }}>
              Bridge the gap between potential and peak performance. Connect with the world's most influential alumni through our curated mentorship pillars.
            </p>
          </motion.div>
        </div>
        
        {/* Decorative background element */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)', zIndex: 0, opacity: 0.5, pointerEvents: 'none' }} />
      </section>

      {/* Service Pillars */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            {services.map((service, i) => (
              <motion.div 
                key={i} 
                className="glass-premium"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, borderColor: 'var(--primary)' }}
                style={{ padding: '3.5rem', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ color: 'var(--primary)', marginBottom: '2rem', background: 'var(--primary-glow)', width: '70px', height: '70px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {service.icon}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>
                  {service.tag}
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>{service.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.05rem' }}>{service.desc}</p>
                
                <motion.div 
                  style={{ marginTop: '2.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, cursor: 'pointer' }}
                  whileHover={{ x: 5 }}
                >
                  Learn More <ChevronRight size={18} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Split Interactive Section */}
      <section style={{ padding: '8rem 0 12rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '8rem', alignItems: 'center' }}>
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '2rem' }}>
                Tailored for <span className="text-gradient">Excellence.</span>
              </h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '4rem', lineHeight: 1.8 }}>
                Our mentorship program isn't just about advice—it's about strategic alignment. We match you with mentors based on precise career goals, cultural fit, and industry vision.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {benefits.map((benefit, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ color: '#10b981' }}>
                      <CheckCircle2 size={24} />
                    </div>
                    <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>{benefit}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ display: 'flex' }}>
                  {[1,2,3,4].map(i => (
                    <div key={i} style={{ width: '45px', height: '45px', borderRadius: '50%', border: '3px solid #fff', overflow: 'hidden', marginLeft: i === 1 ? 0 : '-15px', background: '#f1f5f9' }}>
                      <img src={`https://placehold.co/100x100?text=M${i}`} alt="alumni" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <strong style={{ color: 'var(--text-main)' }}>500+ Active Mentors</strong> from top-tier firms.
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-premium"
              style={{ padding: '5rem', borderRadius: '40px' }}
            >
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Request Access</h3>
                <p style={{ color: 'var(--text-muted)' }}>Secure your spot in the next mentorship cohort.</p>
              </div>

              <form style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', display: 'block' }}>Full Name</label>
                    <input type="text" placeholder="Alex Rivers" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', display: 'block' }}>Department</label>
                    <input type="text" placeholder="Design" />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', display: 'block' }}>Service Required</label>
                  <select>
                    <option>Career Pathing</option>
                    <option>Resume Review</option>
                    <option>Interview Prep</option>
                    <option>Higher Studies</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', display: 'block' }}>Tell us about your goals</label>
                  <textarea rows={4} placeholder="What do you hope to achieve in the next 12 months?"></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: '1.25rem', width: '100%', fontSize: '1.1rem' }}>
                  Request Mentorship
                  <Send size={20} />
                </button>
                
                <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-dim)' }}>
                  <MessageSquare size={14} style={{ display: 'inline', marginRight: '5px' }} />
                  Avg. response time: 24 hours
                </p>
              </form>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Mentorship;
