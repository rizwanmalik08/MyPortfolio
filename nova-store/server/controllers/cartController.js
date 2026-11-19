import { db } from '../db/database.js';

export function calculateCart(req, res) {
  try {
    const { items = [], couponCode } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Invalid items array.' });
    }

    let subtotal = 0;
    const validatedItems = [];
    const stockErrors = [];

    // Query store settings for thresholds
    const freeShippingThreshold = parseFloat(db.prepare("SELECT value FROM store_settings WHERE key = 'free_shipping_threshold'").get()?.value || '150');
    const flatShippingRate = parseFloat(db.prepare("SELECT value FROM store_settings WHERE key = 'flat_shipping_rate'").get()?.value || '15');
    const taxRate = parseFloat(db.prepare("SELECT value FROM store_settings WHERE key = 'tax_rate'").get()?.value || '0.08');

    // 1. Fetch real product prices and validate stock from the database
    for (const item of items) {
      if (!item.productId) continue;
      const product = db.prepare(`
        SELECT p.id, p.name, p.slug, p.price, p.sale_price, p.stock,
               (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
        FROM products p
        WHERE p.id = ?
      `).get(item.productId);

      if (!product) {
        continue;
      }

      const effectivePrice = (product.sale_price !== null && product.sale_price < product.price) 
        ? product.sale_price 
        : product.price;

      const requestedQty = Math.max(1, parseInt(item.quantity) || 1);
      const availableQty = Math.min(requestedQty, product.stock);

      if (requestedQty > product.stock) {
        stockErrors.push(`Limited stock for ${product.name} (only ${product.stock} available).`);
      }

      const itemTotal = effectivePrice * availableQty;
      subtotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.primary_image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        price: effectivePrice,
        originalPrice: product.price,
        quantity: availableQty,
        stock: product.stock,
        color: item.color || null,
        size: item.size || null,
        total: parseFloat(itemTotal.toFixed(2))
      });
    }

    // 2. Validate and Calculate Coupon
    let discountAmount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const codeClean = couponCode.toUpperCase().trim();
      const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1').get(codeClean);

      if (coupon) {
        if (subtotal >= coupon.min_spend) {
          if (coupon.discount_type === 'percent') {
            discountAmount = subtotal * (coupon.discount_value / 100);
          } else {
            discountAmount = Math.min(coupon.discount_value, subtotal);
          }
          appliedCoupon = {
            code: coupon.code,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value,
            amount: parseFloat(discountAmount.toFixed(2))
          };
        } else {
          stockErrors.push(`Coupon ${coupon.code} requires a minimum spend of $${coupon.min_spend.toFixed(2)}.`);
        }
      } else {
        stockErrors.push(`Coupon code "${codeClean}" is invalid or expired.`);
      }
    }

    // 3. Shipping & Tax
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const shippingFee = (subtotal === 0 || subtotal >= freeShippingThreshold) ? 0 : flatShippingRate;
    const taxAmount = parseFloat((taxableAmount * taxRate).toFixed(2));
    const totalAmount = parseFloat((taxableAmount + shippingFee + taxAmount).toFixed(2));

    return res.json({
      success: true,
      items: validatedItems,
      summary: {
        itemCount: validatedItems.reduce((acc, i) => acc + i.quantity, 0),
        subtotal: parseFloat(subtotal.toFixed(2)),
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        shippingFee: parseFloat(shippingFee.toFixed(2)),
        taxAmount,
        totalAmount,
        freeShippingThreshold,
        freeShippingQualified: subtotal >= freeShippingThreshold,
        appliedCoupon
      },
      warnings: stockErrors
    });
  } catch (err) {
    console.error('calculateCart error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}
