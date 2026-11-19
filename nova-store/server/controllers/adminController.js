import { db } from '../db/database.js';

export function getStats(req, res) {
  try {
    const totalRevenueRow = db.prepare("SELECT SUM(total_amount) as total FROM orders WHERE status != 'cancelled'").get();
    const totalOrdersRow = db.prepare("SELECT COUNT(*) as count FROM orders").get();
    const totalCustomersRow = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get();
    const lowStockCount = db.prepare("SELECT COUNT(*) as count FROM products WHERE stock <= 15").get()?.count || 0;

    const recentOrders = db.prepare(`
      SELECT id, order_number, customer_name, total_amount, status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 8
    `).all();

    const lowStockProducts = db.prepare(`
      SELECT id, name, slug, stock, price, category_slug
      FROM products
      WHERE stock <= 20
      ORDER BY stock ASC
      LIMIT 6
    `).all();

    return res.json({
      success: true,
      stats: {
        totalRevenue: parseFloat((totalRevenueRow?.total || 0).toFixed(2)),
        totalOrders: totalOrdersRow?.count || 0,
        totalCustomers: totalCustomersRow?.count || 0,
        lowStockCount,
        recentOrders,
        lowStockProducts
      }
    });
  } catch (err) {
    console.error('getStats error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function getAllOrders(req, res) {
  try {
    const { status, limit = 50 } = req.query;
    let sql = 'SELECT * FROM orders';
    const params = [];

    if (status && status !== 'all') {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit) || 50);

    const orders = db.prepare(sql).all(...params);

    const formatted = orders.map(o => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id);
      return { ...o, items };
    });

    return res.json({ success: true, orders: formatted });
  } catch (err) {
    console.error('getAllOrders error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status value.' });
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    return res.json({ success: true, message: `Order #${id} status updated to "${status}".` });
  } catch (err) {
    console.error('updateOrderStatus error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function getAllProductsAdmin(req, res) {
  try {
    const products = db.prepare(`
      SELECT 
        p.*, 
        c.name as category_name,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id DESC
    `).all();

    return res.json({ success: true, products });
  } catch (err) {
    console.error('getAllProductsAdmin error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function createProduct(req, res) {
  try {
    const {
      name,
      categorySlug,
      price,
      salePrice,
      stock = 50,
      description,
      isFeatured = 0,
      isTrending = 0,
      imageUrl
    } = req.body;

    if (!name || !categorySlug || !price || !description) {
      return res.status(400).json({ success: false, message: 'Name, category, price, and description are required.' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);
    const category = db.prepare('SELECT id FROM categories WHERE slug = ?').get(categorySlug);

    const result = db.prepare(`
      INSERT INTO products (
        name, slug, category_id, category_slug, price, sale_price, stock,
        description, is_featured, is_trending
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name.trim(),
      slug,
      category ? category.id : null,
      categorySlug,
      parseFloat(price),
      salePrice ? parseFloat(salePrice) : null,
      parseInt(stock) || 0,
      description.trim(),
      isFeatured ? 1 : 0,
      isTrending ? 1 : 0
    );

    const newId = db.prepare('SELECT last_insert_rowid() as id').get()?.id;

    if (imageUrl && newId) {
      db.prepare('INSERT INTO product_images (product_id, url, is_primary) VALUES (?, ?, 1)').run(newId, imageUrl);
    }

    return res.status(201).json({ success: true, message: 'Product created successfully.', id: newId });
  } catch (err) {
    console.error('createProduct error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const { name, price, salePrice, stock, isFeatured, isTrending, description } = req.body;

    db.prepare(`
      UPDATE products SET 
        name = COALESCE(?, name),
        price = COALESCE(?, price),
        sale_price = ?,
        stock = COALESCE(?, stock),
        is_featured = COALESCE(?, is_featured),
        is_trending = COALESCE(?, is_trending),
        description = COALESCE(?, description)
      WHERE id = ?
    `).run(
      name || null,
      price ? parseFloat(price) : null,
      salePrice !== undefined ? (salePrice ? parseFloat(salePrice) : null) : null,
      stock !== undefined ? parseInt(stock) : null,
      isFeatured !== undefined ? (isFeatured ? 1 : 0) : null,
      isTrending !== undefined ? (isTrending ? 1 : 0) : null,
      description || null,
      id
    );

    return res.json({ success: true, message: 'Product updated successfully.' });
  } catch (err) {
    console.error('updateProduct error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('deleteProduct error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function getCouponsAdmin(req, res) {
  try {
    const coupons = db.prepare('SELECT * FROM coupons ORDER BY id DESC').all();
    return res.json({ success: true, coupons });
  } catch (err) {
    console.error('getCouponsAdmin error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function createCoupon(req, res) {
  try {
    const { code, discountType, discountValue, minSpend = 0, maxUses = 1000 } = req.body;
    if (!code || !discountType || !discountValue) {
      return res.status(400).json({ success: false, message: 'Code, discount type, and value are required.' });
    }

    db.prepare(`
      INSERT INTO coupons (code, discount_type, discount_value, min_spend, max_uses, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `).run(code.toUpperCase().trim(), discountType, parseFloat(discountValue), parseFloat(minSpend), parseInt(maxUses));

    return res.status(201).json({ success: true, message: 'Coupon created successfully.' });
  } catch (err) {
    console.error('createCoupon error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function updateStoreSettings(req, res) {
  try {
    const { settings = {} } = req.body;
    const stmt = db.prepare('INSERT OR REPLACE INTO store_settings (key, value) VALUES (?, ?)');

    for (const [k, v] of Object.entries(settings)) {
      stmt.run(k, String(v));
    }

    return res.json({ success: true, message: 'Store settings updated successfully.' });
  } catch (err) {
    console.error('updateStoreSettings error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}
