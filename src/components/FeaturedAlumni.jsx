import React from 'react';
import { motion } from 'framer-motion';

const FeaturedAlumni = () => {
  const placeholders = [1, 2, 3, 4];

  return (
    <section className="featured-alumni section-padding">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Alumni</h2>
            <p className="section-subtitle">Celebrating the achievements of our distinguished graduates.</p>
          </div>
          <button className="btn btn-outline desktop-only">View All Success Stories</button>
        </div>

        <div className="alumni-grid">
          {placeholders.map((item) => (
            <motion.div 
              key={item}
              className="alumni-card card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: item * 0.1 }}
            >
              <div className="alumni-photo-placeholder"></div>
              <div className="alumni-info">
                <div className="info-line name-placeholder"></div>
                <div className="info-line meta-placeholder"></div>
                <div className="info-line meta-placeholder secondary"></div>
                <div className="alumni-actions">
                  <div className="icon-placeholder"></div>
                  <div className="icon-placeholder"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mobile-only text-center mt-2">
           <button className="btn btn-outline">View All Success Stories</button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAlumni;
