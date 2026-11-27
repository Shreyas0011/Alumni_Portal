import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check, MessageSquare, X, Star, Briefcase, MapPin, GraduationCap, Loader2, CalendarPlus, CalendarCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import { useData } from '../context/DataContext';
import { useSocial } from '../context/SocialContext';
import { ChatDrawer } from '../components/Chat';
import { VerifiedBadge } from '../components/Badges';

// Mentorship areas with matching alumni expertise tags
const MENTORSHIP_TYPES = [
  { value: '', label: 'Select a Mentorship Area...' },
  { value: 'ca', label: 'CA / ICAI Exam Preparation' },
  { value: 'cfa', label: 'CFA / Investment Analysis' },
  { value: 'investment_banking', label: 'Investment Banking Career' },
  { value: 'audit', label: 'Audit & Assurance' },
  { value: 'tax', label: 'Taxation & GST' },
  { value: 'mba', label: 'MBA / Higher Studies Abroad' },
  { value: 'startup', label: 'Entrepreneurship & Startups' },
  { value: 'resume', label: 'Resume & Interview Prep' },
  { value: 'corporate_finance', label: 'Corporate Finance & Treasury' },
];

// Mentorship areas each alumnus can help with, read from their real profile
const AREA_RULES = [
  ['ca', /\bCA\b|chartered|ICAI|audit|IFRS|accounting/i],
  ['cfa', /CFA|equity|valuation|portfolio|investment/i],
  ['investment_banking', /M&A|investment bank|\bIB\b|buyout|private equity|valuation/i],
  ['audit', /audit|assurance|compliance/i],
  ['tax', /tax|GST/i],
  ['mba', /MBA|strategy|consult/i],
  ['startup', /founder|startup|entrepreneur|CEO/i],
  ['corporate_finance', /finance|treasury|CFO|budget|cash|FX|risk/i],
];

const toMentor = (a) => {
  const text = [a.skills, a.fieldOfStudy, a.profession, a.bio, a.degree].filter(Boolean).join(' ');
  const tags = AREA_RULES.filter(([, re]) => re.test(text)).map(([k]) => k);
  return {
    id: a.id,
    name: a.name,
    role: a.profession || 'Alumnus',
    company: a.company || '—',
    location: a.location || a.city || 'India',
    batch: a.batch || a.eduEndYear || '',
    tags: [...tags, 'resume'], // every alumnus can help with resumes & interviews
    expertise: String(a.skills || a.fieldOfStudy || '').split(',').map((x) => x.trim()).filter(Boolean).slice(0, 3),
    bio: a.bio || `${a.profession || 'Alumnus'} at ${a.company || 'their firm'}. Happy to help students with career questions.`,
  };
};

const STATUS_CHIP = {
  requested: ['#fffbeb', '#b45309', 'Awaiting mentor'],
  confirmed: ['#ecfdf5', '#047857', 'Confirmed'],
  completed: ['#eff6ff', '#1d4ed8', 'Completed'],
  declined: ['#fef2f2', '#b91c1c', 'Declined'],
  cancelled: ['#f1f5f9', '#64748b', 'Cancelled'],
};
const TIMES = Array.from({ length: 23 }, (_, i) => `${String(9 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`);
const fmtSlot = (d) => new Date(d).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const tomorrow = () => { const d = new Date(Date.now() + 86400000); return d.toISOString().slice(0, 10); };

const Mentorship = () => {
  const { user } = useAuth();
  const { alumniList } = useData();
  const { personById, sessions, sessionStats, bookSession, updateSession } = useSocial();
  const [mentorshipType, setMentorshipType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatWith, setChatWith] = useState(null);
  const [booking, setBooking] = useState(null);
  const [form, setForm] = useState({ date: tomorrow(), time: '18:00', area: '', topic: '', mode: 'Video call', note: '' });
  const [bookError, setBookError] = useState('');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const mentors = useMemo(() => alumniList.map(toMentor), [alumniList]);
  const held = (id) => sessionStats[id] || 0;

  // One list: narrowed by area and search; the most-requested mentors first
  const filteredAll = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return mentors
      .filter(a => !mentorshipType || a.tags.includes(mentorshipType))
      .filter(a =>
        !q || a.name.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.expertise.some(e => e.toLowerCase().includes(q))
      )
      .sort((a, b) => (a.id === user?.id) - (b.id === user?.id) || (mentorshipType ? held(b.id) - held(a.id) : 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, mentorshipType, mentors, sessionStats, user?.id]);
  const bestMatchId = mentorshipType ? filteredAll.find(a => a.id !== user?.id)?.id : null;

  const openChat = (alumni) => setChatWith(personById(alumni.id) || { uid: alumni.id, name: alumni.name, subtitle: `${alumni.role} · ${alumni.company}`, verified: true });
  const openBooking = (alumni) => {
    setBooking(alumni);
    setBookError('');
    setForm(f => ({ ...f, area: mentorshipType && alumni.tags.includes(mentorshipType) ? mentorshipType : alumni.tags[0] || '' }));
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setBusy(true);
    setBookError('');
    try {
      const slot = new Date(`${form.date}T${form.time}:00`).toISOString();
      const areaLabel = MENTORSHIP_TYPES.find(t => t.value === form.area)?.label || '';
      await bookSession({ mentorId: booking.id, slot, area: areaLabel, topic: form.topic.trim() || areaLabel, mode: form.mode, note: form.note.trim() });
      flash(`Session requested with ${booking.name}`);
      setBooking(null);
      setForm(f => ({ ...f, topic: '', note: '' }));
    } catch (err) {
      setBookError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const act = async (s, status, msg) => {
    try { await updateSession(s.id, status); flash(msg); } catch (err) { flash(err.message); }
  };

  const [now] = useState(() => Date.now());
  const mySessions = sessions.filter(s => ['requested', 'confirmed'].includes(s.status) || new Date(s.slot).getTime() > now - 7 * 86400000);

  const MentorCard = ({ alumni, highlight }) => (
    <div
      className="mentor-card"
      style={{
        background: highlight ? 'linear-gradient(135deg, #fffbeb 0%, #fff 100%)' : '#fff',
        border: highlight ? '2px solid #f59e0b' : '1px solid var(--border)',
        borderRadius: '20px', padding: '1.75rem', boxShadow: highlight ? '0 8px 24px rgba(245,158,11,0.12)' : '0 2px 12px rgba(0,0,0,0.05)',
        display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative'
      }}
    >
      {highlight && (
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#f59e0b', color: '#fff', fontSize: '0.68rem', fontWeight: '800', padding: '0.25rem 0.65rem', borderRadius: '99px', letterSpacing: '0.05em' }}>
          Best match
        </div>
      )}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ width: 54, height: 54, borderRadius: '14px', background: 'linear-gradient(135deg, var(--blue-700), var(--blue-500))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: '900', flexShrink: 0 }}>
          {alumni.name[0]}
        </div>
        <div>
          <h3 style={{ fontWeight: '800', fontSize: '1.05rem', marginBottom: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>{alumni.name} <VerifiedBadge size={14} /></h3>
          <p style={{ color: 'var(--blue-700)', fontWeight: '700', fontSize: '0.8rem' }}>{alumni.role}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <Briefcase size={14} /> {alumni.company}
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <MapPin size={14} /> {alumni.location}
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <GraduationCap size={14} /> Class of {alumni.batch}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {alumni.expertise.map(e => (
          <span key={e} style={{ background: 'var(--blue-50)', color: 'var(--blue-700)', border: '1px solid var(--blue-100)', borderRadius: '99px', padding: '0.2rem 0.65rem', fontSize: '0.7rem', fontWeight: '700' }}>{e}</span>
        ))}
      </div>

      <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{alumni.bio}</p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: held(alumni.id) ? '#b45309' : 'var(--text-dim)', fontWeight: '700' }}>
          <Star size={14} fill={held(alumni.id) ? '#f59e0b' : 'none'} /> {held(alumni.id) ? `${held(alumni.id)} session${held(alumni.id) > 1 ? 's' : ''} held` : 'New mentor'}
        </div>
        {alumni.id === user?.id ? (
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)' }}>This is you</span>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-sm btn-outline" onClick={() => openChat(alumni)} aria-label={`Message ${alumni.name}`}>
              <MessageSquare size={14} /> Message
            </button>
            <button className="btn btn-sm btn-primary" onClick={() => openBooking(alumni)}>
              <CalendarPlus size={14} /> Request
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="page">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }}
            style={{ position: 'fixed', top: '1.5rem', left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '1px solid var(--border)', borderRadius: '99px', padding: '0.75rem 1.75rem', fontWeight: '700', fontSize: '0.85rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
            <Check size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <PageHeader
        title="Mentorship"
        subtitle="Every mentor is a verified alumnus. Message them, or request a 30-minute session on the topic you need help with."
      />
      <div>
        {/* My sessions (as mentee or mentor) */}
        {mySessions.length > 0 && (
          <div className="card" style={{ padding: 'clamp(1.1rem, 3vw, 1.5rem)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CalendarCheck size={18} style={{ color: 'var(--blue-700)' }} /> My sessions</h2>
            <div style={{ display: 'grid', gap: '0.65rem' }}>
              {mySessions.map(s => {
                const asMentor = s.mentorId === user?.id;
                const chip = STATUS_CHIP[s.status];
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexWrap: 'wrap', padding: '0.8rem 1rem', background: 'var(--gray-50)', borderRadius: 12 }}>
                    <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.topic || s.area} <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>{asMentor ? `· mentee ${s.menteeName}` : `· with ${s.mentorName}`}</span></div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{fmtSlot(s.slot)} · {s.mode}{s.note ? ` · “${s.note}”` : ''}</div>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: 99, background: chip[0], color: chip[1] }}>{chip[2]}</span>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {asMentor && s.status === 'requested' && <>
                        <button className="btn btn-sm btn-primary" onClick={() => act(s, 'confirmed', 'Session confirmed')}>Confirm</button>
                        <button className="btn btn-sm btn-outline" onClick={() => act(s, 'declined', 'Session declined')}>Decline</button>
                      </>}
                      {asMentor && s.status === 'confirmed' && new Date(s.slot).getTime() < now &&
                        <button className="btn btn-sm btn-primary" onClick={() => act(s, 'completed', 'Marked as completed')}>Mark completed</button>}
                      {['requested', 'confirmed'].includes(s.status) && new Date(s.slot).getTime() > now &&
                        <button className="btn btn-sm btn-ghost" onClick={() => act(s, 'cancelled', 'Session cancelled')}>Cancel</button>}
                      <button className="btn btn-sm btn-ghost" onClick={() => setChatWith(personById(asMentor ? s.menteeId : s.mentorId) || { uid: asMentor ? s.menteeId : s.mentorId, name: asMentor ? s.menteeName : s.mentorName })} aria-label="Message"><MessageSquare size={14} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Find a mentor: area + search over one list */}
        <h2 className="block-title" style={{ marginTop: mySessions.length ? '2.25rem' : 0 }}>Find a mentor</h2>
        <div className="toolbar">
          <select value={mentorshipType} onChange={e => setMentorshipType(e.target.value)} aria-label="Mentorship area" style={{ minWidth: 260 }}>
            <option value="">All mentorship areas</option>
            {MENTORSHIP_TYPES.filter(t => t.value).map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <div className="grow">
            <Search size={16} aria-hidden="true" />
            <input type="text" placeholder="Search by name, company or expertise" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} aria-label="Search mentors" />
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{filteredAll.length} mentor{filteredAll.length === 1 ? '' : 's'}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '1.5rem' }}>
          {filteredAll.map(alumni => (
            <MentorCard key={alumni.id} alumni={alumni} highlight={alumni.id === bestMatchId} />
          ))}
          {filteredAll.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              No mentors match. Try another area or clear the search.
            </div>
          )}
        </div>
      </div>

      <ChatDrawer person={chatWith} onClose={() => setChatWith(null)} />

      {/* Request a session */}
      <AnimatePresence>
        {booking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setBooking(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.form initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} onClick={e => e.stopPropagation()} onSubmit={submitBooking}
              className="card" role="dialog" aria-modal="true" aria-label={`Request a session with ${booking.name}`} style={{ width: 'min(500px, 100%)', maxHeight: '90vh', overflowY: 'auto', padding: '1.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Request a 30-minute session</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>with {booking.name} · {booking.role}, {booking.company}</p>
                </div>
                <button type="button" className="btn-icon btn-ghost" onClick={() => setBooking(null)} aria-label="Close"><X size={18} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.8rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Date
                  <input type="date" required min={tomorrow()} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={{ marginTop: 4 }} />
                </label>
                <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Time
                  <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={{ marginTop: 4 }}>
                    {TIMES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </label>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, gridColumn: '1 / -1' }}>Area
                  <select value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} style={{ marginTop: 4 }}>
                    {MENTORSHIP_TYPES.filter(t => t.value && booking.tags.includes(t.value)).map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </label>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, gridColumn: '1 / -1' }}>What do you want to discuss?
                  <input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="e.g. Preparing for IB interviews" maxLength={200} style={{ marginTop: 4 }} />
                </label>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, gridColumn: '1 / -1' }}>How
                  <select value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })} style={{ marginTop: 4 }}>
                    {['Video call', 'Phone call', 'On campus'].map(m => <option key={m}>{m}</option>)}
                  </select>
                </label>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, gridColumn: '1 / -1' }}>Note for {booking.name.split(' ')[0]} (optional)
                  <textarea rows={3} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} maxLength={1000} style={{ marginTop: 4, resize: 'vertical' }} />
                </label>
              </div>
              {bookError && <div role="alert" style={{ color: '#b91c1c', fontSize: '0.82rem', marginTop: '0.75rem' }}>{bookError}</div>}
              <button type="submit" className="btn btn-primary" disabled={busy} style={{ width: '100%', marginTop: '1.1rem' }}>
                {busy ? <Loader2 size={16} className="animate-spin" /> : <CalendarPlus size={16} />} Request Session
              </button>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '0.6rem' }}>{booking.name.split(' ')[0]} gets a notification and confirms the time.</p>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Mentorship;
