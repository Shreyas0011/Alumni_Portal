import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Briefcase, Calendar, FileText, HeartHandshake, LayoutGrid, CornerDownLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useSocial } from '../context/SocialContext';
import { canAccess, homeFor } from '../lib/roles';
import { VerifiedBadge } from './Badges';

// Open from anywhere: window.dispatchEvent(new CustomEvent('search:open', { detail: 'text' }))
// eslint-disable-next-line react-refresh/only-export-components
export const openSearch = (query = '') => window.dispatchEvent(new CustomEvent('search:open', { detail: query }));

const PAGES = [
  { label: 'Directory', path: '/directory' },
  { label: 'Mentorship', path: '/mentorship' },
  { label: 'Events', path: '/events' },
  { label: 'Jobs & Referrals', path: '/jobs' },
  { label: 'Messages', path: '/messages' },
  { label: 'Career Hub — resume reviews', path: '/career?tab=resume', access: '/career' },
  { label: 'Career Hub — interview experiences', path: '/career?tab=interviews', access: '/career' },
  { label: 'Career Hub — volunteering', path: '/career?tab=volunteer', access: '/career', hideFor: ['student'] },
  { label: 'Yearbook', path: '/yearbook' },
  { label: 'Explore Campus', path: '/campus' },
  { label: 'Admin Portal', path: '/admin' },
];

const SearchPalette = () => {
  const { user } = useAuth();
  const { jobs, events, interviews, volunteering } = useData();
  const { people } = useSocial();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = (e) => { setQ(e.detail || ''); setActive(0); setOpen(true); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('search:open', onOpen);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('search:open', onOpen); };
  }, []);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 0); }, [open]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const has = (...parts) => parts.filter(Boolean).join(' ').toLowerCase().includes(term);
    const groups = [];
    const pages = PAGES.filter((p) => canAccess(user, p.access || p.path) && !(p.hideFor || []).includes(user?.role) && (!term || has(p.label)))
      .map((p) => ({ key: `p-${p.path}`, icon: LayoutGrid, title: p.label, sub: 'Page', go: () => navigate(p.path) }));
    if (!term) {
      groups.push({ name: 'Go to', items: [{ key: 'home', icon: LayoutGrid, title: 'My dashboard', sub: 'Page', go: () => navigate(homeFor(user)) }, ...pages] });
      return groups;
    }
    const ppl = people.filter((p) => p.uid !== user?.id && has(p.name, p.subtitle, p.batch, p.role)).slice(0, 6)
      .map((p) => ({ key: `u-${p.uid}`, icon: User, title: p.name, verified: p.verified, sub: [p.subtitle, p.batch && `Class of ${p.batch}`].filter(Boolean).join(' · '), go: () => navigate(`/messages?with=${encodeURIComponent(p.uid)}`), action: 'Message' }));
    const jb = jobs.filter((j) => has(j.title, j.company, j.location, j.domain, ...(j.skills || []))).slice(0, 5)
      .map((j) => ({ key: `j-${j.id}`, icon: Briefcase, title: `${j.title} · ${j.company}`, sub: `${j.type} · ${j.location} · posted by ${j.postedByName}`, go: () => navigate(`/jobs?q=${encodeURIComponent(j.title)}`) }));
    const ev = canAccess(user, '/events') ? events.filter((e) => has(e.title, e.category, e.location, e.description)).slice(0, 4)
      .map((e) => ({ key: `e-${e.id}`, icon: Calendar, title: e.title, sub: `${e.category || 'Event'} · ${e.date}`, go: () => navigate('/events') })) : [];
    const iv = interviews.filter((i) => has(i.company, i.role, i.content)).slice(0, 4)
      .map((i) => ({ key: `i-${i.id}`, icon: FileText, title: `${i.company} — ${i.role}`, sub: `Interview experience by ${i.authorName}`, go: () => navigate(`/career?tab=interviews&q=${encodeURIComponent(i.company)}`) }));
    const vo = user?.role === 'student' ? [] : volunteering.filter((v) => has(v.title, v.kind, v.description)).slice(0, 3)
      .map((v) => ({ key: `v-${v.id}`, icon: HeartHandshake, title: v.title, sub: `${v.kind} · ${v.date}`, go: () => navigate('/career?tab=volunteer') }));
    if (ppl.length) groups.push({ name: 'People', items: ppl });
    if (jb.length) groups.push({ name: 'Jobs', items: jb });
    if (ev.length) groups.push({ name: 'Events', items: ev });
    if (iv.length) groups.push({ name: 'Interview experiences', items: iv });
    if (vo.length) groups.push({ name: 'Volunteering', items: vo });
    if (pages.length) groups.push({ name: 'Pages', items: pages });
    return groups;
  }, [q, people, jobs, events, interviews, volunteering, user, navigate]);

  const flat = results.flatMap((g) => g.items);

  if (!open || !user) return null;
  const choose = (item) => { setOpen(false); setQ(''); item.go(); };
  const onKeyDown = (e) => {
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, flat.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === 'Enter' && flat[active]) choose(flat[active]);
  };

  let idx = -1;
  return (
    <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)', zIndex: 2500, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '12vh 1rem 1rem' }}>
      <div onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Search the portal" className="card" style={{ width: 'min(620px, 100%)', padding: 0, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.1rem', borderBottom: '1px solid var(--border)' }}>
          <Search size={18} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
          <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onKeyDown}
            placeholder="Search people, jobs, events, interview tips…" aria-label="Search"
            style={{ border: 'none', outline: 'none', fontSize: '1rem', padding: 0, background: 'transparent', boxShadow: 'none' }} />
          <kbd style={{ fontSize: '0.65rem', fontWeight: 700, border: '1px solid var(--border)', borderRadius: 4, padding: '2px 6px', color: 'var(--text-dim)' }}>Esc</kbd>
        </div>
        <div style={{ maxHeight: '55vh', overflowY: 'auto', padding: '0.4rem 0' }}>
          {flat.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>No results for “{q}”.</div>}
          {results.map((g) => (
            <div key={g.name}>
              <div style={{ padding: '0.5rem 1.1rem 0.25rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{g.name}</div>
              {g.items.map((it) => {
                idx += 1;
                const i = idx;
                const Icon = it.icon;
                return (
                  <button key={it.key} onClick={() => choose(it)} onMouseEnter={() => setActive(i)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', textAlign: 'left', padding: '0.6rem 1.1rem', border: 'none', background: active === i ? 'var(--blue-50)' : 'transparent', cursor: 'pointer' }}>
                    <Icon size={16} style={{ color: 'var(--blue-700)', flexShrink: 0 }} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, fontSize: '0.88rem' }}>{it.title}{it.verified && <VerifiedBadge size={13} />}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.sub}</span>
                    </span>
                    {active === i && <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 3 }}>{it.action || 'Open'} <CornerDownLeft size={12} /></span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPalette;
