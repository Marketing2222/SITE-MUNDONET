import { Router } from 'express';
import { db } from '../database.js';
import { authMiddleware } from '../auth.js';

const router = Router();
const TABLE = 'site_settings';

let writeLock = false;
const queuedWrites = [];

async function safeWrite() {
  if (writeLock) {
    if (!queuedWrites.includes('pending')) queuedWrites.push('pending');
    return;
  }
  writeLock = true;
  try {
    await db.write();
  } finally {
    writeLock = false;
    if (queuedWrites.length > 0) {
      queuedWrites.length = 0;
      safeWrite();
    }
  }
}

router.get('/', (_req, res) => {
  res.set('Cache-Control', 'public, max-age=60');
  const result = {};
  db.data[TABLE].forEach(r => { result[r.key] = { value: r.value, label: r.label }; });
  res.json(result);
});
router.get('/all', authMiddleware, (_req, res) => res.json(db.data[TABLE]));
router.put('/:key', authMiddleware, async (req, res) => {
  const { value, label } = req.body;
  const idx = db.data[TABLE].findIndex(s => s.key === req.params.key);
  if (idx !== -1) {
    db.data[TABLE][idx] = { ...db.data[TABLE][idx], value, label };
  } else {
    const id = db.data[TABLE].length ? Math.max(...db.data[TABLE].map(i=>i.id))+1 : 1;
    db.data[TABLE].push({ id, key: req.params.key, value, label });
  }
  await safeWrite();
  res.json({ message: 'Configuração salva' });
});
router.put('/batch', authMiddleware, async (req, res) => {
  const { settings } = req.body;
  if (!Array.isArray(settings) || settings.length === 0) {
    return res.status(400).json({ error: 'Array "settings" é obrigatório' });
  }
  let created = 0;
  for (const { key, value, label } of settings) {
    const idx = db.data[TABLE].findIndex(s => s.key === key);
    if (idx !== -1) {
      db.data[TABLE][idx] = { ...db.data[TABLE][idx], value, label };
    } else {
      const id = db.data[TABLE].length ? Math.max(...db.data[TABLE].map(i=>i.id))+1 : 1;
      db.data[TABLE].push({ id, key, value, label });
      created++;
    }
  }
  await safeWrite();
  res.json({ message: 'Configurações salvas', count: settings.length, created });
});
export default router;
