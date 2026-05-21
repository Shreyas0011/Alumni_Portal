import React, { createContext, useContext, useState, useEffect } from 'react';

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

const initialAchievements = [
  {
    id: 'ach1',
    title: 'NAAC A++ Accreditation Renewed',
    description: 'Our institution has successfully renewed its NAAC A++ accreditation, reaffirming our commitment to academic excellence in business and commerce studies.',
    date: '2026-03-15',
    category: 'Accreditation',
    postedBy: 'admin',
    createdAt: '2026-03-15T10:00:00Z'
  },
  {
    id: 'ach2',
    title: 'National Commerce & Case Study Championship - First Place',
    description: 'Our students won the National Case Study Challenge held at SRCC Delhi, competing against 500+ teams from elite business schools.',
    date: '2026-04-20',
    category: 'Competition',
    postedBy: 'admin',
    createdAt: '2026-04-20T14:30:00Z'
  },
  {
    id: 'ach3',
    title: 'Bloomberg Terminal Hub Inauguration',
    description: 'A state-of-the-art financial markets simulation lab equipped with 12 Bloomberg Terminals was inaugurated to enhance hands-on investment research.',
    date: '2026-05-01',
    category: 'Infrastructure',
    postedBy: 'admin',
    createdAt: '2026-05-01T09:00:00Z'
  }
];

const initialPosts = [
  {
    id: 'post1',
    authorId: 'demo-alumni-1',
    authorName: 'Priya Sharma',
    authorBatch: '2018',
    content: 'Thrilled to share that I have been promoted to Investment Banking Vice President at Goldman Sachs! Grateful to our business faculty for laying the foundation.',
    status: 'approved',
    createdAt: '2026-05-10T08:00:00Z',
    approvedAt: '2026-05-10T10:00:00Z'
  },
  {
    id: 'post2',
    authorId: 'demo-alumni-2',
    authorName: 'Rahul Mehta',
    authorBatch: '2020',
    content: 'Looking for commerce mentees interested in Corporate Taxation and GST Audit. Happy to guide final year students through CA and CFA preparation.',
    status: 'approved',
    createdAt: '2026-05-12T14:00:00Z',
    approvedAt: '2026-05-12T15:30:00Z'
  }
];

const initialPendingProfiles = [
  {
    id: 'pp1',
    name: 'Anita Desai',
    email: 'anita.desai@gmail.com',
    batch: '2019',
    dob: '1997-08-15',
    profession: 'Corporate Auditor',
    company: 'Deloitte',
    phone: '9876543210',
    linkedin: 'linkedin.com/in/anitadesai',
    bio: 'Audit and compliance professional with 5+ years of experience in statutory audits and financial reporting.',
    status: 'pending',
    submittedAt: '2026-05-18T11:00:00Z'
  },
  {
    id: 'pp2',
    name: 'Vikram Singh',
    email: 'vikram.s@outlook.com',
    batch: '2021',
    dob: '1999-03-22',
    profession: 'Investment Analyst',
    company: 'Ernst & Young',
    phone: '8765432109',
    linkedin: 'linkedin.com/in/vikramsingh',
    bio: 'Equity research analyst passionate about value investing and portfolio valuation.',
    status: 'pending',
    submittedAt: '2026-05-19T09:30:00Z'
  }
];

const initialAlumniList = [
  {
    id: 'al1',
    name: 'Priya Sharma',
    email: 'priya@goldman.com',
    role: 'alumni',
    dob: new Date().toISOString().split('T')[0],
    college: 'Transcend College of Commerce',
    degree: 'B.Com Accounts & Finance',
    fieldOfStudy: 'Financial Analysis',
    eduStartYear: '2015',
    eduEndYear: '2018',
    batch: '2018',
    profession: 'IB Vice President',
    company: 'Goldman Sachs',
    linkedin: 'https://linkedin.com/in/priyasharmapremium',
    skills: 'Valuation, M&A, Equity Research',
    bio: 'Investment Banking VP at Goldman Sachs. Gladly mentors final-year students on investment portfolios and valuation frameworks.'
  },
  {
    id: 'al2',
    name: 'Rahul Mehta',
    email: 'rahul@kpmg.com',
    role: 'alumni',
    dob: '1998-12-25',
    college: 'Transcend College of Commerce',
    degree: 'B.Com Honors',
    fieldOfStudy: 'Auditing and Assurance',
    eduStartYear: '2017',
    eduEndYear: '2020',
    batch: '2020',
    profession: 'Audit Partner',
    company: 'KPMG',
    linkedin: 'https://linkedin.com/in/rahulmehtacagst',
    skills: 'Taxation, Auditing, GST Compliance',
    bio: 'CA and Audit Partner at KPMG. Offers audit readiness guides, tax advice, and CA exam preparation paths.'
  },
  {
    id: 'al3',
    name: 'Sneha Reddy',
    email: 'sneha@pwc.com',
    role: 'alumni',
    dob: new Date().toISOString().split('T')[0],
    college: 'Transcend College of Commerce',
    degree: 'B.Com Corporate Secretaryship',
    fieldOfStudy: 'Corporate Law',
    eduStartYear: '2014',
    eduEndYear: '2017',
    batch: '2017',
    profession: 'Tax Manager',
    company: 'PwC',
    linkedin: 'https://linkedin.com/in/snehareddytax',
    skills: 'CFA, International Taxation, Corporate Law',
    bio: 'Tax Manager at PwC, specializing in transfer pricing and cross-border taxation. Enthusiastic about mentorship.'
  },
  {
    id: 'al4',
    name: 'Arjun Patel',
    email: 'arjun@hdfc.com',
    role: 'alumni',
    dob: '1997-07-04',
    college: 'Transcend College of Commerce',
    degree: 'M.Com Finance & Taxation',
    fieldOfStudy: 'Financial Management',
    eduStartYear: '2017',
    eduEndYear: '2019',
    batch: '2019',
    profession: 'Financial Controller',
    company: 'HDFC Bank',
    linkedin: 'https://linkedin.com/in/arjunpatelfin',
    skills: 'Treasury Management, Corporate Finance',
    bio: 'Financial Controller at HDFC Bank. Specialist in liquidity planning, retail banking, and capital structure.'
  },
  {
    id: 'al5',
    name: 'Rohith',
    email: 'rohith@ey.com',
    role: 'alumni',
    dob: '2004-05-21',
    college: 'Transcend College of Commerce',
    degree: 'B.Com Professional Accounting',
    fieldOfStudy: 'Accounting Systems',
    eduStartYear: '2023',
    eduEndYear: '2026',
    batch: '2026',
    profession: 'Chartered Accountant',
    company: 'Ernst & Young',
    linkedin: 'https://linkedin.com/in/rohithcaey',
    skills: 'Financial Accounting, Audit, IFRS',
    bio: 'Newly qualified CA working at EY. Eager to help final year students crack CA finals.'
  },
  {
    id: 'al6',
    name: 'Anita Desai',
    email: 'anita.desai@deloitte.com',
    role: 'alumni',
    dob: '1997-08-15',
    college: 'Transcend College of Commerce',
    degree: 'BBA Finance',
    fieldOfStudy: 'Audit & Compliance',
    eduStartYear: '2016',
    eduEndYear: '2019',
    batch: '2019',
    profession: 'Senior Corporate Auditor',
    company: 'Deloitte',
    linkedin: 'https://linkedin.com/in/anitadesaiaudit',
    skills: 'Statutory Audit, Compliance, Risk Management',
    bio: 'Audit and compliance partner with 5+ years of experience in statutory audits.'
  },
  {
    id: 'al7',
    name: 'Vikram Singh',
    email: 'vikram.singh@ey.com',
    role: 'alumni',
    dob: '1999-03-22',
    college: 'Transcend College of Commerce',
    degree: 'MBA Financial Management',
    fieldOfStudy: 'Investment Analysis',
    eduStartYear: '2019',
    eduEndYear: '2021',
    batch: '2021',
    profession: 'Senior Investment Analyst',
    company: 'Ernst & Young',
    linkedin: 'https://linkedin.com/in/vikramsinghpe',
    skills: 'Equity Research, Portfolio Valuation, M&A',
    bio: 'Equity research analyst passionate about value investing and portfolio valuation.'
  },
  {
    id: 'al8',
    name: 'Meera Iyer',
    email: 'meera.iyer@jpmorgan.com',
    role: 'alumni',
    dob: '1998-11-12',
    college: 'Transcend College of Commerce',
    degree: 'B.Com Honors',
    fieldOfStudy: 'Treasury & Wealth Management',
    eduStartYear: '2015',
    eduEndYear: '2018',
    batch: '2018',
    profession: 'Treasury Manager',
    company: 'JP Morgan Chase',
    linkedin: 'https://linkedin.com/in/meeraiyertreasury',
    skills: 'Cash Management, FX Risk, Asset Valuation',
    bio: 'Treasury Manager at JPMC. Experienced in liquidity forecasting and foreign exchange risk management.'
  },
  {
    id: 'al9',
    name: 'Kabir Malhotra',
    email: 'kabir@pwc.com',
    role: 'alumni',
    dob: '2000-04-10',
    college: 'Transcend College of Commerce',
    degree: 'B.Com Accounts & Finance',
    fieldOfStudy: 'Indirect Taxes',
    eduStartYear: '2019',
    eduEndYear: '2022',
    batch: '2022',
    profession: 'Senior Tax Associate',
    company: 'PwC',
    linkedin: 'https://linkedin.com/in/kabirmalhotrapwc',
    skills: 'GST, Corporate Taxation, Auditing',
    bio: 'Tax consultant focusing on corporate tax restructuring and audit readiness.'
  },
  {
    id: 'al10',
    name: 'Tanvi Joshi',
    email: 'tanvi.joshi@mckinsey.com',
    role: 'alumni',
    dob: '1998-09-02',
    college: 'Transcend College of Commerce',
    degree: 'M.Com Finance',
    fieldOfStudy: 'Strategic Business Management',
    eduStartYear: '2018',
    eduEndYear: '2020',
    batch: '2020',
    profession: 'Management Consultant',
    company: 'McKinsey & Company',
    linkedin: 'https://linkedin.com/in/tanvijoshipartner',
    skills: 'Strategy Consulting, Corporate Finance, Business Case Studies',
    bio: 'Strategic advisor helping Fortune 500 companies optimize capital structure and scale operations.'
  },
  {
    id: 'al11',
    name: 'Rohan Goel',
    email: 'rohan.goel@blackstone.com',
    role: 'alumni',
    dob: '1999-06-25',
    college: 'Transcend College of Commerce',
    degree: 'B.Com Honors',
    fieldOfStudy: 'Asset Management',
    eduStartYear: '2018',
    eduEndYear: '2021',
    batch: '2021',
    profession: 'Private Equity Associate',
    company: 'Blackstone Group',
    linkedin: 'https://linkedin.com/in/rohangoelequity',
    skills: 'Leveraged Buyouts, Valuation, Private Equity',
    bio: 'PE professional. Guide students on financial modeling, business valuation, and investment theses.'
  },
  {
    id: 'al12',
    name: 'Ananya Gupta',
    email: 'ananya.gupta@unilever.com',
    role: 'alumni',
    dob: '1998-05-18',
    college: 'Transcend College of Commerce',
    degree: 'BBA Finance',
    fieldOfStudy: 'Corporate Strategy',
    eduStartYear: '2017',
    eduEndYear: '2020',
    batch: '2020',
    profession: 'Commercial Finance Partner',
    company: 'Unilever',
    linkedin: 'https://linkedin.com/in/ananyaguptacorp',
    skills: 'Budgeting, FMCG Finance, Cost Analysis',
    bio: 'Overseeing financial planning and commercial strategy for major food and beverage brands at Unilever.'
  },
  {
    id: 'al13',
    name: 'Shreyas Nair',
    email: 'shreyas.student@commerce.edu',
    role: 'student',
    dob: '2005-02-14',
    college: 'Transcend College of Commerce',
    degree: 'B.Com Accounts & Finance',
    fieldOfStudy: 'Accounting Systems',
    eduStartYear: '2024',
    eduEndYear: '2027',
    batch: '2027',
    profession: 'Undergraduate Student',
    company: 'Transcend College of Commerce',
    linkedin: 'https://linkedin.com/in/shreyasnairtest',
    skills: 'Financial Auditing, Valuation',
    bio: 'Commerce undergraduate student eager to connect with industry experts and CA mentors.'
  },
  {
    id: 'al14',
    name: 'Divya Pillai',
    email: 'divya.student@commerce.edu',
    role: 'student',
    dob: '2005-08-20',
    college: 'Transcend College of Commerce',
    degree: 'B.Com Honors',
    fieldOfStudy: 'Finance & Investments',
    eduStartYear: '2024',
    eduEndYear: '2027',
    batch: '2027',
    profession: 'Undergraduate Student',
    company: 'Transcend College of Commerce',
    linkedin: 'https://linkedin.com/in/divyapillaicfa',
    skills: 'Case Competitions, Corporate Finance',
    bio: 'Final year B.Com student preparing for CFA Level 1. Winner of the SRCC Delhi Case Study competition.'
  },
  {
    id: 'al15',
    name: 'Karan Shah',
    email: 'karan.student@commerce.edu',
    role: 'student',
    dob: '2005-03-30',
    college: 'Transcend College of Commerce',
    degree: 'BBA Finance',
    fieldOfStudy: 'Portfolio Management',
    eduStartYear: '2024',
    eduEndYear: '2027',
    batch: '2027',
    profession: 'Undergraduate Student',
    company: 'Transcend College of Commerce',
    linkedin: 'https://linkedin.com/in/karanshahmarket',
    skills: 'Stock Valuations, Asset Management',
    bio: 'Aspiring fund manager active in the college Investment Club.'
  },
  {
    id: 'al16',
    name: 'Aisha Siddiqui',
    email: 'aisha.student@commerce.edu',
    role: 'student',
    dob: '2006-07-04',
    college: 'Transcend College of Commerce',
    degree: 'B.Com Professional Accounting',
    fieldOfStudy: 'Tax Systems',
    eduStartYear: '2025',
    eduEndYear: '2028',
    batch: '2028',
    profession: 'Undergraduate Student',
    company: 'Transcend College of Commerce',
    linkedin: 'https://linkedin.com/in/aishasiddiquitax',
    skills: 'GST, Accounting Standard Analysis',
    bio: 'Second-year commerce student interested in taxation law and statutory auditing.'
  },
  {
    id: 'al17',
    name: 'Nehal Sharma',
    email: 'nehal.student@commerce.edu',
    role: 'student',
    dob: '2004-11-22',
    college: 'Transcend College of Commerce',
    degree: 'M.Com Finance',
    fieldOfStudy: 'International Finance',
    eduStartYear: '2025',
    eduEndYear: '2027',
    batch: '2027',
    profession: 'Graduate Student',
    company: 'Transcend College of Commerce',
    linkedin: 'https://linkedin.com/in/nehalsharmadouble',
    skills: 'Financial Econometrics, Statistical Models',
    bio: 'Graduate commerce student analyzing macro-economic trends and international bond markets.'
  },
  {
    id: 'al18',
    name: 'Aditya Rao',
    email: 'aditya.student@commerce.edu',
    role: 'student',
    dob: '2005-09-17',
    college: 'Transcend College of Commerce',
    degree: 'B.Com Corporate Secretaryship',
    fieldOfStudy: 'Corporate Governance',
    eduStartYear: '2024',
    eduEndYear: '2027',
    batch: '2027',
    profession: 'Undergraduate Student',
    company: 'Transcend College of Commerce',
    linkedin: 'https://linkedin.com/in/adityaraocs',
    skills: 'Company Law, Compliance Management',
    bio: 'Preparing for Company Secretary (CS) exams alongside college courses.'
  },
  {
    id: 'al19',
    name: 'Pranav Joshi',
    email: 'pranav.student@commerce.edu',
    role: 'student',
    dob: '2006-12-05',
    college: 'Transcend College of Commerce',
    degree: 'BBA Finance & Marketing',
    fieldOfStudy: 'Venture Capital',
    eduStartYear: '2025',
    eduEndYear: '2028',
    batch: '2028',
    profession: 'Undergraduate Student',
    company: 'Transcend College of Commerce',
    linkedin: 'https://linkedin.com/in/pranavjoshivc',
    skills: 'Market Research, Pitch Decks',
    bio: 'Founder of the student startup incubator. Interested in fintech products.'
  },
  {
    id: 'al20',
    name: 'Ritika Sen',
    email: 'ritika.student@commerce.edu',
    role: 'student',
    dob: '2005-05-30',
    college: 'Transcend College of Commerce',
    degree: 'B.Com Computer Applications',
    fieldOfStudy: 'Financial Software',
    eduStartYear: '2024',
    eduEndYear: '2027',
    batch: '2027',
    profession: 'Undergraduate Student',
    company: 'Transcend College of Commerce',
    linkedin: 'https://linkedin.com/in/ritikasensql',
    skills: 'Python for Finance, Tally, SQL',
    bio: 'Bridging the gap between financial ledger management and analytics software development.'
  }
];

const initialBroadcasts = [
  {
    id: 'bc1',
    title: 'Annual Alumni Meet 2026',
    message: 'We are excited to announce the Annual Alumni Meet on June 15, 2026 at the main campus. All alumni are cordially invited.',
    priority: 'high',
    createdAt: '2026-05-15T08:00:00Z',
    sentVia: ['email', 'whatsapp']
  }
];

const initialEvents = [
  {
    id: 'evt1',
    title: 'Global Corporate Finance & Tax Summit 2026',
    date: '2026-06-15',
    time: '10:00 AM - 4:00 PM',
    location: 'Main Campus Auditorium',
    category: 'Summit',
    description: 'Join top financial leaders, bankers, and tax consultants for networking and career insights.',
    fee: 500,
    maxCapacity: 200,
    registrations: [],
    image: 'https://placehold.co/800x400/1e3a8a/ffffff?text=Finance+Summit+2026',
    featured: true
  },
  {
    id: 'evt2',
    title: 'Homecoming Weekend & Gala Dinner',
    date: '2026-07-12',
    time: '6:30 PM Onwards',
    location: 'Grand Hall',
    category: 'Reunion',
    description: 'Celebrate with a grand gala dinner, business networking, and guest performances.',
    fee: 2000,
    maxCapacity: 150,
    registrations: [],
    image: 'https://placehold.co/800x400/1d4ed8/ffffff?text=Gala+Dinner'
  },
  {
    id: 'evt3',
    title: 'Mergers & Acquisitions Valuation Workshop',
    date: '2026-08-05',
    time: '2:00 PM - 5:00 PM',
    location: 'Virtual',
    category: 'Workshop',
    description: 'Master asset pricing and corporate evaluation techniques under industry veterans.',
    fee: 0,
    maxCapacity: 100,
    registrations: [],
    image: 'https://placehold.co/800x400/2563eb/ffffff?text=M+And+A+Workshop'
  },
  {
    id: 'evt4',
    title: 'Alumni Investment Pitch Night',
    date: '2026-09-18',
    time: '5:00 PM - 8:00 PM',
    location: 'Finance Innovation Hub',
    category: 'Networking',
    description: 'Watch alumni founders and finance executives present projects to venture funds and angels.',
    fee: 300,
    maxCapacity: 80,
    registrations: [],
    image: 'https://placehold.co/800x400/1e3a8a/ffffff?text=Pitch+Night'
  }
];

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
    return saved ? JSON.parse(saved) : {
      enabled: true,
      sendEmail: true,
      sendWhatsapp: true,
      emailSubject: 'Happy Birthday from Commerce Alumni Connect, {name}! 🎂',
      emailBody: `Dear {name},\n\nOn behalf of the Commerce Alumni Association, we wish you a fantastic and very Happy Birthday! 🎂✨\n\nWe celebrate your achievements as a {profession} at {company} and are proud to have you as part of our commerce legacy.\n\nMay the year ahead bring you closer to your professional goals, with continued growth, prosperity, and joy!\n\nBest regards,\nCommerce Alumni Connect Team`,
      whatsappTemplate: `🎉 *Happy Birthday, {name}!* 🎂\n\nOn behalf of the Commerce Alumni Association, we wish you a fantastic day filled with success, laughter, and great achievements! 🌟\n\n- Transcend Alumni Connect Team`
    };
  });

  const [birthdayLogs, setBirthdayLogs] = useState(() => {
    const saved = localStorage.getItem('ac_birthday_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishedAlumni, setWishedAlumni] = useState(() => {
    const saved = localStorage.getItem('ac_wished_alumni');
    return saved ? JSON.parse(saved) : {};
  });

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('ac_achievements', JSON.stringify(achievements)); }, [achievements]);
  useEffect(() => { localStorage.setItem('ac_posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('ac_pending_profiles', JSON.stringify(pendingProfiles)); }, [pendingProfiles]);
  useEffect(() => { localStorage.setItem('ac_alumni_list', JSON.stringify(alumniList)); }, [alumniList]);
  useEffect(() => { localStorage.setItem('ac_broadcasts', JSON.stringify(broadcasts)); }, [broadcasts]);
  useEffect(() => { localStorage.setItem('ac_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('ac_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('ac_birthday_automation_settings', JSON.stringify(automationSettings)); }, [automationSettings]);
  useEffect(() => { localStorage.setItem('ac_birthday_logs', JSON.stringify(birthdayLogs)); }, [birthdayLogs]);
  useEffect(() => { localStorage.setItem('ac_wished_alumni', JSON.stringify(wishedAlumni)); }, [wishedAlumni]);

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
  const submitProfile = (profile) => {
    const newProfile = { ...profile, id: `pp_${Date.now()}`, status: 'pending', submittedAt: new Date().toISOString() };
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
      wishedAlumni
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
