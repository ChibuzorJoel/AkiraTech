const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email:    { type: String, required: true, lowercase: true, trim: true },
  phone:    { type: String, required: true, trim: true },
  course:   { type: String, required: true },
  source:   { type: String, default: 'Not specified' },
  message:  { type: String, default: '' },

  status: {
    type: String,
    enum: ['pending', 'contacted', 'enrolled', 'cancelled'],
    default: 'pending',
  },
  notes:       { type: String, default: '' },
  reviewedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  reviewedAt:  { type: Date },

  emailSent:   { type: Boolean, default: false },
  ipAddress:   { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);