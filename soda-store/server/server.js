import express from 'express';
import cors from 'cors';
import path from 'path';
import { db, initializeDatabase } from './db/database.js';

const app = express();
const PORT = process.env.PORT || 5002;

// Initialize SQLite database
initializeDatabase();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
const publicDir = path.resolve('soda-store/public');
app.use(express.static(publicDir));

// ==========================================
// REST API ROUTES
// ==========================================

// 1. Health & Store Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    store: 'SODA — 3D Product Experience',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// 2. Get Products
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY id ASC;').all();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Get Flavors
app.get('/api/flavors', (req, res) => {
  try {
    const flavors = db.prepare('SELECT * FROM flavors WHERE active = 1 ORDER BY id ASC;').all();
    res.json({ success: true, flavors });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Get Reviews
app.get('/api/reviews', (req, res) => {
  try {
    const reviews = db.prepare('SELECT * FROM reviews ORDER BY id DESC;').all();
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Submit Customer Review
app.post('/api/reviews', (req, res) => {
  try {
    const { name, flavor, rating, title, comment } = req.body;
    if (!name || !title || !comment) {
      return res.status(400).json({ success: false, error: 'Name, title, and comment are required' });
    }

    const cleanRating = Math.max(1, Math.min(5, parseInt(rating, 10) || 5));
    const cleanFlavor = flavor || 'Diet Classic';

    const insert = db.prepare(`
      INSERT INTO reviews (customer_name, flavor, rating, title, comment)
      VALUES (?, ?, ?, ?, ?);
    `);
    const result = insert.run(name.trim(), cleanFlavor, cleanRating, title.trim(), comment.trim());

    res.json({
      success: true,
      message: 'Review submitted successfully',
      reviewId: result.lastInsertRowid
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Validate Coupon
app.post('/api/coupons/validate', (req, res) => {
  try {
    const { code, subtotal = 0 } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Coupon code required' });
    }

    const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND active = 1;').get(code.toUpperCase().trim());
    if (!coupon) {
      return res.status(404).json({ success: false, error: 'Invalid or expired coupon code' });
    }

    if (subtotal < coupon.min_spend) {
      return res.status(400).json({
        success: false,
        error: `Minimum order of $${coupon.min_spend.toFixed(2)} required for this coupon`
      });
    }

    res.json({
      success: true,
      code: coupon.code,
      discountPercent: coupon.discount_percent,
      message: `${coupon.discount_percent}% discount applied successfully!`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Calculate Cart Totals Server-Side (Zero-Trust)
app.post('/api/cart/calculate', (req, res) => {
  try {
    const { items = [], couponCode } = req.body;
    const packPrices = {
      'Single Can': 2.99,
      '6-Pack Box': 15.99,
      '12-Pack Case': 28.99
    };

    let subtotal = 0;
    const validatedItems = items.map(item => {
      const price = packPrices[item.packType] || 2.99;
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const total = price * qty;
      subtotal += total;
      return {
        ...item,
        price,
        quantity: qty,
        total: parseFloat(total.toFixed(2))
      };
    });

    let discount = 0;
    let couponInfo = null;
    if (couponCode) {
      const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND active = 1;').get(couponCode.toUpperCase().trim());
      if (coupon && subtotal >= coupon.min_spend) {
        discount = (subtotal * coupon.discount_percent) / 100;
        couponInfo = {
          code: coupon.code,
          percent: coupon.discount_percent,
          discountAmount: parseFloat(discount.toFixed(2))
        };
      }
    }

    // Free shipping over $25, else $3.50
    const shipping = subtotal > 25 || subtotal === 0 ? 0 : 3.50;
    const finalTotal = Math.max(0, subtotal - discount + shipping);

    res.json({
      success: true,
      items: validatedItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      total: parseFloat(finalTotal.toFixed(2)),
      coupon: couponInfo
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Checkout / Place Order
app.post('/api/orders', (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      postalCode,
      paymentMethod = 'cash_on_delivery',
      items = [],
      couponCode
    } = req.body;

    if (!customerName || !customerEmail || !shippingAddress || !city || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please fill in all required delivery details and provide valid cart items.'
      });
    }

    // Re-verify prices server-side
    const packPrices = {
      'Single Can': 2.99,
      '6-Pack Box': 15.99,
      '12-Pack Case': 28.99
    };

    let subtotal = 0;
    const validatedItems = items.map(item => {
      const price = packPrices[item.packType] || 2.99;
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const total = price * qty;
      subtotal += total;
      return {
        productName: item.productName || 'SODA Sparkling Beverage',
        flavorName: item.flavorName || 'Diet Classic',
        packType: item.packType || 'Single Can',
        price,
        quantity: qty,
        itemTotal: parseFloat(total.toFixed(2))
      };
    });

    let discount = 0;
    if (couponCode) {
      const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND active = 1;').get(couponCode.toUpperCase().trim());
      if (coupon && subtotal >= coupon.min_spend) {
        discount = (subtotal * coupon.discount_percent) / 100;
      }
    }

    const shipping = subtotal > 25 ? 0 : 3.50;
    const total = parseFloat(Math.max(0, subtotal - discount + shipping).toFixed(2));
    const orderNumber = 'SODA-' + Math.floor(10000 + Math.random() * 90000);

    const insertOrder = db.prepare(`
      INSERT INTO orders (
        order_number, customer_name, customer_email, customer_phone,
        shipping_address, city, postal_code, subtotal, discount, shipping, total,
        payment_method, payment_status, order_status, coupon_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);

    const orderResult = insertOrder.run(
      orderNumber,
      customerName.trim(),
      customerEmail.trim(),
      customerPhone ? customerPhone.trim() : null,
      shippingAddress.trim(),
      city.trim(),
      postalCode ? postalCode.trim() : null,
      parseFloat(subtotal.toFixed(2)),
      parseFloat(discount.toFixed(2)),
      shipping,
      total,
      paymentMethod,
      paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
      'processing',
      couponCode || null
    );

    const orderId = orderResult.lastInsertRowid;

    // Insert order items & deduct stock
    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_name, flavor_name, pack_type, price, quantity, item_total)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `);

    const updateStock = db.prepare(`
      UPDATE products SET stock = MAX(0, stock - ?) WHERE slug = ?;
    `);

    for (const it of validatedItems) {
      insertItem.run(orderId, it.productName, it.flavorName, it.packType, it.price, it.quantity, it.itemTotal);
      const slug = it.flavorName.toLowerCase().includes('lime') ? 'zero-lime' : 'diet-classic';
      updateStock.run(it.quantity, slug);
    }

    res.json({
      success: true,
      message: 'Order created successfully',
      orderNumber,
      orderId,
      total,
      deliveryStatus: 'Order received and being freshly packed'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Lookup Order by Order Number
app.get('/api/orders/:orderNumber', (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE order_number = ?;').get(req.params.orderNumber);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?;').all(order.id);
    res.json({ success: true, order, items });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Contact Us Message
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
    }

    const insert = db.prepare('INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?);');
    const result = insert.run(name.trim(), email.trim(), subject ? subject.trim() : null, message.trim());

    res.json({
      success: true,
      message: 'Thank you! Your message has been received by the SODA support team.',
      inquiryId: result.lastInsertRowid
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// ADMIN DASHBOARD REST API
// ==========================================

// 11. Live Admin Telemetry Stats
app.get('/api/admin/stats', (req, res) => {
  try {
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders;').get().count;
    const totalRevenue = db.prepare("SELECT SUM(total) as revenue FROM orders WHERE order_status != 'cancelled';").get().revenue || 0;
    const activeProducts = db.prepare('SELECT COUNT(*) as count FROM products;').get().count;
    const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_status = 'processing';").get().count;
    const totalReviews = db.prepare('SELECT COUNT(*) as count FROM reviews;').get().count;
    const totalContacts = db.prepare('SELECT COUNT(*) as count FROM contacts;').get().count;

    const avgOrder = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        averageOrderValue: parseFloat(avgOrder.toFixed(2)),
        activeProducts,
        pendingOrders,
        totalReviews,
        totalContacts
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. Admin List Orders
app.get('/api/admin/orders', (req, res) => {
  try {
    const orders = db.prepare('SELECT * FROM orders ORDER BY id DESC;').all();
    const ordersWithItems = orders.map(ord => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?;').all(ord.id);
      return { ...ord, items };
    });
    res.json({ success: true, orders: ordersWithItems });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 13. Admin Update Order Status
app.patch('/api/admin/orders/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid order status' });
    }

    db.prepare('UPDATE orders SET order_status = ? WHERE id = ?;').run(status, req.params.id);
    res.json({ success: true, message: `Order #${req.params.id} status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 14. Admin Update Product Stock & Price
app.patch('/api/admin/products/:id', (req, res) => {
  try {
    const { stock, price } = req.body;
    if (stock !== undefined) {
      db.prepare('UPDATE products SET stock = ? WHERE id = ?;').run(parseInt(stock, 10), req.params.id);
    }
    if (price !== undefined) {
      db.prepare('UPDATE products SET price = ? WHERE id = ?;').run(parseFloat(price), req.params.id);
    }
    res.json({ success: true, message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 15. Admin Delete / Moderate Review
app.delete('/api/admin/reviews/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM reviews WHERE id = ?;').run(req.params.id);
    res.json({ success: true, message: 'Review removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 16. Admin List Contacts
app.get('/api/admin/contacts', (req, res) => {
  try {
    const contacts = db.prepare('SELECT * FROM contacts ORDER BY id DESC;').all();
    res.json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to index.html for SPA (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  SODA 3D Experience Server Live on port ${PORT}`);
  console.log(`  Storefront: http://localhost:${PORT}/`);
  console.log(`  Admin Panel: http://localhost:${PORT}/admin.html`);
  console.log(`===============================================`);
});
