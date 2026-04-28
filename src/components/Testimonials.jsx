import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const placeholders = [0, 1, 2];

  const next = () => setCurrent((prev) => (prev + 1) % placeholders.length);
  const prev = () => setCurrent((prev) => (prev - 1 + placeholders.length) % placeholders.length);

  return (
    <section className="testimonials section-padding bg-surface">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Alumni Stories</h2>
          <p className="section-subtitle">Hear from our global community about their journey and impact.</p>
        </div>

        <div className="testimonial-carousel">
          <button className="carousel-btn prev" onClick={prev}><ChevronLeft /></button>
          
          <div className="testimonial-wrapper">
            <AnimatePresence mode="wait">
              <motion.div 
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="testimonial-card card"
              >
                <Quote className="quote-icon" size={48} />
                <div className="testimonial-content">
                  <div className="text-placeholder-long"></div>
                  <div className="text-placeholder-long"></div>
                  <div className="text-placeholder-medium"></div>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar-placeholder"></div>
                  <div className="author-info">
                    <div className="author-name-placeholder"></div>
                    <div className="author-meta-placeholder"></div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button className="carousel-btn next" onClick={next}><ChevronRight /></button>
        </div>

        <div className="carousel-dots">
          {placeholders.map((_, i) => (
            <button 
              key={i} 
              className={`dot ${current === i ? 'active' : ''}`}
              onClick={() => setCurrent(i)}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
