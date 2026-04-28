import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Users, Send, GraduationCap } from 'lucide-react';

const Mentorship = () => {
  const services = [
    { title: 'Career Guidance', icon: <GraduationCap size={24} />, desc: 'One-on-one sessions with industry veterans.' },
    { title: 'Resume Reviews', icon: <FileText size={24} />, desc: 'Get professional feedback on your CV and portfolio.' },
    { title: 'Mock Interviews', icon: <Users size={24} />, desc: 'Practice and refine your interview techniques.' },
    { title: 'Higher Studies', icon: <BookOpen size={24} />, desc: 'Guidance on choosing the right global universities.' },
  ];

  return (
    <div className="mentorship-page section-padding">
      <div className="container">
        <div className="section-header text-center">
          <h1 className="section-title">Mentorship Program</h1>
          <p className="section-subtitle">Bridging the gap between students and seasoned professionals.</p>
        </div>

        <div className="services-grid">
          {services.map((service, i) => (
            <motion.div 
              key={i} 
              className="service-card card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mentorship-split">
          <div className="mentorship-info">
            <h2>Find Your Mentor</h2>
            <p>Our mentorship ecosystem allows students to connect with alumni based on their career interests, industry, and goals. Whether you're looking for technical advice or leadership guidance, our network is here to help.</p>
            <ul className="benefits-list">
              <li><div className="dot"></div> Over 500+ active mentors</li>
              <li><div className="dot"></div> Multiple industries covered</li>
              <li><div className="dot"></div> Flexible scheduling</li>
              <li><div className="dot"></div> Lifelong professional bonds</li>
            </ul>
          </div>

          <div className="mentorship-form-container card">
            <h3>Request Mentorship</h3>
            <form className="mentorship-form">
              <div className="form-group">
                <label>Student Name</label>
                <input type="text" placeholder="Your Name" />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input type="text" placeholder="Computer Science" />
              </div>
              <div className="form-group">
                <label>Topic Needed</label>
                <select>
                  <option>Select Topic</option>
                  <option>Career Guidance</option>
                  <option>Resume Review</option>
                  <option>Mock Interview</option>
                </select>
              </div>
              <div className="form-group">
                <label>Preferred Industry</label>
                <input type="text" placeholder="Tech, Finance, etc." />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows={4} placeholder="Describe what you're looking for..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Submit Request
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentorship;
