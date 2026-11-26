import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { Clock, Mail, Lock, User, Phone, XCircle, ArrowLeft } from 'lucide-react';
import './Login.css';

// Alumni access request. Submissions are stored in MongoDB as pending
// profiles and reviewed by an admin before the account can sign in.
const RequestAccess = () => {
  const config = { color: 'var(--blue-800)' };
  const { submitProfile } = useData();
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    college: '',
    degree: 'B.Com Accounts & Finance',
    fieldOfStudy: '',
    eduStartYear: '',
    eduEndYear: '',
    schoolName: '',
    schoolStream: 'Commerce',
    schoolEndYear: '',
    school10Name: '',
    school10EndYear: '',
    profession: '',
    company: '',
    linkedin: '',
    skills: '',
    bio: ''
  });
  const [regSubmitted, setRegSubmitted] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
    
    // Submit registration request to Admin
    submitProfile({
      name: regForm.name,
      phone: regForm.phone,
      email: regForm.email,
      password: regForm.password, // Keep password for login
      college: regForm.college,
      degree: regForm.degree,
      fieldOfStudy: regForm.fieldOfStudy,
      eduStartYear: regForm.eduStartYear,
      eduEndYear: regForm.eduEndYear,
      schoolName: regForm.schoolName,
      schoolStream: regForm.schoolStream,
      schoolEndYear: regForm.schoolEndYear,
      school10Name: regForm.school10Name,
      school10EndYear: regForm.school10EndYear,
      profession: regForm.profession,
      company: regForm.company,
      linkedin: regForm.linkedin,
      skills: regForm.skills,
      bio: regForm.bio || `Commerce Alumnus specializing in ${regForm.degree}. Batch of ${regForm.eduEndYear}`,
      status: 'pending'
    });

    setRegSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
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

  if (regSubmitted) {
    return (
      <div className="o360-page">
        <motion.div 
          className="o360-card" 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ maxWidth: '550px', width: '100%', padding: '3rem', textAlign: 'center' }}
        >
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 2rem', color: '#fff'
          }}>
            <Clock size={36} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-main)' }}>
            Request Submitted!
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.7', fontSize: '0.9rem' }}>
            Your registration details have been sent to the <strong>Commerce Admin</strong> for approval.
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
              <div><strong>Name:</strong> {regForm.name}</div>
              <div><strong>College:</strong> {regForm.college}</div>
              <div><strong>Education:</strong> {regForm.degree} in {regForm.fieldOfStudy} ({regForm.eduStartYear} - {regForm.eduEndYear})</div>
              {regForm.schoolName && (
                <div><strong>Schooling (Class XII):</strong> {regForm.schoolName} ({regForm.schoolStream}, Class of {regForm.schoolEndYear})</div>
              )}
              {regForm.school10Name && (
                <div><strong>Schooling (Class X):</strong> {regForm.school10Name} (Class of {regForm.school10EndYear})</div>
              )}
              <div><strong>Professional:</strong> {regForm.profession} at {regForm.company}</div>
              <div><strong>Phone Number:</strong> {regForm.phone}</div>
              <div><strong>Email:</strong> {regForm.email}</div>
              {regForm.linkedin && <div><strong>LinkedIn:</strong> {regForm.linkedin}</div>}
              {regForm.skills && <div><strong>Skills:</strong> {regForm.skills}</div>}
            </div>
          </div>

          <Link to="/" className="o360-primary" style={{ marginBottom: '0.75rem' }}>
            Return to sign in
          </Link>
          <button
            type="button"
            className="o360-option" style={{ justifyContent: 'center' }}
            onClick={() => {
              setRegSubmitted(false);
              setRegForm({
                name: '',
                phone: '',
                email: '',
                password: '',
                college: '',
                degree: 'B.Com Accounts & Finance',
                fieldOfStudy: '',
                eduStartYear: '',
                eduEndYear: '',
                schoolName: '',
                schoolStream: 'Commerce',
                schoolEndYear: '',
                school10Name: '',
                school10EndYear: '',
                profession: '',
                company: '',
                linkedin: '',
                skills: '',
                bio: ''
              });
            }}
          >
            Submit another request
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="o360-page">
      <Link to="/" className="o360-logo-wrap" aria-label="Back to sign in">
        <img src="/logo.png" alt="Transcend Group of Institutions" />
      </Link>
      <motion.div
        className="o360-card o360-card--wide"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      >
        <header className="o360-head">
          <h1>Request alumni access</h1>
          <p>An admin reviews every request before the account can sign in.</p>
        </header>

        {errorMsg && (
          <div className="o360-alert" role="alert">
            <XCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                <User size={14} style={{ color: config.color }} /> Full Name
              </label>
              <input 
                type="text" 
                placeholder="Sarah Jenkins" 
                required 
                value={regForm.name}
                onChange={(e) => setRegForm({...regForm, name: e.target.value})}
                style={{ padding: '0.875rem 1rem' }}
              />
            </div>

            {/* Education Details */}
            <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(248,250,252,0.6)' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🎓 Education Details
              </h4>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                  University / College Name
                </label>
                <input 
                  type="text" 
                  placeholder="Transcend School of Business / Delhi University" 
                  required 
                  value={regForm.college}
                  onChange={(e) => setRegForm({...regForm, college: e.target.value})}
                  style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                    Degree
                  </label>
                  <select 
                    value={regForm.degree}
                    onChange={(e) => setRegForm({...regForm, degree: e.target.value})}
                    style={{ padding: '0.75rem 1rem', width: '100%', fontSize: '0.85rem' }}
                  >
                    {commerceBranches.map((br) => (
                      <option key={br} value={br}>{br}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                    Field of Study
                  </label>
                  <input 
                    type="text" 
                    placeholder="Finance, Accounting, taxation" 
                    required 
                    value={regForm.fieldOfStudy}
                    onChange={(e) => setRegForm({...regForm, fieldOfStudy: e.target.value})}
                    style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                    Start Year
                  </label>
                  <input 
                    type="number" 
                    placeholder="2017" 
                    required 
                    min="1950" 
                    max="2035"
                    value={regForm.eduStartYear}
                    onChange={(e) => setRegForm({...regForm, eduStartYear: e.target.value})}
                    style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                    Graduation Year (End Year)
                  </label>
                  <input 
                    type="number" 
                    placeholder="2020" 
                    required 
                    min="1950" 
                    max="2035"
                    value={regForm.eduEndYear}
                    onChange={(e) => setRegForm({...regForm, eduEndYear: e.target.value})}
                    style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Schooling Details */}
              <div style={{ height: '1px', background: 'var(--border)', margin: '0.75rem 0' }} />
              
              <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🏫 Schooling Details (Class XII)
              </h5>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                  School Name
                </label>
                <input 
                  type="text" 
                  placeholder="E.g. St. Mary's Higher Secondary School" 
                  required 
                  value={regForm.schoolName}
                  onChange={(e) => setRegForm({...regForm, schoolName: e.target.value})}
                  style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                    Stream
                  </label>
                  <select 
                    value={regForm.schoolStream}
                    onChange={(e) => setRegForm({...regForm, schoolStream: e.target.value})}
                    style={{ padding: '0.75rem 1rem', width: '100%', fontSize: '0.85rem' }}
                  >
                    <option value="Commerce">Commerce</option>
                    <option value="Science">Science</option>
                    <option value="Arts">Arts</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                    Graduation Year
                  </label>
                  <input 
                    type="number" 
                    placeholder="2017" 
                    required 
                    min="1950" 
                    max="2035"
                    value={regForm.schoolEndYear}
                    onChange={(e) => setRegForm({...regForm, schoolEndYear: e.target.value})}
                    style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Schooling Details (Class X) */}
              <div style={{ height: '1px', background: 'var(--border)', margin: '0.75rem 0' }} />
              
              <h5 style={{ margin: '0 0 0.25rem 0', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🏫 Schooling Details (Class X)
              </h5>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                    School Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="E.g. St. Mary's High School" 
                    required 
                    value={regForm.school10Name}
                    onChange={(e) => setRegForm({...regForm, school10Name: e.target.value})}
                    style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                    Graduation Year (Class X)
                  </label>
                  <input 
                    type="number" 
                    placeholder="2015" 
                    required 
                    min="1950" 
                    max="2035"
                    value={regForm.school10EndYear}
                    onChange={(e) => setRegForm({...regForm, school10EndYear: e.target.value})}
                    style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(248,250,252,0.6)' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                💼 Professional Experience
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                    Current Job Role / Designation
                  </label>
                  <input 
                    type="text" 
                    placeholder="Investment Analyst" 
                    required 
                    value={regForm.profession}
                    onChange={(e) => setRegForm({...regForm, profession: e.target.value})}
                    style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                    Organization / Company
                  </label>
                  <input 
                    type="text" 
                    placeholder="Goldman Sachs" 
                    required 
                    value={regForm.company}
                    onChange={(e) => setRegForm({...regForm, company: e.target.value})}
                    style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                    LinkedIn URL
                  </label>
                  <input 
                    type="url" 
                    placeholder="https://linkedin.com/in/username" 
                    required 
                    value={regForm.linkedin}
                    onChange={(e) => setRegForm({...regForm, linkedin: e.target.value})}
                    style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>
                    Skills (comma separated)
                  </label>
                  <input 
                    type="text" 
                    placeholder="CFA, M&A, Financial Modeling" 
                    required 
                    value={regForm.skills}
                    onChange={(e) => setRegForm({...regForm, skills: e.target.value})}
                    style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  <Phone size={14} style={{ color: config.color }} /> Phone Number
                </label>
                <input 
                  type="tel" 
                  placeholder="9876543210" 
                  required 
                  pattern="[0-9]{10}"
                  maxLength="10"
                  value={regForm.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setRegForm({...regForm, phone: val});
                  }}
                  style={{ padding: '0.875rem 1rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  <Mail size={14} style={{ color: config.color }} /> Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="sarah@example.com" 
                  required 
                  value={regForm.email}
                  onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                  style={{ padding: '0.875rem 1rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                <Lock size={14} style={{ color: config.color }} /> Set Password
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={regForm.password}
                onChange={(e) => setRegForm({...regForm, password: e.target.value})}
                style={{ padding: '0.875rem 1rem' }}
              />
            </div>

            <button type="submit" className="o360-primary" disabled={submitting} style={{ marginTop: '0.5rem' }}>
              {submitting ? 'Submitting…' : 'Submit request for approval'}
            </button>
          </form>

        <Link to="/" className="o360-back">
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      </motion.div>
    </div>
  );
};

export default RequestAccess;
