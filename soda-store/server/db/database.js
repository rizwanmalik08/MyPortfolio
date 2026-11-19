import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve('soda-store/server/db/soda_store.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(dbPath);

export function initializeDatabase() {
  try { db.exec('PRAGMA foreign_keys = ON;'); } catch (_) {}

  // 1. Products Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      tagline TEXT,
      price REAL NOT NULL DEFAULT 2.99,
      sale_price REAL,
      stock INTEGER NOT NULL DEFAULT 150,
      description TEXT,
      calories INTEGER DEFAULT 0,
      sugar TEXT DEFAULT '0g',
      caffeine TEXT DEFAULT '45mg',
      volume TEXT DEFAULT '330ml / 11.2 fl oz',
      featured INTEGER DEFAULT 1
    );
  `);

  // 2. Flavors Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS flavors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      tagline TEXT,
      price REAL NOT NULL DEFAULT 2.99,
      fruit_type TEXT NOT NULL,
      color_inner TEXT NOT NULL,
      color_middle TEXT NOT NULL,
      color_outer TEXT NOT NULL,
      can_texture TEXT NOT NULL,
      image_url TEXT NOT NULL,
      active INTEGER DEFAULT 1
    );
  `);

  // 3. Orders Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      shipping_address TEXT NOT NULL,
      city TEXT NOT NULL,
      postal_code TEXT,
      subtotal REAL NOT NULL,
      discount REAL DEFAULT 0,
      shipping REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      payment_method TEXT DEFAULT 'cash_on_delivery',
      payment_status TEXT DEFAULT 'pending',
      order_status TEXT DEFAULT 'processing',
      coupon_code TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Order Items Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
      product_name TEXT NOT NULL,
      flavor_name TEXT NOT NULL,
      pack_type TEXT NOT NULL DEFAULT 'Single Can',
      price REAL NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      item_total REAL NOT NULL
    );
  `);

  // 5. Customer Reviews Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_location TEXT DEFAULT 'Verified Buyer',
      flavor TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      title TEXT NOT NULL,
      comment TEXT NOT NULL,
      verified INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Contact Inquiries Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Coupons Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      discount_percent INTEGER NOT NULL,
      min_spend REAL DEFAULT 0,
      active INTEGER DEFAULT 1
    );
  `);

  // Seed initial data if tables are empty
  seedDatabase();
}

function seedDatabase() {
  // Check if products exist
  const prodCount = db.prepare('SELECT COUNT(*) as count FROM products;').get().count;
  if (prodCount === 0) {
    const insertProd = db.prepare(`
      INSERT INTO products (name, slug, tagline, price, stock, description, calories, sugar, caffeine, volume)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);

    insertProd.run(
      'Diet Classic Soda',
      'diet-classic',
      'Botanical Kola & Glacial Crispness',
      2.99,
      180,
      'Crafted with wild kola nut extract, organic vanilla pods, and high-altitude mountain spring water. 100% naturally carbonated with zero sugar and zero synthetic colors.',
      0,
      '0g',
      '42mg',
      '330ml / 11.2 fl oz'
    );

    insertProd.run(
      'Zero Lime Soda',
      'zero-lime',
      'Zesty Persian Lime & Sparkling Chill',
      2.99,
      145,
      'Infused with sun-drenched Persian limes, cold-pressed citrus peel, and botanical electrolytes. A sharp, invigorating effervescent burst engineered for pure refreshment.',
      0,
      '0g',
      '38mg',
      '330ml / 11.2 fl oz'
    );
  }

  // Check if flavors exist
  const flavorCount = db.prepare('SELECT COUNT(*) as count FROM flavors;').get().count;
  if (flavorCount === 0) {
    const insertFlavor = db.prepare(`
      INSERT INTO flavors (name, slug, tagline, price, fruit_type, color_inner, color_middle, color_outer, can_texture, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);

    insertFlavor.run(
      'Diet Classic',
      'diet-classic',
      'Zero Sugar • Botanical Kola Essence',
      2.99,
      'cherry',
      '#0b8a78',
      '#044e3b',
      '#011411',
      '/assets/textures/green_base_color.jpg',
      '/assets/images/Green_Soda.png'
    );

    insertFlavor.run(
      'Zero Lime',
      'zero-lime',
      'Zero Sugar • Electric Citrus Rush',
      2.99,
      'blueberry',
      '#0b4f8a',
      '#04294e',
      '#010c14',
      '/assets/textures/blue_base_color.jpg',
      '/assets/images/Blue_Soda.png'
    );
  }

  // Check if reviews exist
  const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews;').get().count;
  if (reviewCount === 0) {
    const insertReview = db.prepare(`
      INSERT INTO reviews (customer_name, customer_location, flavor, rating, title, comment)
      VALUES (?, ?, ?, ?, ?, ?);
    `);

    insertReview.run(
      'Elena Vance',
      'San Francisco, CA',
      'Diet Classic',
      5,
      'The cleanest zero-sugar beverage ever made',
      'Zero artificial aftertaste. The botanical kola and gentle vanilla notes feel premium and crisp. Hands down the best healthy soda on the market.'
    );

    insertReview.run(
      'Marcus Sterling',
      'Austin, TX',
      'Zero Lime',
      5,
      'Electric lime punch with mountain water fizz',
      'Zero Lime is addictive! The Persian lime gives it a vibrant tartness that cuts through heat like nothing else. The packaging and can look like a piece of art.'
    );

    insertReview.run(
      'Sophie Chen',
      'Seattle, WA',
      'Diet Classic',
      5,
      'Replaced all my regular sodas instantly',
      'Incredible fizz and pure ingredients. I appreciate the aluminum can sustainability ethos and the transparency in their ingredients.'
    );

    insertReview.run(
      'David Miller',
      'New York, NY',
      'Zero Lime',
      5,
      'Smooth carbonation, clean energy boost',
      'Natural electrolytes and zero crash. Arrived in recyclable packaging within two days. Highly recommended!'
    );
  }

  // Check if coupons exist
  const couponCount = db.prepare('SELECT COUNT(*) as count FROM coupons;').get().count;
  if (couponCount === 0) {
    const insertCoupon = db.prepare('INSERT INTO coupons (code, discount_percent, min_spend) VALUES (?, ?, ?);');
    insertCoupon.run('REFRESH15', 15, 0);
    insertCoupon.run('SODA20', 20, 10);
    insertCoupon.run('SUMMER25', 25, 20);
  }

  // Seed sample orders for admin telemetry
  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders;').get().count;
  if (orderCount === 0) {
    const insertOrder = db.prepare(`
      INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, city, postal_code, subtotal, discount, shipping, total, payment_method, payment_status, order_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `);

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_name, flavor_name, pack_type, price, quantity, item_total)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `);

    const o1 = insertOrder.run(
      'SODA-84920',
      'Liam Thorne',
      'liam.thorne@gmail.com',
      '+1 (555) 234-5678',
      '742 Evergreen Terrace',
      'Portland',
      '97201',
      28.99,
      4.35,
      0,
      24.64,
      'credit_card_demo',
      'paid',
      'delivered'
    );
    insertItem.run(o1.lastInsertRowid, 'Diet Classic Soda', 'Diet Classic', '12-Pack Case', 28.99, 1, 28.99);

    const o2 = insertOrder.run(
      'SODA-91834',
      'Chloe Davenport',
      'chloe.d@techfrontier.io',
      '+1 (555) 876-5432',
      '101 Silicon Alley, Suite 4B',
      'New York',
      '10010',
      31.98,
      0,
      0,
      31.98,
      'cash_on_delivery',
      'paid',
      'shipped'
    );
    insertItem.run(o2.lastInsertRowid, 'Zero Lime Soda', 'Zero Lime', '6-Pack Box', 15.99, 2, 31.98);

    const o3 = insertOrder.run(
      'SODA-72411',
      'Alexander Vance',
      'alexander@venturecore.com',
      '+1 (555) 432-1098',
      '500 Ocean Avenue, Apt 12',
      'Santa Monica',
      '90401',
      17.94,
      2.69,
      3.50,
      18.75,
      'apple_pay_demo',
      'paid',
      'processing'
    );
    insertItem.run(o3.lastInsertRowid, 'Diet Classic Soda', 'Diet Classic', 'Single Can', 2.99, 6, 17.94);
  }
}
