const express          = require('express');
const QuickRegistration = require('../models/QuickRegistration.model');
const { protect }      = require('../middleware/auth.middleware');
const { sendQuickRegConfirmation, sendQuickRegAdminNotification } = require('../utils/contactEmail');

const router = express.Router();

/* PUBLIC — POST /api/quick-register */
router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, source, message } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ success: false, message: 'fullName, email and phone are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    const reg = await QuickRegistration.create({
      fullName, email, phone,
      source:  source  || 'Not specified',
      message: message || 'No message provided',
      ipAddress: req.ip,
    });

    Promise.allSettled([
      sendQuickRegConfirmation(reg),
      sendQuickRegAdminNotification(reg),
    ]).then(results => {
      if (results[0].status === 'fulfilled') {
        QuickRegistration.findByIdAndUpdate(reg._id, { emailSent: true }).exec();
      }
    });

    res.status(201).json({
      success: true,
      message: 'Registration received! We will contact you soon.',
      data: { id: reg._id, fullName, email },
    });
  } catch (err) {
    console.error('Quick registration error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

/* ADMIN — GET /api/quick-register */
router.get('/', protect, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: new RegExp(search, 'i') },
        { email:    new RegExp(search, 'i') },
        { phone:    new RegExp(search, 'i') },
      ];
    }
    const skip  = (Number(page) - 1) * Number(limit);
    const total = await QuickRegistration.countDocuments(filter);
    const regs  = await QuickRegistration.find(filter)
      .sort({ createdAt: -1 }).skip(skip).limit(Number(limit))
      .populate('reviewedBy', 'name email');

    res.json({
      success: true,
      data: regs,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ADMIN — GET /api/quick-register/:id */
router.get('/:id', protect, async (req, res) => {
  try {
    const reg = await QuickRegistration.findById(req.params.id).populate('reviewedBy', 'name email');
    if (!reg) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: reg });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ADMIN — PATCH /api/quick-register/:id */
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const update = { reviewedBy: req.admin._id, reviewedAt: new Date() };
    if (status) update.status = status;
    if (notes  !== undefined) update.notes = notes;
    const reg = await QuickRegistration.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!reg) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: reg });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ADMIN — DELETE /api/quick-register/:id */
router.delete('/:id', protect, async (req, res) => {
  try {
    await QuickRegistration.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;