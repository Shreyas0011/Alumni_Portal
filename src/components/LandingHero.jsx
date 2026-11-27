import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, Camera, Video } from 'lucide-react';
import { CAMPUS_MEDIA, LIVE_STATS } from '../data/showcase';
import './Landing.css';

const SLIDE_MS = 6000;
const fmt = (n) => n.toLocaleString('en-IN');

/* Stats that tick like a live feed (sample data until an analytics API exists) */
const useLiveStats = () => {
  const [stats, setStats] = useState(LIVE_STATS);
  useEffect(() => {
    const t = setInterval(() => {
      setStats((prev) => prev.map((s) => {
        if (!s.drift) return s;
        const step = Math.floor(Math.random() * (s.drift + 1));
        const delta = s.swing ? step - Math.floor(s.drift / 2) : step;
        return { ...s, value: Math.max(0, s.value + delta) };
      }));
    }, 3500);
    return () => clearInterval(t);
  }, []);
  return stats;
};

const LandingHero = ({ title, subtitle }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRefs = useRef({});
  const stats = useLiveStats();
  const current = CAMPUS_MEDIA[index];

  // Advance the slideshow; a video slide stays up until the clip ends
  useEffect(() => {
    if (paused || current.type === 'video') return undefined;
    const t = setTimeout(() => setIndex((i) => (i + 1) % CAMPUS_MEDIA.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, paused, current.type]);

  // Play only the video on screen
  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([i, v]) => {
      if (!v) return;
      if (Number(i) === index && !paused) {
        v.currentTime = 0;
        v.play().catch(() => setIndex((n) => (n + 1) % CAMPUS_MEDIA.length));
      } else {
        v.pause();
      }
    });
  }, [index, paused]);

  const next = () => setIndex((i) => (i + 1) % CAMPUS_MEDIA.length);

  return (
    <section className="lh" aria-label="Campus highlights">
      <div className="lh-media" aria-hidden="true">
        {CAMPUS_MEDIA.map((m, i) => (m.type === 'video' ? (
          <video
            key={m.src}
            ref={(el) => { videoRefs.current[i] = el; }}
            className={`lh-slide ${i === index ? 'on' : ''}`}
            src={m.src}
            poster={m.poster}
            muted
            playsInline
            preload="none"
            onEnded={next}
            onError={() => i === index && next()}
          />
        ) : (
          <img
            key={m.src}
            className={`lh-slide kb ${i === index ? 'on' : ''}`}
            src={m.src}
            alt=""
            loading={i === 0 ? 'eager' : 'lazy'}
          />
        )))}
      </div>

      <div className="lh-top">
        <span className="lh-chip">
          {current.type === 'video' ? <Video size={13} /> : <Camera size={13} />}
          {current.kind} · {current.caption}
        </span>
        <div className="lh-ctrls">
          <button type="button" className="lh-btn" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}>
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
        </div>
      </div>

      <div className="lh-body">
        <h1 className="lh-title">{title}</h1>
        {subtitle && <p className="lh-sub">{subtitle}</p>}
        <div className="lh-dots" role="tablist" aria-label="Choose photo">
          {CAMPUS_MEDIA.map((m, i) => (
            <button key={m.src} type="button" className={`lh-dot ${i === index ? 'on' : ''}`} onClick={() => setIndex(i)} aria-label={m.caption} aria-selected={i === index} role="tab" />
          ))}
        </div>
      </div>

      <div className="lh-stats" aria-live="off">
        {stats.map((s) => (
          <div key={s.key} className="lh-stat">
            <div className="lh-stat-val">{fmt(s.value)}{s.key === 'countries' ? '+' : ''}</div>
            <div className="lh-stat-lbl" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {s.key === 'online' && <span className="lh-live" aria-hidden="true" />}
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingHero;
