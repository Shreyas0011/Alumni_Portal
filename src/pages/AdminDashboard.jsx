import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Calendar, Shield, ArrowUpRight, Search, CheckCircle, XCircle, Trophy, MessageSquare, Bell, Send, Cake, Clock, BarChart3, Mail, Phone, Sparkles, Megaphone, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

const chartData = [
  { name: 'Jan', users: 400, posts: 20 }, { name: 'Feb', users: 480, posts: 35 },
  { name: 'Mar', users: 600, posts: 45 }, { name: 'Apr', users: 780, posts: 50 },
  { name: 'May', users: 920, posts: 68 }, { name: 'Jun', users: 1100, posts: 82 },
];

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const {
    achievements, addAchievement, removeAchievement,
    posts, approvePost, rejectPost,
    pendingProfiles, approveProfile, rejectProfile,
    alumniList, setAlumniList, broadcasts, addBroadcast,
    events, getTodayBirthdays, notifications,
    automationSettings, setAutomationSettings,
    birthdayLogs, setBirthdayLogs,
    wishedAlumni
  } = useData();

  const [activeTab, setActiveTab] = useState('overview');
  const [achForm, setAchForm] = useState({ title: '', description: '', category: 'General', date: '' });
  const [bcForm, setBcForm] = useState({ title: '', message: '', priority: 'normal', sendVia: ['email'] });
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const formatTime = (d) => d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

  const pendingPosts = posts.filter(p => p.status === 'pending');
  const pendingProfilesList = pendingProfiles.filter(p => p.status === 'pending');
  const todayBirthdays = getTodayBirthdays();

  const handleToggleAutomation = () => {
    setAutomationSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const handleChannelToggle = (channel) => {
    setAutomationSettings(prev => ({ ...prev, [channel]: !prev[channel] }));
  };

  const handleTemplateChange = (field, value) => {
    setAutomationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleResetTemplates = () => {
    setAutomationSettings(prev => ({
      ...prev,
      emailSubject: 'Happy Birthday from Commerce Alumni Connect, {name}! 🎂',
      emailBody: `Dear {name},\n\nOn behalf of the Commerce Alumni Association, we wish you a fantastic and very Happy Birthday! 🎂✨\n\nWe celebrate your achievements as a {profession} at {company} and are proud to have you as part of our commerce legacy.\n\nMay the year ahead bring you closer to your professional goals, with continued growth, prosperity, and joy!\n\nBest regards,\nCommerce Alumni Connect Team`,
      whatsappTemplate: `🎉 *Happy Birthday, {name}!* 🎂\n\nOn behalf of the Commerce Alumni Association, we wish you a fantastic day filled with success, laughter, and great achievements! 🌟\n\n- Transcend Alumni Connect Team`
    }));
  };

  const previewAlumnus = todayBirthdays[0] || alumniList[0] || {
    name: 'Priya Sharma',
    profession: 'IB Vice President',
    company: 'Goldman Sachs',
    batch: '2018'
  };

  const renderPreview = (templateText) => {
    if (!templateText) return '';
    return templateText
      .replace(/{name}/g, previewAlumnus.name)
      .replace(/{profession}/g, previewAlumnus.profession || 'Alumnus')
      .replace(/{company}/g, previewAlumnus.company || 'N/A')
      .replace(/{batch}/g, previewAlumnus.batch || 'N/A');
  };

  const generateAiSummary = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiSummary(`📊 **AI Activity Summary** (${new Date().toLocaleDateString()})\n\n• ${alumniList.length} registered alumni in the network\n• ${pendingProfilesList.length} profile(s) awaiting approval\n• ${pendingPosts.length} post(s) pending moderation\n• ${todayBirthdays.length} birthday(s) today\n• ${events.reduce((sum, e) => sum + (e.registrations?.length || 0), 0)} total event registrations\n• ${broadcasts.length} broadcast(s) sent this cycle\n\n💡 **Recommendation:** ${pendingProfilesList.length > 0 ? 'Review pending profiles to improve alumni engagement.' : 'All profiles are up to date!'} ${pendingPosts.length > 0 ? ' Moderate pending posts to keep the feed active.' : ''}`);
      setAiLoading(false);
    }, 1500);
  };

  const handleAddAchievement = (e) => {
    e.preventDefault();
    if (!achForm.title || !achForm.description) return;
    addAchievement({ ...achForm, postedBy: 'admin' });
    setAchForm({ title: '', description: '', category: 'General', date: '' });
  };

  const handleAddBroadcast = (e) => {
    e.preventDefault();
    if (!bcForm.title || !bcForm.message) return;
    addBroadcast({ ...bcForm, sentVia: bcForm.sendVia });
    setBcForm({ title: '', message: '', priority: 'normal', sendVia: ['email'] });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
    { id: 'profiles', label: `Profiles (${pendingProfilesList.length})`, icon: <Users size={16} /> },
    { id: 'posts', label: `Posts (${pendingPosts.length})`, icon: <MessageSquare size={16} /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy size={16} /> },
    { id: 'broadcasts', label: 'Broadcasts', icon: <Megaphone size={16} /> },
    { id: 'birthdays', label: `Birthdays (${todayBirthdays.length})`, icon: <Cake size={16} /> },
    { id: 'ai', label: 'AI Insights', icon: <Sparkles size={16} /> },
  ];

  return (
    <div style={{ background: 'var(--gray-50)', minHeight: '100vh', padding: '2.5rem 3rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Admin <span style={{ background: 'linear-gradient(135deg, var(--blue-700), var(--blue-500))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Command Center</span></h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage alumni, moderate content, and broadcast updates.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={generateAiSummary} style={{ padding: '0.65rem 1.25rem' }}><Sparkles size={16} /> AI Summary</button>
            <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '0.65rem 1.25rem', color: '#ef4444', borderColor: '#ef4444' }}>Sign Out</button>
          </div>
        </div>

        {/* Tab Nav */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.15rem', borderRadius: '99px', border: '1px solid', borderColor: activeTab === tab.id ? '#1e293b' : 'var(--border)', background: activeTab === tab.id ? '#1e293b' : '#fff', color: activeTab === tab.id ? '#fff' : 'var(--text-muted)', fontWeight: '600', fontSize: '0.82rem', whiteSpace: 'nowrap', cursor: 'pointer' }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
              {[
                { label: 'Total Alumni', value: alumniList.length, icon: <Users size={20} />, change: '+3 this week' },
                { label: 'Pending Profiles', value: pendingProfilesList.length, icon: <FileText size={20} />, change: 'Need review' },
                { label: 'Pending Posts', value: pendingPosts.length, icon: <MessageSquare size={20} />, change: 'Moderate' },
                { label: 'Active Events', value: events.length, icon: <Calendar size={20} />, change: `${events.reduce((s, e) => s + (e.registrations?.length || 0), 0)} registrations` },
                { label: "Today's Birthdays", value: todayBirthdays.length, icon: <Cake size={20} />, change: automationSettings?.enabled ? 'Auto-wished (Active)' : 'Manual Mode' },
              ].map((s, i) => (
                <div key={i} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'var(--blue-50)', color: 'var(--blue-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.25rem' }}>{s.value}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.5rem' }}>{s.change}</div>
                </div>
              ))}
            </div>
            {/* Growth Analytics (Numerical Table) */}
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>Growth Analytics</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.1rem' }}>Numerical breakdown of platform growth metrics (Jan - Jun).</p>
                </div>
                <span className="tag" style={{ background: '#eff6ff', color: 'var(--blue-700)', border: '1px solid #bfdbfe', fontSize: '0.75rem', fontWeight: '700' }}>
                  📊 Year-to-Date
                </span>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-dim)', fontWeight: '700' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Month</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Registered Users</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Monthly Gain</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Growth Rate</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Community Posts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((data, index) => {
                      const prevData = index > 0 ? chartData[index - 1] : null;
                      const gain = prevData ? data.users - prevData.users : 0;
                      const pctChange = prevData ? ((gain / prevData.users) * 100).toFixed(1) : 0;
                      
                      return (
                        <tr key={data.name} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: '700', color: 'var(--text-main)' }}>{data.name}</td>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: '600' }}>{data.users}</td>
                          <td style={{ padding: '0.85rem 1rem', color: index === 0 ? 'var(--text-muted)' : '#059669', fontWeight: '600' }}>
                            {index === 0 ? '—' : `+${gain}`}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            {index === 0 ? (
                              <span style={{ color: 'var(--text-muted)' }}>Baseline</span>
                            ) : (
                              <span style={{ color: '#059669', background: '#ecfdf5', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: '700', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: '0.15rem' }}>
                                <ArrowUpRight size={10} /> {pctChange}%
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: 'var(--text-dim)' }}>{data.posts}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Summary Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Net Growth YTD</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--blue-700)', marginTop: '0.25rem' }}>+700 Users</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>From Jan baseline of 400</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Avg Monthly Rate</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#059669', marginTop: '0.25rem' }}>22.8% MoM</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Consistent monthly uptake</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Post Engagement</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.25rem' }}>310% Total</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Posts grew 4.1x faster than users</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* PROFILE APPROVALS */}
        {activeTab === 'profiles' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem' }}>👤 Profile Approvals</h3>
            {pendingProfilesList.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}><CheckCircle size={32} style={{ marginBottom: '0.75rem', color: '#059669' }} /><br/>All profiles reviewed!</div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {pendingProfilesList.map(p => (
                  <div key={p.id} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'center' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--blue-100)', color: 'var(--blue-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem' }}>{p.name[0]}</div>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '1rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Submitted: {formatTime(p.submittedAt)}</div>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                          <span>🆔 <strong>Roll No:</strong> {p.rollNumber || 'N/A'}</span>
                          <span>📞 <strong>Phone:</strong> {p.phone || 'N/A'}</span>
                          <span>✉️ <strong>Email:</strong> {p.email}</span>
                        </div>
                        {p.college ? (
                          <div style={{ background: 'var(--gray-50)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <div style={{ marginBottom: '0.25rem' }}>🎓 <strong>Education:</strong> {p.degree} in {p.fieldOfStudy} at {p.college} ({p.eduStartYear} - {p.eduEndYear})</div>
                            {p.schoolName && (
                              <div style={{ marginBottom: '0.25rem' }}>🏫 <strong>Schooling (Class XII):</strong> {p.schoolName} ({p.schoolStream}, Class of {p.schoolEndYear})</div>
                            )}
                            {p.school10Name && (
                              <div style={{ marginBottom: '0.25rem' }}>🏫 <strong>Schooling (Class X):</strong> {p.school10Name} (Class of {p.school10EndYear})</div>
                            )}
                            <div style={{ marginBottom: '0.25rem' }}>💼 <strong>Professional:</strong> {p.profession} at {p.company}</div>
                            {p.skills && <div style={{ marginBottom: '0.25rem' }}>⚡ <strong>Skills:</strong> {p.skills}</div>}
                            {p.linkedin && (
                              <div>🔗 <strong>LinkedIn:</strong> <a href={p.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue-600)', textDecoration: 'underline' }}>{p.linkedin}</a></div>
                            )}
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                            <span>🎓 <strong>Pass out Batch:</strong> {p.batch || '—'}</span>
                            <span>📚 <strong>Specialization:</strong> {p.branch || p.course || 'Commerce'}</span>
                            {p.profession && <span>💼 <strong>Role:</strong> {p.profession} at {p.company || '—'}</span>}
                          </div>
                        )}
                      </div>
                      {p.bio && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic' }}>"{p.bio}"</p>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button className="btn btn-sm" style={{ background: '#059669', color: '#fff' }} onClick={() => approveProfile(p.id)}><CheckCircle size={14} /> Approve</button>
                      <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#dc2626' }} onClick={() => rejectProfile(p.id)}><XCircle size={14} /> Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* POST MODERATION */}
        {activeTab === 'posts' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem' }}>📝 Community updates & Achievements Moderation</h3>
            {pendingPosts.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}><CheckCircle size={32} style={{ marginBottom: '0.75rem', color: '#059669' }} /><br/>All submissions reviewed!</div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {pendingPosts.map(p => (
                  <div 
                    key={p.id} 
                    className="card"
                    style={{ 
                      borderLeft: p.isAchievement ? '4px solid #f59e0b' : '1px solid var(--border)',
                      background: p.isAchievement ? 'linear-gradient(135deg, #ffffff 0%, #fffbeb 100%)' : '#fff'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--blue-100)', color: 'var(--blue-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>{p.authorName?.[0]}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{p.authorName} <span style={{ fontWeight: '400', fontSize: '0.8rem', color: 'var(--text-dim)' }}>Batch {p.authorBatch}</span></div>
                              {p.isAchievement && (
                                <span className="tag" style={{ background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <Trophy size={12} /> {p.category}
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Submitted: {formatTime(p.createdAt)}</div>
                          </div>
                        </div>
                        {p.title && <h4 style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--blue-900)', marginBottom: '0.5rem' }}>🏆 {p.title}</h4>}
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: 'var(--text-main)' }}>{p.content}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1.5rem' }}>
                        <button className="btn btn-sm" style={{ background: '#059669', color: '#fff', padding: '0.5rem' }} onClick={() => approvePost(p.id)} title="Approve"><CheckCircle size={16} /></button>
                        <button className="btn btn-sm" style={{ background: '#fee2e2', color: '#dc2626', padding: '0.5rem' }} onClick={() => rejectPost(p.id)} title="Reject"><XCircle size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ACHIEVEMENTS MANAGEMENT */}
        {activeTab === 'achievements' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem' }}>🏆 Manage Achievements</h3>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}><Plus size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Add Achievement</h4>
              <form onSubmit={handleAddAchievement}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <input placeholder="Achievement title" value={achForm.title} onChange={e => setAchForm(p => ({ ...p, title: e.target.value }))} required style={{ padding: '0.75rem' }} />
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <select value={achForm.category} onChange={e => setAchForm(p => ({ ...p, category: e.target.value }))} style={{ padding: '0.75rem', flex: 1 }}>
                      <option>General</option><option>Accreditation</option><option>Competition</option><option>Infrastructure</option><option>Research</option><option>Sports</option>
                    </select>
                    <input type="date" value={achForm.date} onChange={e => setAchForm(p => ({ ...p, date: e.target.value }))} style={{ padding: '0.75rem' }} />
                  </div>
                </div>
                <textarea placeholder="Describe the achievement..." value={achForm.description} onChange={e => setAchForm(p => ({ ...p, description: e.target.value }))} required rows="3" style={{ padding: '0.75rem', marginBottom: '1rem', resize: 'none' }} />
                <button type="submit" className="btn btn-primary"><Plus size={16} /> Publish Achievement</button>
              </form>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {achievements.map(ach => (
                <div key={ach.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="tag" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{ach.category}</span>
                    <h4 style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{ach.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ach.description}</p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{formatDate(ach.date)}</span>
                  </div>
                  <button className="btn btn-sm" style={{ color: '#dc2626', background: '#fee2e2' }} onClick={() => removeAchievement(ach.id)}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* BROADCASTS */}
        {activeTab === 'broadcasts' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem' }}>📢 Broadcast Updates</h3>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem' }}>New Broadcast</h4>
              <form onSubmit={handleAddBroadcast}>
                <input placeholder="Subject / Title" value={bcForm.title} onChange={e => setBcForm(p => ({ ...p, title: e.target.value }))} required style={{ padding: '0.75rem', marginBottom: '1rem' }} />
                <textarea placeholder="Write your message to all alumni..." value={bcForm.message} onChange={e => setBcForm(p => ({ ...p, message: e.target.value }))} required rows="4" style={{ padding: '0.75rem', marginBottom: '1rem', resize: 'none' }} />
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Send via:</span>
                  {['email', 'whatsapp'].map(ch => (
                    <label key={ch} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={bcForm.sendVia.includes(ch)} onChange={() => setBcForm(p => ({ ...p, sendVia: p.sendVia.includes(ch) ? p.sendVia.filter(c => c !== ch) : [...p.sendVia, ch] }))} />
                      {ch === 'email' ? <><Mail size={14} /> Email</> : <><Phone size={14} /> WhatsApp</>}
                    </label>
                  ))}
                  <select value={bcForm.priority} onChange={e => setBcForm(p => ({ ...p, priority: e.target.value }))} style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary"><Send size={16} /> Send Broadcast to {alumniList.length} Alumni</button>
              </form>
            </div>
            <h4 style={{ marginBottom: '1rem', fontWeight: '700' }}>Sent Broadcasts</h4>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {broadcasts.map(bc => (
                <div key={bc.id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{bc.title}</div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{bc.message}</p>
                    </div>
                    <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{formatDate(bc.createdAt)}</div>
                      <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                        {bc.sentVia?.map(v => <span key={v} className="tag" style={{ fontSize: '0.65rem' }}>{v}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* AI INSIGHTS */}
        {activeTab === 'ai' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem' }}>🤖 AI-Powered Insights</h3>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <Sparkles size={24} style={{ color: 'var(--blue-700)' }} />
                <div><h4>Activity Analysis</h4><p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Get an AI-generated summary of platform activity and recommendations.</p></div>
              </div>
              <button className="btn btn-primary" onClick={generateAiSummary} disabled={aiLoading}>
                {aiLoading ? 'Analyzing...' : <><Sparkles size={16} /> Generate AI Summary</>}
              </button>
            </div>
            {aiSummary && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)', borderLeft: '4px solid var(--blue-700)' }}>
                <pre style={{ fontFamily: 'var(--font)', whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.8', color: 'var(--text-main)' }}>{aiSummary}</pre>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* BIRTHDAYS TAB */}
        {activeTab === 'birthdays' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.25rem' }}>🎂 Birthday Engagement Hub</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage automated birthday wishes, edit messaging templates, and view history.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  onClick={() => {
                    const todayStr = new Date().toISOString().split('T')[0];
                    setAlumniList(prev => prev.map(a => {
                      if (a.id === 'al1' || a.id === 'al3') {
                        return { ...a, dob: todayStr };
                      }
                      return a;
                    }));
                  }}
                  style={{ 
                    background: 'linear-gradient(135deg, var(--blue-700), var(--blue-600))', 
                    color: '#fff',
                    border: 'none', 
                    borderRadius: '12px', 
                    padding: '0.5rem 1.1rem', 
                    fontSize: '0.8rem', 
                    fontWeight: '700', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)'
                  }}
                >
                  ⚙️ Force Test Birthdays
                </button>
                <div 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    background: '#fff', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border)' 
                  }}
                >
                  <div style={{ 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    background: automationSettings?.enabled ? '#10b981' : '#6b7280',
                    boxShadow: automationSettings?.enabled ? '0 0 8px #10b981' : 'none'
                  }}></div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    Automation: {automationSettings?.enabled ? 'ACTIVE' : 'PAUSED'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
              {/* Left Column: Today's Birthdays & Logs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Today's Birthdays Card */}
                <div className="card" style={{ padding: '2rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    🎉 Today's Celebrations ({todayBirthdays.length})
                  </h4>
                  
                  {todayBirthdays.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', background: 'var(--gray-50)', borderRadius: '12px' }}>
                      <Cake size={32} style={{ marginBottom: '0.5rem', color: 'var(--text-dim)' }} />
                      <p style={{ fontSize: '0.85rem' }}>No birthdays today. Rest day for the automation bot! 🤖</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {todayBirthdays.map(b => {
                        const dateKey = new Date().toISOString().split('T')[0];
                        const isAutoWished = wishedAlumni?.[dateKey]?.includes(b.id);
                        return (
                          <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: isAutoWished ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : '#f8fafc', border: '1px solid', borderColor: isAutoWished ? '#bbf7d0' : 'var(--border)', borderRadius: '12px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: isAutoWished ? '#22c55e' : 'var(--blue-100)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.85rem' }}>
                                  {isAutoWished ? '✓' : b.name[0]}
                                </div>
                                <div>
                                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>{b.name}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Batch of {b.batch} · {b.profession} at {b.company}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {isAutoWished ? (
                                <span style={{ background: '#dcfce7', color: '#15803d', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <CheckCircle size={12} /> Auto-Wished
                                </span>
                              ) : (
                                <span style={{ background: '#fef3c7', color: '#d97706', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                  <Clock size={12} /> Pending Auto-Send
                                </span>
                              )}
                              
                              <button 
                                className="btn btn-sm" 
                                style={{ background: '#fff', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.35rem 0.6rem', height: 'auto' }}
                                title="Send Email Manually"
                                onClick={() => {
                                  const subject = encodeURIComponent(`Happy Birthday, ${b.name}! 🎂`);
                                  const body = encodeURIComponent(
                                    `Dear ${b.name},\n\n` +
                                    `On behalf of the Commerce Alumni Association, we wish you a fantastic and very Happy Birthday! 🎂✨\n\n` +
                                    `Best regards,\n` +
                                    `Commerce Alumni Connect Team`
                                  );
                                  window.open(`mailto:${b.email}?subject=${subject}&body=${body}`, '_blank');
                                }}
                              >
                                <Mail size={12} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Automation Log Timeline */}
                <div className="card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      📋 Automation Wish History
                    </h4>
                    {birthdayLogs?.length > 0 && (
                      <button 
                        onClick={() => {
                          if (window.confirm("Are you sure you want to clear the automation history logs?")) {
                            setBirthdayLogs([]);
                            localStorage.removeItem('ac_birthday_logs');
                          }
                        }}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Trash2 size={12} /> Clear Logs
                      </button>
                    )}
                  </div>

                  {birthdayLogs?.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', background: 'var(--gray-50)', borderRadius: '12px', fontSize: '0.85rem' }}>
                      No automated wishes sent yet. History logs will appear here.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '380px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                      {birthdayLogs?.map((log) => (
                        <div key={log.id} style={{ padding: '1rem', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '0.8rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: '700', color: 'var(--blue-900)' }}>🎉 {log.alumniName}</span>
                            <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>{new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} ({new Date(log.timestamp).toLocaleDateString('en-IN')})</span>
                          </div>
                          <div style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                            Automatically wished via: 
                            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                              {log.channels?.map(ch => (
                                <span key={ch} className="tag" style={{ background: ch === 'Email' ? '#eff6ff' : '#ecfdf5', color: ch === 'Email' ? 'var(--blue-700)' : '#059669', border: ch === 'Email' ? '1px solid #bfdbfe' : '1px solid #a7f3d0', fontSize: '0.65rem' }}>{ch}</span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Expander detail */}
                          <details style={{ marginTop: '0.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                            <summary style={{ cursor: 'pointer', fontSize: '0.7rem', color: 'var(--blue-600)', fontWeight: '700', listStyle: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              🔍 View Sent Message Preview
                            </summary>
                            <div style={{ marginTop: '0.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem', fontSize: '0.75rem', color: 'var(--text-main)' }}>
                              <strong>Email Subject:</strong> {log.emailSubject}<br/><br/>
                              <strong>Email Content:</strong>
                              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: '0.25rem 0 0.5rem 0', color: 'var(--text-muted)' }}>{log.emailBody}</pre>
                              <strong>WhatsApp:</strong>
                              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: '0.25rem 0 0 0', color: 'var(--text-muted)', background: '#f0fdf4', padding: '0.5rem', borderRadius: '6px' }}>{log.whatsappText}</pre>
                            </div>
                          </details>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Settings & Templates */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Automation settings toggle card */}
                <div className="card" style={{ padding: '2rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ⚙️ Automation Controls
                  </h4>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--gray-50)', borderRadius: '12px', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>Enable Scheduler Bot</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sends greetings daily at 9:00 AM</div>
                    </div>
                    <button 
                      onClick={handleToggleAutomation}
                      style={{ 
                        border: 'none', 
                        background: 'none', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ 
                        width: '48px', 
                        height: '26px', 
                        borderRadius: '99px', 
                        background: automationSettings?.enabled ? 'var(--blue-700)' : '#d1d5db',
                        position: 'relative',
                        transition: 'background 0.3s ease',
                        padding: '3px'
                      }}>
                        <div style={{ 
                          width: '20px', 
                          height: '20px', 
                          borderRadius: '50%', 
                          background: '#fff',
                          position: 'absolute',
                          left: automationSettings?.enabled ? '25px' : '3px',
                          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }} />
                      </div>
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-main)' }}>Delivery Channels</div>
                    
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', cursor: 'pointer', padding: '0.5rem 0.25rem' }}>
                      <input 
                        type="checkbox" 
                        checked={automationSettings?.sendEmail || false} 
                        onChange={() => handleChannelToggle('sendEmail')}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Mail size={14} style={{ color: 'var(--blue-600)' }} />
                        <span>Email Notification Channel</span>
                      </div>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', cursor: 'pointer', padding: '0.5rem 0.25rem' }}>
                      <input 
                        type="checkbox" 
                        checked={automationSettings?.sendWhatsapp || false} 
                        onChange={() => handleChannelToggle('sendWhatsapp')}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Phone size={14} style={{ color: '#22c55e' }} />
                        <span>WhatsApp API Integration</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Templates editor card */}
                <div className="card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>
                      📝 Greeting Templates
                    </h4>
                    <button 
                      onClick={handleResetTemplates}
                      style={{ background: 'none', border: 'none', color: 'var(--blue-600)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      Reset to Default
                    </button>
                  </div>

                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '0.75rem', marginBottom: '1.25rem', fontSize: '0.75rem', color: 'var(--blue-800)', lineHeight: '1.4' }}>
                    💡 Use placeholders to personalize: <strong>{`{name}`}</strong>, <strong>{`{profession}`}</strong>, <strong>{`{company}`}</strong>, <strong>{`{batch}`}</strong>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Email template */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>Email Subject</label>
                      <input 
                        type="text" 
                        value={automationSettings?.emailSubject || ''} 
                        onChange={e => handleTemplateChange('emailSubject', e.target.value)}
                        style={{ padding: '0.65rem 0.75rem', width: '100%', border: '1px solid var(--border)', borderRadius: '10px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>Email Body</label>
                      <textarea 
                        rows="4" 
                        value={automationSettings?.emailBody || ''} 
                        onChange={e => handleTemplateChange('emailBody', e.target.value)}
                        style={{ padding: '0.65rem 0.75rem', width: '100%', resize: 'none', fontSize: '0.8rem', border: '1px solid var(--border)', borderRadius: '10px' }}
                      />
                    </div>

                    {/* WhatsApp template */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>WhatsApp Template</label>
                      <textarea 
                        rows="3" 
                        value={automationSettings?.whatsappTemplate || ''} 
                        onChange={e => handleTemplateChange('whatsappTemplate', e.target.value)}
                        style={{ padding: '0.65rem 0.75rem', width: '100%', resize: 'none', fontSize: '0.8rem', border: '1px solid var(--border)', borderRadius: '10px' }}
                      />
                    </div>

                    {/* Live Preview Expander */}
                    <div style={{ background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                        <Sparkles size={12} style={{ color: '#d97706' }} /> Live Automation Preview
                      </div>
                      
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Previewing for: <strong>{previewAlumnus.name}</strong> (Batch of {previewAlumnus.batch})
                      </div>
                      
                      <div style={{ marginTop: '0.75rem', borderTop: '1px dotted var(--border)', paddingTop: '0.75rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>EMAIL SUBJ:</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: '600', marginBottom: '0.5rem' }}>{renderPreview(automationSettings?.emailSubject)}</div>
                        
                        <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>EMAIL BODY:</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap', background: '#fff', border: '1px solid var(--border)', padding: '0.5rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
                          {renderPreview(automationSettings?.emailBody)}
                        </div>

                        <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>WHATSAPP MESSAGE:</div>
                        <div style={{ fontSize: '0.75rem', color: '#15803d', whiteSpace: 'pre-wrap', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '0.5rem', borderRadius: '6px' }}>
                          {renderPreview(automationSettings?.whatsappTemplate)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
