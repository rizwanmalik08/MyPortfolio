import { SodaScene } from './three-scene.js';
import { FlavorSwitcher } from './flavor-switcher.js';
import { CartManager } from './cart.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Three.js 3D Soda Scene
  const sceneWrap = document.getElementById('soda-canvas-wrap');
  let sodaScene = null;

  if (sceneWrap) {
    sodaScene = new SodaScene('soda-canvas-wrap', () => {
      // Scene assets loaded callback
      const loader = document.getElementById('soda-loader');
      if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => loader.remove(), 600);
      }
    });
  }

  // 2. Initialize Flavor Switcher (Coordinates 720° spin, cards, and theme)
  const flavorSwitcher = new FlavorSwitcher(sodaScene);

  // 3. Initialize Cart Manager
  const cartManager = new CartManager();

  // 4. Initialize Effervescent Rising Bubbles
  initEffervescentBubbles();

  // 5. Setup Quick Add Buttons
  setupProductActions(cartManager, flavorSwitcher);

  // 6. Setup Reviews & Contact API
  setupReviewSystem();
  setupContactSystem();

  // 7. Setup Navigation & Mobile Menu
  setupNavigation();
});

/**
 * Effervescent Floating Bubbles System
 */
function initEffervescentBubbles() {
  const container = document.getElementById('bubbles-container');
  if (!container) return;

  const count = window.innerWidth < 768 ? 16 : 28;
  const bubbles = [];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'effervescent-bubble';

    const size = Math.random() * 26 + 10;
    const left = Math.random() * 100;
    const duration = Math.random() * 9 + 6;
    const delay = Math.random() * 8;
    const opacity = Math.random() * 0.45 + 0.15;

    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.left = `${left}%`;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;
    el.style.opacity = opacity;

    container.appendChild(el);
    bubbles.push(el);
  }
}

/**
 * Product Pack & Quick Add Handlers
 */
function setupProductActions(cartManager, flavorSwitcher) {
  // Hero Quick Add on Flavor Cards
  document.querySelectorAll('.card-quick-add-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const flavorSlug = btn.dataset.flavor;
      const flavorName = flavorSlug === 'zero-lime' ? 'Zero Lime' : 'Diet Classic';

      cartManager.addItem({
        flavorName,
        packType: 'Single Can',
        price: 2.99
      });
    });
  });

  // Pack Size Selector in Order Section
  const packButtons = document.querySelectorAll('.pack-select-btn');
  let selectedPack = 'Single Can';
  let selectedPrice = 2.99;

  packButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      packButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPack = btn.dataset.pack;
      selectedPrice = parseFloat(btn.dataset.price);

      const priceDisplay = document.getElementById('selected-pack-price');
      if (priceDisplay) {
        priceDisplay.textContent = `$${selectedPrice.toFixed(2)}`;
      }
    });
  });

  // Quantity Counter in Order Section
  const qtyInput = document.getElementById('product-qty-input');
  const qtyMinus = document.getElementById('product-qty-minus');
  const qtyPlus = document.getElementById('product-qty-plus');

  if (qtyMinus && qtyInput) {
    qtyMinus.addEventListener('click', () => {
      const val = parseInt(qtyInput.value, 10) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });
  }
  if (qtyPlus && qtyInput) {
    qtyPlus.addEventListener('click', () => {
      const val = parseInt(qtyInput.value, 10) || 1;
      if (val < 24) qtyInput.value = val + 1;
    });
  }

  // Main Add to Bag Button
  const addToBagBtn = document.getElementById('add-to-bag-btn');
  if (addToBagBtn) {
    addToBagBtn.addEventListener('click', () => {
      const flavorName = flavorSwitcher.currentFlavor === 'zero-lime' ? 'Zero Lime' : 'Diet Classic';
      const qty = parseInt(qtyInput?.value || 1, 10);

      cartManager.addItem({
        flavorName,
        packType: selectedPack,
        price: selectedPrice,
        quantity: qty
      });
    });
  }

  // Hero "Shop Now" Button
  const heroShopNow = document.getElementById('hero-shop-btn');
  if (heroShopNow) {
    heroShopNow.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/**
 * Customer Reviews System
 */
async function setupReviewSystem() {
  const reviewsContainer = document.getElementById('reviews-grid');
  const modal = document.getElementById('review-modal');
  const openBtn = document.getElementById('open-review-modal-btn');
  const closeBtn = document.getElementById('close-review-modal-btn');
  const form = document.getElementById('review-form');

  // 1. Fetch & Render Initial Reviews
  try {
    const res = await fetch('/api/reviews');
    const data = await res.json();
    if (data.success && reviewsContainer) {
      reviewsContainer.innerHTML = data.reviews.map((r) => `
        <div class="review-card glass-panel">
          <div class="review-header">
            <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
            <span class="review-flavor-tag">${r.flavor}</span>
          </div>
          <h4 class="review-title">"${r.title}"</h4>
          <p class="review-comment">${r.comment}</p>
          <div class="review-author">
            <span class="author-name">${r.customer_name}</span>
            <span class="author-verified">✓ Verified Buyer</span>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.warn('Could not load reviews from API:', err);
  }

  // 2. Open / Close Modal
  if (openBtn && modal) {
    openBtn.addEventListener('click', () => modal.classList.add('open'));
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  }

  // 3. Submit Form
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Posting Review...';

      const formData = new FormData(form);
      const payload = {
        name: formData.get('name'),
        flavor: formData.get('flavor'),
        rating: formData.get('rating'),
        title: formData.get('title'),
        comment: formData.get('comment')
      };

      try {
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          alert('Thank you! Your verified review has been published.');
          form.reset();
          if (modal) modal.classList.remove('open');
          setupReviewSystem(); // re-fetch
        } else {
          alert(data.error || 'Failed to submit review');
        }
      } catch {
        alert('Network error submitting review.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Review';
      }
    });
  }
}

/**
 * Contact Us Inquiry System
 */
function setupContactSystem() {
  const modal = document.getElementById('contact-modal');
  const openBtns = document.querySelectorAll('.open-contact-btn');
  const closeBtn = document.getElementById('close-contact-modal-btn');
  const form = document.getElementById('contact-form');

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('open');
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending Message...';

      const formData = new FormData(form);
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
      };

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          alert(data.message || 'Message sent successfully!');
          form.reset();
          if (modal) modal.classList.remove('open');
        } else {
          alert(data.error || 'Failed to send message');
        }
      } catch {
        alert('Network error sending inquiry');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }
}

/**
 * Navigation & Mobile Menu
 */
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-menu-drawer');

  // Smooth scroll
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          if (mobileDrawer) mobileDrawer.classList.remove('open');
        }
      }
    });
  });

  // Mobile drawer toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
    });
  }

  // Active link on scroll
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = `#${sec.getAttribute('id')}`;
      }
    });

    navLinks.forEach((l) => {
      l.classList.toggle('active', l.getAttribute('href') === current);
    });
  }, { passive: true });
}
