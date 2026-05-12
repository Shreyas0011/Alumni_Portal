import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Users, GraduationCap, Calendar, UserPlus, Menu, X, ShieldCheck, ChevronRight, Bell, LogOut, LayoutGrid } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const baseLinks = [
    { name: 'About Platform', path: '/home', icon: <Home size={18} /> },
    { name: 'Directory', path: '/directory', icon: <Users size={18} />, badge: 'New' },
    { name: 'Mentorship', path: '/mentorship', icon: <GraduationCap size={18} /> },
    { name: 'Events', path: '/events', icon: <Calendar size={18} />, badge: '3' },
  ];

  const loggedOutLinks = [
    ...baseLinks,
    { name: 'Portals', path: '/portal', icon: <LayoutGrid size={18} /> },
    { name: 'Register', path: '/register', icon: <UserPlus size={18} /> },
  ];

  const getRoleLinks = () => {
    const dashboardPath = user ? `/${user.role}/dashboard` : null;
    const links = [];
    
    if (dashboardPath) {
      links.push({ name: 'Dashboard', path: dashboardPath, icon: <LayoutGrid size={18} /> });
    }

    const filteredBase = baseLinks.filter(l => {
      if (!user) return true;
      if (user.role === 'alumni') return true;
      const allowed = ['About Platform', 'Directory', 'Mentorship'];
      return allowed.includes(l.name);
    });

    return [...links, ...filteredBase.filter(l => l.name !== 'About Platform' || !dashboardPath)];
  };

  const navLinks = getRoleLinks();

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
              <div className="title">
                {!user ? 'Alumni Connect' : 
                 user.role === 'student' ? 'Student Portal' : 
                 user.role === 'teacher' ? 'Faculty Portal' : 'Alumni Portal'}
              </div>
              <div className="sub">
                {!user ? 'Portal · Transcend' : 
                 user.role === 'student' ? 'Network · Learn' : 
                 user.role === 'teacher' ? 'Manage · Mentor' : 'Stay Connected'}
              </div>
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
          {user ? (
            <div className="sidebar-user" style={{ cursor: 'pointer' }} onClick={handleLogout} title="Click to logout">
              <div className="sidebar-avatar" style={{ background: user.role === 'teacher' ? '#059669' : user.role === 'alumni' ? 'var(--blue-800)' : 'var(--blue-600)' }}>
                {user.name.charAt(0)}
              </div>
              <div className="sidebar-user-info" style={{ flex: 1 }}>
                <div className="name">{user.name}</div>
                <div className="role" style={{ textTransform: 'capitalize' }}>{user.role}</div>
              </div>
              <LogOut size={15} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
            </div>
          ) : (
            <Link to="/portal" className="sidebar-user" style={{ background: 'var(--blue-50)', borderColor: 'var(--blue-100)' }}>
              <div className="sidebar-avatar" style={{ background: 'var(--blue-600)' }}>?</div>
              <div className="sidebar-user-info" style={{ flex: 1 }}>
                <div className="name" style={{ color: 'var(--blue-700)' }}>Guest User</div>
                <div className="role">Login to portal</div>
              </div>
              <ChevronRight size={15} style={{ color: 'var(--blue-400)' }} />
            </Link>
          )}
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
            {user && (
              <button className="sidebar-link" onClick={handleLogout} style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none' }}>
                <span className="sidebar-link-icon"><LogOut size={18} /></span> Logout
              </button>
            )}
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
