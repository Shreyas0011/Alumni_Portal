import React, { useState } from 'react';
import { FAMOUS_ALUMNI, TOP_RECRUITERS, ALUMNI_FIRMS } from '../data/showcase';
import './Landing.css';

const initials = (name) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

export const FamousAlumni = () => (
  <section className="sc-section">
    <div className="sc-head">
      <h3>Famous Alumni</h3>
      <p>Leaders who started on our campus</p>
    </div>
    <div className="fa-row">
      {FAMOUS_ALUMNI.map((a) => (
        <article key={a.name} className="fa-card">
          <img className="fa-photo" src={a.photo} alt={a.name} loading="lazy" />
          <div className="fa-info">
            <div className="fa-name">{a.name}</div>
            <div className="fa-role">{a.title}, {a.company}</div>
            <span className="fa-batch">Class of {a.batch}</span>
          </div>
        </article>
      ))}
    </div>
  </section>
);

const Logo = ({ company }) => {
  const [failed, setFailed] = useState(false);
  return (
    <div className="rc-logo" style={{ color: company.color }} title={company.name}>
      {company.logo && !failed && (
        <img src={`https://cdn.simpleicons.org/${company.logo}`} alt="" loading="lazy" onError={() => setFailed(true)} />
      )}
      <span>{company.name}</span>
    </div>
  );
};

export const RecruitersAndFirms = ({ showRecruiters = true }) => (
  <section className={`sc-section ${showRecruiters ? 'rc-wrap' : ''}`}>
    {showRecruiters && <div>
      <div className="sc-head">
        <h3>Top Recruiting Companies</h3>
        <p>Where our graduates are hired</p>
      </div>
      <div className="rc-grid">
        {TOP_RECRUITERS.map((c) => <Logo key={c.name} company={c} />)}
      </div>
    </div>}
    <div>
      <div className="sc-head">
        <h3>Alumni Firms</h3>
        <p>Founded by our alumni</p>
      </div>
      <div className={showRecruiters ? 'af-list' : 'af-grid'}>
        {ALUMNI_FIRMS.map((f) => (
          <div key={f.name} className="af-item">
            <div className="af-mark" style={{ background: f.color }}>{initials(f.name)}</div>
            <div style={{ minWidth: 0 }}>
              <div className="af-name">{f.name}</div>
              <div className="af-meta">{f.sector} · {f.founder}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
