import { Router } from 'express';
import { db } from '../database.js';
import { authMiddleware } from '../auth.js';

const router = Router();
const TABLE = 'app_library';
const nextId = () => { const a = db.data[TABLE] || []; return a.length ? Math.max(...a.map(i=>i.id))+1 : 1; };

// GET all apps (public - for selector)
router.get('/', authMiddleware, (_req, res) => {
  if (!db.data[TABLE]) db.data[TABLE] = [];
  res.json(db.data[TABLE]);
});

// POST new app
router.post('/', authMiddleware, async (req, res) => {
  if (!db.data[TABLE]) db.data[TABLE] = [];
  const id = nextId();
  const app = { id, ...req.body, created_at: new Date().toISOString() };
  db.data[TABLE].push(app);
  await db.write();
  res.json(app);
});

// PUT update app
router.put('/:id', authMiddleware, async (req, res) => {
  const id = +req.params.id;
  const idx = (db.data[TABLE] || []).findIndex(a => a.id === id);
  if (idx === -1) return res.status(404).json({ error: 'App não encontrado' });
  db.data[TABLE][idx] = { ...db.data[TABLE][idx], ...req.body, id };
  await db.write();
  res.json(db.data[TABLE][idx]);
});

// DELETE app
router.delete('/:id', authMiddleware, async (req, res) => {
  db.data[TABLE] = (db.data[TABLE] || []).filter(a => a.id !== +req.params.id);
  await db.write();
  res.json({ message: 'App removido da biblioteca' });
});

export default router;
