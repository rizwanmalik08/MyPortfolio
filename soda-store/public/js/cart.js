/**
 * SODA Shopping Cart & Checkout Engine
 * Client-side state persisted in localStorage + zero-trust server verification
 */
export class CartManager {
  constructor() {
    this.items = this.loadCart();
    this.couponCode = localStorage.getItem('soda_coupon') || '';
    this.init();
  }

  loadCart() {
    try {
      return JSON.parse(localStorage.getItem('soda_cart')) || [];
    } catch {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem('soda_cart', JSON.stringify(this.items));
    if (this.couponCode) {
      localStorage.setItem('soda_coupon', this.couponCode);
    } else {
      localStorage.removeItem('soda_coupon');
    }
    this.updateCartBadge();
    this.renderCartDrawer();
  }

  init() {
    this.updateCartBadge();
    this.setupDrawerListeners();
    this.setupCheckoutListeners();
  }

  setupDrawerListeners() {
    const cartToggleBtns = document.querySelectorAll('.cart-toggle-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeBtn = document.getElementById('close-cart-btn');

    cartToggleBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeDrawer());
    }
    if (cartOverlay) {
      cartOverlay.addEventListener('click', () => this.closeDrawer());
    }

    // Apply Coupon Button
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const couponInput = document.getElementById('cart-coupon-input');

    if (applyCouponBtn && couponInput) {
      applyCouponBtn.addEventListener('click', async () => {
        const code = couponInput.value.trim().toUpperCase();
        if (!code) return;
        await this.applyCoupon(code);
      });
    }

    // Proceed to Checkout Button
    const checkoutBtn = document.getElementById('proceed-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.items.length === 0) return;
        this.closeDrawer();
        this.openCheckoutModal();
      });
    }
  }

  setupCheckoutListeners() {
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');

    if (closeCheckoutBtn) {
      closeCheckoutBtn.addEventListener('click', () => this.closeCheckoutModal());
    }

    if (checkoutForm) {
      checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handlePlaceOrder(checkoutForm);
      });
    }
  }

  openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.classList.add('drawer-locked');
      this.renderCartDrawer();
    }
  }

  closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('drawer-locked');
    }
  }

  openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
      modal.classList.add('open');
      this.renderCheckoutSummary();
    }
  }

  closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
      modal.classList.remove('open');
    }
  }

  addItem(item) {
    const existingIndex = this.items.findIndex(
      (i) => i.flavorName === item.flavorName && i.packType === item.packType
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += item.quantity || 1;
    } else {
      this.items.push({
        id: `${item.flavorName.toLowerCase().replace(/\s+/g, '-')}-${item.packType.toLowerCase().replace(/\s+/g, '-')}`,
        productName: item.productName || 'SODA Sparkling Beverage',
        flavorName: item.flavorName,
        packType: item.packType || 'Single Can',
        price: item.price || 2.99,
        quantity: item.quantity || 1,
        image: item.image || (item.flavorName.includes('Lime') ? '/assets/images/Blue_Soda.png' : '/assets/images/Green_Soda.png')
      });
    }

    this.saveCart();
    this.openDrawer();
  }

  updateQuantity(id, change) {
    const index = this.items.findIndex((i) => i.id === id);
    if (index > -1) {
      this.items[index].quantity += change;
      if (this.items[index].quantity <= 0) {
        this.items.splice(index, 1);
      }
      this.saveCart();
    }
  }

  removeItem(id) {
    this.items = this.items.filter((i) => i.id !== id);
    this.saveCart();
  }

  updateCartBadge() {
    const totalCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach((b) => {
      b.textContent = totalCount;
      b.style.display = totalCount > 0 ? 'inline-flex' : 'none';
    });
  }

  async applyCoupon(code) {
    const msgEl = document.getElementById('coupon-message');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (data.success) {
        this.couponCode = data.code;
        if (msgEl) {
          msgEl.className = 'coupon-msg success';
          msgEl.textContent = `✓ ${data.message}`;
        }
        this.saveCart();
      } else {
        if (msgEl) {
          msgEl.className = 'coupon-msg error';
          msgEl.textContent = data.error || 'Invalid coupon code';
        }
      }
    } catch {
      if (msgEl) {
        msgEl.className = 'coupon-msg error';
        msgEl.textContent = 'Failed to validate coupon';
      }
    }
  }

  async renderCartDrawer() {
    const container = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const footer = document.getElementById('cart-drawer-footer');

    if (!container) return;

    if (this.items.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'flex';
      if (footer) footer.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (footer) footer.style.display = 'block';

    // Query backend to compute exact verified totals
    let totals = {
      subtotal: this.items.reduce((sum, it) => sum + it.price * it.quantity, 0),
      discount: 0,
      shipping: 3.50,
      total: 0
    };

    try {
      const res = await fetch('/api/cart/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: this.items, couponCode: this.couponCode })
      });
      const data = await res.json();
      if (data.success) {
        totals = data;
      }
    } catch (e) {
      console.warn('Calculating local fallback totals:', e);
    }

    // Render Items
    container.innerHTML = this.items.map((item) => `
      <div class="cart-item-row" data-id="${item.id}">
        <div class="cart-item-img-wrap">
          <img src="${item.image}" alt="${item.flavorName}" />
        </div>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.flavorName}</div>
          <div class="cart-item-pack">${item.packType} • $${item.price.toFixed(2)}</div>
          <div class="cart-item-controls">
            <button class="cart-qty-btn decrease-qty" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <span class="cart-qty-val">${item.quantity}</span>
            <button class="cart-qty-btn increase-qty" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div class="cart-item-right">
          <span class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</span>
          <button class="cart-item-del" data-id="${item.id}" title="Remove item">×</button>
        </div>
      </div>
    `).join('');

    // Attach row events
    container.querySelectorAll('.decrease-qty').forEach((b) => {
      b.addEventListener('click', () => this.updateQuantity(b.dataset.id, -1));
    });
    container.querySelectorAll('.increase-qty').forEach((b) => {
      b.addEventListener('click', () => this.updateQuantity(b.dataset.id, 1));
    });
    container.querySelectorAll('.cart-item-del').forEach((b) => {
      b.addEventListener('click', () => this.removeItem(b.dataset.id));
    });

    // Update Totals DOM
    const subtotalEl = document.getElementById('cart-subtotal-val');
    const discountRow = document.getElementById('cart-discount-row');
    const discountEl = document.getElementById('cart-discount-val');
    const shippingEl = document.getElementById('cart-shipping-val');
    const totalEl = document.getElementById('cart-total-val');

    if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;

    if (discountRow && discountEl) {
      if (totals.discount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = `-$${totals.discount.toFixed(2)}`;
      } else {
        discountRow.style.display = 'none';
      }
    }
  }

  renderCheckoutSummary() {
    const summaryItems = document.getElementById('checkout-items-list');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const shippingEl = document.getElementById('checkout-shipping');
    const discountRow = document.getElementById('checkout-discount-row');
    const discountEl = document.getElementById('checkout-discount');
    const totalEl = document.getElementById('checkout-total');

    if (!summaryItems) return;

    summaryItems.innerHTML = this.items.map((it) => `
      <div class="checkout-summary-row">
        <span>${it.flavorName} (${it.packType}) × ${it.quantity}</span>
        <span>$${(it.price * it.quantity).toFixed(2)}</span>
      </div>
    `).join('');

    // Fetch verified checkout calculation
    fetch('/api/cart/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: this.items, couponCode: this.couponCode })
    })
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) return;
        if (subtotalEl) subtotalEl.textContent = `$${data.subtotal.toFixed(2)}`;
        if (shippingEl) shippingEl.textContent = data.shipping === 0 ? 'FREE' : `$${data.shipping.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${data.total.toFixed(2)}`;
        if (discountRow && discountEl) {
          if (data.discount > 0) {
            discountRow.style.display = 'flex';
            discountEl.textContent = `-$${data.discount.toFixed(2)}`;
          } else {
            discountRow.style.display = 'none';
          }
        }
      });
  }

  async handlePlaceOrder(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing Order...';

    const formData = new FormData(form);
    const orderPayload = {
      customerName: formData.get('name'),
      customerEmail: formData.get('email'),
      customerPhone: formData.get('phone'),
      shippingAddress: formData.get('address'),
      city: formData.get('city'),
      postalCode: formData.get('postalCode'),
      paymentMethod: formData.get('paymentMethod') || 'cash_on_delivery',
      items: this.items,
      couponCode: this.couponCode
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();

      if (data.success) {
        // Clear Cart
        this.items = [];
        this.couponCode = '';
        this.saveCart();

        // Show Confirmation View
        const bodyContent = document.getElementById('checkout-modal-body');
        if (bodyContent) {
          bodyContent.innerHTML = `
            <div class="order-confirmation-box">
              <div class="confirm-icon-wrap">✓</div>
              <h3>Order Confirmed!</h3>
              <p class="order-num-tag">Order #${data.orderNumber}</p>
              <p class="confirm-desc">Thank you, <strong>${orderPayload.customerName}</strong>. Your SODA package is now being freshly packed at our zero-emission facility.</p>
              <div class="confirm-summary-pill">
                <span>Total Paid:</span>
                <strong>$${data.total.toFixed(2)}</strong>
              </div>
              <p class="confirm-subtext">A confirmation email has been sent to <em>${orderPayload.customerEmail}</em>.</p>
              <button class="btn btn-primary" onclick="document.getElementById('checkout-modal').classList.remove('open')">Return to Store</button>
            </div>
          `;
        }
      } else {
        alert(data.error || 'Failed to place order. Please check required fields.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    } catch (err) {
      alert('Network error while placing order. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }
}
