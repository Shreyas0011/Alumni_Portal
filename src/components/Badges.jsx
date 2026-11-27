import { useState } from 'react';
import { BadgeCheck, Flag, X, Check } from 'lucide-react';
import { api } from '../lib/api';

/* ✓ shown on profiles an admin has approved */
export const VerifiedBadge = ({ size = 15, label = 'Verified by the admin team' }) => (
  <span title={label} aria-label={label} style={{ display: 'inline-flex', color: 'var(--blue-700)', flexShrink: 0 }}>
    <BadgeCheck size={size} fill="var(--blue-100)" />
  </span>
);

/* "Report" link + dialog; sends the item to the admin moderation queue */
export const ReportButton = ({ kind, itemId, itemTitle, compact = false }) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | sent
  const [error, setError] = useState('');

  const submit = async () => {
    setState('sending');
    setError('');
    try {
      await api.post('/api/social/reports', { kind, itemId, itemTitle, reason });
      setState('sent');
      setTimeout(() => { setOpen(false); setReason(''); }, 1400);
    } catch (err) {
      setError(err.message);
      setState('idle');
    }
  };

  return (
    <>
      <button type="button" onClick={() => { setOpen(true); setState('idle'); }} className="btn btn-sm btn-ghost"
        style={{ color: 'var(--text-dim)', gap: '0.3rem', padding: compact ? '0.3rem 0.5rem' : undefined }} aria-label={`Report ${itemTitle || 'this'}`}>
        <Flag size={13} /> {!compact && 'Report'}
      </button>
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)', backdropFilter: 'blur(4px)', zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={(e) => e.stopPropagation()} className="card" role="dialog" aria-modal="true" aria-label="Report content" style={{ width: 'min(420px, 100%)', padding: '1.5rem' }}>
            {state === 'sent' ? (
              <div style={{ textAlign: 'center', padding: '1rem 0', color: '#047857', fontWeight: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={28} /> Thanks — the admins will take a look.
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.9rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Report this {kind === 'interview' ? 'interview experience' : kind}</h3>
                    {itemTitle && <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{itemTitle}</p>}
                  </div>
                  <button className="btn-icon btn-ghost" onClick={() => setOpen(false)} aria-label="Close"><X size={18} /></button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  {['Spam or scam', 'Fake job / misleading', 'Offensive content', 'Wrong information'].map((r) => (
                    <button key={r} type="button" onClick={() => setReason(r)} style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.7rem', borderRadius: '99px', border: '1px solid', borderColor: reason === r ? 'var(--blue-700)' : 'var(--border)', background: reason === r ? 'var(--blue-50)' : '#fff', cursor: 'pointer' }}>{r}</button>
                  ))}
                </div>
                <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="What's wrong with it?" aria-label="Reason"
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '12px', border: '1px solid var(--border)', fontSize: '0.85rem', resize: 'vertical', marginBottom: '0.75rem' }} />
                {error && <div role="alert" style={{ color: '#b91c1c', fontSize: '0.8rem', marginBottom: '0.6rem' }}>{error}</div>}
                <button className="btn btn-primary" style={{ width: '100%' }} disabled={state === 'sending' || reason.trim().length < 5} onClick={submit}>
                  <Flag size={15} /> Send report
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
