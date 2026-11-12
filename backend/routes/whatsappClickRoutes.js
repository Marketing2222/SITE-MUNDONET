import { Router } from 'express';
import { db } from '../database.js';
import { authMiddleware } from '../auth.js';

const router = Router();
const TABLE = 'whatsapp_clicks';

// POST público — registra clique no botão "Falar com especialista" (vai pro WhatsApp)
router.post('/', async (req, res) => {
  try {
    if (!db.data[TABLE]) db.data[TABLE] = [];
    const id = db.data[TABLE].length ? Math.max(...db.data[TABLE].map(i => i.id)) + 1 : 1;
    db.data[TABLE].push({
      id,
      cep: (req.body.cep || '').replace(/\D/g, ''),
      source: req.body.source || 'splash',
      created_at: new Date().toISOString(),
    });
    await db.write();
    res.json({ ok: true });
  } catch (err) {
    console.error('Erro ao registrar clique WhatsApp:', err);
    res.status(500).json({ error: 'Erro ao registrar clique' });
  }
});

// GET autenticado — lista paginada
router.get('/', authMiddleware, async (req, res) => {
  if (!db.data[TABLE]) db.data[TABLE] = [];
  let results = [...db.data[TABLE]];

  const { cep, source, dateFrom, dateTo } = req.query;
  if (cep) {
    const cepClean = cep.replace(/\D/g, '');
    results = results.filter(r => r.cep.includes(cepClean));
  }
  if (source) results = results.filter(r => r.source === source);
  if (dateFrom) {
    const from = new Date(dateFrom);
    results = results.filter(r => new Date(r.created_at) >= from);
  }
  if (dateTo) {
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    results = results.filter(r => new Date(r.created_at) <= to);
  }

  results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const total = results.length;
  const offset = (page - 1) * limit;

  res.json({ data: results.slice(offset, offset + limit), total, page, limit });
});

// GET autenticado — resumo para o relatório
router.get('/stats', authMiddleware, async (req, res) => {
  if (!db.data[TABLE]) db.data[TABLE] = [];
  const all = db.data[TABLE];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayCount = all.filter(r => new Date(r.created_at) >= today).length;

  // 7 dias (para gráfico simples)
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    days.push({
      date: d.toISOString().slice(0, 10),
      count: all.filter(r => {
        const t = new Date(r.created_at);
        return t >= d && t < next;
      }).length,
    });
  }

  // Top CEPs de quem clicou
  const cepCount = {};
  all.forEach(r => {
    if (r.cep) cepCount[r.cep] = (cepCount[r.cep] || 0) + 1;
  });
  const topCeps = Object.entries(cepCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cep, count]) => ({ cep, count }));

  res.json({ total: all.length, todayCount, last7Days: days, topCeps });
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
  res.json({ message: 'Todos os cliques foram removidos' });
});

export default router;
