const mongoose = require('mongoose');

/**
 * Lightweight registration captured from the Contact page's
 * "Register" modal — kept separate from the main Registration
 * model (used by /register) since admins want to track these
 * as a distinct funnel.
 */
const quickRegistrationSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email:    { type: String, required: true, lowercase: true, trim: true },
  phone:    { type: String, required: true, trim: true },
  source:   { type: String, default: 'Not specified' },
  message:  { type: String, default: '' },
  sourcePage: { type: String, default: 'Contact Page' },

  status: {
    type: String,
    enum: ['pending', 'contacted', 'converted', 'cancelled'],
    default: 'pending',
  },
  notes:      { type: String, default: '' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  reviewedAt: { type: Date },

  emailSent: { type: Boolean, default: false },
  ipAddress: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('QuickRegistration', quickRegistrationSchema);