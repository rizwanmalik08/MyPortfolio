import { db } from '../db/database.js';

export function getProductReviews(req, res) {
  try {
    const { productId } = req.params;
    const reviews = db.prepare(`
      SELECT * FROM reviews
      WHERE product_id = ? AND status = 'approved'
      ORDER BY created_at DESC
    `).all(productId);

    return res.json({ success: true, reviews });
  } catch (err) {
    console.error('getProductReviews error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function addReview(req, res) {
  try {
    const { productId, rating, comment, userName } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Product ID, rating, and review text are required.' });
    }

    const name = (req.user ? req.user.name : userName) || 'Verified Shopper';
    const numRating = Math.min(5, Math.max(1, parseInt(rating) || 5));

    db.prepare(`
      INSERT INTO reviews (product_id, user_id, user_name, rating, comment, status)
      VALUES (?, ?, ?, ?, ?, 'approved')
    `).run(productId, req.user ? req.user.id : null, name.trim(), numRating, comment.trim());

    // Update aggregate product rating & review count
    const stats = db.prepare(`
      SELECT COUNT(*) as count, AVG(rating) as avg_rating
      FROM reviews
      WHERE product_id = ? AND status = 'approved'
    `).get(productId);

    if (stats) {
      const avg = parseFloat(stats.avg_rating.toFixed(2));
      db.prepare('UPDATE products SET rating = ?, review_count = ? WHERE id = ?').run(avg, stats.count, productId);
    }

    return res.status(201).json({ success: true, message: 'Review published successfully.' });
  } catch (err) {
    console.error('addReview error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}
