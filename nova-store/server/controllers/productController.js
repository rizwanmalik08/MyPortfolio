import { db } from '../db/database.js';

export function getProducts(req, res) {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      inStock,
      sort = 'featured',
      page = 1,
      limit = 12
    } = req.query;

    const conditions = [];
    const params = [];

    if (category && category !== 'all') {
      conditions.push('p.category_slug = ?');
      params.push(category);
    }

    if (search) {
      conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (minPrice) {
      conditions.push('p.price >= ?');
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      conditions.push('p.price <= ?');
      params.push(parseFloat(maxPrice));
    }

    if (inStock === 'true' || inStock === '1') {
      conditions.push('p.stock > 0');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sorting
    let orderBy = 'p.is_featured DESC, p.id DESC';
    if (sort === 'price_asc') orderBy = 'p.price ASC';
    else if (sort === 'price_desc') orderBy = 'p.price DESC';
    else if (sort === 'rating') orderBy = 'p.rating DESC';
    else if (sort === 'newest') orderBy = 'p.created_at DESC';

    // Count Total
    const countSql = `SELECT COUNT(*) as total FROM products p ${whereClause}`;
    const total = db.prepare(countSql).get(...params)?.total || 0;

    // Pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 12);
    const offset = (pageNum - 1) * limitNum;

    // Query Products with primary image
    const dataSql = `
      SELECT 
        p.*, 
        c.name as category_name,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const products = db.prepare(dataSql).all(...params, limitNum, offset);

    // Format products
    const formatted = products.map(p => ({
      ...p,
      has_3d: Boolean(p.has_3d),
      specifications: p.specifications ? JSON.parse(p.specifications) : {},
      colors: p.colors ? JSON.parse(p.colors) : [],
      sizes: p.sizes ? JSON.parse(p.sizes) : [],
      primary_image: p.primary_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    }));

    return res.json({
      success: true,
      products: formatted,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('getProducts error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function getFeatured(req, res) {
  try {
    const products = db.prepare(`
      SELECT 
        p.*, 
        c.name as category_name,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = 1
      ORDER BY p.id ASC
      LIMIT 8
    `).all();

    const formatted = products.map(p => ({
      ...p,
      has_3d: Boolean(p.has_3d),
      colors: p.colors ? JSON.parse(p.colors) : [],
      primary_image: p.primary_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    }));

    return res.json({ success: true, products: formatted });
  } catch (err) {
    console.error('getFeatured error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function getTrending(req, res) {
  try {
    const products = db.prepare(`
      SELECT 
        p.*, 
        c.name as category_name,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_trending = 1
      ORDER BY p.rating DESC
      LIMIT 6
    `).all();

    const formatted = products.map(p => ({
      ...p,
      has_3d: Boolean(p.has_3d),
      colors: p.colors ? JSON.parse(p.colors) : [],
      primary_image: p.primary_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    }));

    return res.json({ success: true, products: formatted });
  } catch (err) {
    console.error('getTrending error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function getBestSellers(req, res) {
  try {
    const products = db.prepare(`
      SELECT 
        p.*, 
        c.name as category_name,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_best_seller = 1
      ORDER BY p.review_count DESC
      LIMIT 6
    `).all();

    const formatted = products.map(p => ({
      ...p,
      has_3d: Boolean(p.has_3d),
      colors: p.colors ? JSON.parse(p.colors) : [],
      primary_image: p.primary_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
    }));

    return res.json({ success: true, products: formatted });
  } catch (err) {
    console.error('getBestSellers error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function getProductBySlugOrId(req, res) {
  try {
    const { idOrSlug } = req.params;
    const isNum = /^\d+$/.test(idOrSlug);

    const product = db.prepare(`
      SELECT 
        p.*, 
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ${isNum ? 'p.id = ?' : 'p.slug = ?'}
    `).get(isNum ? parseInt(idOrSlug) : idOrSlug);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Get all gallery images
    const images = db.prepare(`
      SELECT url, is_primary FROM product_images
      WHERE product_id = ?
      ORDER BY sort_order ASC, id ASC
    `).all(product.id);

    // Get approved reviews
    const reviews = db.prepare(`
      SELECT id, user_name, rating, comment, created_at
      FROM reviews
      WHERE product_id = ? AND status = 'approved'
      ORDER BY created_at DESC
      LIMIT 20
    `).all(product.id);

    // Get related products from same category
    const related = db.prepare(`
      SELECT 
        p.id, p.name, p.slug, p.price, p.sale_price, p.rating, p.has_3d,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM products p
      WHERE p.category_id = ? AND p.id != ?
      LIMIT 4
    `).all(product.category_id, product.id);

    const formatted = {
      ...product,
      has_3d: Boolean(product.has_3d),
      specifications: product.specifications ? JSON.parse(product.specifications) : {},
      colors: product.colors ? JSON.parse(product.colors) : [],
      sizes: product.sizes ? JSON.parse(product.sizes) : [],
      images: images.map(img => img.url),
      reviews,
      related
    };

    return res.json({ success: true, product: formatted });
  } catch (err) {
    console.error('getProductBySlugOrId error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}
