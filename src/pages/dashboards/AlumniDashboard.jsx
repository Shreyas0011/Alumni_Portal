import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/DashboardHeader';
import LandingHero from '../../components/LandingHero';
import { FamousAlumni, RecruitersAndFirms } from '../../components/Showcase';
import ProfileMeter from '../../components/ProfileMeter';
import { ReportButton } from '../../components/Badges';
import { Heart, Users, Briefcase, MessageSquare, Award, Globe, Cake, Trophy, Clock, Send, CheckCircle, AlertCircle, Calendar, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const AlumniDashboard = () => {
  const { user, updateProfile } = useAuth();
  const { 
    achievements, posts, addPost, getTodayBirthdays, 
    events, broadcasts, jobs, volunteering, alumniList,
    wishedAlumni, automationSettings 
  } = useData();
  const [postText, setPostText] = useState('');
  const [postSubmitted, setPostSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Achievement Post states
  const [isAchievementPost, setIsAchievementPost] = useState(true);
  const [achTitle, setAchTitle] = useState('');
  const [achCategory, setAchCategory] = useState('General');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    email: '',
    batch: '',
    branch: '',
    bio: '',
    company: '',
    profession: '',
    linkedin: ''
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Synchronize form when user loads or updates
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        batch: user.batch || '',
        branch: user.branch || '',
        bio: user.bio || '',
        company: user.company || '',
        profession: user.profession || user.role || '',
        linkedin: user.linkedin || ''
      });
    }
  }, [user]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 4000);
  };

  const todayBirthdays = getTodayBirthdays();
  const approvedPosts = posts.filter(p => p.status === 'approved');
  const myPendingPosts = posts.filter(p => p.status === 'pending' && p.authorId === user?.id);

  const handlePostSubmit = () => {
    if (isAchievementPost) {
      if (!achTitle.trim() || !postText.trim()) return;
      addPost({
        authorId: user?.id,
        authorName: user?.name,
        authorBatch: user?.batch || '2020',
        title: achTitle,
        category: achCategory,
        content: postText,
        isAchievement: true
      });
      setAchTitle('');
      setAchCategory('General');
    } else {
      if (!postText.trim()) return;
      addPost({
        authorId: user?.id,
        authorName: user?.name,
        authorBatch: user?.batch || '2020',
        content: postText,
        isAchievement: false
      });
    }
    setPostText('');
    setPostSubmitted(true);
    setTimeout(() => setPostSubmitted(false), 4000);
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const formatTime = (d) => d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Never';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Globe size={16} /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy size={16} /> },
    { id: 'feed', label: 'Community Feed', icon: <MessageSquare size={16} /> },
    { id: 'birthdays', label: 'Birthdays', icon: <Cake size={16} /> },
    { id: 'profile', label: 'My Profile', icon: <Users size={16} /> },
  ];

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

  return (
    <div className="dashboard-container" style={{ padding: '2.5rem' }}>
      <LandingHero
        title={`Welcome, ${user?.name?.split(' ')[0] || 'Alumnus'}! 🏛️`}
        subtitle="Back on campus, wherever you are. Post jobs, refer juniors and stay in touch with your batch."
      />
      <DashboardHeader
        title="Your Alumni Dashboard"
        subtitle={`Last signed in ${formatTime(user?.lastLogin)} · Profile last updated ${user?.lastProfileUpdate ? formatTime(user.lastProfileUpdate) : 'never'}`}
      />

      {/* Profile Status Banner */}
      {user?.profileStatus === 'pending' && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '16px', padding: '1.25rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Clock size={20} style={{ color: '#92400e' }} />
          <div><span style={{ fontWeight: '700', color: '#92400e' }}>Profile Pending Approval</span><span style={{ color: '#a16207', fontSize: '0.85rem' }}> — Some features are limited until admin verifies your profile.</span></div>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="seg" role="tablist" aria-label="Dashboard sections" style={{ marginBottom: '1.75rem' }}>
        {tabs.map(tab => (
          <button key={tab.id} role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
            {[
              { label: 'Achievements', value: achievements.length, icon: <Trophy size={20} />, color: '#f59e0b', bg: '#fffbeb' },
              { label: 'Community Posts', value: approvedPosts.length, icon: <MessageSquare size={20} />, color: '#3b82f6', bg: '#eff6ff' },
              { label: 'Upcoming Events', value: events.filter(e => e.date && e.date >= new Date().toISOString().slice(0, 10)).length, icon: <Calendar size={20} />, color: '#8b5cf6', bg: '#f5f3ff' },
              { label: "Today's Birthdays", value: todayBirthdays.length, icon: <Cake size={20} />, color: '#ec4899', bg: '#fdf2f8' },
            ].map((s, i) => (
              <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '14px', background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{s.value}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</div></div>
              </div>
            ))}
          </div>
          <div className="dash-split" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
          {/* Jobs & referrals — the main reason students visit alumni */}
          {(() => {
            const myJobs = jobs.filter(j => j.postedById === user?.id);
            const pendingReqs = myJobs.reduce((n, j) => n + (j.requests || []).filter(r => r.status === 'pending').length, 0);
            return (
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', background: 'var(--blue-50)', borderColor: 'var(--blue-100)' }}>
                <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'var(--blue-700)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Briefcase size={22} /></div>
                <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>Jobs & Referrals</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {myJobs.length ? `You have ${myJobs.length} posting${myJobs.length > 1 ? 's' : ''} · ${pendingReqs} referral request${pendingReqs === 1 ? '' : 's'} waiting.` : 'Students are looking for referrals. Share an opening at your company.'}
                  </div>
                </div>
                <Link to="/jobs" className="btn btn-primary btn-sm">{myJobs.length ? 'Manage Postings' : 'Post a Job'}</Link>
              </div>
            );
          })()}
          {/* Recent Broadcasts */}
          {broadcasts.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={18} style={{ color: 'var(--blue-700)' }} /> Latest announcements</h3>
              {broadcasts.slice(0, 3).map(bc => (
                <div key={bc.id} style={{ padding: '0.9rem 1rem', background: 'var(--gray-50)', borderRadius: '12px', marginTop: '0.6rem' }}>
                  <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{bc.title}</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{bc.message}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{formatDate(bc.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
            </div>
          {/* Profile completeness */}
          {(() => {
            const record = { ...(alumniList.find(a => a.id === user?.id) || {}), ...user };
            const toProfile = () => setActiveTab('profile');
            const items = [
              { label: 'Add your current company', done: Boolean(record.company), onClick: toProfile },
              { label: 'Add your job title', done: Boolean(record.profession), onClick: toProfile },
              { label: 'Add your phone number', done: Boolean(record.phone), onClick: toProfile },
              { label: 'Link your LinkedIn profile', done: Boolean(record.linkedin), onClick: toProfile },
              { label: 'Write a short bio', done: Boolean(record.bio), onClick: toProfile },
              { label: 'Post a job or referral', done: jobs.some(j => j.postedById === user?.id), to: '/jobs' },
              { label: 'Volunteer for a campus activity', done: volunteering.some(v => (v.signups || []).some(x => x.userId === user?.id)), to: '/career?tab=volunteer' },
            ];
            return (
              <ProfileMeter title="Your profile" hint="Complete profiles show up first in Directory and Mentorship searches." items={items} />
            );
          })()}
          </div>
          <FamousAlumni />
          <RecruitersAndFirms showRecruiters={false} />
        </motion.div>
      )}

      {/* ACHIEVEMENTS TAB */}
      {activeTab === 'achievements' && (() => {
        const alumniAchievements = posts.filter(p => p.status === 'approved' && p.isAchievement);
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem' }}>🏆 Institution Achievements</h3>
            {achievements.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No achievements posted yet.</div>
            ) : (
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                {achievements.map(ach => (
                  <div key={ach.id} className="card" style={{ borderLeft: '4px solid var(--blue-700)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <span className="tag" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{ach.category}</span>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: '700' }}>{ach.title}</h4>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{formatDate(ach.date)}</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7' }}>{ach.description}</p>
                  </div>
                ))}
              </div>
            )}

            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: '3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={22} style={{ color: '#f59e0b' }} /> Alumni Career Milestones
            </h3>
            {alumniAchievements.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                No alumni milestones have been posted yet.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1.5rem' }}>
                {alumniAchievements.map(ach => (
                  <div 
                    key={ach.id} 
                    className="card" 
                    style={{ 
                      borderLeft: '4px solid #f59e0b',
                      background: 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span className="tag" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', fontSize: '0.72rem' }}>
                          {ach.category}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          {formatDate(ach.createdAt)}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--blue-900)', marginBottom: '0.5rem' }}>
                        🏆 {ach.title}
                      </h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                        {ach.content}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: 'auto' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--blue-100)', color: 'var(--blue-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.8rem' }}>
                        {ach.authorName?.[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.82rem', color: 'var(--text-main)' }}>{ach.authorName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Class of {ach.authorBatch}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        );
      })()}

      {/* COMMUNITY FEED TAB */}
      {activeTab === 'feed' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Create Post */}
          <div className="card" style={{ marginBottom: '2rem', padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.25rem', fontSize: '1.2rem', fontWeight: '800' }}>Share with Community</h3>
            
            {/* Toggle button type */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <button 
                type="button" 
                onClick={() => setIsAchievementPost(true)}
                style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '8px', 
                  border: '1px solid',
                  borderColor: isAchievementPost ? 'var(--blue-700)' : 'var(--border)',
                  background: isAchievementPost ? 'var(--blue-50)' : '#fff',
                  color: isAchievementPost ? 'var(--blue-900)' : 'var(--text-muted)',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                🏆 Share Achievement / Milestone
              </button>
              <button 
                type="button" 
                onClick={() => setIsAchievementPost(false)}
                style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '8px', 
                  border: '1px solid',
                  borderColor: !isAchievementPost ? 'var(--blue-700)' : 'var(--border)',
                  background: !isAchievementPost ? 'var(--blue-50)' : '#fff',
                  color: !isAchievementPost ? 'var(--blue-900)' : 'var(--text-muted)',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                💬 General Update
              </button>
            </div>

            {isAchievementPost ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.25rem' }}>Achievement Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Cleared CA Final with All India Rank!"
                      value={achTitle}
                      onChange={e => setAchTitle(e.target.value)}
                      style={{ padding: '0.75rem 1rem', width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.25rem' }}>Category</label>
                    <select 
                      value={achCategory}
                      onChange={e => setAchCategory(e.target.value)}
                      style={{ padding: '0.75rem 1rem', width: '100%', border: '1px solid var(--border)', borderRadius: '10px' }}
                    >
                      <option value="CA / Professional Milestone">CA Milestone</option>
                      <option value="CFA / Financial Analyst">CFA Milestone</option>
                      <option value="Corporate Promotion">Promotion</option>
                      <option value="New Business Venture">Entrepreneurship</option>
                      <option value="Academic / Research">Academic</option>
                      <option value="General Career Update">General</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.25rem' }}>Achievement details / story</label>
                  <textarea 
                    placeholder="Describe your achievement journey, challenges faced, or tips for juniors..." 
                    value={postText} 
                    onChange={e => setPostText(e.target.value)} 
                    style={{ height: '80px', padding: '0.75rem 1rem', borderRadius: '10px', resize: 'none', background: 'var(--gray-50)', width: '100%' }} 
                  />
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.25rem' }}>Your update / post</label>
                <textarea 
                  placeholder="Share a general update, ask a question, or start a discussion..." 
                  value={postText} 
                  onChange={e => setPostText(e.target.value)} 
                  style={{ height: '80px', padding: '0.75rem 1rem', borderRadius: '10px', resize: 'none', background: 'var(--gray-50)', width: '100%' }} 
                />
              </div>
            )}

            {postSubmitted && (
              <div style={{ color: '#059669', fontSize: '0.85rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} /> Submitted successfully! It will appear on the feed once approved by the admin.
              </div>
            )}
            {myPendingPosts.length > 0 && (
              <div style={{ color: '#b45309', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                📋 You have {myPendingPosts.length} post(s) / achievement(s) pending admin review.
              </div>
            )}

            <button 
              className="btn btn-primary" 
              style={{ background: 'var(--blue-800)', width: '220px' }} 
              onClick={handlePostSubmit} 
              disabled={isAchievementPost ? (!achTitle.trim() || !postText.trim()) : !postText.trim()}
            >
              <Send size={16} /> Submit for Approval
            </button>
          </div>

          {/* Approved Posts */}
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.25rem' }}>Community Updates & Achievements</h3>
          {approvedPosts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No updates shared yet.</div>
          ) : (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {approvedPosts.map(post => (
                <div 
                  key={post.id} 
                  className="card" 
                  style={{ 
                    borderLeft: post.isAchievement ? '4px solid #f59e0b' : '1px solid var(--border)',
                    background: post.isAchievement ? 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)' : '#fff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--blue-100)', color: 'var(--blue-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>{post.authorName?.[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{post.authorName}</div>
                        {post.isAchievement && (
                          <span className="tag" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Trophy size={12} /> {post.category}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Batch {post.authorBatch} · {formatDate(post.createdAt)}</div>
                    </div>
                  </div>
                  {post.title && <h4 style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--blue-900)', marginBottom: '0.5rem' }}>🏆 {post.title}</h4>}
                  <p style={{ color: 'var(--text-main)', fontSize: '0.925rem', lineHeight: '1.7' }}>{post.content}</p>
                  {post.authorId !== user?.id && post.authorName !== user?.name && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <ReportButton kind="post" itemId={post.id} itemTitle={post.title || `Post by ${post.authorName}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* EVENTS TAB */}
      {/* BIRTHDAYS TAB */}
      {activeTab === 'birthdays' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem' }}>🎂 Today's Birthdays</h3>
          {todayBirthdays.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <Cake size={48} style={{ color: 'var(--text-dim)', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>No birthdays today. Check back tomorrow!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {todayBirthdays.map((person, i) => {
                const todayKey = new Date().toISOString().split('T')[0];
                const isAutoWished = wishedAlumni?.[todayKey]?.includes(person.id);
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card" style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)', border: '1px solid #fbcfe8', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-10px', fontSize: '6rem', opacity: 0.1 }}>🎂</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899, #f472b6)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.25rem' }}>{person.name[0]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <h4 style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.25rem' }}>🎉 Happy Birthday, {person.name}!</h4>
                          {isAutoWished && (
                            <span style={{ fontSize: '0.72rem', background: 'linear-gradient(135deg, #ec4899, #db2777)', color: '#fff', padding: '0.25rem 0.6rem', borderRadius: '8px', fontWeight: '700', boxShadow: '0 2px 6px rgba(219, 39, 119, 0.25)', display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
                              ✨ Wished by Alumni Connect
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#9d174d' }}>{person.profession} at {person.company} · Batch {person.batch}</p>
                        <p style={{ fontSize: '0.9rem', color: '#be185d', fontStyle: 'italic', marginTop: '0.5rem' }}>{person.birthdayMessage}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* MY PROFILE TAB */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))', gap: '2.5rem', alignItems: 'start' }}>
            {/* Profile Editing Form */}
            <div className="card" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Edit Profile Information</h3>
              <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem' }}>Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={profileForm.name} 
                      onChange={e => setProfileForm({...profileForm, name: e.target.value})} 
                      style={{ padding: '0.75rem 1rem', width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem' }}>Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="9876543210" 
                      required 
                      pattern="[0-9]{10}"
                      maxLength="10"
                      value={profileForm.phone} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setProfileForm({...profileForm, phone: val});
                      }} 
                      style={{ padding: '0.75rem 1rem', width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem' }}>Email Address</label>
                    <input 
                      type="email" 
                      required 
                      value={profileForm.email} 
                      onChange={e => setProfileForm({...profileForm, email: e.target.value})} 
                      style={{ padding: '0.75rem 1rem', width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem' }}>Pass out Batch</label>
                    <input 
                      type="number" 
                      required 
                      value={profileForm.batch} 
                      onChange={e => setProfileForm({...profileForm, batch: e.target.value})} 
                      style={{ padding: '0.75rem 1rem', width: '100%' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem' }}>Designation / Profession</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Tax Associate / Analyst" 
                      value={profileForm.profession} 
                      onChange={e => setProfileForm({...profileForm, profession: e.target.value})} 
                      style={{ padding: '0.75rem 1rem', width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem' }}>Company / Organization</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Deloitte / EY" 
                      value={profileForm.company} 
                      onChange={e => setProfileForm({...profileForm, company: e.target.value})} 
                      style={{ padding: '0.75rem 1rem', width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem' }}>Specialization / Branch</label>
                  <select 
                    value={profileForm.branch} 
                    onChange={e => setProfileForm({...profileForm, branch: e.target.value})} 
                    style={{ padding: '0.75rem 1rem', width: '100%', border: '1px solid var(--border)', borderRadius: '10px' }}
                  >
                    {commerceBranches.map(br => (
                      <option key={br} value={br}>{br}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem' }}>LinkedIn Profile URL</label>
                  <input 
                    type="url" 
                    placeholder="https://linkedin.com/in/username" 
                    value={profileForm.linkedin} 
                    onChange={e => setProfileForm({...profileForm, linkedin: e.target.value})} 
                    style={{ padding: '0.75rem 1rem', width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem' }}>Short Bio</label>
                  <textarea 
                    rows="3" 
                    value={profileForm.bio} 
                    onChange={e => setProfileForm({...profileForm, bio: e.target.value})} 
                    style={{ padding: '0.75rem 1rem', resize: 'none', width: '100%' }}
                  />
                </div>

                {profileSaved && (
                  <div style={{ color: '#059669', fontSize: '0.875rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} /> Profile updated and logged successfully!
                  </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ background: 'var(--blue-800)', marginTop: '0.5rem', width: '220px' }}>
                  Save Profile Changes
                </button>
              </form>
            </div>

            {/* Profile Audit Log & Stats */}
            <div>
              {/* Profile Meta Cards */}
              <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '1px solid #bfdbfe' }}>
                <h4 style={{ fontWeight: '800', marginBottom: '1rem', color: 'var(--blue-900)' }}>Account Status</h4>
                <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--blue-800)', fontWeight: '600' }}>Last Login:</span>
                    <span style={{ fontWeight: '700' }}>{formatTime(user?.lastLogin)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--blue-800)', fontWeight: '600' }}>Last Updated:</span>
                    <span style={{ fontWeight: '700' }}>{formatTime(user?.lastProfileUpdate)}</span>
                  </div>
                </div>
              </div>

              {/* History / Audit Logs */}
              <div className="card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1.25rem' }}>🔄 Update History</h3>
                
                {user?.profileUpdatesHistory && user.profileUpdatesHistory.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                    {user.profileUpdatesHistory.map((log, idx) => (
                      <div key={idx} style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', alignItems: 'center' }}>
                          <span style={{ fontWeight: '700', color: 'var(--blue-700)' }}>{log.field}</span>
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>{formatTime(log.timestamp)}</span>
                        </div>
                        <div style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>
                          Changed: <span style={{ textDecoration: 'line-through', color: '#991b1b', background: '#fee2e2', padding: '0.05rem 0.25rem', borderRadius: '4px' }}>{log.from}</span>
                          <span style={{ margin: '0 0.25rem' }}>➔</span>
                          <span style={{ color: '#166534', background: '#dcfce7', padding: '0.05rem 0.25rem', borderRadius: '4px', fontWeight: '600' }}>{log.to}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)', background: 'var(--gray-50)', borderRadius: '12px', fontSize: '0.85rem' }}>
                    No updates logged yet. Changes will appear here.
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AlumniDashboard;
