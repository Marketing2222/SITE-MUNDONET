import { Router } from 'express';
import { db } from '../database.js';
import { authMiddleware } from '../auth.js';

const router = Router();
const TABLE = 'cep_interest';

router.get('/', authMiddleware, async (req, res) => {
  if (!db.data[TABLE]) db.data[TABLE] = [];
  let results = [...db.data[TABLE]];

  const { cep, bairro, search } = req.query;
  if (cep) {
    const cepClean = cep.replace(/\D/g, '');
    results = results.filter(r => r.cep.replace(/\D/g, '').includes(cepClean));
  }
  if (bairro) {
    const q = bairro.toLowerCase();
    results = results.filter(r => r.bairro && r.bairro.toLowerCase().includes(q));
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(r =>
      r.cep.includes(q) ||
      (r.endereco && r.endereco.toLowerCase().includes(q)) ||
      (r.bairro && r.bairro.toLowerCase().includes(q)) ||
      (r.whatsapp && r.whatsapp.includes(q))
    );
  }

  results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const total = results.length;
  const offset = (page - 1) * limit;
  const paged = results.slice(offset, offset + limit);

  res.json({ data: paged, total, page, limit });
});

router.post('/', async (req, res) => {
  if (!db.data[TABLE]) db.data[TABLE] = [];
  const id = db.data[TABLE].length ? Math.max(...db.data[TABLE].map(i => i.id)) + 1 : 1;
  const entry = {
    id,
    cep: req.body.cep || '',
    endereco: req.body.endereco || '',
    bairro: req.body.bairro || '',
    whatsapp: req.body.whatsapp || '',
    created_at: new Date().toISOString(),
  };
  db.data[TABLE].push(entry);
  await db.write();
  res.json({ ok: true });
});

router.delete('/:id', authMiddleware, async (req, res) => {
  if (!db.data[TABLE]) db.data[TABLE] = [];
  db.data[TABLE] = db.data[TABLE].filter(i => i.id !== Number(req.params.id));
  await db.write();
  res.json({ message: 'Removido' });
});

router.delete('/', authMiddleware, async (req, res) => {
  if (!db.data[TABLE]) db.data[TABLE] = [];
  db.data[TABLE] = [];
  await db.write();
  res.json({ message: 'Todos os registros foram removidos' });
});

export default router;
