const Organization = require('../models/Organization');
const Opportunity = require('../models/Opportunity');
const VerificationAuditLog = require('../models/VerificationAuditLog');

/**
 * Get Organization Verification Queue
 */
const getOrganizationQueue = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status && status !== 'ALL') {
      filter['verification.status'] = status;
    }

    const organizations = await Organization.find(filter).sort({ updatedAt: -1 });

    const summaryStats = {
      total: await Organization.countDocuments({}),
      pending: await Organization.countDocuments({ 'verification.status': { $in: ['PENDING', 'DOCUMENTS_SUBMITTED', 'UNDER_REVIEW'] } }),
      verifiedLegal: await Organization.countDocuments({ 'verification.status': 'VERIFIED_LEGAL_ENTITY' }),
      govtRecognized: await Organization.countDocuments({ 'verification.status': 'GOVERNMENT_REGISTERED_OR_RECOGNIZED' }),
      rejected: await Organization.countDocuments({ 'verification.status': 'REJECTED' })
    };

    res.json({
      success: true,
      stats: summaryStats,
      count: organizations.length,
      data: organizations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Single Organization Details with Audit Logs
 */
const getOrganizationDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const org = await Organization.findById(id);

    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found.' });
    }

    const auditLogs = await VerificationAuditLog.find({ entityId: org._id, entityType: 'ORGANIZATION' }).sort({ timestamp: -1 });

    res.json({
      success: true,
      data: org,
      auditLogs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Organization Verification Decision
 */
const updateOrganizationVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, notes, rejectionReason } = req.body;

    const org = await Organization.findById(id);
    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found.' });
    }

    const prevStatus = org.verification.status;
    let newStatus = prevStatus;
    let level = 'Unverified';

    switch (action) {
      case 'APPROVE_LEGAL_ENTITY':
        newStatus = 'VERIFIED_LEGAL_ENTITY';
        level = 'Verified Legal Entity';
        break;
      case 'APPROVE_GOVERNMENT_RECOGNIZED':
        newStatus = 'GOVERNMENT_REGISTERED_OR_RECOGNIZED';
        level = 'Government Registered / Recognized';
        break;
      case 'REQUEST_INFORMATION':
        newStatus = 'REQUIRES_MORE_INFORMATION';
        level = 'Action Required';
        break;
      case 'REJECT':
        newStatus = 'REJECTED';
        level = 'Rejected';
        break;
      case 'SUSPEND':
        newStatus = 'SUSPENDED';
        level = 'Suspended';
        break;
      case 'SET_UNDER_REVIEW':
        newStatus = 'UNDER_REVIEW';
        level = 'Under Review';
        break;
      default:
        return res.status(400).json({ success: false, message: `Invalid action '${action}'.` });
    }

    org.verification.status = newStatus;
    org.verification.verificationLevel = level;
    org.verification.reviewedAt = new Date();
    org.verification.reviewedBy = req.user?.name || 'Lead Admin Reviewer';
    org.verification.adminNotes = notes || org.verification.adminNotes;
    if (rejectionReason) org.verification.rejectionReason = rejectionReason;

    await org.save();

    // Record Audit Trail
    const auditLog = await VerificationAuditLog.create({
      entityType: 'ORGANIZATION',
      entityId: org._id,
      entityName: org.legalName,
      action: action.includes('APPROVE') ? 'APPROVED' : action.includes('REJECT') ? 'REJECTED' : 'STATUS_CHANGED',
      previousStatus: prevStatus,
      newStatus,
      performedBy: req.user?.name || 'Lead Verification Admin',
      performedByEmail: req.user?.email || 'admin@yojnasetu.in',
      notes: notes || `Verification status updated to ${newStatus}`
    });

    res.json({
      success: true,
      message: `Organization verification status updated to ${newStatus}.`,
      data: org,
      auditLog
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Opportunity Verification Queue
 */
const getOpportunityQueue = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status && status !== 'ALL') {
      filter['verification.status'] = status;
    }

    const opportunities = await Opportunity.find(filter).populate('providerOrganizationId').sort({ updatedAt: -1 });

    const stats = {
      total: await Opportunity.countDocuments({}),
      submitted: await Opportunity.countDocuments({ 'verification.status': 'SUBMITTED_FOR_REVIEW' }),
      officialGovt: await Opportunity.countDocuments({ 'verification.status': 'OFFICIAL_GOVERNMENT_SCHEME' }),
      verifiedPrivateCsr: await Opportunity.countDocuments({ 'verification.status': 'VERIFIED_PRIVATE_OR_CSR_OPPORTUNITY' }),
      requiresReview: await Opportunity.countDocuments({ 'verification.status': 'SOURCE_REQUIRES_REVIEW' })
    };

    res.json({
      success: true,
      stats,
      count: opportunities.length,
      data: opportunities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Opportunity Verification Decision
 */
const updateOpportunityVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, rejectionReason } = req.body;

    const allowedStatuses = [
      'OFFICIAL_GOVERNMENT_SCHEME',
      'GOVERNMENT_PARTNERED_OPPORTUNITY',
      'VERIFIED_PRIVATE_OR_CSR_OPPORTUNITY',
      'SOURCE_REQUIRES_REVIEW',
      'UNVERIFIED',
      'REJECTED',
      'ARCHIVED'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid opportunity verification status '${status}'.` });
    }

    const opp = await Opportunity.findById(id);
    if (!opp) {
      return res.status(404).json({ success: false, message: 'Opportunity not found.' });
    }

    const prevStatus = opp.verification.status;
    opp.verification.status = status;
    opp.verification.reviewedAt = new Date();
    opp.verification.reviewedBy = req.user?.name || 'Lead Admin Reviewer';
    if (notes) opp.verification.adminNotes = notes;
    if (rejectionReason) opp.verification.rejectionReason = rejectionReason;

    await opp.save();

    // Record Audit Trail
    const auditLog = await VerificationAuditLog.create({
      entityType: 'OPPORTUNITY',
      entityId: opp._id,
      entityName: opp.title,
      action: status.includes('OFFICIAL') || status.includes('VERIFIED') ? 'APPROVED' : status === 'REJECTED' ? 'REJECTED' : 'STATUS_CHANGED',
      previousStatus: prevStatus,
      newStatus: status,
      performedBy: req.user?.name || 'Lead Verification Admin',
      performedByEmail: req.user?.email || 'admin@yojnasetu.in',
      notes: notes || `Opportunity verification status set to ${status}`
    });

    res.json({
      success: true,
      message: `Opportunity verification status updated to ${status}.`,
      data: opp,
      auditLog
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getOrganizationQueue,
  getOrganizationDetails,
  updateOrganizationVerification,
  getOpportunityQueue,
  updateOpportunityVerification
};
