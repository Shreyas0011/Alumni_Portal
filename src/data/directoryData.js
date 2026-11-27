// Directory data shared by the Directory and Yearbook pages:
// approved alumni from the database plus generated sample profiles.
import { INDUSTRIES, DOMAINS, CREDENTIALS, AVAILABILITY } from './showcase';

// Extra profile facets (sample data), derived from the profile id so they stay stable
export const hashOf = (v) => {
  let h = 2166136261;
  for (const c of String(v)) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  h ^= h >>> 15;
  return Math.imul(h, 2246822507) >>> 0;
};
export const withFacets = (p) => {
  const h = hashOf(p.id);
  const fromName = (p.name.match(/,\s*([A-Z]{2,4})$/) || [])[1];
  const creds = [];
  if (fromName && CREDENTIALS.includes(fromName)) creds.push(fromName);
  if (h % 3 === 0) creds.push(CREDENTIALS[h % CREDENTIALS.length]);
  if (h % 7 === 0) creds.push(CREDENTIALS[(h >>> 3) % CREDENTIALS.length]);
  return {
    ...p,
    industry: p.industry || INDUSTRIES[h % INDUSTRIES.length],
    domain: p.domain || DOMAINS[(h >>> 2) % DOMAINS.length],
    credentials: p.credentials || [...new Set(creds)],
    availability: p.availability || AVAILABILITY[(h >>> 4) % AVAILABILITY.length],
  };
};

// Procedurally generate 10,000 commerce-specific profiles for testing scalability
const generateAlumniDataset = () => {
  const names = ['Sarah', 'David', 'Marcus', 'Elena', 'James', 'Priya', 'Amit', 'Ananya', 'Rohan', 'Sneha', 'Vikram', 'Meera', 'Arjun', 'Neha', 'Kabir', 'Tanvi'];
  const lastNames = ['Jenkins', 'Chen', 'Thorne', 'Rodriguez', 'Wilson', 'Sharma', 'Patel', 'Goel', 'Mehta', 'Reddy', 'Singh', 'Desai', 'Kapoor', 'Gupta', 'Iyer', 'Joshi'];
  const roles = ['Senior M&A Associate', 'Partner', 'Financial Analyst', 'Chief Financial Officer', 'Senior Tax Consultant', 'Investment Analyst', 'Equity Research VP', 'Treasury Manager', 'Portfolio Analyst', 'Auditor', 'Chartered Accountant'];
  const companies = ['Goldman Sachs', 'Deloitte', 'JP Morgan Chase', 'Unilever', 'EY', 'Blackstone Group', 'PwC', 'KPMG', 'Morgan Stanley', 'Citi Group', 'HDFC Bank', 'HSBC'];
  const depts = ['Investment Banking', 'Audit & Assurance', 'Corporate Finance', 'Executive Management', 'Taxation', 'Wealth Management', 'Treasury Operations', 'Risk Advisory'];
  const locations = ['London, UK', 'Singapore', 'Mumbai, India', 'New York, NY', 'Toronto, Canada', 'Bangalore, India', 'Sydney, Australia', 'Dubai, UAE', 'Tokyo, Japan'];

  const dataset = [];
  
  // Seed the original 6 profiles first
  const baseAlumni = [
    { id: 1, name: 'Sarah Jenkins', role: 'Senior M&A Associate', company: 'Goldman Sachs', initials: 'SJ', dept: 'Investment Banking', location: 'London, UK', batch: '2018' },
    { id: 2, name: 'David Chen, CA', role: 'Partner', company: 'Deloitte', initials: 'DC', dept: 'Audit & Assurance', location: 'Singapore', batch: '2020' },
    { id: 3, name: 'Marcus Thorne', role: 'Financial Analyst', company: 'JP Morgan Chase', initials: 'MT', dept: 'Corporate Finance', location: 'Mumbai, India', batch: '2019' },
    { id: 4, name: 'Elena Rodriguez', role: 'Chief Financial Officer', company: 'Unilever', initials: 'ER', dept: 'Executive Management', location: 'New York, NY', batch: '2015' },
    { id: 5, name: 'James Wilson, CA', role: 'Senior Tax Consultant', company: 'EY', initials: 'JW', dept: 'Taxation', location: 'Toronto, Canada', batch: '2017' },
    { id: 6, name: 'Priya Sharma, CFA', role: 'Investment Analyst', company: 'Blackstone Group', initials: 'PS', dept: 'Wealth Management', location: 'Mumbai, India', batch: '2018' },
  ];
  
  dataset.push(...baseAlumni);
  
  // Fill up to 10,000
  for (let i = 7; i <= 10000; i++) {
    const nameIndex = (i * 3) % names.length;
    const lastNameIndex = (i * 7) % lastNames.length;
    const roleIndex = (i * 11) % roles.length;
    const companyIndex = (i * 13) % companies.length;
    const deptIndex = (i * 17) % depts.length;
    const locationIndex = (i * 19) % locations.length;
    const batch = 2000 + (i % 26);
    
    const fullName = `${names[nameIndex]} ${lastNames[lastNameIndex]}`;
    const initials = names[nameIndex][0] + lastNames[lastNameIndex][0];
    
    dataset.push({
      id: i,
      name: fullName,
      role: roles[roleIndex],
      company: companies[companyIndex],
      initials: initials,
      dept: depts[deptIndex],
      location: locations[locationIndex],
      batch: batch.toString()
    });
  }
  return dataset;
};

let generatedCache = null;

// Approved alumni (verified, messageable) first, then the sample profiles
export const buildDirectory = (alumniList) => {
  generatedCache = generatedCache || generateAlumniDataset();
  const mappedGlobal = alumniList.map((a) => ({
    id: `global-${a.id}`,
    name: a.name,
    role: a.profession || (a.role === 'student' ? 'Undergraduate Student' : 'Alumnus'),
    company: a.company || (a.role === 'student' ? 'Transcend College' : 'Business'),
    initials: a.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    dept: a.degree || a.fieldOfStudy || (a.role === 'student' ? 'Student' : 'Business'),
    location: a.location || 'Mumbai, India',
    batch: a.batch || '2024',
    isGlobal: true,
    uid: a.id,
    verified: true,
    email: a.email,
    skills: a.skills,
    bio: a.bio,
    linkedin: a.linkedin,
    college: a.college,
    degree: a.degree,
    fieldOfStudy: a.fieldOfStudy
  }));
  return [...mappedGlobal, ...generatedCache].map(withFacets);
};
