import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Globe, MessageSquare, ChevronDown, MapPin, Briefcase, GraduationCap, X, ExternalLink, Star } from 'lucide-react';

const Directory = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const placeholders = [1, 2, 3, 4, 5, 6, 7, 8];
  const featured = [1, 2, 3];

  const filters = ['Batch Year', 'Department', 'Company', 'Country', 'Industry'];

  return (
    <div className="directory-page section-padding">
      <div className="container">
        {/* Header Section */}
        <div className="directory-header">
          <div>
            <span className="hero-badge">Global Network</span>
            <h1 className="hero-title" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Alumni Directory</h1>
            <p className="section-subtitle">Connecting generations of excellence across the globe.</p>
          </div>
          <div className="search-box glass" style={{ maxWidth: '400px' }}>
            <Search size={20} className="search-icon" />
            <input type="text" placeholder="Search by name, company..." />
          </div>
        </div>

        {/* Featured Section */}
        <div className="directory-featured">
          <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={20} fill="var(--primary)" color="var(--primary)" />
              Distinguished Mentors
            </h3>
            <button className="btn btn-outline btn-sm">Nominate Alumni</button>
          </div>
          <div className="featured-scroll">
            {featured.map((i) => (
              <div key={i} className="featured-item">
                <div className="featured-avatar"></div>
                <div>
                  <div className="placeholder-name" style={{ width: '120px', height: '1rem', marginBottom: '0.5rem' }}></div>
                  <div className="placeholder-tag">Distinguished Alumnus</div>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Senior VP at Tech Corp
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="directory-layout">
          <aside className="filters-sidebar floating desktop-only">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={18} />
              Refine Search
            </h3>
            {filters.map((filter) => (
              <div key={filter} className="filter-group">
                <div className="filter-label">
                  <span>{filter}</span>
                  <ChevronDown size={16} />
                </div>
              </div>
            ))}
            <button className="btn btn-primary w-full mt-4">Apply Filters</button>
            <button className="btn btn-outline w-full mt-2" style={{ border: 'none' }}>Clear All</button>
          </aside>

          <main className="directory-main">
            <div className="results-header">
              <span className="results-count">Showing <strong>12,450</strong> alumni globally</span>
              <div className="mobile-only">
                <button className="btn btn-outline btn-sm">
                  <Filter size={16} />
                  Filters
                </button>
              </div>
            </div>

            <div className="alumni-grid">
              {placeholders.map((i) => (
                <motion.div 
                  key={i} 
                  className="alumni-card card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedAlumni(i)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="alumni-card-top" style={{ marginBottom: '1.5rem' }}>
                    <div className="alumni-avatar-placeholder" style={{ borderRadius: '50%' }}></div>
                    <div className="alumni-meta-placeholder">
                      <div className="placeholder-name" style={{ marginBottom: '0.5rem' }}></div>
                      <div className="placeholder-tag">Class of 2024</div>
                    </div>
                  </div>
                  
                  <div className="alumni-card-details">
                    <div className="detail-item">
                      <GraduationCap size={16} />
                      <div className="placeholder-line" style={{ width: '100px' }}></div>
                    </div>
                    <div className="detail-item">
                      <Briefcase size={16} />
                      <div className="placeholder-line" style={{ width: '140px' }}></div>
                    </div>
                    <div className="detail-item">
                      <MapPin size={16} />
                      <div className="placeholder-line" style={{ width: '80px' }}></div>
                    </div>
                  </div>

                  <div className="alumni-card-footer">
                    <button className="btn btn-outline btn-sm">
                      <Globe size={16} />
                      Profile
                    </button>
                    <button className="btn btn-primary btn-sm">
                      <MessageSquare size={16} />
                      Message
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="load-more flex-center" style={{ marginTop: '4rem' }}>
              <button className="btn btn-outline btn-lg">Load More Alumni</button>
            </div>
          </main>
        </div>

        {/* Profile Modal */}
        <AnimatePresence>
          {selectedAlumni && (
            <div className="modal-overlay" onClick={() => setSelectedAlumni(null)}>
              <motion.div 
                className="profile-modal card"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className="modal-close" onClick={() => setSelectedAlumni(null)}>
                  <X size={24} />
                </button>

                <div className="modal-body">
                  <div className="modal-header">
                    <div className="large-avatar-placeholder" style={{ borderRadius: '50%' }}></div>
                    <div className="modal-meta">
                      <div className="placeholder-name lg"></div>
                      <div className="placeholder-line" style={{ width: '150px' }}></div>
                      <div className="modal-badges">
                        <span className="badge glass">Batch of ----</span>
                        <span className="badge glass">Engineering</span>
                      </div>
                    </div>
                  </div>

                  <div className="modal-sections">
                    <div className="modal-section">
                      <h3>Professional Experience</h3>
                      <div className="experience-item">
                        <div className="exp-icon"><Briefcase size={20} /></div>
                        <div className="exp-info">
                          <div className="placeholder-line" style={{ width: '180px' }}></div>
                          <div className="placeholder-line sm" style={{ width: '120px' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="modal-section">
                      <h3>Education</h3>
                      <div className="experience-item">
                        <div className="exp-icon"><GraduationCap size={20} /></div>
                        <div className="exp-info">
                          <div className="placeholder-line" style={{ width: '200px' }}></div>
                          <div className="placeholder-line sm" style={{ width: '100px' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button className="btn btn-primary w-full btn-lg">
                      View Full Profile on LinkedIn
                      <ExternalLink size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Directory;
