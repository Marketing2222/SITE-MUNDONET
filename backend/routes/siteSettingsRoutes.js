import express from 'express';
import { db } from '../database.js';

const router = express.Router();
const THEME_KEY = '_global_theme';

router.get('/', async (req, res) => {
  const entry = db.data.site_settings.find(s => s.key === THEME_KEY);
  const settings = entry ? JSON.parse(entry.value) : {};
  res.json(settings);
});

router.put('/', async (req, res) => {
  const newSettings = req.body;
  const idx = db.data.site_settings.findIndex(s => s.key === THEME_KEY);
  if (idx !== -1) {
    const existing = JSON.parse(db.data.site_settings[idx].value);
    db.data.site_settings[idx].value = JSON.stringify({ ...existing, ...newSettings });
  } else {
    const id = db.data.site_settings.length ? Math.max(...db.data.site_settings.map(i => i.id)) + 1 : 1;
    db.data.site_settings.push({ id, key: THEME_KEY, value: JSON.stringify(newSettings), label: 'Tema Global' });
  }
  await db.write();
  res.json(newSettings);
});

export default router;
