import { Router } from 'express';
import { db } from '../database.js';
import { authMiddleware } from '../auth.js';

const router = Router();
const TABLE = 'plans';
const sorted = (arr) => [...arr].sort((a,b) => a.sort_order - b.sort_order);
const nextId = () => { const a = db.data[TABLE]; return a.length ? Math.max(...a.map(i=>i.id))+1 : 1; };

router.get('/', (_req, res) => res.json(sorted(db.data[TABLE].filter(p => p.active))));
router.get('/all', authMiddleware, (_req, res) => res.json(sorted(db.data[TABLE])));

router.post('/', authMiddleware, async (req, res) => {
  const id = nextId();
  db.data[TABLE].push({ id, ...req.body, active: req.body.active !== false });
  await db.write();
  res.json({ id, message: 'Plano criado' });
});
router.put('/:id', authMiddleware, async (req, res) => {
  const id = +req.params.id;
  const idx = db.data[TABLE].findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Não encontrado' });
  db.data[TABLE][idx] = { ...db.data[TABLE][idx], ...req.body, id };
  await db.write();
  res.json({ message: 'Plano atualizado' });
});
router.delete('/:id', authMiddleware, async (req, res) => {
  db.data[TABLE] = db.data[TABLE].filter(p => p.id !== +req.params.id);
  await db.write();
  res.json({ message: 'Plano removido' });
});

export default router;
