import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, Sparkles, Check, Bell, BellOff, Globe } from 'lucide-react';

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
      desc: "Celebrate 50 years of excellence with a grand gala dinner and departmental tours.",
      host: "University Events"
    },
    {
      id: 3,
      title: "Design Thinking Workshop",
      date: "JULY 05",
      time: "2:00 PM - 5:00 PM",
      location: "Virtual Workshop",
      category: "Workshop",
      desc: "Master the art of user-centric design in this hands-on workshop led by design veterans.",
      host: "Creative Arts Guild"
    },
    {
      id: 4,
      title: "Alumni Startup Pitch Night",
      date: "AUG 18",
      time: "5:00 PM - 8:00 PM",
      location: "New York Hub",
      category: "Networking",
      desc: "Watch our brightest alumni entrepreneurs pitch to top-tier VC firms.",
      host: "Entrepreneurship Lab"
    },
    {
      id: 5,
      title: "AI in Healthcare Webinar",
      date: "SEPT 22",
      time: "11:00 AM - 12:30 PM",
      location: "Global Broadcast",
      category: "Webinar",
      desc: "Explore how artificial intelligence is revolutionizing modern healthcare practices.",
      host: "Health Science Dept"
    },
    {
      id: 6,
      title: "Executive Leadership Retreat",
      date: "OCT 10",
      time: "Weekend Stay",
      location: "Lake Como, Italy",
      category: "Retreat",
      desc: "An exclusive retreat for C-suite alumni to discuss global leadership trends.",
      host: "Executive Board"
    }
  ];

  const handleRegister = (eventId, title) => {
    setRegisteredEvents(prev => ({ ...prev, [eventId]: true }));
    setToast(`Successfully registered for ${title.split(' ')[0]}...`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="events-page">
      {/* Immersive Background Shapes */}
      <motion.div 
        className="bg-shape bg-shape-1"
        style={{ background: 'var(--primary)', opacity: 0.05 }}
        animate={{ 
          x: [0, 100, 0], 
          y: [0, 50, 0],
          scale: [1, 1.2, 1] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="bg-shape bg-shape-2"
        style={{ background: 'var(--secondary)', opacity: 0.05 }}
        animate={{ 
          x: [0, -80, 0], 
          y: [0, 100, 0],
          scale: [1, 1.3, 1] 
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container directory-container">
        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div 
              className="connection-success-toast"
              style={{ background: '#10b981', color: 'white', border: 'none' }}
              initial={{ y: -100, x: '-50%', opacity: 0 }}
              animate={{ y: 0, x: '-50%', opacity: 1 }}
              exit={{ y: -100, x: '-50%', opacity: 0 }}
            >
              <Check size={24} />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <header className="directory-header">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-badge"><Sparkles size={16} /> Premium Experiences</span>
            <h1 className="hero-title">Upcoming Events</h1>
            <p className="section-subtitle">
              Celebrate, reconnect, and grow with our curated selection of alumni gatherings. From global summits to intimate workshops.
            </p>
          </motion.div>
        </header>

        {/* Events Grid */}
        <div className="alumni-grid">
          {eventsList.map((event, index) => (
            <motion.div 
              key={event.id} 
              className="event-card premium"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 1, ease: "easeOut" }}
            >
              <div className="event-image-container">
                <div className="event-date-badge-premium">
                  <span className="month">{event.date.split(' ')[0]}</span>
                  <span className="day">{event.date.split(' ')[1]}</span>
                </div>
                {/* Decorative Pattern / Abstract Mesh for Image Placeholder */}
                <div style={{ width: '100%', height: '100%', background: `linear-gradient(${45 + index * 30}deg, #f1f5f9 0%, #e2e8f0 100%)`, opacity: 0.8 }}></div>
              </div>
              
              <div className="event-content-premium">
                <div className="event-header-group">
                  <span className="event-category-chip">{event.category}</span>
                  <h2 className="event-title-premium">{event.title}</h2>
                </div>

                <div className="event-meta-group">
                  <div className="event-meta-item">
                    <Clock size={20} />
                    <span>{event.time}</span>
                  </div>
                  <div className="event-meta-item">
                    <MapPin size={20} />
                    <span>{event.location}</span>
                  </div>
                  <div className="event-meta-item">
                    <Globe size={20} />
                    <span>Host: {event.host}</span>
                  </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
                  {event.desc}
                </p>

                <div className="event-footer-premium">
                  {registeredEvents[event.id] ? (
                    <button className="btn-rsvp registered w-full">
                      <Check size={20} />
                      Registered
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary btn-rsvp w-full"
                      onClick={() => handleRegister(event.id, event.title)}
                    >
                      Reserve My Spot
                      <ArrowRight size={20} />
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
