const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  providerOrganizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  providerName: { type: String, required: true },
  
  opportunityType: {
    type: String,
    enum: ['GOVERNMENT_SCHEME', 'CSR_GRANT', 'PRIVATE_SCHOLARSHIP', 'INCUBATION_FUNDING', 'OTHER'],
    default: 'CSR_GRANT'
  },

  category: { type: String, default: 'Grant' },
  fundingAmount: { type: Number, default: 0 },
  maxGrantAmount: { type: Number, default: 0 },
  eligibilityCriteriaSummary: { type: String },
  targetStates: [{ type: String }],
  targetSectors: [{ type: String }],
  applicationDeadline: { type: Date },
  officialApplicationUrl: { type: String },

  sourceInformation: {
    officialSourceName: { type: String },
    sourceUrl: { type: String },
    sourceDocumentUrl: { type: String },
    lastVerifiedAt: { type: Date, default: Date.now }
  },

  governmentClaim: {
    isGovernmentScheme: { type: Boolean, default: false },
    governmentDepartment: { type: String },
    governmentRelationshipType: { type: String, default: 'NONE' },
    supportingEvidence: [{
      documentType: { type: String },
      documentUrl: { type: String },
      documentName: { type: String }
    }]
  },

  verification: {
    status: {
      type: String,
      enum: [
        'DRAFT',
        'SUBMITTED_FOR_REVIEW',
        'OFFICIAL_GOVERNMENT_SCHEME',
        'GOVERNMENT_PARTNERED_OPPORTUNITY',
        'VERIFIED_PRIVATE_OR_CSR_OPPORTUNITY',
        'SOURCE_REQUIRES_REVIEW',
        'UNVERIFIED',
        'REJECTED',
        'ARCHIVED'
      ],
      default: 'UNVERIFIED'
    },
    reviewedBy: { type: String },
    reviewedAt: { type: Date },
    adminNotes: { type: String },
    rejectionReason: { type: String }
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

opportunitySchema.index({ 'verification.status': 1 });
opportunitySchema.index({ providerOrganizationId: 1 });

module.exports = mongoose.model('Opportunity', opportunitySchema);
