import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('alumni_portal_user');
    let parsed;
    try { parsed = savedUser ? JSON.parse(savedUser) : null; } catch { parsed = null; }
    if (parsed && typeof parsed === 'object' && parsed.role) {
      // Update last login
      parsed.lastLogin = new Date().toISOString();
      setUser(parsed);
      localStorage.setItem('alumni_portal_user', JSON.stringify(parsed));
    } else if (savedUser) {
      // Corrupt or unexpected value: drop it instead of crashing the app
      localStorage.removeItem('alumni_portal_user');
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const enrichedUser = {
      ...userData,
      lastLogin: new Date().toISOString(),
      lastProfileUpdate: userData.lastProfileUpdate || null,
      profileStatus: userData.profileStatus || 'incomplete', // incomplete | pending | approved | rejected
      dob: userData.dob || null,
    };
    setUser(enrichedUser);
    localStorage.setItem('alumni_portal_user', JSON.stringify(enrichedUser));
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
    localStorage.setItem('alumni_portal_user', JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('alumni_portal_user');
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
