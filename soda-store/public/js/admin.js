/**
 * SODA Administration Dashboard Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  loadTelemetry();
  loadOrders();
  loadProducts();
  loadReviews();
  loadContacts();
});

function setupTabs() {
  const tabs = document.querySelectorAll('.admin-tab-btn');

  function switchTab(targetTab) {
    if (!targetTab) return;
    tabs.forEach((t) => {
      t.classList.toggle('active', t.dataset.tab === targetTab);
    });

    document.querySelectorAll('.admin-tab-content').forEach((c) => {
      c.style.display = 'none';
    });

    const activeContent = document.getElementById(`tab-${targetTab}`);
    if (activeContent) activeContent.style.display = 'block';
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      switchTab(targetTab);
      window.location.hash = targetTab;
    });
  });

  function handleHash() {
    const rawHash = (window.location.hash || '').replace('#', '').toLowerCase();
    if (!rawHash) return;
    if (rawHash === 'order' || rawHash === 'orders') switchTab('orders');
    else if (rawHash === 'product' || rawHash === 'products' || rawHash === 'inventory') switchTab('products');
    else if (rawHash === 'review' || rawHash === 'reviews') switchTab('reviews');
    else if (rawHash === 'contact' || rawHash === 'contacts' || rawHash === 'inquiries') switchTab('contacts');
  }

  handleHash();
  window.addEventListener('hashchange', handleHash);
}

async function loadTelemetry() {
  try {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    if (!data.success) return;

    const s = data.stats;
    document.getElementById('stat-revenue').textContent = `$${s.totalRevenue.toFixed(2)}`;
    document.getElementById('stat-orders').textContent = s.totalOrders;
    document.getElementById('stat-aov').textContent = `$${s.averageOrderValue.toFixed(2)}`;
    document.getElementById('stat-pending').textContent = s.pendingOrders;
    document.getElementById('stat-reviews').textContent = s.totalReviews;
  } catch (err) {
    console.error('Telemetry error:', err);
  }
}

async function loadOrders() {
  const tbody = document.getElementById('orders-tbody');
  try {
    const res = await fetch('/api/admin/orders');
    const data = await res.json();
    if (!data.success || !tbody) return;

    if (data.orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">No orders placed yet.</td></tr>';
      return;
    }

    tbody.innerHTML = data.orders.map((ord) => {
      const itemsList = ord.items.map(it => `
        <div style="margin-bottom: 3px;">
          <strong style="color: #fff;">${it.flavor_name}</strong>
          <span style="color: #94a3b8; font-size: 0.8rem;">(${it.pack_type})</span>
          <span style="color: #fbcfe8; font-weight: 700; font-size: 0.8rem;">× ${it.quantity}</span>
        </div>
      `).join('');
      return `
        <tr>
          <td><span class="order-badge-tag">${ord.order_number}</span></td>
          <td>
            <div class="customer-cell">
              <span class="customer-name">${ord.customer_name}</span>
              <span class="customer-meta">${ord.customer_email}</span>
              <span class="customer-meta">${ord.city}</span>
            </div>
          </td>
          <td>${itemsList}</td>
          <td><strong style="font-weight: 800; color: #fff; font-size: 1.05rem;">$${ord.total.toFixed(2)}</strong></td>
          <td><span style="text-transform: capitalize; font-size: 0.82rem; color: #94a3b8; background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 6px;">${ord.payment_method.replace(/_/g, ' ')}</span></td>
          <td>
            <select class="status-select" onchange="updateOrderStatus(${ord.id}, this.value)">
              <option value="processing" ${ord.order_status === 'processing' ? 'selected' : ''}>⏳ Processing</option>
              <option value="shipped" ${ord.order_status === 'shipped' ? 'selected' : ''}>🚚 Shipped</option>
              <option value="delivered" ${ord.order_status === 'delivered' ? 'selected' : ''}>✅ Delivered</option>
              <option value="cancelled" ${ord.order_status === 'cancelled' ? 'selected' : ''}>❌ Cancelled</option>
            </select>
          </td>
          <td style="font-size: 0.8rem; color: #94a3b8;">${ord.created_at || 'Just now'}</td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="7">Error loading orders.</td></tr>';
  }
}

window.updateOrderStatus = async function (orderId, newStatus) {
  try {
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (data.success) {
      loadTelemetry();
    } else {
      alert(data.error || 'Failed to update order status');
    }
  } catch {
    alert('Network error updating status');
  }
};

async function loadProducts() {
  const tbody = document.getElementById('products-tbody');
  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (!data.success || !tbody) return;

    tbody.innerHTML = data.products.map((p) => `
      <tr>
        <td class="font-mono">#${p.id}</td>
        <td><strong>${p.name}</strong></td>
        <td class="font-mono text-cyan-400">${p.slug}</td>
        <td>
          <input type="number" step="0.01" class="edit-input" id="price-${p.id}" value="${p.price.toFixed(2)}" />
        </td>
        <td>
          <input type="number" class="edit-input" id="stock-${p.id}" value="${p.stock}" />
        </td>
        <td class="text-xs text-slate-400">${p.volume} • ${p.calories} Cal</td>
        <td>
          <button class="btn btn-primary btn-table-action" onclick="saveProduct(${p.id})">Save</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="7">Error loading products.</td></tr>';
  }
}

window.saveProduct = async function (id) {
  const priceInput = document.getElementById(`price-${id}`);
  const stockInput = document.getElementById(`stock-${id}`);

  const price = parseFloat(priceInput.value);
  const stock = parseInt(stockInput.value, 10);

  try {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price, stock })
    });
    const data = await res.json();
    if (data.success) {
      alert('Product pricing and stock updated successfully!');
      loadTelemetry();
    } else {
      alert(data.error || 'Failed to update product');
    }
  } catch {
    alert('Network error saving product');
  }
};

async function loadReviews() {
  const tbody = document.getElementById('reviews-tbody');
  try {
    const res = await fetch('/api/reviews');
    const data = await res.json();
    if (!data.success || !tbody) return;

    if (data.reviews.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No reviews to display.</td></tr>';
      return;
    }

    tbody.innerHTML = data.reviews.map((r) => `
      <tr>
        <td><strong>${r.customer_name}</strong></td>
        <td class="font-mono text-xs text-cyan-400">${r.flavor}</td>
        <td class="text-amber-400 font-mono">${'★'.repeat(r.rating)}</td>
        <td><strong>${r.title}</strong></td>
        <td class="text-xs text-slate-300 max-w-xs">${r.comment}</td>
        <td>
          <button class="btn btn-outline btn-table-action text-rose-400" onclick="deleteReview(${r.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="6">Error loading reviews.</td></tr>';
  }
}

window.deleteReview = async function (id) {
  if (!confirm('Are you sure you want to remove this review?')) return;
  try {
    const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      loadReviews();
      loadTelemetry();
    }
  } catch {
    alert('Failed to delete review');
  }
};

async function loadContacts() {
  const tbody = document.getElementById('contacts-tbody');
  try {
    const res = await fetch('/api/admin/contacts');
    const data = await res.json();
    if (!data.success || !tbody) return;

    if (data.contacts.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No inquiries received yet.</td></tr>';
      return;
    }

    tbody.innerHTML = data.contacts.map((c) => `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td class="font-mono text-xs text-cyan-400">${c.email}</td>
        <td>${c.subject || '—'}</td>
        <td class="text-xs text-slate-300">${c.message}</td>
        <td class="text-xs font-mono text-slate-400">${c.created_at || 'Recently'}</td>
      </tr>
    `).join('');
  } catch (err) {
    if (tbody) tbody.innerHTML = '<tr><td colspan="5">Error loading contacts.</td></tr>';
  }
}
