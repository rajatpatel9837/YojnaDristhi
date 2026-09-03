const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  provider: { type: String, required: true },
  providerType: { type: String, enum: ['Government', 'CSR Foundation', 'Private Organization'], default: 'Government' },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  description: { type: String },

  // Criteria
  educationLevels: [{ type: String }],
  courses: [{ type: String }],
  states: [{ type: String }],
  categories: [{ type: String }],
  genderEligibility: { type: String, enum: ['All', 'Female Only', 'Male Only'], default: 'All' },
  minMarksPercentage: { type: Number, default: 50 },
  maxFamilyIncome: { type: Number, default: 0 },
  isSingleGirlChildOnly: { type: Boolean, default: false },

  // Financial & Benefit Details
  amountPerYear: { type: Number, default: 0 },
  benefitDetails: { type: String },

  // Documents & Deadlines
  requiredDocuments: [{ type: String }],
  deadline: { type: Date },
  officialUrl: { type: String, required: true },

  lastVerified: { type: Date, default: Date.now },
  verificationStatus: { type: String, enum: ['VERIFIED', 'REQUIRES_VERIFICATION', 'DEMO'], default: 'VERIFIED' },
  isDemoData: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Scholarship', scholarshipSchema);
