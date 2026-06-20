const express      = require('express');
const Registration = require('../models/Registration.model');
const { protect }  = require('../middleware/auth.middleware');
const { sendRegistrationConfirmation, sendAdminNotification } = require('../utils/email');

const router = express.Router();

/* ─────────────────────────────────────────
   PUBLIC — POST /api/registrations
   Called from the Angular register form
───────────────────────────────────────── */
router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, course, source, message } = req.body;

    if (!fullName || !email || !phone || !course) {
      return res.status(400).json({ success: false, message: 'fullName, email, phone and course are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    const registration = await Registration.create({
      fullName, email, phone, course,
      source:    source  || 'Not specified',
      message:   message || '',
      ipAddress: req.ip,
    });

    /* Send emails (non-blocking — don't fail the request if email fails) */
    Promise.allSettled([
      sendRegistrationConfirmation(registration),
      sendAdminNotification(registration),
    ]).then(results => {
      const emailOk = results[0].status === 'fulfilled';
      if (emailOk) {
        Registration.findByIdAndUpdate(registration._id, { emailSent: true }).exec();
      }
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! We will contact you within 24 hours.',
      data: { id: registration._id, fullName, email, course },
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

/* ─────────────────────────────────────────
   ADMIN — GET /api/registrations
   Query params: status, course, search, page, limit
───────────────────────────────────────── */
router.get('/', protect, async (req, res) => {
  try {
    const { status, course, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (course) filter.course = new RegExp(course, 'i');
    if (search) {
      filter.$or = [
        { fullName: new RegExp(search, 'i') },
        { email:    new RegExp(search, 'i') },
        { phone:    new RegExp(search, 'i') },
      ];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Registration.countDocuments(filter);
    const registrations = await Registration.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('reviewedBy', 'name email');

    res.json({
      success: true,
      data: registrations,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ADMIN — GET /api/registrations/:id */
router.get('/:id', protect, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id).populate('reviewedBy', 'name email');
    if (!reg) return res.status(404).json({ success: false, message: 'Registration not found' });
    res.json({ success: true, data: reg });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ADMIN — PATCH /api/registrations/:id — update status / notes */
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const update = { reviewedBy: req.admin._id, reviewedAt: new Date() };
    if (status) update.status = status;
    if (notes  !== undefined) update.notes = notes;

    const reg = await Registration.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!reg) return res.status(404).json({ success: false, message: 'Not found' });

    res.json({ success: true, data: reg });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ADMIN — DELETE /api/registrations/:id */
router.delete('/:id', protect, async (req, res) => {
  try {
    await Registration.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Registration deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;