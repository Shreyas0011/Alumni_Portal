import { useEffect, useMemo, useState } from 'react';
import { Upload, Download, Loader2, CheckCircle2, AlertTriangle, FileSpreadsheet, Plus, Trash2, Users, Search, ListPlus } from 'lucide-react';
import { api } from '../../lib/api';
import { useData } from '../../context/DataContext';

const COLUMNS = ['name', 'email', 'batch', 'degree', 'company', 'profession', 'phone', 'dob', 'location', 'linkedin'];
const TEMPLATE = `${COLUMNS.join(',')}\nAarav Menon,aarav.menon@example.com,2026,B.Com Accounts & Finance,Deloitte,Analyst,9876543210,2004-05-14,Mumbai,https://linkedin.com/in/aaravmenon\n`;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const THIS_YEAR = new Date().getFullYear();
const BATCHES = Array.from({ length: 30 }, (_, i) => String(THIS_YEAR + 1 - i));

/* Minimal CSV parser: handles quoted fields, commas and newlines inside quotes */
const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i += 1; } else if (c === '"') quoted = false; else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i += 1;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [header = [], ...body] = rows.filter((r) => r.some((x) => x.trim()));
  const keys = header.map((h) => h.trim().toLowerCase().replace(/\s+/g, ''));
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] || '').trim()])));
};

const download = (name, text) => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
};
const csvCell = (v) => (/[",\n]/.test(String(v ?? '')) ? `"${String(v).replace(/"/g, '""')}"` : String(v ?? ''));
const emptyRow = () => ({ key: Math.random().toString(36).slice(2), name: '', email: '', degree: '', company: '' });

const MODES = [
  { id: 'students', label: 'Current students', icon: Users },
  { id: 'list', label: 'Type a list', icon: ListPlus },
  { id: 'csv', label: 'Upload CSV', icon: FileSpreadsheet },
];

/* Admin: add graduates to an alumni batch — pick current students, type a
   short list, or upload a CSV for a large batch. */
const BulkImport = () => {
  const { reloadCollection } = useData();
  const [mode, setMode] = useState('students');
  const [batch, setBatch] = useState(String(THIS_YEAR));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  // Current students
  const [students, setStudents] = useState(null);
  const [picked, setPicked] = useState(() => new Set());
  const [q, setQ] = useState('');
  const loadStudents = () => api.get('/api/social/students').then(setStudents).catch((e) => setError(e.message));
  useEffect(() => { loadStudents(); }, []);
  const visibleStudents = useMemo(() => (students || []).filter((s) => !q.trim() || `${s.name} ${s.email} ${s.branch}`.toLowerCase().includes(q.trim().toLowerCase())), [students, q]);

  // Typed list
  const [list, setList] = useState(() => [emptyRow(), emptyRow(), emptyRow()]);
  const filledRows = list.filter((r) => r.name.trim() || r.email.trim());
  const listErrors = filledRows.filter((r) => !r.name.trim() || !EMAIL_RE.test(r.email.trim())).length;

  // CSV
  const [csvRows, setCsvRows] = useState([]);
  const [fileName, setFileName] = useState('');

  const reset = () => { setError(''); setResult(null); };

  const run = async (rows, after) => {
    setBusy(true); reset();
    try {
      const out = await api.post('/api/social/import', { rows });
      setResult(out);
      after?.();
      await reloadCollection('alumniList');
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  const addStudents = () => {
    const rows = (students || []).filter((s) => picked.has(s.id)).map((s) => ({ name: s.name, email: s.email, batch, degree: s.branch }));
    run(rows, () => { setPicked(new Set()); loadStudents(); });
  };
  const addList = () => run(filledRows.map((r) => ({ name: r.name.trim(), email: r.email.trim(), degree: r.degree.trim(), company: r.company.trim(), batch })), () => setList([emptyRow(), emptyRow(), emptyRow()]));
  const addCsv = () => run(csvRows.map((r) => ({ ...r, batch: r.batch || batch })), () => { setCsvRows([]); setFileName(''); });

  const onFile = async (e) => {
    const f = e.target.files?.[0];
    reset(); setCsvRows([]);
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) return setError('Keep the file under 2 MB (about 10,000 rows).');
    const parsed = parseCsv(await f.text());
    if (!parsed.length) return setError('No rows found. The first line must be the column names.');
    if (!('email' in parsed[0]) || !('name' in parsed[0])) return setError('The file needs at least "name" and "email" columns. Download the template to see the format.');
    setFileName(f.name);
    setCsvRows(parsed);
    e.target.value = '';
  };

  const exportPasswords = () => download('new-alumni-passwords.csv',
    ['row,name,email,status,temporary_password,note', ...result.results.map((r) => [r.row, r.name || '', r.email, r.status, r.tempPassword || '', r.status === 'promoted' ? 'Keeps their student password' : r.reason || ''].map(csvCell).join(','))].join('\n'));

  const setRow = (key, field, value) => setList((rows) => rows.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
  const cellInput = { padding: '0.55rem 0.7rem', fontSize: '0.85rem', borderRadius: 10 };

  return (
    <div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.35rem' }}>Add to an alumni batch</h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem', maxWidth: 720 }}>
        Add graduates as verified alumni of a class year in one go. Students who already have an account keep their password. New people get a temporary password you can download.
      </p>

      <div style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.88rem' }}>
          Alumni batch
          <select value={batch} onChange={(e) => setBatch(e.target.value)} style={{ width: 'auto', borderRadius: 10 }}>
            {BATCHES.map((b) => <option key={b} value={b}>Class of {b}</option>)}
          </select>
        </label>
        <div className="seg" role="tablist" aria-label="How to add">
          {MODES.map((m) => (
            <button key={m.id} role="tab" aria-selected={mode === m.id} onClick={() => { setMode(m.id); reset(); }}>
              <m.icon size={15} aria-hidden="true" /> {m.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div role="alert" className="card" style={{ background: '#fef2f2', color: '#b91c1c', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}><AlertTriangle size={16} /> {error}</div>}

      {/* Pick from current students */}
      {mode === 'students' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '0.9rem 1.1rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
            <div style={{ position: 'relative', flex: '1 1 240px' }}>
              <Search size={15} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search students" aria-label="Search students" style={{ paddingLeft: '2.2rem', borderRadius: 10 }} />
            </div>
            <button className="btn btn-sm btn-outline" disabled={!visibleStudents.length} onClick={() => setPicked(picked.size === visibleStudents.length ? new Set() : new Set(visibleStudents.map((s) => s.id)))}>
              {picked.size && picked.size === visibleStudents.length ? 'Clear selection' : 'Select all'}
            </button>
            <button className="btn btn-primary" disabled={busy || !picked.size} onClick={addStudents}>
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Users size={15} />} Add {picked.size || ''} to Class of {batch}
            </button>
          </div>
          {students === null ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={18} /></div>
          ) : visibleStudents.length === 0 ? (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              {students.length ? 'No students match that search.' : 'There are no student accounts to move. Use “Type a list” or “Upload CSV” to add graduates.'}
            </div>
          ) : (
            <div style={{ maxHeight: 380, overflowY: 'auto' }}>
              {visibleStudents.map((s) => (
                <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.7rem 1.1rem', borderBottom: '1px solid var(--gray-100)', cursor: 'pointer', background: picked.has(s.id) ? 'var(--blue-50)' : '#fff' }}>
                  <input type="checkbox" checked={picked.has(s.id)} onChange={() => setPicked((p) => { const n = new Set(p); if (n.has(s.id)) n.delete(s.id); else n.add(s.id); return n; })} style={{ width: 'auto' }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem' }}>{s.name}</span>
                    <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.email}{s.branch ? ` · ${s.branch}` : ''}</span>
                  </span>
                  {s.profileStatus !== 'approved' && <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#b45309' }}>Profile {s.profileStatus}</span>}
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Type a short list */}
      {mode === 'list' && (
        <div className="card" style={{ padding: '1.1rem' }}>
          <div className="addlist-head" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1.2fr 1fr 36px', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', padding: '0 0.1rem 0.4rem' }}>
            <span>Full name *</span><span>Email *</span><span>Degree</span><span>Company</span><span />
          </div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {list.map((r, i) => {
              const bad = (r.name || r.email) && (!r.name.trim() || !EMAIL_RE.test(r.email.trim()));
              return (
                <div key={r.key} className="addlist-row" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 1.2fr 1fr 36px', gap: '0.5rem', alignItems: 'center' }}>
                  <input value={r.name} onChange={(e) => setRow(r.key, 'name', e.target.value)} placeholder="Full name" aria-label={`Row ${i + 1} name`} style={{ ...cellInput, borderColor: bad && !r.name.trim() ? '#fca5a5' : undefined }} />
                  <input type="email" value={r.email} onChange={(e) => setRow(r.key, 'email', e.target.value)} placeholder="name@example.com" aria-label={`Row ${i + 1} email`} style={{ ...cellInput, borderColor: bad && !EMAIL_RE.test(r.email.trim()) ? '#fca5a5' : undefined }} />
                  <input value={r.degree} onChange={(e) => setRow(r.key, 'degree', e.target.value)} placeholder="B.Com Honors" aria-label={`Row ${i + 1} degree`} style={cellInput} />
                  <input value={r.company} onChange={(e) => setRow(r.key, 'company', e.target.value)} placeholder="Optional" aria-label={`Row ${i + 1} company`} style={cellInput} />
                  <button type="button" className="btn-icon btn-ghost" onClick={() => setList((rows) => (rows.length > 1 ? rows.filter((x) => x.key !== r.key) : [emptyRow()]))} aria-label={`Remove row ${i + 1}`}><Trash2 size={15} /></button>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button className="btn btn-sm btn-outline" onClick={() => setList((rows) => [...rows, emptyRow()])} disabled={list.length >= 50}><Plus size={14} /> Add row</button>
            <span style={{ fontSize: '0.8rem', color: listErrors ? '#b91c1c' : 'var(--text-dim)' }}>
              {listErrors ? `${listErrors} row${listErrors > 1 ? 's need' : ' needs'} a name and a valid email` : 'For more than 50 people, upload a CSV instead.'}
            </span>
            <button className="btn btn-primary" style={{ marginLeft: 'auto' }} disabled={busy || !filledRows.length || listErrors > 0} onClick={addList}>
              {busy ? <Loader2 size={15} className="animate-spin" /> : <ListPlus size={15} />} Add {filledRows.length || ''} to Class of {batch}
            </button>
          </div>
        </div>
      )}

      {/* CSV for large batches */}
      {mode === 'csv' && (
        <>
          <div className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <FileSpreadsheet size={26} style={{ color: 'var(--blue-700)' }} />
            <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
              <Upload size={15} /> Choose CSV file
              <input type="file" accept=".csv,text/csv" onChange={onFile} style={{ display: 'none' }} />
            </label>
            <button className="btn btn-outline" onClick={() => download('alumni-batch-template.csv', TEMPLATE)}><Download size={15} /> Download template</button>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', flex: '1 1 260px' }}>Only name and email are required. Rows without a batch go into the Class of {batch}.</span>
          </div>
          {csvRows.length > 0 && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '0.9rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
                <div><strong>{csvRows.length}</strong> row{csvRows.length === 1 ? '' : 's'} in {fileName}. Check the preview, then add them.</div>
                <button className="btn btn-primary" disabled={busy} onClick={addCsv}>{busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />} Add {csvRows.length} alumni</button>
              </div>
              <div style={{ overflowX: 'auto', maxHeight: 360 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead><tr>{['#', 'name', 'email', 'batch', 'degree', 'company'].map((h) => <th key={h} style={{ textAlign: 'left', padding: '0.55rem 0.9rem', background: 'var(--gray-50)', position: 'sticky', top: 0 }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {csvRows.slice(0, 100).map((r, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                        <td style={{ padding: '0.5rem 0.9rem', color: 'var(--text-dim)' }}>{i + 2}</td>
                        {['name', 'email', 'batch', 'degree', 'company'].map((k) => (
                          <td key={k} style={{ padding: '0.5rem 0.9rem', color: (k === 'email' && !EMAIL_RE.test(r.email)) || (k === 'name' && !r.name) ? '#dc2626' : k === 'batch' && !r.batch ? 'var(--text-dim)' : undefined }}>
                            {k === 'batch' && !r.batch ? batch : r[k] || '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {csvRows.length > 100 && <div style={{ padding: '0.6rem 0.9rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>Showing the first 100 rows.</div>}
              </div>
            </div>
          )}
        </>
      )}

      {result && (
        <div className="card" role="status" style={{ padding: '1.25rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
            <CheckCircle2 size={20} style={{ color: '#059669' }} />
            <strong>{result.added + (result.promoted || 0)} added to the alumni list</strong>
            <span style={{ color: 'var(--text-muted)' }}>
              {result.promoted ? `· ${result.promoted} moved from students` : ''}{result.added ? ` · ${result.added} new account${result.added > 1 ? 's' : ''}` : ''}{result.skipped ? ` · ${result.skipped} skipped` : ''}
            </span>
            {result.added > 0 && <button className="btn btn-sm btn-primary" style={{ marginLeft: 'auto' }} onClick={exportPasswords}><Download size={14} /> Download temporary passwords</button>}
          </div>
          {result.added > 0 && <p style={{ fontSize: '0.8rem', color: '#b45309', marginBottom: '0.6rem' }}>Download the passwords now. They can’t be shown again.</p>}
          {result.results.some((r) => r.status === 'skipped') && (
            <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '1.1rem', margin: 0 }}>
              {result.results.filter((r) => r.status === 'skipped').slice(0, 20).map((r) => <li key={`${r.row}-${r.email}`}>{r.email || `Row ${r.row}`}: {r.reason}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkImport;
