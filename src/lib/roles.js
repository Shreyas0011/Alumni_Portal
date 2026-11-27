// Role-based access control for the portal UI.
// The server enforces the same roles on every API call (server/middleware/auth.js);
// these rules decide where each role lands and which pages it can open.

export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  PROFESSOR: 'professor',
  STUDENT: 'student',
  ALUMNI: 'alumni',
};

export const ADMIN_ROLES = [ROLES.SUPERADMIN, ROLES.ADMIN];
export const ALL_ROLES = Object.values(ROLES);

export const ROLE_LABELS = {
  superadmin: { portal: 'Super Admin Portal', tagline: 'Full Control', name: 'Super Admin' },
  admin: { portal: 'Admin Portal', tagline: 'Manage · Secure', name: 'Admin' },
  professor: { portal: 'Faculty Portal', tagline: 'Teach · Guide', name: 'Professor' },
  student: { portal: 'Student Portal', tagline: 'Learn · Connect', name: 'Student' },
  alumni: { portal: 'Alumni Portal', tagline: 'Stay Connected', name: 'Alumni' },
};

// Pages each role may open (path → allowed roles)
export const PAGE_ACCESS = {
  '/directory': ALL_ROLES,
  '/mentorship': ALL_ROLES,
  // Students register for events from their dashboard ("Register Now");
  // the server only lets members change their own registration
  '/events': [ROLES.ALUMNI, ROLES.STUDENT, ...ADMIN_ROLES],
  // Jobs & referrals posted by alumni; students request referrals
  '/jobs': ALL_ROLES,
  '/campus': ALL_ROLES,
  // Yearbooks are for graduates (and the staff who look after them)
  '/yearbook': [ROLES.ALUMNI, ROLES.PROFESSOR, ...ADMIN_ROLES],
  '/messages': ALL_ROLES,
  '/career': ALL_ROLES,
  '/admin': ADMIN_ROLES,
  '/alumni/dashboard': [ROLES.ALUMNI],
  '/student/dashboard': [ROLES.STUDENT],
  '/professor/dashboard': [ROLES.PROFESSOR],
  '/profile/complete': [ROLES.STUDENT],
};

export const isAdminRole = (role) => ADMIN_ROLES.includes(role);

export const canAccess = (user, path) => Boolean(user) && (PAGE_ACCESS[path] || []).includes(user.role);

// Landing page for a signed-in user
export const homeFor = (user) => {
  if (!user) return '/';
  switch (user.role) {
    case ROLES.SUPERADMIN:
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.PROFESSOR:
      return '/professor/dashboard';
    case ROLES.STUDENT:
      return user.profileStatus === 'incomplete' ? '/profile/complete' : '/student/dashboard';
    case ROLES.ALUMNI:
      return '/alumni/dashboard';
    default:
      return '/';
  }
};
