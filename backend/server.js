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
const PORT = process.env.PORT || 3001;

// CORS: aceita configuração via CORS_ORIGIN (suporta múltiplas origens separadas por vírgula)
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : '*';
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

// ── Uploads ──────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

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
    // URL relativa: funciona em qualquer domínio sem hardcode de localhost
    const baseUrl = process.env.PUBLIC_URL || `http://localhost:${PORT}`;
    const url = `${baseUrl}/uploads/${req.file.filename}`;
    res.json({ url });
  });

  // ── Serve o frontend React (dist/) em produção ────────────────────
  const distPaths = [
    path.join(__dirname, 'public'),
    path.join(__dirname, '..', 'dist'),
  ];
  let foundDist = false;
  for (const distPath of distPaths) {
    if (fs.existsSync(distPath)) {
      foundDist = true;
      app.use(express.static(distPath));
      // Rota catch-all para o React Router (SPA)
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
      console.log(`📁 Servindo frontend de: ${distPath}`);
      break;
    }
  }
  if (!foundDist) {
    console.log('⚠️  Nenhum build do frontend encontrado (public/ ou dist/). Apenas API disponível.');
  }

  // Tratamento global de erros (garante resposta JSON sempre)
  app.use((err, _req, res, _next) => {
    console.error('❌ Erro não tratado:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Mundonet Backend rodando na porta ${PORT}`);
    console.log(`📦 Banco de dados: mundonet-db.json`);
    console.log(`🔐 Admin: admin@mundonet.com.br / admin123`);
  });
}).catch(err => {
  console.error('❌ Erro ao iniciar banco:', err);
  process.exit(1);
});
