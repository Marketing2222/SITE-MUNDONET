import { Router } from 'express';
import { db } from '../database.js';

const router = Router();

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Não autorizado' });
  next();
}

router.get('/', (_req, res) => {
  const plans = (db.data.enterprise_plans || []).filter(p => p.active !== false);
  plans.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  res.json(plans);
});

router.get('/all', auth, (_req, res) => {
  const plans = [...(db.data.enterprise_plans || [])];
  plans.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  res.json(plans);
});

router.post('/', auth, async (req, res) => {
  const plan = { id: db.nextId('enterprise_plans'), ...req.body, active: true };
  db.data.enterprise_plans.push(plan);
  await db.write();
  res.status(201).json(plan);
});

router.put('/:id', auth, async (req, res) => {
  const id = parseInt(req.params.id);
  const idx = db.data.enterprise_plans.findIndex(p => p.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Plano não encontrado' });
  db.data.enterprise_plans[idx] = { ...db.data.enterprise_plans[idx], ...req.body, id };
  await db.write();
  res.json(db.data.enterprise_plans[idx]);
});

router.delete('/:id', auth, async (req, res) => {
  const id = parseInt(req.params.id);
  db.data.enterprise_plans = db.data.enterprise_plans.filter(p => p.id !== id);
  await db.write();
  res.json({ message: 'Plano removido' });
});

export default router;
