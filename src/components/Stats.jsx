import React from 'react';
import { motion } from 'framer-motion';

const Stats = () => {
  const stats = [
    { label: '', value: '' },
    { label: '', value: '' },
    { label: '', value: '' },
    { label: '', value: '' },
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="stat-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="stat-value-container">
                <div className="stat-value-placeholder animate-pulse"></div>
                <span className="stat-plus">+</span>
              </div>
              <div className="stat-label-placeholder"></div>
            </motion.div>
          ))}
        </div>

        <div className="world-map-container mt-4">
          <div className="map-header text-center">
            <h3>Our Global Footprint</h3>
            <p>Connecting alumni from every corner of the world.</p>
          </div>
          <div className="map-placeholder card glass">
             <div className="map-markers">
                <div className="marker marker-1"></div>
                <div className="marker marker-2"></div>
                <div className="marker marker-3"></div>
                <div className="marker marker-4"></div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
