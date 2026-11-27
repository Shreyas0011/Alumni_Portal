import crypto from 'node:crypto';
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import {
  User, LIST_COLLECTIONS, Message, MentorSession, ResumeReview, Alert, Report,
} from '../models/index.js';
import { requireAuth, isAdmin } from '../middleware/auth.js';
import { notify } from '../lib/alerts.js';
import { readList, writeList } from './data.js';

/* Person-to-person features: messages, mentor sessions, resume reviews,
   notifications, reports and the admin CSV import. Every route needs a
   signed-in user, and each one only returns what that person may see. */
const router = Router();
router.use(requireAuth);

const ROLE_TITLE = { superadmin: 'Super Admin', admin: 'Admin', professor: 'Faculty', student: 'Student', alumni: 'Alumni' };
const bad = (res, message, code = 400) => res.status(code).json({ message });

/* ── People: everyone a member can message or book ─────────────────── */
async function loadPeople() {
  const [users, alumni] = await Promise.all([
    User.find({}, { name: 1, email: 1, role: 1, batch: 1, branch: 1, profileStatus: 1 }).lean(),
    LIST_COLLECTIONS.alumniList.find({}).lean(),
  ]);
  const alumniByEmail = new Map(alumni.map((a) => [String(a.email || '').toLowerCase(), a]));
  const people = [];
  for (const u of users) {
    if (u.role === 'alumni') {
      const a = alumniByEmail.get(u.email);
      if (!a) continue; // not approved yet
      people.push({ uid: a.id, name: a.name, role: 'alumni', verified: true, batch: a.batch, subtitle: [a.profession, a.company].filter(Boolean).join(' · ') });
    } else {
      people.push({ uid: String(u._id), name: u.name, role: u.role, verified: u.role !== 'student' || u.profileStatus === 'approved', batch: u.batch, subtitle: ROLE_TITLE[u.role] });
    }
  }
  return people;
}

router.get('/people', async (req, res, next) => {
  try { res.json(await loadPeople()); } catch (err) { next(err); }
});

const personById = async (uid) => (await loadPeople()).find((p) => p.uid === String(uid));

/* ── Messages ──────────────────────────────────────────────────────── */
router.get('/messages', async (req, res, next) => {
  try {
    const me = req.auth.uid;
    const list = await Message.find({ $or: [{ from: me }, { to: me }] }).sort({ createdAt: 1 }).limit(1000).lean();
    res.json(list.map(({ _id, ...m }) => ({ id: String(_id), ...m })));
  } catch (err) { next(err); }
});

router.post('/messages', async (req, res, next) => {
  try {
    const text = String(req.body?.text || '').trim();
    const to = String(req.body?.to || '');
    if (!text) return bad(res, 'Write a message first.');
    if (text.length > 4000) return bad(res, 'Keep messages under 4,000 characters.');
    if (to === req.auth.uid) return bad(res, 'You can’t message yourself.');
    const people = await loadPeople();
    const recipient = people.find((p) => p.uid === to);
    const sender = people.find((p) => p.uid === req.auth.uid);
    if (!recipient) return bad(res, 'That person isn’t on the portal.', 404);
    const firstMessage = !(await Message.exists({ from: req.auth.uid, to }));
    const msg = await Message.create({ from: req.auth.uid, fromName: sender?.name || req.auth.email, to, toName: recipient.name, text });
    if (firstMessage) {
      await notify(to, { type: 'message', title: `New message from ${msg.fromName}`, body: text.slice(0, 120), link: `/messages?with=${encodeURIComponent(req.auth.uid)}` });
    }
    const { _id, ...rest } = msg.toObject();
    res.status(201).json({ id: String(_id), ...rest });
  } catch (err) { next(err); }
});

router.post('/messages/read', async (req, res, next) => {
  try {
    await Message.updateMany({ to: req.auth.uid, from: String(req.body?.with || ''), read: false }, { $set: { read: true } });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

/* ── Mentor sessions ───────────────────────────────────────────────── */
const sessionOut = ({ _id, ...s }) => ({ id: String(_id), ...s });

router.get('/sessions', async (req, res, next) => {
  try {
    const me = req.auth.uid;
    const list = await MentorSession.find({ $or: [{ mentorId: me }, { menteeId: me }] }).sort({ slot: 1 }).lean();
    res.json(list.map(sessionOut));
  } catch (err) { next(err); }
});

// Public counts per mentor (sessions confirmed or held), for the mentor cards
router.get('/sessions/stats', async (req, res, next) => {
  try {
    const rows = await MentorSession.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      { $group: { _id: '$mentorId', count: { $sum: 1 } } },
    ]);
    res.json(Object.fromEntries(rows.map((r) => [r._id, r.count])));
  } catch (err) { next(err); }
});

router.post('/sessions', async (req, res, next) => {
  try {
    const { mentorId, slot, topic = '', area = '', note = '', mode = 'Video call' } = req.body || {};
    const when = new Date(slot);
    if (Number.isNaN(when.getTime()) || when < new Date()) return bad(res, 'Pick a time in the future.');
    if (String(mentorId) === req.auth.uid) return bad(res, 'You can’t book a session with yourself.');
    const mentor = await LIST_COLLECTIONS.alumniList.findOne({ id: String(mentorId) }).lean();
    if (!mentor) return bad(res, 'Mentors must be verified alumni.', 404);
    const clash = await MentorSession.exists({ mentorId: mentor.id, slot: when, status: { $in: ['requested', 'confirmed'] } });
    if (clash) return bad(res, 'That slot is already booked. Pick another time.', 409);
    const me = await personById(req.auth.uid);
    const s = await MentorSession.create({
      mentorId: mentor.id, mentorName: mentor.name, menteeId: req.auth.uid, menteeName: me?.name || req.auth.email,
      menteeRole: req.auth.role, slot: when, topic: String(topic).slice(0, 200), area, note: String(note).slice(0, 1000), mode,
    });
    await notify(mentor.id, { type: 'session', title: `Session request from ${s.menteeName}`, body: `${topic || area} · ${when.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}`, link: '/mentorship' });
    res.status(201).json(sessionOut(s.toObject()));
  } catch (err) { next(err); }
});

router.patch('/sessions/:id', async (req, res, next) => {
  try {
    const s = await MentorSession.findById(req.params.id);
    if (!s) return bad(res, 'Session not found.', 404);
    const me = req.auth.uid;
    const status = String(req.body?.status || '');
    const isMentor = s.mentorId === me;
    const isMentee = s.menteeId === me;
    const allowed = (isMentor && ['confirmed', 'declined', 'cancelled', 'completed'].includes(status))
      || (isMentee && status === 'cancelled');
    if (!allowed) return bad(res, 'You can’t make that change to this session.', 403);
    s.status = status;
    await s.save();
    const other = isMentor ? s.menteeId : s.mentorId;
    const who = isMentor ? s.mentorName : s.menteeName;
    await notify(other, { type: 'session', title: `Session ${status} by ${who}`, body: s.topic || s.area, link: '/mentorship' });
    res.json(sessionOut(s.toObject()));
  } catch (err) { next(err); }
});

/* ── Resume reviews ────────────────────────────────────────────────── */
const REVIEWERS = ['alumni', 'professor'];
const reviewOut = ({ _id, fileData, ...r }) => ({ id: String(_id), hasFile: Boolean(fileData), ...r });
const canSeeReview = (r, auth) => isAdmin(auth.role) || r.studentId === auth.uid
  || r.reviewerId === auth.uid || (REVIEWERS.includes(auth.role) && r.status === 'open');

router.get('/reviews', async (req, res, next) => {
  try {
    const { uid, role } = req.auth;
    const query = isAdmin(role) ? {}
      : REVIEWERS.includes(role) ? { $or: [{ status: 'open' }, { reviewerId: uid }, { studentId: uid }] }
        : { studentId: uid };
    const list = await ResumeReview.find(query, { fileData: 0 }).sort({ createdAt: -1 }).lean();
    res.json(list.map(reviewOut));
  } catch (err) { next(err); }
});

router.get('/reviews/:id/file', async (req, res, next) => {
  try {
    const r = await ResumeReview.findById(req.params.id).lean();
    if (!r || !canSeeReview(r, req.auth)) return bad(res, 'You don’t have access to this file.', 403);
    res.json({ fileName: r.fileName, fileType: r.fileType, fileData: r.fileData });
  } catch (err) { next(err); }
});

const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
router.post('/reviews', async (req, res, next) => {
  try {
    if (req.auth.role !== 'student') return bad(res, 'Only students can ask for a resume review.', 403);
    const { field = '', note = '', fileName = '', fileType = '', fileData = '' } = req.body || {};
    if (!ALLOWED_TYPES.includes(fileType)) return bad(res, 'Upload a PDF or Word file.');
    if (!String(fileData).startsWith('data:') || fileData.length > 2.8 * 1024 * 1024) return bad(res, 'Files must be under 2 MB.');
    const open = await ResumeReview.countDocuments({ studentId: req.auth.uid, status: { $ne: 'reviewed' } });
    if (open >= 3) return bad(res, 'You already have 3 reviews in progress.');
    const me = await personById(req.auth.uid);
    const r = await ResumeReview.create({
      studentId: req.auth.uid, studentName: me?.name || req.auth.email, field, note: String(note).slice(0, 1000),
      fileName: String(fileName).slice(0, 120), fileType, fileData,
    });
    res.status(201).json(reviewOut(r.toObject()));
  } catch (err) { next(err); }
});

router.patch('/reviews/:id', async (req, res, next) => {
  try {
    const r = await ResumeReview.findById(req.params.id);
    if (!r) return bad(res, 'Request not found.', 404);
    const { uid, role } = req.auth;
    const action = req.body?.action;
    if (action === 'claim') {
      if (!REVIEWERS.includes(role) || r.status !== 'open' || r.studentId === uid) return bad(res, 'This request can’t be picked up.', 403);
      const me = await personById(uid);
      Object.assign(r, { status: 'in_review', reviewerId: uid, reviewerName: me?.name });
      await notify(r.studentId, { type: 'review', title: `${me?.name} is reviewing your resume`, body: r.fileName, link: '/career?tab=resume' });
    } else if (action === 'release') {
      if (r.reviewerId !== uid || r.status !== 'in_review') return bad(res, 'You aren’t reviewing this.', 403);
      Object.assign(r, { status: 'open', reviewerId: undefined, reviewerName: undefined });
    } else if (action === 'feedback') {
      if (r.reviewerId !== uid || r.status !== 'in_review') return bad(res, 'You aren’t reviewing this.', 403);
      const feedback = String(req.body?.feedback || '').trim();
      const rating = Math.min(5, Math.max(1, Number(req.body?.rating) || 0));
      if (feedback.length < 10) return bad(res, 'Write at least a sentence of feedback.');
      Object.assign(r, { status: 'reviewed', feedback: feedback.slice(0, 4000), rating });
      await notify(r.studentId, { type: 'review', title: 'Your resume review is ready', body: `Feedback from ${r.reviewerName}`, link: '/career?tab=resume' });
    } else if (action === 'delete') {
      if (r.studentId !== uid && !isAdmin(role)) return bad(res, 'You can only delete your own request.', 403);
      await r.deleteOne();
      return res.json({ ok: true });
    } else {
      return bad(res, 'Unknown action.');
    }
    await r.save();
    const { fileData, ...out } = r.toObject();
    res.json(reviewOut({ ...out, fileData }));
  } catch (err) { next(err); }
});

/* ── Notifications ─────────────────────────────────────────────────── */
router.get('/alerts', async (req, res, next) => {
  try {
    const list = await Alert.find({ userId: req.auth.uid }).sort({ createdAt: -1 }).limit(50).lean();
    res.json(list.map(({ _id, ...a }) => ({ id: String(_id), ...a })));
  } catch (err) { next(err); }
});

router.post('/alerts/read', async (req, res, next) => {
  try {
    await Alert.updateMany({ userId: req.auth.uid, read: false }, { $set: { read: true } });
    res.json({ ok: true });
  } catch (err) { next(err); }
});

/* ── Reports & moderation ──────────────────────────────────────────── */
const REPORTABLE = { post: 'posts', job: 'jobs', interview: 'interviews' };

router.post('/reports', async (req, res, next) => {
  try {
    const { kind, itemId, itemTitle = '', reason = '' } = req.body || {};
    if (!REPORTABLE[kind] || !itemId) return bad(res, 'Choose what you are reporting.');
    if (String(reason).trim().length < 5) return bad(res, 'Tell the admins what’s wrong.');
    if (await Report.exists({ reporterId: req.auth.uid, kind, itemId, status: 'open' })) return bad(res, 'You’ve already reported this.', 409);
    const me = await personById(req.auth.uid);
    await Report.create({ reporterId: req.auth.uid, reporterName: me?.name || req.auth.email, kind, itemId: String(itemId), itemTitle: String(itemTitle).slice(0, 200), reason: String(reason).slice(0, 1000) });
    res.status(201).json({ ok: true });
  } catch (err) { next(err); }
});

router.get('/reports', async (req, res, next) => {
  try {
    if (!isAdmin(req.auth.role)) return bad(res, 'Only admins can see reports.', 403);
    const list = await Report.find({}).sort({ status: 1, createdAt: -1 }).limit(200).lean();
    res.json(list.map(({ _id, ...r }) => ({ id: String(_id), ...r })));
  } catch (err) { next(err); }
});

router.patch('/reports/:id', async (req, res, next) => {
  try {
    if (!isAdmin(req.auth.role)) return bad(res, 'Only admins can moderate.', 403);
    const r = await Report.findById(req.params.id);
    if (!r) return bad(res, 'Report not found.', 404);
    const action = req.body?.action;
    if (action === 'remove') {
      const key = REPORTABLE[r.kind];
      const items = await readList(key);
      await writeList(key, items.filter((i) => String(i.id) !== r.itemId));
      // Close every open report about the same item
      await Report.updateMany({ kind: r.kind, itemId: r.itemId, status: 'open' }, { $set: { status: 'removed', resolvedBy: req.auth.email } });
    } else if (action === 'dismiss') {
      r.status = 'dismissed';
      r.resolvedBy = req.auth.email;
      await r.save();
    } else {
      return bad(res, 'Unknown action.');
    }
    res.json({ ok: true });
  } catch (err) { next(err); }
});

/* ── Admin: current students who can be moved into an alumni batch ── */
router.get('/students', async (req, res, next) => {
  try {
    if (!isAdmin(req.auth.role)) return bad(res, 'Only admins can see this.', 403);
    const list = await User.find({ role: 'student' }, { name: 1, email: 1, batch: 1, branch: 1, profileStatus: 1 }).sort({ name: 1 }).lean();
    res.json(list.map((u) => ({ id: String(u._id), name: u.name, email: u.email, batch: u.batch || '', branch: u.branch || '', profileStatus: u.profileStatus })));
  } catch (err) { next(err); }
});

/* ── Admin: add graduates to alumni batches (manual list, CSV or students) ── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
router.post('/import', async (req, res, next) => {
  try {
    if (!isAdmin(req.auth.role)) return bad(res, 'Only admins can import alumni.', 403);
    const rows = Array.isArray(req.body?.rows) ? req.body.rows.slice(0, 2000) : [];
    if (!rows.length) return bad(res, 'The file has no rows.');
    const alumni = await readList('alumniList');
    const results = [];
    const added = [];
    for (const [i, row] of rows.entries()) {
      const email = String(row.email || '').trim().toLowerCase();
      const name = String(row.name || '').trim();
      if (!name || !EMAIL_RE.test(email)) { results.push({ row: i + 2, email, status: 'skipped', reason: 'Missing name or valid email' }); continue; }
      if (alumni.some((a) => String(a.email).toLowerCase() === email) || added.some((a) => a.email === email)) {
        results.push({ row: i + 2, email, status: 'skipped', reason: 'Already in an alumni batch' }); continue;
      }
      const batch = String(row.batch || '').trim();
      const existing = await User.findOne({ email });
      if (existing && existing.role !== 'student') {
        results.push({ row: i + 2, email, status: 'skipped', reason: `Already on the portal as ${existing.role}` }); continue;
      }
      if (existing) {
        // A current student graduating: same account and password, now an alumnus.
        // The alumni record reuses their account id so messages and sessions carry over.
        const entry = {
          id: String(existing._id), name: name || existing.name, email, role: 'alumni', batch, eduEndYear: batch,
          degree: String(row.degree || row.branch || existing.branch || '').trim(), company: String(row.company || '').trim(),
          profession: String(row.profession || row.designation || '').trim(), phone: String(row.phone || '').trim(),
          dob: String(row.dob || '').trim(), linkedin: String(row.linkedin || '').trim(), location: String(row.location || '').trim(),
          college: 'Transcend College of Commerce', approvedAt: new Date().toISOString(),
        };
        Object.assign(existing, { role: 'alumni', profileStatus: 'approved', batch, branch: entry.degree || existing.branch });
        await existing.save();
        added.push(entry);
        results.push({ row: i + 2, email, name: entry.name, status: 'promoted' });
        continue;
      }
      const tempPassword = crypto.randomBytes(6).toString('base64url');
      const entry = {
        id: `al_${Date.now().toString(36)}_${i}`, name, email, role: 'alumni', batch, eduEndYear: batch,
        degree: String(row.degree || row.branch || '').trim(), company: String(row.company || '').trim(),
        profession: String(row.profession || row.designation || '').trim(), phone: String(row.phone || '').trim(),
        dob: String(row.dob || '').trim(), linkedin: String(row.linkedin || '').trim(), location: String(row.location || '').trim(),
        college: 'Transcend College of Commerce', importedAt: new Date().toISOString(),
      };
      await User.create({ email, name, role: 'alumni', profileStatus: 'approved', batch, branch: entry.degree, passwordHash: await bcrypt.hash(tempPassword, 10) });
      added.push(entry);
      results.push({ row: i + 2, email, name, status: 'added', tempPassword });
    }
    if (added.length) await writeList('alumniList', [...alumni, ...added]);
    const promoted = results.filter((r) => r.status === 'promoted').length;
    res.json({ added: added.length - promoted, promoted, skipped: results.length - added.length, results });
  } catch (err) { next(err); }
});

export default router;
