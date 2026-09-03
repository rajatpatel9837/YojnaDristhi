const mongoose = require('mongoose');

const channelPartnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  partnerType: { type: String, enum: ['State Channelizing Agency', 'Public Sector Bank', 'Regional Rural Bank', 'NBFC-MFI', 'Authorized Partner'], required: true },
  branchName: { type: String },
  address: { type: String },
  state: { type: String },
  district: { type: String },
  city: { type: String },
  pincode: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },

  supportedSchemeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scheme' }],
  supportedSchemeSlugs: [{ type: String }],
  supportedLoanTypes: [{ type: String }],

  contactPhone: { type: String },
  contactEmail: { type: String },
  workingHours: { type: String, default: '10:00 AM - 4:00 PM (Mon-Sat)' },

  routingStatus: { type: String, enum: ['RECOMMENDED', 'VERIFY', 'NEARBY'], default: 'RECOMMENDED' },
  verificationStatus: { type: String, enum: ['VERIFIED', 'DEMO'], default: 'VERIFIED' },
  isDemoData: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ChannelPartner', channelPartnerSchema);
