import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useSocial } from '../../context/SocialContext';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import LandingHero from '../../components/LandingHero';
import ProfileMeter from '../../components/ProfileMeter';
import { VerifiedBadge } from '../../components/Badges';
import { FamousAlumni, RecruitersAndFirms } from '../../components/Showcase';
import { api } from '../../lib/api';
import { BookOpen, Briefcase, Calendar, Star, TrendingUp, FileText, MessagesSquare } from 'lucide-react';

const ago = (d) => {
  const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return days === 1 ? 'yesterday' : `${days} days ago`;
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const { jobs, events, alumniList, interviews } = useData();
  const { sessions, sessionStats } = useSocial();
  const [reviews, setReviews] = useState([]);
  useEffect(() => { api.get('/api/social/reviews').then(setReviews).catch(() => {}); }, []);

  const pending = user?.profileStatus === 'pending';
  const today = new Date().toISOString().slice(0, 10);
  const referralJobs = jobs.filter(j => j.referral).length;
  const myRequests = jobs.filter(j => (j.requests || []).some(r => r.userId === user?.id));
  const mySessions = sessions.filter(s => s.menteeId === user?.id);
  const upcomingSessions = mySessions.filter(s => ['requested', 'confirmed'].includes(s.status) && new Date(s.slot) > new Date());
  const nextEvent = events.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];

  // Most-requested verified alumni first
  const mentors = useMemo(() => [...alumniList]
    .sort((a, b) => (sessionStats[b.id] || 0) - (sessionStats[a.id] || 0))
    .slice(0, 3), [alumniList, sessionStats]);

  // Latest real activity from alumni: jobs and interview write-ups
  const activity = useMemo(() => [
    ...jobs.map(j => ({ key: j.id, text: `${j.postedByName} posted ${j.title} at ${j.company}`, at: j.postedAt, to: '/jobs' })),
    ...interviews.map(i => ({ key: i.id, text: `${i.authorName} shared a ${i.company} interview experience`, at: i.createdAt, to: '/career?tab=interviews' })),
  ].filter(a => a.at).sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 4), [jobs, interviews]);

  const readiness = [
    { label: 'Profile approved by admin', done: user?.profileStatus === 'approved', to: '/profile/complete' },
    { label: 'Get your resume reviewed', done: reviews.some(r => r.status === 'reviewed'), to: '/career?tab=resume' },
    { label: 'Request a session with a mentor', done: mySessions.length > 0, to: '/mentorship' },
    { label: 'Request a referral', done: myRequests.length > 0, to: '/jobs' },
    { label: 'Register for an event', done: events.some(e => (e.registrations || []).some(r => r.userId === user?.id)), to: '/events' },
  ];

  return (
    <div className="dashboard-container" style={{ padding: '2.5rem' }}>
      <LandingHero
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Student'}! 👋`}
        subtitle="Your campus, your network — find mentors, jobs and referrals from alumni."
      />
      <DashboardHeader
        title="Your Dashboard"
        subtitle="Here's what's happening in your network today."
      />

      {pending && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '16px', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ fontWeight: '700', color: '#92400e' }}>Profile Pending Approval</div>
          <div style={{ color: '#a16207', fontSize: '0.85rem' }}> — You have limited access until an admin verifies your student status. Mentorship connections are disabled.</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1 }}><BookOpen size={48} /></div>
          <div className="feature-icon" style={{ background: 'var(--blue-50)', color: 'var(--blue-600)' }}><Star size={20} /></div>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Mentorship</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {upcomingSessions.length ? `${upcomingSessions.length} upcoming session${upcomingSessions.length > 1 ? 's' : ''}.` : 'No sessions requested yet.'}
          </p>
          <Link to="/mentorship" className="btn btn-sm btn-outline" style={{ width: '100%' }}>{upcomingSessions.length ? 'View Sessions' : 'Find a Mentor'}</Link>
        </div>

        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1 }}><Briefcase size={48} /></div>
          <div className="feature-icon" style={{ background: '#fef3c7', color: '#d97706' }}><TrendingUp size={20} /></div>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Jobs & Referrals</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {jobs.length} openings from alumni · {referralJobs} with referrals{myRequests.length ? ` · ${myRequests.length} requested by you` : ''}.
          </p>
          <Link to={myRequests.length ? '/jobs?view=requests' : '/jobs'} className="btn btn-sm btn-outline" style={{ width: '100%' }}>{myRequests.length ? 'Track My Referrals' : 'Browse Jobs'}</Link>
        </div>

        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1 }}><Calendar size={48} /></div>
          <div className="feature-icon" style={{ background: '#e0e7ff', color: '#4f46e5' }}><Calendar size={20} /></div>
          <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Events</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {nextEvent ? `Next: ${nextEvent.title} on ${new Date(nextEvent.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}.` : 'No upcoming events right now.'}
          </p>
          <Link to="/events" className="btn btn-sm btn-outline" style={{ width: '100%' }}>{nextEvent ? 'Register Now' : 'See Events'}</Link>
        </div>
      </div>

      <div className="dash-split" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Recommended Mentors</h3>
            <Link to="/mentorship" className="btn btn-sm btn-ghost">View All</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {mentors.map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.25rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', border: '1px solid transparent', transition: 'all 0.3s ease', flexWrap: 'wrap' }} className="mentor-row">
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `linear-gradient(135deg, var(--blue-600), var(--blue-400))`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.25rem', fontWeight: '800', flexShrink: 0 }}>{m.name[0]}</div>
                <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                  <div style={{ fontWeight: '800', fontSize: '1rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: 4 }}>{m.name} <VerifiedBadge size={14} /></div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{m.profession} at {m.company}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {String(m.skills || '').split(',').map(t => t.trim()).filter(Boolean).slice(0, 2).map(t => <span key={t} style={{ fontSize: '0.65rem', fontWeight: '700', padding: '0.25rem 0.6rem', background: '#fff', border: '1px solid var(--border)', borderRadius: '6px' }}>{t}</span>)}
                  </div>
                </div>
                {pending
                  ? <button className="btn btn-sm btn-primary" disabled style={{ opacity: 0.5 }}>Request</button>
                  : <Link to="/mentorship" className="btn btn-sm btn-primary">Request</Link>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <ProfileMeter title="Career Readiness" hint="Finish these steps to get the most from your alumni network." items={readiness} />

          <div className="card">
            <h3 style={{ marginBottom: '1.25rem' }}>Alumni Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activity.length === 0 && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No activity yet.</div>}
              {activity.map((a) => (
                <Link key={a.key} to={a.to} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem', color: 'inherit', textDecoration: 'none' }}>
                  {a.to.startsWith('/jobs') ? <Briefcase size={15} style={{ color: 'var(--blue-600)', marginTop: 2, flexShrink: 0 }} /> : <MessagesSquare size={15} style={{ color: 'var(--blue-600)', marginTop: 2, flexShrink: 0 }} />}
                  <div>
                    <div style={{ fontWeight: '600' }}>{a.text}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{ago(a.at)}</div>
                  </div>
                </Link>
              ))}
              <Link to="/career?tab=resume" className="btn btn-sm btn-outline" style={{ marginTop: '0.25rem' }}><FileText size={14} /> Get a Resume Review</Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <FamousAlumni />
        <RecruitersAndFirms />
      </div>
    </div>
  );
};

export default StudentDashboard;
