import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import { BarChart3, Users, Mail, ClipboardCheck, Zap, ArrowUpRight } from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container" style={{ padding: '2.5rem' }}>
      <DashboardHeader 
        title={`Faculty Portal: ${user?.name || 'Professor'}`}
        subtitle="Monitor department growth and alumni-student engagement."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Active Mentors', val: '142', change: '+12%', icon: <Users />, color: '#059669' },
          { label: 'Placements', val: '85%', change: '+5%', icon: <Zap />, color: '#f59e0b' },
          { label: 'Requests', val: '24', change: '-2', icon: <ClipboardCheck />, color: '#3b82f6' },
          { label: 'Engagements', val: '1.2k', change: '+18%', icon: <BarChart3 />, color: '#7c3aed' }
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ color: s.color }}>{s.icon}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: s.change.startsWith('+') ? '#059669' : '#ef4444', background: s.change.startsWith('+') ? '#ecfdf5' : '#fef2f2', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>{s.change}</div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>{s.val}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Alumni Contributions</h3>
            <button className="btn btn-sm btn-ghost">Export Data</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '700' }}>ALUMNUS</th>
                  <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '700' }}>INITIATIVE</th>
                  <th style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '700' }}>STATUS</th>
                  <th style={{ textAlign: 'right', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '700' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Sarah Chen', type: 'Guest Lecture', status: 'Approved', date: 'Oct 12' },
                  { name: 'Mike Ross', type: 'Project Grant', status: 'Pending', date: 'Oct 10' },
                  { name: 'Harvey Specter', type: 'Placement', status: 'Active', date: 'Oct 08' }
                ].map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--gray-50)' }}>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Class of 2015</div>
                    </td>
                    <td style={{ padding: '1.25rem 1rem' }}><span className="tag" style={{ background: 'var(--gray-50)', color: 'var(--text-main)' }}>{item.type}</span></td>
                    <td style={{ padding: '1.25rem 1rem' }}>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        fontWeight: '800', 
                        padding: '0.3rem 0.6rem', 
                        borderRadius: '6px',
                        background: item.status === 'Approved' ? '#ecfdf5' : item.status === 'Pending' ? '#fffbeb' : '#eff6ff',
                        color: item.status === 'Approved' ? '#059669' : item.status === 'Pending' ? '#d97706' : '#2563eb'
                      }}>{item.status}</span>
                    </td>
                    <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                      <button className="btn btn-sm btn-ghost">Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff', border: 'none' }}>
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Strategic Outreach</h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Your department has a 20% higher engagement rate when alumni from the Class of 2016-2018 are contacted for mentoring.
            </p>
            <button className="btn btn-sm btn-white" style={{ width: '100%' }}>Launch Campaign <ArrowUpRight size={14} /></button>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1.25rem' }}>System Alerts</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#fef2f2', borderRadius: '12px' }}>
                <Mail size={18} style={{ color: '#ef4444' }} />
                <div style={{ fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: '700', color: '#991b1b' }}>Pending Approvals</div>
                  <div style={{ color: '#b91c1c', opacity: 0.8 }}>12 mentors waiting for review</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
