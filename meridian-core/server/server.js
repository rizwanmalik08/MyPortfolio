import express from 'express';
import cors from 'cors';
import path from 'path';
import { db, initializeDatabase } from './db/database.js';

const app = express();
const PORT = process.env.PORT || 5003;

// Initialize SQLite database
initializeDatabase();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic IP rate limiting store for inquiries
const ipRateLimits = new Map();

function rateLimitInquiries(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 5;

  const timestamps = (ipRateLimits.get(ip) || []).filter(t => now - t < windowMs);
  if (timestamps.length >= maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please wait a minute before submitting another inquiry.'
    });
  }

  timestamps.push(now);
  ipRateLimits.set(ip, timestamps);
  next();
}

// Serve static frontend assets
const publicDir = path.resolve('meridian-core/public');
app.use(express.static(publicDir));

// ==========================================
// REST API ROUTES
// ==========================================

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'Marcus Vane — Founder, Investor & Operator',
    tagline: 'Conviction Before Consensus',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// 2. Ventures / Projects
app.get('/api/ventures', (req, res) => {
  try {
    const ventures = db.prepare('SELECT * FROM ventures ORDER BY id ASC;').all();
    res.json({ success: true, ventures });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/ventures/:slug', (req, res) => {
  try {
    const venture = db.prepare('SELECT * FROM ventures WHERE slug = ? OR id = ?;').get(req.params.slug, req.params.slug);
    if (!venture) {
      return res.status(404).json({ success: false, error: 'Venture not found' });
    }
    res.json({ success: true, venture });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Leadership Team
app.get('/api/team', (req, res) => {
  try {
    const team = db.prepare('SELECT * FROM leadership ORDER BY order_idx ASC;').all();
    res.json({ success: true, team });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Testimonials
app.get('/api/testimonials', (req, res) => {
  try {
    const testimonials = db.prepare('SELECT * FROM testimonials ORDER BY id ASC;').all();
    res.json({ success: true, testimonials });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Insights & News
app.get('/api/insights', (req, res) => {
  try {
    const insights = db.prepare('SELECT * FROM insights ORDER BY id ASC;').all();
    res.json({ success: true, insights });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Impact & Business Statistics
app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      companiesExited: '4',
      valueCreated: '$3.2B',
      peopleServed: '120M+',
      jobsCreated: '2,400',
      tagline: 'Two decades, measured.'
    }
  });
});

// 7. Contact Inquiries Submission (Working Endpoint with Persistent DB Storage)
app.post('/api/inquiries', rateLimitInquiries, (req, res) => {
  try {
    const { name, email, company, subject, message } = req.body;

    // Server-side validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Please enter a valid full name (minimum 2 characters).' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Please provide a valid corporate email address.' });
    }
    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'Please provide an inquiry subject.' });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Message must be at least 10 characters long.' });
    }

    // Sanitize input strings
    const cleanName = name.trim().slice(0, 100);
    const cleanEmail = email.trim().toLowerCase().slice(0, 150);
    const cleanCompany = (company || '').trim().slice(0, 120);
    const cleanSubject = subject.trim().slice(0, 200);
    const cleanMessage = message.trim().slice(0, 2000);
    const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';

    // Insert into SQLite database
    const stmt = db.prepare(`
      INSERT INTO inquiries (name, email, company, subject, message, ip_address)
      VALUES (?, ?, ?, ?, ?, ?);
    `);

    const result = stmt.run(cleanName, cleanEmail, cleanCompany, cleanSubject, cleanMessage, ip);

    res.status(201).json({
      success: true,
      inquiryId: result.lastInsertRowid,
      message: 'Inquiry received. A Meridian Core senior partner will reach out within 24 hours.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server database error: ' + err.message });
  }
});

// 8. List Inquiries (Internal Telemetry)
app.get('/api/inquiries', (req, res) => {
  try {
    const inquiries = db.prepare('SELECT id, name, email, company, subject, message, status, created_at FROM inquiries ORDER BY id DESC;').all();
    res.json({ success: true, count: inquiries.length, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to index.html for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  MERIDIAN CORE — Business & Innovation Group`);
  console.log(`  Live on port ${PORT}`);
  console.log(`  Storefront: http://localhost:${PORT}/`);
  console.log(`=======================================================`);
});

