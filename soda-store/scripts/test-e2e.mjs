import http from 'http';

const BASE_URL = 'http://localhost:5002';

function request(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    if (body) {
      reqOptions.headers['Content-Type'] = 'application/json';
    }

    const req = http.request(url, reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, raw: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function checkHead(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    http.get(url, (res) => {
      res.resume();
      resolve({ status: res.statusCode, length: res.headers['content-length'] });
    }).on('error', reject);
  });
}

(async () => {
  console.log('🧪 RUNNING FULL-STACK SODA 3D STORE E2E TEST SUITE...');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
    }
  }

  try {
    // 1. Health check
    const health = await request('/api/health');
    assert(health.status === 200 && health.data.status === 'online', 'Health endpoint reports online');

    // 2. Products listing
    const prods = await request('/api/products');
    assert(prods.status === 200 && prods.data.products.length >= 2, 'Products retrieved successfully (>= 2)');

    // 3. Flavors listing
    const flavors = await request('/api/flavors');
    assert(flavors.status === 200 && flavors.data.flavors.length === 2, 'Flavors retrieved (Diet Classic & Zero Lime)');

    // 4. Reviews listing
    const reviews = await request('/api/reviews');
    assert(reviews.status === 200 && reviews.data.reviews.length >= 4, 'Reviews retrieved (>= 4)');

    // 5. Submit review
    const newRev = await request('/api/reviews', { method: 'POST' }, {
      name: 'Test Connoisseur',
      flavor: 'Zero Lime',
      rating: 5,
      title: 'Remarkable Carbonation & Purity',
      comment: 'The 3D model and actual soda live up to every high standard.'
    });
    assert(newRev.status === 200 && newRev.data.success, 'Review submitted successfully');

    // 6. Validate coupon
    const coupon1 = await request('/api/coupons/validate', { method: 'POST' }, { code: 'REFRESH15', subtotal: 20 });
    assert(coupon1.status === 200 && coupon1.data.discountPercent === 15, 'Coupon REFRESH15 gives 15% discount');

    // 7. Calculate cart
    const cartCalc = await request('/api/cart/calculate', { method: 'POST' }, {
      items: [
        { flavorName: 'Diet Classic', packType: 'Single Can', quantity: 2 },
        { flavorName: 'Zero Lime', packType: '6-Pack Box', quantity: 1 }
      ],
      couponCode: 'REFRESH15'
    });
    // subtotal = 2*2.99 + 15.99 = 21.97. 15% of 21.97 = 3.30. Shipping = 3.50. Total = 21.97 - 3.30 + 3.50 = 22.17
    assert(cartCalc.status === 200 && cartCalc.data.subtotal === 21.97 && cartCalc.data.discount === 3.30, 'Cart calculates zero-trust subtotal & coupon discount');

    // 8. Place order
    const orderRes = await request('/api/orders', { method: 'POST' }, {
      customerName: 'Marcus Sterling',
      customerEmail: 'marcus@example.com',
      customerPhone: '+1 (555) 987-6543',
      shippingAddress: '450 Innovation Parkway',
      city: 'Austin',
      postalCode: '78701',
      paymentMethod: 'cash_on_delivery',
      items: [
        { flavorName: 'Diet Classic', packType: '12-Pack Case', quantity: 1 }
      ],
      couponCode: 'REFRESH15'
    });
    assert(orderRes.status === 200 && orderRes.data.orderNumber.startsWith('SODA-'), `Order placed successfully (${orderRes.data?.orderNumber})`);

    // 9. Lookup order details
    const orderLookup = await request(`/api/orders/${orderRes.data.orderNumber}`);
    assert(orderLookup.status === 200 && orderLookup.data.items.length === 1, 'Lookup order details by order number');

    // 10. Contact inquiry
    const contactRes = await request('/api/contact', { method: 'POST' }, {
      name: 'Retail Partner',
      email: 'buyer@wholefoods.com',
      subject: 'Wholesale inquiry',
      message: 'Interested in stocking SODA in 50 regional stores.'
    });
    assert(contactRes.status === 200 && contactRes.data.success, 'Contact inquiry submitted');

    // 11. Admin telemetry
    const adminStats = await request('/api/admin/stats');
    assert(adminStats.status === 200 && adminStats.data.stats.totalOrders >= 4, 'Admin telemetry stats active and live');

    // 12. Admin orders list
    const adminOrders = await request('/api/admin/orders');
    assert(adminOrders.status === 200 && adminOrders.data.orders.length >= 4, 'Admin orders list populated');

    // 13. Admin update order status
    const updateStat = await request(`/api/admin/orders/${orderRes.data.orderId}/status`, { method: 'PATCH' }, { status: 'shipped' });
    assert(updateStat.status === 200 && updateStat.data.success, 'Admin updated order status to shipped');

    // 14. Admin update stock & price
    const updateProd = await request('/api/admin/products/1', { method: 'PATCH' }, { stock: 199, price: 2.99 });
    assert(updateProd.status === 200 && updateProd.data.success, 'Admin updated product stock to 199');

    // 15. Verify 3D Assets serving
    const assets = [
      '/assets/models/deit_soda2.glb',
      '/assets/models/cherry.glb',
      '/assets/models/blueberry.glb',
      '/assets/models/leaves.glb',
      '/assets/textures/green_base_color.jpg',
      '/assets/textures/blue_base_color.jpg',
      '/assets/textures/bubble.png',
      '/assets/images/Green_Soda.png',
      '/assets/images/Blue_Soda.png'
    ];

    let allAssetsOk = true;
    for (const a of assets) {
      const h = await checkHead(a);
      if (h.status !== 200) allAssetsOk = false;
    }
    assert(allAssetsOk, 'All 9 Three.js 3D models, textures, and images serve with HTTP 200 OK');

    console.log(`\n========================================`);
    console.log(`  SODA E2E RESULTS: ${passed}/${total} PASSED (${Math.round(passed/total*100)}%)`);
    console.log(`========================================`);

    if (passed === total) process.exit(0);
    else process.exit(1);

  } catch (err) {
    console.error('Test suite failed:', err);
    process.exit(1);
  }
})();
