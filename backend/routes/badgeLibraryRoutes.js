import { Router } from 'express';
import { db } from '../database.js';
import { authMiddleware } from '../auth.js';

const router = Router();
const TABLE = 'badge_library';

// Inicializar tabela se não existir
if (!db.data[TABLE]) {
  db.data[TABLE] = [];
}

const nextId = () => { const a = db.data[TABLE]; return a.length ? Math.max(...a.map(i=>i.id))+1 : 1; };

// Listar todos (público)
router.get('/', (_req, res) => res.json(db.data[TABLE]));

// Criar
router.post('/', authMiddleware, async (req, res) => {
  const id = nextId();
  db.data[TABLE].push({ id, ...req.body });
  await db.write();
  res.json({ id, message: 'Badge criada' });
});

// Atualizar
router.put('/:id', authMiddleware, async (req, res) => {
  const id = +req.params.id;
  const idx = db.data[TABLE].findIndex(b => b.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Não encontrado' });
  db.data[TABLE][idx] = { ...db.data[TABLE][idx], ...req.body, id };
  await db.write();
  res.json({ message: 'Badge atualizada' });
});

// Deletar
router.delete('/:id', authMiddleware, async (req, res) => {
  db.data[TABLE] = db.data[TABLE].filter(b => b.id !== +req.params.id);
  await db.write();
  res.json({ message: 'Badge removida' });
});

export default router;
