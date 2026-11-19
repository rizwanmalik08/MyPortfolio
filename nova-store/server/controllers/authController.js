import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';
import { JWT_SECRET } from '../middleware/auth.js';

export function register(req, res) {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, phone)
      VALUES (?, ?, ?, 'customer', ?)
    `).run(name.trim(), email.toLowerCase().trim(), passwordHash, phone || null);

    const newUserId = db.prepare('SELECT last_insert_rowid() as id').get()?.id;
    const user = { id: newUserId, name: name.trim(), email: email.toLowerCase().trim(), role: 'customer' };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({ success: true, message: 'Registration successful.', token, user });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function getProfile(req, res) {
  try {
    const user = db.prepare('SELECT id, name, email, role, phone, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const addresses = db.prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC').all(req.user.id);
    const ordersCount = db.prepare('SELECT COUNT(*) as count FROM orders WHERE user_id = ?').get(req.user.id)?.count || 0;
    const wishlistCount = db.prepare('SELECT COUNT(*) as count FROM wishlist WHERE user_id = ?').get(req.user.id)?.count || 0;

    return res.json({
      success: true,
      user: { ...user, addresses, ordersCount, wishlistCount }
    });
  } catch (err) {
    console.error('GetProfile error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function updateProfile(req, res) {
  try {
    const { name, phone, address } = req.body;
    if (name) {
      db.prepare('UPDATE users SET name = ?, phone = ? WHERE id = ?').run(name.trim(), phone || null, req.user.id);
    }

    if (address && address.street && address.city) {
      const existingAddr = db.prepare('SELECT id FROM addresses WHERE user_id = ? AND is_default = 1').get(req.user.id);
      if (existingAddr) {
        db.prepare(`
          UPDATE addresses SET name = ?, street = ?, city = ?, postal_code = ?, country = ?
          WHERE id = ?
        `).run(address.name || name, address.street, address.city, address.postal_code || '', address.country || 'United States', existingAddr.id);
      } else {
        db.prepare(`
          INSERT INTO addresses (user_id, name, street, city, postal_code, country, is_default)
          VALUES (?, ?, ?, ?, ?, ?, 1)
        `).run(req.user.id, address.name || name, address.street, address.city, address.postal_code || '', address.country || 'United States');
      }
    }

    return res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('UpdateProfile error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}

export function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
    if (!bcrypt.compareSync(currentPassword, user.password_hash)) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }

    const newHash = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, req.user.id);

    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error('ChangePassword error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}
