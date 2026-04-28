import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, GraduationCap, Calendar, UserPlus, Menu, X, Globe, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Directory', path: '/directory', icon: <Users size={20} /> },
    { name: 'Mentorship', path: '/mentorship', icon: <GraduationCap size={20} /> },
    { name: 'Events', path: '/events', icon: <Calendar size={20} /> },
    { name: 'Register', path: '/register', icon: <UserPlus size={20} /> },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          <Globe className="logo-icon" size={28} />
          <span>Alumni<span>Connect</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links desktop-only">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
          
          <Link to="/admin" className="btn btn-outline btn-sm admin-btn">
            <User size={18} />
            <span>Admin Portal</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <Link 
            key={link.path} 
            to={link.path} 
            onClick={() => setIsOpen(false)}
            className={`mobile-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.name}
          </Link>
        ))}
        <Link to="/admin" onClick={() => setIsOpen(false)} className="mobile-link">
          Admin Portal
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
