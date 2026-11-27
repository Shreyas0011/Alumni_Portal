import React, { useState, useEffect } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Directory from './pages/Directory';
import Registration from './pages/Registration';
import Mentorship from './pages/Mentorship';
import Events from './pages/Events';
import Jobs from './pages/Jobs';
import ExploreCampus from './pages/ExploreCampus';
import Messages from './pages/Messages';
import CareerHub from './pages/CareerHub';
import Yearbook from './pages/Yearbook';
import SearchPalette from './components/SearchPalette';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import RequestAccess from './pages/RequestAccess';
import ProfileCompletion from './pages/ProfileCompletion';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import AlumniDashboard from './pages/dashboards/AlumniDashboard';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';
import AnimatedBackground from './components/AnimatedBackground';
import RequireRole from './components/RequireRole';
import ScrollToTop from './components/ScrollToTop';
import './components/Landing.css';
import { useAuth } from './context/AuthContext';
import { PAGE_ACCESS, homeFor } from './lib/roles';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const themeClass = user ? `theme-${user.role}` : 'theme-guest';
  // Hide / show the sidebar (remembered in this browser)
  const [sidebarHidden, setSidebarHidden] = useState(() => localStorage.getItem('ac_sidebar_hidden') === '1');
  useEffect(() => { localStorage.setItem('ac_sidebar_hidden', sidebarHidden ? '1' : '0'); }, [sidebarHidden]);

  return (
    <div className={`app-container ${themeClass} ${sidebarHidden ? 'sidebar-hidden' : ''}`} style={{ position: 'relative', zIndex: 1 }}>
      <Navbar hidden={sidebarHidden} />
      <button
        type="button"
        className="sidebar-toggle"
        style={{ left: sidebarHidden ? '0.75rem' : '245px' }}
        onClick={() => setSidebarHidden(h => !h)}
        aria-label={sidebarHidden ? 'Show sidebar' : 'Hide sidebar'}
        title={sidebarHidden ? 'Show sidebar' : 'Hide sidebar'}
      >
        {sidebarHidden ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
      </button>
      <div className="main-wrapper">
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

// Sign-in is the first page; signed-in users go straight to their own portal
const Gateway = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to={homeFor(user)} replace /> : <Login />;
};

// Page wrapped in the sidebar layout and guarded by role
const guarded = (path, page, { layout = true } = {}) => (
  <RequireRole roles={PAGE_ACCESS[path]}>
    {layout ? <Layout>{page}</Layout> : page}
  </RequireRole>
);

function App() {
  return (
    <>
      <ScrollToTop />
      <SearchPalette />
      <AnimatedBackground />
      <Routes>
        {/* Sign-in gateway */}
        <Route path="/" element={<Gateway />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/login/:role" element={<Navigate to="/" replace />} />
        <Route path="/request-access" element={<RequestAccess />} />
        <Route path="/register" element={<Layout><Registration /></Layout>} />

        {/* Shared pages (role-checked) */}
        <Route path="/directory" element={guarded('/directory', <Directory />)} />
        <Route path="/mentorship" element={guarded('/mentorship', <Mentorship />)} />
        <Route path="/events" element={guarded('/events', <Events />)} />
        <Route path="/jobs" element={guarded('/jobs', <Jobs />)} />
        <Route path="/campus" element={guarded('/campus', <ExploreCampus />)} />
        <Route path="/messages" element={guarded('/messages', <Messages />)} />
        <Route path="/career" element={guarded('/career', <CareerHub />)} />
        <Route path="/yearbook" element={guarded('/yearbook', <Yearbook />)} />

        {/* Role portals */}
        <Route path="/profile/complete" element={guarded('/profile/complete', <ProfileCompletion />)} />
        <Route path="/student/dashboard" element={guarded('/student/dashboard', <StudentDashboard />)} />
        <Route path="/alumni/dashboard" element={guarded('/alumni/dashboard', <AlumniDashboard />)} />
        <Route path="/professor/dashboard" element={guarded('/professor/dashboard', <TeacherDashboard />)} />
        <Route path="/admin" element={guarded('/admin', <AdminDashboard />)} />

        {/* Anything else (including the removed About Platform page) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
