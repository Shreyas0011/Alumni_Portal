import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageCircle, X, UserPlus } from 'lucide-react';

const NotificationToast = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Initial notifications after 2 seconds
    const timer1 = setTimeout(() => {
      addNotification({
        id: 1,
        type: 'connection',
        title: 'New Connection Request',
        message: 'Rahul Sharma (Student) wants to connect.',
        icon: <UserPlus size={18} />
      });
    }, 2000);

    const timer2 = setTimeout(() => {
      addNotification({
        id: 2,
        type: 'message',
        title: 'New Message',
        message: 'Prof. Gupta sent you a message about the guest lecture.',
        icon: <MessageCircle size={18} />
      });
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const addNotification = (notif) => {
    setNotifications(prev => [...prev, notif]);
    // Auto-remove after 6 seconds
    setTimeout(() => {
      removeNotification(notif.id);
    }, 8000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <AnimatePresence>
        {notifications.map(n => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            style={{ 
              background: '#fff', 
              borderRadius: '16px', 
              padding: '1rem 1.25rem', 
              width: '320px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              border: '1px solid var(--border)',
              display: 'flex',
              gap: '1rem',
              position: 'relative'
            }}
          >
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              background: n.type === 'connection' ? 'var(--blue-50)' : '#ecfdf5', 
              color: n.type === 'connection' ? 'var(--blue-600)' : '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {n.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{n.title}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{n.message}</div>
            </div>
            <button 
              onClick={() => removeNotification(n.id)}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
