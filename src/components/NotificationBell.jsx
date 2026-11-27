import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageSquare, Briefcase, CalendarCheck, FileText, HeartHandshake, BellOff } from 'lucide-react';
import { useSocial } from '../context/SocialContext';

const ICONS = { message: MessageSquare, referral: Briefcase, session: CalendarCheck, review: FileText, volunteer: HeartHandshake };

const ago = (d) => {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const NotificationBell = ({ align = 'right' }) => {
  const { alerts, unreadAlerts, markAlertsRead } = useSocial();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc); };
  }, [open]);

  const toggle = () => {
    setOpen((o) => !o);
    if (!open && unreadAlerts) setTimeout(markAlertsRead, 1500);
  };

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button className="btn-icon btn-ghost" onClick={toggle} aria-label={unreadAlerts ? `Notifications, ${unreadAlerts} unread` : 'Notifications'} aria-expanded={open} style={{ position: 'relative' }}>
        <Bell size={20} />
        {unreadAlerts > 0 && (
          <span style={{ position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, padding: '0 4px', background: '#ef4444', color: '#fff', borderRadius: 99, fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
            {unreadAlerts > 9 ? '9+' : unreadAlerts}
          </span>
        )}
      </button>
      {open && (
        <div className="card" role="menu" style={{ position: 'absolute', top: 'calc(100% + 8px)', [align]: 0, width: 'min(360px, calc(100vw - 2rem))', padding: 0, zIndex: 1500, boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--border)', fontWeight: 800, fontSize: '0.9rem' }}>Notifications</div>
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {alerts.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <BellOff size={22} /> You're all caught up.
              </div>
            ) : alerts.map((a) => {
              const Icon = ICONS[a.type] || Bell;
              return (
                <button key={a.id} role="menuitem" onClick={() => { setOpen(false); if (a.link) navigate(a.link); }}
                  style={{ display: 'flex', gap: '0.7rem', width: '100%', textAlign: 'left', padding: '0.75rem 1rem', border: 'none', borderBottom: '1px solid var(--gray-100)', background: a.read ? '#fff' : 'var(--blue-50)', cursor: 'pointer' }}>
                  <span style={{ width: 32, height: 32, borderRadius: 10, background: '#fff', border: '1px solid var(--border)', color: 'var(--blue-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={15} /></span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.35 }}>{a.title}</span>
                    {a.body && <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.body}</span>}
                    <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: 2 }}>{ago(a.createdAt)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
