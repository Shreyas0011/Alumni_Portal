import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Briefcase, Building, Phone, Link2, Calendar, FileText, CheckCircle, Clock, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const ProfileCompletion = () => {
  const { user, updateProfile } = useAuth();
  const { submitProfile } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    batch: '', // Expected Graduation Year
    dob: '',
    course: '',
    currentYear: '',
    phone: '',
    linkedin: '',
    bio: ''
  });

  const handleBypass = () => {
    const mockData = {
      fullName: formData.fullName || 'Test Student',
      email: formData.email || 'student@commerce.edu',
      batch: '2027',
      dob: '2005-05-15',
      course: 'B.Com Accounts & Finance',
      currentYear: '3rd Year',
      phone: '9876543210',
      linkedin: 'https://linkedin.com/in/teststudent',
      bio: 'Enthusiastic Commerce Student specializing in finance, investments, and accounting systems.'
    };

    submitProfile({
      name: mockData.fullName,
      email: mockData.email,
      batch: mockData.batch,
      dob: mockData.dob,
      course: mockData.course,
      currentYear: mockData.currentYear,
      phone: mockData.phone,
      linkedin: mockData.linkedin,
      bio: mockData.bio,
      status: 'approved'
    });

    updateProfile({
      name: mockData.fullName,
      dob: mockData.dob,
      profileStatus: 'approved',
      batch: mockData.batch,
      course: mockData.course,
      currentYear: mockData.currentYear,
      phone: mockData.phone,
      linkedin: mockData.linkedin,
      bio: mockData.bio
    });

    navigate('/student/dashboard');
  };

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Submit profile for admin approval
    submitProfile({
      name: formData.fullName,
      email: formData.email,
      batch: formData.batch,
      dob: formData.dob,
      course: formData.course,
      currentYear: formData.currentYear,
      phone: formData.phone,
      linkedin: formData.linkedin,
      bio: formData.bio
    });

    // Update user profile status
    updateProfile({
      name: formData.fullName,
      dob: formData.dob,
      profileStatus: 'pending',
      batch: formData.batch,
      course: formData.course,
      currentYear: formData.currentYear,
    });

    setSubmitted(true);
  };

  if (submitted || user?.profileStatus === 'pending') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '4rem 3rem',
            textAlign: 'center',
            maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            border: '1px solid var(--border)'
          }}
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
            Profile Under Review
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.7' }}>
            Your profile has been submitted for admin approval. You'll get full access once verified.
          </p>
          <div style={{
            background: 'var(--gray-50)', borderRadius: '16px', padding: '1.5rem',
            border: '1px solid var(--border)', marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fbbf24', animation: 'pulse 2s infinite' }}></div>
              <span style={{ fontWeight: '700', color: '#92400e', fontSize: '0.9rem' }}>Pending Approval</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem' }}
              onClick={() => navigate('/student/dashboard')}
            >
              Go to Student Dashboard (Limited Access)
            </button>
            <button
              type="button"
              className="btn"
              style={{ width: '100%', padding: '1rem', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontWeight: 'bold' }}
              onClick={handleBypass}
            >
              ⚡ Fast-Track & Approve Automatically (Testing Only)
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const fields = [
    { key: 'fullName', label: 'Full Name', type: 'text', icon: <User size={18} />, placeholder: 'John Doe', required: true },
    { key: 'email', label: 'Email Address', type: 'email', icon: <Mail size={18} />, placeholder: 'john@example.com', required: true },
    { key: 'batch', label: 'Expected Graduation Year', type: 'text', icon: <Calendar size={18} />, placeholder: '2027', required: true },
    { key: 'dob', label: 'Date of Birth', type: 'date', icon: <Calendar size={18} />, required: true },
    { key: 'course', label: 'Course / Degree', type: 'text', icon: <Briefcase size={18} />, placeholder: 'B.Com Accounts & Finance', required: true },
    { key: 'currentYear', label: 'Current Year of Study', type: 'text', icon: <Building size={18} />, placeholder: '3rd Year', required: true },
    { key: 'phone', label: 'Phone Number', type: 'tel', icon: <Phone size={18} />, placeholder: '+91 98765 43210' },
    { key: 'linkedin', label: 'LinkedIn Profile', type: 'url', icon: <Link2 size={18} />, placeholder: 'linkedin.com/in/yourprofile' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem' }}
        >
          <span className="badge" style={{ marginBottom: '1rem' }}>Complete Your Profile</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem' }}>
            Welcome to the <span className="text-gradient">Alumni Network</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
            Please complete your profile details. Your profile will be reviewed by admin before full access is granted.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} style={{
            background: '#fff', borderRadius: '24px', padding: '3rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.06)', border: '1px solid var(--border)'
          }}>
            <div style={{
              background: '#eff6ff', border: '1px dashed #bfdbfe', borderRadius: '16px',
              padding: '1.25rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
            }}>
              <div>
                <h4 style={{ fontWeight: '800', color: 'var(--blue-900)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>⚡ Fast-Track Access</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--blue-700)', margin: 0 }}>Bypass validation and enter the portal immediately with approved test data.</p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', background: 'var(--blue-700)' }}
                onClick={handleBypass}
              >
                Auto-Fill & Enter Portal
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              {fields.map((field) => (
                <div key={field.key} style={field.key === 'fullName' || field.key === 'email' ? {} : {}}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                    <span style={{ color: 'var(--blue-600)' }}>{field.icon}</span>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={formData[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    style={{ padding: '0.875rem 1rem', borderRadius: '12px' }}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                <span style={{ color: 'var(--blue-600)' }}><FileText size={18} /></span>
                Student Bio
              </label>
              <textarea
                rows="4"
                placeholder="Tell us about your academic interests, career goals, and projects..."
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                style={{ padding: '1rem', borderRadius: '12px', resize: 'none' }}
              />
            </div>

            <div style={{
              background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px',
              padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem'
            }}>
              <Clock size={18} style={{ color: '#92400e', flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', color: '#92400e', fontWeight: '500' }}>
                Your profile will be sent for admin approval. You'll receive access once your details are verified.
              </p>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
              <Send size={18} /> Submit Profile for Approval
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
