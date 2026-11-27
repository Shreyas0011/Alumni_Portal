import React, { createContext, useContext, useState, useEffect } from 'react';

import { api, TOKEN_KEY, USER_KEY, session } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore this tab's sign-in (sessionStorage: survives refresh, not a new tab)
    const savedUser = session.getItem(USER_KEY);
    const savedToken = session.getItem(TOKEN_KEY);
    let parsed;
    try { parsed = savedUser ? JSON.parse(savedUser) : null; } catch { parsed = null; }
    // A session needs both the user and the server-issued token (RBAC)
    if (parsed && typeof parsed === 'object' && parsed.role && savedToken) {
      // Update last login
      parsed.lastLogin = new Date().toISOString();
      setUser(parsed);
      session.setItem(USER_KEY, JSON.stringify(parsed));

      // The role comes from the database, not from what this browser saved.
      // A 401 here ends the session (see onExpired); if the API can't be
      // reached, keep the saved session so the offline cache still works.
      api.get('/api/auth/me')
        .then(({ user: fresh, token }) => {
          if (token) session.setItem(TOKEN_KEY, token);
          setUser((prev) => {
            if (!prev) return prev;
            const next = { ...prev, id: fresh.id, email: fresh.email, role: fresh.role, profileStatus: fresh.profileStatus };
            session.setItem(USER_KEY, JSON.stringify(next));
            return next;
          });
        })
        .catch(() => { /* handled by auth:expired, or offline */ });
    } else if (savedUser || savedToken) {
      // Corrupt, old-format or token-less session: drop it and sign in again
      session.removeItem(USER_KEY);
      session.removeItem(TOKEN_KEY);
    }
    setLoading(false);

    // The API reports an expired/invalid token → end the session
    const onExpired = () => {
      setUser(null);
      session.removeItem(USER_KEY);
      session.removeItem(TOKEN_KEY);
    };
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  const login = (userData, token) => {
    if (token) session.setItem(TOKEN_KEY, token);
    const enrichedUser = {
      ...userData,
      lastLogin: new Date().toISOString(),
      lastProfileUpdate: userData.lastProfileUpdate || null,
      profileStatus: userData.profileStatus || 'incomplete', // incomplete | pending | approved | rejected
      dob: userData.dob || null,
    };
    setUser(enrichedUser);
    session.setItem(USER_KEY, JSON.stringify(enrichedUser));
  };

  const updateProfile = (profileData) => {
    const changes = [];
    const fieldsToCompare = {
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      batch: 'Pass out Batch',
      branch: 'Specialization/Branch',
      bio: 'Professional Bio',
      company: 'Current Organization',
      profession: 'Job Role / Designation',
      linkedin: 'LinkedIn URL'
    };

    if (user) {
      Object.keys(fieldsToCompare).forEach(key => {
        const oldValue = user[key];
        const newValue = profileData[key];
        // Only record if value actually changed and was provided
        if (newValue !== undefined && String(newValue).trim() !== String(oldValue || '').trim()) {
          changes.push({
            field: fieldsToCompare[key],
            from: oldValue || 'Not set',
            to: newValue || 'Cleared',
            timestamp: new Date().toISOString()
          });
        }
      });
    }

    const existingHistory = user?.profileUpdatesHistory || [];
    const newHistory = [...changes, ...existingHistory];

    const updated = {
      ...user,
      ...profileData,
      lastProfileUpdate: new Date().toISOString(),
      profileStatus: user?.profileStatus || 'approved',
      profileUpdatesHistory: newHistory
    };
    setUser(updated);
    session.setItem(USER_KEY, JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    session.removeItem(USER_KEY);
    session.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
