import { Router } from 'express';
import { db } from '../database.js';
import { authMiddleware } from '../auth.js';

const router = Router();
const TABLE = 'testimonials';

router.get('/', (_req, res) => {
  if (!db.data[TABLE]) db.data[TABLE] = [];
  res.json(db.data[TABLE].sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)));
});
router.post('/', authMiddleware, async (req, res) => {
  if (!db.data[TABLE]) db.data[TABLE] = [];
  const id = db.data[TABLE].length ? Math.max(...db.data[TABLE].map((i: any) => i.id)) + 1 : 1;
  const item = { id, ...req.body };
  db.data[TABLE].push(item);
  await db.write();
  res.json(item);
});
router.put('/:id', authMiddleware, async (req, res) => {
  const idx = db.data[TABLE]?.findIndex((s: any) => s.id === Number(req.params.id));
  if (idx === -1 || idx === undefined) return res.status(404).json({ error: 'Item não encontrado' });
  db.data[TABLE][idx] = { ...db.data[TABLE][idx], ...req.body };
  await db.write();
  res.json(db.data[TABLE][idx]);
});
router.delete('/:id', authMiddleware, async (req, res) => {
  if (!db.data[TABLE]) db.data[TABLE] = [];
  db.data[TABLE] = db.data[TABLE].filter((s: any) => s.id !== Number(req.params.id));
  await db.write();
  res.json({ message: 'Removido' });
});

export default router;
