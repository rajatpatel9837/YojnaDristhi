const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: { type: String },
  age: { type: Number },
  gender: { type: String },
  state: { type: String },
  district: { type: String },
  
  educationLevel: { type: String }, // High School, Higher Secondary, Undergraduate, Postgraduate, Doctorate, Vocational
  courseName: { type: String },
  academicYear: { type: String }, // 1st Year, 2nd Year, 3rd Year, Final Year
  marksPercentage: { type: Number, default: 0 },
  institutionName: { type: String },
  
  category: { type: String }, // SC, ST, OBC, EWS, General
  familyIncome: { type: Number, default: 0 },
  isSingleGirlChild: { type: Boolean, default: false },
  isPwD: { type: Boolean, default: false },

  documentsAvailable: [{ type: String }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
