const express      = require('express');
const Contact      = require('../models/Contact.model');
const { protect }  = require('../middleware/auth.middleware');
const { sendContactConfirmation, sendContactAdminNotification } = require('../utils/contactEmail');

const router = express.Router();

/* ─────────────────────────────────────────
   PUBLIC — POST /api/contact
   Called from the main Contact form on contact.component.ts
───────────────────────────────────────── */
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, service, budget, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !service || !message) {
      return res.status(400).json({
        success: false,
        message: 'firstName, lastName, email, phone, service and message are required',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({ success: false, message: 'Message must be at least 10 characters' });
    }

    const contact = await Contact.create({
      firstName, lastName, email, phone, service,
      budget:    budget || 'Not specified',
      message,
      ipAddress: req.ip,
    });

    /* Send emails — non-blocking, won't fail the request if email fails */
    Promise.allSettled([
      sendContactConfirmation(contact),
      sendContactAdminNotification(contact),
    ]).then(results => {
      if (results[0].status === 'fulfilled') {
        Contact.findByIdAndUpdate(contact._id, { emailSent: true }).exec();
      }
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you within 2-4 hours.',
      data: { id: contact._id, firstName, lastName, email },
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

/* ─────────────────────────────────────────
   ADMIN — GET /api/contact
   Query params: status, service, search, page, limit
───────────────────────────────────────── */
router.get('/', protect, async (req, res) => {
  try {
    const { status, service, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status)  filter.status  = status;
    if (service) filter.service = new RegExp(service, 'i');
    if (search) {
      filter.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName:  new RegExp(search, 'i') },
        { email:     new RegExp(search, 'i') },
        { phone:     new RegExp(search, 'i') },
      ];
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('reviewedBy', 'name email');

    res.json({
      success: true,
      data: contacts,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ADMIN — GET /api/contact/:id */
router.get('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).populate('reviewedBy', 'name email');
    if (!contact) return res.status(404).json({ success: false, message: 'Contact submission not found' });
    res.json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ADMIN — PATCH /api/contact/:id — update status / notes */
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const update = { reviewedBy: req.admin._id, reviewedAt: new Date() };
    if (status) update.status = status;
    if (notes  !== undefined) update.notes = notes;

    const contact = await Contact.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Not found' });

    res.json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ADMIN — DELETE /api/contact/:id */
router.delete('/:id', protect, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact submission deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;