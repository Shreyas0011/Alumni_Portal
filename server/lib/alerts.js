import { Alert } from '../models/index.js';

/* Create an in-app notification for one person. Never throws: a failed
   notification must not break the action that triggered it. */
export async function notify(userId, { type, title, body = '', link = '' }) {
  if (!userId) return;
  try {
    await Alert.create({ userId: String(userId), type, title, body, link });
  } catch (err) {
    console.error('[alerts]', err.message);
  }
}
