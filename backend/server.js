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
import enterprisePlansRoutes from './routes/enterprisePlansRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import testimonialsRoutes from './routes/testimonialsRoutes.js';
import cepSearchRoutes from './routes/cepSearchRoutes.js';
import cepInterestRoutes from './routes/cepInterestRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS: aceita configuração via CORS_ORIGIN (suporta múltiplas origens separadas por vírgula)
const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : '*';
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '50mb' }));

// ── Uploads (armazenados em disco) ────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 300 * 1024 * 1024 }, // 300MB
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
  app.use('/api/enterprise-plans', enterprisePlansRoutes);
  app.use('/api/faq', faqRoutes);
  app.use('/api/testimonials', testimonialsRoutes);
  app.use('/api/cep-searches', cepSearchRoutes);
  app.use('/api/cep-interest', cepInterestRoutes);
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/uploads', express.static(uploadsDir, { maxAge: '7d', immutable: true }));

  app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' });
      const fileUrl = `/uploads/${req.file.filename}`;
      const id = db.nextId('file_uploads');
      db.data.file_uploads.push({
        id,
        filename: req.file.originalname,
        stored: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        created_at: new Date().toISOString(),
      });
      await db.write();
      console.log(`✅ Upload salvo: id=${id}, filename=${req.file.originalname}, size=${(req.file.size / 1024 / 1024).toFixed(1)}MB, path=${fileUrl}`);
      res.json({ url: `${fileUrl}?t=${Date.now()}` });
    } catch (err) {
      console.error('❌ Erro no upload:', err);
      res.status(500).json({ error: 'Erro ao salvar arquivo' });
    }
  });

  // Servir arquivos do banco de dados (legado: base64, novo: disco)
  app.get('/api/files/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
    const file = db.data.file_uploads.find(f => f.id === id);
    if (!file) {
      console.log(`⚠️ Arquivo não encontrado: id=${id}`);
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }
    // Novo: arquivo em disco
    if (file.stored) {
      const filePath = path.join(uploadsDir, file.stored);
      if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', file.mimetype);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        return res.sendFile(filePath);
      }
      return res.status(404).json({ error: 'Arquivo não encontrado no disco' });
    }
    // Legado: base64 no JSON
    const buffer = Buffer.from(file.data, 'base64');
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Cache-Control', 'public, max-age=3600');
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
      const tables = ['users','hero_slides','plans','quick_links','entertainment','contact_info','site_settings','app_library','benefits','file_uploads','badge_library','enterprise_plans','cep_searches','cep_interest'];
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
      // Assets com hash no nome: cache imutável
      app.use('/assets', express.static(path.join(distPath, 'assets'), { maxAge: '1y', immutable: true }));
      app.use(express.static(distPath, { maxAge: '1h', index: false }));
      // index.html SEMPRE fresh (para pegar novos bundles)
      app.get('*', (_req, res) => {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.set('Pragma', 'no-cache');
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
