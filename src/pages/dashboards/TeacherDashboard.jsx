import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import LandingHero from '../../components/LandingHero';
import { FamousAlumni, RecruitersAndFirms } from '../../components/Showcase';
import { api } from '../../lib/api';
import { Users, ClipboardCheck, Briefcase, HeartHandshake, FileText, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const STATUS = {
  confirmed: ['#ecfdf5', '#059669', 'Confirmed'],
  pending: ['#fffbeb', '#d97706', 'Awaiting you'],
  declined: ['#fef2f2', '#dc2626', 'Declined'],
};

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { alumniList, jobs, volunteering } = useData();
  const [openReviews, setOpenReviews] = useState(0);
  useEffect(() => {
    api.get('/api/social/reviews').then(r => setOpenReviews(r.filter(x => x.status === 'open').length)).catch(() => {});
  }, []);

  const referralsGiven = jobs.reduce((n, j) => n + (j.requests || []).filter(r => ['referred', 'accepted', 'interviewing', 'offer'].includes(r.status)).length, 0);
  const signups = useMemo(() => volunteering.flatMap(v => (v.signups || []).map(s => ({ ...s, request: v, mine: v.postedById === user?.id })))
    .sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0)), [volunteering, user?.id]);
  const waitingOnMe = signups.filter(s => s.mine && s.status === 'pending').length;
  const volunteers = new Set(signups.map(s => s.userId)).size;

  const stats = [
    { label: 'Verified Alumni', val: alumniList.length, icon: <Users />, color: '#059669' },
    { label: 'Open Jobs', val: jobs.length, icon: <Briefcase />, color: '#f59e0b' },
    { label: 'Referrals Given', val: referralsGiven, icon: <ClipboardCheck />, color: '#3b82f6' },
    { label: 'Volunteer Sign-ups', val: signups.length, icon: <HeartHandshake />, color: '#7c3aed' },
  ];

  return (
    <div className="dashboard-container" style={{ padding: '2.5rem' }}>
      <LandingHero
        title={`Welcome, ${user?.name || 'Professor'}`}
        subtitle="Your department, its graduates and the companies that hire them."
      />
      <DashboardHeader
        title="Faculty Dashboard"
        subtitle="Monitor department growth and alumni-student engagement."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {stats.map((s) => (
          <div key={s.label} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ color: s.color, marginBottom: '1rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>{s.val.toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dash-split" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Alumni Contributions</h3>
            <Link to="/career?tab=volunteer" className="btn btn-sm btn-ghost">Manage</Link>
          </div>
          {signups.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No alumni have signed up yet. Post a guest lecture or mock-interview request to get started.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['ALUMNUS', 'INITIATIVE', 'STATUS'].map(h => <th key={h} style={{ textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '700' }}>{h}</th>)}
                    <th style={{ textAlign: 'right', padding: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '700' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {signups.slice(0, 6).map((s) => {
                    const st = STATUS[s.status] || STATUS.pending;
                    return (
                      <tr key={`${s.request.id}-${s.userId}`} style={{ borderBottom: '1px solid var(--gray-50)' }}>
                        <td style={{ padding: '1.25rem 1rem' }}>
                          <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{s.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{[s.company, s.batch && `Class of ${s.batch}`].filter(Boolean).join(' · ')}</div>
                        </td>
                        <td style={{ padding: '1.25rem 1rem' }}><span className="tag" style={{ background: 'var(--gray-50)', color: 'var(--text-main)' }}>{s.request.kind}</span></td>
                        <td style={{ padding: '1.25rem 1rem' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: '800', padding: '0.3rem 0.6rem', borderRadius: '6px', background: st[0], color: st[1] }}>{s.mine || s.status !== 'pending' ? st[2] : 'Pending'}</span>
                        </td>
                        <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                          <Link to="/career?tab=volunteer" className="btn btn-sm btn-ghost">Review</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff', border: 'none' }}>
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Invite Alumni to Teach</h3>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              {volunteers
                ? `${volunteers} alumn${volunteers === 1 ? 'us has' : 'i have'} volunteered so far. Post a guest lecture, mock interview or judging request.`
                : 'Ask alumni to give a guest lecture, take mock interviews or judge a competition.'}
            </p>
            <Link to="/career?tab=volunteer" className="btn btn-sm btn-white" style={{ width: '100%' }}>Post a Request <ArrowUpRight size={14} /></Link>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1.25rem' }}>Needs Your Attention</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {waitingOnMe > 0 && (
                <Link to="/career?tab=volunteer" style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#fffbeb', borderRadius: '12px', textDecoration: 'none' }}>
                  <HeartHandshake size={18} style={{ color: '#d97706', flexShrink: 0 }} />
                  <div style={{ fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: '700', color: '#92400e' }}>Volunteer sign-ups to confirm</div>
                    <div style={{ color: '#a16207' }}>{waitingOnMe} waiting on your requests</div>
                  </div>
                </Link>
              )}
              {openReviews > 0 && (
                <Link to="/career?tab=resume" style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#eff6ff', borderRadius: '12px', textDecoration: 'none' }}>
                  <FileText size={18} style={{ color: 'var(--blue-700)', flexShrink: 0 }} />
                  <div style={{ fontSize: '0.85rem' }}>
                    <div style={{ fontWeight: '700', color: 'var(--blue-900)' }}>Resumes waiting for review</div>
                    <div style={{ color: 'var(--blue-700)' }}>{openReviews} student{openReviews === 1 ? '' : 's'} asked for feedback</div>
                  </div>
                </Link>
              )}
              {!waitingOnMe && !openReviews && (
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={18} style={{ color: '#059669' }} /> Nothing waiting on you.
                </div>
              )}
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

export default TeacherDashboard;
