import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin, Users, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="logo">
            <Globe className="logo-icon" />
            <span>Alumni<span>Connect</span></span>
          </Link>
          <p className="footer-desc">
            Connecting generations of excellence and fostering a lifelong network of professional and personal growth.
          </p>
          <div className="social-links">
            <a href="#"><Globe size={20} /></a>
            <a href="#"><Users size={20} /></a>
            <a href="#"><MessageCircle size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/directory">Alumni Directory</Link></li>
            <li><Link to="/mentorship">Mentorship</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/register">Join Network</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <ul>
            <li><Mail size={18} /> info@alumniconnect.edu</li>
            <li><Phone size={18} /> +1 (555) 000-0000</li>
            <li><MapPin size={18} /> 123 University Ave, Campus City</li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for latest news and events.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email address" />
            <button type="submit" className="btn btn-primary btn-sm">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} AlumniConnect. All rights reserved.</p>
          <div className="bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
