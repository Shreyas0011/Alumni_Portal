import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from './db.js';
import { seedIfEmpty, migrateData } from './seed.js';
import authRoutes from './routes/auth.js';
import dataRoutes from './routes/data.js';

dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) });

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || true }));
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

app.use((err, _req, res, _next) => {
  console.error('[api]', err);
  res.status(500).json({ message: 'Something went wrong on the server. Try again.' });
});

const start = async () => {
  await connectDB();
  await seedIfEmpty({ force: process.argv.some((a) => a.startsWith('--reseed')) });
  await migrateData();
  if (process.argv.includes('--seed-only') || process.argv.includes('--reseed-only')) {
    await disconnectDB();
    return;
  }
  app.listen(PORT, () => console.log(`[api] Overall360 API listening on http://localhost:${PORT}`));
};

start().catch((err) => {
  console.error('[api] Failed to start:', err.message);
  process.exit(1);
});

const shutdown = async () => { await disconnectDB(); process.exit(0); };
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
