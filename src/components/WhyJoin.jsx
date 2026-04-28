import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Search, Globe } from 'lucide-react';

const WhyJoin = () => {
  const features = [
    {
      title: 'Career Networking',
      desc: 'Connect with industry leaders and fellow alumni to accelerate your professional growth.',
      icon: <Briefcase size={32} />
    },
    {
      title: 'Mentorship Opportunities',
      desc: 'Guide the next generation or find a mentor to help navigate your career path.',
      icon: <Users size={32} />
    },
    {
      title: 'Job Referrals',
      desc: 'Access exclusive job opportunities and leverage the power of internal referrals.',
      icon: <Search size={32} />
    },
    {
      title: 'Community & Events',
      desc: 'Join local chapters and stay updated with global alumni gatherings and workshops.',
      icon: <Globe size={32} />
    }
  ];

  return (
    <section className="why-join section-padding">
      <div className="container">
        <div className="section-header text-center">
          <h2 className="section-title">Why Join Our Network?</h2>
          <p className="section-subtitle">Discover the benefits of staying connected with your alma mater.</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="card feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoin;
