import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const dbPath = path.resolve('nova-store/server/db/nova_store.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(dbPath);

export function initializeDatabase() {
  // Enable foreign keys and WAL mode if supported
  try { db.exec('PRAGMA foreign_keys = ON;'); } catch (_) {}

  // 1. Categories
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT,
      icon TEXT,
      item_count INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 1
    );
  `);

  // 2. Products
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      category_slug TEXT NOT NULL,
      price REAL NOT NULL,
      sale_price REAL,
      stock INTEGER NOT NULL DEFAULT 50,
      rating REAL DEFAULT 4.9,
      review_count INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      is_trending INTEGER DEFAULT 0,
      is_best_seller INTEGER DEFAULT 0,
      is_new INTEGER DEFAULT 0,
      has_3d INTEGER DEFAULT 0,
      model_url TEXT,
      description TEXT NOT NULL,
      specifications TEXT, -- JSON
      colors TEXT, -- JSON array of { name, hex, value }
      sizes TEXT, -- JSON array
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Product Images
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      is_primary INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0
    );
  `);

  // 4. Users
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'customer', -- 'customer' | 'admin'
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Addresses
  db.exec(`
    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      street TEXT NOT NULL,
      city TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT 'United States',
      is_default INTEGER DEFAULT 0
    );
  `);

  // 6. Orders
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      city TEXT NOT NULL,
      postal_code TEXT NOT NULL,
      payment_method TEXT NOT NULL DEFAULT 'cod', -- 'cod' | 'card_test'
      subtotal REAL NOT NULL,
      discount_amount REAL DEFAULT 0,
      shipping_fee REAL DEFAULT 0,
      tax_amount REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      coupon_code TEXT,
      status TEXT DEFAULT 'processing', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Order Items
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
      product_name TEXT NOT NULL,
      product_image TEXT,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      color TEXT,
      size TEXT,
      total REAL NOT NULL
    );
  `);

  // 8. Reviews
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      user_name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT NOT NULL,
      status TEXT DEFAULT 'approved',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 9. Coupons
  db.exec(`
    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT NOT NULL, -- 'percent' | 'fixed'
      discount_value REAL NOT NULL,
      min_spend REAL DEFAULT 0,
      max_uses INTEGER DEFAULT 1000,
      used_count INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      expires_at DATETIME
    );
  `);

  // 10. Wishlist
  db.exec(`
    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id)
    );
  `);

  // 11. Store Settings
  db.exec(`
    CREATE TABLE IF NOT EXISTS store_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Seed default settings if empty
  const countRow = db.prepare('SELECT COUNT(*) as count FROM store_settings').get();
  if (!countRow || countRow.count === 0) {
    const defaultSettings = [
      ['store_name', 'Kanso Collective'],
      ['announcement_text', 'COMPLIMENTARY WORLDWIDE COURIER SHIPPING ON ORDERS OVER $150 • USE CODE KANSO20 FOR 20% OFF'],
      ['currency_symbol', '$'],
      ['free_shipping_threshold', '150'],
      ['flat_shipping_rate', '15'],
      ['tax_rate', '0.08'], // 8% sales tax
      ['hero_badge', 'EXCLUSIVE SS/26 DROP'],
      ['hero_heading', 'ENGINEERED LUXURY FOR THE MODERN FRONTIER'],
      ['hero_subheading', 'Bespoke precision engineering meets architectural minimalism. Explore curated collections with real-time 3D interactive customization.']
    ];
    const stmt = db.prepare('INSERT INTO store_settings (key, value) VALUES (?, ?)');
    for (const [k, v] of defaultSettings) {
      stmt.run(k, v);
    }
  }

  // Seed data if products table is empty
  seedDatabaseIfNeeded();
}

function seedDatabaseIfNeeded() {
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get()?.count || 0;
  if (productCount > 0) {
    console.log(`Database already seeded with ${productCount} products.`);
    return;
  }

  console.log('Seeding Kanso Collective database with rich category, product, and admin records...');

  // 1. Admin & Test User
  const adminPasswordHash = bcrypt.hashSync('admin123', 10);
  const userPasswordHash = bcrypt.hashSync('client123', 10);

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (name, email, password_hash, role, phone)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertUser.run('Rizwan Malik (Admin)', 'admin@novastore.com', adminPasswordHash, 'admin', '+1 (555) 019-2834');
  insertUser.run('Alexander Vance', 'alexander@example.com', userPasswordHash, 'customer', '+1 (555) 749-1029');

  // 2. Categories
  const categories = [
    {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Next-generation acoustic engineering, wearable telemetry, and architectural computing peripherals.',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      icon: 'Headphones',
      item_count: 4,
      featured: 1
    },
    {
      name: 'Fashion',
      slug: 'fashion',
      description: 'Architectural outerwear, Japanese technical textiles, and tailored luxury essentials.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      icon: 'Shirt',
      item_count: 3,
      featured: 1
    },
    {
      name: 'Watches',
      slug: 'watches',
      description: 'Horological precision, aerospace titanium casings, and sapphire-glass automatic mechanical movements.',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      icon: 'Watch',
      item_count: 3,
      featured: 1
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Full-grain Tuscan leather goods, carbon fiber travel cases, and optical-grade frames.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      icon: 'Briefcase',
      item_count: 3,
      featured: 1
    },
    {
      name: 'Home & Living',
      slug: 'home-living',
      description: 'Architectural lighting, sculptural concrete objects, and monolithic acoustic home pieces.',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      icon: 'Home',
      item_count: 3,
      featured: 1
    },
    {
      name: 'Lifestyle',
      slug: 'lifestyle',
      description: 'High-performance hydration vessels, precision culinary tools, and executive desk accessories.',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      icon: 'Coffee',
      item_count: 3,
      featured: 1
    }
  ];

  const insertCat = db.prepare(`
    INSERT INTO categories (name, slug, description, image, icon, item_count, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  for (const c of categories) {
    insertCat.run(c.name, c.slug, c.description, c.image, c.icon, c.item_count, c.featured);
  }

  // 3. Products
  const products = [
    // Electronics
    {
      name: 'Kanso Apex Wireless ANC Headphones',
      slug: 'nova-apex-wireless-headphones',
      category_slug: 'electronics',
      price: 389.00,
      sale_price: 349.00,
      stock: 45,
      rating: 4.95,
      review_count: 128,
      is_featured: 1,
      is_trending: 1,
      is_best_seller: 1,
      is_new: 1,
      has_3d: 1,
      model_url: '/assets/models/nova-headphones.glb',
      description: 'Precision-machined acoustic monitors engineered with 40mm beryllium drivers, dual-chamber active noise cancellation, and aerospace-grade aluminum chassis. Experience studio reference transparency with bespoke real-time 3D color customization.',
      specifications: JSON.stringify({
        'Driver Architecture': '40mm Custom Electro-Dynamic Beryllium',
        'Frequency Response': '5 Hz – 45,000 Hz Hi-Res Certified',
        'Battery Life': '42 Hours with ANC Active',
        'Connectivity': 'Bluetooth 5.4 with LDAC, aptX Adaptive & USB-C Lossless',
        'Weight': '278 grams',
        'Active Noise Cancellation': 'Hybrid Triple-Mic Feedback & Feedforward'
      }),
      colors: JSON.stringify([
        { name: 'Obsidian Black', hex: '#111319', value: 'obsidian' },
        { name: 'Celestial Silver', hex: '#c0c5d0', value: 'silver' },
        { name: 'Royal Gold', hex: '#d4af37', value: 'gold' },
        { name: 'Cyber Cyan', hex: '#00f0ff', value: 'cyan' },
        { name: 'Emerald Green', hex: '#10b981', value: 'emerald' }
      ]),
      sizes: JSON.stringify(['Universal Fit (Adjustable Headband)']),
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    {
      name: 'Kanso Chrono Horizon Smartwatch',
      slug: 'nova-chrono-horizon-smartwatch',
      category_slug: 'electronics',
      price: 449.00,
      sale_price: 399.00,
      stock: 32,
      rating: 4.91,
      review_count: 84,
      is_featured: 1,
      is_trending: 1,
      is_best_seller: 0,
      is_new: 1,
      has_3d: 1,
      model_url: '/assets/models/nova-smartwatch.glb',
      description: 'Titanium-forged biometric telemetry timepiece with micro-beveled sapphire crystal display, continuous ECG heart monitoring, and up to 14 days of autonomous battery life.',
      specifications: JSON.stringify({
        'Case Material': 'Grade 5 Aerospace Titanium',
        'Display': '1.43” AMOLED Ultra-Retina (1200 Nits peak)',
        'Water Resistance': '50 Meters (5 ATM)',
        'Battery Life': '14 Days standard / 60 Hours continuous GPS',
        'Biometrics': 'Continuous ECG, SpO2, Optical Pulse & Body Temperature'
      }),
      colors: JSON.stringify([
        { name: 'Titanium Slate', hex: '#1e2129', value: 'slate' },
        { name: 'Arctic Silver', hex: '#e2e8f0', value: 'silver' },
        { name: 'Nebula Blue', hex: '#0284c7', value: 'blue' }
      ]),
      sizes: JSON.stringify(['42mm Case', '46mm Case']),
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    {
      name: 'Kanso Spatial Soundbar Pro',
      slug: 'nova-spatial-soundbar-pro',
      category_slug: 'electronics',
      price: 699.00,
      sale_price: null,
      stock: 18,
      rating: 4.88,
      review_count: 42,
      is_featured: 0,
      is_trending: 1,
      is_best_seller: 0,
      is_new: 0,
      has_3d: 0,
      model_url: null,
      description: 'Monolithic aluminum home theater audio array featuring 11 active acoustic transducers with Dolby Atmos 7.1.4 spatial beamforming.',
      specifications: JSON.stringify({
        'Power Output': '480W Total System Power',
        'Channels': '7.1.4 Spatial Sound Architecture',
        'HDMI': 'HDMI eARC 2.1 Passthrough 4K/120Hz',
        'Wireless': 'AirPlay 2, Spotify Connect, Tidal Connect'
      }),
      colors: JSON.stringify([
        { name: 'Midnight Charcoal', hex: '#18181b', value: 'charcoal' },
        { name: 'Brushed Silver', hex: '#d4d4d8', value: 'silver' }
      ]),
      sizes: JSON.stringify(['Standard 48"']),
      images: [
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    {
      name: 'Kanso Minimalist Mechanical Keyboard',
      slug: 'nova-minimalist-mechanical-keyboard',
      category_slug: 'electronics',
      price: 229.00,
      sale_price: 199.00,
      stock: 60,
      rating: 4.96,
      review_count: 94,
      is_featured: 1,
      is_trending: 0,
      is_best_seller: 1,
      is_new: 0,
      has_3d: 0,
      model_url: null,
      description: 'Seamless CNC-milled 6063 aluminum keyboard enclosure with pre-lubricated custom linear switches, poron acoustic dampening foam, and PBT dye-sub keycaps.',
      specifications: JSON.stringify({
        'Form Factor': '75% Compact Layout',
        'Switch Type': 'Nova Linear Silvers (Factory Lubed)',
        'Polling Rate': '1000 Hz / 1ms Latency (Tri-mode Wireless)',
        'Keycaps': 'Double-shot PBT Cherry Profile'
      }),
      colors: JSON.stringify([
        { name: 'Anodized Black', hex: '#0f1117', value: 'black' },
        { name: 'Frost White', hex: '#f8fafc', value: 'white' }
      ]),
      sizes: JSON.stringify(['75% Layout']),
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85'
      ]
    },

    // Fashion
    {
      name: 'Kanso Obsidian Tailored Trench Coat',
      slug: 'nova-obsidian-tailored-trench-coat',
      category_slug: 'fashion',
      price: 495.00,
      sale_price: null,
      stock: 25,
      rating: 4.89,
      review_count: 36,
      is_featured: 1,
      is_trending: 1,
      is_best_seller: 0,
      is_new: 1,
      has_3d: 0,
      model_url: null,
      description: 'Waterproof Japanese membrane wool trench coat tailored with architectural drop shoulders, magnetic storm flap closures, and satin cupro lining.',
      specifications: JSON.stringify({
        'Fabric': '100% Bonded Merino Technical Wool (380 GSM)',
        'Weatherproofing': 'DWR Nanotech Finish (15,000mm Hydrostatic)',
        'Hardware': 'Fidlock V-Buckle Magnetic Closures',
        'Origin': 'Tailored in Milan'
      }),
      colors: JSON.stringify([
        { name: 'Obsidian Black', hex: '#090a0f', value: 'black' },
        { name: 'Deep Olive', hex: '#2c3327', value: 'olive' }
      ]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      images: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    {
      name: 'Kanso Cashmere Oversized Knitwear',
      slug: 'nova-cashmere-oversized-knitwear',
      category_slug: 'fashion',
      price: 320.00,
      sale_price: 280.00,
      stock: 40,
      rating: 4.93,
      review_count: 51,
      is_featured: 0,
      is_trending: 0,
      is_best_seller: 1,
      is_new: 0,
      has_3d: 0,
      model_url: null,
      description: '100% Grade-A Mongolian cashmere sweater spun with a heavy 7-gauge fisherman rib stitch for unmatched thermal softness and structural drape.',
      specifications: JSON.stringify({
        'Fiber': '100% Mongolian Cashmere (15.5 Micron)',
        'Knit Gauge': '7-Gauge Chunky Rib',
        'Fit': 'Contemporary Oversized Relaxed',
        'Care': 'Dry Clean or Gentle Cold Handwash'
      }),
      colors: JSON.stringify([
        { name: 'Heather Charcoal', hex: '#374151', value: 'charcoal' },
        { name: 'Raw Sand', hex: '#d6c7b2', value: 'sand' }
      ]),
      sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
      images: [
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    {
      name: 'Kanso Structured Technical Bomber',
      slug: 'nova-structured-technical-bomber',
      category_slug: 'fashion',
      price: 360.00,
      sale_price: null,
      stock: 30,
      rating: 4.87,
      review_count: 29,
      is_featured: 0,
      is_trending: 1,
      is_best_seller: 0,
      is_new: 1,
      has_3d: 0,
      model_url: null,
      description: 'Lightweight insulated flight jacket crafted from recycled ripstop nylon with PrimaLoft Gold microfiber insulation and dual-entry utility chest pockets.',
      specifications: JSON.stringify({
        'Shell': '100% Recycled 70D Ripstop Nylon',
        'Insulation': 'PrimaLoft Gold Eco (100g body / 80g sleeves)',
        'Zippers': 'Matte Black YKK Excella Waterproof'
      }),
      colors: JSON.stringify([
        { name: 'Space Gray', hex: '#4b5563', value: 'gray' },
        { name: 'Matte Black', hex: '#111827', value: 'black' }
      ]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85'
      ]
    },

    // Watches
    {
      name: 'Kanso Celestial Tourbillon Chronograph',
      slug: 'nova-celestial-tourbillon-chronograph',
      category_slug: 'watches',
      price: 1850.00,
      sale_price: 1650.00,
      stock: 12,
      rating: 4.98,
      review_count: 22,
      is_featured: 1,
      is_trending: 1,
      is_best_seller: 0,
      is_new: 1,
      has_3d: 0,
      model_url: null,
      description: 'Hand-finished automatic flying tourbillon movement with a 72-hour power reserve, dual-anti-reflective sapphire crystal, and DLC-coated titanium case.',
      specifications: JSON.stringify({
        'Movement': 'Manufacture Calibre N-01 Flying Tourbillon (28,800 vph)',
        'Power Reserve': '72 Hours Dual Barrel',
        'Case Diameter': '41mm (11.4mm thickness)',
        'Strap': 'Hand-stitched Italian Crocodile Leather + FKM Rubber'
      }),
      colors: JSON.stringify([
        { name: 'DLC Midnight', hex: '#0f172a', value: 'midnight' },
        { name: 'Rose Gold Accent', hex: '#b76e79', value: 'rosegold' }
      ]),
      sizes: JSON.stringify(['41mm']),
      images: [
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
        'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    {
      name: 'Kanso Minimalist Titanium Automatique',
      slug: 'nova-minimalist-titanium-automatique',
      category_slug: 'watches',
      price: 680.00,
      sale_price: null,
      stock: 28,
      rating: 4.90,
      review_count: 48,
      is_featured: 0,
      is_trending: 0,
      is_best_seller: 1,
      is_new: 0,
      has_3d: 0,
      model_url: null,
      description: 'Sleek Bauhaus-inspired field watch with high-beat Japanese Miyota 9039 movement, sunburst fumé dial, and integrated titanium link bracelet.',
      specifications: JSON.stringify({
        'Movement': 'Miyota 9039 Premium Automatic',
        'Case & Bracelet': 'Solid Grade 2 Titanium with Scratch-Resistant Coating',
        'Lume': 'Super-LumiNova BGW9 (Blue Glow)',
        'Crystal': 'Double-Domed Sapphire Crystal with AR Coating'
      }),
      colors: JSON.stringify([
        { name: 'Brushed Titanium', hex: '#94a3b8', value: 'titanium' },
        { name: 'Sunburst Navy', hex: '#1e3a8a', value: 'navy' }
      ]),
      sizes: JSON.stringify(['38mm', '40mm']),
      images: [
        'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1000&q=85'
      ]
    },

    // Accessories
    {
      name: 'Kanso Full-Grain Leather Weekender',
      slug: 'nova-full-grain-leather-weekender',
      category_slug: 'accessories',
      price: 460.00,
      sale_price: 395.00,
      stock: 20,
      rating: 4.94,
      review_count: 55,
      is_featured: 1,
      is_trending: 0,
      is_best_seller: 1,
      is_new: 0,
      has_3d: 0,
      model_url: null,
      description: 'Vegetable-tanned full-grain leather duffel bag designed for 3-5 day travel. Features a dedicated ventilated footwear compartment and solid brass hardware.',
      specifications: JSON.stringify({
        'Material': 'Full-Grain Tuscan Cowhide (Vegetable Tanned)',
        'Dimensions': '52cm x 28cm x 26cm (42 Liter Capacity)',
        'Hardware': 'Solid Antiqued Brushed Brass with YKK Zippers',
        'Compartments': 'Main chamber, padded 16” laptop sleeve, shoe tunnel'
      }),
      colors: JSON.stringify([
        { name: 'Heritage Cognac', hex: '#854d0e', value: 'cognac' },
        { name: 'Espresso Black', hex: '#18181b', value: 'black' }
      ]),
      sizes: JSON.stringify(['42L Weekend']),
      images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85'
      ]
    },
    {
      name: 'Kanso Aerospace Carbon Fiber Cardholder',
      slug: 'nova-aerospace-carbon-fiber-cardholder',
      category_slug: 'accessories',
      price: 110.00,
      sale_price: 89.00,
      stock: 75,
      rating: 4.92,
      review_count: 110,
      is_featured: 0,
      is_trending: 1,
      is_best_seller: 1,
      is_new: 0,
      has_3d: 0,
      model_url: null,
      description: 'Ultra-thin RFID-blocking cardholder forged from 3K twill matte carbon fiber with cash strap clip and smooth thumb ejection slot.',
      specifications: JSON.stringify({
        'Weight': 'Only 28 grams',
        'Capacity': 'Holds up to 12 cards + 8 bills folded',
        'Protection': 'Military-Grade RFID/NFC Signal Blocker'
      }),
      colors: JSON.stringify([
        { name: 'Forged Carbon', hex: '#27272a', value: 'carbon' },
        { name: 'Gunmetal Anodized', hex: '#52525b', value: 'gunmetal' }
      ]),
      sizes: JSON.stringify(['Slim Profile']),
      images: [
        'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=85'
      ]
    },

    // Home & Living
    {
      name: 'Kanso Cast Concrete Ambient Lamp',
      slug: 'nova-cast-concrete-ambient-lamp',
      category_slug: 'home-living',
      price: 240.00,
      sale_price: null,
      stock: 35,
      rating: 4.86,
      review_count: 31,
      is_featured: 1,
      is_trending: 0,
      is_best_seller: 0,
      is_new: 1,
      has_3d: 0,
      model_url: null,
      description: 'Sculptural brutalist desk lamp cast from hand-poured aggregate concrete with a warm frosted glass orb diffuser and knurled brass dimmer switch.',
      specifications: JSON.stringify({
        'Dimensions': '18cm x 18cm x 24cm (4.2 kg weight)',
        'Lighting': 'Warm 2200K – 2700K Step-less Dimming LED (CRI 95+)',
        'Cord': '2-Meter Braided Textile Cable with In-line Touch Dimmer'
      }),
      colors: JSON.stringify([
        { name: 'Natural Concrete Gray', hex: '#a1a1aa', value: 'gray' },
        { name: 'Charcoal Black Aggregate', hex: '#3f3f46', value: 'charcoal' }
      ]),
      sizes: JSON.stringify(['Medium Table Lamp']),
      images: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=85'
      ]
    },

    // Lifestyle
    {
      name: 'Kanso Matte Black Insulated Thermal Flask',
      slug: 'nova-matte-black-thermal-flask',
      category_slug: 'lifestyle',
      price: 65.00,
      sale_price: 55.00,
      stock: 120,
      rating: 4.97,
      review_count: 165,
      is_featured: 0,
      is_trending: 1,
      is_best_seller: 1,
      is_new: 0,
      has_3d: 0,
      model_url: null,
      description: 'Double-walled vacuum insulated 18/8 food-grade stainless steel bottle. Keeps beverages chilled for 24 hours or steaming hot for 12 hours.',
      specifications: JSON.stringify({
        'Capacity': '750 ml (25 oz)',
        'Thermal Retention': '24 hrs Cold / 12 hrs Hot',
        'Cap': 'Zero-Leak Paracord Loop Lid with Stainless Core'
      }),
      colors: JSON.stringify([
        { name: 'Stealth Black', hex: '#09090b', value: 'black' },
        { name: 'Alpine White', hex: '#fafafa', value: 'white' },
        { name: 'Sage Green', hex: '#65a30d', value: 'green' }
      ]),
      sizes: JSON.stringify(['750ml']),
      images: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85'
      ]
    }
  ];

  const insertProd = db.prepare(`
    INSERT INTO products (
      name, slug, category_id, category_slug, price, sale_price, stock,
      rating, review_count, is_featured, is_trending, is_best_seller, is_new,
      has_3d, model_url, description, specifications, colors, sizes
    ) VALUES (
      ?, ?, (SELECT id FROM categories WHERE slug = ?), ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
  `);

  const insertImg = db.prepare(`
    INSERT INTO product_images (product_id, url, is_primary, sort_order)
    VALUES (?, ?, ?, ?)
  `);

  const insertRev = db.prepare(`
    INSERT INTO reviews (product_id, user_name, rating, comment, status)
    VALUES (?, ?, ?, ?, 'approved')
  `);

  for (const p of products) {
    insertProd.run(
      p.name, p.slug, p.category_slug, p.category_slug, p.price, p.sale_price, p.stock,
      p.rating, p.review_count, p.is_featured, p.is_trending, p.is_best_seller, p.is_new,
      p.has_3d, p.model_url, p.description, p.specifications, p.colors, p.sizes
    );

    const insertedId = db.prepare('SELECT last_insert_rowid() as id').get()?.id;
    if (insertedId) {
      p.images.forEach((url, idx) => {
        insertImg.run(insertedId, url, idx === 0 ? 1 : 0, idx);
      });

      // Sample verified reviews
      insertRev.run(insertedId, 'Marcus Thorne', 5, 'Exceptional craftsmanship. The build quality and attention to detail surpasses major luxury brands.');
      insertRev.run(insertedId, 'Elena Rostova', 5, 'Ordered online and received in 2 days. The 3D customizer matches the real physical product exactly.');
    }
  }

  // 4. Coupons
  const coupons = [
    { code: 'KANSO20', type: 'percent', val: 20, min: 50, max: 5000 },
    { code: 'NOVA20', type: 'percent', val: 20, min: 50, max: 5000 },
    { code: 'WELCOME10', type: 'fixed', val: 10, min: 40, max: 1000 },
    { code: 'VIP15', type: 'percent', val: 15, min: 100, max: 2000 }
  ];
  const insertCoupon = db.prepare(`
    INSERT INTO coupons (code, discount_type, discount_value, min_spend, max_uses, is_active)
    VALUES (?, ?, ?, ?, ?, 1)
  `);
  for (const c of coupons) {
    insertCoupon.run(c.code, c.type, c.val, c.min, c.max);
  }

  // 5. Seed an initial demo order so Admin dashboard has live telemetry right away
  const insertOrder = db.prepare(`
    INSERT INTO orders (
      order_number, user_id, customer_name, customer_email, customer_phone,
      shipping_address, city, postal_code, payment_method,
      subtotal, discount_amount, shipping_fee, tax_amount, total_amount,
      coupon_code, status
    ) VALUES (
      'NOV-89421', 2, 'Alexander Vance', 'alexander@example.com', '+1 (555) 749-1029',
      '742 Evergreen Terrace, Suite 400', 'San Francisco', '94107', 'card_test',
      389.00, 77.80, 0.00, 24.89, 336.09,
      'NOVA20', 'processing'
    )
  `);
  insertOrder.run();
  const orderId = db.prepare('SELECT last_insert_rowid() as id').get()?.id;
  if (orderId) {
    db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity, color, size, total)
      VALUES (?, 1, 'Kanso Apex Wireless ANC Headphones', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85', 389.00, 1, 'Obsidian Black', 'Universal Fit', 389.00)
    `).run(orderId);
  }

  console.log('Database initialization & sample seeding completed successfully!');
}
