import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, Check, CreditCard } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import useRazorpay from '../hooks/useRazorpay';
import EventCover from '../components/EventCover';
import { isRealPhoto } from '../lib/eventImage';

const Events = () => {
  const { events, registerForEvent, unregisterFromEvent } = useData();
  const openRazorpay = useRazorpay();
  const { user } = useAuth();
  const [toast, setToast] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(events.map(e => e.category))];

  const filteredEvents = activeCategory === 'All'
    ? events
    : events.filter(e => e.category === activeCategory);

  const featuredEvent = events.find(e => e.featured);

  const formatDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleRegister = (event) => {
    const alreadyRegistered = event.registrations?.some(r => r.userId === (user?.id || 'guest'));
    if (alreadyRegistered) return;

    if (event.fee > 0) {
      openRazorpay({
        amount: event.fee,
        eventTitle: event.title,
        description: `Registration for ${event.title}`,
        user,
        onSuccess: () => {
          registerForEvent(event.id, user?.id || 'guest', user?.name || 'Guest');
          setToast(`Payment successful! Registered for ${event.title} 🎉`);
          setTimeout(() => setToast(null), 4000);
        },
        onFailure: (msg) => {
          setToast(`Payment failed: ${msg}`);
          setTimeout(() => setToast(null), 4000);
        },
      });
    } else {
      registerForEvent(event.id, user?.id || 'guest', user?.name || 'Guest');
      setToast(`Registered for ${event.title}!`);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleUnregister = (event) => {
    unregisterFromEvent(event.id, user?.id || 'guest');
    setToast(`Unregistered from ${event.title}`);
    setTimeout(() => setToast(null), 3000);
  };

  const isRegistered = (event) =>
    event.registrations?.some(r => r.userId === (user?.id || 'guest'));

  return (
    <div style={{ background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)', minHeight: '100vh', paddingBottom: '5rem' }}>
      <style>{`
        .ev-featured { display: grid; grid-template-columns: 1.2fr 1fr; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.8); margin-bottom: 3rem; }
        .ev-featured-img { width: 100%; height: 100%; min-height: 380px; }
        .ev-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr)); gap: 2rem; }
        .ev-card { background: white; border-radius: 20px; overflow: hidden; border: 1px solid var(--border); display: flex; flex-direction: column; transition: all 0.35s ease; }
        .ev-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(37,99,235,0.1); border-color: var(--blue-200); }
        .ev-card-img { position: relative; height: 190px; overflow: hidden; }
        .ev-card-img .evc > img, .ev-card-img .evc-art { transition: transform 0.5s ease; }
                .ev-card:hover .ev-card-img .evc > img, .ev-card:hover .ev-card-img .evc-art { transform: scale(1.05); }
        .date-chip { position: absolute; top: 1rem; left: 1rem; background: white; padding: 0.4rem 0.85rem; border-radius: 10px; font-size: 0.78rem; font-weight: 800; color: var(--blue-700); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .cat-badge { position: absolute; top: 1rem; right: 1rem; background: var(--blue-700); color: white; padding: 0.35rem 0.9rem; border-radius: 99px; font-size: 0.72rem; font-weight: 700; }
        .ev-body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
        .filter-bar { display: flex; gap: 0.6rem; overflow-x: auto; padding-bottom: 2rem; scrollbar-width: none; }
        .filter-btn { padding: 0.55rem 1.15rem; border-radius: 99px; border: 1px solid var(--border); background: white; color: var(--text-muted); font-weight: 600; font-size: 0.875rem; white-space: nowrap; cursor: pointer; transition: 0.25s; }
        .filter-btn:hover { border-color: var(--blue-400); color: var(--blue-700); }
        .filter-btn.active { background: var(--blue-700); color: white; border-color: var(--blue-700); box-shadow: 0 4px 12px rgba(37,99,235,0.25); }
        .reg-btn { width: 100%; padding: 0.8rem; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 0.6rem; font-weight: 700; font-size: 0.875rem; border: none; cursor: pointer; transition: 0.25s; }
        .reg-btn.primary { background: var(--blue-700); color: white; }
        .reg-btn.primary:hover { background: var(--blue-800); }
        .reg-btn.done { background: #f0fdf4; color: #059669; cursor: default; }
        @media (max-width: 900px) { .ev-featured { grid-template-columns: 1fr; } .ev-featured-img { min-height: 0; aspect-ratio: 16 / 9; } .ev-featured-body { padding: 1.75rem !important; } .ev-featured-body h2 { font-size: 1.5rem !important; } }
        @media (max-width: 400px) { .ev-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }}
            style={{ position: 'fixed', top: '2rem', left: '50%', transform: 'translateX(-50%)', background: 'white', border: '1px solid var(--blue-100)', padding: '0.875rem 2rem', borderRadius: '16px', zIndex: 2000, color: 'var(--blue-700)', fontWeight: '700', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <Check size={18} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container">
        {/* Header */}
        <header style={{ padding: '5rem 0 3rem' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--blue-700)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>
              <Sparkles size={15} /> Commerce Events Portal
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-1.5px' }}>
              Upcoming Events
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '520px', lineHeight: 1.7 }}>
              Summits, workshops, reunions, and networking nights — all crafted for the Transcend Commerce alumni network.
            </p>
          </motion.div>
        </header>

        {/* Featured Event */}
        {featuredEvent && (
          <motion.div className="ev-featured" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
            <EventCover event={featuredEvent} className="ev-featured-img" />
            <div className="ev-featured-body" style={{ padding: '3rem', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span className="badge" style={{ alignSelf: 'flex-start', marginBottom: '1.25rem' }}>Featured Event</span>
              <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1.25rem', lineHeight: 1.15 }}>{featuredEvent.title}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <Calendar size={16} style={{ color: 'var(--blue-500)' }} /> {formatDate(featuredEvent.date)} · {featuredEvent.time}
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <MapPin size={16} style={{ color: 'var(--blue-500)' }} /> {featuredEvent.location}
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>{featuredEvent.description}</p>
              {isRegistered(featuredEvent) ? (
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: '700', fontSize: '0.9rem' }}>
                    <Check size={18} /> Registered
                  </div>
                  <button
                    className="reg-btn"
                    style={{ maxWidth: '160px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
                    onClick={() => handleUnregister(featuredEvent)}
                  >
                    Unregister
                  </button>
                </div>
              ) : (
                <button
                  className="reg-btn primary"
                  style={{ maxWidth: '260px' }}
                  onClick={() => handleRegister(featuredEvent)}
                >
                  {featuredEvent.fee > 0
                    ? <><CreditCard size={18} /> Register & Pay ₹{featuredEvent.fee}</>
                    : <>Reserve Spot <ArrowRight size={18} /></>}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Filter Bar */}
        <div className="filter-bar">
          {categories.map(cat => (
            <button key={cat} className={`filter-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="ev-grid">
          {filteredEvents.filter(e => !e.featured).map((event, i) => (
            <motion.div
              key={event.id}
              className="ev-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="ev-card-img">
                <EventCover event={event} compact />
                {isRealPhoto(event.image) && (
                  <>
                    <div className="date-chip">{formatDate(event.date)}</div>
                    <div className="cat-badge">{event.category}</div>
                  </>
                )}
              </div>
              <div className="ev-body">
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.75rem', lineHeight: 1.25 }}>{event.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    <Clock size={13} style={{ color: 'var(--blue-500)' }} /> {event.time}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    <MapPin size={13} style={{ color: 'var(--blue-500)' }} /> {event.location}
                  </div>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, flex: 1, marginBottom: '1.5rem' }}>{event.description}</p>
                {isRegistered(event) ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontWeight: '700', fontSize: '0.85rem' }}>
                      <Check size={15} /> Registered
                    </div>
                    <button
                      className="reg-btn"
                      style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '0.8rem' }}
                      onClick={() => handleUnregister(event)}
                    >
                      Unregister
                    </button>
                  </div>
                ) : (
                  <button
                    className="reg-btn primary"
                    onClick={() => handleRegister(event)}
                  >
                    {event.fee > 0
                      ? <><CreditCard size={16} /> Register & Pay ₹{event.fee}</>
                      : <>Register Free <ArrowRight size={16} /></>}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)' }}>
            No events found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
