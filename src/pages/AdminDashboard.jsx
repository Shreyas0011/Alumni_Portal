import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, UserPlus, MessageCircle, Calendar, 
  BarChart3, Settings, LogOut, Search, Bell, ChevronDown 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { icon: <Users size={20} />, label: 'Alumni Records' },
    { icon: <UserPlus size={20} />, label: 'Pending Approvals' },
    { icon: <MessageCircle size={20} />, label: 'Mentorship Requests' },
    { icon: <Calendar size={20} />, label: 'Events' },
    { icon: <BarChart3 size={20} />, label: 'Analytics' },
    { icon: <Settings size={20} />, label: 'Settings' },
  ];

  // Dummy data for charts (empty look)
  const chartData = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 0 },
    { name: 'Mar', value: 0 },
    { name: 'Apr', value: 0 },
    { name: 'May', value: 0 },
    { name: 'Jun', value: 0 },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">AC</div>
          <span>Admin Portal</span>
        </div>
        
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <button 
              key={item.label}
              className={`sidebar-item ${activeTab === item.label ? 'active' : ''}`}
              onClick={() => setActiveTab(item.label)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-item logout">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-search">
            <Search size={18} />
            <input type="text" placeholder="Search records..." />
          </div>
          <div className="header-actions">
            <button className="header-btn"><Bell size={20} /></button>
            <div className="admin-profile">
              <div className="profile-img">AD</div>
              <span>Admin</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <div className="admin-content">
          <div className="content-header">
            <h1>{activeTab}</h1>
            <button className="btn btn-primary btn-sm">Export Data</button>
          </div>

          <div className="dashboard-stats">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="stat-widget card">
                <div className="widget-header">
                  <div className="placeholder-circle"></div>
                  <div className="placeholder-line w-40"></div>
                </div>
                <div className="widget-value-placeholder"></div>
                <div className="widget-footer-placeholder"></div>
              </div>
            ))}
          </div>

          <div className="dashboard-grid">
            <div className="chart-container card">
              <h3>Registration Trends</h3>
              <div className="chart-placeholder">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" stroke="#2563eb" fill="#dbeafe" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="table-container card">
              <h3>Recent Registrations</h3>
              <div className="placeholder-table">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="table-row-placeholder">
                    <div className="col-img"></div>
                    <div className="col-text w-40"></div>
                    <div className="col-text w-20"></div>
                    <div className="col-tag"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
