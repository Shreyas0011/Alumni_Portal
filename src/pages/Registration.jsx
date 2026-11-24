import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, GraduationCap, Briefcase, Send, CheckCircle, Hash, Calendar, BookOpen, Phone, Lock } from 'lucide-react';
import { useData } from '../context/DataContext';

const Registration = () => {
  const { submitProfile } = useData();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    batch: '',
    branch: 'B.Com Accounts & Finance',
    college: 'Transcend College of Commerce',
    fieldOfStudy: '',
    eduStartYear: '',
    eduEndYear: '',
    schoolName: '',
    schoolStream: 'Commerce',
    schoolEndYear: '',
    school10Name: '',
    school10EndYear: '',
    phone: '',
    email: '',
    password: '',
    bio: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    submitProfile({
      name: form.name,
      batch: form.eduEndYear || form.batch,
      course: form.branch,
      branch: form.branch,
      college: form.college,
      degree: form.branch,
      fieldOfStudy: form.fieldOfStudy,
      eduStartYear: form.eduStartYear,
      eduEndYear: form.eduEndYear,
      schoolName: form.schoolName,
      schoolStream: form.schoolStream,
      schoolEndYear: form.schoolEndYear,
      school10Name: form.school10Name,
      school10EndYear: form.school10EndYear,
      phone: form.phone,
      email: form.email,
      bio: form.bio || `${form.branch} Alumnus from ${form.college} specializing in ${form.fieldOfStudy}.`,
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
          style={{ padding: 'clamp(2rem, 6vw, 4rem) clamp(1.25rem, 5vw, 3rem)', borderRadius: '24px', textAlign: 'center', maxWidth: '600px', background: '#fff' }}
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
              <div><strong>School / College:</strong> {form.college}</div>
              <div><strong>Degree & Specialization:</strong> {form.branch}</div>
              <div><strong>Field of Study:</strong> {form.fieldOfStudy}</div>
              <div><strong>Education Period:</strong> {form.eduStartYear} - {form.eduEndYear} (Class of {form.eduEndYear})</div>
              {form.schoolName && (
                <div><strong>Schooling (Class XII):</strong> {form.schoolName} ({form.schoolStream}, Class of {form.schoolEndYear})</div>
              )}
              {form.school10Name && (
                <div><strong>Schooling (Class X):</strong> {form.school10Name} (Class of {form.school10EndYear})</div>
              )}
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))', gap: 'clamp(2rem, 6vw, 6rem)', alignItems: 'center' }}>
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
            style={{ padding: 'clamp(1.25rem, 5vw, 3.5rem)', borderRadius: '24px', background: '#fff' }}
          >
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Section 1: Personal Information */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.25rem', color: 'var(--blue-900)', borderBottom: '2px solid var(--blue-50)', paddingBottom: '0.5rem' }}>
                  Personal Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                  </div>
                </div>
              </div>

              {/* Section 2: School & Education Details */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.25rem', color: 'var(--blue-900)', borderBottom: '2px solid var(--blue-50)', paddingBottom: '0.5rem' }}>
                  Education & School Details
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                      <GraduationCap size={14} style={{ color: 'var(--blue-700)' }} /> School / College Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="Transcend College of Commerce" 
                      required 
                      value={form.college}
                      onChange={(e) => setForm({...form, college: e.target.value})}
                      style={{ padding: '0.875rem 1rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        <BookOpen size={14} style={{ color: 'var(--blue-700)' }} /> Degree / Program
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
                        <Briefcase size={14} style={{ color: 'var(--blue-700)' }} /> Field of Study
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Financial Analysis" 
                        required 
                        value={form.fieldOfStudy}
                        onChange={(e) => setForm({...form, fieldOfStudy: e.target.value})}
                        style={{ padding: '0.875rem 1rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        <Calendar size={14} style={{ color: 'var(--blue-700)' }} /> Start Year
                      </label>
                      <input 
                        type="number" 
                        placeholder="2020" 
                        required 
                        min="1950" 
                        max="2030"
                        value={form.eduStartYear}
                        onChange={(e) => setForm({...form, eduStartYear: e.target.value})}
                        style={{ padding: '0.875rem 1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        <Calendar size={14} style={{ color: 'var(--blue-700)' }} /> End Year
                      </label>
                      <input 
                        type="number" 
                        placeholder="2024" 
                        required 
                        min="1950" 
                        max="2030"
                        value={form.eduEndYear}
                        onChange={(e) => setForm({...form, eduEndYear: e.target.value, batch: e.target.value})}
                        style={{ padding: '0.875rem 1rem' }}
                      />
                    </div>
                  </div>

                  {/* Schooling Details */}
                  <div style={{ height: '1px', background: 'var(--blue-50)', margin: '0.75rem 0' }} />
                  
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                      <GraduationCap size={14} style={{ color: 'var(--blue-700)' }} /> School Name (Class XII)
                    </label>
                    <input 
                      type="text" 
                      placeholder="E.g. St. Mary's Higher Secondary School" 
                      required 
                      value={form.schoolName}
                      onChange={(e) => setForm({...form, schoolName: e.target.value})}
                      style={{ padding: '0.875rem 1rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        <BookOpen size={14} style={{ color: 'var(--blue-700)' }} /> School Stream
                      </label>
                      <select 
                        value={form.schoolStream}
                        onChange={(e) => setForm({...form, schoolStream: e.target.value})}
                        style={{ padding: '0.875rem 1rem', width: '100%' }}
                      >
                        <option value="Commerce">Commerce</option>
                        <option value="Science">Science</option>
                        <option value="Arts">Arts</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        <Calendar size={14} style={{ color: 'var(--blue-700)' }} /> School Graduation Year
                      </label>
                      <input 
                        type="number" 
                        placeholder="2017" 
                        required 
                        min="1950" 
                        max="2035"
                        value={form.schoolEndYear}
                        onChange={(e) => setForm({...form, schoolEndYear: e.target.value})}
                        style={{ padding: '0.875rem 1rem' }}
                      />
                    </div>
                  </div>

                  {/* Schooling Details (Class X) */}
                  <div style={{ height: '1px', background: 'var(--blue-50)', margin: '0.75rem 0' }} />
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        <GraduationCap size={14} style={{ color: 'var(--blue-700)' }} /> School Name (Class X)
                      </label>
                      <input 
                        type="text" 
                        placeholder="E.g. St. Mary's High School" 
                        required 
                        value={form.school10Name}
                        onChange={(e) => setForm({...form, school10Name: e.target.value})}
                        style={{ padding: '0.875rem 1rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                        <Calendar size={14} style={{ color: 'var(--blue-700)' }} /> School Graduation Year
                      </label>
                      <input 
                        type="number" 
                        placeholder="2015" 
                        required 
                        min="1950" 
                        max="2035"
                        value={form.school10EndYear}
                        onChange={(e) => setForm({...form, school10EndYear: e.target.value})}
                        style={{ padding: '0.875rem 1rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Account Security & Bio */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.25rem', color: 'var(--blue-900)', borderBottom: '2px solid var(--blue-50)', paddingBottom: '0.5rem' }}>
                  Account Security & Bio
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                </div>
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
