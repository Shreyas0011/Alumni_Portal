import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Award, TrendingUp } from 'lucide-react';
import heroBg from '../assets/hero-bg.png';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-bg">
        <img src={heroBg} alt="Network Background" />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="container hero-container">
        <div className="hero-content">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="hero-badge">Connecting Generations of Excellence</span>
            <h1 className="hero-title">
              Reconnect. <span className="text-gradient">Inspire.</span> Grow.
            </h1>
            <p className="hero-subtitle">
              Welcome to the Alumni ecosystem. A lifelong professional network designed to empower our graduates through collaboration, mentorship, and shared success.
            </p>
            <div className="hero-btns">
              <button className="btn btn-primary btn-lg">
                Join Alumni Network
                <ArrowRight size={20} />
              </button>
              <button className="btn btn-outline btn-lg">
                Explore Alumni
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            className="hero-stats-preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="stat-pill glass">
              <Users size={20} />
              <span>Global Network</span>
            </div>
            <div className="stat-pill glass">
              <Award size={20} />
              <span>Distinguished Careers</span>
            </div>
            <div className="stat-pill glass">
              <TrendingUp size={20} />
              <span>Job Referrals</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
