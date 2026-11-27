// Thin fetch wrapper for the Express + MongoDB API.
// In dev, Vite proxies /api to the server (see vite.config.js).
// In production, set VITE_API_URL to the deployed API origin.
const BASE = import.meta.env.VITE_API_URL || '';

// Session token issued by POST /api/auth/login; sent on every request so the
// server can apply role-based access control.
export const TOKEN_KEY = 'alumni_portal_token';
export const USER_KEY = 'alumni_portal_user';

// The sign-in lives in sessionStorage: it belongs to one browser tab, survives
// a refresh, and ends when the tab is closed — so opening the portal link
// always starts at the sign-in page, and each tab keeps its own account.
export const session = window.sessionStorage;

// Sessions used to be kept in localStorage (shared by every tab, for days);
// drop any left over so an old account can't reappear.
localStorage.removeItem(TOKEN_KEY);
localStorage.removeItem(USER_KEY);

async function request(method, path, body) {
  const token = session.getItem(TOKEN_KEY);
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    // Expired or invalid session → let AuthContext sign the user out
    if (res.status === 401 && token && !path.startsWith('/api/auth/login')) {
      window.dispatchEvent(new Event('auth:expired'));
    }
    const err = new Error(data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.code = data?.code;
    throw err;
  }
  return data;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
};
