const EntrepreneurProfile = require('../models/EntrepreneurProfile');

const getDemoProfile = (req, res) => {
  const demoData = {
    fullName: 'Sunita Devi',
    age: 28,
    gender: 'Female',
    state: 'Bihar',
    district: 'Patna',
    city: 'Patna',
    pincode: '800001',
    areaType: 'Rural',
    businessName: 'Sunita Food Products & Dairy',
    businessType: 'Proprietary',
    sector: 'Food processing',
    stage: 'Existing business',
    yearsInOperation: 2,
    annualTurnover: 400000,
    employeesCount: 3,
    investmentAmount: 150000,
    udyamStatus: 'Registered',
    familyIncome: 250000,
    existingLoans: false,
    existingEMI: 0,
    ownContribution: 50000,
    hasIncomeCertificate: true,
    category: 'SC',
    isWomanEntrepreneur: true,
    isMinority: false,
    isPwD: false,
    isFirstGeneration: true,
    isRuralEntrepreneur: true,
    fundingType: ['Loan', 'Subsidy', 'Equipment'],
    fundingAmount: 500000,
    fundingPurpose: 'Machinery procurement and dairy processing expansion',
    documentsAvailable: [
      'Income Certificate',
      'Category Certificate',
      'Business Registration',
      'Aadhaar/Identity',
      'Udyam Certificate'
    ]
  };

  res.json({ success: true, data: demoData, isDemo: true });
};

const saveProfile = async (req, res) => {
  try {
    const profileData = req.body;
    let userId = req.user ? req.user.id : null;

    let profile;
    if (userId) {
      profile = await EntrepreneurProfile.findOneAndUpdate(
        { userId },
        { ...profileData, userId, updatedAt: Date.now() },
        { new: true, upsert: true }
      );
    } else {
      profile = profileData;
    }

    res.json({ success: true, data: profile, message: 'Profile saved successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await EntrepreneurProfile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDemoProfile, saveProfile, getProfile };
