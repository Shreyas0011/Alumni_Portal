import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import { BookOpen, Briefcase, Calendar, Star, TrendingUp, Users } from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container" style={{ padding: '2.5rem' }}>
      <DashboardHeader 
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Student'}! 👋`}
        subtitle="Here's what's happening in your network today."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1 }}><BookOpen size={48} /></div>
          <div className="feature-icon" style={{ background: 'var(--blue-50)', color: 'var(--blue-600)' }}><Star size={20} /></div>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Mentorship</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>2 upcoming sessions this week.</p>
          <Link to="/mentorship" className="btn btn-sm btn-outline" style={{ width: '100%' }}>View Sessions</Link>
        </div>

        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1 }}><Briefcase size={48} /></div>
          <div className="feature-icon" style={{ background: '#fef3c7', color: '#d97706' }}><TrendingUp size={20} /></div>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Opportunities</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>5 new matching job postings.</p>
          <button className="btn btn-sm btn-outline" style={{ width: '100%' }}>Browse Jobs</button>
        </div>

        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1 }}><Calendar size={48} /></div>
          <div className="feature-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}><Calendar size={20} /></div>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Events</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Alumni Meetup 2024 starts soon.</p>
          <Link to="/events" className="btn btn-sm btn-outline" style={{ width: '100%' }}>Register Now</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Recommended Mentors</h3>
            <button className="btn btn-sm btn-ghost">View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { name: 'Dr. Emily Chen', role: 'Senior Architect at Google', tags: ['Backend', 'System Design'] },
              { name: 'Marcus Thorne', role: 'Product Lead at Meta', tags: ['PM', 'Strategy'] },
              { name: 'Sarah Jenkins', role: 'Venture Partner', tags: ['Entrepreneurship'] }
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid transparent', transition: 'all 0.3s ease' }} className="mentor-row">
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `linear-gradient(135deg, var(--blue-600), var(--blue-400))`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.25rem', fontWeight: '800' }}>{m.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '800', fontSize: '1rem', marginBottom: '0.25rem' }}>{m.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{m.role}</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {m.tags.map(t => <span key={t} style={{ fontSize: '0.65rem', fontWeight: '700', padding: '0.25rem 0.6rem', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px' }}>{t}</span>)}
                  </div>
                </div>
                <button className="btn btn-sm btn-primary">Connect</button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ background: 'var(--gray-900)', color: '#fff', border: 'none', boxShadow: '0 20px 40px rgba(15,23,42,0.2)' }}>
            <h3 style={{ marginBottom: '1.25rem', color: '#fff' }}>Skill Progress</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.8 }}>
                  <span>React Ecosystem</span>
                  <span>80%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                  <div style={{ width: '80%', height: '100%', background: 'var(--blue-500)', borderRadius: '3px', boxShadow: '0 0 10px var(--blue-500)' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.8 }}>
                  <span>System Design</span>
                  <span>45%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                  <div style={{ width: '45%', height: '100%', background: '#f59e0b', borderRadius: '3px', boxShadow: '0 0 10px #f59e0b' }}></div>
                </div>
              </div>
            </div>
            <button className="btn btn-sm btn-white" style={{ width: '100%', marginTop: '2rem' }}>Personal Roadmap</button>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1.25rem' }}>Alumni Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { text: 'New job posted by TechCorp', time: '1h ago' },
                { text: 'Reunion 2024 dates announced', time: '4h ago' }
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--blue-500)', marginTop: '0.4rem', flexShrink: 0 }}></div>
                  <div>
                    <div style={{ fontWeight: '600' }}>{a.text}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
