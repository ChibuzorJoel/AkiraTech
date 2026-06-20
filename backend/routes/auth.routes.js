const express = require('express');
const jwt     = require('jsonwebtoken');
const Admin   = require('../models/Admin.model');
const { protect, requireSuperAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

/* POST /api/auth/login */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 TEMP DEBUG — remove once login is fixed
    console.log('🔍 Login attempt:', JSON.stringify({ email, password, passwordLength: password?.length }));

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin || !admin.isActive) {
      console.log('🔍 No admin found or inactive for email:', email.toLowerCase());
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 🔍 TEMP DEBUG — remove once login is fixed
    console.log('🔍 Stored hash:', admin.password);

    const isMatch = await admin.comparePassword(password);

    // 🔍 TEMP DEBUG — remove once login is fixed
    console.log('🔍 Password match result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = signToken(admin._id);

    res.json({
      success: true,
      token,
      admin: admin.toJSON(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* GET /api/auth/me — verify token & return profile */
router.get('/me', protect, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

/* POST /api/auth/change-password */
router.post('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both fields required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const admin = await Admin.findById(req.admin._id);
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* POST /api/auth/create-admin (superadmin only) */
router.post('/create-admin', protect, requireSuperAdmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password required' });
    }

    const exists = await Admin.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Admin with this email already exists' });
    }

    const admin = await Admin.create({ name, email, password, role: role || 'admin' });
    res.status(201).json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* GET /api/auth/admins (superadmin only) */
router.get('/admins', protect, requireSuperAdmin, async (req, res) => {
  try {
    const admins = await Admin.find().sort({ createdAt: -1 });
    res.json({ success: true, admins });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;