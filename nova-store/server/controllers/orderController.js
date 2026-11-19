import { db } from '../db/database.js';

export function createOrder(req, res) {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      postalCode,
      paymentMethod = 'cod',
      items = [],
      couponCode
    } = req.body;

    // 1. Validation
    if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !city || !postalCode) {
      return res.status(400).json({ success: false, message: 'All shipping contact details are required.' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your shopping cart is empty.' });
    }

    // 2. Fetch and Validate ALL prices directly from DB
    let subtotal = 0;
    const validatedOrderItems = [];

    for (const item of items) {
      const product = db.prepare(`
        SELECT p.id, p.name, p.price, p.sale_price, p.stock,
               (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
        FROM products p
        WHERE p.id = ?
      `).get(item.productId);

      if (!product) {
        return res.status(400).json({ success: false, message: `Product ID ${item.productId} no longer exists.` });
      }

      const qty = Math.max(1, parseInt(item.quantity) || 1);
      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for ${product.name}. Only ${product.stock} units remaining.`
        });
      }

      const effectivePrice = (product.sale_price !== null && product.sale_price < product.price)
        ? product.sale_price
        : product.price;

      const lineTotal = effectivePrice * qty;
      subtotal += lineTotal;

      validatedOrderItems.push({
        productId: product.id,
        name: product.name,
        image: product.primary_image || '',
        price: effectivePrice,
        quantity: qty,
        color: item.color || null,
        size: item.size || null,
        total: parseFloat(lineTotal.toFixed(2))
      });
    }

    // 3. Coupon Discount calculation
    let discountAmount = 0;
    let validCouponCode = null;
    if (couponCode) {
      const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1').get(couponCode.toUpperCase().trim());
      if (coupon && subtotal >= coupon.min_spend) {
        if (coupon.discount_type === 'percent') {
          discountAmount = subtotal * (coupon.discount_value / 100);
        } else {
          discountAmount = Math.min(coupon.discount_value, subtotal);
        }
        validCouponCode = coupon.code;
        // Increment used count
        db.prepare('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?').run(coupon.id);
      }
    }

    // 4. Shipping & Tax
    const freeShippingThreshold = parseFloat(db.prepare("SELECT value FROM store_settings WHERE key = 'free_shipping_threshold'").get()?.value || '150');
    const flatShippingRate = parseFloat(db.prepare("SELECT value FROM store_settings WHERE key = 'flat_shipping_rate'").get()?.value || '15');
    const taxRate = parseFloat(db.prepare("SELECT value FROM store_settings WHERE key = 'tax_rate'").get()?.value || '0.08');

    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const shippingFee = subtotal >= freeShippingThreshold ? 0 : flatShippingRate;
    const taxAmount = parseFloat((taxableAmount * taxRate).toFixed(2));
    const totalAmount = parseFloat((taxableAmount + shippingFee + taxAmount).toFixed(2));

    // 5. Generate Order Number & Record Order
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `NOV-${randomSuffix}`;
    const userId = req.user ? req.user.id : null;

    db.exec('BEGIN TRANSACTION;');
    try {
      const insertOrderStmt = db.prepare(`
        INSERT INTO orders (
          order_number, user_id, customer_name, customer_email, customer_phone,
          shipping_address, city, postal_code, payment_method,
          subtotal, discount_amount, shipping_fee, tax_amount, total_amount,
          coupon_code, status
        ) VALUES (
          ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?, ?,
          ?, 'processing'
        )
      `);

      insertOrderStmt.run(
        orderNumber, userId, customerName.trim(), customerEmail.toLowerCase().trim(), customerPhone.trim(),
        shippingAddress.trim(), city.trim(), postalCode.trim(), paymentMethod,
        subtotal, discountAmount, shippingFee, taxAmount, totalAmount,
        validCouponCode
      );

      const orderId = db.prepare('SELECT last_insert_rowid() as id').get()?.id;

      // Insert Order Items and Decrement Product Stock
      const insertItemStmt = db.prepare(`
        INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity, color, size, total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const updateStockStmt = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

      for (const item of validatedOrderItems) {
        insertItemStmt.run(
          orderId, item.productId, item.name, item.image, item.price, item.quantity, item.color, item.size, item.total
        );
        updateStockStmt.run(item.quantity, item.productId);
      }

      db.exec('COMMIT;');

      return res.status(201).json({
        success: true,
        message: 'Order created successfully.',
        order: {
          id: orderId,
          orderNumber,
          order_number: orderNumber,
          customerName,
          customer_name: customerName,
          customerEmail,
          customer_email: customerEmail,
          totalAmount,
          total_amount: totalAmount,
          status: 'processing',
          order_status: 'processing',
          paymentMethod,
          payment_method: paymentMethod,
          itemsCount: validatedOrderItems.length
        }
      });
    } catch (txErr) {
      db.exec('ROLLBACK;');
      throw txErr;
    }
  } catch (err) {
    console.error('createOrder error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error while creating order.' });
  }
}

export function getOrderById(req, res) {
  try {
    const { idOrNumber } = req.params;
    const isNum = /^\d+$/.test(idOrNumber);

    const order = db.prepare(`
      SELECT * FROM orders
      WHERE ${isNum ? 'id = ?' : 'order_number = ?'}
    `).get(isNum ? parseInt(idOrNumber) : idOrNumber);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

    return res.json({ success: true, order: { ...order, items } });
  } catch (err) {
    console.error('getOrderById error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function getMyOrders(req, res) {
  try {
    const orders = db.prepare(`
      SELECT * FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(req.user.id);

    const formatted = orders.map(o => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id);
      return { ...o, items };
    });

    return res.json({ success: true, orders: formatted });
  } catch (err) {
    console.error('getMyOrders error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}
