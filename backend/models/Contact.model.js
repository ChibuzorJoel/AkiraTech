const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, lowercase: true, trim: true },
  phone:     { type: String, required: true, trim: true },
  service:   { type: String, required: true },
  budget:    { type: String, default: 'Not specified' },
  message:   { type: String, required: true },

  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'closed'],
    default: 'new',
  },
  notes:      { type: String, default: '' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  reviewedAt: { type: Date },

  emailSent: { type: Boolean, default: false },
  ipAddress: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);