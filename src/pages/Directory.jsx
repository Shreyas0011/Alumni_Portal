import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Globe, MessageSquare, ChevronDown, MapPin, Briefcase, GraduationCap, X, UserPlus, Check, Send, Sparkles, Smile, Paperclip, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';

// Procedurally generate 10,000 commerce-specific profiles for testing scalability
const generateAlumniDataset = () => {
  const names = ['Sarah', 'David', 'Marcus', 'Elena', 'James', 'Priya', 'Amit', 'Ananya', 'Rohan', 'Sneha', 'Vikram', 'Meera', 'Arjun', 'Neha', 'Kabir', 'Tanvi'];
  const lastNames = ['Jenkins', 'Chen', 'Thorne', 'Rodriguez', 'Wilson', 'Sharma', 'Patel', 'Goel', 'Mehta', 'Reddy', 'Singh', 'Desai', 'Kapoor', 'Gupta', 'Iyer', 'Joshi'];
  const roles = ['Senior M&A Associate', 'Partner', 'Financial Analyst', 'Chief Financial Officer', 'Senior Tax Consultant', 'Investment Analyst', 'Equity Research VP', 'Treasury Manager', 'Portfolio Analyst', 'Auditor', 'Chartered Accountant'];
  const companies = ['Goldman Sachs', 'Deloitte', 'JP Morgan Chase', 'Unilever', 'EY', 'Blackstone Group', 'PwC', 'KPMG', 'Morgan Stanley', 'Citi Group', 'HDFC Bank', 'HSBC'];
  const depts = ['Investment Banking', 'Audit & Assurance', 'Corporate Finance', 'Executive Management', 'Taxation', 'Wealth Management', 'Treasury Operations', 'Risk Advisory'];
  const locations = ['London, UK', 'Singapore', 'Mumbai, India', 'New York, NY', 'Toronto, Canada', 'Bangalore, India', 'Sydney, Australia', 'Dubai, UAE', 'Tokyo, Japan'];

  const dataset = [];
  
  // Seed the original 6 profiles first
  const baseAlumni = [
    { id: 1, name: 'Sarah Jenkins', role: 'Senior M&A Associate', company: 'Goldman Sachs', initials: 'SJ', dept: 'Investment Banking', location: 'London, UK', batch: '2018' },
    { id: 2, name: 'David Chen, CA', role: 'Partner', company: 'Deloitte', initials: 'DC', dept: 'Audit & Assurance', location: 'Singapore', batch: '2020' },
    { id: 3, name: 'Marcus Thorne', role: 'Financial Analyst', company: 'JP Morgan Chase', initials: 'MT', dept: 'Corporate Finance', location: 'Mumbai, India', batch: '2019' },
    { id: 4, name: 'Elena Rodriguez', role: 'Chief Financial Officer', company: 'Unilever', initials: 'ER', dept: 'Executive Management', location: 'New York, NY', batch: '2015' },
    { id: 5, name: 'James Wilson, CA', role: 'Senior Tax Consultant', company: 'EY', initials: 'JW', dept: 'Taxation', location: 'Toronto, Canada', batch: '2017' },
    { id: 6, name: 'Priya Sharma, CFA', role: 'Investment Analyst', company: 'Blackstone Group', initials: 'PS', dept: 'Wealth Management', location: 'Mumbai, India', batch: '2018' },
  ];
  
  dataset.push(...baseAlumni);
  
  // Fill up to 10,000
  for (let i = 7; i <= 10000; i++) {
    const nameIndex = (i * 3) % names.length;
    const lastNameIndex = (i * 7) % lastNames.length;
    const roleIndex = (i * 11) % roles.length;
    const companyIndex = (i * 13) % companies.length;
    const deptIndex = (i * 17) % depts.length;
    const locationIndex = (i * 19) % locations.length;
    const batch = 2000 + (i % 26);
    
    const fullName = `${names[nameIndex]} ${lastNames[lastNameIndex]}`;
    const initials = names[nameIndex][0] + lastNames[lastNameIndex][0];
    
    dataset.push({
      id: i,
      name: fullName,
      role: roles[roleIndex],
      company: companies[companyIndex],
      initials: initials,
      dept: depts[deptIndex],
      location: locations[locationIndex],
      batch: batch.toString()
    });
  }
  return dataset;
};

const Directory = () => {
  const { alumniList } = useData();
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [connections, setConnections] = useState({});
  const [showChat, setShowChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Filter selection states
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Generate dataset once and prepend global alumniList database
  const allAlumni = useMemo(() => {
    const generated = generateAlumniDataset();
    const mappedGlobal = alumniList.map((a) => ({
      id: `global-${a.id}`,
      name: a.name,
      role: a.profession || (a.role === 'student' ? 'Undergraduate Student' : 'Alumnus'),
      company: a.company || (a.role === 'student' ? 'Transcend College' : 'Business'),
      initials: a.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      dept: a.degree || a.fieldOfStudy || (a.role === 'student' ? 'Student' : 'Business'),
      location: a.location || 'Mumbai, India',
      batch: a.batch || '2024',
      isGlobal: true,
      email: a.email,
      skills: a.skills,
      bio: a.bio,
      linkedin: a.linkedin,
      college: a.college,
      degree: a.degree,
      fieldOfStudy: a.fieldOfStudy
    }));
    return [...mappedGlobal, ...generated];
  }, [alumniList]);

  // Compute unique filters dynamically
  const uniqueDepts = useMemo(() => [...new Set(allAlumni.map(a => a.dept))].sort(), [allAlumni]);
  const uniqueLocations = useMemo(() => [...new Set(allAlumni.map(a => a.location))].sort(), [allAlumni]);
  const uniqueBatches = useMemo(() => [...new Set(allAlumni.map(a => a.batch))].sort((a, b) => b - a), [allAlumni]);

  // Handle resets on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDept, selectedLocation, selectedBatch]);

  // Dynamic filter logic
  const filteredAlumni = useMemo(() => {
    return allAlumni.filter(a => {
      const matchesSearch = searchQuery === '' || 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.dept.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesDept = !selectedDept || a.dept === selectedDept;
      const matchesLocation = !selectedLocation || a.location === selectedLocation;
      const matchesBatch = !selectedBatch || a.batch === selectedBatch;
      
      return matchesSearch && matchesDept && matchesLocation && matchesBatch;
    });
  }, [allAlumni, searchQuery, selectedDept, selectedLocation, selectedBatch]);

  // Paginated subset
  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
  const paginatedAlumni = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAlumni.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAlumni, currentPage]);

  const handleConnect = (id) => {
    if (connections[id]) return;
    setConnections(prev => ({ ...prev, [id]: 'connecting' }));
    setTimeout(() => {
      setConnections(prev => ({ ...prev, [id]: 'connected' }));
      const found = allAlumni.find(a => a.id === id);
      setToast(`Connected with ${found ? found.name : 'Alumnus'}!`);
      setTimeout(() => setToast(null), 3000);
    }, 1500);
  };

  const openChat = (alumnus) => {
    setShowChat(alumnus);
    setChatMessages([
      { id: 1, text: `Hi! I'm ${alumnus.name.split(' ')[0]}. How can I help you today?`, sender: 'received', time: 'Now' }
    ]);
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), text: inputValue, sender: 'sent', time: 'Now' }]);
    setInputValue('');
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setChatMessages(prev => [...prev, { id: Date.now() + 1, text: "I'd love to discuss that! Let's schedule a call?", sender: 'received', time: 'Now' }]);
      }, 2000);
    }, 500);
  };

  return (
    <div className="directory-page" style={{ background: '#fdfdfd', minHeight: '100vh', padding: '8rem 0' }}>
      <div className="container">
        
        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div 
              className="glass-premium"
              initial={{ y: -100, x: '-50%', opacity: 0 }}
              animate={{ y: 0, x: '-50%', opacity: 1 }}
              exit={{ y: -100, x: '-50%', opacity: 0 }}
              style={{ position: 'fixed', top: '2rem', left: '50%', padding: '1rem 2rem', borderRadius: 'var(--radius-full)', zIndex: 2000, display: 'flex', alignItems: 'center', gap: '1rem', color: '#10b981', fontWeight: 600, background: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
            >
              <Check size={24} />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Immersive Header */}
        <header style={{ marginBottom: '6rem', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="hero-badge" style={{ marginBottom: '2rem' }}>
              <Sparkles size={14} style={{ marginRight: '8px' }} />
              Global Professional Registry ({allAlumni.length} Profiles)
            </div>
            <h1 style={{ fontSize: '5rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-3px' }}>
              Discover the <span className="text-gradient">Network.</span>
            </h1>
            
            <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
              <div className="glass-premium" style={{ display: 'flex', alignItems: 'center', padding: '1.5rem 2.5rem', borderRadius: 'var(--radius-2xl)', gap: '1.5rem' }}>
                <Search size={28} className="text-primary" />
                <input 
                  type="text" 
                  placeholder="Search by name, expertise, or company..." 
                  style={{ background: 'transparent', border: 'none', fontSize: '1.25rem', width: '100%', outline: 'none' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </header>

        <div className="directory-layout" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '5rem' }}>
          
          {/* Filters Sidebar */}
          <aside>
            <div style={{ position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Filter size={24} className="text-primary" />
                Filters
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Department Filter */}
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Department</label>
                  <select 
                    value={selectedDept} 
                    onChange={(e) => setSelectedDept(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: '#fff', fontSize: '0.9rem' }}
                  >
                    <option value="">All Departments</option>
                    {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Location</label>
                  <select 
                    value={selectedLocation} 
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: '#fff', fontSize: '0.9rem' }}
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                {/* Batch Filter */}
                <div>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Batch Year</label>
                  <select 
                    value={selectedBatch} 
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: '#fff', fontSize: '0.9rem' }}
                  >
                    <option value="">All Batches</option>
                    {uniqueBatches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              {(selectedDept || selectedLocation || selectedBatch) && (
                <button 
                  className="btn btn-outline" 
                  style={{ width: '100%', padding: '1rem', marginTop: '2.5rem', color: '#dc2626', borderColor: '#fca5a5', cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedDept('');
                    setSelectedLocation('');
                    setSelectedBatch('');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* Clean Alumni Grid */}
          <main>
            {paginatedAlumni.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
                No matching profiles found!
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '3rem' }}>
                  {paginatedAlumni.map((alumnus, index) => (
                    <motion.div 
                      key={alumnus.id} 
                      className="glass-premium"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(index * 0.05, 0.3) }}
                      whileHover={{ y: -6 }}
                      style={{ padding: '2.5rem', borderRadius: '24px', cursor: 'pointer' }}
                      onClick={() => setSelectedAlumni(alumnus)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 900 }}>
                          {alumnus.initials}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.2rem' }}>{alumnus.name}</h3>
                          <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>{alumnus.role}</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          <Briefcase size={16} style={{ color: 'var(--blue-700)' }} />
                          <span>{alumnus.company}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          <MapPin size={16} style={{ color: 'var(--blue-700)' }} />
                          <span>{alumnus.location}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          <GraduationCap size={16} style={{ color: 'var(--blue-700)' }} />
                          <span>{alumnus.dept} (Class of {alumnus.batch})</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem' }}>
                        {connections[alumnus.id] === 'connected' ? (
                          <button className="btn btn-primary" style={{ flex: 1, padding: '0.75rem' }} onClick={() => openChat(alumnus)}>
                            <MessageSquare size={16} />
                            Message
                          </button>
                        ) : connections[alumnus.id] === 'connecting' ? (
                          <button className="btn btn-outline" style={{ flex: 1, padding: '0.75rem' }} disabled>
                            <Loader2 size={16} className="animate-spin" />
                            ...
                          </button>
                        ) : (
                          <button className="btn btn-outline" style={{ flex: 1, padding: '0.75rem' }} onClick={() => handleConnect(alumnus.id)}>
                            <UserPlus size={16} />
                            Connect
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4rem', padding: '1.25rem 2rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredAlumni.length)}</strong> of <strong>{filteredAlumni.length}</strong> profiles
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', minHeight: '36px', height: '36px' }} 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(1)}
                      >
                        First
                      </button>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', minHeight: '36px', height: '36px' }} 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                      >
                        Prev
                      </button>
                      <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', minHeight: '36px', height: '36px' }} 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                      >
                        Next
                      </button>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', minHeight: '36px', height: '36px' }} 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        Last
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* Profile Details Drawer */}
        <AnimatePresence>
          {selectedAlumni && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedAlumni(null)}
                style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)', zIndex: 1000 }}
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                style={{ position: 'fixed', top: 0, right: 0, width: '500px', height: '100%', background: '#fff', zIndex: 1001, padding: '3rem', display: 'flex', flexDirection: 'column', overflowY: 'auto', boxShadow: '-10px 0 35px rgba(0,0,0,0.08)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 900 }}>
                      {selectedAlumni.initials}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.2rem' }}>{selectedAlumni.name}</h2>
                      <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>{selectedAlumni.role}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedAlumni(null)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                    <X size={24} />
                  </button>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* Basic Metadata */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <Briefcase size={16} style={{ color: 'var(--blue-700)' }} />
                      <span>{selectedAlumni.company}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <MapPin size={16} style={{ color: 'var(--blue-700)' }} />
                      <span>{selectedAlumni.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <GraduationCap size={16} style={{ color: 'var(--blue-700)' }} />
                      <span>{selectedAlumni.dept} (Class of {selectedAlumni.batch})</span>
                    </div>
                  </div>

                  {/* Bio / Professional Summary */}
                  {selectedAlumni.bio && (
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>About</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--border)', fontStyle: 'italic' }}>
                        "{selectedAlumni.bio}"
                      </p>
                    </div>
                  )}

                  {/* Education details if present */}
                  {selectedAlumni.college && (
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Education Details</h4>
                      <div style={{ border: '1px solid var(--border)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#fafafa' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>{selectedAlumni.college}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedAlumni.degree} in {selectedAlumni.fieldOfStudy}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Class of {selectedAlumni.batch}</div>
                      </div>
                    </div>
                  )}

                  {/* Skills Section */}
                  {selectedAlumni.skills && (
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Skills & Expertise</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedAlumni.skills.split(',').map((skill, i) => (
                          <span key={i} style={{ background: '#eff6ff', color: 'var(--blue-700)', padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', border: '1px solid #dbeafe' }}>
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LinkedIn Profile */}
                  {selectedAlumni.linkedin && (
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>Professional Networks</h4>
                      <a 
                        href={selectedAlumni.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-outline" 
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: '100%', padding: '0.875rem', borderColor: '#0077b5', color: '#0077b5', fontWeight: 'bold' }}
                      >
                        <Globe size={18} />
                        View LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  {connections[selectedAlumni.id] === 'connected' ? (
                    <button 
                      className="btn btn-primary" 
                      style={{ flex: 1, padding: '1rem' }} 
                      onClick={() => {
                        setSelectedAlumni(null);
                        openChat(selectedAlumni);
                      }}
                    >
                      <MessageSquare size={18} />
                      Message
                    </button>
                  ) : connections[selectedAlumni.id] === 'connecting' ? (
                    <button className="btn btn-outline" style={{ flex: 1, padding: '1rem' }} disabled>
                      <Loader2 size={18} className="animate-spin" />
                      Connecting...
                    </button>
                  ) : (
                    <button 
                      className="btn btn-outline" 
                      style={{ flex: 1, padding: '1rem', border: '1px solid var(--primary)', color: 'var(--primary)' }} 
                      onClick={() => handleConnect(selectedAlumni.id)}
                    >
                      <UserPlus size={18} />
                      Connect to Network
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Chat Drawer */}
        <AnimatePresence>
          {showChat && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowChat(null)}
                style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(4px)', zIndex: 1000 }}
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                style={{ position: 'fixed', top: 0, right: 0, width: '450px', height: '100%', background: '#fff', zIndex: 1001, padding: '3rem', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 35px rgba(0,0,0,0.08)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800 }}>
                      {showChat.initials}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.2rem' }}>{showChat.name}</h2>
                      <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>{showChat.role}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowChat(null)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                    <X size={24} />
                  </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {chatMessages.map(msg => (
                    <div key={msg.id} style={{ alignSelf: msg.sender === 'sent' ? 'flex-end' : 'flex-start', background: msg.sender === 'sent' ? 'var(--primary)' : '#f1f5f9', color: msg.sender === 'sent' ? '#fff' : 'var(--text-main)', padding: '1rem 1.5rem', borderRadius: '20px', maxWidth: '85%', fontSize: '0.9rem', fontWeight: 500 }}>
                      {msg.text}
                    </div>
                  ))}
                  {isTyping && <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Typing...</div>}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '20px' }}>
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    style={{ background: 'transparent', border: 'none', flex: 1, padding: '0.5rem', outline: 'none', fontSize: '0.9rem' }}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button onClick={sendMessage} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.65rem', borderRadius: '50%', display: 'flex', cursor: 'pointer' }}>
                    <Send size={18} />
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Directory;
