const mongoose = require('mongoose');

const entrepreneurProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // 1. Personal
  fullName: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Transgender', 'Other'] },
  state: { type: String },
  district: { type: String },
  city: { type: String },
  pincode: { type: String },
  areaType: { type: String, enum: ['Rural', 'Urban'] },
  
  // 2. Business
  businessName: { type: String },
  businessType: { type: String }, // Proprietary, Partnership, Self Employed, Individual
  sector: { type: String }, // Manufacturing, Services, Retail, Dairy, Agriculture allied, Food processing, Textiles, Transport, Technology, Trading
  stage: { type: String, enum: ['Idea', 'Pre-launch', 'New business', 'Existing business', 'Expansion', 'Established'] },
  yearsInOperation: { type: Number, default: 0 },
  annualTurnover: { type: Number, default: 0 },
  employeesCount: { type: Number, default: 0 },
  investmentAmount: { type: Number, default: 0 },
  udyamStatus: { type: String, enum: ['Registered', 'Not Registered', 'Applied'] },

  // 3. Financial
  familyIncome: { type: Number, default: 0 },
  existingLoans: { type: Boolean, default: false },
  existingEMI: { type: Number, default: 0 },
  ownContribution: { type: Number, default: 0 },
  hasIncomeCertificate: { type: Boolean, default: false },

  // 4. Social & Eligibility
  category: { type: String, enum: ['SC', 'ST', 'OBC', 'EWS', 'General'] },
  isWomanEntrepreneur: { type: Boolean, default: false },
  isMinority: { type: Boolean, default: false },
  isPwD: { type: Boolean, default: false },
  isFirstGeneration: { type: Boolean, default: false },
  isRuralEntrepreneur: { type: Boolean, default: false },

  // 5. Funding Requirements
  fundingType: [{ type: String }], // Loan, Subsidy, Grant, Working capital, Equipment, Skill development
  fundingAmount: { type: Number, default: 0 },
  fundingPurpose: { type: String },

  // 6. Documents Available
  documentsAvailable: [{ type: String }], // 'Income Certificate', 'Category Certificate', 'Business Registration', 'Project Report', 'Udyam Certificate', 'Aadhaar/Identity', 'Bank Statement'

  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EntrepreneurProfile', entrepreneurProfileSchema);
