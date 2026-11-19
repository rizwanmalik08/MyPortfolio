import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { initializeDatabase } from './db/database.js';
import apiRouter from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5001;

// 1. Initialize SQLite Database
initializeDatabase();

// 2. Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Development friendly)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    if (req.path.startsWith('/api')) {
      console.log(`[KANSO API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`);
    }
  });
  next();
});

// 3. Mount REST API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'operational',
    service: 'Kanso Collective Luxury 3D E-Commerce Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', apiRouter);

// 4. Serve Storefront Static Frontend
const publicDir = path.resolve('nova-store/public');
app.use(express.static(publicDir, { maxAge: '1h' }));

// Serve local Three.js modules for 100% offline reliability
app.use('/vendor/three', express.static(path.resolve('node_modules/three')));

// Friendly Page Route Aliases
app.get('/shop', (req, res) => res.sendFile(path.join(publicDir, 'shop.html')));
app.get('/product', (req, res) => res.sendFile(path.join(publicDir, 'product.html')));
app.get('/cart', (req, res) => res.sendFile(path.join(publicDir, 'cart.html')));
app.get('/checkout', (req, res) => res.sendFile(path.join(publicDir, 'checkout.html')));
app.get('/order-success', (req, res) => res.sendFile(path.join(publicDir, 'order-success.html')));
app.get('/account', (req, res) => res.sendFile(path.join(publicDir, 'account.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(publicDir, 'admin.html')));

// Catch-all fallback for frontend navigation
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found.' });
  }
  res.sendFile(path.join(publicDir, 'index.html'));
});

// 5. Global Error Handler
app.use((err, req, res, next) => {
  console.error('[KANSO SERVER ERROR]:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected internal error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 6. Start Server
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  KANSO COLLECTIVE 3D E-COMMERCE SERVER RUNNING`);
  console.log(`  Storefront URL: http://localhost:${PORT}/`);
  console.log(`  Catalog:        http://localhost:${PORT}/shop`);
  console.log(`  Admin Panel:    http://localhost:${PORT}/admin`);
  console.log(`  REST API Root:  http://localhost:${PORT}/api/`);
  console.log(`=======================================================`);
});

export default app;
