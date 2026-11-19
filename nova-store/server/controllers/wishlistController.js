import { db } from '../db/database.js';

export function getWishlist(req, res) {
  try {
    const products = db.prepare(`
      SELECT 
        p.*,
        c.name as category_name,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image,
        w.added_at
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE w.user_id = ?
      ORDER BY w.added_at DESC
    `).all(req.user.id);

    return res.json({ success: true, wishlist: products });
  } catch (err) {
    console.error('getWishlist error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function toggleWishlist(req, res) {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const existing = db.prepare('SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?').get(req.user.id, productId);

    if (existing) {
      db.prepare('DELETE FROM wishlist WHERE id = ?').run(existing.id);
      return res.json({ success: true, isFavorited: false, message: 'Item removed from wishlist.' });
    } else {
      db.prepare('INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)').run(req.user.id, productId);
      return res.json({ success: true, isFavorited: true, message: 'Item added to wishlist.' });
    }
  } catch (err) {
    console.error('toggleWishlist error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}
