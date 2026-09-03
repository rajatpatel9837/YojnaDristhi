const mongoose = require('mongoose');

const schemeSourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  authority: { type: String, required: true },
  sourceType: { type: String, enum: ['Official Notification', 'Official Website', 'Ministry PDF', 'PSB / Financial Institution', 'CSR Organization'], default: 'Official Website' },
  priority: { type: Number, default: 1 },
  lastCrawled: { type: Date, default: Date.now },
  status: { type: String, enum: ['ACTIVE', 'NEEDS_REVIEW', 'UNAVAILABLE'], default: 'ACTIVE' },
  contentHash: { type: String },
  extractedChangesCount: { type: Number, default: 0 },
  isSimulatedDemo: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SchemeSource', schemeSourceSchema);
