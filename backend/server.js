import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { initDB } from './database.js';
import authRoutes from './routes/authRoutes.js';
import heroRoutes from './routes/heroRoutes.js';
import plansRoutes from './routes/plansRoutes.js';
import quicklinksRoutes from './routes/quicklinksRoutes.js';
import entertainmentRoutes from './routes/entertainmentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import appLibraryRoutes from './routes/appLibraryRoutes.js';
import siteSettingsRoutes from './routes/siteSettingsRoutes.js';
import benefitsRoutes from './routes/benefitsRoutes.js';

const app = express();
const PORT = 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

// Criar diretório de uploads se não existir
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'))
});
const upload = multer({ storage });

// ── Inicializa banco antes de registrar rotas ─────────────────────
initDB().then(() => {
  app.use('/api/auth', authRoutes);
  app.use('/api/hero', heroRoutes);
  app.use('/api/plans', plansRoutes);
  app.use('/api/quicklinks', quicklinksRoutes);
  app.use('/api/entertainment', entertainmentRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/app-library', appLibraryRoutes);
  app.use('/api/site-settings', siteSettingsRoutes);
  app.use('/api/benefits', benefitsRoutes);
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    const url = `http://localhost:3001/uploads/${req.file.filename}`;
    res.json({ url });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Mundonet Backend rodando em http://localhost:${PORT}`);
    console.log(`📦 Banco de dados: mundonet-db.json`);
    console.log(`🔐 Admin: admin@mundonet.com.br / admin123`);
  });
}).catch(err => {
  console.error('❌ Erro ao iniciar banco:', err);
  process.exit(1);
});
