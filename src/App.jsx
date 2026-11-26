import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Directory from './pages/Directory';
import Registration from './pages/Registration';
import Mentorship from './pages/Mentorship';
import Events from './pages/Events';
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
import { useAuth } from './context/AuthContext';
import { PAGE_ACCESS, homeFor } from './lib/roles';

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
