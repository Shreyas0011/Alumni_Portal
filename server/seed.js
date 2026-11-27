import bcrypt from 'bcryptjs';
import { User, LIST_COLLECTIONS, Setting, Message } from './models/index.js';
import { writeList, writeSetting } from './routes/data.js';
import {
  initialAchievements, initialPosts, initialPendingProfiles, initialAlumniList,
  initialBroadcasts, initialEvents, initialAutomationSettings, initialJobs,
  initialVolunteering, initialInterviews, upcomingSampleEvents,
} from '../src/data/seedData.js';

/* One sign-in email per role (RBAC). All use SEED_DEMO_PASSWORD from server/.env.
   Alumni sign in with their own registered email (e.g. the seeded alumni list). */
export const ROLE_ACCOUNTS = [
  { email: 'superadmin@transcendgroup.org', institutionalId: 'TGI-SUP-001', name: 'Super Admin', role: 'superadmin' },
  { email: 'admin@transcendgroup.org', institutionalId: 'TGI-ADM-001', name: 'Dean of Commerce / Admin', role: 'admin' },
  { email: 'professor@transcendgroup.org', institutionalId: 'TGI-PRF-001', name: 'Prof. Demo Faculty', role: 'professor' },
  { email: 'student@transcendgroup.org', institutionalId: 'TGI-STU-001', name: 'Demo Student', role: 'student', profileStatus: 'incomplete' },
];

/**
 * Seeds an empty database with the portal's starter content and demo accounts.
 * Demo credentials come from server/.env (SEED_*), never from source code.
 * Runs only when the users collection is empty, so it never overwrites real data.
 */
// Sample volunteering posts belong to the faculty account, so a professor can manage them
async function withFaculty(items) {
  const prof = await User.findOne({ role: 'professor' }).lean();
  return items.map((i) => (i.postedById === 'faculty' && prof ? { ...i, postedById: String(prof._id) } : i));
}

export async function seedIfEmpty({ force = false } = {}) {
  if (!force && (await User.estimatedDocumentCount()) > 0) return false;

  const demoPassword = process.env.SEED_DEMO_PASSWORD;
  if (!demoPassword) {
    console.warn('[seed] SEED_DEMO_PASSWORD missing in server/.env — skipping seed.');
    return false;
  }

  if (force) {
    await Promise.all([
      User.deleteMany({}),
      Setting.deleteMany({}),
      ...Object.values(LIST_COLLECTIONS).map((M) => M.deleteMany({})),
    ]);
  }

  const passwordHash = await bcrypt.hash(demoPassword, 10);

  const staff = ROLE_ACCOUNTS.map((a) => ({ ...a, passwordHash }));

  // Every seeded alumnus and pending applicant can sign in with the demo password,
  // so the approval flow can be tried end to end.
  const people = [...initialAlumniList, ...initialPendingProfiles];
  const seen = new Set();
  const alumniUsers = people
    .filter((p) => p.email && !seen.has(p.email.toLowerCase()) && seen.add(p.email.toLowerCase()))
    .map((p) => ({
      email: p.email.toLowerCase(),
      name: p.name,
      role: 'alumni',
      passwordHash,
      profileStatus: initialAlumniList.includes(p) ? 'approved' : 'pending',
      batch: p.batch || p.eduEndYear,
      branch: p.branch || p.degree,
    }));

  await User.insertMany([...staff, ...alumniUsers]);

  await writeList('achievements', initialAchievements);
  await writeList('posts', initialPosts);
  await writeList('pendingProfiles', initialPendingProfiles);
  await writeList('alumniList', initialAlumniList);
  await writeList('broadcasts', initialBroadcasts);
  await writeList('events', [...initialEvents, ...upcomingSampleEvents]);
  await writeList('jobs', initialJobs);
  await writeList('volunteering', await withFaculty(initialVolunteering));
  await writeList('interviews', initialInterviews);
  await writeList('notifications', []);
  await writeList('birthdayLogs', []);
  await writeSetting('automationSettings', initialAutomationSettings);
  await writeSetting('wishedAlumni', {});

  console.log(`[seed] Seeded ${staff.length + alumniUsers.length} users and portal content.`);
  return true;
}

/**
 * One-off data fixes that are safe to run on every start (idempotent).
 * Replaces the old text-baked placeholder event images, which got cropped
 * in the layout, with real photos or with the drawn cover (empty image).
 */
export async function migrateData() {
  // RBAC: make sure every role has its sign-in account (never overwrites existing ones)
  const demoPassword = process.env.SEED_DEMO_PASSWORD;
  if (demoPassword) {
    let passwordHash = null;
    for (const account of ROLE_ACCOUNTS) {
      if (await User.exists({ email: account.email })) continue;
      passwordHash = passwordHash || (await bcrypt.hash(demoPassword, 10));
      await User.create({ ...account, passwordHash });
      console.log(`[migrate] Created ${account.role} account ${account.email}`);
    }
  }
  // PIN sign-in was removed: drop the old warden / mess staff accounts
  const removed = await User.collection.deleteMany({ role: { $in: ['warden', 'mess'] } });
  if (removed.deletedCount) console.log(`[migrate] Removed ${removed.deletedCount} PIN-only account(s).`);
  await User.collection.updateMany({ pinHash: { $exists: true } }, { $unset: { pinHash: '' } });

  // Jobs & referrals board (added later): seed sample postings once
  // Keep something on the calendar: add the sample upcoming events when
  // every event in the database is already in the past
  const today = new Date().toISOString().slice(0, 10);
  const events = await LIST_COLLECTIONS.events.find({}).lean();
  if (!events.some((e) => e.date && e.date >= today)) {
    const known = new Set(events.map((e) => e.id));
    const add = upcomingSampleEvents.filter((e) => !known.has(e.id));
    if (add.length) {
      await LIST_COLLECTIONS.events.insertMany(add.map((e, i) => ({ ...e, _order: events.length + i })));
      console.log(`[migrate] Added ${add.length} upcoming sample event(s).`);
    }
  }

  await seedSampleMessages();

  // Lists added after launch: seed sample content once
  for (const [key, items] of [['jobs', initialJobs], ['volunteering', initialVolunteering], ['interviews', initialInterviews]]) {
    if (await LIST_COLLECTIONS[key].estimatedDocumentCount()) continue;
    await writeList(key, key === 'volunteering' ? await withFaculty(items) : items);
    console.log(`[migrate] Added ${items.length} sample ${key} item(s).`);
  }

  const Events = LIST_COLLECTIONS.events;
  const stale = await Events.find({ image: /placehold\.co/i }).lean();
  if (!stale.length) return;
  const replacements = Object.fromEntries(initialEvents.map((e) => [e.id, e.image]));
  await Promise.all(
    stale.map((e) => Events.updateOne({ id: e.id }, { $set: { image: replacements[e.id] ?? '' } }))
  );
  console.log(`[migrate] Updated ${stale.length} event image(s).`);
}

/* Sample conversations between the demo accounts, so Messages isn't empty.
   Added once per database. */
const SAMPLE_THREADS = [
  ['student@transcendgroup.org', 'priya@goldman.com', [
    ['a', 'Hi Priya! I’m a final-year B.Com student. Could I ask you a few questions about breaking into investment banking?'],
    ['b', 'Of course! Happy to help. What would you like to know?'],
    ['a', 'How much financial modelling should I know before applying for analyst roles?'],
    ['b', 'Be comfortable building a 3-statement model and a simple DCF. I can share the practice case we use — request a session on the Mentorship page and we’ll go through it.'],
  ]],
  ['student@transcendgroup.org', 'rahul@kpmg.com', [
    ['a', 'Hello Rahul, I saw your Audit Associate posting. Is the role open to students finishing CA Inter this year?'],
    ['b', 'Yes, CA Inter candidates are welcome. Send a referral request from the Jobs page with your resume and I’ll forward it.'],
  ]],
  ['professor@transcendgroup.org', 'priya@goldman.com', [
    ['a', 'Priya, thank you for signing up for the guest lecture. Could we fix the topic as “A day in investment banking”?'],
    ['b', 'Sounds perfect, Professor. I’ll keep it to 45 minutes with time for questions.'],
    ['a', 'Great. The final-year batch is very excited. I’ll send the room details closer to the date.'],
  ]],
  ['priya@goldman.com', 'rahul@kpmg.com', [
    ['a', 'Rahul! It’s been a while. Are you coming to the year-end networking night?'],
    ['b', 'Wouldn’t miss it. I’m bringing two people from our audit team who want to hire juniors.'],
    ['a', 'Brilliant — I’ll introduce you to the placement cell there.'],
  ]],
  ['admin@transcendgroup.org', 'priya@goldman.com', [
    ['a', 'Hi Priya, we’re putting together alumni speakers for the FinTech summit in January. Would you be open to joining a panel?'],
    ['b', 'Yes, happy to. Please share the panel topic and timings.'],
  ]],
  ['student@transcendgroup.org', 'professor@transcendgroup.org', [
    ['a', 'Good morning, Professor. I’ve uploaded my resume in the Career Hub for review — could you take a look when you have time?'],
    ['b', 'Morning! I’ll review it this week. Make sure your internship section lists the results, not just the tasks.'],
  ]],
];

async function uidForEmail(email) {
  const user = await User.findOne({ email }).lean();
  if (!user) return null;
  if (user.role !== 'alumni') return { uid: String(user._id), name: user.name };
  const a = await LIST_COLLECTIONS.alumniList.findOne({ email }).lean();
  return a ? { uid: a.id, name: a.name } : null;
}

async function seedSampleMessages() {
  // One-time: a flag (not "no messages yet") so real chats don't block it
  if (await Setting.exists({ key: '_sampleMessagesSeeded' })) return;
  const docs = [];
  let threadIndex = 0;
  for (const [emailA, emailB, lines] of SAMPLE_THREADS) {
    const [a, b] = await Promise.all([uidForEmail(emailA), uidForEmail(emailB)]);
    if (!a || !b) continue;
    // Spread threads over the last few days; messages a few minutes apart
    const start = Date.now() - (threadIndex * 26 + 3) * 3600 * 1000;
    lines.forEach(([who, text], i) => {
      const from = who === 'a' ? a : b;
      const to = who === 'a' ? b : a;
      const at = new Date(start + i * 7 * 60 * 1000);
      docs.push({ from: from.uid, fromName: from.name, to: to.uid, toName: to.name, text, read: i < lines.length - 1, createdAt: at, updatedAt: at });
    });
    threadIndex += 1;
  }
  if (!docs.length) return;
  await Message.insertMany(docs, { timestamps: false });
  await Setting.updateOne({ key: '_sampleMessagesSeeded' }, { $set: { value: true } }, { upsert: true });
  console.log(`[migrate] Added ${docs.length} sample message(s) in ${threadIndex} conversation(s).`);
}
