import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, Check, Globe, Users } from 'lucide-react';
import './Events.css';

const Events = () => {
  const [registeredEvents, setRegisteredEvents] = useState({});
  const [toast, setToast] = useState(null);

  const eventsList = [
    {
      id: 1,
      title: "Global Alumni Tech Summit 2026",
      date: "MAY 15",
      time: "10:00 AM - 4:00 PM",
      location: "San Francisco / Virtual",
      category: "Summit",
      image: "/events/tech_summit.png",
      desc: "Join top industry leaders for a day of networking, innovation, and career insights.",
      host: "Alumni Tech Council"
    },
    {
      id: 2,
      title: "Homecoming Weekend & Gala Dinner",
      date: "JUNE 12",
      time: "6:30 PM Onwards",
      location: "Main Campus Great Hall",
      category: "Reunion",
      image: "/events/gala_dinner.png",
      desc: "Celebrate 50 years of excellence with a grand gala dinner and departmental tours.",
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
      desc: "An exclusive retreat for C-suite alumni to discuss global leadership trends.",
      host: "Executive Board"
    },
    {
      id: 4,
      title: "Design Thinking Workshop",
      date: "JULY 05",
      time: "2:00 PM - 5:00 PM",
      location: "Virtual Workshop",
      category: "Workshop",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
      desc: "Master the art of user-centric design in this hands-on workshop led by design veterans.",
      host: "Creative Arts Guild"
    },
    {
      id: 5,
      title: "Alumni Startup Pitch Night",
      date: "AUG 18",
      time: "5:00 PM - 8:00 PM",
      location: "New York Hub",
      category: "Networking",
      image: "https://images.unsplash.com/photo-1475721027187-402ad2989a3b?auto=format&fit=crop&q=80&w=800",
      desc: "Watch our brightest alumni entrepreneurs pitch to top-tier VC firms.",
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
      desc: "Explore how artificial intelligence is revolutionizing modern healthcare practices.",
      host: "Health Science Dept"
    }
  ];

  const handleRegister = (eventId, title) => {
    setRegisteredEvents(prev => ({ ...prev, [eventId]: true }));
    setToast(`Successfully registered for ${title}`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="events-page">
      {/* Background Decorations */}
      <div className="bg-decorations" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.4 }}>
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, var(--blue-100) 0%, transparent 70%)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--blue-50) 0%, transparent 70%)', borderRadius: '50%' }}></div>
      </div>

      <div className="container">
        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div 
              className="glass"
              style={{ 
                position: 'fixed', top: '2rem', left: '50%', transform: 'translateX(-50%)', 
                padding: '1rem 2rem', borderRadius: 'var(--radius-lg)', zIndex: 2000,
                display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid var(--blue-200)',
                color: 'var(--blue-700)', fontWeight: '700', boxShadow: var(--shadow-lg)
              }}
              initial={{ y: -100, x: '-50%', opacity: 0 }}
              animate={{ y: 0, x: '-50%', opacity: 1 }}
              exit={{ y: -100, x: '-50%', opacity: 0 }}
            >
              <Check size={20} />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="events-header-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge"><Sparkles size={14} /> Premium Experiences</span>
            <h1 className="hero-title" style={{ marginTop: '1rem' }}>Alumni Events Portal</h1>
            <p className="section-subtitle" style={{ margin: '1rem auto 0' }}>
              Connect with fellow graduates, industry experts, and current students at our exclusive global gatherings.
            </p>
          </motion.div>
        </header>

        {/* Events Grid */}
        <div className="events-grid">
          {eventsList.map((event, index) => (
            <motion.div 
              key={event.id} 
              className="event-card-new"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="event-image-wrapper">
                <img src={event.image} alt={event.title} />
                <div className="event-date-overlay">
                  <span className="month">{event.date.split(' ')[0]}</span>
                  <span className="day">{event.date.split(' ')[1]}</span>
                </div>
                <div className="event-category-tag">{event.category}</div>
              </div>
              
              <div className="event-body-new">
                <h2 className="event-title-new">{event.title}</h2>
                
                <div className="event-info-list">
                  <div className="event-info-item">
                    <Clock size={16} />
                    <span>{event.time}</span>
                  </div>
                  <div className="event-info-item">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                  <div className="event-info-item">
                    <Users size={16} />
                    <span>{event.host}</span>
                  </div>
                </div>

                <p className="event-desc-new">
                  {event.desc}
                </p>

                <div className="event-footer-new">
                  {registeredEvents[event.id] ? (
                    <div className="btn-rsvp-new registered">
                      <Check size={18} />
                      Registered
                    </div>
                  ) : (
                    <button 
                      className="btn-rsvp-new primary"
                      onClick={() => handleRegister(event.id, event.title)}
                    >
                      Reserve My Spot
                      <ArrowRight size={18} />
                    </button>
                  )}
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

