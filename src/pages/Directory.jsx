import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Globe, MessageSquare, MapPin, Briefcase, GraduationCap, X, UserPlus, Check, Send, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useSocial } from '../context/SocialContext';
import { ChatDrawer } from '../components/Chat';
import { VerifiedBadge } from '../components/Badges';
import { useSearchParams } from 'react-router-dom';
import { CREDENTIALS, AVAILABILITY } from '../data/showcase';
import { buildDirectory } from '../data/directoryData';
import PageHeader from '../components/PageHeader';

const AVAIL_STYLE = {
  'Open to Mentor': ['#ecfdf5', '#047857'],
  'Giving Referrals': ['#eff6ff', '#1d4ed8'],
  Hiring: ['#f5f3ff', '#6d28d9'],
  'Open to Talk': ['#fff7ed', '#c2410c'],
  Busy: ['#f1f5f9', '#64748b'],
};

// The yearbook has its own page in the sidebar (/yearbook)
const SECTIONS = [
  { id: 'all', label: 'Alumni Directory' },
  { id: 'batchmates', label: 'Batchmates' },
];

const Directory = () => {
  const { alumniList } = useData();
  const { user } = useAuth();
  const sections = user?.role === 'student' ? SECTIONS.filter(s => s.id === 'all') : SECTIONS;
  const [section, setSection] = useState('all');
  const [myBatch, setMyBatch] = useState(String(user?.batch || '2018'));
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [connections, setConnections] = useState({});
  const [showChat, setShowChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [params] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(params.get('q') || '');
  const [toast, setToast] = useState(null);

  // Filter selection states
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedCredential, setSelectedCredential] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [chatPerson, setChatPerson] = useState(null);
  const { personById } = useSocial();
  const openRealChat = (a) => setChatPerson(personById(a.uid) || { uid: a.uid, name: a.name, subtitle: `${a.role} · ${a.company}`, verified: true });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const allAlumni = useMemo(() => buildDirectory(alumniList), [alumniList]);

  // Compute unique filters dynamically
  const uniqueDepts = useMemo(() => [...new Set(allAlumni.map(a => a.dept))].sort(), [allAlumni]);
  const uniqueLocations = useMemo(() => [...new Set(allAlumni.map(a => a.location))].sort(), [allAlumni]);
  const uniqueBatches = useMemo(() => [...new Set(allAlumni.map(a => a.batch))].sort((a, b) => b - a), [allAlumni]);
  const uniqueIndustries = useMemo(() => [...new Set(allAlumni.map(a => a.industry))].sort(), [allAlumni]);
  const uniqueDomains = useMemo(() => [...new Set(allAlumni.map(a => a.domain))].sort(), [allAlumni]);
  const batchFilter = section === 'batchmates' ? myBatch : selectedBatch;

  // Handle resets on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDept, selectedLocation, selectedBatch, selectedIndustry, selectedDomain, selectedCredential, selectedAvailability, verifiedOnly, section, myBatch]);

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
      const matchesBatch = !batchFilter || a.batch === batchFilter;
      const matchesFacets = (!selectedIndustry || a.industry === selectedIndustry)
        && (!selectedDomain || a.domain === selectedDomain)
        && (!selectedCredential || a.credentials.includes(selectedCredential))
        && (!selectedAvailability || a.availability === selectedAvailability)
        && (!verifiedOnly || a.verified);
      
      return matchesSearch && matchesDept && matchesLocation && matchesBatch && matchesFacets;
    });
  }, [allAlumni, searchQuery, selectedDept, selectedLocation, batchFilter, selectedIndustry, selectedDomain, selectedCredential, selectedAvailability, verifiedOnly]);

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
    <div className="directory-page page">
      <div>
        
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

        <PageHeader
          title="Directory"
          subtitle={`${allAlumni.length.toLocaleString('en-IN')} alumni profiles. Verified alumni can be messaged directly.`}
          actions={sections.length > 1 && (
            <div className="seg" role="tablist" aria-label="Directory view">
              {sections.map(sec => (
                <button key={sec.id} role="tab" aria-selected={section === sec.id} onClick={() => setSection(sec.id)}>{sec.label}</button>
              ))}
            </div>
          )}
        >
          <div className="toolbar" style={{ marginBottom: 0 }}>
            <div className="grow">
              <Search size={17} aria-hidden="true" />
              <input
                type="text"
                placeholder="Search by name, role, company or department"
                aria-label="Search the directory"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </PageHeader>

        <div className="directory-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '2rem', alignItems: 'start' }}>
          
          {/* Filters Sidebar */}
          <aside className="directory-filters" style={{ order: 2, position: 'sticky', top: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Filter size={20} className="text-primary" />
                Filters
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} style={{ width: 'auto' }} />
                  <VerifiedBadge size={15} /> Verified alumni only
                </label>
                {[
                  { label: 'Department', value: selectedDept, set: setSelectedDept, all: 'All Departments', options: uniqueDepts },
                  { label: 'Industry', value: selectedIndustry, set: setSelectedIndustry, all: 'All Industries', options: uniqueIndustries },
                  { label: 'Domain', value: selectedDomain, set: setSelectedDomain, all: 'All Domains', options: uniqueDomains },
                  { label: 'Professional Credentials', value: selectedCredential, set: setSelectedCredential, all: 'Any Credential', options: CREDENTIALS },
                  { label: 'Availability', value: selectedAvailability, set: setSelectedAvailability, all: 'Any Availability', options: AVAILABILITY },
                  { label: 'Location', value: selectedLocation, set: setSelectedLocation, all: 'All Locations', options: uniqueLocations },
                  ...(section === 'batchmates' ? [] : [{ label: 'Batch Year', value: selectedBatch, set: setSelectedBatch, all: 'All Batches', options: uniqueBatches }]),
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>{f.label}</label>
                    <select
                      value={f.value}
                      onChange={(e) => f.set(e.target.value)}
                      style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '12px', border: '1px solid var(--border)', background: '#fff', fontSize: '0.88rem' }}
                    >
                      <option value="">{f.all}</option>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {(verifiedOnly || selectedDept || selectedLocation || selectedBatch || selectedIndustry || selectedDomain || selectedCredential || selectedAvailability) && (
                <button 
                  className="btn btn-outline" 
                  style={{ width: '100%', padding: '0.75rem', marginTop: '1.5rem', color: '#dc2626', borderColor: '#fca5a5', cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedDept('');
                    setSelectedLocation('');
                    setSelectedBatch('');
                    setSelectedIndustry('');
                    setSelectedDomain('');
                    setSelectedCredential('');
                    setSelectedAvailability('');
                    setVerifiedOnly(false);
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* Clean Alumni Grid */}
          <main style={{ order: 1, minWidth: 0 }}>
            {section === 'batchmates' && (
              <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem', padding: '1rem 1.25rem', background: 'var(--blue-50)', borderColor: 'var(--blue-100)' }}>
                <div>
                  <div style={{ fontWeight: 800 }}>Your batchmates · Class of {myBatch}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{filteredAlumni.length.toLocaleString('en-IN')} classmates on the portal</div>
                </div>
                <select value={myBatch} onChange={(e) => setMyBatch(e.target.value)} aria-label="Batch year" style={{ padding: '0.55rem 0.9rem', borderRadius: '10px', border: '1px solid var(--border)', background: '#fff', fontSize: '0.85rem', width: 'auto' }}>
                  {uniqueBatches.map(b => <option key={b} value={b}>Class of {b}</option>)}
                </select>
              </div>
            )}
            {paginatedAlumni.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
                No matching profiles found!
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(250px, 100%), 1fr))', gap: '1rem' }}>
                  {paginatedAlumni.map((alumnus, index) => (
                    <motion.div 
                      key={alumnus.id} 
                      className="glass-premium"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: Math.min(index * 0.05, 0.3) }}
                      whileHover={{ y: -6 }}
                      style={{ padding: '1.5rem', borderRadius: '20px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                      onClick={() => setSelectedAlumni(alumnus)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                        <div style={{ flexShrink: 0, width: '46px', height: '46px', borderRadius: '14px', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 900 }}>
                          {alumnus.initials}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.3rem', lineHeight: 1.25 }}>{alumnus.name}{alumnus.verified && <VerifiedBadge size={16} />}</h3>
                          <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>{alumnus.role}</p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem', flex: 1 }}>
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
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.2rem' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '99px', background: AVAIL_STYLE[alumnus.availability][0], color: AVAIL_STYLE[alumnus.availability][1] }}>{alumnus.availability}</span>
                          <span style={{ fontSize: '0.68rem', fontWeight: 600, padding: '0.2rem 0.55rem', borderRadius: '99px', background: 'var(--gray-100)', color: 'var(--text-muted)' }}>{alumnus.industry} · {alumnus.domain}</span>
                          {alumnus.credentials.map(c => (
                            <span key={c} style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid var(--blue-200)', color: 'var(--blue-800)' }}>{c}</span>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem' }}>
                        {alumnus.uid ? (
                          <button className="btn btn-primary" style={{ flex: 1, padding: '0.75rem' }} onClick={(e) => { e.stopPropagation(); openRealChat(alumnus); }}>
                            <MessageSquare size={16} />
                            Message
                          </button>
                        ) : connections[alumnus.id] === 'connected' ? (
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
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', padding: '1rem clamp(1rem, 4vw, 1.5rem)', background: '#fff', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredAlumni.length)}</strong> of <strong>{filteredAlumni.length}</strong> profiles
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
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
                style={{ position: 'fixed', top: 0, right: 0, width: 'min(500px, 100vw)', height: '100%', background: '#fff', zIndex: 1001, padding: 'clamp(1.5rem, 5vw, 3rem)', display: 'flex', flexDirection: 'column', overflowY: 'auto', boxShadow: '-10px 0 35px rgba(0,0,0,0.08)' }}
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
 {selectedAlumni.uid ? (
                    <button className="btn btn-primary" style={{ flex: 1, padding: '1rem' }} onClick={() => { const a = selectedAlumni; setSelectedAlumni(null); openRealChat(a); }}>
                      <MessageSquare size={18} />
                      Message
                    </button>
                  ) : connections[selectedAlumni.id] === 'connected' ? (
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

        <ChatDrawer person={chatPerson} onClose={() => setChatPerson(null)} />

        {/* Sample-profile chat preview (generated test profiles only) */}
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
                style={{ position: 'fixed', top: 0, right: 0, width: 'min(450px, 100vw)', height: '100%', background: '#fff', zIndex: 1001, padding: 'clamp(1.5rem, 5vw, 3rem)', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 35px rgba(0,0,0,0.08)' }}
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
