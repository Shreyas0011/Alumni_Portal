import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';

const Events = () => {
  const placeholders = [1, 2, 3, 4, 5, 6];

  return (
    <div className="events-page section-padding">
      <div className="container">
        <div className="section-header">
          <div>
            <h1 className="section-title">Alumni Events</h1>
            <p className="section-subtitle">Reconnect and celebrate through our upcoming gatherings.</p>
          </div>
          <div className="event-tabs desktop-only">
            <button className="tab active">Upcoming</button>
            <button className="tab">Past Events</button>
            <button className="tab">My Registrations</button>
          </div>
        </div>

        <div className="events-grid">
          {placeholders.map((i) => (
            <motion.div 
              key={i} 
              className="event-card card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="event-image-placeholder">
                <div className="event-date-badge glass">
                  <span className="month-placeholder"></span>
                  <span className="day-placeholder"></span>
                </div>
              </div>
              
              <div className="event-content">
                <div className="title-placeholder"></div>
                <div className="meta-info">
                  <div className="meta-item">
                    <Calendar size={14} />
                    <div className="placeholder-line w-40"></div>
                  </div>
                  <div className="meta-item">
                    <Clock size={14} />
                    <div className="placeholder-line w-30"></div>
                  </div>
                  <div className="meta-item">
                    <MapPin size={14} />
                    <div className="placeholder-line w-50"></div>
                  </div>
                </div>
                <div className="desc-placeholder"></div>
                <div className="desc-placeholder w-80"></div>
                
                <button className="btn btn-primary btn-sm w-full mt-2">
                  Register Now
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
