const express      = require('express');
const axios        = require('axios');
const Payment      = require('../models/Payment.model');
const Registration = require('../models/Registration.model');
const { protect }  = require('../middleware/auth.middleware');
const {
  sendPayazaReceipt,
  sendBankTransferPending,
  sendPaymentAdminNotification,
  sendBankTransferVerifiedReceipt,
} = require('../utils/paymentEmail');

const router = express.Router();

/* ─────────────────────────────────────────
   COURSE PRICES (₦) — update here anytime
───────────────────────────────────────── */
const COURSE_PRICES = {
  'Web Development (Full Stack)': 350000,
  'Frontend Development':         150000,
  'Backend Development':          250000,
  'Mobile App Development':       300000,
  'UI/UX Design':                 180000,
  'Data analysis':                200000,
  'Virtual assistance':           120000,
  'Copywriting and CV writing':   100000,
  'Social media management':      130000,
};

/* ─────────────────────────────────────────
   BANK DETAILS — update here anytime
───────────────────────────────────────── */
const BANK_DETAILS = {
  bankName:      'Kuda Bank',
  accountNumber: '3003782830',
  accountName:   'Akiira Information Tech Ltd',
};

/* ── GET /api/payments/prices ── */
router.get('/prices', (req, res) => {
  res.json({ success: true, prices: COURSE_PRICES, bank: BANK_DETAILS });
});

/* ── GET /api/payments/price/:course ── */
router.get('/price/:course', (req, res) => {
  const course = decodeURIComponent(req.params.course);
  const price  = COURSE_PRICES[course];
  if (!price) return res.status(404).json({ success: false, message: 'Course not found' });
  res.json({
    success: true, course, price,
    formatted: `₦${price.toLocaleString('en-NG')}`,
    bank: BANK_DETAILS,
  });
});

/* ── POST /api/payments/initiate-payaza ── */
router.post('/initiate-payaza', async (req, res) => {
  try {
    const { registrationId, fullName, email, phone, course } = req.body;
    if (!fullName || !email || !phone || !course) {
      return res.status(400).json({ success: false, message: 'fullName, email, phone and course are required' });
    }

    const amount = COURSE_PRICES[course];
    if (!amount) return res.status(400).json({ success: false, message: 'Invalid course' });

    const payment = await Payment.create({
      registrationId: registrationId || null,
      fullName, email, phone, course, amount,
      method: 'payaza', status: 'pending', ipAddress: req.ip,
    });

    const reference = `AKIIRA-${payment._id}`;
    await Payment.findByIdAndUpdate(payment._id, { payazaReference: reference });

    const payazaPayload = {
      merchant_transaction_id: reference,
      amount: amount * 100, // Payaza uses kobo
      currency: 'NGN',
      email,
      firstname: fullName.split(' ')[0],
      lastname:  fullName.split(' ').slice(1).join(' ') || fullName,
      phone_number: phone,
      description: `Payment for ${course} — Akiira Tech`,
      callback_url: `${process.env.FRONTEND_URL}/payment-success?ref=${reference}&method=payaza`,
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payments/payaza-webhook`,
    };

    const payazaRes = await axios.post(
      'https://api.payaza.africa/live/payaza-account/api/v1/payin/hosted-payment',
      payazaPayload,
      {
        headers: {
          Authorization: `Payaza ${process.env.PAYAZA_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const checkoutUrl = payazaRes.data?.data?.checkout_url || payazaRes.data?.checkout_url;
    if (!checkoutUrl) {
      console.error('Payaza response:', payazaRes.data);
      return res.status(502).json({ success: false, message: 'Failed to get Payaza checkout URL' });
    }

    res.json({ success: true, paymentId: payment._id, reference, checkoutUrl });
  } catch (err) {
    console.error('Payaza init error:', err?.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Failed to initiate payment. Please try again.' });
  }
});

/* ── POST /api/payments/payaza-webhook ── */
router.post('/payaza-webhook', async (req, res) => {
  try {
    const { merchant_transaction_id, status, transaction_id } = req.body;
    if (!merchant_transaction_id) return res.status(400).json({ success: false });

    const payment = await Payment.findOne({ payazaReference: merchant_transaction_id });
    if (!payment) return res.status(404).json({ success: false });

    if (status === 'successful' || status === 'SUCCESSFUL') {
      payment.status = 'successful';
      payment.payazaTransactionId = transaction_id;
      await payment.save();

      if (payment.registrationId) {
        await Registration.findByIdAndUpdate(payment.registrationId, { status: 'enrolled' });
      }

      Promise.allSettled([
        sendPayazaReceipt(payment),
        sendPaymentAdminNotification(payment),
      ]).then(results => {
        if (results[0].status === 'fulfilled') {
          Payment.findByIdAndUpdate(payment._id, { receiptEmailSent: true }).exec();
        }
      });
    } else if (status === 'failed' || status === 'FAILED') {
      payment.status = 'failed';
      await payment.save();
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ success: false });
  }
});

/* ── POST /api/payments/verify-payaza ── */
router.post('/verify-payaza', async (req, res) => {
  try {
    const { reference } = req.body;
    if (!reference) return res.status(400).json({ success: false, message: 'Reference required' });

    const payment = await Payment.findOne({ payazaReference: reference });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    if (payment.status === 'successful') {
      return res.json({ success: true, status: 'successful', payment });
    }

    try {
      const verifyRes = await axios.get(
        `https://api.payaza.africa/live/payaza-account/api/v1/payin/transaction/status/${reference}`,
        { headers: { Authorization: `Payaza ${process.env.PAYAZA_SECRET_KEY}` } }
      );

      const txStatus = verifyRes.data?.data?.status || verifyRes.data?.status;

      if (txStatus === 'successful' || txStatus === 'SUCCESSFUL') {
        payment.status = 'successful';
        payment.payazaTransactionId = verifyRes.data?.data?.transaction_id;
        await payment.save();

        if (payment.registrationId) {
          await Registration.findByIdAndUpdate(payment.registrationId, { status: 'enrolled' });
        }

        if (!payment.receiptEmailSent) {
          Promise.allSettled([
            sendPayazaReceipt(payment),
            sendPaymentAdminNotification(payment),
          ]).then(results => {
            if (results[0].status === 'fulfilled') {
              Payment.findByIdAndUpdate(payment._id, { receiptEmailSent: true }).exec();
            }
          });
        }
      } else {
        payment.status = txStatus === 'failed' || txStatus === 'FAILED' ? 'failed' : payment.status;
        await payment.save();
      }

      return res.json({ success: true, status: payment.status, payment });
    } catch (verifyErr) {
      console.error('Payaza verify error:', verifyErr?.response?.data || verifyErr.message);
      return res.json({ success: true, status: payment.status, payment });
    }
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ── POST /api/payments/bank-transfer ── */
router.post('/bank-transfer', async (req, res) => {
  try {
    const { registrationId, fullName, email, phone, course, transferReference, receiptNote } = req.body;

    if (!fullName || !email || !phone || !course) {
      return res.status(400).json({ success: false, message: 'fullName, email, phone and course are required' });
    }
    if (!transferReference || !transferReference.trim()) {
      return res.status(400).json({ success: false, message: 'Transfer reference is required' });
    }

    const amount = COURSE_PRICES[course];
    if (!amount) return res.status(400).json({ success: false, message: 'Invalid course' });

    const payment = await Payment.create({
      registrationId: registrationId || null,
      fullName, email, phone, course, amount,
      method: 'bank_transfer',
      transferReference: transferReference.trim(),
      receiptNote: receiptNote || '',
      status: 'pending',
      ipAddress: req.ip,
    });

    Promise.allSettled([
      sendBankTransferPending(payment),
      sendPaymentAdminNotification(payment),
    ]);

    res.status(201).json({
      success: true,
      message: 'Bank transfer details submitted. We will verify within 2-4 business hours.',
      paymentId: payment._id,
    });
  } catch (err) {
    console.error('Bank transfer error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

/* ── ADMIN: GET /api/payments ── */
router.get('/', protect, async (req, res) => {
  try {
    const { status, method, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (method) filter.method = method;
    if (search) {
      filter.$or = [
        { fullName: new RegExp(search, 'i') },
        { email:    new RegExp(search, 'i') },
        { course:   new RegExp(search, 'i') },
      ];
    }
    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Payment.countDocuments(filter);
    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('verifiedBy', 'name email');

    res.json({
      success: true,
      data: payments,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ── ADMIN: GET /api/payments/:id ── */
router.get('/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('verifiedBy', 'name email');
    if (!payment) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: payment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ── ADMIN: PATCH /api/payments/:id/verify ── */
router.patch('/:id/verify', protect, async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: 'successful', verifiedBy: req.admin._id, verifiedAt: new Date(), adminNotes: adminNotes || '' },
      { new: true }
    );
    if (!payment) return res.status(404).json({ success: false, message: 'Not found' });

    if (payment.registrationId) {
      await Registration.findByIdAndUpdate(payment.registrationId, { status: 'enrolled' });
    }

    sendBankTransferVerifiedReceipt(payment).catch(console.error);
    res.json({ success: true, data: payment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ── ADMIN: PATCH /api/payments/:id/reject ── */
router.patch('/:id/reject', protect, async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: 'failed', verifiedBy: req.admin._id, verifiedAt: new Date(), adminNotes: adminNotes || '' },
      { new: true }
    );
    if (!payment) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: payment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ── ADMIN: DELETE /api/payments/:id ── */
router.delete('/:id', protect, async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;