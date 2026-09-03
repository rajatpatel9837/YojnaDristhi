const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Public / Display Name
  legalName: { type: String, required: true }, // Legal Registered Name
  
  organizationType: {
    type: String,
    enum: [
      'PRIVATE_COMPANY',
      'PUBLIC_COMPANY',
      'SECTION_8_COMPANY',
      'REGISTERED_SOCIETY',
      'REGISTERED_TRUST',
      'NGO',
      'CSR_IMPLEMENTING_AGENCY',
      'GOVERNMENT_BODY',
      'GOVERNMENT_RECOGNIZED_INSTITUTION',
      'EDUCATIONAL_INSTITUTION',
      'OTHER'
    ],
    required: true,
    default: 'PRIVATE_COMPANY'
  },

  registrationDetails: {
    registrationNumber: { type: String },
    cin: { type: String },
    pan: { type: String },
    gstin: { type: String },
    ngoDarpanId: { type: String },
    csrRegistrationNumber: { type: String }
  },

  address: {
    addressLine: { type: String },
    city: { type: String },
    district: { type: String },
    state: { type: String },
    country: { type: String, default: 'India' },
    postalCode: { type: String }
  },

  contact: {
    officialEmail: { type: String, required: true },
    phone: { type: String },
    website: { type: String }
  },

  authorizedRepresentative: {
    name: { type: String },
    designation: { type: String },
    email: { type: String },
    phone: { type: String },
    authorizationDocumentUrl: { type: String }
  },

  documents: [{
    documentType: { type: String, required: true },
    documentUrl: { type: String, required: true },
    documentName: { type: String },
    uploadedAt: { type: Date, default: Date.now },
    verificationStatus: { 
      type: String, 
      enum: ['Uploaded', 'Under Review', 'Verified', 'Rejected', 'Requires Info'], 
      default: 'Uploaded' 
    },
    adminNotes: { type: String }
  }],

  governmentRelationship: {
    claimed: { type: Boolean, default: false },
    relationshipType: {
      type: String,
      enum: [
        'NONE',
        'OFFICIAL_GOVERNMENT_BODY',
        'GOVERNMENT_SCHEME_IMPLEMENTER',
        'GOVERNMENT_PARTNER',
        'GOVERNMENT_EMPANELLED',
        'GOVERNMENT_RECOGNIZED',
        'GOVERNMENT_FUNDED',
        'OTHER_GOVERNMENT_RELATIONSHIP'
      ],
      default: 'NONE'
    },
    departmentName: { type: String },
    referenceNumber: { type: String },
    relationshipDescription: { type: String },
    sourceUrl: { type: String },
    supportingDocuments: [{
      documentType: { type: String },
      documentUrl: { type: String },
      documentName: { type: String }
    }]
  },

  verification: {
    status: {
      type: String,
      enum: [
        'PENDING',
        'DOCUMENTS_SUBMITTED',
        'UNDER_REVIEW',
        'VERIFIED_LEGAL_ENTITY',
        'GOVERNMENT_REGISTERED_OR_RECOGNIZED',
        'REQUIRES_MORE_INFORMATION',
        'REJECTED',
        'SUSPENDED'
      ],
      default: 'PENDING'
    },
    submittedAt: { type: Date },
    reviewedAt: { type: Date },
    reviewedBy: { type: String },
    rejectionReason: { type: String },
    adminNotes: { type: String },
    verificationLevel: { type: String, default: 'Unverified' },
    lastUpdatedAt: { type: Date, default: Date.now }
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

organizationSchema.index({ 'verification.status': 1 });
organizationSchema.index({ organizationType: 1 });

module.exports = mongoose.model('Organization', organizationSchema);
