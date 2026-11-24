// Event artwork. Uses the event's photo when it has a real one; otherwise draws
// a branded, date-led cover built from live text, so it scales with the frame
// instead of being cropped like a text-baked placeholder image would be.
import { isRealPhoto } from '../lib/eventImage';

const coverStyles = `
  .evc { position: relative; width: 100%; height: 100%; overflow: hidden; container-type: size; }
  .evc > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
  .evc-art {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; justify-content: flex-end;
    gap: clamp(0.35rem, 2.2cqi, 0.85rem);
    padding: clamp(1rem, min(7cqi, 10cqh), 2.75rem);
    color: #fff;
    background:
      radial-gradient(80% 70% at 85% 10%, rgba(96,165,250,0.45), transparent 60%),
      radial-gradient(60% 60% at 0% 100%, rgba(30,58,138,0.9), transparent 70%),
      linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 55%, #2563eb 100%);
  }
  .evc-art::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px);
    background-size: 32px 32px;
    -webkit-mask-image: linear-gradient(to top, transparent 10%, #000 90%);
    mask-image: linear-gradient(to top, transparent 10%, #000 90%);
  }
  .evc-cat {
    position: relative; align-self: flex-start;
    padding: 0.3em 0.8em; border-radius: 999px;
    background: rgba(255,255,255,0.16); border: 1px solid rgba(255,255,255,0.28);
    font-size: clamp(0.65rem, 2.6cqi, 0.8rem); font-weight: 700;
  }
  .evc-day {
    position: relative; margin: 0;
    font-size: clamp(2.25rem, min(30cqi, 40cqh), 9rem); line-height: 0.85; font-weight: 800; letter-spacing: -0.05em;
    font-variant-numeric: tabular-nums;
  }
  .evc-month {
    position: relative;
    font-size: clamp(0.95rem, min(6cqi, 10cqh), 2rem); line-height: 1.1; font-weight: 700; letter-spacing: -0.02em;
  }
  .evc-meta { position: relative; font-size: clamp(0.7rem, 2.8cqi, 0.9rem); font-weight: 600; opacity: 0.85; }
  .evc--compact .evc-meta { display: none; }
`;

let injected = false;
const ensureStyles = () => {
  if (injected || typeof document === 'undefined') return;
  const el = document.createElement('style');
  el.dataset.evc = '';
  el.textContent = coverStyles;
  document.head.appendChild(el);
  injected = true;
};

const EventCover = ({ event, className = '', compact = false, style }) => {
  ensureStyles();
  const d = event.date ? new Date(event.date) : null;
  const day = d ? d.getDate() : '';
  const monthYear = d ? d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '';

  return (
    <div className={`evc ${compact ? 'evc--compact' : ''} ${className}`} style={style}>
      {isRealPhoto(event.image) ? (
        <img src={event.image} alt={event.title} loading="lazy" />
      ) : (
        <div className="evc-art" role="img" aria-label={event.title}>
          {event.category && <span className="evc-cat">{event.category}</span>}
          {d && <p className="evc-day">{day}</p>}
          {d && <span className="evc-month">{monthYear}</span>}
          {event.location && <span className="evc-meta">{event.location}</span>}
        </div>
      )}
    </div>
  );
};

export default EventCover;
