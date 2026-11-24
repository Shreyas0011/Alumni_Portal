import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const PortalSelection = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePortalAccess = (role) => {
    navigate(`/login/${role}`);
  };

  const portals = [
    {
      role: 'alumni',
      title: 'Alumni Portal',
      description: 'Reconnect with your roots and inspire the next generation.',
      icon: '🏛️',
      color: 'var(--blue-800)',
      features: ['Networking', 'Giving', 'Events']
    },
    {
      role: 'admin',
      title: 'Admin Portal',
      description: 'Oversee and manage the Alumni Connect platform and ecosystem.',
      icon: '🛡️',
      color: '#1e293b',
      features: ['Control Panel', 'User Approvals', 'Analytics']
    }
  ];

  return (
    <div className="portal-selection-page" style={{ 
      minHeight: 'auto', 
      background: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '6rem 2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Blobs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(5,150,105,0.03) 0%, transparent 70%)', borderRadius: '50%', zIndex: 0 }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative', zIndex: 1 }}
      >
        <span className="badge" style={{ marginBottom: '1rem' }}>Gateway to Community</span>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
          Choose Your <span className="text-gradient">Experience</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
          Access your personalized ecosystem instantly. No login required for this demo.
        </p>
      </motion.div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', 
        gap: '2.5rem', 
        width: '100%', 
        maxWidth: '800px', // Adjusted since we only have 2 cards now
        position: 'relative',
        zIndex: 1
      }}>
        {portals.map((portal, idx) => (
          <motion.div
            key={portal.role}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => handlePortalAccess(portal.role)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card portal-card" style={{ 
              padding: '3rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              background: '#fff',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              borderRadius: '24px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Card Header */}
              <div style={{ 
                fontSize: '3.5rem', 
                marginBottom: '2rem',
                width: '90px',
                height: '90px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gray-50)',
                borderRadius: '24px',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.03)'
              }} className="portal-icon">
                {portal.icon}
              </div>
              
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-main)' }}>{portal.title}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.6', flex: 1 }}>{portal.description}</p>
              
              {/* Feature Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
                {portal.features.map(f => (
                  <span key={f} style={{ fontSize: '0.7rem', fontWeight: '700', padding: '0.4rem 0.8rem', background: 'var(--gray-50)', borderRadius: '99px', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{f}</span>
                ))}
              </div>

              <div className="btn" style={{ 
                background: portal.color, 
                color: '#fff', 
                width: '100%', 
                padding: '1rem',
                borderRadius: '16px',
                fontWeight: '700',
                boxShadow: `0 10px 20px ${portal.role === 'admin' ? '#1e293b25' : '#1e3a8a25'}`
              }}>
                Enter {portal.title}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Simplified Student Login Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => handlePortalAccess('student')}
        style={{
          marginTop: '2.5rem',
          background: '#fff',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          borderRadius: '20px',
          padding: '1.25rem clamp(1.25rem, 4vw, 2rem)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem 1.5rem',
          flexWrap: 'wrap',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)',
          maxWidth: '800px',
          width: '100%',
          justifyContent: 'space-between',
          zIndex: 1,
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 260px', minWidth: 0 }}>
          <div style={{
            flexShrink: 0,
            fontSize: '1.75rem',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--blue-50)',
            borderRadius: '12px'
          }}>
            🎓
          </div>
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>Student Portal</h4>
            <p style={{ margin: '0.15rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Looking for mentors, jobs, or community? Access the student area here.
            </p>
          </div>
        </div>
        <button
          className="btn"
          style={{
            background: 'var(--blue-50)',
            color: 'var(--blue-600)',
            border: '1px solid var(--blue-100)',
            padding: '0.625rem 1.25rem',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: '700',
            whiteSpace: 'nowrap',
            pointerEvents: 'none' // Click handled by parent div
          }}
        >
          Enter Student Portal
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{ 
          marginTop: '4rem', 
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          padding: '2rem',
          borderTop: '1px solid var(--border)',
          width: '100%',
          maxWidth: '600px'
        }}
      >
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          New to the platform? Discover how we connect students, faculty, and alumni.
        </p>
        <Link to="/home" style={{ 
          color: 'var(--blue-600)', 
          fontWeight: '700', 
          fontSize: '1rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none'
        }}>
          Learn more about Alumni Connect <span>→</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default PortalSelection;
