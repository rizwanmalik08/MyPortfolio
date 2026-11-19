import { db } from '../db/database.js';

export function validateCoupon(req, res) {
  try {
    const { code, subtotal = 0 } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1').get(code.toUpperCase().trim());
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive promo code.' });
    }

    if (coupon.min_spend > 0 && subtotal < coupon.min_spend) {
      return res.status(400).json({
        success: false,
        message: `This promo requires a minimum purchase amount of $${coupon.min_spend.toFixed(2)}.`
      });
    }

    let discount = 0;
    if (coupon.discount_type === 'percent') {
      discount = subtotal * (coupon.discount_value / 100);
    } else {
      discount = Math.min(coupon.discount_value, subtotal);
    }

    return res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discountAmount: parseFloat(discount.toFixed(2))
      }
    });
  } catch (err) {
    console.error('validateCoupon error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}
