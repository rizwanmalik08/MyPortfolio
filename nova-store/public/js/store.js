/**
 * NOVA STORE — Global Client State & UI Manager
 * Handles local cart persistence, auth tokens, wishlist, and toast feedback.
 */

const CART_KEY = 'nova_store_cart';
const TOKEN_KEY = 'nova_store_token';
const USER_KEY = 'nova_store_user';
const WISHLIST_KEY = 'nova_store_wishlist';
const COUPON_KEY = 'nova_store_coupon';

export const store = {
  // 1. Toast Notifications
  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    toast.innerHTML = `
      <span style="color: ${type === 'success' ? 'var(--accent-emerald)' : type === 'error' ? 'var(--accent-rose)' : 'var(--accent-cyan)'}; font-weight: bold;">
        ${icon}
      </span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },

  // 2. Format Price
  formatPrice(num) {
    return '$' + (Number(num) || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  },

  // 3. Cart State Management
  getCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  },

  saveCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    this.updateCartBadge();
  },

  addToCart(product, quantity = 1, color = null, size = null) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(
      item => item.productId === product.id && item.color === color && item.size === size
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.sale_price || product.price,
        image: product.primary_image || (product.images && product.images[0]) || '',
        quantity,
        color: color || (product.colors && product.colors[0]?.name) || null,
        size: size || (product.sizes && product.sizes[0]) || null
      });
    }

    this.saveCart(cart);
    this.showToast(`Added "${product.name}" to cart.`, 'success');
  },

  updateQuantity(productId, quantity, color = null, size = null) {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(
        item => !(item.productId === productId && item.color === color && item.size === size)
      );
    } else {
      const item = cart.find(
        item => item.productId === productId && item.color === color && item.size === size
      );
      if (item) {
        item.quantity = quantity;
      }
    }
    this.saveCart(cart);
  },

  removeFromCart(productId, color = null, size = null) {
    let cart = this.getCart();
    cart = cart.filter(
      item => !(item.productId === productId && item.color === color && item.size === size)
    );
    this.saveCart(cart);
    this.showToast('Item removed from cart.', 'info');
  },

  clearCart() {
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(COUPON_KEY);
    this.updateCartBadge();
  },

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  },

  updateCartBadge() {
    const count = this.getCartCount();
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  },

  // 4. Coupon State
  getSavedCoupon() {
    return localStorage.getItem(COUPON_KEY) || '';
  },

  setSavedCoupon(code) {
    if (code) localStorage.setItem(COUPON_KEY, code.toUpperCase());
    else localStorage.removeItem(COUPON_KEY);
  },

  // 5. User Authentication & Profile
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  },

  setAuth(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.showToast('Logged out successfully.', 'info');
    setTimeout(() => {
      window.location.href = '/account';
    }, 400);
  },

  isLoggedIn() {
    return Boolean(this.getToken());
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },

  // 6. Wishlist Local Fallback / Cache
  getWishlistLocal() {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  },

  toggleWishlistLocal(productId) {
    const list = this.getWishlistLocal();
    const index = list.indexOf(productId);
    let added = false;
    if (index > -1) {
      list.splice(index, 1);
    } else {
      list.push(productId);
      added = true;
    }
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    this.showToast(added ? 'Added to wishlist.' : 'Removed from wishlist.', 'info');
    return added;
  },

  isWishlisted(productId) {
    const list = this.getWishlistLocal();
    return list.includes(productId);
  }
};

// Initialize badges on script load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    store.updateCartBadge();
  });
}
