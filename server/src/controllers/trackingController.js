const mongoose = require('mongoose');
const Application = require('../models/Application');
const AuditLog = require('../models/AuditLog');
const { validateStatusTransition, getStageMeta } = require('../utils/statusStateMachine');
const { defaultProvider, StatusProcessor } = require('../services/government');

// In-Memory fallback store for demo applications (ensures 100% demo stability even if MongoDB is not running locally)
const IN_MEMORY_DEMO_APPLICATIONS = [
  {
    _id: 'demo_app_001_id',
    applicationNumber: 'APP-DEMO-001',
    applicantName: 'Sunita Devi',
    applicantState: 'Bihar',
    businessOrCourse: 'Food processing (Sunita Food Products)',
    requestedAmount: 500000,
    applicationStatus: 'APPROVED',
    currentStage: 'Application Approved',
    progressPercentage: 60,
    schemeName: 'Prime Minister Employment Generation Programme (PMEGP)',
    timeline: [
      { stage: 'Application Submitted', status: 'COMPLETED', date: new Date('2026-08-10'), remarks: 'Online application submitted via Yojna दृष्टि Portal', source: 'CITIZEN', updatedBy: 'Citizen' },
      { stage: 'Documents Verification', status: 'COMPLETED', date: new Date('2026-08-12'), remarks: 'Aadhaar & Income Certificate verified by Tehsildar', source: 'OFFICER_PORTAL', updatedBy: 'Verification Officer' },
      { stage: 'Eligibility Verification', status: 'COMPLETED', date: new Date('2026-08-15'), remarks: 'SC Category & 35% Subsidy criteria validated', source: 'OFFICER_PORTAL', updatedBy: 'Verification Officer' },
      { stage: 'Application Approved', status: 'COMPLETED', date: new Date('2026-08-18'), remarks: 'Recommended for Bank sanction allocation', source: 'OFFICER_PORTAL', updatedBy: 'State Nodal Committee' }
    ],
    financialStatus: {
      sanction: { status: 'NOT_SANCTIONED', amount: 0, referenceId: null, date: null },
      release: { status: 'NOT_RELEASED', amount: 0, date: null },
      payment: { status: 'PENDING', transactionReference: null, date: null },
      source: 'MOCK_GOVERNMENT',
      providerType: 'DEMO_PFMS_SANDBOX',
      lastSyncedAt: new Date()
    },
    updatedAt: new Date('2026-08-18')
  },
  {
    _id: 'demo_app_002_id',
    applicationNumber: 'APP-DEMO-002',
    applicantName: 'Sunita Devi',
    applicantState: 'Bihar',
    businessOrCourse: 'Food processing (Sunita Food Products)',
    requestedAmount: 50000,
    applicationStatus: 'SANCTIONED',
    currentStage: 'Fund Sanctioned',
    progressPercentage: 75,
    schemeName: 'Pradhan Mantri MUDRA Yojana (Tarun Category)',
    timeline: [
      { stage: 'Application Submitted', status: 'COMPLETED', date: new Date('2026-08-01'), remarks: 'Online application submitted via Yojna दृष्टि Portal', source: 'CITIZEN', updatedBy: 'Citizen' },
      { stage: 'Documents Verification', status: 'COMPLETED', date: new Date('2026-08-05'), remarks: 'Business registration verified', source: 'OFFICER_PORTAL', updatedBy: 'Verification Officer' },
      { stage: 'Eligibility Verification', status: 'COMPLETED', date: new Date('2026-08-10'), remarks: 'Micro-enterprise criteria approved', source: 'OFFICER_PORTAL', updatedBy: 'Verification Officer' },
      { stage: 'Application Approved', status: 'COMPLETED', date: new Date('2026-08-15'), remarks: 'Approved by Nodal Bank', source: 'OFFICER_PORTAL', updatedBy: 'Nodal Officer' },
      { stage: 'Fund Sanctioned', status: 'COMPLETED', date: new Date('2026-08-20'), remarks: 'Sanction letter generated Ref: SAN-98765', source: 'MOCK_GOVERNMENT', updatedBy: 'Ministry Nodal Treasury' }
    ],
    financialStatus: {
      sanction: { status: 'SANCTIONED', amount: 50000, referenceId: 'SAN-98765', date: new Date('2026-08-20') },
      release: { status: 'RELEASE_PENDING', amount: 0, date: null },
      payment: { status: 'PENDING', transactionReference: null, date: null },
      source: 'MOCK_GOVERNMENT',
      providerType: 'DEMO_PFMS_SANDBOX',
      lastSyncedAt: new Date()
    },
    updatedAt: new Date('2026-08-20')
  },
  {
    _id: 'demo_app_003_id',
    applicationNumber: 'APP-DEMO-003',
    applicantName: 'Sunita Devi',
    applicantState: 'Bihar',
    businessOrCourse: 'Food processing (Sunita Food Products)',
    requestedAmount: 75000,
    applicationStatus: 'PAYMENT_SUCCESS',
    currentStage: 'Payment/Credit Successful',
    progressPercentage: 95,
    schemeName: 'Special Credit Linked Capital Subsidy Scheme (SCLCSS)',
    timeline: [
      { stage: 'Application Submitted', status: 'COMPLETED', date: new Date('2026-07-15'), remarks: 'Submitted to National SC-ST Hub via Yojna दृष्टि', source: 'CITIZEN', updatedBy: 'Citizen' },
      { stage: 'Documents Verification', status: 'COMPLETED', date: new Date('2026-07-20'), remarks: 'Caste & Udyam certificate verified', source: 'OFFICER_PORTAL', updatedBy: 'Verification Officer' },
      { stage: 'Eligibility Verification', status: 'COMPLETED', date: new Date('2026-07-25'), remarks: '25% Machinery subsidy verified', source: 'OFFICER_PORTAL', updatedBy: 'Verification Officer' },
      { stage: 'Application Approved', status: 'COMPLETED', date: new Date('2026-08-01'), remarks: 'Approved by Ministry of MSME', source: 'OFFICER_PORTAL', updatedBy: 'Ministry Committee' },
      { stage: 'Fund Sanctioned', status: 'COMPLETED', date: new Date('2026-08-15'), remarks: 'Sanctioned Ref: SAN-48291', source: 'MOCK_GOVERNMENT', updatedBy: 'Treasury Officer' },
      { stage: 'Fund Released', status: 'COMPLETED', date: new Date('2026-08-22'), remarks: 'Released from Nodal Treasury', source: 'MOCK_GOVERNMENT', updatedBy: 'PFMS Disbursal Engine' },
      { stage: 'Payment/Credit Successful', status: 'COMPLETED', date: new Date('2026-08-26'), remarks: 'Credit settled Ref: TXN****7821', source: 'MOCK_GOVERNMENT', updatedBy: 'RBI Gateway' }
    ],
    financialStatus: {
      sanction: { status: 'SANCTIONED', amount: 75000, referenceId: 'SAN-48291', date: new Date('2026-08-15') },
      release: { status: 'RELEASED', amount: 75000, date: new Date('2026-08-22') },
      payment: { status: 'PAYMENT_SUCCESS', transactionReference: 'TXN****7821', date: new Date('2026-08-26') },
      source: 'MOCK_GOVERNMENT',
      providerType: 'DEMO_PFMS_SANDBOX',
      lastSyncedAt: new Date()
    },
    updatedAt: new Date('2026-08-26')
  }
];

const findAppByIdOrNumber = async (id) => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      let doc = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        doc = await Application.findOne({ $or: [{ _id: id }, { applicationNumber: id }] });
      } else {
        doc = await Application.findOne({ applicationNumber: id });
      }
      if (doc) return doc;
    }
  } catch (err) {
    console.warn('DB query in findAppByIdOrNumber fell back to memory store:', err.message);
  }

  // Memory fallback lookup
  return IN_MEMORY_DEMO_APPLICATIONS.find(a => a._id === id || a.applicationNumber === id);
};

/**
 * Get All Applications for Current User (or Seed Demo Applications)
 */
const getUserApplications = async (req, res) => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      let applications = await Application.find({}).sort({ updatedAt: -1 });

      if (!applications || applications.length === 0) {
        await seedDemoApplications();
        applications = await Application.find({}).sort({ updatedAt: -1 });
      }

      if (applications && applications.length > 0) {
        return res.json({ success: true, count: applications.length, data: applications });
      }
    }
  } catch (error) {
    console.warn('DB fetch in getUserApplications falling back to memory store:', error.message);
  }

  // Fallback to in-memory store
  res.json({ success: true, count: IN_MEMORY_DEMO_APPLICATIONS.length, data: IN_MEMORY_DEMO_APPLICATIONS });
};

/**
 * Get Single Application Progress
 */
const getApplicationProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const app = await findAppByIdOrNumber(id);
    
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const meta = getStageMeta(app.applicationStatus);

    res.json({
      success: true,
      data: {
        applicationId: app._id,
        applicationNumber: app.applicationNumber,
        schemeName: app.schemeName,
        applicantName: app.applicantName,
        currentStatus: app.applicationStatus,
        currentStage: meta.stageName,
        progressPercentage: meta.progressPercentage,
        timeline: app.timeline || [],
        lastUpdated: app.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Financial Tracking Status
 */
const getApplicationFinancialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const app = await findAppByIdOrNumber(id);
    
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({
      success: true,
      data: {
        applicationId: app._id,
        applicationNumber: app.applicationNumber,
        schemeName: app.schemeName,
        requestedAmount: app.requestedAmount,
        financialStatus: app.financialStatus || {
          sanction: { status: 'NOT_SANCTIONED', amount: 0 },
          release: { status: 'NOT_RELEASED', amount: 0 },
          payment: { status: 'PENDING' },
          source: 'MOCK_GOVERNMENT',
          providerType: 'DEMO_PFMS_SANDBOX',
          lastSyncedAt: new Date()
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Single Application Timeline Audit Trail
 */
const getApplicationTimeline = async (req, res) => {
  try {
    const { id } = req.params;
    const app = await findAppByIdOrNumber(id);
    
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({
      success: true,
      data: {
        applicationId: app._id,
        applicationNumber: app.applicationNumber,
        timeline: app.timeline || []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Application Status (Officer Role API with State Machine Validation)
 */
const updateOfficerApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetStatus, remarks, officerName } = req.body;

    const app = await findAppByIdOrNumber(id);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const oldStatus = app.applicationStatus;

    // Enforce Authoritative State Machine Validation
    try {
      validateStatusTransition(oldStatus, targetStatus);
    } catch (valErr) {
      return res.status(400).json({ success: false, message: valErr.message });
    }

    const meta = getStageMeta(targetStatus);
    app.applicationStatus = targetStatus;
    app.currentStage = meta.stageName;
    app.progressPercentage = meta.progressPercentage;

    if (!app.timeline) app.timeline = [];

    // Add Timeline Audit item
    app.timeline.push({
      stage: meta.stageName,
      status: targetStatus === 'REJECTED' ? 'REJECTED' : 'COMPLETED',
      date: new Date(),
      remarks: remarks || `Status updated to ${meta.stageName} by Officer.`,
      source: 'OFFICER_PORTAL',
      updatedBy: officerName || 'Government Verification Officer'
    });

    app.updatedAt = new Date();

    if (typeof app.save === 'function') {
      try {
        await app.save();
      } catch (err) {
        console.warn('DB save warning on officer status update:', err.message);
      }
    }

    // Create Audit Log Entry
    try {
      if (AuditLog && typeof AuditLog.create === 'function') {
        await AuditLog.create({
          applicationId: app._id,
          applicationNumber: app.applicationNumber,
          event: `APPLICATION_STATUS_UPDATED_TO_${targetStatus}`,
          oldStatus,
          newStatus: targetStatus,
          source: 'OFFICER_PORTAL',
          changedBy: officerName || 'Government Officer',
          userName: officerName || 'Government Officer',
          userRole: 'OFFICER',
          action: 'UPDATE_STATUS',
          resource: 'Application',
          details: remarks || `Status updated from ${oldStatus} to ${targetStatus}`
        });
      }
    } catch (auditErr) {}

    res.json({ success: true, data: app, message: `Application status updated to ${targetStatus}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update Financial Status (Officer Role API)
 */
const updateOfficerFinancialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { sanction, release, payment, officerName } = req.body;

    const app = await findAppByIdOrNumber(id);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (!app.financialStatus) app.financialStatus = {};

    if (sanction) {
      app.financialStatus.sanction = {
        ...app.financialStatus.sanction,
        ...sanction,
        date: sanction.date || new Date()
      };
      if (sanction.status === 'SANCTIONED' && app.applicationStatus === 'APPROVED') {
        app.applicationStatus = 'SANCTIONED';
        const meta = getStageMeta('SANCTIONED');
        app.currentStage = meta.stageName;
        app.progressPercentage = meta.progressPercentage;
      }
    }

    if (release) {
      app.financialStatus.release = {
        ...app.financialStatus.release,
        ...release,
        date: release.date || new Date()
      };
      if (release.status === 'RELEASED' && app.applicationStatus === 'SANCTIONED') {
        app.applicationStatus = 'RELEASED';
        const meta = getStageMeta('RELEASED');
        app.currentStage = meta.stageName;
        app.progressPercentage = meta.progressPercentage;
      }
    }

    if (payment) {
      app.financialStatus.payment = {
        ...app.financialStatus.payment,
        ...payment,
        date: payment.date || new Date()
      };
      if (payment.status === 'PAYMENT_SUCCESS' && app.applicationStatus === 'RELEASED') {
        app.applicationStatus = 'PAYMENT_SUCCESS';
        const meta = getStageMeta('PAYMENT_SUCCESS');
        app.currentStage = meta.stageName;
        app.progressPercentage = meta.progressPercentage;
      }
    }

    app.financialStatus.source = 'OFFICER_PORTAL';
    app.financialStatus.lastSyncedAt = new Date();
    app.updatedAt = new Date();

    if (typeof app.save === 'function') {
      try {
        await app.save();
      } catch (err) {
        console.warn('DB save warning on officer financial update:', err.message);
      }
    }

    res.json({ success: true, data: app, message: 'Financial tracking updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Sync Government / PFMS Status (Backend Integration Trigger via Clean Abstraction)
 */
const syncGovernmentStatus = async (req, res) => {
  try {
    const appId = req.params.applicationId || req.params.id;
    const app = await findAppByIdOrNumber(appId);

    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // 1. Delegate external query to defaultProvider (MockGovernmentProvider or Authorized Live Provider)
    const govRes = await defaultProvider.syncApplication(app);
    if (!govRes || !govRes.success) {
      return res.status(502).json({
        success: false,
        message: 'Unable to fetch latest government status. Last synchronized: ' + (app.financialStatus?.lastSyncedAt || 'Never')
      });
    }

    // 2. Process results through StatusProcessor
    await StatusProcessor.processSyncResult(app, govRes);

    res.json({
      success: true,
      message: 'Government / PFMS Status synchronized successfully via Integration Layer.',
      source: govRes.source || 'MOCK_GOVERNMENT',
      providerType: govRes.providerType || 'DEMO_PFMS_SANDBOX',
      data: {
        applicationId: app._id,
        applicationNumber: app.applicationNumber,
        applicationStatus: app.applicationStatus,
        currentStage: app.currentStage,
        progressPercentage: app.progressPercentage,
        financialStatus: app.financialStatus,
        lastSyncedAt: app.financialStatus.lastSyncedAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Seed 3 Official Demo Applications (APP-DEMO-001, APP-DEMO-002, APP-DEMO-003)
 */
const seedDemoApplications = async () => {
  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const count = await Application.countDocuments();
      if (count === 0) {
        await Application.insertMany(IN_MEMORY_DEMO_APPLICATIONS.map(a => ({
          ...a,
          _id: undefined // let Mongo generate valid ObjectId
        })));
        console.log('Successfully seeded 3 demo applications in MongoDB.');
      }
    }
  } catch (err) {
    console.warn('Error seeding demo applications in Mongo:', err.message);
  }
};

module.exports = {
  getUserApplications,
  getApplicationProgress,
  getApplicationFinancialStatus,
  getApplicationTimeline,
  updateOfficerApplicationStatus,
  updateOfficerFinancialStatus,
  syncGovernmentStatus,
  seedDemoApplications,
  IN_MEMORY_DEMO_APPLICATIONS
};
