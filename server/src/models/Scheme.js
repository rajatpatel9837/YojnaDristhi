const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  provider: { type: String, required: true }, // e.g. Ministry of Micro, Small & Medium Enterprises
  ministry: { type: String },
  department: { type: String },
  sourceType: { type: String, enum: ['Central Government', 'State Government', 'PSB / Bank Scheme', 'MoSJE Program', 'CSR / Private'], default: 'Central Government' },
  description: { type: String },
  category: { type: String }, // Micro Finance, Term Loan, Subsidy, Grant, Credit Support, Working Capital, Equipment Finance, Skill Development

  // Target & Location Eligibility
  targetBeneficiaries: [{ type: String }], // Entrepreneur, SC/ST, Woman, Rural Youth, Artisans
  businessTypes: [{ type: String }],
  sectors: [{ type: String }],
  states: [{ type: String }], // 'All' or specific state names
  areaEligibility: { type: String, enum: ['Both', 'Rural', 'Urban'], default: 'Both' },

  // Demographic Rules
  categories: [{ type: String }], // SC, ST, OBC, EWS, General, All
  genderEligibility: { type: String, enum: ['All', 'Female Only', 'Male Only'], default: 'All' },
  minAge: { type: Number, default: 18 },
  maxAge: { type: Number, default: 65 },

  // Financial Limits
  maxFamilyIncome: { type: Number, default: 0 }, // 0 means no limit
  maxAnnualTurnover: { type: Number, default: 0 },
  maxInvestmentLimit: { type: Number, default: 0 },

  // Business Criteria
  businessStages: [{ type: String }], // Idea, Pre-launch, New business, Existing business, Expansion
  isUdyamRequired: { type: Boolean, default: false },

  // Financial Benefits
  fundingType: { type: String }, // Loan, Subsidy, Grant, Credit Guarantee
  minimumSupport: { type: Number, default: 0 },
  maximumSupport: { type: Number, default: 0 },
  financingPercentage: { type: Number, default: 0 }, // e.g. 90% project cost
  interestRate: { type: Number, default: 0 }, // e.g. 7.5% per annum
  subsidyPercentage: { type: Number, default: 0 }, // e.g. 35% for SC/ST Rural, 15% Urban
  subsidyDetails: { type: String },
  marginMoneyPercentage: { type: Number, default: 5 },
  moratoriumPeriodMonths: { type: Number, default: 6 },
  repaymentPeriodYears: { type: Number, default: 5 },

  // Documents & Guidance
  requiredDocuments: [{ type: String }],
  applicationStart: { type: Date },
  applicationDeadline: { type: Date },

  // Task 2: Auto-Fill Form Mapping Fields
  applicationFormFields: [
    {
      formField: { type: String, required: true },
      sourcePath: { type: String, required: true }, // e.g. "profile.fullName", "digilocker.aadhaar.maskedNumber"
      required: { type: Boolean, default: true }
    }
  ],

  // Task 3: Guided Application Co-Pilot Walkthrough Steps
  applicationWalkthrough: [
    {
      stepNumber: { type: Number, required: true },
      stepTitle: { type: String, required: true },
      instruction: { type: String, required: true },
      screenshotUrl: { type: String },
      fieldsNeeded: [
        {
          fieldLabel: { type: String, required: true },
          sourcePath: { type: String, required: true },
          tip: { type: String }
        }
      ],
      commonPitfall: { type: String },
      isPlaceholderContent: { type: Boolean, default: true }
    }
  ],

  // Official Source & Verification
  officialUrl: { type: String, required: true },
  sourceUrl: { type: String },
  sourceName: { type: String },
  lastVerified: { type: Date, default: Date.now },
  verificationStatus: { type: String, enum: ['VERIFIED', 'REQUIRES_VERIFICATION', 'DEMO'], default: 'VERIFIED' },
  isDemoData: { type: Boolean, default: false },

  extractionConfidence: { type: Number, default: 95 },
}, { timestamps: true });

schemeSchema.index({ category: 1 });
schemeSchema.index({ sourceType: 1 });
schemeSchema.index({ verificationStatus: 1 });

module.exports = mongoose.model('Scheme', schemeSchema);
