import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = ({ role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const roleConfig = {
    student: {
      title: 'Student Portal',
      subtitle: 'Access your learning resources and network with alumni.',
      color: 'var(--blue-600)',
      icon: '🎓'
    },
    teacher: {
      title: 'Faculty Portal',
      subtitle: 'Manage mentorship programs and connect with former students.',
      color: '#059669', // Emerald
      icon: '👨‍🏫'
    },
    alumni: {
      title: 'Alumni Portal',
      subtitle: 'Give back to your alma mater and stay connected.',
      color: 'var(--blue-800)',
      icon: '🏛️'
    }
  };

  const config = roleConfig[role] || roleConfig.student;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name: `John ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      email,
      role: role
    };
    login(userData);
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="login-page" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--gray-50)',
      padding: '2rem'
    }}>
      <div className="card login-card" style={{ maxWidth: '450px', width: '100%', padding: '3rem' }}>
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '0.875rem 1rem' }}
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>Password</label>
              <a href="#" style={{ fontSize: '0.8rem', color: config.color, fontWeight: '600' }}>Forgot?</a>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '0.875rem 1rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', background: config.color }}>
            Sign In to Portal
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: config.color, fontWeight: '700' }}>Register here</Link>
        </div>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
