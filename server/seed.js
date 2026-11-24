import bcrypt from 'bcryptjs';
import { User, LIST_COLLECTIONS, Setting } from './models/index.js';
import { writeList, writeSetting } from './routes/data.js';
import {
  initialAchievements, initialPosts, initialPendingProfiles, initialAlumniList,
  initialBroadcasts, initialEvents, initialAutomationSettings,
} from '../src/data/seedData.js';

/**
 * Seeds an empty database with the portal's starter content and demo accounts.
 * Demo credentials come from server/.env (SEED_*), never from source code.
 * Runs only when the users collection is empty, so it never overwrites real data.
 */
export async function seedIfEmpty({ force = false } = {}) {
  if (!force && (await User.estimatedDocumentCount()) > 0) return false;

  const demoPassword = process.env.SEED_DEMO_PASSWORD;
  const wardenPin = process.env.SEED_WARDEN_PIN;
  const messPin = process.env.SEED_MESS_PIN;
  if (!demoPassword || !/^\d{4}$/.test(wardenPin || '') || !/^\d{4}$/.test(messPin || '')) {
    console.warn('[seed] SEED_DEMO_PASSWORD / SEED_WARDEN_PIN / SEED_MESS_PIN missing in server/.env — skipping seed.');
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

  const staff = [
    { email: 'admin@transcendgroup.org', institutionalId: 'TGI-ADM-001', name: 'Dean of Commerce / Admin', role: 'admin', passwordHash },
    { email: 'student@transcendgroup.org', institutionalId: 'TGI-STU-001', name: 'Demo Student', role: 'student', passwordHash, profileStatus: 'incomplete' },
    { institutionalId: 'TGI-WDN-001', name: 'Hostel Warden', role: 'warden', pinHash: await bcrypt.hash(wardenPin, 10) },
    { institutionalId: 'TGI-MESS-001', name: 'Mess Staff', role: 'mess', pinHash: await bcrypt.hash(messPin, 10) },
  ];

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
  await writeList('events', initialEvents);
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
  const Events = LIST_COLLECTIONS.events;
  const stale = await Events.find({ image: /placehold\.co/i }).lean();
  if (!stale.length) return;
  const replacements = Object.fromEntries(initialEvents.map((e) => [e.id, e.image]));
  await Promise.all(
    stale.map((e) => Events.updateOne({ id: e.id }, { $set: { image: replacements[e.id] ?? '' } }))
  );
  console.log(`[migrate] Updated ${stale.length} event image(s).`);
}
