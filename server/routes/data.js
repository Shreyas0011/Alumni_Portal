import { Router } from 'express';
import { LIST_COLLECTIONS, Setting, SETTING_KEYS } from '../models/index.js';

const router = Router();

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
router.get('/', async (_req, res, next) => {
  try {
    const out = {};
    await Promise.all([
      ...Object.keys(LIST_COLLECTIONS).map(async (k) => { out[k] = await readList(k); }),
      ...SETTING_KEYS.map(async (k) => { out[k] = await readSetting(k); }),
    ]);
    res.json(out);
  } catch (err) { next(err); }
});

/* GET /api/data/:key */
router.get('/:key', async (req, res, next) => {
  try {
    const { key } = req.params;
    if (LIST_COLLECTIONS[key]) return res.json(await readList(key));
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
      await writeList(key, items);
      return res.json({ ok: true, count: items.length });
    }
    if (SETTING_KEYS.includes(key)) {
      await writeSetting(key, req.body);
      return res.json({ ok: true });
    }
    res.status(404).json({ message: `Unknown collection "${key}"` });
  } catch (err) { next(err); }
});

export default router;
