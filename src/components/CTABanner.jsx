import React from 'react';
import { motion } from 'framer-motion';

const CTABanner = () => {
  return (
    <section className="cta-banner">
      <div className="container">
        <motion.div 
          className="cta-card glass"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="cta-content">
            <h2>Become a part of our growing legacy</h2>
            <p>Join thousands of alumni who are making a difference across the globe.</p>
            <div className="cta-actions">
              <button className="btn btn-primary btn-lg">Register Now</button>
              <button className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>Learn More</button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABanner;
