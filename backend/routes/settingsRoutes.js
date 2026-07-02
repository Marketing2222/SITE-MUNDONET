import { Router } from 'express';
import { db } from '../database.js';
import { authMiddleware } from '../auth.js';

const router = Router();
const TABLE = 'site_settings';

router.get('/', (_req, res) => {
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
  await db.write();
  res.json({ message: 'Configuração salva' });
});
export default router;
