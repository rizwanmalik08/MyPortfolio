import { Router } from 'express';
import { verifyToken, optionalAuth, requireAdmin } from '../middleware/auth.js';
import * as authCtrl from '../controllers/authController.js';
import * as productCtrl from '../controllers/productController.js';
import * as categoryCtrl from '../controllers/categoryController.js';
import * as cartCtrl from '../controllers/cartController.js';
import * as orderCtrl from '../controllers/orderController.js';
import * as wishlistCtrl from '../controllers/wishlistController.js';
import * as reviewCtrl from '../controllers/reviewController.js';
import * as couponCtrl from '../controllers/couponController.js';
import * as adminCtrl from '../controllers/adminController.js';
import * as settingsCtrl from '../controllers/settingsController.js';

const router = Router();

// 1. Settings & Store Config
router.get('/settings', settingsCtrl.getPublicSettings);

// 2. Authentication & User Profile
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.get('/auth/me', verifyToken, authCtrl.getProfile);
router.put('/auth/profile', verifyToken, authCtrl.updateProfile);
router.put('/auth/password', verifyToken, authCtrl.changePassword);

// 3. Categories
router.get('/categories', categoryCtrl.getCategories);
router.get('/categories/:slug', categoryCtrl.getCategoryBySlug);

// 4. Products
router.get('/products', productCtrl.getProducts);
router.get('/products/featured', productCtrl.getFeatured);
router.get('/products/trending', productCtrl.getTrending);
router.get('/products/best-sellers', productCtrl.getBestSellers);
router.get('/products/:idOrSlug', productCtrl.getProductBySlugOrId);

// 5. Cart
router.post('/cart/calculate', cartCtrl.calculateCart);

// 6. Orders
router.post('/orders', optionalAuth, orderCtrl.createOrder);
router.get('/orders/my-orders', verifyToken, orderCtrl.getMyOrders);
router.get('/orders/:idOrNumber', orderCtrl.getOrderById);

// 7. Wishlist
router.get('/wishlist', verifyToken, wishlistCtrl.getWishlist);
router.post('/wishlist/toggle', verifyToken, wishlistCtrl.toggleWishlist);

// 8. Reviews
router.get('/reviews/:productId', reviewCtrl.getProductReviews);
router.post('/reviews', optionalAuth, reviewCtrl.addReview);

// 9. Coupons
router.post('/coupons/validate', couponCtrl.validateCoupon);

// 10. Admin Dashboard & Management (Protected with requireAdmin)
router.get('/admin/stats', verifyToken, requireAdmin, adminCtrl.getStats);
router.get('/admin/orders', verifyToken, requireAdmin, adminCtrl.getAllOrders);
router.put('/admin/orders/:id/status', verifyToken, requireAdmin, adminCtrl.updateOrderStatus);
router.get('/admin/products', verifyToken, requireAdmin, adminCtrl.getAllProductsAdmin);
router.post('/admin/products', verifyToken, requireAdmin, adminCtrl.createProduct);
router.put('/admin/products/:id', verifyToken, requireAdmin, adminCtrl.updateProduct);
router.delete('/admin/products/:id', verifyToken, requireAdmin, adminCtrl.deleteProduct);
router.get('/admin/coupons', verifyToken, requireAdmin, adminCtrl.getCouponsAdmin);
router.post('/admin/coupons', verifyToken, requireAdmin, adminCtrl.createCoupon);
router.put('/admin/settings', verifyToken, requireAdmin, adminCtrl.updateStoreSettings);

export default router;
