import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import NotificationToast from '../../components/NotificationToast';
import { Heart, Users, Briefcase, MessageSquare, Award, Globe } from 'lucide-react';

const AlumniDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container" style={{ padding: '2.5rem' }}>
      <DashboardHeader 
        title={`Welcome Home, ${user?.name?.split(' ')[0] || 'Alumnus'}! 🏛️`}
        subtitle="Stay connected, give back, and explore your global network."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--blue-900), var(--blue-700))', color: '#fff', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <Award size={32} style={{ opacity: 0.8 }} />
            <div style={{ fontSize: '0.7rem', fontWeight: '700', padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.2)', borderRadius: '6px' }}>SILVER DONOR</div>
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Total Contribution</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem' }}>$12,450.00</div>
          <button className="btn btn-sm btn-white" style={{ width: '100%' }}>Manage Giving</button>
        </div>

        <div className="card">
          <div className="feature-icon" style={{ background: '#fef2f2', color: '#ef4444' }}><Heart size={20} /></div>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Mentoring</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>3 students waiting for your advice.</p>
          <button className="btn btn-sm btn-outline" style={{ width: '100%' }}>Review Requests</button>
        </div>

        <div className="card">
          <div className="feature-icon" style={{ background: '#f0f9ff', color: '#0ea5e9' }}><Globe size={20} /></div>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Chapter News</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>New chapter opening in Singapore.</p>
          <button className="btn btn-sm btn-outline" style={{ width: '100%' }}>Read More</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Peers in your Industry</h3>
            <button className="btn btn-sm btn-ghost">Search Directory</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { name: 'David Miller', role: 'CTO @ FinTech', location: 'London' },
              { name: 'Elena Rossi', role: 'Design Lead @ Airbnb', location: 'SF' },
              { name: 'Sam Chen', role: 'DevOps @ AWS', location: 'Seattle' },
              { name: 'Aisha Khan', role: 'Data Scientist', location: 'Dubai' }
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '16px', transition: 'var(--transition)' }} className="peer-card">
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'var(--blue-700)' }}>{p.name[0]}</div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{p.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Share an Update</h3>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <textarea 
              placeholder="Tell your peers what you've been up to..." 
              style={{ height: '120px', padding: '1rem', background: 'var(--gray-50)', border: '1px solid var(--border)', borderRadius: '12px', resize: 'none' }}
            ></textarea>
            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn-icon btn-sm btn-ghost"><Globe size={14} /></button>
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', background: 'var(--blue-800)', padding: '0.8rem' }}>
            Post to Network <MessageSquare size={16} />
          </button>
        </div>
      </div>
      <NotificationToast />
    </div>
  );
};

export default AlumniDashboard;
