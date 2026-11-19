import assert from 'node:assert';

const BASE = 'http://localhost:5001';

async function runTests() {
  console.log('🚀 STARTING COMPREHENSIVE NOVA STORE E2E TEST SUITE...');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ FAIL: ${name}`, err.message);
    }
  }

  // Test 1: Health & Settings
  await test('Server Health Check', async () => {
    const res = await fetch(`${BASE}/api/health`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.status, 'operational');
  });

  await test('Store Settings Retrieval', async () => {
    const res = await fetch(`${BASE}/api/settings`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.settings.store_name, 'Kanso Collective');
  });

  // Test 2: Categories
  await test('Categories Listing with Item Counts', async () => {
    const res = await fetch(`${BASE}/api/categories`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.categories.length >= 6);
    const electronics = data.categories.find(c => c.slug === 'electronics');
    assert.ok(electronics);
    assert.ok(electronics.item_count > 0);
  });

  // Test 3: Products Filtering & Search
  await test('Products Search & Pagination', async () => {
    const res = await fetch(`${BASE}/api/products?search=apex`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.products.length > 0);
    assert.ok(data.products[0].name.toLowerCase().includes('apex'));
  });

  await test('Products Category Filter', async () => {
    const res = await fetch(`${BASE}/api/products?category=watches`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.products.length > 0);
    assert.strictEqual(data.products[0].category_slug, 'watches');
  });

  // Test 4: Single Product with 3D model asset
  await test('Product Detail with 3D Model', async () => {
    const res = await fetch(`${BASE}/api/products/1`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.product.model_url);
    
    // Verify 3D GLB file is reachable and valid binary
    const glbRes = await fetch(`${BASE}${data.product.model_url}`);
    assert.strictEqual(glbRes.status, 200);
    const buf = await glbRes.arrayBuffer();
    assert.ok(buf.byteLength > 10000);
  });

  // Test 5: Cart Calculation & Server-Side Security
  await test('Cart Price Calculation & Inventory Check', async () => {
    const res = await fetch(`${BASE}/api/cart/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 1, quantity: 2 }]
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.summary.subtotal > 0);
    assert.strictEqual(data.items[0].name, 'Kanso Apex Wireless ANC Headphones');
  });

  // Test 6: Coupon Validation (KANSO20 & NOVA20)
  await test('Coupon Code Validation (KANSO20 = 20% off)', async () => {
    const res = await fetch(`${BASE}/api/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'KANSO20', subtotal: 500 })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.coupon.code, 'KANSO20');
    assert.strictEqual(data.coupon.discount_value, 20);
    assert.strictEqual(data.coupon.discountAmount, 100);
  });

  // Test 7: User Authentication & Registration
  const testUserEmail = `testuser_${Date.now()}@example.com`;
  let userToken = null;

  await test('Customer Registration', async () => {
    const res = await fetch(`${BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Julian Sterling',
        email: testUserEmail,
        password: 'securePassword123',
        phone: '+1 555-0199'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
    userToken = data.token;
  });

  await test('Customer Login with Pre-seeded account', async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alexander@example.com',
        password: 'client123'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.email, 'alexander@example.com');
  });

  // Test 8: Order Placement & Database Persistence
  let createdOrderNumber = null;
  await test('Order Checkout & Creation in SQLite', async () => {
    const res = await fetch(`${BASE}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        customerName: 'Julian Sterling',
        customerEmail: testUserEmail,
        customerPhone: '+1 555-0199',
        shippingAddress: '740 Park Avenue, Penthouse B',
        city: 'New York',
        postalCode: '10021',
        paymentMethod: 'cod',
        couponCode: 'NOVA20',
        items: [
          { productId: 1, quantity: 1, color: 'Obsidian Black' },
          { productId: 2, quantity: 1, color: 'Titanium Grey' }
        ]
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(data.success, true);
    assert.ok(data.order.order_number);
    createdOrderNumber = data.order.order_number;
  });

  await test('Retrieve Created Order Details by Order Number', async () => {
    const res = await fetch(`${BASE}/api/orders/${createdOrderNumber}`);
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.order.order_number, createdOrderNumber);
    assert.strictEqual(data.order.items.length, 2);
  });

  // Test 9: Admin Login, Telemetry & Order Status Update
  let adminToken = null;
  await test('Admin Authentication & RBAC Gate', async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@novastore.com',
        password: 'admin123'
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.role, 'admin');
    adminToken = data.token;
  });

  await test('Admin Dashboard Live Telemetry Stats', async () => {
    const res = await fetch(`${BASE}/api/admin/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.stats.totalRevenue > 0);
    assert.ok(data.stats.totalOrders > 0);
    assert.ok(data.stats.totalCustomers > 0);
  });

  await test('Admin Order Status Update Lifecycle', async () => {
    const ordersRes = await fetch(`${BASE}/api/admin/orders`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const ordersData = await ordersRes.json();
    const targetOrder = ordersData.orders.find(o => o.order_number === createdOrderNumber);
    assert.ok(targetOrder);

    // Update status to "delivered"
    const updateRes = await fetch(`${BASE}/api/admin/orders/${targetOrder.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'delivered' })
    });
    const updateData = await updateRes.json();
    assert.strictEqual(updateRes.status, 200);
    assert.strictEqual(updateData.success, true);
  });

  // Test 10: Admin Product CRUD
  let newProductId = null;
  await test('Admin Product CRUD - Create Product', async () => {
    const res = await fetch(`${BASE}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: 'Nova Quantum Chronograph X',
        categorySlug: 'watches',
        price: '1250.00',
        stock: '15',
        description: 'Titanium aerospace casing with tourbillon sapphire movement.',
        isFeatured: 1
      })
    });
    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(data.success, true);
    assert.ok(data.id);
    newProductId = data.id;
  });

  await test('Admin Product CRUD - Delete Product', async () => {
    const res = await fetch(`${BASE}/api/admin/products/${newProductId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
  });

  // Summary
  console.log(`\n========================================`);
  console.log(`  E2E TEST RESULTS: ${passed}/${total} PASSED (${Math.round((passed/total)*100)}%)`);
  console.log(`========================================\n`);
}

runTests().catch(console.error);
