const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['BENEFICIARY', 'PROVIDER', 'SPONSOR', 'ADMIN'],
    default: 'BENEFICIARY'
  },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  state: { type: String },
  district: { type: String },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
