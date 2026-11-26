import React, { useState } from 'react';
import BrandLogo from './BrandLogo';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, GraduationCap, Calendar, Menu, X, ShieldCheck, ChevronRight, LogOut, LayoutGrid } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { homeFor, canAccess, isAdminRole, ROLE_LABELS } from '../lib/roles';

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
    { name: 'Directory', path: '/directory', icon: <Users size={18} />, badge: 'New' },
    { name: 'Mentorship', path: '/mentorship', icon: <GraduationCap size={18} /> },
    { name: 'Events', path: '/events', icon: <Calendar size={18} />, badge: '3' },
  ];

  // Only the pages this role may open (RBAC, see src/lib/roles.js)
  const getRoleLinks = () => {
    if (!user) return [];
    const home = homeFor(user);
    const links = isAdminRole(user.role)
      ? []
      : [{ name: 'Dashboard', path: home, icon: <LayoutGrid size={18} /> }];
    return [...links, ...baseLinks.filter(l => canAccess(user, l.path))];
  };

  const homePath = homeFor(user);
  const labels = user ? ROLE_LABELS[user.role] : null;
  const showAdmin = Boolean(user) && isAdminRole(user.role);

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
          <Link to={homePath} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.625rem', textDecoration:'none' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
              <BrandLogo width={176} />
            </motion.div>
            <div className="sidebar-brand-text">
              <div className="title">
                {labels ? labels.portal : 'Alumni Connect'}
              </div>
              <div className="sub">
                {labels ? labels.tagline : 'Portal · Transcend'}
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

          {showAdmin && (
            <>
              <div className="sidebar-section-label" style={{ marginTop: '0.5rem' }}>Administration</div>
              <Link to="/admin" className={`sidebar-link ${loc.pathname === '/admin' ? 'active' : ''}`}>
                <span className="sidebar-link-icon"><ShieldCheck size={18} /></span>
                <span className="sidebar-link-text">Admin Portal</span>
              </Link>
            </>
          )}
        </div>

        {/* Bottom user widget */}
        <div className="sidebar-footer">
          {user ? (
            <div className="sidebar-user" style={{ cursor: 'pointer' }} onClick={handleLogout} title="Click to logout">
              <div className="sidebar-avatar" style={{ background: isAdminRole(user.role) ? '#1e293b' : 'var(--blue-800)' }}>
                {user.name.charAt(0)}
              </div>
              <div className="sidebar-user-info" style={{ flex: 1 }}>
                <div className="name">{user.name}</div>
                <div className="role">{labels?.name}</div>
              </div>
              <LogOut size={15} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
            </div>
          ) : (
            <Link to="/" className="sidebar-user" style={{ background: 'var(--blue-50)', borderColor: 'var(--blue-100)' }}>
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
        <Link to={homePath} style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
          <BrandLogo width={118} />
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
            {showAdmin && (
              <Link to="/admin" className="sidebar-link" onClick={() => setMobileOpen(false)}>
                <span className="sidebar-link-icon"><ShieldCheck size={18} /></span> Admin Portal
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
