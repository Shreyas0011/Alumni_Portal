import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Users, GraduationCap, Calendar, UserPlus, Menu, X, ShieldCheck, ChevronRight, Bell } from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', path: '/', icon: <Home size={18} /> },
  { name: 'Directory', path: '/directory', icon: <Users size={18} />, badge: 'New' },
  { name: 'Mentorship', path: '/mentorship', icon: <GraduationCap size={18} /> },
  { name: 'Events', path: '/events', icon: <Calendar size={18} />, badge: '3' },
  { name: 'Register', path: '/register', icon: <UserPlus size={18} /> },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const loc = useLocation();

  return (
    <>
      {/* ── SIDEBAR ── */}
      <motion.aside className="sidebar"
        initial={{ x: -260, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Brand */}
        <div className="sidebar-brand">
          <Link to="/" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.625rem', textDecoration:'none' }}>
            <motion.img src="/logo.png" alt="Transcend"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
              style={{ height: 58, width: 'auto' }}
            />
            <div className="sidebar-brand-text">
              <div className="title">Alumni Connect</div>
              <div className="sub">Portal · Transcend</div>
            </div>
          </Link>
        </div>

        {/* Nav body */}
        <div className="sidebar-body">
          <div className="sidebar-section-label">Main Menu</div>
          {navLinks.map((l, i) => {
            const active = loc.pathname === l.path;
            return (
              <motion.div key={l.path}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <Link to={l.path} className={`sidebar-link ${active ? 'active' : ''}`}>
                  <span className="sidebar-link-icon">{l.icon}</span>
                  <span className="sidebar-link-text">{l.name}</span>
                  {l.badge && <span className="sidebar-link-badge">{l.badge}</span>}
                  {active && (
                    <motion.span layoutId="active-chev" style={{ color: 'var(--blue-600)', display:'flex' }}>
                      <ChevronRight size={14} />
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            );
          })}

          <div className="sidebar-section-label" style={{ marginTop: '0.5rem' }}>Administration</div>
          <Link to="/admin" className={`sidebar-link ${loc.pathname === '/admin' ? 'active' : ''}`}>
            <span className="sidebar-link-icon"><ShieldCheck size={18} /></span>
            <span className="sidebar-link-text">Admin Portal</span>
          </Link>
        </div>

        {/* Bottom user widget */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">A</div>
            <div className="sidebar-user-info">
              <div className="name">Alumni User</div>
              <div className="role">Class of 2020</div>
            </div>
            <Bell size={15} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
          </div>
        </div>
      </motion.aside>

      {/* ── MOBILE TOPBAR ── */}
      <div className="mobile-topbar">
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
          <img src="/logo.png" alt="Transcend" style={{ height: 36 }} />
          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--blue-900)' }}>Alumni Connect</span>
        </Link>
        <button className="mobile-toggle" onClick={() => setMobileOpen(o => !o)}>
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="mobile-menu"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {navLinks.map(l => (
              <Link key={l.path} to={l.path} className={`sidebar-link ${loc.pathname === l.path ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                <span className="sidebar-link-icon">{l.icon}</span>
                {l.name}
                {l.badge && <span className="sidebar-link-badge">{l.badge}</span>}
              </Link>
            ))}
            <Link to="/admin" className="sidebar-link" onClick={() => setMobileOpen(false)}>
              <span className="sidebar-link-icon"><ShieldCheck size={18} /></span> Admin Portal
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
