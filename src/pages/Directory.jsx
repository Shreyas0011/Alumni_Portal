import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Globe, MessageSquare, ChevronDown, MapPin, Briefcase, GraduationCap, X, UserPlus, Check, Send, Sparkles, Smile, Paperclip, Loader2 } from 'lucide-react';

const Directory = () => {
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [connections, setConnections] = useState({});
  const [showChat, setShowChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const alumniList = [
    { id: 1, name: 'Sarah Jenkins', role: 'Senior Software Engineer', company: 'Google', initials: 'SJ', dept: 'Engineering', location: 'Mountain View, CA' },
    { id: 2, name: 'David Chen', role: 'Founder & CEO', company: 'TechFlow', initials: 'DC', dept: 'Engineering', location: 'San Francisco, CA' },
    { id: 3, name: 'Marcus Thorne', role: 'Creative Director', company: 'Adobe', initials: 'MT', dept: 'Visual Arts', location: 'Brooklyn, NY' },
    { id: 4, name: 'Elena Rodriguez', role: 'Product Manager', company: 'Meta', initials: 'ER', dept: 'Business', location: 'Seattle, WA' },
    { id: 5, name: 'James Wilson', role: 'Lead Architect', company: 'AWS', initials: 'JW', dept: 'Engineering', location: 'Austin, TX' },
    { id: 6, name: 'Priya Sharma', role: 'Data Scientist', company: 'Netflix', initials: 'PS', dept: 'Data Science', location: 'Los Gatos, CA' },
  ];

  const handleConnect = (id) => {
    if (connections[id]) return;
    setConnections(prev => ({ ...prev, [id]: 'connecting' }));
    setTimeout(() => {
      setConnections(prev => ({ ...prev, [id]: 'connected' }));
      setToast(`Connected with ${alumniList.find(a => a.id === id).name}!`);
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
              style={{ position: 'fixed', top: '2rem', left: '50%', padding: '1rem 2rem', borderRadius: 'var(--radius-full)', zHeight: 2000, display: 'flex', alignItems: 'center', gap: '1rem', color: '#10b981', fontWeight: 600 }}
            >
              <Check size={24} />
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Immersive Header */}
        <header style={{ marginBottom: '8rem', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="hero-badge" style={{ marginBottom: '2rem' }}>
              <Sparkles size={14} style={{ marginRight: '8px' }} />
              Global Professional Registry
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

        <div className="directory-layout" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '6rem' }}>
          
          {/* Airy Filters Sidebar */}
          <aside>
            <div style={{ marginBottom: '4rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Filter size={24} className="text-primary" />
                Filters
              </h3>
              
              {['Department', 'Location', 'Industry', 'Batch'].map((filter) => (
                <div key={filter} style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>
                    {filter}
                    <ChevronDown size={20} className="text-dim" />
                  </div>
                </div>
              ))}
              
              <button className="btn btn-primary" style={{ width: '100%', padding: '1.25rem' }}>Apply Filters</button>
            </div>
          </aside>

          {/* Clean Alumni Grid */}
          <main>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '4rem' }}>
              {alumniList.map((alumnus, index) => (
                <motion.div 
                  key={alumnus.id} 
                  className="glass-premium"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  style={{ padding: '3.5rem', borderRadius: '32px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 900 }}>
                      {alumnus.initials}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>{alumnus.name}</h3>
                      <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1rem' }}>{alumnus.role}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                      <Briefcase size={22} className="text-primary" />
                      <span>{alumnus.company}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                      <MapPin size={22} className="text-primary" />
                      <span>{alumnus.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                      <GraduationCap size={22} className="text-primary" />
                      <span>{alumnus.dept}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {connections[alumnus.id] === 'connected' ? (
                      <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => openChat(alumnus)}>
                        <MessageSquare size={20} />
                        Message
                      </button>
                    ) : connections[alumnus.id] === 'connecting' ? (
                      <button className="btn btn-outline" style={{ flex: 1 }} disabled>
                        <Loader2 size={20} className="animate-spin" />
                        ...
                      </button>
                    ) : (
                      <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => handleConnect(alumnus.id)}>
                        <UserPlus size={20} />
                        Connect
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </main>
        </div>

        {/* Premium Side Panel Chat */}
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
                style={{ position: 'fixed', top: 0, right: 0, width: '500px', height: '100%', background: '#fff', zIndex: 1001, padding: '4rem', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800 }}>
                      {showChat.initials}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: 900 }}>{showChat.name}</h2>
                      <p style={{ color: 'var(--primary)', fontWeight: 700 }}>{showChat.role}</p>
                    </div>
                  </div>
                  <button onClick={() => setShowChat(null)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)' }}>
                    <X size={32} />
                  </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {chatMessages.map(msg => (
                    <div key={msg.id} style={{ alignSelf: msg.sender === 'sent' ? 'flex-end' : 'flex-start', background: msg.sender === 'sent' ? 'var(--primary)' : '#f1f5f9', color: msg.sender === 'sent' ? '#fff' : 'var(--text-main)', padding: '1.25rem 1.75rem', borderRadius: '24px', maxWidth: '80%', fontWeight: 500 }}>
                      {msg.text}
                    </div>
                  ))}
                  {isTyping && <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Typing...</div>}
                </div>

                <div style={{ display: 'flex', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '24px' }}>
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    style={{ background: 'transparent', border: 'none', flex: 1, padding: '0.5rem 1rem', outline: 'none' }}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button onClick={sendMessage} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '50%', display: 'flex' }}>
                    <Send size={20} />
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
