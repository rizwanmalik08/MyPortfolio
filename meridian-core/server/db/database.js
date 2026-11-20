import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'meridian_core.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new DatabaseSync(dbPath);

export function initializeDatabase() {
  try { db.exec('PRAGMA foreign_keys = ON;'); } catch (_) { }

  // 1. Projects / Ventures Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ventures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      industry TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      year TEXT NOT NULL,
      achievement TEXT NOT NULL,
      metrics TEXT NOT NULL,
      image_url TEXT NOT NULL,
      category TEXT NOT NULL,
      featured INTEGER DEFAULT 1
    );
  `);

  // 2. Capabilities Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS capabilities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      subtitle TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      deliverables TEXT NOT NULL
    );
  `);

  // 3. Team Leadership Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS leadership (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      bio TEXT NOT NULL,
      image_url TEXT NOT NULL,
      linkedin_url TEXT NOT NULL,
      order_idx INTEGER DEFAULT 0
    );
  `);

  // 4. Testimonials Table (Voices)
  db.exec(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quote TEXT NOT NULL,
      client_name TEXT NOT NULL,
      client_role TEXT NOT NULL,
      company TEXT NOT NULL,
      avatar_url TEXT NOT NULL,
      rating INTEGER DEFAULT 5
    );
  `);

  // 5. Inquiries Table (Working Contact Submissions)
  db.exec(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      ip_address TEXT,
      status TEXT DEFAULT 'new',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedData();
}

function seedData() {
  // Clear and reseed ventures to match Marcus Vane portfolio exactly
  db.exec('DELETE FROM ventures;');
  const insertVenture = db.prepare(`
    INSERT INTO ventures (title, slug, industry, tagline, description, year, achievement, metrics, image_url, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `);

  insertVenture.run(
    'Helix Robotics',
    'helix-robotics',
    'Industrial Automation',
    'Reinvented warehouse logistics with autonomous fleets now running in 40 countries.',
    'Pioneered AI-directed autonomous mobile robots and multi-agent fleet choreography for high-throughput global supply chain hubs.',
    '2019',
    'Acquired — $1.1B',
    '40 Countries Deployed • 18,000+ Active Robots • $1.1B Exit',
    '/assets/images/mv-venture-01.webp',
    'robotics'
  );

  insertVenture.run(
    'Northwind Energy',
    'northwind-energy',
    'Climate Infrastructure',
    'Brought utility-scale storage to the grid years before the market believed it was viable.',
    'Scaled grid-synchronous multi-megawatt battery storage systems that stabilize trans-regional renewable energy grids during peak transmission fluctuations.',
    '2015',
    'IPO — NYSE: NWND',
    'Public Listing (NYSE: NWND) • 2.4 GWh Installed • 100% Clean Dispatch',
    '/assets/images/mv-venture-02.webp',
    'energy'
  );

  insertVenture.run(
    'Cadence Health',
    'cadence-health',
    'Digital Medicine',
    'Put a clinician in every pocket and rewired how chronic care gets delivered.',
    'Architected an ambient clinical intelligence engine providing real-time biometric telemetry and continuous preventative patient management.',
    '2011',
    'Acquired — $640M',
    '14M+ Patients Supported • 98.4% Diagnostic Accuracy • $640M Acquisition',
    '/assets/images/mv-venture-03.webp',
    'health'
  );

  insertVenture.run(
    'Vane Capital',
    'vane-capital',
    'Venture Investing',
    'Backing the next generation of contrarian founders building hard, durable companies.',
    'Private venture partnership deploying early-stage catalytic capital into deep-tech, energy infrastructure, and frontier computing enterprises.',
    '2008',
    'Active — $900M AUM',
    '$900M AUM • 28 Portfolio Investments • 4 Unicorn Exits',
    '/assets/images/mv-venture-04.webp',
    'capital'
  );

  // Clear and reseed Voices (Testimonials)
  db.exec('DELETE FROM testimonials;');
  const insertVoice = db.prepare(`
    INSERT INTO testimonials (quote, client_name, client_role, company, avatar_url, rating)
    VALUES (?, ?, ?, ?, ?, ?);
  `);

  insertVoice.run(
    'Marcus saw the market three years before the rest of us. Betting alongside him changed the trajectory of my entire career.',
    'Elena Cardoso',
    'Managing Partner',
    'Meridian Ventures',
    '/assets/images/mv-voice-01.webp',
    5
  );

  insertVoice.run(
    'When every institutional VC passed on our hardware prototype, Marcus wrote the first check and spent weekends with our firmware engineers solving heat dissipation.',
    'David Okonkwo',
    'Founder & CEO',
    'Cadence Health',
    '/assets/images/team-marcus.jpg',
    5
  );

  insertVoice.run(
    'He understands grid mechanics and capital markets equally well. That rare combination is why Northwind scaled from pilot to NYSE listing.',
    'Priya Nandakumar',
    'Chief Executive Officer',
    'Northwind Energy',
    '/assets/images/team-elena.jpg',
    5
  );
}
