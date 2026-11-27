import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react';

/* Progress card: "Your profile is 60% complete" with the next steps.
   items: [{ label, done, to?, onClick? }] */
const ProfileMeter = ({ title, hint, items }) => {
  const [showDone, setShowDone] = useState(false);
  const done = items.filter((i) => i.done).length;
  // What's left comes first; finished steps fold away
  const visible = showDone ? [...items.filter((i) => !i.done), ...items.filter((i) => i.done)] : items.filter((i) => !i.done);
  const pct = Math.round((done / Math.max(items.length, 1)) * 100);
  const color = pct >= 80 ? '#059669' : pct >= 50 ? 'var(--blue-700)' : '#d97706';
  return (
    <div className="card" style={{ padding: '1.4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{title}</h3>
        <span style={{ fontSize: '1.35rem', fontWeight: 800, color }}>{pct}%</span>
      </div>
      <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={title}
        style={{ height: 8, background: 'var(--gray-100)', borderRadius: 99, overflow: 'hidden', marginBottom: '0.6rem' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width .6s ease' }} />
      </div>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>{pct === 100 ? 'All done — nice work!' : `${done} of ${items.length} done. ${hint || ''}`}</p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.15rem' }}>
        {visible.map((i) => {
          const body = (
            <>
              {i.done ? <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0 }} /> : <Circle size={16} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />}
              <span style={{ flex: 1, textDecoration: i.done ? 'line-through' : 'none', color: i.done ? 'var(--text-dim)' : 'var(--text-main)' }}>{i.label}</span>
              {!i.done && (i.to || i.onClick) && <ChevronRight size={14} style={{ color: 'var(--blue-600)' }} />}
            </>
          );
          const style = { display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 0.5rem', borderRadius: 8, fontSize: '0.85rem', width: '100%', textAlign: 'left', background: 'none', border: 'none' };
          if (i.done) return <li key={i.label} style={style}>{body}</li>;
          if (i.to) return <li key={i.label}><Link to={i.to} className="meter-row" style={style}>{body}</Link></li>;
          if (i.onClick) return <li key={i.label}><button type="button" onClick={i.onClick} className="meter-row" style={{ ...style, cursor: 'pointer' }}>{body}</button></li>;
          return <li key={i.label} style={style}>{body}</li>;
        })}
      </ul>
      {done > 0 && done < items.length && (
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => setShowDone((v) => !v)} aria-expanded={showDone} style={{ marginTop: '0.4rem', paddingLeft: '0.5rem' }}>
          {showDone ? 'Hide finished steps' : `Show ${done} finished step${done === 1 ? '' : 's'}`}
        </button>
      )}
    </div>
  );
};

export default ProfileMeter;
