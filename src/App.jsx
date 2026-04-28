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

const Layout = ({ children }) => {
  return (
    <div className="app-container">
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
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/directory" element={<Layout><Directory /></Layout>} />
      <Route path="/register" element={<Layout><Registration /></Layout>} />
      <Route path="/mentorship" element={<Layout><Mentorship /></Layout>} />
      <Route path="/events" element={<Layout><Events /></Layout>} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
