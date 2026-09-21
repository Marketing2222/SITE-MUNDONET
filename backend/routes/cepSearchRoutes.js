import { Router } from 'express';
import { db } from '../database.js';
import { authMiddleware } from '../auth.js';

const router = Router();
const TABLE = 'cep_searches';

router.get('/', authMiddleware, async (req, res) => {
  if (!db.data[TABLE]) db.data[TABLE] = [];
  let results = [...db.data[TABLE]];

  // Filtros
  const { cep, result, dateFrom, dateTo, search } = req.query;
  if (cep) {
    const cepClean = cep.replace(/\D/g, '');
    results = results.filter(r => r.cep.replace(/\D/g, '').includes(cepClean));
  }
  if (result) {
    results = results.filter(r => r.result === result);
  }
  if (dateFrom) {
    const from = new Date(dateFrom);
    results = results.filter(r => new Date(r.created_at) >= from);
  }
  if (dateTo) {
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    results = results.filter(r => new Date(r.created_at) <= to);
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(r =>
      r.cep.includes(q) ||
      (r.street && r.street.toLowerCase().includes(q)) ||
      (r.neighborhood && r.neighborhood.toLowerCase().includes(q)) ||
      (r.city && r.city.toLowerCase().includes(q))
    );
  }

  // Ordenar por data mais recente
  results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Paginação
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const total = results.length;
  const offset = (page - 1) * limit;
  const paged = results.slice(offset, offset + limit);

  res.json({ data: paged, total, page, limit });
});

router.get('/stats', authMiddleware, async (req, res) => {
  if (!db.data[TABLE]) db.data[TABLE] = [];
  const all = db.data[TABLE];

  const total = all.length;
  const covered = all.filter(r => r.result === 'success').length;
  const notCovered = all.filter(r => r.result === 'fail').length;
  const invalid = all.filter(r => r.result === 'invalid').length;

  // Buscas hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = all.filter(r => new Date(r.created_at) >= today).length;

  // Top 10 CEPs mais buscados
  const cepCount = {};
  all.forEach(r => {
    const clean = r.cep.replace(/\D/g, '');
    cepCount[clean] = (cepCount[clean] || 0) + 1;
  });
  const topCeps = Object.entries(cepCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([cep, count]) => ({ cep, count }));

  // Top bairros
  const neighborhoodCount = {};
  all.forEach(r => {
    if (r.neighborhood) {
      neighborhoodCount[r.neighborhood] = (neighborhoodCount[r.neighborhood] || 0) + 1;
    }
  });
  const topNeighborhoods = Object.entries(neighborhoodCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  res.json({ total, covered, notCovered, invalid, todayCount, topCeps, topNeighborhoods });
});

router.post('/', async (req, res) => {
  if (!db.data[TABLE]) db.data[TABLE] = [];
  const id = db.data[TABLE].length ? Math.max(...db.data[TABLE].map(i => i.id)) + 1 : 1;
  const entry = {
    id,
    cep: req.body.cep || '',
    street: req.body.street || '',
    neighborhood: req.body.neighborhood || '',
    city: req.body.city || '',
    uf: req.body.uf || '',
    result: req.body.result || 'unknown',
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
