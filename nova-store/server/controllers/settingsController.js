import { db } from '../db/database.js';

export function getPublicSettings(req, res) {
  try {
    const rows = db.prepare('SELECT key, value FROM store_settings').all();
    const settings = {};
    rows.forEach(r => {
      settings[r.key] = r.value;
    });

    return res.json({ success: true, settings });
  } catch (err) {
    console.error('getPublicSettings error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}
