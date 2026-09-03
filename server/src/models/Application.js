const mongoose = require('mongoose');

const timelineItemSchema = new mongoose.Schema({
  stage: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['COMPLETED', 'IN_PROGRESS', 'PENDING', 'FAILED', 'REJECTED'],
    default: 'COMPLETED'
  },
  date: { type: Date, default: Date.now },
  remarks: { type: String },
  source: { 
    type: String, 
    enum: ['CITIZEN', 'OFFICER_PORTAL', 'MOCK_GOVERNMENT', 'GOVERNMENT_API', 'SYSTEM'],
    default: 'SYSTEM'
  },
  updatedBy: { type: String, default: 'System Automated Engine' }
}, { _id: false });

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicationNumber: { type: String, required: true, unique: true },
  
  targetType: { type: String, enum: ['Scheme', 'Scholarship', 'PrivateCSR'], default: 'Scheme' },
  schemeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' },
  schemeName: { type: String, default: 'Prime Minister Employment Generation Programme (PMEGP)' },
  scholarshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship' },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  
  applicantName: { type: String, default: 'Sunita Devi' },
  applicantState: { type: String, default: 'Bihar' },
  businessOrCourse: { type: String, default: 'Food processing' },
  requestedAmount: { type: Number, default: 500000 },

  // Authoritative Application Status State
  applicationStatus: {
    type: String,
    enum: [
      'SUBMITTED',
      'DOCUMENT_VERIFICATION',
      'ELIGIBILITY_VERIFICATION',
      'APPROVED',
      'REJECTED',
      'SANCTIONED',
      'RELEASED',
      'PAYMENT_SUCCESS',
      'COMPLETED'
    ],
    default: 'SUBMITTED'
  },
  
  currentStage: { type: String, default: 'Application Submitted' },
  progressPercentage: { type: Number, default: 15 },

  // Audit timeline trail
  timeline: [timelineItemSchema],

  // Financial tracking separation (Application Approved != Fund Sanctioned != Fund Released != Payment Credited)
  financialStatus: {
    sanction: {
      status: { type: String, enum: ['NOT_SANCTIONED', 'SANCTIONED'], default: 'NOT_SANCTIONED' },
      amount: { type: Number, default: 0 },
      referenceId: { type: String },
      date: { type: Date }
    },
    release: {
      status: { type: String, enum: ['NOT_RELEASED', 'RELEASED'], default: 'NOT_RELEASED' },
      amount: { type: Number, default: 0 },
      date: { type: Date }
    },
    payment: {
      status: { type: String, enum: ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
      transactionReference: { type: String },
      date: { type: Date }
    },
    source: { type: String, default: 'MOCK_GOVERNMENT' },
    lastSyncedAt: { type: Date, default: Date.now }
  },

  matchScore: { type: Number, default: 95 },
  aiMatchExplanation: { type: String },
  notes: { type: String },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
