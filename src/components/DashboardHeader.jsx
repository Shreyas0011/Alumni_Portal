import React from 'react';
import { Search, Bell, Settings, Command } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardHeader = ({ title, subtitle }) => {
  const { user } = useAuth();

  return (
    <div className="dashboard-header" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      flexWrap: 'wrap',
      gap: '1rem 1.5rem',
      marginBottom: '2.5rem',
      paddingBottom: '1.5rem',
      borderBottom: '1px solid var(--border)'
    }}>
      <div style={{ flex: '1 1 260px', minWidth: 0 }}>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4.5vw, 1.8rem)', fontWeight: '800', marginBottom: '0.25rem', textWrap: 'balance' }}>{title}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{subtitle}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 280px', maxWidth: '420px', justifyContent: 'flex-end' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input 
            type="text" 
            placeholder="Search resources, mentors..." 
            style={{ 
              padding: '0.7rem 3rem 0.7rem 2.75rem', 
              background: 'var(--white)', 
              borderRadius: '12px',
              fontSize: '0.85rem'
            }} 
          />
          <div style={{ 
            position: 'absolute', 
            right: '0.75rem', 
            top: '50%', 
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            background: 'var(--gray-50)',
            padding: '2px 6px',
            borderRadius: '4px',
            border: '1px solid var(--border)',
            color: 'var(--text-dim)',
            fontSize: '0.65rem',
            fontWeight: '700'
          }}>
            <Command size={10} /> K
          </div>
        </div>

        <button className="btn-icon btn-ghost" style={{ flexShrink: 0 }} aria-label="Notifications">
          <Bell size={20} />
          <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid #fff' }}></span>
        </button>
        
        <button className="btn-icon btn-ghost" style={{ flexShrink: 0 }} aria-label="Settings">
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
