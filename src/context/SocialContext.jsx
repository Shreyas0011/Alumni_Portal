import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

/* Person-to-person data from /api/social: people, messages, notifications
   and mentor sessions. Polls while someone is signed in so new messages and
   notifications show up without a reload. */
const SocialContext = createContext(null);
const POLL_MS = 15000;

export const SocialProvider = ({ children }) => {
  const { user } = useAuth();
  const uid = user?.id;
  const [people, setPeople] = useState([]);
  const [messages, setMessages] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionStats, setSessionStats] = useState({});
  const alive = useRef(true);

  const refresh = useCallback(async () => {
    if (!uid) return;
    try {
      const [m, a, s, st] = await Promise.all([
        api.get('/api/social/messages'), api.get('/api/social/alerts'),
        api.get('/api/social/sessions'), api.get('/api/social/sessions/stats'),
      ]);
      if (!alive.current) return;
      setMessages(m); setAlerts(a); setSessions(s); setSessionStats(st);
    } catch (err) {
      console.warn('Could not refresh messages and notifications:', err.message);
    }
  }, [uid]);

  useEffect(() => {
    alive.current = true;
    if (!uid) {
      // Signed out: forget the previous person's private data
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPeople([]); setMessages([]); setAlerts([]); setSessions([]); setSessionStats({});
      return undefined;
    }
    api.get('/api/social/people').then((p) => alive.current && setPeople(p)).catch(() => {});
    refresh();
    const t = setInterval(() => { if (document.visibilityState === 'visible') refresh(); }, POLL_MS);
    return () => { alive.current = false; clearInterval(t); };
  }, [uid, refresh]);

  const sendMessage = async (to, text) => {
    const msg = await api.post('/api/social/messages', { to, text });
    setMessages((prev) => [...prev, msg]);
    return msg;
  };

  const markConversationRead = async (withUid) => {
    if (!messages.some((m) => m.from === withUid && m.to === uid && !m.read)) return;
    setMessages((prev) => prev.map((m) => (m.from === withUid && m.to === uid ? { ...m, read: true } : m)));
    await api.post('/api/social/messages/read', { with: withUid }).catch(() => {});
  };

  const markAlertsRead = async () => {
    if (!alerts.some((a) => !a.read)) return;
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    await api.post('/api/social/alerts/read', {}).catch(() => {});
  };

  const bookSession = async (body) => {
    const s = await api.post('/api/social/sessions', body);
    setSessions((prev) => [...prev, s].sort((a, b) => new Date(a.slot) - new Date(b.slot)));
    return s;
  };

  const updateSession = async (id, status) => {
    const s = await api.patch(`/api/social/sessions/${id}`, { status });
    setSessions((prev) => prev.map((x) => (x.id === id ? s : x)));
    api.get('/api/social/sessions/stats').then(setSessionStats).catch(() => {});
    return s;
  };

  // Conversations, newest first: { with, name, last, unread }
  const conversations = useMemo(() => {
    const byPerson = new Map();
    for (const m of messages) {
      const other = m.from === uid ? m.to : m.from;
      const name = m.from === uid ? m.toName : m.fromName;
      const c = byPerson.get(other) || { with: other, name, last: null, unread: 0 };
      c.last = m;
      if (m.to === uid && !m.read) c.unread += 1;
      byPerson.set(other, c);
    }
    return [...byPerson.values()].sort((a, b) => new Date(b.last.createdAt) - new Date(a.last.createdAt));
  }, [messages, uid]);

  const unreadMessages = conversations.reduce((n, c) => n + c.unread, 0);
  const unreadAlerts = alerts.filter((a) => !a.read).length;
  const personById = useCallback((id) => people.find((p) => p.uid === String(id)), [people]);

  return (
    <SocialContext.Provider value={{
      people, personById, messages, conversations, unreadMessages, sendMessage, markConversationRead,
      alerts, unreadAlerts, markAlertsRead, sessions, sessionStats, bookSession, updateSession, refresh,
    }}>
      {children}
    </SocialContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocial = () => {
  const ctx = useContext(SocialContext);
  if (!ctx) throw new Error('useSocial must be used within a SocialProvider');
  return ctx;
};
