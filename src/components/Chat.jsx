import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { VerifiedBadge } from './Badges';

const timeOf = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
const dayOf = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

/* A real conversation with one member, saved in MongoDB */
export const ChatThread = ({ withUid, name, subtitle, verified, onClose, autoFocus = true }) => {
  const { user } = useAuth();
  const { messages, sendMessage, markConversationRead } = useSocial();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);
  const thread = messages.filter((m) => (m.from === user?.id && m.to === withUid) || (m.from === withUid && m.to === user?.id));

  useEffect(() => { markConversationRead(withUid); }, [withUid, thread.length]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [thread.length, withUid]);

  const send = async () => {
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setError('');
    try {
      await sendMessage(withUid, body);
      setText('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ padding: '1.1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', minWidth: 0 }}>
          <div style={{ width: 42, height: 42, borderRadius: '12px', background: 'linear-gradient(135deg, var(--blue-700), var(--blue-500))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
            {name?.[0] || '?'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>{name} {verified && <VerifiedBadge />}</div>
            {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--blue-700)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subtitle}</div>}
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} aria-label="Close chat" style={{ background: 'var(--gray-100)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <X size={16} />
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
        {thread.length === 0 && (
          <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: 260 }}>
            Say hello to {name?.split(' ')[0]}. Messages are private between the two of you.
          </div>
        )}
        {thread.map((m, i) => {
          const mine = m.from === user?.id;
          const day = dayOf(m.createdAt);
          const showDay = i === 0 || day !== dayOf(thread[i - 1].createdAt);
          return (
            <div key={m.id} style={{ display: 'contents' }}>
              {showDay && <div style={{ alignSelf: 'center', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-dim)', margin: '0.5rem 0 0.25rem' }}>{day}</div>}
              <div style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <div style={{ background: mine ? 'var(--blue-700)' : 'var(--gray-100)', color: mine ? '#fff' : 'var(--text-main)', padding: '0.6rem 0.95rem', borderRadius: mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px', fontSize: '0.875rem', lineHeight: 1.45, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>
                  {m.text}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textAlign: mine ? 'right' : 'left', marginTop: '0.15rem' }}>
                  {timeOf(m.createdAt)}{mine && m.read ? ' · Seen' : ''}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {error && <div role="alert" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem', color: '#b91c1c', background: '#fef2f2' }}>{error}</div>}
      <div style={{ padding: '0.85rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', background: '#fafafa' }}>
        <input
          autoFocus={autoFocus}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder={`Message ${name?.split(' ')[0] || ''}…`}
          aria-label="Message"
          style={{ flex: 1, borderRadius: '12px', border: '1px solid var(--border)', padding: '0.65rem 1rem', fontSize: '0.875rem', background: '#fff' }}
        />
        <button onClick={send} disabled={sending || !text.trim()} aria-label="Send" style={{ background: 'var(--blue-700)', color: '#fff', border: 'none', borderRadius: '12px', width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: !text.trim() ? 0.6 : 1, flexShrink: 0 }}>
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
};

/* Slide-in drawer wrapping a ChatThread (Directory, Mentorship) */
export const ChatDrawer = ({ person, onClose }) => (
  <AnimatePresence>
    {person && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)', zIndex: 1000 }} />
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }}
          role="dialog" aria-modal="true" aria-label={`Chat with ${person.name}`}
          style={{ position: 'fixed', top: 0, right: 0, width: 'min(420px, 100vw)', height: '100%', background: '#fff', zIndex: 1001, boxShadow: '-10px 0 30px rgba(0,0,0,0.08)' }}>
          <ChatThread withUid={person.uid} name={person.name} subtitle={person.subtitle} verified={person.verified} onClose={onClose} />
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
