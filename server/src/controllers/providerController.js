const Organization = require('../models/Organization');
const Scholarship = require('../models/Scholarship');
const Application = require('../models/Application');
const EntrepreneurProfile = require('../models/EntrepreneurProfile');
const { mockOrganization } = require('../seed/seedData');

const getOrganizationProfile = async (req, res) => {
  try {
    let org;
    if (req.user && req.user.organizationId) {
      org = await Organization.findById(req.user.organizationId);
    }
    if (!org) {
      org = mockOrganization;
    }
    res.json({ success: true, data: org });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrganization = async (req, res) => {
  try {
    const data = req.body;
    let org;
    if (req.user && req.user.organizationId) {
      org = await Organization.findByIdAndUpdate(req.user.organizationId, data, { new: true });
    } else {
      org = await Organization.create({ ...data, verificationStatus: 'PENDING' });
    }
    res.json({ success: true, data: org, message: 'Organization updated. Pending admin verification.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPrivateOpportunity = async (req, res) => {
  try {
    const data = req.body;
    const slug = (data.title || 'csr-opportunity').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    
    const opportunity = await Scholarship.create({
      ...data,
      slug,
      providerType: 'CSR Foundation',
      organizationId: req.user ? req.user.organizationId : null,
      verificationStatus: 'VERIFIED',
      isDemoData: false
    });

    res.status(201).json({ success: true, data: opportunity, message: 'Opportunity published successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCandidateMatches = async (req, res) => {
  try {
    const { opportunityId } = req.params;

    // Fetch sample/seed beneficiaries
    const profiles = await EntrepreneurProfile.find({}).limit(10);
    
    const sampleCandidates = profiles.length > 0 ? profiles : [
      {
        _id: 'cand_101',
        fullName: 'Sunita Devi',
        state: 'Bihar',
        district: 'Patna',
        sector: 'Food processing',
        category: 'SC',
        isWomanEntrepreneur: true,
        fundingAmount: 500000,
        annualTurnover: 400000,
        udyamStatus: 'Registered',
        documentsAvailable: ['Income Certificate', 'Category Certificate', 'Business Registration']
      },
      {
        _id: 'cand_102',
        fullName: 'Rameshwar Mahato',
        state: 'Jharkhand',
        district: 'Ranchi',
        sector: 'Handicrafts & Textiles',
        category: 'ST',
        isWomanEntrepreneur: false,
        fundingAmount: 300000,
        annualTurnover: 200000,
        udyamStatus: 'Registered',
        documentsAvailable: ['Category Certificate', 'Business Registration']
      },
      {
        _id: 'cand_103',
        fullName: 'Pooja Rani',
        state: 'Punjab',
        district: 'Ludhiana',
        sector: 'Services',
        category: 'OBC',
        isWomanEntrepreneur: true,
        fundingAmount: 250000,
        annualTurnover: 350000,
        udyamStatus: 'Registered',
        documentsAvailable: ['Income Certificate', 'Business Registration']
      }
    ];

    const rankedCandidates = sampleCandidates.map((c, index) => {
      const matchScore = 96 - (index * 5);
      return {
        candidateId: c._id,
        anonymizedCode: `YS-CAND-${1000 + index}`,
        fullName: c.fullName,
        state: c.state,
        sector: c.sector,
        category: c.category,
        fundingAmount: c.fundingAmount,
        matchScore,
        explainability: {
          educationOrSectorFit: '100% Sector Relevance',
          financialNeedFit: '94% Documented Income Need',
          locationMatch: '100% Preferred Focus Geography',
          eligibilityStatus: 'Potentially Eligible',
          readiness: '85% Document Checklist Ready'
        },
        whyMatches: [
          `Targeted Sector (${c.sector}) matches campaign criteria.`,
          `High impact potential in rural location (${c.state}).`,
          `Verified Udyam business registration.`
        ]
      };
    });

    res.json({ success: true, count: rankedCandidates.length, data: rankedCandidates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProviderDashboardMetrics = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        totalFundingDeployed: 3240000, // ₹32.4 Lakh
        activeBeneficiaries: 64,
        activeProgramsCount: 8,
        totalApplicationsReceived: 312,
        pendingVerifications: 14
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOrganizationProfile,
  updateOrganization,
  createPrivateOpportunity,
  getCandidateMatches,
  getProviderDashboardMetrics
};
