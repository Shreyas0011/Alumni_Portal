import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, ChevronLeft, ChevronRight, GraduationCap, Users, Building2, Award } from 'lucide-react';
import { LANDMARKS, CAMPUS_MOMENTS, UNIVERSITIES, CAMPUS_VIDEO } from '../data/showcase';
import '../components/Landing.css';

const FACTS = [
  { icon: <Building2 size={18} />, value: '120 acres', label: 'Main campus' },
  { icon: <GraduationCap size={18} />, value: '1968', label: 'Founded' },
  { icon: <Users size={18} />, value: '27,700', label: 'Students across 4 campuses' },
  { icon: <Award size={18} />, value: 'NAAC A++', label: 'Accreditation' },
];

const ExploreCampus = () => {
  const [open, setOpen] = useState(null); // index into LANDMARKS

  useEffect(() => {
    if (open === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % LANDMARKS.length);
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + LANDMARKS.length) % LANDMARKS.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Video hero */}
      <section className="lh" style={{ minHeight: 'clamp(280px, 36vw, 380px)' }} aria-label="Campus video">
        <div className="lh-media" aria-hidden="true">
          <video className="lh-slide on" src={CAMPUS_VIDEO.src} poster={CAMPUS_VIDEO.poster} autoPlay muted loop playsInline preload="metadata" />
        </div>
        <div className="lh-top"><span className="lh-chip"><MapPin size={13} /> Main Campus · Mumbai</span></div>
        <div className="lh-body">
          <h1 className="lh-title">Explore Campus</h1>
          <p className="lh-sub">Walk the lawns, halls and libraries you remember — and see what’s new since you graduated.</p>
        </div>
        <div className="lh-stats">
          {FACTS.map((f) => (
            <div key={f.label} className="lh-stat">
              <div className="lh-stat-val">{f.value}</div>
              <div className="lh-stat-lbl">{f.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Landmarks */}
      <section className="sc-section">
        <div className="sc-head">
          <h3>Campus Landmarks</h3>
          <p>Tap a place to take the tour</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '1rem' }}>
          {LANDMARKS.map((l, i) => (
            <button key={l.name} type="button" onClick={() => setOpen(i)} className="campus-tile" style={{ textAlign: 'left' }}>
              <img src={l.image.replace('w=1200', 'w=600')} alt={l.name} loading="lazy" />
              <div className="campus-tile-cap">
                <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>{l.name}</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.85, lineHeight: 1.4 }}>{l.blurb}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Moments */}
      <section className="sc-section">
        <div className="sc-head">
          <h3>Campus Moments</h3>
          <p>Graduations, meetups and reunions</p>
        </div>
        <div className="moments-grid">
          {CAMPUS_MOMENTS.map((m) => (
            <figure key={m.caption} className="moment">
              <img src={m.image} alt={m.caption} loading="lazy" />
              <figcaption>{m.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Universities */}
      <section className="sc-section">
        <div className="sc-head">
          <h3>Our Universities</h3>
          <p>Four campuses, one alumni network</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: '1.25rem' }}>
          {UNIVERSITIES.map((u) => (
            <article key={u.name} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <img src={u.image} alt={u.name} loading="lazy" style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '1.1rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, lineHeight: 1.3 }}>{u.name}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                    <MapPin size={13} /> {u.city} · Est. {u.est}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem' }}>
                  <span><strong>{u.students}</strong> <span style={{ color: 'var(--text-muted)' }}>students</span></span>
                  <span style={{ color: 'var(--blue-700)', fontWeight: 700 }}>{u.ranking}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: 'auto' }}>
                  {u.programs.map((p) => <span key={p} className="tag">{p}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Landmark tour (lightbox) */}
      <AnimatePresence>
        {open !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            role="dialog" aria-modal="true" aria-label={LANDMARKS[open].name}>
            <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', width: 'min(1000px, 100%)' }}>
              <img src={LANDMARKS[open].image} alt={LANDMARKS[open].name} style={{ width: '100%', maxHeight: '75vh', objectFit: 'cover', borderRadius: '16px', display: 'block' }} />
              <div style={{ color: '#fff', marginTop: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>{LANDMARKS[open].name}</div>
                  <div style={{ fontSize: '0.88rem', opacity: 0.8 }}>{LANDMARKS[open].blurb}</div>
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7, whiteSpace: 'nowrap' }}>{open + 1} / {LANDMARKS.length}</div>
              </div>
              <button className="lh-btn" style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }} onClick={() => setOpen(null)} aria-label="Close"><X size={16} /></button>
              <button className="lh-btn" style={{ position: 'absolute', top: '40%', left: '0.75rem', width: 40, height: 40 }} onClick={() => setOpen((i) => (i - 1 + LANDMARKS.length) % LANDMARKS.length)} aria-label="Previous"><ChevronLeft size={20} /></button>
              <button className="lh-btn" style={{ position: 'absolute', top: '40%', right: '0.75rem', width: 40, height: 40 }} onClick={() => setOpen((i) => (i + 1) % LANDMARKS.length)} aria-label="Next"><ChevronRight size={20} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExploreCampus;
