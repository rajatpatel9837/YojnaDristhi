const mongoose = require('mongoose');

const sponsorshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  beneficiaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  beneficiaryCode: { type: String, required: true }, // e.g. YS-BEN-1024
  businessCategory: { type: String },
  story: { type: String },
  targetAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  state: { type: String },
  status: { type: String, enum: ['ACTIVE', 'FULFILLED', 'PAUSED'], default: 'ACTIVE' },
  contributions: [{
    sponsorName: { type: String, default: 'Anonymous Sponsor' },
    amount: { type: Number, required: true },
    isAnonymous: { type: Boolean, default: false },
    transactionId: { type: String },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Sponsorship', sponsorshipSchema);
