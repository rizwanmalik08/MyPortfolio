import { db } from '../db/database.js';

export function getCategories(req, res) {
  try {
    const categories = db.prepare(`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM products WHERE category_id = c.id) as item_count
      FROM categories c
      ORDER BY c.featured DESC, c.id ASC
    `).all();

    return res.json({ success: true, categories });
  } catch (err) {
    console.error('getCategories error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function getCategoryBySlug(req, res) {
  try {
    const { slug } = req.params;
    const category = db.prepare(`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM products WHERE category_id = c.id) as item_count
      FROM categories c
      WHERE c.slug = ?
    `).get(slug);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    return res.json({ success: true, category });
  } catch (err) {
    console.error('getCategoryBySlug error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}
