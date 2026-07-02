import { Router } from 'express';
import { db } from '../database.js';
import { authMiddleware } from '../auth.js';

const router = Router();
const TABLE = 'hero_slides';

const sorted = (arr) => [...arr].sort((a,b) => a.sort_order - b.sort_order);
const nextId = () => { const a = db.data[TABLE]; return a.length ? Math.max(...a.map(i=>i.id))+1 : 1; };

router.get('/', (_req, res) => {
  res.json(sorted(db.data[TABLE].filter(s => s.active)));
});
router.get('/all', authMiddleware, (_req, res) => {
  res.json(sorted(db.data[TABLE]));
});
router.post('/', authMiddleware, async (req, res) => {
  const { url, title, subtitle, sort_order = 0 } = req.body;
  const id = nextId();
  db.data[TABLE].push({ id, url, title, subtitle, sort_order, active: true });
  await db.write();
  res.json({ id, message: 'Slide criado' });
});
router.put('/:id', authMiddleware, async (req, res) => {
  const id = +req.params.id;
  const idx = db.data[TABLE].findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Não encontrado' });
  db.data[TABLE][idx] = { ...db.data[TABLE][idx], ...req.body, id };
  await db.write();
  res.json({ message: 'Slide atualizado' });
});
router.delete('/:id', authMiddleware, async (req, res) => {
  db.data[TABLE] = db.data[TABLE].filter(s => s.id !== +req.params.id);
  await db.write();
  res.json({ message: 'Slide removido' });
});

export default router;
