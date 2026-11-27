import { useCallback, useEffect, useState } from 'react';
import { Flag, Trash2, Check, Loader2, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';
import { useData } from '../../context/DataContext';

const KIND_LABEL = { post: 'Community post', job: 'Job posting', interview: 'Interview experience' };
const COLLECTION = { post: 'posts', job: 'jobs', interview: 'interviews' };
const STATUS = { open: ['#fffbeb', '#b45309', 'Open'], dismissed: ['#f1f5f9', '#64748b', 'Dismissed'], removed: ['#fef2f2', '#b91c1c', 'Removed'] };

/* Admin queue of content members reported */
const Moderation = ({ onCount }) => {
  const { reloadCollection } = useData();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(null);

  const load = useCallback(() => api.get('/api/social/reports')
    .then((r) => { setReports(r); onCount?.(r.filter((x) => x.status === 'open').length); })
    .catch((e) => setError(e.message))
    .finally(() => setLoading(false)), [onCount]);
  useEffect(() => { load(); }, [load]);

  const act = async (r, action) => {
    setBusy(r.id);
    try {
      await api.patch(`/api/social/reports/${r.id}`, { action });
      if (action === 'remove') await reloadCollection(COLLECTION[r.kind]);
      await load();
    } catch (e) { setError(e.message); } finally { setBusy(null); }
  };

  if (loading) return <div className="card" style={{ padding: '2rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={18} /></div>;
  const open = reports.filter((r) => r.status === 'open');
  const closed = reports.filter((r) => r.status !== 'open');

  return (
    <div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem' }}>Reported content</h3>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Members report posts, job listings and interview write-ups here. Removing an item deletes it for everyone.</p>
      {error && <div role="alert" className="card" style={{ background: '#fef2f2', color: '#b91c1c', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}
      {open.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={26} style={{ color: '#059669' }} /> No open reports. All clear.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.8rem' }}>
          {open.map((r) => (
            <div key={r.id} className="card" style={{ padding: '1.1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Flag size={18} style={{ color: '#dc2626', flexShrink: 0 }} />
              <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{KIND_LABEL[r.kind]}</div>
                <div style={{ fontWeight: 700 }}>{r.itemTitle || r.itemId}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>“{r.reason}” — {r.reporterName}, {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-sm btn-outline" disabled={busy === r.id} onClick={() => act(r, 'dismiss')}><Check size={14} /> Keep it</button>
                <button className="btn btn-sm btn-primary" disabled={busy === r.id} style={{ background: '#dc2626', borderColor: '#dc2626' }} onClick={() => act(r, 'remove')}>
                  {busy === r.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {closed.length > 0 && (
        <>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '1.75rem 0 0.75rem' }}>Resolved</h4>
          <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
              <tbody>
                {closed.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 600 }}>{r.itemTitle || r.itemId}</td>
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)' }}>{KIND_LABEL[r.kind]}</td>
                    <td style={{ padding: '0.65rem 1rem', color: 'var(--text-muted)' }}>{r.resolvedBy}</td>
                    <td style={{ padding: '0.65rem 1rem' }}><span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: 99, background: STATUS[r.status][0], color: STATUS[r.status][1] }}>{STATUS[r.status][2]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Moderation;
