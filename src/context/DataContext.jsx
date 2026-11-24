import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import {
  initialAchievements, initialPosts, initialPendingProfiles, initialAlumniList,
  initialBroadcasts, initialEvents, initialAutomationSettings
} from '../data/seedData';

const DataContext = createContext();

// Generate birthday poster text
const generateBirthdayPoster = (name) => {
  if (name.toLowerCase() === 'rohith') {
    return `🎉 Happy Birthday Rohith! Wishing you a fantastic day filled with success, laughter, and great achievements! 🎂`;
  }
  const wishes = [
    `🎂 Happy Birthday, ${name}! Wishing you success and joy in all your endeavors!`,
    `🎉 Many happy returns of the day, ${name}! The Alumni Connect family celebrates you today!`,
    `🌟 Happy Birthday, ${name}! May this year bring you closer to your dreams!`,
  ];
  return wishes[Math.floor(Math.random() * wishes.length)];
};

export const DataProvider = ({ children }) => {
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('ac_achievements');
    if (saved && saved.includes('Hackathon')) {
      return initialAchievements;
    }
    return saved ? JSON.parse(saved) : initialAchievements;
  });

  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('ac_posts');
    if (saved && saved.includes('Engineering')) {
      return initialPosts;
    }
    return saved ? JSON.parse(saved) : initialPosts;
  });

  const [pendingProfiles, setPendingProfiles] = useState(() => {
    const saved = localStorage.getItem('ac_pending_profiles');
    if (saved && saved.includes('Developer')) {
      return initialPendingProfiles;
    }
    return saved ? JSON.parse(saved) : initialPendingProfiles;
  });

  const [alumniList, setAlumniList] = useState(() => {
    const saved = localStorage.getItem('ac_alumni_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length >= 20) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return initialAlumniList;
  });

  const [broadcasts, setBroadcasts] = useState(() => {
    const saved = localStorage.getItem('ac_broadcasts');
    return saved ? JSON.parse(saved) : initialBroadcasts;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('ac_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('ac_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [automationSettings, setAutomationSettings] = useState(() => {
    const saved = localStorage.getItem('ac_birthday_automation_settings');
    return saved ? JSON.parse(saved) : initialAutomationSettings;
  });

  const [birthdayLogs, setBirthdayLogs] = useState(() => {
    const saved = localStorage.getItem('ac_birthday_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishedAlumni, setWishedAlumni] = useState(() => {
    const saved = localStorage.getItem('ac_wished_alumni');
    return saved ? JSON.parse(saved) : {};
  });

  // ── MongoDB sync ──────────────────────────────────────────────
  // MongoDB (via /api) is the source of truth. localStorage is only an
  // offline cache so the UI still renders if the API is unreachable.
  const slices = {
    achievements, posts, pendingProfiles, alumniList, broadcasts, events,
    notifications, automationSettings, birthdayLogs, wishedAlumni
  };
  const setters = {
    achievements: setAchievements, posts: setPosts, pendingProfiles: setPendingProfiles,
    alumniList: setAlumniList, broadcasts: setBroadcasts, events: setEvents,
    notifications: setNotifications, automationSettings: setAutomationSettings,
    birthdayLogs: setBirthdayLogs, wishedAlumni: setWishedAlumni
  };
  const cacheKeys = {
    achievements: 'ac_achievements', posts: 'ac_posts', pendingProfiles: 'ac_pending_profiles',
    alumniList: 'ac_alumni_list', broadcasts: 'ac_broadcasts', events: 'ac_events',
    notifications: 'ac_notifications', automationSettings: 'ac_birthday_automation_settings',
    birthdayLogs: 'ac_birthday_logs', wishedAlumni: 'ac_wished_alumni'
  };
  const [dbStatus, setDbStatus] = useState('connecting'); // connecting | online | offline
  const lastSynced = useRef({});

  // Load everything from MongoDB once on mount
  useEffect(() => {
    let cancelled = false;
    api.get('/api/data')
      .then((data) => {
        if (cancelled) return;
        Object.entries(data).forEach(([key, value]) => {
          if (setters[key] && value !== undefined && value !== null) {
            lastSynced.current[key] = JSON.stringify(value);
            setters[key](value);
          }
        });
        setDbStatus('online');
      })
      .catch((err) => {
        console.warn('MongoDB API unreachable, using local cache:', err.message);
        if (!cancelled) setDbStatus('offline');
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Write changed slices back to MongoDB (debounced) and to the local cache
  const serialized = Object.fromEntries(Object.entries(slices).map(([k, v]) => [k, JSON.stringify(v)]));
  const serializedKey = Object.values(serialized).join('\n');
  useEffect(() => {
    Object.entries(serialized).forEach(([k, json]) => localStorage.setItem(cacheKeys[k], json));
    if (dbStatus !== 'online') return;
    const timer = setTimeout(() => {
      Object.entries(serialized).forEach(([key, json]) => {
        if (lastSynced.current[key] === json) return;
        lastSynced.current[key] = json;
        api.put(`/api/data/${key}`, JSON.parse(json))
          .catch((err) => console.error(`Failed to save ${key} to MongoDB:`, err.message));
      });
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedKey, dbStatus]);

  // Achievement CRUD
  const addAchievement = (ach) => {
    const newAch = { ...ach, id: `ach_${Date.now()}`, createdAt: new Date().toISOString() };
    setAchievements(prev => [newAch, ...prev]);
    return newAch;
  };
  const removeAchievement = (id) => setAchievements(prev => prev.filter(a => a.id !== id));

  // Post CRUD
  const addPost = (post) => {
    const newPost = { ...post, id: `post_${Date.now()}`, status: 'pending', createdAt: new Date().toISOString() };
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };
  const approvePost = (id) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        // If it is an achievement, mirror it to the public Achievements database
        if (p.isAchievement) {
          addAchievement({
            title: p.title,
            description: `${p.authorName} (Batch ${p.authorBatch}): ${p.content}`,
            category: p.category || 'General',
            date: new Date().toISOString().split('T')[0],
            postedBy: p.authorName
          });
        }
        return { ...p, status: 'approved', approvedAt: new Date().toISOString() };
      }
      return p;
    }));
  };
  const rejectPost = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
  };

  // Profile approval
  // Passwords never live in client state: the server hashes them into the
  // users collection and stores the profile (without password) in MongoDB.
  const submitProfile = async (profile) => {
    const { password, ...rest } = profile;
    const newProfile = { ...rest, id: `pp_${Date.now()}`, status: 'pending', submittedAt: new Date().toISOString() };
    if (dbStatus === 'online') {
      const saved = await api.post('/api/auth/register', { profile: newProfile, password });
      lastSynced.current.pendingProfiles = JSON.stringify([saved, ...pendingProfiles]);
      setPendingProfiles(prev => [saved, ...prev]);
      return saved;
    }
    setPendingProfiles(prev => [newProfile, ...prev]);
    return newProfile;
  };
  const approveProfile = (id) => {
    const profile = pendingProfiles.find(p => p.id === id);
    if (profile) {
      setPendingProfiles(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
      setAlumniList(prev => [...prev, { ...profile, status: 'approved' }]);
    }
  };
  const rejectProfile = (id) => {
    setPendingProfiles(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
  };

  // Events
  const registerForEvent = (eventId, userId, userName) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, registrations: [...e.registrations, { userId, userName, registeredAt: new Date().toISOString(), paymentStatus: 'completed' }] };
      }
      return e;
    }));
  };

  const unregisterFromEvent = (eventId, userId) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, registrations: e.registrations.filter(r => r.userId !== userId) };
      }
      return e;
    }));
  };

  // Broadcasts
  const addBroadcast = (bc) => {
    const newBc = { ...bc, id: `bc_${Date.now()}`, createdAt: new Date().toISOString() };
    setBroadcasts(prev => [newBc, ...prev]);
    addNotification({ type: 'broadcast', title: bc.title, message: bc.message });
    return newBc;
  };

  // Notifications
  const addNotification = (notif) => {
    const newNotif = { ...notif, id: `notif_${Date.now()}`, createdAt: new Date().toISOString(), read: false };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Birthday helpers
  const getTodayBirthdays = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return alumniList.filter(a => {
      if (!a.dob) return false;
      const dobParts = a.dob.split('-');
      return dobParts[1] === month && dobParts[2] === day;
    }).map(a => ({
      ...a,
      birthdayMessage: generateBirthdayPoster(a.name)
    }));
  };

  // Birthday wishes automation trigger
  useEffect(() => {
    if (!automationSettings.enabled) return;

    const today = new Date();
    const dateKey = today.toISOString().split('T')[0];
    const todayBirthdaysList = getTodayBirthdays();

    if (todayBirthdaysList.length === 0) return;

    setWishedAlumni(prevWished => {
      const alreadyWishedList = prevWished[dateKey] || [];
      const newWishes = todayBirthdaysList.filter(a => !alreadyWishedList.includes(a.id));

      if (newWishes.length === 0) return prevWished;

      const newLogs = [];
      const updatedWishedList = [...alreadyWishedList];

      newWishes.forEach(alumnus => {
        const replacePlaceholders = (text) => {
          return text
            .replace(/{name}/g, alumnus.name)
            .replace(/{profession}/g, alumnus.profession || 'Alumnus')
            .replace(/{company}/g, alumnus.company || 'N/A')
            .replace(/{batch}/g, alumnus.batch || 'N/A');
        };

        const emailSubject = replacePlaceholders(automationSettings.emailSubject);
        const emailBody = replacePlaceholders(automationSettings.emailBody);
        const whatsappText = replacePlaceholders(automationSettings.whatsappTemplate);

        const sentChannels = [];
        if (automationSettings.sendEmail) sentChannels.push('Email');
        if (automationSettings.sendWhatsapp) sentChannels.push('WhatsApp');

        newLogs.push({
          id: `blog_${Date.now()}_${alumnus.id}`,
          date: dateKey,
          timestamp: new Date().toISOString(),
          alumniId: alumnus.id,
          alumniName: alumnus.name,
          channels: sentChannels,
          emailSubject,
          emailBody,
          whatsappText
        });

        updatedWishedList.push(alumnus.id);
      });

      // Update logs state
      setBirthdayLogs(prevLogs => [...newLogs, ...prevLogs]);

      // Add notifications
      newLogs.forEach(log => {
        addNotification({
          type: 'birthday_auto',
          title: `🎂 Birthday Auto-Wished`,
          message: `Sent automatic birthday wishes to ${log.alumniName} via ${log.channels.join(' & ')}.`
        });
      });

      return {
        ...prevWished,
        [dateKey]: updatedWishedList
      };
    });
  }, [alumniList, automationSettings.enabled, automationSettings.sendEmail, automationSettings.sendWhatsapp, automationSettings.emailSubject, automationSettings.emailBody, automationSettings.whatsappTemplate]);

  return (
    <DataContext.Provider value={{
      achievements, addAchievement, removeAchievement,
      posts, addPost, approvePost, rejectPost,
      pendingProfiles, submitProfile, approveProfile, rejectProfile,
      alumniList, setAlumniList,
      broadcasts, addBroadcast,
      events, registerForEvent, unregisterFromEvent,
      notifications, addNotification, setNotifications,
      getTodayBirthdays,
      automationSettings, setAutomationSettings,
      birthdayLogs, setBirthdayLogs,
      wishedAlumni,
      dbStatus
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
