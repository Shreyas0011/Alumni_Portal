// Placeholder showcase content for the landing pages, Explore Campus and the
// directory. Photos come from Unsplash / randomuser.me and the people,
// numbers and companies are sample data — swap in the institution's own.

const unsplash = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=70&auto=format&fit=crop`;

/* ── Background media for the landing hero ───────────────────────────── */
export const CAMPUS_MEDIA = [
  { type: 'image', src: unsplash('1541339907198-e08756dedf3f'), caption: 'Graduation Day 2025', kind: 'Graduation' },
  { type: 'image', src: unsplash('1622397333309-3056849bc70b'), caption: 'Heritage Hall, Main Campus', kind: 'Landmark' },
  { type: 'video', src: 'https://assets.mixkit.co/videos/4503/4503-720.mp4', poster: unsplash('1562774053-701939374585'), caption: 'Students on the main campus', kind: 'Campus' },
  { type: 'image', src: unsplash('1540575467063-178a50c2df87'), caption: 'Global Alumni Meetup, Mumbai', kind: 'Meetup' },
  { type: 'image', src: unsplash('1562774053-701939374585'), caption: 'Founders Building & Central Lawn', kind: 'Landmark' },
  { type: 'image', src: unsplash('1511632765486-a01980e01a18'), caption: 'Batch of 2015 — 10-year reunion', kind: 'Meetup' },
  { type: 'video', src: 'https://assets.mixkit.co/videos/12820/12820-720.mp4', poster: unsplash('1541339907198-e08756dedf3f'), caption: 'Convocation moments', kind: 'Graduation' },
  { type: 'image', src: unsplash('1576495199011-eb94736d05d6'), caption: 'Innovation Centre', kind: 'Campus' },
];

/* ── Live network stats (sample numbers; they tick up to feel live) ──── */
export const LIVE_STATS = [
  { key: 'alumni', label: 'Alumni Worldwide', value: 52480, drift: 3 },
  { key: 'online', label: 'Online Now', value: 1284, drift: 9, swing: true },
  { key: 'countries', label: 'Countries', value: 64, drift: 0 },
  { key: 'referrals', label: 'Referrals This Month', value: 3712, drift: 2 },
];

/* ── Famous alumni (fictional people, stock portraits) ───────────────── */
const portrait = (g, n) => `https://randomuser.me/api/portraits/${g}/${n}.jpg`;
export const FAMOUS_ALUMNI = [
  { name: 'Ananya Rao', title: 'Group CFO', company: 'Unilever', batch: '2004', photo: portrait('women', 44) },
  { name: 'Vikram Malhotra', title: 'Managing Director', company: 'Goldman Sachs', batch: '2001', photo: portrait('men', 32) },
  { name: 'Meera Iyer', title: 'Founder & CEO', company: 'FinLedger', batch: '2010', photo: portrait('women', 65) },
  { name: 'Arjun Kapoor', title: 'Global Head of Tax', company: 'HSBC', batch: '2006', photo: portrait('men', 46) },
  { name: 'Sana Qureshi', title: 'Partner', company: 'Accenture Strategy', batch: '2008', photo: portrait('women', 12) },
  { name: 'Rohan Desai', title: 'Chief Investment Officer', company: 'HDFC Bank', batch: '2003', photo: portrait('men', 75) },
];

/* ── Top recruiters & alumni-founded firms ────────────────────────────
   `logo` is a Simple Icons slug where one exists; others show a wordmark. */
export const TOP_RECRUITERS = [
  { name: 'Goldman Sachs', logo: 'goldmansachs', color: '#6b96c3' },
  { name: 'Deloitte', color: '#86bc25' },
  { name: 'HSBC', logo: 'hsbc', color: '#db0011' },
  { name: 'EY', color: '#b59b00' },
  { name: 'Accenture', logo: 'accenture', color: '#a100ff' },
  { name: 'PwC', color: '#d04a02' },
  { name: 'HDFC Bank', logo: 'hdfcbank', color: '#004c8f' },
  { name: 'KPMG', color: '#00338d' },
  { name: 'Barclays', logo: 'barclays', color: '#00aeef' },
  { name: 'ICICI Bank', logo: 'icicibank', color: '#ae282e' },
  { name: 'Infosys', logo: 'infosys', color: '#007cc3' },
  { name: 'Unilever', logo: 'unilever', color: '#1f36c7' },
];

export const ALUMNI_FIRMS = [
  { name: 'FinLedger', founder: 'Meera Iyer · 2010', sector: 'Fintech', color: '#2563eb' },
  { name: 'Ledgerline Advisors', founder: 'Kabir Singh · 2012', sector: 'Tax & Audit', color: '#0f766e' },
  { name: 'NorthBridge Capital', founder: 'Vikram Malhotra · 2001', sector: 'Private Equity', color: '#7c3aed' },
  { name: 'Coinbridge Pay', founder: 'Tanvi Joshi · 2016', sector: 'Payments', color: '#d97706' },
  { name: 'Assure360', founder: 'Neha Gupta · 2009', sector: 'Risk Advisory', color: '#be123c' },
  { name: 'Quantive Analytics', founder: 'Rohan Mehta · 2014', sector: 'Data & AI', color: '#0369a1' },
];

/* ── Universities of the group ───────────────────────────────────────── */
export const UNIVERSITIES = [
  { name: 'Transcend University of Commerce', city: 'Mumbai', est: 1968, students: '14,200', programs: ['B.Com', 'M.Com', 'MBA', 'Ph.D'], ranking: 'NAAC A++', image: unsplash('1562774053-701939374585', 900) },
  { name: 'Transcend School of Business', city: 'Bengaluru', est: 1994, students: '6,800', programs: ['BBA', 'MBA', 'Executive MBA'], ranking: 'NIRF Top 40', image: unsplash('1592280771190-3e2e4d571952', 900) },
  { name: 'Transcend Institute of Finance', city: 'Chennai', est: 2003, students: '4,100', programs: ['B.Com (Hons)', 'CFA Track', 'FRM'], ranking: 'AACSB Member', image: unsplash('1607237138185-eedd9c632b0b', 900) },
  { name: 'Transcend Global Campus', city: 'Dubai', est: 2015, students: '2,600', programs: ['BBA', 'M.Sc Finance'], ranking: 'KHDA Rated', image: unsplash('1576495199011-eb94736d05d6', 900) },
];

/* ── Campus landmarks for Explore Campus ─────────────────────────────── */
export const LANDMARKS = [
  { name: 'Heritage Hall', blurb: 'The 1968 red-brick hall where every convocation begins.', image: unsplash('1622397333309-3056849bc70b', 1200) },
  { name: 'Founders Building', blurb: 'Home of the Commerce faculty, overlooking the Central Lawn.', image: unsplash('1562774053-701939374585', 1200) },
  { name: 'Central Library', blurb: '3 floors, 2 lakh volumes and a 24×7 reading room.', image: unsplash('1427504494785-3a9ca7044f45', 1200) },
  { name: 'Glass Reading Room', blurb: 'The quiet study space facing the garden.', image: unsplash('1564981797816-1043664bf78d', 1200) },
  { name: 'Innovation Centre', blurb: 'Startup incubator funded by the Class of 2001.', image: unsplash('1576495199011-eb94736d05d6', 1200) },
  { name: 'Convocation Auditorium', blurb: '1,200 seats — talks, fests and graduation day.', image: unsplash('1606761568499-6d2451b23c66', 1200) },
  { name: 'Business School Block', blurb: 'Case rooms, trading lab and the placement cell.', image: unsplash('1592280771190-3e2e4d571952', 1200) },
  { name: 'Alumni Lounge', blurb: 'Co-working space for visiting alumni and mentors.', image: unsplash('1559136555-9303baea8ebd', 1200) },
];

export const CAMPUS_MOMENTS = [
  { caption: 'Graduation Day', image: unsplash('1541339907198-e08756dedf3f', 900) },
  { caption: 'Alumni Meetup', image: unsplash('1540575467063-178a50c2df87', 900) },
  { caption: 'Guest Lecture by Alumni', image: unsplash('1524178232363-1fb2b075b655', 900) },
  { caption: 'Reunion Weekend', image: unsplash('1511632765486-a01980e01a18', 900) },
  { caption: 'Friends for Life', image: unsplash('1517486808906-6ca8b3f04846', 900) },
  { caption: 'Library Late Nights', image: unsplash('1498243691581-b145c3f54a5a', 900) },
];

// Videos are free Mixkit clips (mixkit.co licence)
export const CAMPUS_VIDEO = { src: 'https://assets.mixkit.co/videos/5900/5900-720.mp4', poster: unsplash('1622397333309-3056849bc70b') };

/* ── Directory: extra profile facets ─────────────────────────────────── */
export const INDUSTRIES = ['Banking', 'Consulting', 'FMCG', 'Fintech', 'Asset Management', 'Public Sector', 'Technology', 'Insurance'];
export const DOMAINS = ['Audit', 'Taxation', 'Investment Banking', 'Equity Research', 'Corporate Finance', 'Risk & Compliance', 'Data Analytics', 'Marketing', 'Operations'];
export const CREDENTIALS = ['CA', 'CFA', 'CPA', 'ACCA', 'CS', 'CMA', 'FRM', 'MBA'];
export const AVAILABILITY = ['Open to Mentor', 'Giving Referrals', 'Hiring', 'Open to Talk', 'Busy'];

export const YEARBOOK_QUOTES = [
  'Balance sheets balance. Life, not so much.',
  'Came for the degree, stayed for the canteen chai.',
  'Debit what comes in, credit what goes out — friends included.',
  'Most likely to become a CFO before 35.',
  'Will audit your life choices for free.',
  'Spreadsheets by day, guitar by night.',
  'Never missed a single 8 AM lecture. Okay, maybe one.',
  'Ready to trade the campus for the trading floor.',
];

export const SUPERLATIVES = ['Most Likely to Start a Unicorn', 'Best Debater', 'Placement Topper', 'Spirit of the Batch', 'Most Likely to Become CFO', 'Fest Organiser of the Year'];

const FEMALE_NAMES = new Set(['sarah', 'elena', 'priya', 'ananya', 'sneha', 'meera', 'neha', 'tanvi', 'anita', 'sana', 'emily']);

// Stock portrait for a profile; picks a woman's or man's photo from the first name
export const portraitFor = (seed, name = '') => {
  const n = Math.abs(Number(seed) || String(seed).split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 99;
  const first = name.trim().split(/\s+/)[0].toLowerCase();
  return portrait(FEMALE_NAMES.has(first) ? 'women' : 'men', n);
};
