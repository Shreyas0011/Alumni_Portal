import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, Mail, Lock, User, Hash, Calendar, BookOpen, Phone } from 'lucide-react';

const Login = ({ role }) => {
  const [tab, setTab] = useState('signin'); // signin | register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: '',
    rollNumber: '',
    phone: '',
    email: '',
    password: '',
    college: '',
    degree: 'B.Com Accounts & Finance',
    fieldOfStudy: '',
    eduStartYear: '',
    eduEndYear: '',
    profession: '',
    company: '',
    linkedin: '',
    skills: '',
    bio: ''
  });
  const [regSubmitted, setRegSubmitted] = useState(false);

  const { login } = useAuth();
  const { alumniList, pendingProfiles, submitProfile } = useData();
  const navigate = useNavigate();

  const roleConfig = {
    student: {
      title: 'Commerce Student Portal',
      subtitle: 'Access mentorship, find corporate internships, and track business case studies.',
      color: 'var(--blue-600)',
      icon: '🎓'
    },
    alumni: {
      title: 'Transcend Alumni Portal',
      subtitle: 'Reconnect with fellow CAs, financial experts, and business pioneers.',
      color: 'var(--blue-800)',
      icon: '🏛️'
    },
    admin: {
      title: 'Commerce Admin Command Center',
      subtitle: 'Oversee registrations, approve pending profiles, and post achievements.',
      color: '#1e293b',
      icon: '🛡️'
    }
  };

  const config = roleConfig[role] || roleConfig.alumni;

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Fallback logic to support logging in without filling fields
    const effectiveEmail = email.trim() || (
      role === 'admin' ? 'admin@commerce.edu' :
      role === 'student' ? 'student@commerce.edu' :
      'priya@goldman.com' // default approved alumni
    );

    // Admin passes mock login
    if (role === 'admin') {
      const userData = {
        id: 'admin-id',
        name: 'Dean of Commerce / Admin',
        email: effectiveEmail,
        role: 'admin',
        profileStatus: 'approved',
        lastLogin: new Date().toISOString()
      };
      login(userData);
      navigate('/admin');
      return;
    }

    // Student passes mock login but needs profile completion
    if (role === 'student') {
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        name: effectiveEmail.split('@')[0],
        email: effectiveEmail,
        role: 'student',
        profileStatus: 'incomplete',
        lastLogin: new Date().toISOString()
      };
      login(userData);
      navigate('/profile/complete');
      return;
    }

    // Alumni authentication check
    if (role === 'alumni') {
      // 1. Check approved alumni list
      const approvedAlumnus = alumniList.find(
        a => a.email.toLowerCase() === effectiveEmail.toLowerCase()
      );

      if (approvedAlumnus) {
        const userData = {
          id: approvedAlumnus.id,
          name: approvedAlumnus.name,
          email: approvedAlumnus.email,
          role: 'alumni',
          profileStatus: 'approved',
          lastLogin: new Date().toISOString(),
          batch: approvedAlumnus.batch,
          branch: approvedAlumnus.branch || approvedAlumnus.profession
        };
        login(userData);
        navigate('/alumni/dashboard');
        return;
      }

      // 2. Check pending profiles list
      const pendingAlumnus = pendingProfiles.find(
        p => p.email.toLowerCase() === effectiveEmail.toLowerCase()
      );

      if (pendingAlumnus) {
        if (pendingAlumnus.status === 'pending') {
          setErrorMsg('Your registration request is currently pending admin approval. You will receive an email once approved.');
        } else if (pendingAlumnus.status === 'rejected') {
          setErrorMsg('Your registration request has been rejected by the admin. Please contact the commerce department.');
        } else if (pendingAlumnus.status === 'approved') {
          // Fallback if approved in pendingProfiles but not moved to alumniList (should not happen, but just in case)
          const userData = {
            id: pendingAlumnus.id,
            name: pendingAlumnus.name,
            email: pendingAlumnus.email,
            role: 'alumni',
            profileStatus: 'approved',
            lastLogin: new Date().toISOString(),
            batch: pendingAlumnus.batch,
            branch: pendingAlumnus.branch || pendingAlumnus.course
          };
          login(userData);
          navigate('/alumni/dashboard');
        }
        return;
      }

      // Default fallback for demo (e.g. initial items)
      setErrorMsg('This email is not registered in our commerce alumni registry. Please submit a registration request below.');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    
    // Submit registration request to Admin
    submitProfile({
      name: regForm.name,
      rollNumber: regForm.rollNumber,
      phone: regForm.phone,
      email: regForm.email,
      password: regForm.password, // Keep password for login
      college: regForm.college,
      degree: regForm.degree,
      fieldOfStudy: regForm.fieldOfStudy,
      eduStartYear: regForm.eduStartYear,
      eduEndYear: regForm.eduEndYear,
      profession: regForm.profession,
      company: regForm.company,
      linkedin: regForm.linkedin,
      skills: regForm.skills,
      bio: regForm.bio || `Commerce Alumnus specializing in ${regForm.degree}. Roll Number: ${regForm.rollNumber}`,
      status: 'pending'
    });

    setRegSubmitted(true);
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
      <div className="login-page" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
        padding: '2rem'
      }}>
        <motion.div 
          className="card login-card" 
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
              <div><strong>Roll Number:</strong> {regForm.rollNumber}</div>
              <div><strong>College:</strong> {regForm.college}</div>
              <div><strong>Education:</strong> {regForm.degree} in {regForm.fieldOfStudy} ({regForm.eduStartYear} - {regForm.eduEndYear})</div>
              <div><strong>Professional:</strong> {regForm.profession} at {regForm.company}</div>
              <div><strong>Phone Number:</strong> {regForm.phone}</div>
              <div><strong>Email:</strong> {regForm.email}</div>
              {regForm.linkedin && <div><strong>LinkedIn:</strong> {regForm.linkedin}</div>}
              {regForm.skills && <div><strong>Skills:</strong> {regForm.skills}</div>}
            </div>
          </div>

          <button 
            type="button" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', background: config.color }}
            onClick={() => {
              setRegSubmitted(false);
              setTab('signin');
              setRegForm({
                name: '',
                rollNumber: '',
                phone: '',
                email: '',
                password: '',
                college: '',
                degree: 'B.Com Accounts & Finance',
                fieldOfStudy: '',
                eduStartYear: '',
                eduEndYear: '',
                profession: '',
                company: '',
                linkedin: '',
                skills: '',
                bio: ''
              });
            }}
          >
            Return to Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="login-page" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
      padding: '2rem'
    }}>
      <div className="card login-card" style={{ maxWidth: '500px', width: '100%', padding: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '1rem',
            background: config.color,
            width: '80px',
            height: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '20px',
            margin: '0 auto 1.5rem',
            color: '#fff',
            boxShadow: `0 10px 25px ${config.color}33`
          }}>
            {config.icon}
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>{config.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{config.subtitle}</p>
        </div>

        {/* Tab Selection */}
        {role === 'alumni' && (
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
            <button 
              type="button"
              onClick={() => { setTab('signin'); setErrorMsg(''); }} 
              style={{ 
                flex: 1, 
                paddingBottom: '1rem', 
                borderBottom: tab === 'signin' ? `3px solid ${config.color}` : 'none',
                fontWeight: '700',
                color: tab === 'signin' ? 'var(--text-main)' : 'var(--text-dim)',
                fontSize: '0.9rem'
              }}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => { setTab('register'); setErrorMsg(''); }} 
              style={{ 
                flex: 1, 
                paddingBottom: '1rem', 
                borderBottom: tab === 'register' ? `3px solid ${config.color}` : 'none',
                fontWeight: '700',
                color: tab === 'register' ? 'var(--text-main)' : 'var(--text-dim)',
                fontSize: '0.9rem'
              }}
            >
              Request Access
            </button>
          </div>
        )}

        {errorMsg && (
          <div style={{ 
            background: '#fef2f2', 
            border: '1px solid #fee2e2', 
            color: '#dc2626', 
            padding: '0.875rem 1rem', 
            borderRadius: '12px', 
            fontSize: '0.85rem', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '600'
          }}>
            <XCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {tab === 'signin' ? (
          <form onSubmit={handleSignInSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                <Mail size={14} style={{ color: config.color }} /> Email Address
              </label>
              <input 
                type="email" 
                placeholder="alumni@commerce.edu" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '0.875rem 1rem' }}
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  <Lock size={14} style={{ color: config.color }} /> Password
                </label>
                <a href="#" style={{ fontSize: '0.8rem', color: config.color, fontWeight: '600' }}>Forgot?</a>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: '0.875rem 1rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', background: config.color }}>
              Sign In to Portal
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  <Hash size={14} style={{ color: config.color }} /> Roll Number
                </label>
                <input 
                  type="text" 
                  placeholder="COM202011" 
                  required 
                  value={regForm.rollNumber}
                  onChange={(e) => setRegForm({...regForm, rollNumber: e.target.value})}
                  style={{ padding: '0.875rem 1rem' }}
                />
              </div>
            </div>

            {/* Education Details */}
            <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}>
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
            </div>

            {/* Professional Info */}
            <div style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}>
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

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', background: config.color, marginTop: '0.5rem' }}>
              Submit Request for Approval
            </button>
          </form>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>← Back to Portals</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
