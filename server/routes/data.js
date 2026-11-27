import { Router } from 'express';
import { LIST_COLLECTIONS, Setting, SETTING_KEYS, Report } from '../models/index.js';
import { requireAuth, isAdmin } from '../middleware/auth.js';
import { notify } from '../lib/alerts.js';

const router = Router();

// Every data route needs a signed-in user
router.use(requireAuth);

/* ── RBAC for writes ─────────────────────────────────────────────────────
   Admins and super admins can change any collection. Other roles can only
   make the changes their pages need:
   - events:        register / unregister (only the `registrations` field)
   - jobs, volunteering, interviews: the poster manages their item; others
                    only add / change / remove their own entry in it
   - posts:         submit new posts for review (existing posts untouched)
   - notifications, birthdayLogs, wishedAlumni: written by the birthday
                    automation that runs in every signed-in browser
   Everything else (alumni list, pending profiles, broadcasts, achievements,
   automation settings) is admin-only. Non-admins never receive pending
   profiles (other people's applications). */
const MEMBER_WRITABLE = new Set(['events', 'jobs', 'volunteering', 'interviews', 'posts', 'notifications', 'birthdayLogs', 'wishedAlumni']);
const ADMIN_ONLY_READ = new Set(['pendingProfiles']);

// Order-independent comparison of plain JSON values
const canonical = (v) => {
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  if (v && typeof v === 'object') {
    return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}`;
  }
  return JSON.stringify(v);
};
const without = (obj, key) => {
  // eslint-disable-next-line no-unused-vars
  const { [key]: _omit, ...rest } = obj;
  return rest;
};

/* Lists where each item belongs to the person who posted it. The poster
   manages their item; everyone else may only add, change or remove their
   own entry in the item's `sub` list (referral requests, sign-ups, votes). */
const OWNED_LISTS = {
  jobs: { sub: 'requests', posters: ['alumni', 'professor'], noun: 'job posting', verifiedAlumni: true,
    // Requesters may move their own request along, but only the poster refers or declines
    selfStatuses: ['pending', 'interviewing', 'offer'] },
  volunteering: { sub: 'signups', posters: ['professor'], noun: 'volunteering request' },
  interviews: { sub: 'helpful', posters: ['alumni', 'professor'], noun: 'interview experience', idList: true },
};

const entryOwner = (entry, idList) => String(idList ? entry : entry?.userId);

async function checkOwnedList(key, items, auth) {
  const rule = OWNED_LISTS[key];
  const uid = String(auth.uid);
  const current = await readList(key);
  const incoming = new Map(items.map((j) => [String(j.id), j]));
  const others = (list) => canonical((list || []).filter((e) => entryOwner(e, rule.idList) !== uid));
  const own = (list) => (list || []).find((e) => entryOwner(e, rule.idList) === uid);
  for (const old of current) {
    const now = incoming.get(String(old.id));
    const isOwner = String(old.postedById) === uid;
    if (!now) {
      if (!isOwner) return `You can only remove your own ${rule.noun}s.`;
      continue;
    }
    if (isOwner) {
      if (String(now.postedById) !== String(old.postedById)) return 'You can’t change who posted this.';
      continue;
    }
    if (canonical(without(old, rule.sub)) !== canonical(without(now, rule.sub))) {
      return `Only the person who posted this ${rule.noun} can edit it.`;
    }
    if (others(old[rule.sub]) !== others(now[rule.sub])) {
      return 'You can only change your own entry.';
    }
    const before = own(old[rule.sub]);
    const after = own(now[rule.sub]);
    if (rule.selfStatuses && after && after.status !== before?.status && !rule.selfStatuses.includes(after.status)) {
      return 'Only the alumnus who posted the job can refer or decline.';
    }
  }
  const known = new Set(current.map((j) => String(j.id)));
  for (const j of items) {
    if (known.has(String(j.id))) continue;
    // Removed by a moderator: a browser with an old copy must not bring it back
    if (await Report.exists({ itemId: String(j.id), status: 'removed' })) return 'This item was removed by an admin. Reload the page.';
    if (!rule.posters.includes(auth.role)) return `Your role can’t post a ${rule.noun}.`;
    if (String(j.postedById) !== uid) return 'New posts must be under your own name.';
    if ((j[rule.sub] || []).length) return 'New posts must start empty.';
    if (rule.verifiedAlumni && auth.role === 'alumni'
      && !(await LIST_COLLECTIONS.alumniList.exists({ id: uid }))) {
      return 'Only verified alumni can post jobs.';
    }
  }
  return null;
}

/* Notify people when something that concerns them changes */
async function notifyListChanges(key, before, after, auth) {
  if (!OWNED_LISTS[key] || key === 'interviews') return;
  const { sub } = OWNED_LISTS[key];
  const oldById = new Map(before.map((i) => [String(i.id), i]));
  const tasks = [];
  for (const item of after) {
    const old = oldById.get(String(item.id));
    if (!old) continue;
    const prev = new Map((old[sub] || []).map((e) => [String(e.userId), e]));
    for (const e of item[sub] || []) {
      const p = prev.get(String(e.userId));
      if (!p && String(item.postedById) !== String(auth.uid)) {
        tasks.push(notify(item.postedById, key === 'jobs'
          ? { type: 'referral', title: `New referral request from ${e.name}`, body: `${item.title} · ${item.company}`, link: '/jobs' }
          : { type: 'volunteer', title: `${e.name} signed up to volunteer`, body: item.title, link: '/career?tab=volunteer' }));
      } else if (p && p.status !== e.status && String(e.userId) !== String(auth.uid)) {
        tasks.push(notify(e.userId, key === 'jobs'
          ? { type: 'referral', title: `Referral update: ${e.status}`, body: `${item.title} · ${item.company}`, link: '/jobs?view=requests' }
          : { type: 'volunteer', title: `Volunteering ${e.status}`, body: item.title, link: '/career?tab=volunteer' }));
      }
    }
  }
  await Promise.all(tasks);
}

async function checkMemberWrite(key, items, auth) {
  if (!MEMBER_WRITABLE.has(key)) return 'Only admins can change this.';
  if (key === 'events') {
    const current = await readList('events');
    if (current.length !== items.length) return 'Only admins can add or remove events.';
    const byId = new Map(current.map((e) => [String(e.id), e]));
    // Everyone else's registrations must stay exactly as they are
    const others = (regs) => canonical((regs || []).filter((r) => String(r.userId) !== String(auth.uid)));
    for (const e of items) {
      const old = byId.get(String(e.id));
      if (!old || canonical(without(old, 'registrations')) !== canonical(without(e, 'registrations'))) {
        return 'Only admins can edit event details.';
      }
      if (others(old.registrations) !== others(e.registrations)) {
        return 'You can only change your own event registration.';
      }
    }
  }
  if (OWNED_LISTS[key]) {
    const denied = await checkOwnedList(key, items, auth);
    if (denied) return denied;
  }
  if (key === 'posts') {
    const current = await readList('posts');
    const incoming = new Map(items.map((p) => [String(p.id), p]));
    for (const old of current) {
      const now = incoming.get(String(old.id));
      if (!now || canonical(now) !== canonical(old)) return 'Only admins can approve, reject or remove posts.';
    }
    const known = new Set(current.map((p) => String(p.id)));
    if (items.some((p) => !known.has(String(p.id)) && p.status !== 'pending')) {
      return 'New posts must be submitted for review.';
    }
  }
  return null;
}

const clean = (doc) => {
  // eslint-disable-next-line no-unused-vars
  const { _id, _order, createdAt, updatedAt, ...rest } = doc;
  return rest;
};

export async function readList(key) {
  const docs = await LIST_COLLECTIONS[key].find({}).sort({ _order: 1 }).lean();
  return docs.map(clean);
}

export async function writeList(key, items) {
  const Model = LIST_COLLECTIONS[key];
  const ids = items.map((i) => String(i.id));
  if (items.length) {
    await Model.bulkWrite(
      items.map((item, idx) => {
        // eslint-disable-next-line no-unused-vars
        const { _id, ...data } = item;
        return {
          replaceOne: {
            filter: { id: String(item.id) },
            replacement: { ...data, id: String(item.id), _order: idx },
            upsert: true,
          },
        };
      }),
      { ordered: false }
    );
  }
  await Model.deleteMany({ id: { $nin: ids } });
}

export async function readSetting(key) {
  const doc = await Setting.findOne({ key }).lean();
  return doc ? doc.value : null;
}

export async function writeSetting(key, value) {
  await Setting.updateOne({ key }, { $set: { value } }, { upsert: true });
}

/* GET /api/data — every collection the portal needs, in one round trip */
router.get('/', async (req, res, next) => {
  try {
    const out = {};
    await Promise.all([
      ...Object.keys(LIST_COLLECTIONS).map(async (k) => {
        out[k] = ADMIN_ONLY_READ.has(k) && !isAdmin(req.auth.role) ? [] : await readList(k);
      }),
      ...SETTING_KEYS.map(async (k) => { out[k] = await readSetting(k); }),
    ]);
    res.json(out);
  } catch (err) { next(err); }
});

/* GET /api/data/:key */
router.get('/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    if (LIST_COLLECTIONS[key]) {
      if (ADMIN_ONLY_READ.has(key) && !isAdmin(req.auth.role)) return res.status(403).json({ message: 'You don’t have access to this.' });
      return res.json(await readList(key));
    }
    if (SETTING_KEYS.includes(key)) return res.json(await readSetting(key));
    res.status(404).json({ message: `Unknown collection "${key}"` });
  } catch (err) { next(err); }
});

/* PUT /api/data/:key — replace a collection with the list the UI holds */
router.put('/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    if (LIST_COLLECTIONS[key]) {
      if (!Array.isArray(req.body)) return res.status(400).json({ message: 'Expected an array' });
      if (req.body.some((i) => !i || i.id === undefined || i.id === null)) {
        return res.status(400).json({ message: 'Every item needs an id' });
      }
      // Never persist plaintext passwords that may arrive in profile payloads
      const items = req.body.map((i) => {
        // eslint-disable-next-line no-unused-vars
        const { password, ...rest } = i;
        return rest;
      });
      if (!isAdmin(req.auth.role)) {
        const denied = await checkMemberWrite(key, items, req.auth);
        if (denied) return res.status(403).json({ message: denied });
      }
      const before = OWNED_LISTS[key] ? await readList(key) : null;
      await writeList(key, items);
      if (before) await notifyListChanges(key, before, items, req.auth);
      return res.json({ ok: true, count: items.length });
    }
    if (SETTING_KEYS.includes(key)) {
      if (!isAdmin(req.auth.role) && !MEMBER_WRITABLE.has(key)) {
        return res.status(403).json({ message: 'Only admins can change this.' });
      }
      await writeSetting(key, req.body);
      return res.json({ ok: true });
    }
    res.status(404).json({ message: `Unknown collection "${key}"` });
  } catch (err) { next(err); }
});

export default router;
