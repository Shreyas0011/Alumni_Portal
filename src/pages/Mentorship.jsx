import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, UserPlus, Check, MessageSquare, X, Send, ChevronDown, Star, Briefcase, MapPin, GraduationCap, Loader2 } from 'lucide-react';

// Mentorship areas with matching alumni expertise tags
const MENTORSHIP_TYPES = [
  { value: '', label: 'Select a Mentorship Area...' },
  { value: 'ca', label: 'CA / ICAI Exam Preparation' },
  { value: 'cfa', label: 'CFA / Investment Analysis' },
  { value: 'investment_banking', label: 'Investment Banking Career' },
  { value: 'audit', label: 'Audit & Assurance' },
  { value: 'tax', label: 'Taxation & GST' },
  { value: 'mba', label: 'MBA / Higher Studies Abroad' },
  { value: 'startup', label: 'Entrepreneurship & Startups' },
  { value: 'resume', label: 'Resume & Interview Prep' },
  { value: 'corporate_finance', label: 'Corporate Finance & Treasury' },
];

const ALUMNI_MENTORS = [
  {
    id: 1, name: 'Priya Sharma', role: 'Investment Analyst', company: 'Blackstone Group',
    location: 'Mumbai', batch: '2018', rating: 4.9, sessions: 42,
    tags: ['cfa', 'investment_banking', 'corporate_finance'],
    bio: 'CFA charterholder with 5+ years in PE and investment analysis. Happy to guide on CFA prep and IB careers.',
    expertise: ['CFA', 'Private Equity', 'Valuation'],
  },
  {
    id: 2, name: 'David Chen', role: 'Partner', company: 'Deloitte',
    location: 'Singapore', batch: '2015', rating: 4.8, sessions: 78,
    tags: ['audit', 'ca', 'resume'],
    bio: 'CA with Big4 partnership track. I mentor CA aspirants and help students break into audit firms.',
    expertise: ['CA Prep', 'Big4 Audit', 'Career Advice'],
  },
  {
    id: 3, name: 'Elena Rodriguez', role: 'CFO', company: 'Unilever',
    location: 'New York', batch: '2012', rating: 5.0, sessions: 31,
    tags: ['mba', 'corporate_finance', 'startup'],
    bio: 'Wharton MBA + 10 yrs in corporate finance. Love guiding students through MBA applications and CFO track.',
    expertise: ['MBA Apps', 'Corporate Strategy', 'Leadership'],
  },
  {
    id: 4, name: 'James Wilson', role: 'Senior Tax Consultant', company: 'EY',
    location: 'Toronto', batch: '2017', rating: 4.7, sessions: 55,
    tags: ['tax', 'ca', 'resume'],
    bio: 'GST and international tax specialist at EY. Help students understand tax law and Big4 hiring.',
    expertise: ['GST', 'International Tax', 'EY Hiring'],
  },
  {
    id: 5, name: 'Arjun Kapoor', role: 'Equity Research VP', company: 'Morgan Stanley',
    location: 'Mumbai', batch: '2016', rating: 4.8, sessions: 67,
    tags: ['cfa', 'investment_banking', 'resume'],
    bio: 'Equity research professional. Guide students on CFA, financial modelling, and IB job applications.',
    expertise: ['Equity Research', 'Financial Modelling', 'CFA'],
  },
  {
    id: 6, name: 'Sneha Reddy', role: 'Founder & CEO', company: 'FinTech Startup',
    location: 'Bangalore', batch: '2019', rating: 4.6, sessions: 23,
    tags: ['startup', 'mba', 'corporate_finance'],
    bio: 'Built a FinTech startup post-MBA. I mentor students on entrepreneurship, pitching, and fundraising.',
    expertise: ['Startups', 'Fundraising', 'FinTech'],
  },
  {
    id: 7, name: 'Meera Iyer', role: 'Treasury Manager', company: 'HDFC Bank',
    location: 'Chennai', batch: '2017', rating: 4.7, sessions: 44,
    tags: ['corporate_finance', 'ca', 'audit'],
    bio: 'Treasury & cash management at HDFC. I help students explore banking careers and CA preparation.',
    expertise: ['Treasury', 'Banking', 'CA'],
  },
  {
    id: 8, name: 'Vikram Desai', role: 'M&A Analyst', company: 'Goldman Sachs',
    location: 'London', batch: '2020', rating: 4.9, sessions: 18,
    tags: ['investment_banking', 'resume', 'mba'],
    bio: 'Bulge bracket M&A analyst. I guide students on breaking into top investment banks from commerce backgrounds.',
    expertise: ['M&A', 'Goldman Sachs', 'IB Interviews'],
  },
];

const Mentorship = () => {
  const [mentorshipType, setMentorshipType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [connections, setConnections] = useState({});
  const [chatAlumni, setChatAlumni] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState('');

  const suggestedMentors = useMemo(() => {
    if (!mentorshipType) return [];
    return ALUMNI_MENTORS.filter(a => a.tags.includes(mentorshipType))
      .sort((a, b) => b.rating - a.rating);
  }, [mentorshipType]);

  const filteredAll = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return ALUMNI_MENTORS.filter(a =>
      !q || a.name.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q) ||
      a.company.toLowerCase().includes(q) ||
      a.expertise.some(e => e.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleConnect = (id, name) => {
    if (connections[id]) return;
    setConnections(p => ({ ...p, [id]: 'connecting' }));
    setTimeout(() => {
      setConnections(p => ({ ...p, [id]: 'connected' }));
      setToast(`Connection request sent to ${name}!`);
      setTimeout(() => setToast(''), 3000);
    }, 1500);
  };

  const openChat = (alumni) => {
    setChatAlumni(alumni);
    setChatMessages([{ id: 1, text: `Hi! I'm ${alumni.name.split(' ')[0]}. How can I help you today?`, from: 'them' }]);
  };

  const sendMsg = () => {
    if (!chatInput.trim()) return;
    setChatMessages(p => [...p, { id: Date.now(), text: chatInput, from: 'me' }]);
    setChatInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(p => [...p, { id: Date.now() + 1, text: "Great question! Let's schedule a session to discuss this in detail.", from: 'them' }]);
    }, 1800);
  };

  const MentorCard = ({ alumni, highlight }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      style={{
        background: highlight ? 'linear-gradient(135deg, #fffbeb 0%, #fff 100%)' : '#fff',
        border: highlight ? '2px solid #f59e0b' : '1px solid var(--border)',
        borderRadius: '20px', padding: '1.75rem', boxShadow: highlight ? '0 8px 24px rgba(245,158,11,0.12)' : '0 2px 12px rgba(0,0,0,0.05)',
        display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative'
      }}
    >
      {highlight && (
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#f59e0b', color: '#fff', fontSize: '0.68rem', fontWeight: '800', padding: '0.25rem 0.65rem', borderRadius: '99px', letterSpacing: '0.05em' }}>
          ⭐ BEST MATCH
        </div>
      )}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ width: 54, height: 54, borderRadius: '14px', background: 'linear-gradient(135deg, var(--blue-700), var(--blue-500))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: '900', flexShrink: 0 }}>
          {alumni.name[0]}
        </div>
        <div>
          <h3 style={{ fontWeight: '800', fontSize: '1.05rem', marginBottom: '0.1rem' }}>{alumni.name}</h3>
          <p style={{ color: 'var(--blue-700)', fontWeight: '700', fontSize: '0.8rem' }}>{alumni.role}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <Briefcase size={14} /> {alumni.company}
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <MapPin size={14} /> {alumni.location}
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <GraduationCap size={14} /> Class of {alumni.batch}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {alumni.expertise.map(e => (
          <span key={e} style={{ background: 'var(--blue-50)', color: 'var(--blue-700)', border: '1px solid var(--blue-100)', borderRadius: '99px', padding: '0.2rem 0.65rem', fontSize: '0.7rem', fontWeight: '700' }}>{e}</span>
        ))}
      </div>

      <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{alumni.bio}</p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#f59e0b', fontWeight: '700' }}>
          <Star size={14} fill="#f59e0b" /> {alumni.rating} · {alumni.sessions} sessions
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {connections[alumni.id] === 'connected' ? (
            <button className="btn btn-sm btn-primary" onClick={() => openChat(alumni)}>
              <MessageSquare size={14} /> Chat
            </button>
          ) : connections[alumni.id] === 'connecting' ? (
            <button className="btn btn-sm btn-outline" disabled>
              <Loader2 size={14} className="animate-spin" /> ...
            </button>
          ) : (
            <button className="btn btn-sm btn-outline" onClick={() => handleConnect(alumni.id, alumni.name)}>
              <UserPlus size={14} /> Connect
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }}
            style={{ position: 'fixed', top: '1.5rem', left: '50%', transform: 'translateX(-50%)', background: '#fff', border: '1px solid var(--border)', borderRadius: '99px', padding: '0.75rem 1.75rem', fontWeight: '700', fontSize: '0.85rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
            <Check size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)', padding: '6rem 0 4rem', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '99px', padding: '0.4rem 1.25rem', fontSize: '0.8rem', fontWeight: '700', marginBottom: '1.5rem', letterSpacing: '0.05em' }}>
              <Sparkles size={14} /> MENTORSHIP HUB
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: '900', marginBottom: '1rem', lineHeight: 1.1 }}>
              Connect with Commerce <span style={{ color: '#fbbf24' }}>Alumni Mentors</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.1rem', maxWidth: '560px', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              Browse real alumni profiles, select your mentorship area, and get matched with the best mentor for your career goals.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container" style={{ padding: '3rem 2.5rem' }}>

        {/* Smart Mentorship Matcher */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem', marginBottom: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'var(--blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue-700)' }}>
              <Sparkles size={20} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Smart Mentor Finder</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Select a mentorship area and we'll instantly suggest the best-matched alumni mentors for you.
          </p>
          <div style={{ position: 'relative', maxWidth: '520px' }}>
            <select
              value={mentorshipType}
              onChange={e => setMentorshipType(e.target.value)}
              style={{ width: '100%', padding: '0.9rem 2.5rem 0.9rem 1.25rem', borderRadius: '14px', border: '2px solid', borderColor: mentorshipType ? 'var(--blue-600)' : 'var(--border)', fontSize: '0.95rem', fontWeight: '600', appearance: 'none', background: '#fff', cursor: 'pointer', color: mentorshipType ? 'var(--text-main)' : 'var(--text-dim)' }}
            >
              {MENTORSHIP_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <ChevronDown size={16} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
          </div>

          <AnimatePresence>
            {mentorshipType && suggestedMentors.length > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--blue-700)', marginBottom: '1.25rem' }}>
                    ✨ {suggestedMentors.length} mentor{suggestedMentors.length !== 1 ? 's' : ''} matched for "{MENTORSHIP_TYPES.find(t => t.value === mentorshipType)?.label}"
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                    {suggestedMentors.map((alumni, i) => (
                      <MentorCard key={alumni.id} alumni={alumni} highlight={i === 0} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* All Alumni Profiles */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>All Alumni Mentors</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Browse all available mentors and connect directly.</p>
          <div style={{ position: 'relative', maxWidth: '420px' }}>
            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Search by name, company, or expertise..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.75rem', borderRadius: '12px', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredAll.map(alumni => (
            <MentorCard key={alumni.id} alumni={alumni} highlight={false} />
          ))}
          {filteredAll.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              No mentors found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Chat Drawer */}
      <AnimatePresence>
        {chatAlumni && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setChatAlumni(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(4px)', zIndex: 1000 }}
            />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }}
              style={{ position: 'fixed', top: 0, right: 0, width: '420px', height: '100%', background: '#fff', zIndex: 1001, display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.08)' }}>
              <div style={{ padding: '1.75rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, var(--blue-700), var(--blue-500))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                    {chatAlumni.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>{chatAlumni.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--blue-700)', fontWeight: '700' }}>{chatAlumni.role} · {chatAlumni.company}</div>
                  </div>
                </div>
                <button onClick={() => setChatAlumni(null)} style={{ background: 'var(--gray-100)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {chatMessages.map(msg => (
                  <div key={msg.id} style={{ alignSelf: msg.from === 'me' ? 'flex-end' : 'flex-start', background: msg.from === 'me' ? 'var(--blue-700)' : '#f1f5f9', color: msg.from === 'me' ? '#fff' : 'var(--text-main)', padding: '0.75rem 1.1rem', borderRadius: '16px', maxWidth: '82%', fontSize: '0.875rem', fontWeight: '500' }}>
                    {msg.text}
                  </div>
                ))}
                {isTyping && <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Typing...</div>}
              </div>

              <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem', background: '#fafafa' }}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMsg()}
                  placeholder="Type your message..."
                  style={{ flex: 1, borderRadius: '12px', border: '1px solid var(--border)', padding: '0.65rem 1rem', fontSize: '0.875rem', background: '#fff' }}
                />
                <button onClick={sendMsg} style={{ background: 'var(--blue-700)', color: '#fff', border: 'none', borderRadius: '12px', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Mentorship;
