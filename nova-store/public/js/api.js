/**
 * NOVA STORE — Client API Service
 * Centralized async data access layer connecting with Express REST backend.
 */

const API_BASE = '/api';

export const api = {
  // 1. Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    return res.json();
  },

  // 2. Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    return res.json();
  },

  async getCategory(slug) {
    const res = await fetch(`${API_BASE}/categories/${slug}`);
    return res.json();
  },

  // 3. Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products?${query}`);
    return res.json();
  },

  async getFeaturedProducts() {
    const res = await fetch(`${API_BASE}/products/featured`);
    return res.json();
  },

  async getTrendingProducts() {
    const res = await fetch(`${API_BASE}/products/trending`);
    return res.json();
  },

  async getBestSellers() {
    const res = await fetch(`${API_BASE}/products/best-sellers`);
    return res.json();
  },

  async getProduct(idOrSlug) {
    const res = await fetch(`${API_BASE}/products/${idOrSlug}`);
    return res.json();
  },

  // 4. Cart & Pricing Validation
  async calculateCart(items, couponCode = null) {
    const res = await fetch(`${API_BASE}/cart/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, couponCode })
    });
    return res.json();
  },

  // 5. Checkout & Orders
  async createOrder(orderPayload, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderPayload)
    });
    return res.json();
  },

  async getOrder(idOrNumber) {
    const res = await fetch(`${API_BASE}/orders/${idOrNumber}`);
    return res.json();
  },

  async getMyOrders(token) {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  // 6. User Auth & Profile
  async register(data) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async getProfile(token) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async updateProfile(data, token) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // 7. Wishlist
  async getWishlist(token) {
    const res = await fetch(`${API_BASE}/wishlist`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async toggleWishlist(productId, token) {
    const res = await fetch(`${API_BASE}/wishlist/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId })
    });
    return res.json();
  },

  // 8. Reviews
  async addReview(reviewData, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers,
      body: JSON.stringify(reviewData)
    });
    return res.json();
  },

  // 9. Admin Endpoints
  async getAdminStats(token) {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async getAdminOrders(token, status = 'all') {
    const res = await fetch(`${API_BASE}/admin/orders?status=${status}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async updateOrderStatus(orderId, status, token) {
    const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  async getAdminProducts(token) {
    const res = await fetch(`${API_BASE}/admin/products`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async createProduct(data, token) {
    const res = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateProduct(id, data, token) {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async deleteProduct(id, token) {
    const res = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async getAdminCoupons(token) {
    const res = await fetch(`${API_BASE}/admin/coupons`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  async createCoupon(data, token) {
    const res = await fetch(`${API_BASE}/admin/coupons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async updateStoreSettings(settings, token) {
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ settings })
    });
    return res.json();
  }
};
