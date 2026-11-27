import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { buildDirectory, hashOf } from '../data/directoryData';
import { YEARBOOK_QUOTES, SUPERLATIVES, CAMPUS_MOMENTS, portraitFor } from '../data/showcase';
import { VerifiedBadge } from '../components/Badges';

const PAGE = 30;

/* One page per graduating class: portraits, quotes, class awards and memories */
const Yearbook = () => {
  const { user } = useAuth();
  const { alumniList } = useData();
  const navigate = useNavigate();
  const all = useMemo(() => buildDirectory(alumniList), [alumniList]);
  const years = useMemo(() => [...new Set(all.map((a) => a.batch))].sort((a, b) => b - a), [all]);
  const [year, setYear] = useState(() => (years.includes(String(user?.batch)) ? String(user.batch) : years[0]));
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(PAGE);

  const classOf = useMemo(() => all.filter((a) => a.batch === year), [all, year]);
  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? classOf.filter((a) => `${a.name} ${a.company} ${a.dept}`.toLowerCase().includes(term)) : classOf;
  }, [classOf, q]);

  const top = (key) => {
    const counts = {};
    classOf.forEach((p) => { counts[p[key]] = (counts[p[key]] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
  };

  const pick = (y) => { setYear(y); setLimit(PAGE); setQ(''); };

  return (
    <div className="yb-page">
      <header className="yb-head">
        <div>
          <h1 className="yb-title">Yearbook</h1>
          <p className="yb-sub">Every graduating class, its faces and the lines they left behind.</p>
        </div>
        <div className="yb-controls">
          <select value={year} onChange={(e) => pick(e.target.value)} aria-label="Class year" className="yb-select">
            {years.map((y) => <option key={y} value={y}>Class of {y}{String(user?.batch) === y ? ' (your class)' : ''}</option>)}
          </select>
          <div className="yb-search">
            <Search size={16} aria-hidden="true" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE); }} placeholder={`Search the Class of ${year}`} aria-label={`Search the Class of ${year}`} />
          </div>
        </div>
      </header>

      <section className="yb-class" aria-label={`Class of ${year}`}>
        <div className="yb-class-head">
          <h2>Class of {year}</h2>
          <dl className="yb-facts">
            <div><dt>Graduates</dt><dd>{classOf.length.toLocaleString('en-IN')}</dd></div>
            <div><dt>Top employer</dt><dd>{top('company')}</dd></div>
            <div><dt>Most live in</dt><dd>{top('location')}</dd></div>
          </dl>
        </div>

        {shown.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>No one in the Class of {year} matches “{q}”.</div>
        ) : (
          <ul className="yb-grid">
            {shown.slice(0, limit).map((p, i) => {
              const h = hashOf(p.id);
              const award = !q && i < SUPERLATIVES.length ? SUPERLATIVES[i] : null;
              return (
                <li key={p.id}>
                  <button type="button" className="yb-card" onClick={() => navigate(`/directory?q=${encodeURIComponent(p.name)}`)} aria-label={`${p.name}, open in the directory`}>
                    <span className="yb-photo">
                      <img src={portraitFor(h, p.name)} alt="" loading="lazy" />
                      {award && <span className="yb-award"><Award size={12} aria-hidden="true" /> {award}</span>}
                    </span>
                    <span className="yb-name">{p.name}{p.verified && <VerifiedBadge size={13} />}</span>
                    <span className="yb-dept">{p.dept}</span>
                    <span className="yb-quote">“{YEARBOOK_QUOTES[h % YEARBOOK_QUOTES.length]}”</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {shown.length > limit && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button className="btn btn-outline" onClick={() => setLimit((l) => l + PAGE * 2)}>Show more of the class ({(shown.length - limit).toLocaleString('en-IN')} more)</button>
          </div>
        )}
      </section>

      <section aria-label="Class memories" style={{ marginTop: '3rem' }}>
        <h2 className="yb-h2">Class memories</h2>
        <div className="yb-memories">
          {CAMPUS_MOMENTS.map((m) => (
            <figure key={m.caption}>
              <img src={m.image.replace('w=900', 'w=600')} alt={m.caption} loading="lazy" />
              <figcaption>{m.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Yearbook;
