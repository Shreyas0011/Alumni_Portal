import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Directory from './pages/Directory';
import Registration from './pages/Registration';
import Mentorship from './pages/Mentorship';
import Events from './pages/Events';
import AdminDashboard from './pages/AdminDashboard';
import PortalSelection from './pages/PortalSelection';
import Login from './pages/Login';
import RequestAccess from './pages/RequestAccess';
import ProfileCompletion from './pages/ProfileCompletion';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import AlumniDashboard from './pages/dashboards/AlumniDashboard';
import AnimatedBackground from './components/AnimatedBackground';
import { useAuth } from './context/AuthContext';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const themeClass = user ? `theme-${user.role}` : 'theme-guest';

  return (
    <div className={`app-container ${themeClass}`} style={{ position: 'relative', zIndex: 1 }}>
      <Navbar />
      <div className="main-wrapper">
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <>
      <AnimatedBackground />
      <Routes>
        <Route path="/" element={<Layout><PortalSelection /></Layout>} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/directory" element={<Layout><Directory /></Layout>} />
        <Route path="/register" element={<Layout><Registration /></Layout>} />
        <Route path="/mentorship" element={<Layout><Mentorship /></Layout>} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        
        {/* Portal Routes */}
        {/* Overall360 unified gateway — role comes from the account in MongoDB */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/request-access" element={<RequestAccess />} />

        {/* Profile Completion */}
        <Route path="/profile/complete" element={<Layout><ProfileCompletion /></Layout>} />

        {/* Role-specific Dashboards */}
        <Route path="/student/dashboard" element={<Layout><StudentDashboard /></Layout>} />
        <Route path="/alumni/dashboard" element={<Layout><AlumniDashboard /></Layout>} />
        
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;
