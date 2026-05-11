import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, Check, Globe, Users, Filter, Search } from 'lucide-react';

const Events = () => {
  const [registeredEvents, setRegisteredEvents] = useState({});
  const [toast, setToast] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Summit', 'Reunion', 'Workshop', 'Networking', 'Webinar', 'Retreat'];

  const eventsList = [
    {
      id: 1,
      title: "Global Alumni Tech Summit 2026",
      date: "MAY 15",
      time: "10:00 AM - 4:00 PM",
      location: "San Francisco / Virtual",
      category: "Summit",
      image: "/events/tech_summit.png",
      desc: "Join top industry leaders for a day of networking, innovation, and career insights. Featuring keynotes from Silicon Valley pioneers and interactive breakout sessions.",
      host: "Alumni Tech Council",
      featured: true
    },
    {
      id: 2,
      title: "Homecoming Weekend & Gala Dinner",
      date: "JUNE 12",
      time: "6:30 PM Onwards",
      location: "Main Campus Great Hall",
      category: "Reunion",
      image: "/events/gala_dinner.png",
      desc: "Celebrate 50 years of excellence with a grand gala dinner, departmental tours, and a special performance by the alumni orchestra.",
      host: "University Events"
    },
    {
      id: 3,
      title: "Executive Leadership Retreat",
      date: "OCT 10",
      time: "Weekend Stay",
      location: "Lake Como, Italy",
      category: "Retreat",
      image: "/events/leadership_retreat.png",
      desc: "An exclusive retreat for C-suite alumni to discuss global leadership trends in an intimate, luxury setting.",
      host: "Executive Board"
    },
    {
      id: 4,
      title: "Design Thinking Workshop",
      date: "JULY 05",
      time: "2:00 PM - 5:00 PM",
      location: "Virtual Workshop",
      category: "Workshop",
      image: "/events/workshop.png",
      desc: "Master the art of user-centric design in this hands-on workshop led by design veterans from top global agencies.",
      host: "Creative Arts Guild"
    },
    {
      id: 5,
      title: "Alumni Startup Pitch Night",
      date: "AUG 18",
      time: "5:00 PM - 8:00 PM",
      location: "New York Hub",
      category: "Networking",
      image: "/events/networking.png",
      desc: "Watch our brightest alumni entrepreneurs pitch to top-tier VC firms. Networking reception to follow.",
      host: "Entrepreneurship Lab"
    },
    {
      id: 6,
      title: "AI in Healthcare Webinar",
      date: "SEPT 22",
      time: "11:00 AM - 12:30 PM",
      location: "Global Broadcast",
      category: "Webinar",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
      desc: "Explore how artificial intelligence is revolutionizing modern healthcare practices in this expert-led webinar.",
      host: "Health Science Dept"
    }
  ];

  const filteredEvents = activeCategory === 'All' 
    ? eventsList 
    : eventsList.filter(e => e.category === activeCategory);

  const handleRegister = (eventId, title) => {
    setRegisteredEvents(prev => ({ ...prev, [eventId]: true }));
    setToast(`Successfully registered for ${title}`);
    setTimeout(() => setToast(null), 3000);
  };

  const featuredEvent = eventsList.find(e => e.featured);

  return (
    <div className="events-page-v2" style={{ 
      background: 'linear-gradient(180deg, #f8fafc 0%, #eff6ff 100%)',
      minHeight: '100vh',
      paddingBottom: '5rem'
    }}>
      <style>{`
        .events-page-v2 { font-family: var(--font); }
        .events-hero { padding: 5rem 0 3rem; position: relative; }
        .featured-card { 
          display: grid; 
          grid-template-columns: 1.2fr 1fr; 
          background: white; 
          border-radius: 24px; 
          overflow: hidden; 
          box-shadow: 0 20px 50px rgba(0,0,0,0.08);
          border: 1px solid rgba(255,255,255,0.8);
          margin-bottom: 4rem;
        }
        .featured-img { width: 100%; height: 100%; object-fit: cover; min-height: 400px; }
        .featured-content { padding: 3rem; display: flex; flex-direction: column; justify-content: center; }
        
        .events-grid-v2 { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); 
          gap: 2.5rem; 
        }
        .event-card-v2 {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
        }
        .event-card-v2:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(37,99,235,0.1);
          border-color: var(--blue-200);
        }
        .card-img-container { position: relative; height: 200px; overflow: hidden; }
        .card-img-container img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .event-card-v2:hover .card-img-container img { transform: scale(1.1); }
        
        .date-chip {
          position: absolute; top: 1.25rem; left: 1.25rem;
          background: white; padding: 0.5rem 1rem; border-radius: 12px;
          text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .date-chip .mo { display: block; font-size: 0.7rem; font-weight: 800; color: var(--blue-700); }
        .date-chip .da { display: block; font-size: 1.2rem; font-weight: 800; color: var(--text-main); }
        
        .category-badge {
          position: absolute; top: 1.25rem; right: 1.25rem;
          background: var(--blue-700); color: white; padding: 0.4rem 1rem;
          border-radius: 99px; font-size: 0.75rem; font-weight: 700;
        }
        
        .card-body-v2 { padding: 1.75rem; flex: 1; display: flex; flex-direction: column; }
        .event-title-v2 { font-size: 1.4rem; font-weight: 800; margin-bottom: 1rem; line-height: 1.2; }
        .meta-list { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem; }
        .meta-item { display: flex; align-items: center; gap: 0.75rem; color: var(--text-muted); font-size: 0.9rem; font-weight: 500; }
        .meta-item svg { color: var(--blue-500); }
        
        .filter-bar { 
          display: flex; gap: 0.75rem; overflow-x: auto; padding: 0.5rem 0 2.5rem;
          scrollbar-width: none;
        }
        .filter-btn {
          padding: 0.6rem 1.25rem; border-radius: 99px; border: 1px solid var(--border);
          background: white; color: var(--text-muted); font-weight: 600; font-size: 0.9rem;
          white-space: nowrap; transition: 0.3s;
        }
        .filter-btn.active {
          background: var(--blue-700); color: white; border-color: var(--blue-700);
          box-shadow: 0 4px 12px rgba(37,99,235,0.3);
        }
        
        .btn-reserve {
          width: 100%; padding: 0.875rem; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          font-weight: 700; transition: 0.3s;
        }
        .btn-reserve.active { background: var(--blue-700); color: white; }
        .btn-reserve.active:hover { background: var(--blue-800); transform: scale(1.02); }
        .btn-reserve.registered { background: var(--blue-50); color: var(--blue-700); cursor: default; }

        @media (max-width: 992px) {
          .featured-card { grid-template-columns: 1fr; }
          .featured-img { height: 250px; }
        }
      `}</style>

      <div className="container">
        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div 
              style={{ 
                position: 'fixed', top: '2rem', left: '50%', transform: 'translateX(-50%)', 
                padding: '1rem 2rem', borderRadius: '16px', zIndex: 2000,
                background: 'white', border: '1px solid var(--blue-100)',
                color: 'var(--blue-700)', fontWeight: '700', boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                display: 'flex', alignItems: 'center', gap: '0.75rem'
              }}
              initial={{ y: -100, x: '-50%', opacity: 0 }}
              animate={{ y: 0, x: '-50%', opacity: 1 }}
              exit={{ y: -100, x: '-50%', opacity: 0 }}
            >
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={18} />
              </div>
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Header */}
        <header className="events-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--blue-700)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
              <Sparkles size={16} /> Premium Events Portal
            </div>
            <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem' }}>Shape the Future <br/> Together</h1>
            <p className="hero-subtitle" style={{ fontSize: '1.1rem', maxWidth: '600px', marginBottom: '0' }}>
              Reconnect with your community through curated experiences designed for networking, growth, and lifelong learning.
            </p>
          </motion.div>
        </header>

        {/* Featured Section */}
        {featuredEvent && (
          <motion.div 
            className="featured-card"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <img src={featuredEvent.image} alt={featuredEvent.title} className="featured-img" />
            <div className="featured-content">
              <span className="badge" style={{ alignSelf: 'flex-start', marginBottom: '1.5rem' }}>Upcoming Highlight</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>{featuredEvent.title}</h2>
              <div className="meta-list">
                <div className="meta-item" style={{ fontSize: '1rem' }}><Calendar size={20} /> <span>{featuredEvent.date} · {featuredEvent.time}</span></div>
                <div className="meta-item" style={{ fontSize: '1rem' }}><MapPin size={20} /> <span>{featuredEvent.location}</span></div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                {featuredEvent.desc}
              </p>
              <button 
                className={`btn-reserve ${registeredEvents[featuredEvent.id] ? 'registered' : 'active'}`}
                onClick={() => !registeredEvents[featuredEvent.id] && handleRegister(featuredEvent.id, featuredEvent.title)}
                style={{ maxWidth: '300px' }}
              >
                {registeredEvents[featuredEvent.id] ? <><Check size={20}/> Registered</> : <>Reserve My Spot <ArrowRight size={20}/></>}
              </button>
            </div>
          </motion.div>
        )}

        {/* Filter Bar */}
        <div className="filter-bar">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="events-grid-v2">
          {filteredEvents.filter(e => !e.featured).map((event, index) => (
            <motion.div 
              key={event.id} 
              className="event-card-v2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="card-img-container">
                <img src={event.image} alt={event.title} />
                <div className="date-chip">
                  <span className="mo">{event.date.split(' ')[0]}</span>
                  <span className="da">{event.date.split(' ')[1]}</span>
                </div>
                <div className="category-badge">{event.category}</div>
              </div>
              
              <div className="card-body-v2">
                <h3 className="event-title-v2">{event.title}</h3>
                
                <div className="meta-list" style={{ marginBottom: '1rem' }}>
                  <div className="meta-item"><Clock size={16} /> <span>{event.time}</span></div>
                  <div className="meta-item"><MapPin size={16} /> <span>{event.location}</span></div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                  {event.desc}
                </p>

                <div style={{ marginTop: 'auto' }}>
                  <button 
                    className={`btn-reserve ${registeredEvents[event.id] ? 'registered' : 'active'}`}
                    onClick={() => !registeredEvents[event.id] && handleRegister(event.id, event.title)}
                  >
                    {registeredEvents[event.id] ? <><Check size={18}/> Registered</> : <>View Details <ArrowRight size={18}/></>}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
