const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  applicationNumber: { type: String },
  event: { type: String, required: true },
  oldStatus: { type: String },
  newStatus: { type: String },
  amount: { type: Number },
  source: { type: String, enum: ['CITIZEN', 'OFFICER_PORTAL', 'MOCK_GOVERNMENT', 'GOVERNMENT_API', 'SYSTEM'], default: 'SYSTEM' },
  changedBy: { type: String, default: 'System' },
  userName: { type: String, default: 'System' },
  userRole: { type: String, default: 'SYSTEM' },
  action: { type: String },
  resource: { type: String },
  details: { type: String },
  ipAddress: { type: String, default: '127.0.0.1' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
