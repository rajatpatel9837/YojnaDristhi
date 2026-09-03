const mongoose = require('mongoose');

const verificationAuditLogSchema = new mongoose.Schema({
  entityType: {
    type: String,
    enum: ['ORGANIZATION', 'OPPORTUNITY'],
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  entityName: { type: String },
  action: {
    type: String,
    enum: [
      'SUBMITTED',
      'DOCUMENT_ADDED',
      'STATUS_CHANGED',
      'INFORMATION_REQUESTED',
      'APPROVED',
      'REJECTED',
      'SUSPENDED',
      'ARCHIVED'
    ],
    required: true
  },
  previousStatus: { type: String },
  newStatus: { type: String, required: true },
  performedBy: { type: String, default: 'System Admin' },
  performedByEmail: { type: String },
  notes: { type: String },
  timestamp: { type: Date, default: Date.now }
});

verificationAuditLogSchema.index({ entityId: 1, entityType: 1 });

module.exports = mongoose.model('VerificationAuditLog', verificationAuditLogSchema);
