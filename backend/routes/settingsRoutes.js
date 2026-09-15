import { Router } from 'express';
import { db } from '../database.js';
import { authMiddleware } from '../auth.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'data', 'mundonet-db.json');

const router = Router();
const TABLE = 'site_settings';

let writeLock = false;
let pendingWrite = false;

async function safeWrite() {
  if (writeLock) {
    pendingWrite = true;
    return;
  }
  writeLock = true;
  try {
    await db.write();
    console.log('✅ db.write() concluído');
  } catch (err) {
    console.error('❌ ERRO ao escrever banco:', err);
  } finally {
    writeLock = false;
    if (pendingWrite) {
      pendingWrite = false;
      await safeWrite();
    }
  }
}

router.get('/', (_req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  const result = {};
  db.data[TABLE].forEach(r => { result[r.key] = { value: r.value, label: r.label }; });
  res.json(result);
});
router.get('/all', authMiddleware, (_req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.json(db.data[TABLE]);
});
// ⚠️ /batch DEVE vir ANTES de /:key senao Express faz match errado
router.put('/batch', authMiddleware, async (req, res) => {
  const { settings } = req.body;
  if (!Array.isArray(settings) || settings.length === 0) {
    return res.status(400).json({ error: 'Array "settings" é obrigatório' });
  }
  let created = 0;
  let updated = 0;
  for (const { key, value, label } of settings) {
    const idx = db.data[TABLE].findIndex(s => s.key === key);
    if (idx !== -1) {
      db.data[TABLE][idx] = { ...db.data[TABLE][idx], value, label };
      updated++;
    } else {
      const id = db.data[TABLE].length ? Math.max(...db.data[TABLE].map(i=>i.id))+1 : 1;
      db.data[TABLE].push({ id, key, value, label });
      created++;
    }
  }
  // Gravar no disco: primeiro via LowDB, depois fs.writeFileSync como garantia
  try {
    await db.write();
  } catch (writeErr) {
    console.error('❌ db.write() FALHOU:', writeErr);
  }
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db.data, null, 2), 'utf8');
    console.log(`✅ Batch save OK: ${updated} updated, ${created} created → ${DB_PATH}`);
  } catch (fsErr) {
    console.error('❌ fs.writeFileSync FALHOU:', fsErr);
    return res.status(500).json({ error: 'Erro ao gravar no disco', detail: String(fsErr) });
  }
  // Verificar persistência no disco
  try {
    const diskContent = fs.readFileSync(DB_PATH, 'utf8');
    const diskData = JSON.parse(diskContent);
    const diskSiteName = diskData.site_settings?.find(s => s.key === 'site_name');
    const diskFavicon = diskData.site_settings?.find(s => s.key === 'favicon_url');
    console.log(`💾 Disco OK — site_name: "${diskSiteName?.value?.substring(0, 30)}", favicon: "${diskFavicon?.value?.substring(0, 50)}"`);
  } catch (verifyErr) {
    console.error('⚠️ Falha ao verificar disco:', verifyErr);
  }
  res.json({ message: 'Configurações salvas', count: settings.length, created, updated });
});
router.put('/:key', authMiddleware, async (req, res) => {
  const { value, label } = req.body;
  const idx = db.data[TABLE].findIndex(s => s.key === req.params.key);
  if (idx !== -1) {
    db.data[TABLE][idx] = { ...db.data[TABLE][idx], value, label };
  } else {
    const id = db.data[TABLE].length ? Math.max(...db.data[TABLE].map(i=>i.id))+1 : 1;
    db.data[TABLE].push({ id, key: req.params.key, value, label });
  }
  await safeWrite();
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db.data, null, 2), 'utf8');
  } catch (fsErr) {
    console.error('❌ fs.writeFileSync FALHOU:', fsErr);
  }
  res.json({ message: 'Configuração salva' });
});
export default router;
