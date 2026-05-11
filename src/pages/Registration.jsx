import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, GraduationCap, Briefcase, Send, CheckCircle } from 'lucide-react';

const Registration = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="section-padding flex-center" style={{ minHeight: '80vh' }}>
        <motion.div 
          className="glass"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ padding: '4rem', borderRadius: 'var(--radius-2xl)', textAlign: 'center', maxWidth: '500px' }}
        >
          <div style={{ color: 'var(--primary)', marginBottom: '2rem' }}>
            <CheckCircle size={80} />
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome Aboard!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
            Your registration is being verified. You'll receive a confirmation email once your profile is active.
          </p>
          <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="registration-page section-padding">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '6rem', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{ fontSize: '4.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>
              Join the <span className="text-gradient">Core.</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '3rem', lineHeight: 1.6 }}>
              Become part of a global legacy. Register now to unlock mentorship, exclusive job referrals, and lifelong connections.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[
                { icon: <User />, text: "Verified Professional Network" },
                { icon: <GraduationCap />, text: "Lifelong Alumni Benefits" },
                { icon: <Briefcase />, text: "Exclusive Industry Referrals" }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ color: 'var(--primary)', background: 'var(--primary-glow)', padding: '0.75rem', borderRadius: '12px' }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: '1.125rem', fontWeight: 500 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="glass"
            style={{ padding: '4rem', borderRadius: 'var(--radius-2xl)', background: 'rgba(15,23,42,0.02)' }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Full Name</label>
                  <input type="text" placeholder="John Doe" required style={{ width: '100%', padding: '1rem', background: 'rgba(15,23,42,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }} />
                </div>
                <div className="input-group">
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Graduation Year</label>
                  <input type="number" placeholder="2022" required style={{ width: '100%', padding: '1rem', background: 'rgba(15,23,42,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }} />
                </div>
              </div>

              <div className="input-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Email Address</label>
                <input type="email" placeholder="john@example.com" required style={{ width: '100%', padding: '1rem', background: 'rgba(15,23,42,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }} />
              </div>

              <div className="input-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Current Company / University</label>
                <input type="text" placeholder="Google / Stanford" style={{ width: '100%', padding: '1rem', background: 'rgba(15,23,42,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }} />
              </div>

              <div className="input-group">
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Professional Bio</label>
                <textarea rows="4" placeholder="Tell us about your journey..." style={{ width: '100%', padding: '1rem', background: 'rgba(15,23,42,0.03)', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: 'var(--text-main)', resize: 'none', outline: 'none' }}></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>
                Create My Profile
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
