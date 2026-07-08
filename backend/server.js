import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { initDB, db } from './database.js';
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
import badgeLibraryRoutes from './routes/badgeLibraryRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS: aceita configuração via CORS_ORIGIN (suporta múltiplas origens separadas por vírgula)
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : '*';
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

// ── Uploads (armazenados no banco de dados) ────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

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
  app.use('/api/badge-library', badgeLibraryRoutes);
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada' });
      const base64 = req.file.buffer.toString('base64');
      const id = db.nextId('file_uploads');
      db.data.file_uploads.push({
        id,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        data: base64,
        created_at: new Date().toISOString(),
      });
      await db.write();
      console.log(`✅ Upload salvo: id=${id}, filename=${req.file.originalname}, size=${req.file.size}bytes`);
      res.json({ url: `/api/files/${id}?t=${Date.now()}` });
    } catch (err) {
      console.error('❌ Erro no upload:', err);
      res.status(500).json({ error: 'Erro ao salvar arquivo' });
    }
  });

  // Servir arquivos do banco de dados (cache curto para evitar imagens obsoletas)
  app.get('/api/files/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const file = db.data.file_uploads.find(f => f.id === id);
    if (!file) {
      console.log(`⚠️ Arquivo não encontrado: id=${id}`);
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }
    const buffer = Buffer.from(file.data, 'base64');
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hora
    res.send(buffer);
  });

  // ── Backup: Exportar banco de dados ────────────────────────────
  app.get('/api/backup/export', (req, res) => {
    const secret = req.query.secret || req.headers['x-backup-secret'];
    if (secret !== 'mundonet-backup-2026') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    const { _counters, ...exportData } = db.data;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="mundonet-backup-${Date.now()}.json"`);
    res.json(exportData);
  });

  // ── Backup: Restaurar banco de dados ──────────────────────────
  app.post('/api/backup/restore', express.json({ limit: '50mb' }), async (req, res) => {
    const secret = req.body?.secret || req.headers['x-backup-secret'];
    if (secret !== 'mundonet-backup-2026') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    const backupData = req.body?.data;
    if (!backupData || typeof backupData !== 'object') {
      return res.status(400).json({ error: 'Dados de backup inválidos' });
    }
    try {
      const tables = ['users','hero_slides','plans','quick_links','entertainment','contact_info','site_settings','app_library','benefits','file_uploads','badge_library'];
      let restored = 0;
      for (const table of tables) {
        if (backupData[table] && Array.isArray(backupData[table])) {
          db.data[table] = backupData[table];
          restored += backupData[table].length;
        }
      }
      await db.write();
      console.log(`✅ Backup restaurado: ${restored} registros de ${tables.length} tabelas`);
      res.json({ message: 'Backup restaurado com sucesso', records: restored });
    } catch (err) {
      console.error('❌ Erro ao restaurar backup:', err);
      res.status(500).json({ error: 'Erro ao restaurar backup' });
    }
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
