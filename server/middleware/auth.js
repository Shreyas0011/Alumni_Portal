import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

/* ── Role-based access control ─────────────────────────────────────────
   Every signed-in request carries a JWT (Authorization: Bearer <token>)
   issued at login. The token holds the user's id and role; routes check
   the role before reading or changing data. */

export const ROLES = ['superadmin', 'admin', 'professor', 'student', 'alumni'];
export const ADMIN_ROLES = ['superadmin', 'admin'];
export const isAdmin = (role) => ADMIN_ROLES.includes(role);

let secret = null;
const getSecret = () => {
  if (secret) return secret;
  secret = process.env.JWT_SECRET;
  if (!secret) {
    // Still secure, but sessions end whenever the server restarts.
    secret = crypto.randomBytes(48).toString('hex');
    console.warn('[auth] JWT_SECRET is not set in server/.env — using a temporary key (users must sign in again after each restart).');
  }
  return secret;
};

// `uid` is the id the portal uses for this person (alumni use their alumni-list
// id), so the server can tell which event registrations are theirs.
export const signToken = (user, uid = String(user._id)) =>
  jwt.sign({ sub: String(user._id), uid, role: user.role, email: user.email }, getSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/* Requires a valid session; sets req.auth = { id, uid, role, email } */
export const requireAuth = (req, res, next) => {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Sign in to continue.' });
  try {
    const payload = jwt.verify(token, getSecret());
    if (!ROLES.includes(payload.role)) throw new Error('unknown role');
    req.auth = { id: payload.sub, uid: payload.uid || payload.sub, role: payload.role, email: payload.email };
    next();
  } catch {
    res.status(401).json({ message: 'Your session has expired. Sign in again.' });
  }
};

/* Requires one of the given roles (use after requireAuth) */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.auth || !roles.includes(req.auth.role)) {
    return res.status(403).json({ message: 'You don’t have access to this.' });
  }
  next();
};
