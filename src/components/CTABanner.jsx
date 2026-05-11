import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, UserPlus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTABanner = () => (
  <section className="cta-banner">
    <div className="container">
      <motion.div className="cta-card"
        initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}>
        <div className="cta-content">
          <motion.div className="badge" style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', color:'#fff', marginBottom:'1.5rem', justifyContent:'center' }}
            initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
            <Sparkles size={11}/> Join for Free
          </motion.div>
          <h2 style={{ fontWeight:800 }}>Ready to reconnect with your alumni community?</h2>
          <p>Join 50,000+ Transcend graduates worldwide. Your next opportunity, mentor, or lifelong friend is already here.</p>
          <div className="cta-actions">
            <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
              <Link to="/register" className="btn btn-white"><UserPlus size={16}/> Create Account</Link>
            </motion.div>
            <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
              <Link to="/directory" className="btn" style={{ border:'2px solid rgba(255,255,255,0.35)', color:'#fff', background:'transparent', fontWeight:700 }}>
                Browse Alumni <ArrowRight size={16}/>
              </Link>
            </motion.div>
          </div>
          {/* Trust note */}
          <p style={{ marginTop:'2rem', fontSize:'0.78rem', color:'rgba(255,255,255,0.5)', marginBottom:0 }}>
            Free to join · No credit card required · Verified alumni only
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CTABanner;
