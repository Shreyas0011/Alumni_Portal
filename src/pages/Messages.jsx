import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, Search, PenSquare, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { ChatThread } from '../components/Chat';
import { VerifiedBadge } from '../components/Badges';
import PageHeader from '../components/PageHeader';

const when = (d) => {
  const date = new Date(d);
  const today = new Date();
  return date.toDateString() === today.toDateString()
    ? date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const Messages = () => {
  const { user } = useAuth();
  const { conversations, people, personById } = useSocial();
  const [params, setParams] = useSearchParams();
  const active = params.get('with');
  const [q, setQ] = useState('');
  const [composing, setComposing] = useState(false);

  const open = (uid) => { setComposing(false); setQ(''); setParams(uid ? { with: uid } : {}); };
  const activePerson = active && (personById(active) || { uid: active, name: conversations.find((c) => c.with === active)?.name || 'Member' });

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (composing) {
      return people.filter((p) => p.uid !== user?.id && (!term || `${p.name} ${p.subtitle} ${p.batch}`.toLowerCase().includes(term)))
        .slice(0, 50).map((p) => ({ with: p.uid, name: p.name, sub: [p.subtitle, p.batch && `Class of ${p.batch}`].filter(Boolean).join(' · '), verified: p.verified }));
    }
    return conversations.filter((c) => !term || c.name.toLowerCase().includes(term))
      .map((c) => ({ ...c, sub: `${c.last.from === user?.id ? 'You: ' : ''}${c.last.text}`, verified: personById(c.with)?.verified }));
  }, [composing, q, people, conversations, user?.id, personById]);

  return (
    <div className="page">
      <PageHeader title="Messages" subtitle="Private conversations with alumni, faculty and classmates." />
      <div className={`msg-layout ${active ? 'has-active' : ''}`}>
        <aside className="card msg-list" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '0.85rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={composing ? 'Find a person…' : 'Search conversations…'} aria-label="Search"
                style={{ paddingLeft: '2.2rem', fontSize: '0.85rem', borderRadius: 10 }} />
            </div>
            <button className={`btn btn-sm ${composing ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setComposing((c) => !c); setQ(''); }} aria-pressed={composing} title="New message">
              <PenSquare size={15} />
            </button>
          </div>
          {composing && <div style={{ padding: '0.5rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>New message to…</div>}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {list.length === 0 && (
              <div style={{ padding: '2.5rem 1.25rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {composing ? 'No one matches that search.' : 'No conversations yet. Start one with the pencil button, or message someone from the Directory or Mentorship pages.'}
              </div>
            )}
            {list.map((c) => (
              <button key={c.with} onClick={() => open(c.with)}
                style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%', textAlign: 'left', padding: '0.8rem 1rem', border: 'none', borderBottom: '1px solid var(--gray-100)', background: active === c.with ? 'var(--blue-50)' : '#fff', cursor: 'pointer' }}>
                <span style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, var(--blue-700), var(--blue-500))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>{c.name?.[0]}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <span style={{ fontWeight: c.unread ? 800 : 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>{c.verified && <VerifiedBadge size={13} />}
                    </span>
                    {c.last && <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', flexShrink: 0 }}>{when(c.last.createdAt)}</span>}
                  </span>
                  <span style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: c.unread ? 'var(--text-main)' : 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.sub}</span>
                    {c.unread > 0 && <span className="sidebar-link-badge">{c.unread}</span>}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section className="card msg-thread" style={{ padding: 0, overflow: 'hidden' }}>
          {activePerson ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <button className="btn btn-sm btn-ghost msg-back" onClick={() => open(null)} style={{ alignSelf: 'flex-start', margin: '0.5rem 0.5rem 0' }}><ArrowLeft size={15} /> All conversations</button>
              <div style={{ flex: 1, minHeight: 0 }}>
                <ChatThread key={activePerson.uid} withUid={activePerson.uid} name={activePerson.name} subtitle={activePerson.subtitle} verified={activePerson.verified} />
              </div>
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', color: 'var(--text-muted)', padding: '2rem', textAlign: 'center' }}>
              <MessageSquare size={30} style={{ color: 'var(--blue-600)' }} />
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>Pick a conversation</div>
              <div style={{ fontSize: '0.85rem', maxWidth: 320 }}>Message alumni, faculty and classmates. Everything you send is private to the two of you.</div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Messages;
