import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Upload, Download, Star, Check, X, Plus, Trash2, ThumbsUp, Search,
  HeartHandshake, Calendar, MapPin, Users, Loader2, MessagesSquare,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useSocial } from '../context/SocialContext';
import { api } from '../lib/api';
import { isAdminRole, ROLES } from '../lib/roles';
import { DOMAINS } from '../data/showcase';
import { VerifiedBadge, ReportButton } from '../components/Badges';
import PageHeader from '../components/PageHeader';

const TABS = [
  { id: 'resume', label: 'Resume Reviews', icon: FileText },
  { id: 'interviews', label: 'Interview Experiences', icon: MessagesSquare },
  { id: 'volunteer', label: 'Volunteering', icon: HeartHandshake },
];
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
const field = { fontSize: '0.8rem', fontWeight: 700, display: 'block' };
const input = { marginTop: 4 };
const chip = (bg, fg) => ({ fontSize: '0.7rem', fontWeight: 800, padding: '0.22rem 0.6rem', borderRadius: 99, background: bg, color: fg, whiteSpace: 'nowrap' });
const Empty = ({ children }) => <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>{children}</div>;
const SectionTitle = ({ children, right }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', margin: '1.75rem 0 0.9rem' }}>
    <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{children}</h2>{right}
  </div>
);

/* ── Resume reviews ─────────────────────────────────────────────────── */
const REVIEW_STATUS = { open: chip('#fffbeb', '#b45309'), in_review: chip('#f5f3ff', '#6d28d9'), reviewed: chip('#ecfdf5', '#047857') };
const REVIEW_LABEL = { open: 'Waiting for a reviewer', in_review: 'Being reviewed', reviewed: 'Reviewed' };
const MAX_BYTES = 2 * 1024 * 1024;

const downloadCv = async (r) => {
  const f = await api.get(`/api/social/reviews/${r.id}/file`);
  const a = document.createElement('a');
  a.href = f.fileData;
  a.download = f.fileName || 'resume';
  a.click();
};

const Stars = ({ value }) => (
  <span aria-label={`${value} out of 5`} style={{ display: 'inline-flex', gap: 1 }}>
    {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={13} fill={n <= value ? '#f59e0b' : 'none'} color="#f59e0b" />)}
  </span>
);

const ResumeReviews = ({ flash }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ field: DOMAINS[0], note: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [drafts, setDrafts] = useState({});
  const canRequest = user.role === 'student';
  const canReview = ['alumni', 'professor'].includes(user.role);

  const load = useCallback(() => api.get('/api/social/reviews').then(setReviews).catch((e) => setError(e.message)).finally(() => setLoading(false)), []);
  useEffect(() => { load(); }, [load]);

  const mine = reviews.filter((r) => r.studentId === user.id);
  const open = reviews.filter((r) => r.status === 'open' && r.studentId !== user.id);
  const reviewing = reviews.filter((r) => r.reviewerId === user.id);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!file) return setError('Choose your resume first.');
    if (file.size > MAX_BYTES) return setError('Files must be under 2 MB.');
    setBusy(true);
    try {
      const fileData = await new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(file); });
      const r = await api.post('/api/social/reviews', { ...form, fileName: file.name, fileType: file.type, fileData });
      setReviews((prev) => [r, ...prev]);
      setFile(null);
      setForm({ field: DOMAINS[0], note: '' });
      e.target.reset();
      flash('Resume sent. Alumni in your field will pick it up.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const act = async (r, body, msg) => {
    try {
      const out = await api.patch(`/api/social/reviews/${r.id}`, body);
      if (body.action === 'delete') setReviews((prev) => prev.filter((x) => x.id !== r.id));
      else setReviews((prev) => prev.map((x) => (x.id === r.id ? out : x)));
      flash(msg);
    } catch (err) { flash(err.message); }
  };

  if (loading) return <Empty><Loader2 className="animate-spin" size={18} /></Empty>;
  return (
    <div>
      {error && <div role="alert" className="card" style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#b91c1c', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

      {canRequest && (
        <>
          <form onSubmit={submit} className="card" style={{ padding: '1.4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: '0.9rem', alignItems: 'end' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Get your resume reviewed by an alumnus</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Upload a PDF or Word file (max 2 MB). An alumnus or faculty member in your field reviews it and sends written feedback.</p>
            </div>
            <label style={field}>Resume file
              <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ ...input, padding: '0.5rem' }} />
            </label>
            <label style={field}>Field
              <select value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} style={input}>{DOMAINS.map((d) => <option key={d}>{d}</option>)}</select>
            </label>
            <label style={{ ...field, gridColumn: '1 / -1' }}>What should the reviewer focus on? (optional)
              <input value={form.note} maxLength={1000} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. Applying for Big 4 audit roles — is my internship section strong enough?" style={input} />
            </label>
            <button className="btn btn-primary" disabled={busy} style={{ justifySelf: 'start' }}>{busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} Send for review</button>
          </form>

          <SectionTitle>My review requests</SectionTitle>
          {mine.length === 0 ? <Empty>You haven't asked for a review yet.</Empty> : (
            <div style={{ display: 'grid', gap: '0.8rem' }}>
              {mine.map((r) => (
                <div key={r.id} className="card" style={{ padding: '1.1rem 1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <FileText size={18} style={{ color: 'var(--blue-700)' }} />
                    <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                      <div style={{ fontWeight: 700 }}>{r.fileName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.field} · sent {fmtDate(r.createdAt)}{r.reviewerName ? ` · reviewer ${r.reviewerName}` : ''}</div>
                    </div>
                    <span style={REVIEW_STATUS[r.status]}>{REVIEW_LABEL[r.status]}</span>
                    <button className="btn btn-sm btn-ghost" onClick={() => act(r, { action: 'delete' }, 'Request deleted')} aria-label="Delete request"><Trash2 size={14} /></button>
                  </div>
                  {r.status === 'reviewed' && (
                    <div style={{ marginTop: '0.9rem', padding: '0.9rem 1rem', background: '#f0fdf4', borderRadius: 12, fontSize: '0.88rem', lineHeight: 1.55 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.35rem' }}>Feedback from {r.reviewerName} <Stars value={r.rating} /></div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{r.feedback}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {canReview && (
        <>
          <SectionTitle>Resumes waiting for a reviewer</SectionTitle>
          {open.length === 0 ? <Empty>No open requests right now. Thanks for helping!</Empty> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: '0.9rem' }}>
              {open.map((r) => (
                <div key={r.id} className="card" style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ fontWeight: 700 }}>{r.studentName}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.field} · {fmtDate(r.createdAt)}</div>
                  {r.note && <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>“{r.note}”</div>}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <button className="btn btn-sm btn-outline" onClick={() => downloadCv(r).catch((e) => flash(e.message))}><Download size={14} /> View CV</button>
                    <button className="btn btn-sm btn-primary" onClick={() => act(r, { action: 'claim' }, `You're reviewing ${r.studentName}'s resume`)}>Review this</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {reviewing.length > 0 && <SectionTitle>Resumes I'm reviewing</SectionTitle>}
          <div style={{ display: 'grid', gap: '0.9rem' }}>
            {reviewing.map((r) => {
              const d = drafts[r.id] || { feedback: '', rating: 4 };
              return (
                <div key={r.id} className="card" style={{ padding: '1.2rem 1.3rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: r.status === 'in_review' ? '0.9rem' : 0 }}>
                    <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                      <div style={{ fontWeight: 700 }}>{r.studentName} · {r.fileName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.field}{r.note ? ` · “${r.note}”` : ''}</div>
                    </div>
                    <span style={REVIEW_STATUS[r.status]}>{REVIEW_LABEL[r.status]}</span>
                    <button className="btn btn-sm btn-outline" onClick={() => downloadCv(r).catch((e) => flash(e.message))}><Download size={14} /> CV</button>
                  </div>
                  {r.status === 'in_review' ? (
                    <>
                      <textarea rows={4} value={d.feedback} onChange={(e) => setDrafts({ ...drafts, [r.id]: { ...d, feedback: e.target.value } })} aria-label="Feedback"
                        placeholder="What works, what to fix, and one thing to change first…" style={{ resize: 'vertical', marginBottom: '0.6rem' }} />
                      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <label style={{ ...field, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Overall
                          <select value={d.rating} onChange={(e) => setDrafts({ ...drafts, [r.id]: { ...d, rating: Number(e.target.value) } })} style={{ width: 'auto' }}>
                            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} / 5</option>)}
                          </select>
                        </label>
                        <button className="btn btn-sm btn-primary" disabled={d.feedback.trim().length < 10} onClick={() => act(r, { action: 'feedback', ...d }, 'Feedback sent')}><Check size={14} /> Send feedback</button>
                        <button className="btn btn-sm btn-ghost" onClick={() => act(r, { action: 'release' }, 'Returned to the queue')}>Give back</button>
                      </div>
                    </>
                  ) : (
                    <div style={{ marginTop: '0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}><Stars value={r.rating} /> {r.feedback}</div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {isAdminRole(user.role) && (
        <>
          <SectionTitle>All review requests</SectionTitle>
          {reviews.length === 0 ? <Empty>No requests yet.</Empty> : (
            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead><tr>{['Student', 'Field', 'Sent', 'Reviewer', 'Status'].map((h) => <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.72rem', color: 'var(--text-dim)', borderBottom: '1px solid var(--border)' }}>{h}</th>)}</tr></thead>
                <tbody>{reviews.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                    <td style={{ padding: '0.7rem 1rem', fontWeight: 600 }}>{r.studentName}</td><td style={{ padding: '0.7rem 1rem' }}>{r.field}</td>
                    <td style={{ padding: '0.7rem 1rem' }}>{fmtDate(r.createdAt)}</td><td style={{ padding: '0.7rem 1rem' }}>{r.reviewerName || '—'}</td>
                    <td style={{ padding: '0.7rem 1rem' }}><span style={REVIEW_STATUS[r.status]}>{REVIEW_LABEL[r.status]}</span></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* ── Interview experiences ──────────────────────────────────────────── */
const DIFF = { Easy: chip('#ecfdf5', '#047857'), Medium: chip('#fffbeb', '#b45309'), Hard: chip('#fef2f2', '#b91c1c') };
const emptyInterview = { company: '', role: '', year: String(new Date().getFullYear()), rounds: 3, difficulty: 'Medium', outcome: 'Offer', mode: 'Campus', content: '', tips: '' };

const Interviews = ({ flash, initialQuery }) => {
  const { user } = useAuth();
  const { interviews, addInterview, removeInterview, toggleHelpful } = useData();
  const { personById } = useSocial();
  const [q, setQ] = useState(initialQuery || '');
  const [difficulty, setDifficulty] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyInterview);
  const canWrite = [ROLES.ALUMNI, ROLES.PROFESSOR].includes(user.role);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return interviews
      .filter((i) => (!difficulty || i.difficulty === difficulty) && (!term || `${i.company} ${i.role} ${i.content} ${i.tips}`.toLowerCase().includes(term)))
      .sort((a, b) => (b.helpful?.length || 0) - (a.helpful?.length || 0) || new Date(b.createdAt) - new Date(a.createdAt));
  }, [interviews, q, difficulty]);

  const submit = (e) => {
    e.preventDefault();
    addInterview({ ...form, rounds: Number(form.rounds) || 1, postedById: user.id, authorId: user.id, authorName: user.name, authorBatch: user.batch || '' });
    setForm(emptyInterview);
    setShowForm(false);
    flash('Thanks — your interview experience is live.');
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by company or role…" aria-label="Search interview experiences" style={{ paddingLeft: '2.3rem' }} />
        </div>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} aria-label="Difficulty" style={{ width: 'auto' }}>
          <option value="">Any difficulty</option>{Object.keys(DIFF).map((d) => <option key={d}>{d}</option>)}
        </select>
        {canWrite && <button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={15} /> Share your interview</button>}
      </div>

      {list.length === 0 ? <Empty>No interview experiences match that search.</Empty> : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {list.map((i) => {
            const voted = (i.helpful || []).includes(user.id);
            const mine = i.postedById === user.id || i.authorId === user.id;
            return (
              <article key={i.id} className="card" style={{ padding: '1.3rem 1.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{i.company} — {i.role}</h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                      By {i.authorName}{personById(i.authorId)?.verified && <VerifiedBadge size={13} />}{i.authorBatch && ` · Class of ${i.authorBatch}`} · {i.year} · {i.mode} · {i.rounds} round{i.rounds > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <span style={DIFF[i.difficulty] || DIFF.Medium}>{i.difficulty}</span>
                    <span style={chip(i.outcome === 'Offer' ? '#eff6ff' : '#f1f5f9', i.outcome === 'Offer' ? '#1d4ed8' : '#64748b')}>{i.outcome}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.88rem', lineHeight: 1.6, margin: '0.8rem 0', whiteSpace: 'pre-wrap' }}>{i.content}</p>
                {i.tips && <div style={{ fontSize: '0.85rem', background: 'var(--blue-50)', borderRadius: 10, padding: '0.7rem 0.9rem' }}><strong>Tip:</strong> {i.tips}</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.9rem', flexWrap: 'wrap' }}>
                  <button className={`btn btn-sm ${voted ? 'btn-primary' : 'btn-outline'}`} disabled={mine} onClick={() => toggleHelpful(i.id, user.id)} aria-pressed={voted}>
                    <ThumbsUp size={14} /> Helpful · {(i.helpful || []).length}
                  </button>
                  <span style={{ marginLeft: 'auto', display: 'flex', gap: '0.25rem' }}>
                    {mine || isAdminRole(user.role)
                      ? <button className="btn btn-sm btn-ghost" style={{ color: '#dc2626' }} onClick={() => { removeInterview(i.id); flash('Removed'); }}><Trash2 size={14} /> Delete</button>
                      : <ReportButton kind="interview" itemId={i.id} itemTitle={`${i.company} — ${i.role}`} />}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.form initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} onClick={(e) => e.stopPropagation()} onSubmit={submit} className="card" role="dialog" aria-modal="true" aria-label="Share your interview"
              style={{ width: 'min(620px, 100%)', maxHeight: '90vh', overflowY: 'auto', padding: '1.6rem', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.8rem' }}>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Share your interview experience</h3>
                <button type="button" className="btn-icon btn-ghost" onClick={() => setShowForm(false)} aria-label="Close"><X size={18} /></button>
              </div>
              <label style={field}>Company<input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} style={input} /></label>
              <label style={field}>Role<input required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={input} /></label>
              <label style={field}>Year<input required value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} style={input} /></label>
              <label style={field}>Rounds<input type="number" min={1} max={10} value={form.rounds} onChange={(e) => setForm({ ...form, rounds: e.target.value })} style={input} /></label>
              <label style={field}>Difficulty<select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} style={input}>{Object.keys(DIFF).map((d) => <option key={d}>{d}</option>)}</select></label>
              <label style={field}>Outcome<select value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} style={input}>{['Offer', 'No offer', 'Withdrew'].map((d) => <option key={d}>{d}</option>)}</select></label>
              <label style={{ ...field, gridColumn: '1 / -1' }}>How did it go? Rounds, questions, what they looked for
                <textarea required rows={5} minLength={40} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} style={{ ...input, resize: 'vertical' }} />
              </label>
              <label style={{ ...field, gridColumn: '1 / -1' }}>Your top tip (optional)<input value={form.tips} onChange={(e) => setForm({ ...form, tips: e.target.value })} style={input} /></label>
              <button className="btn btn-primary" style={{ gridColumn: '1 / -1' }}><Plus size={15} /> Publish</button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Volunteering ───────────────────────────────────────────────────── */
const KINDS = ['Guest Lecture', 'Mock Interviews', 'Competition Judge', 'Panel Discussion', 'Workshop'];
const emptyVol = { kind: KINDS[0], title: '', date: '', time: '11:00', mode: 'On campus', location: '', slots: 2, description: '' };

const Volunteering = ({ flash }) => {
  const { user } = useAuth();
  const { volunteering, addVolunteerRequest, removeVolunteerRequest, signUpToVolunteer, withdrawVolunteer, setVolunteerStatus, alumniList } = useData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyVol);
  const canPost = user.role === ROLES.PROFESSOR || isAdminRole(user.role);
  const isAlumni = user.role === ROLES.ALUMNI;
  const me = alumniList.find((a) => a.id === user.id);
  const today = new Date().toISOString().slice(0, 10);

  const submit = (e) => {
    e.preventDefault();
    addVolunteerRequest({ ...form, slots: Number(form.slots) || 1, postedById: user.id, postedByName: user.name, postedByRole: user.role });
    setForm(emptyVol);
    setShowForm(false);
    flash('Request posted — alumni can now sign up.');
  };

  const sorted = [...volunteering].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: 620 }}>
          {isAlumni ? 'Give back an hour: guest lectures, mock interviews and judging. Faculty confirm your slot.' : canPost ? 'Ask alumni to give guest lectures, take mock interviews or judge competitions.' : 'Alumni sign up to teach, interview and judge on campus. Here’s what’s coming up.'}
        </p>
        {canPost && <button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={15} /> Post a request</button>}
      </div>
      {sorted.length === 0 ? <Empty>No volunteering requests yet.</Empty> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(340px, 100%), 1fr))', gap: '1rem' }}>
          {sorted.map((v) => {
            const signups = v.signups || [];
            const mine = signups.find((s) => s.userId === user.id);
            const owner = v.postedById === user.id || isAdminRole(user.role);
            const full = signups.filter((s) => s.status !== 'declined').length >= v.slots;
            const past = v.date && v.date < today;
            return (
              <article key={v.id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span className="tag">{v.kind}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: full ? '#b91c1c' : 'var(--text-muted)' }}><Users size={13} style={{ verticalAlign: -2 }} /> {signups.length}/{v.slots} signed up</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, lineHeight: 1.35 }}>{v.title}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '0.3rem 0.9rem' }}>
                  <span><Calendar size={13} style={{ verticalAlign: -2 }} /> {fmtDate(v.date)} · {v.time}</span>
                  <span><MapPin size={13} style={{ verticalAlign: -2 }} /> {v.mode}{v.location ? ` · ${v.location}` : ''}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{v.description}</p>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Posted by {v.postedByName}</div>

                {owner && signups.length > 0 && (
                  <div style={{ background: 'var(--gray-50)', borderRadius: 12, padding: '0.6rem 0.8rem' }}>
                    {signups.map((s) => (
                      <div key={s.userId} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0', flexWrap: 'wrap' }}>
                        <span style={{ flex: 1, fontSize: '0.83rem', fontWeight: 600 }}>{s.name}<span style={{ color: 'var(--text-dim)', fontWeight: 500 }}>{s.company ? ` · ${s.company}` : ''}{s.batch ? ` · ${s.batch}` : ''}</span></span>
                        {s.status === 'pending' ? <>
                          <button className="btn btn-sm btn-primary" onClick={() => setVolunteerStatus(v.id, s.userId, 'confirmed')}>Confirm</button>
                          <button className="btn btn-sm btn-ghost" onClick={() => setVolunteerStatus(v.id, s.userId, 'declined')}>Decline</button>
                        </> : <span style={chip(s.status === 'confirmed' ? '#ecfdf5' : '#fef2f2', s.status === 'confirmed' ? '#047857' : '#b91c1c')}>{s.status}</span>}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', alignItems: 'center', flexWrap: 'wrap' }}>
                  {isAlumni && (mine ? <>
                    <span style={chip(mine.status === 'confirmed' ? '#ecfdf5' : mine.status === 'declined' ? '#fef2f2' : '#fffbeb', mine.status === 'confirmed' ? '#047857' : mine.status === 'declined' ? '#b91c1c' : '#b45309')}>
                      {mine.status === 'confirmed' ? 'You’re confirmed' : mine.status === 'declined' ? 'Not needed this time' : 'Signed up — awaiting faculty'}
                    </span>
                    {mine.status === 'pending' && <button className="btn btn-sm btn-ghost" onClick={() => { withdrawVolunteer(v.id, user.id); flash('Withdrawn'); }}>Withdraw</button>}
                  </> : (
                    <button className="btn btn-sm btn-primary" disabled={full || past} onClick={() => { signUpToVolunteer(v.id, { userId: user.id, name: user.name, company: me?.company || '', batch: me?.batch || user.batch || '' }); flash('Thanks for volunteering!'); }}>
                      <HeartHandshake size={14} /> {past ? 'Event passed' : full ? 'All slots filled' : 'Volunteer'}
                    </button>
                  ))}
                  {owner && <button className="btn btn-sm btn-ghost" style={{ color: '#dc2626', marginLeft: 'auto' }} onClick={() => { removeVolunteerRequest(v.id); flash('Request removed'); }}><Trash2 size={14} /> Remove</button>}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.form initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} onClick={(e) => e.stopPropagation()} onSubmit={submit} className="card" role="dialog" aria-modal="true" aria-label="Post a volunteering request"
              style={{ width: 'min(580px, 100%)', maxHeight: '90vh', overflowY: 'auto', padding: '1.6rem', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.8rem' }}>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Ask alumni to volunteer</h3>
                <button type="button" className="btn-icon btn-ghost" onClick={() => setShowForm(false)} aria-label="Close"><X size={18} /></button>
              </div>
              <label style={field}>Type<select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} style={input}>{KINDS.map((k) => <option key={k}>{k}</option>)}</select></label>
              <label style={field}>Volunteers needed<input type="number" min={1} max={50} value={form.slots} onChange={(e) => setForm({ ...form, slots: e.target.value })} style={input} /></label>
              <label style={{ ...field, gridColumn: '1 / -1' }}>Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Guest lecture on careers in audit" style={input} /></label>
              <label style={field}>Date<input type="date" required min={today} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={input} /></label>
              <label style={field}>Time<input type="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} style={input} /></label>
              <label style={field}>Where<select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} style={input}>{['On campus', 'Online'].map((k) => <option key={k}>{k}</option>)}</select></label>
              <label style={field}>Venue / link<input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} style={input} /></label>
              <label style={{ ...field, gridColumn: '1 / -1' }}>Details<textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...input, resize: 'vertical' }} /></label>
              <button className="btn btn-primary" style={{ gridColumn: '1 / -1' }}><Plus size={15} /> Post request</button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Page ───────────────────────────────────────────────────────────── */
const CareerHub = () => {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  // Volunteering is for alumni (and the faculty/admins who post requests)
  const tabs = TABS.filter((t) => t.id !== 'volunteer' || user.role !== ROLES.STUDENT);
  const tab = tabs.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'resume';
  const [toast, setToast] = useState('');
  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  return (
    <div className="page">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: -60, x: '-50%', opacity: 0 }} animate={{ y: 0, x: '-50%', opacity: 1 }} exit={{ y: -60, x: '-50%', opacity: 0 }}
            role="status" style={{ position: 'fixed', top: '1.5rem', left: '50%', background: '#fff', border: '1px solid var(--blue-100)', padding: '0.8rem 1.75rem', borderRadius: 99, zIndex: 3000, fontWeight: 700, fontSize: '0.875rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', maxWidth: 'calc(100vw - 2rem)' }}>
            <Check size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <PageHeader
        title="Career Hub"
        subtitle={user.role === ROLES.STUDENT ? 'Resume feedback from alumni and real interview stories from people who got the job.' : user.role === ROLES.ALUMNI ? 'Review students’ resumes, share your interview stories and volunteer on campus.' : 'Resume feedback, real interview stories and ways for alumni to give back.'}
      >
        <div className="seg" role="tablist" aria-label="Career Hub sections">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setParams({ tab: t.id })}>
              <t.icon size={15} aria-hidden="true" /> {t.label}
            </button>
          ))}
        </div>
      </PageHeader>
      {tab === 'resume' && <ResumeReviews flash={flash} />}
      {tab === 'interviews' && <Interviews flash={flash} initialQuery={params.get('q')} />}
      {tab === 'volunteer' && <Volunteering flash={flash} />}
    </div>
  );
};

export default CareerHub;
