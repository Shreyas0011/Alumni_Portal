import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, GraduationCap, Briefcase, Send, CheckCircle, Hash, Calendar, BookOpen, Phone, Lock } from 'lucide-react';
import { useData } from '../context/DataContext';

const Registration = () => {
  const { submitProfile } = useData();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    rollNumber: '',
    batch: '',
    branch: 'B.Com Accounts & Finance',
    phone: '',
    email: '',
    password: '',
    bio: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    submitProfile({
      name: form.name,
      rollNumber: form.rollNumber,
      batch: form.batch,
      course: form.branch,
      branch: form.branch,
      phone: form.phone,
      email: form.email,
      bio: form.bio || `Commerce Alumnus specializing in ${form.branch}. Roll Number: ${form.rollNumber}`,
      status: 'pending'
    });

    setSubmitted(true);
  };

  const commerceBranches = [
    'B.Com Accounts & Finance',
    'B.Com Honors',
    'B.Com Corporate Secretaryship',
    'B.Com Computer Applications',
    'B.Com Professional Accounting',
    'M.Com Finance & Taxation',
    'BBA Finance & Marketing',
    'MBA Financial Management',
    'Other Business Specialization'
  ];

  if (submitted) {
    return (
      <div className="section-padding flex-center" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          className="card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ padding: '4rem 3rem', borderRadius: '24px', textAlign: 'center', maxWidth: '550px', background: '#fff' }}
        >
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 2rem', color: '#fff'
          }}>
            <CheckCircle size={36} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-main)' }}>Request Submitted!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.7', fontSize: '0.95rem' }}>
            Thank you for registering. Your details have been submitted to the <strong>Commerce Admin</strong> for verification. You will be able to log in once your profile is approved.
          </p>

          <div style={{
            background: 'var(--gray-50)', 
            borderRadius: '16px', 
            padding: '1.5rem',
            border: '1px solid var(--border)', 
            marginBottom: '2.5rem',
            textAlign: 'left',
            fontSize: '0.85rem'
          }}>
            <h4 style={{ fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-main)' }}>Registration Summary:</h4>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div><strong>Name:</strong> {form.name}</div>
              <div><strong>Roll Number:</strong> {form.rollNumber}</div>
              <div><strong>Pass out Batch:</strong> Class of {form.batch}</div>
              <div><strong>Specialization:</strong> {form.branch}</div>
              <div><strong>Phone Number:</strong> {form.phone}</div>
              <div><strong>Email:</strong> {form.email}</div>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => window.location.href = '/'}>
            Back to Portals
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
            <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', fontWeight: 800, lineHeight: 1.1 }}>
              Join the <span className="text-gradient">Commerce Legacy.</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', marginBottom: '3rem', lineHeight: 1.7 }}>
              Become part of a global legacy. Register now to submit your profile for admin verification and unlock mentorship, corporate networking, and business insights.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[
                { icon: <User />, text: "Verified Commerce Networks" },
                { icon: <GraduationCap />, text: "Lifelong Alumni Mentorship" },
                { icon: <Briefcase />, text: "Exclusive Corporate Placements" }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ color: 'var(--blue-700)', background: 'var(--blue-50)', padding: '0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="card"
            style={{ padding: '3.5rem', borderRadius: '24px', background: '#fff' }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  <User size={14} style={{ color: 'var(--blue-700)' }} /> Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="Sarah Jenkins" 
                  required 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  style={{ padding: '0.875rem 1rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                    <Hash size={14} style={{ color: 'var(--blue-700)' }} /> Roll Number
                  </label>
                  <input 
                    type="text" 
                    placeholder="COM202011" 
                    required 
                    value={form.rollNumber}
                    onChange={(e) => setForm({...form, rollNumber: e.target.value})}
                    style={{ padding: '0.875rem 1rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                    <Calendar size={14} style={{ color: 'var(--blue-700)' }} /> Pass out Batch
                  </label>
                  <input 
                    type="number" 
                    placeholder="2024" 
                    required 
                    min="1950" 
                    max="2030"
                    value={form.batch}
                    onChange={(e) => setForm({...form, batch: e.target.value})}
                    style={{ padding: '0.875rem 1rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  <BookOpen size={14} style={{ color: 'var(--blue-700)' }} /> Specialization / Branch Details
                </label>
                <select 
                  value={form.branch}
                  onChange={(e) => setForm({...form, branch: e.target.value})}
                  style={{ padding: '0.875rem 1rem', width: '100%' }}
                >
                  {commerceBranches.map((br) => (
                    <option key={br} value={br}>{br}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  <Phone size={14} style={{ color: 'var(--blue-700)' }} /> Phone Number
                </label>
                <input 
                  type="tel" 
                  placeholder="9876543210" 
                  required 
                  pattern="[0-9]{10}"
                  maxLength="10"
                  value={form.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setForm({...form, phone: val});
                  }}
                  style={{ padding: '0.875rem 1rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  <Mail size={14} style={{ color: 'var(--blue-700)' }} /> Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="sarah@example.com" 
                  required 
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  style={{ padding: '0.875rem 1rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  <Lock size={14} style={{ color: 'var(--blue-700)' }} /> Set Password
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  style={{ padding: '0.875rem 1rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  <Briefcase size={14} style={{ color: 'var(--blue-700)' }} /> Professional Bio / Journey (Optional)
                </label>
                <textarea 
                  rows="3" 
                  placeholder="E.g. CA Finals candidate / Investment analyst at Blackstone..." 
                  value={form.bio}
                  onChange={(e) => setForm({...form, bio: e.target.value})}
                  style={{ padding: '0.875rem 1rem', resize: 'none' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%', padding: '1rem' }}>
                Submit Registration Request
                <Send size={16} style={{ marginLeft: '0.5rem' }} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
