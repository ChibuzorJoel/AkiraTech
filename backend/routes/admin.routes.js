const express      = require('express');
const Registration = require('../models/Registration.model');
const { protect }  = require('../middleware/auth.middleware');

const router = express.Router();

/* GET /api/admin/stats — dashboard summary */
router.get('/stats', protect, async (req, res) => {
  try {
    const [total, pending, contacted, enrolled, cancelled] = await Promise.all([
      Registration.countDocuments(),
      Registration.countDocuments({ status: 'pending' }),
      Registration.countDocuments({ status: 'contacted' }),
      Registration.countDocuments({ status: 'enrolled' }),
      Registration.countDocuments({ status: 'cancelled' }),
    ]);

    /* Registrations by course */
    const byCourse = await Registration.aggregate([
      { $group: { _id: '$course', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    /* Last 7 days daily counts */
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const daily = await Registration.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      }},
      { $sort: { _id: 1 } },
    ]);

    /* Recent 5 registrations */
    const recent = await Registration.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('fullName email course status createdAt');

    res.json({
      success: true,
      stats: { total, pending, contacted, enrolled, cancelled },
      byCourse,
      daily,
      recent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;