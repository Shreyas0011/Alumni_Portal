import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, Search, Plus, X, Check, Send, Users, Trash2, IndianRupee, GraduationCap, Handshake } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { VerifiedBadge, ReportButton } from '../components/Badges';
import { useData } from '../context/DataContext';
import { ROLES, isAdminRole, ROLE_LABELS } from '../lib/roles';
import { DOMAINS } from '../data/showcase';

const TYPES = ['Full-time', 'Internship', 'Part-time', 'Contract'];
const MODES = ['On-site', 'Hybrid', 'Remote'];
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '');
const daysAgo = (d) => {
  const n = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  return n <= 0 ? 'Today' : n === 1 ? 'Yesterday' : `${n} days ago`;
};

const STATUS_STYLE = {
  pending: { bg: '#fffbeb', fg: '#b45309', label: 'Requested' },
  referred: { bg: '#eff6ff', fg: '#1d4ed8', label: 'Referred' },
  accepted: { bg: '#eff6ff', fg: '#1d4ed8', label: 'Referred' },
  interviewing: { bg: '#f5f3ff', fg: '#6d28d9', label: 'Interviewing' },
  offer: { bg: '#ecfdf5', fg: '#047857', label: 'Offer 🎉' },
  declined: { bg: '#fef2f2', fg: '#b91c1c', label: 'Declined' },
};
const STEPS = ['pending', 'referred', 'interviewing', 'offer'];
const stepOf = (status) => STEPS.indexOf(status === 'accepted' ? 'referred' : status);

/* Requested → Referred → Interviewing → Offer */
const ReferralTracker = ({ status }) => {
  if (status === 'declined') return null;
  const at = stepOf(status);
  return (
    <ol aria-label="Referral progress" style={{ display: 'flex', listStyle: 'none', padding: 0, margin: '0 0 0.6rem', gap: '0.25rem', width: '100%' }}>
      {['Requested', 'Referred', 'Interviewing', 'Offer'].map((label, i) => (
        <li key={label} aria-current={i === at ? 'step' : undefined} style={{ flex: 1, minWidth: 0 }}>
          <div style={{ height: 5, borderRadius: 99, background: i <= at ? 'var(--blue-700)' : 'var(--gray-200)' }} />
          <div style={{ fontSize: '0.66rem', fontWeight: 700, marginTop: 4, color: i <= at ? 'var(--blue-800)' : 'var(--text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
        </li>
      ))}
    </ol>
  );
};

const selectStyle = { padding: '0.65rem 0.9rem', borderRadius: '12px', border: '1px solid var(--border)', background: '#fff', fontSize: '0.85rem', minWidth: 0 };
const labelStyle = { display: 'block', fontWeight: 700, fontSize: '0.8rem', marginBottom: '0.35rem' };

const emptyForm = { title: '', company: '', location: '', mode: 'On-site', type: 'Full-time', experience: '', domain: DOMAINS[0], salary: '', stipend: '', duration: '', referral: true, deadline: '', description: '', skills: '', applyUrl: '' };

const Jobs = () => {
  const { user } = useAuth();
  const { jobs, addJob, removeJob, requestReferral, withdrawReferral, setReferralStatus } = useData();
  const { personById } = useSocial();
  const [params] = useSearchParams();
  const canPost = [ROLES.ALUMNI, ROLES.PROFESSOR].includes(user?.role) || isAdminRole(user?.role);

  const [view, setView] = useState(params.get('view') || 'all');
  const [q, setQ] = useState(params.get('q') || '');
  const [domain, setDomain] = useState('');
  const [type, setType] = useState('');
  const [mode, setMode] = useState('');
  const [referralOnly, setReferralOnly] = useState(false);
  const [requestFor, setRequestFor] = useState(null);
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState('');

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const myRequest = (job) => (job.requests || []).find((r) => r.userId === user?.id);
  const isMine = (job) => job.postedById === user?.id;

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return jobs.filter((j) => {
      if (view === 'mine' && !isMine(j)) return false;
      if (view === 'requests' && !myRequest(j)) return false;
      if (view === 'internships' && j.type !== 'Internship') return false;
      if (domain && j.domain !== domain) return false;
      if (type && j.type !== type) return false;
      if (mode && j.mode !== mode) return false;
      if (referralOnly && !j.referral) return false;
      if (!term) return true;
      return [j.title, j.company, j.location, j.postedByName, ...(j.skills || [])].join(' ').toLowerCase().includes(term);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs, view, q, domain, type, mode, referralOnly, user?.id]);

  const myPostings = jobs.filter(isMine);
  const myRequests = jobs.filter((j) => myRequest(j));
  const allDomains = [...new Set([...DOMAINS, ...jobs.map((j) => j.domain)])];

  const sendRequest = () => {
    requestReferral(requestFor.id, { userId: user.id, name: user.name, role: user.role, email: user.email, batch: user.batch || '', note: note.trim() });
    flash(`Referral requested from ${requestFor.postedByName}`);
    setRequestFor(null);
    setNote('');
  };

  const submitJob = (e) => {
    e.preventDefault();
    addJob({
      ...form,
      title: form.title.trim(),
      company: form.company.trim(),
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      postedById: user.id,
      postedByName: user.name,
      postedByBatch: user.batch || '',
      postedByRole: user.role,
    });
    setForm(emptyForm);
    setShowForm(false);
    setView('mine');
    flash('Job posted — students can now request referrals.');
  };

  const tabs = [
    { id: 'all', label: 'All Openings', count: jobs.length },
    { id: 'internships', label: 'Internships', count: jobs.filter((j) => j.type === 'Internship').length },
    { id: 'requests', label: 'My Referral Requests', count: myRequests.length, hide: !myRequests.length && canPost },
    { id: 'mine', label: 'My Postings', count: myPostings.length, hide: !canPost },
  ].filter((t) => !t.hide);

  return (
    <div className="jobs-page page">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: -60, x: '-50%', opacity: 0 }} animate={{ y: 0, x: '-50%', opacity: 1 }} exit={{ y: -60, x: '-50%', opacity: 0 }}
            style={{ position: 'fixed', top: '1.5rem', left: '50%', background: '#fff', border: '1px solid var(--blue-100)', padding: '0.8rem 1.75rem', borderRadius: '99px', zIndex: 3000, fontWeight: 700, fontSize: '0.875rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
            <Check size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <PageHeader
        title="Jobs & Referrals"
        subtitle="Openings shared by alumni at their own companies. Ask the person who posted it for a referral."
        actions={canPost && <button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> Post a Job</button>}
      >
        <div className="seg" role="tablist" aria-label="Show">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={view === t.id} onClick={() => setView(t.id)}>
              {t.label} <span className="count">{t.count}</span>
            </button>
          ))}
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="card jobs-filters" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: 'minmax(200px, 2fr) repeat(3, minmax(0, 1fr)) auto', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', minWidth: 0 }}>
          <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search role, company, skill or alumnus…" style={{ ...selectStyle, width: '100%', paddingLeft: '2.4rem' }} />
        </div>
        <select value={domain} onChange={(e) => setDomain(e.target.value)} style={selectStyle} aria-label="Domain">
          <option value="">All domains</option>
          {allDomains.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} style={selectStyle} aria-label="Job type">
          <option value="">All types</option>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select value={mode} onChange={(e) => setMode(e.target.value)} style={selectStyle} aria-label="Work mode">
          <option value="">Any location</option>
          {MODES.map((m) => <option key={m}>{m}</option>)}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer' }}>
          <input type="checkbox" checked={referralOnly} onChange={(e) => setReferralOnly(e.target.checked)} style={{ width: 'auto' }} /> Referral available
        </label>
      </div>

      {/* Listings */}
      {list.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          {view === 'mine' ? 'You haven’t posted any jobs yet.' : view === 'requests' ? 'You haven’t requested any referrals yet.' : 'No openings match these filters.'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(380px, 100%), 1fr))', gap: '1.25rem' }}>
          {list.map((job) => {
            const req = myRequest(job);
            const mine = isMine(job);
            const st = req && STATUS_STYLE[req.status];
            return (
              <article key={job.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', padding: '1.4rem' }}>
                <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 46, height: 46, borderRadius: '12px', background: 'var(--blue-50)', color: 'var(--blue-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                    {job.company.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, lineHeight: 1.3 }}>{job.title}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--blue-700)', fontWeight: 700 }}>{job.company}</div>
                  </div>
                  {job.referral && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#047857', background: '#ecfdf5', borderRadius: '99px', padding: '0.25rem 0.6rem', whiteSpace: 'nowrap' }}>Referral</span>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={13} /> {job.location === job.mode ? job.location : `${job.location} · ${job.mode}`}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Briefcase size={13} /> {job.type} · {job.experience}</span>
                  {job.type === 'Internship' && (job.stipend || job.salary) && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><IndianRupee size={13} /> {(job.stipend || job.salary).replace(/^₹/, '')} stipend</span>}
                  {job.type === 'Internship' && job.duration && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> {job.duration}</span>}
                  {job.type !== 'Internship' && job.salary && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><IndianRupee size={13} /> {job.salary.replace(/^₹/, '')}</span>}
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{job.description}</p>

                {job.skills?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <span className="tag">{job.domain}</span>
                    {job.skills.filter((s) => s !== job.domain).map((s) => (
                      <span key={s} style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.55rem', border: '1px solid var(--border)', borderRadius: '6px' }}>{s}</span>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.78rem', color: 'var(--text-dim)', borderTop: '1px solid var(--gray-100)', paddingTop: '0.8rem', marginTop: 'auto', flexWrap: 'wrap' }}>
                  <GraduationCap size={14} style={{ color: 'var(--blue-600)' }} />
                  <span style={{ color: 'var(--text-main)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>{mine ? 'You' : job.postedByName}{personById(job.postedById)?.verified && <VerifiedBadge size={13} label="Verified alumnus" />}</span>
                  {job.postedByBatch && <span>· Class of {job.postedByBatch}</span>}
                  {job.postedByRole && job.postedByRole !== ROLES.ALUMNI && <span>· {ROLE_LABELS[job.postedByRole]?.name}</span>}
                  <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={12} /> {daysAgo(job.postedAt)}{job.deadline ? ` · apply by ${fmtDate(job.deadline)}` : ''}</span>
                </div>

                {/* Actions */}
                {mine ? (
                  <div style={{ background: 'var(--gray-50)', borderRadius: '12px', padding: '0.9rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: (job.requests || []).length ? '0.6rem' : 0, gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><Users size={15} /> {(job.requests || []).length} referral request{(job.requests || []).length === 1 ? '' : 's'}</span>
                      <button className="btn btn-sm btn-ghost" style={{ color: '#dc2626' }} onClick={() => { removeJob(job.id); flash('Posting closed'); }}><Trash2 size={14} /> Close posting</button>
                    </div>
                    {(job.requests || []).map((r) => (
                      <div key={r.userId} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.55rem 0', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 160px', minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{r.name} <span style={{ fontWeight: 500, color: 'var(--text-dim)' }}>· {ROLE_LABELS[r.role]?.name || r.role}</span></div>
                          {r.note && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>“{r.note}”</div>}
                        </div>
                        {r.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button className="btn btn-sm btn-primary" onClick={() => { setReferralStatus(job.id, r.userId, 'referred'); flash(`Referred ${r.name}`); }}>Refer</button>
                            <button className="btn btn-sm btn-outline" onClick={() => setReferralStatus(job.id, r.userId, 'declined')}>Decline</button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '99px', background: STATUS_STYLE[r.status].bg, color: STATUS_STYLE[r.status].fg }}>{STATUS_STYLE[r.status].label}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {req ? (
                      <>
                        <ReferralTracker status={req.status} />
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, padding: '0.4rem 0.8rem', borderRadius: '99px', background: st.bg, color: st.fg }}>{st.label}</span>
                        {req.status === 'pending' && (
                          <button className="btn btn-sm btn-ghost" onClick={() => { withdrawReferral(job.id, user.id); flash('Request withdrawn'); }}>Withdraw</button>
                        )}
                        {stepOf(req.status) === 1 && (
                          <button className="btn btn-sm btn-outline" onClick={() => { setReferralStatus(job.id, user.id, 'interviewing'); flash('Good luck with the interview!'); }}>I got an interview</button>
                        )}
                        {req.status === 'interviewing' && (
                          <button className="btn btn-sm btn-primary" onClick={() => { setReferralStatus(job.id, user.id, 'offer'); flash('Congratulations on the offer! 🎉'); }}>I got the offer</button>
                        )}
                      </>
                    ) : job.referral ? (
                      <button className="btn btn-sm btn-primary" onClick={() => setRequestFor(job)}><Handshake size={15} /> Request Referral</button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Apply directly — {job.postedByName} can answer questions.</span>
                    )}
                    {job.applyUrl && (
                      <a href={job.applyUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline">Apply</a>
                    )}
                    <span style={{ marginLeft: 'auto' }}><ReportButton kind="job" itemId={job.id} itemTitle={`${job.title} · ${job.company}`} compact /></span>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Request referral dialog */}
      <AnimatePresence>
        {requestFor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRequestFor(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="card" role="dialog" aria-modal="true" aria-label="Request referral" style={{ width: 'min(460px, 100%)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Request a referral</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{requestFor.title} · {requestFor.company}</p>
                </div>
                <button className="btn-icon btn-ghost" onClick={() => setRequestFor(null)} aria-label="Close"><X size={18} /></button>
              </div>
              <label style={labelStyle} htmlFor="ref-note">Note to {requestFor.postedByName}</label>
              <textarea id="ref-note" rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="A line about why you're a good fit (skills, projects, CGPA)…" style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.88rem', resize: 'vertical', marginBottom: '1rem' }} />
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={sendRequest}><Send size={15} /> Send Request</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post a job dialog */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForm(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.form initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} onClick={(e) => e.stopPropagation()} onSubmit={submitJob} className="card" role="dialog" aria-modal="true" aria-label="Post a job"
              style={{ width: 'min(640px, 100%)', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Post a job or referral</h3>
                <button type="button" className="btn-icon btn-ghost" onClick={() => setShowForm(false)} aria-label="Close"><X size={18} /></button>
              </div>
              <div className="jobs-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.9rem' }}>
                {[
                  ['title', 'Job title', 'e.g. Audit Associate', true],
                  ['company', 'Company', 'e.g. KPMG', true],
                  ['location', 'City', 'e.g. Mumbai', true],
                  ['experience', 'Experience', 'e.g. Freshers / 0–2 yrs', false],
                  ...(form.type === 'Internship'
                    ? [['stipend', 'Stipend', 'e.g. ₹25k / month', false], ['duration', 'Duration', 'e.g. 6 months', false]]
                    : [['salary', 'Salary (optional)', 'e.g. ₹8–10 LPA', false]]),
                  ['applyUrl', 'Apply link (optional)', 'https://…', false],
                ].map(([k, label, ph, req]) => (
                  <div key={k}>
                    <label style={labelStyle} htmlFor={`job-${k}`}>{label}</label>
                    <input id={`job-${k}`} required={req} type={k === 'applyUrl' ? 'url' : 'text'} value={form[k]} placeholder={ph} onChange={(e) => setForm({ ...form, [k]: e.target.value })} style={{ ...selectStyle, width: '100%' }} />
                  </div>
                ))}
                <div>
                  <label style={labelStyle} htmlFor="job-type">Type</label>
                  <select id="job-type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ ...selectStyle, width: '100%' }}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="job-mode">Work mode</label>
                  <select id="job-mode" value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} style={{ ...selectStyle, width: '100%' }}>{MODES.map((t) => <option key={t}>{t}</option>)}</select>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="job-domain">Domain</label>
                  <select id="job-domain" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} style={{ ...selectStyle, width: '100%' }}>{DOMAINS.map((t) => <option key={t}>{t}</option>)}</select>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="job-deadline">Apply by</label>
                  <input id="job-deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} style={{ ...selectStyle, width: '100%' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle} htmlFor="job-skills">Skills (comma separated)</label>
                  <input id="job-skills" value={form.skills} placeholder="Excel, Valuation, GST" onChange={(e) => setForm({ ...form, skills: e.target.value })} style={{ ...selectStyle, width: '100%' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle} htmlFor="job-desc">Description</label>
                  <textarea id="job-desc" required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...selectStyle, width: '100%', resize: 'vertical' }} />
                </div>
                <label style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.referral} onChange={(e) => setForm({ ...form, referral: e.target.checked })} style={{ width: 'auto' }} />
                  I can refer candidates for this role
                </label>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.25rem' }}><Plus size={16} /> Publish Posting</button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Jobs;
