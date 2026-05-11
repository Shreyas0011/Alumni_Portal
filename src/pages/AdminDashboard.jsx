import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Calendar, Shield, ArrowUpRight, Search } from 'lucide-react';
import { CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard" style={{ background: 'var(--bg-dark)', minHeight: '100vh', padding: '4rem' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}
        >
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Admin <span className="text-gradient">Command</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>Overview of the Alumni Connect Portal ecosystem performance and growth.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="glass" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Search size={18} color="var(--text-dim)" />
              <input type="text" placeholder="Global search..." style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', outline: 'none' }} />
            </div>
            <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              Export Report
            </button>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {[
            { label: 'Total Users', value: '12,482', change: '+12%', icon: <Users /> },
            { label: 'Pending Apps', value: '148', change: '-5%', icon: <FileText /> },
            { label: 'Active Events', value: '24', change: '+2', icon: <Calendar /> },
            { label: 'Security Score', value: '98%', change: 'Stable', icon: <Shield /> }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              className="glass"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              style={{ padding: '2.5rem', borderRadius: '20px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div style={{ color: 'var(--primary)', background: 'var(--primary-glow)', padding: '0.75rem', borderRadius: '12px' }}>
                  {stat.icon}
                </div>
                <div style={{ color: stat.change.startsWith('+') ? '#10b981' : '#ef4444', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  {stat.change}
                  <ArrowUpRight size={14} />
                </div>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{stat.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <motion.div 
            className="glass"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ padding: '3rem', borderRadius: '24px', height: '400px' }}
          >
            <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem' }}>Growth Analytics</h3>
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-dim)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid var(--border-subtle)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: 'var(--primary)' }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--primary)" fillOpacity={1} fill="url(#colorValue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div 
            className="glass"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ padding: '3rem', borderRadius: '24px' }}
          >
            <h3 style={{ marginBottom: '2rem', fontSize: '1.25rem' }}>Recent Applications</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { name: "Alice Zhang", role: "DevOps Engineer", time: "2m ago" },
                { name: "Bob Smith", role: "Product Manager", time: "15m ago" },
                { name: "Charlie Day", role: "Lead Designer", time: "1h ago" },
                { name: "Diana Prince", role: "Legal Counsel", time: "3h ago" }
              ].map((app, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: i !== 3 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{app.name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>{app.role}</div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{app.time}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-outline" style={{ width: '100%', marginTop: '2rem' }}>
              Review All
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
