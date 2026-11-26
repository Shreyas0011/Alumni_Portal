import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User, LIST_COLLECTIONS } from '../models/index.js';
import { signToken, requireAuth } from '../middleware/auth.js';

const router = Router();

/* Tiny in-memory throttle: 8 failed attempts per IP per 10 minutes */
const failures = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILS = 8;
const isThrottled = (ip) => {
  const f = failures.get(ip);
  if (!f) return false;
  if (Date.now() - f.first > WINDOW_MS) { failures.delete(ip); return false; }
  return f.count >= MAX_FAILS;
};
const recordFailure = (ip) => {
  const f = failures.get(ip);
  if (!f || Date.now() - f.first > WINDOW_MS) failures.set(ip, { first: Date.now(), count: 1 });
  else f.count += 1;
};

const publicUser = (u, extra = {}) => ({
  id: String(u._id),
  name: u.name,
  email: u.email,
  institutionalId: u.institutionalId,
  role: u.role,
  profileStatus: u.profileStatus,
  batch: u.batch,
  branch: u.branch,
  lastLogin: new Date().toISOString(),
  ...extra,
});

/* POST /api/auth/login  { identifier, password } */
router.post('/login', async (req, res, next) => {
  try {
    if (isThrottled(req.ip)) {
      return res.status(429).json({ message: 'Too many attempts. Wait a few minutes and try again.' });
    }
    const identifier = String(req.body?.identifier || '').trim();
    const password = String(req.body?.password || '');
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Enter your email and password.' });
    }

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { institutionalId: identifier }],
    });
    const ok = user?.passwordHash && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) {
      recordFailure(req.ip);
      return res.status(401).json({ message: 'That email or password doesn’t match our records.' });
    }

    // Alumni must be approved by an admin before they can sign in
    const session = await sessionUser(user);
    if (!session) {
      const pending = await LIST_COLLECTIONS.pendingProfiles.findOne({ email: user.email }).lean();
      if (pending?.status === 'rejected') {
        return res.status(403).json({ code: 'rejected', message: 'Your access request was declined. Contact the commerce department for help.' });
      }
      return res.status(403).json({ code: 'pending', message: 'Your access request is waiting for admin approval. You’ll get an email once it’s approved.' });
    }

    user.lastLogin = new Date();
    await user.save();
    res.json({ token: signToken(user, session.id), user: session });
  } catch (err) { next(err); }
});

/* The user as the portal sees them. Alumni use their approved alumni-list
   record's id; returns null for alumni who aren't approved (yet). */
async function sessionUser(user) {
  if (user.role !== 'alumni') return publicUser(user);
  const approved = await LIST_COLLECTIONS.alumniList.findOne({ email: user.email }).lean();
  if (!approved) return null;
  return publicUser(user, {
    id: approved.id,
    profileStatus: 'approved',
    batch: approved.batch,
    branch: approved.branch || approved.profession,
  });
}

/* POST /api/auth/register  { profile, password } — alumni access request */
router.post('/register', async (req, res, next) => {
  try {
    const { profile, password } = req.body || {};
    const email = String(profile?.email || '').trim().toLowerCase();
    if (!email || !profile?.name) return res.status(400).json({ message: 'Name and email are required.' });
    if (!password || String(password).length < 6) {
      return res.status(400).json({ message: 'Choose a password with at least 6 characters.' });
    }
    if (await User.exists({ email })) {
      return res.status(409).json({ message: 'An account with this email already exists. Sign in instead.' });
    }

    await User.create({
      email,
      name: profile.name,
      role: 'alumni',
      passwordHash: await bcrypt.hash(String(password), 10),
      profileStatus: 'pending',
      batch: profile.eduEndYear || profile.batch,
      branch: profile.degree,
    });

    // eslint-disable-next-line no-unused-vars
    const { password: _pw, _id, ...safe } = profile;
    const doc = {
      ...safe,
      email,
      id: safe.id || `pp_${Date.now()}`,
      status: 'pending',
      submittedAt: safe.submittedAt || new Date().toISOString(),
      _order: -Date.now(), // newest first
    };
    await LIST_COLLECTIONS.pendingProfiles.create(doc);
    // eslint-disable-next-line no-unused-vars
    const { _order, ...out } = doc;
    res.status(201).json(out);
  } catch (err) { next(err); }
});

/* GET /api/auth/me — the signed-in user (role comes from the database) */
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.id);
    const session = user && (await sessionUser(user));
    if (!session) return res.status(401).json({ message: 'Your session has expired. Sign in again.' });
    // Fresh token, so role changes and older tokens are picked up
    res.json({ user: session, token: signToken(user, session.id) });
  } catch (err) { next(err); }
});

/* POST /api/auth/profile  { profile } — a signed-in user submits their profile
   for admin review (e.g. a student completing their profile). */
router.post('/profile', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.id);
    if (!user) return res.status(401).json({ message: 'Your session has expired. Sign in again.' });
    // eslint-disable-next-line no-unused-vars
    const { password: _pw, _id, status, ...safe } = req.body?.profile || {};
    // Only students may self-approve via the demo "skip" option; everyone else is reviewed
    const finalStatus = status === 'approved' && user.role === 'student' ? 'approved' : 'pending';
    const doc = {
      ...safe,
      email: user.email,
      role: user.role,
      id: safe.id || `pp_${Date.now()}`,
      status: finalStatus,
      submittedAt: new Date().toISOString(),
      _order: -Date.now(),
    };
    await LIST_COLLECTIONS.pendingProfiles.create(doc);
    user.profileStatus = finalStatus;
    if (safe.name) user.name = safe.name;
    if (safe.batch) user.batch = safe.batch;
    await user.save();
    // eslint-disable-next-line no-unused-vars
    const { _order, ...out } = doc;
    res.status(201).json(out);
  } catch (err) { next(err); }
});

export default router;
