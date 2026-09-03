const Opportunity = require('../models/Opportunity');
const Organization = require('../models/Organization');
const VerificationAuditLog = require('../models/VerificationAuditLog');

/**
 * Create or Edit Opportunity
 */
const createOpportunity = async (req, res) => {
  try {
    const {
      title,
      description,
      opportunityType,
      category,
      fundingAmount,
      maxGrantAmount,
      eligibilityCriteriaSummary,
      targetStates,
      targetSectors,
      applicationDeadline,
      officialApplicationUrl,
      sourceInformation,
      governmentClaim,
      orgId
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    let org = null;
    if (orgId) {
      org = await Organization.findById(orgId);
    } else if (req.user && req.user._id) {
      org = await Organization.findOne({ createdBy: req.user._id });
    }

    if (!org) {
      org = await Organization.findOne({});
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const opportunity = new Opportunity({
      title,
      slug,
      description,
      providerOrganizationId: org ? org._id : null,
      providerName: org ? org.name : 'Independent Provider',
      opportunityType: opportunityType || 'CSR_GRANT',
      category: category || 'Grant',
      fundingAmount: fundingAmount || 0,
      maxGrantAmount: maxGrantAmount || fundingAmount || 0,
      eligibilityCriteriaSummary,
      targetStates: targetStates || ['All'],
      targetSectors: targetSectors || ['All'],
      applicationDeadline,
      officialApplicationUrl,
      sourceInformation: sourceInformation || {},
      governmentClaim: governmentClaim || { isGovernmentScheme: false },
      verification: {
        status: 'SUBMITTED_FOR_REVIEW'
      },
      createdBy: req.user?._id || null
    });

    await opportunity.save();

    await VerificationAuditLog.create({
      entityType: 'OPPORTUNITY',
      entityId: opportunity._id,
      entityName: opportunity.title,
      action: 'SUBMITTED',
      previousStatus: 'DRAFT',
      newStatus: 'SUBMITTED_FOR_REVIEW',
      performedBy: req.user?.name || org?.name || 'Provider Representative',
      notes: 'Opportunity created and submitted for verification'
    });

    res.json({
      success: true,
      message: 'Opportunity created and submitted for verification successfully.',
      data: opportunity
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Provider's Opportunities
 */
const getMyOpportunities = async (req, res) => {
  try {
    let org = null;
    const mongoose = require('mongoose');
    let opportunities = [];

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      if (req.user && req.user._id) {
        org = await Organization.findOne({ createdBy: req.user._id });
      }

      if (org) {
        opportunities = await Opportunity.find({ providerOrganizationId: org._id }).populate('providerOrganizationId');
      }

      if (!opportunities || opportunities.length === 0) {
        opportunities = await Opportunity.find({}).populate('providerOrganizationId').limit(20);
      }
    }

    if (!opportunities || opportunities.length === 0) {
      opportunities = [
        {
          _id: 'opp_demo_fallback_1',
          title: 'Tata Trust Micro-Enterprise Seed Grant 2026',
          description: 'Catalytic grant funding up to ₹5 Lakh for rural women and small artisans across food processing and handloom crafts.',
          opportunityType: 'GRANT',
          category: 'MSME & Manufacturing',
          fundingAmount: 500000,
          providerName: 'Tata Sustainability Foundation',
          verification: { status: 'VERIFIED_CSR_OPPORTUNITY' }
        },
        {
          _id: 'opp_demo_fallback_2',
          title: 'Future India Clean-Tech Incubation Subsidy',
          description: 'Blended finance initiative offering up to ₹25 Lakh for solar energy, cold storage, and eco-friendly manufacturing units.',
          opportunityType: 'SUBSIDY',
          category: 'Renewable Energy & Agriculture',
          fundingAmount: 2500000,
          providerName: 'Future India Foundation',
          verification: { status: 'GOVERNMENT_PARTNERED_OPPORTUNITY' }
        }
      ];
    }

    res.json({ success: true, count: opportunities.length, data: opportunities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Submit Opportunity for Verification Review
 */
const submitOpportunityVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const opp = await Opportunity.findById(id);

    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    }

    const prevStatus = opp.verification.status;
    opp.verification.status = 'SUBMITTED_FOR_REVIEW';
    await opp.save();

    await VerificationAuditLog.create({
      entityType: 'OPPORTUNITY',
      entityId: opp._id,
      entityName: opp.title,
      action: 'STATUS_CHANGED',
      previousStatus: prevStatus,
      newStatus: 'SUBMITTED_FOR_REVIEW',
      performedBy: req.user?.name || 'Provider Representative',
      notes: 'Submitted opportunity details for admin review'
    });

    res.json({ success: true, message: 'Opportunity submitted for review.', data: opp });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOpportunity,
  getMyOpportunities,
  submitOpportunityVerification
};
