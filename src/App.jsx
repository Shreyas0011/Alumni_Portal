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
import StudentDashboard from './pages/dashboards/StudentDashboard';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';
import AlumniDashboard from './pages/dashboards/AlumniDashboard';
import { useAuth } from './context/AuthContext';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const themeClass = user ? `theme-${user.role}` : 'theme-guest';

  return (
    <div className={`app-container ${themeClass}`}>
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
    <Routes>
      <Route path="/" element={<Layout><PortalSelection /></Layout>} />
      <Route path="/home" element={<Layout><Home /></Layout>} />
      <Route path="/directory" element={<Layout><Directory /></Layout>} />
      <Route path="/register" element={<Layout><Registration /></Layout>} />
      <Route path="/mentorship" element={<Layout><Mentorship /></Layout>} />
      <Route path="/events" element={<Layout><Events /></Layout>} />
      
      {/* Portal Routes */}
      <Route path="/login/student" element={<Login role="student" />} />
      <Route path="/login/teacher" element={<Login role="teacher" />} />
      <Route path="/login/alumni" element={<Login role="alumni" />} />

      {/* Role-specific Dashboards */}
      <Route path="/student/dashboard" element={<Layout><StudentDashboard /></Layout>} />
      <Route path="/teacher/dashboard" element={<Layout><TeacherDashboard /></Layout>} />
      <Route path="/alumni/dashboard" element={<Layout><AlumniDashboard /></Layout>} />
      
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
