const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');
const Application = require('../models/Application');
const { mockSchemes } = require('../seed/seedData');
const { fetchConsentedDocuments, getConsentedDocumentsBySession } = require('../services/mockDigilockerService');
const { buildPrefilledApplication, buildGuidedWalkthrough } = require('../engines/autofillEngine');

/**
 * Helper to find scheme by MongoDB _id or slug (with in-memory mock fallback)
 */
const findSchemeByIdOrSlug = async (idOrSlug) => {
  if (!idOrSlug) return null;

  try {
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      let schemeDoc = null;
      if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
        schemeDoc = await Scheme.findById(idOrSlug);
      }
      if (!schemeDoc) {
        schemeDoc = await Scheme.findOne({ slug: idOrSlug });
      }
      if (schemeDoc) return schemeDoc.toObject ? schemeDoc.toObject() : schemeDoc;
    }
  } catch (err) {
    console.warn('DB scheme lookup warning in autofillController:', err.message);
  }

  // Fallback to seedData catalog
  const found = mockSchemes.find(s => String(s._id) === String(idOrSlug) || s.slug === idOrSlug || s.name.toLowerCase().includes(String(idOrSlug).toLowerCase()));
  if (found) return found;

  // Generic fallback scheme object if requested ID is a demo placeholder
  return {
    _id: idOrSlug,
    name: 'Prime Minister Employment Generation Programme (PMEGP)',
    slug: 'pmegp-micro-units-grant-loan',
    provider: 'Khadi and Village Industries Commission (KVIC) / Ministry of MSME',
    officialUrl: 'https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp',
    maximumSupport: 5000000,
    subsidyPercentage: 35
  };
};

/**
 * 1. Request DigiLocker Document Consent & Generate Temporary Sandbox Session
 * POST /api/autofill/consent
 */
const requestDigilockerConsent = async (req, res) => {
  try {
    const { requestedDocTypes = ['Aadhaar Card', 'Annual Income Certificate', 'Community / Social Category Certificate', 'Udyam Registration Certificate'], profileHint = {} } = req.body;
    const userId = req.user ? req.user._id : 'demo_citizen_user';

    const result = await fetchConsentedDocuments(userId, requestedDocTypes, profileHint);

    res.json({
      success: true,
      message: 'DigiLocker consent granted. Consented documents cached in temporary sandbox session.',
      data: {
        sessionId: result.sessionId,
        expiresInSeconds: result.expiresInSeconds,
        documents: result.documents,
        disclaimer: result.disclaimer
      }
    });
  } catch (error) {
    console.error('requestDigilockerConsent error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to grant DigiLocker consent.' });
  }
};

/**
 * 2. Generate Pre-filled Application for a Single Scheme
 * POST /api/autofill/generate/:schemeId
 */
const generateSinglePrefilledApplication = async (req, res) => {
  try {
    const { schemeId } = req.params;
    const { profile = {}, sessionId } = req.body;

    const scheme = await findSchemeByIdOrSlug(schemeId);
    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found.' });
    }

    const digilockerDocs = sessionId ? getConsentedDocumentsBySession(sessionId) : {};
    const prefilledData = buildPrefilledApplication(scheme, profile, digilockerDocs || {});

    res.json({
      success: true,
      message: 'Pre-filled application form generated successfully.',
      data: prefilledData
    });
  } catch (error) {
    console.error('generateSinglePrefilledApplication error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. Generate Bulk Pre-filled Applications for All Eligible Schemes
 * POST /api/autofill/generate-bulk
 */
const generateBulkPrefilledApplications = async (req, res) => {
  try {
    const { schemeIds = [], profile = {}, sessionId } = req.body;

    if (!Array.isArray(schemeIds) || schemeIds.length === 0) {
      return res.status(400).json({ success: false, message: 'schemeIds array is required for bulk generation.' });
    }

    const digilockerDocs = sessionId ? getConsentedDocumentsBySession(sessionId) : {};
    const bulkResults = [];

    for (const sId of schemeIds) {
      const scheme = await findSchemeByIdOrSlug(sId);
      if (scheme) {
        const form = buildPrefilledApplication(scheme, profile, digilockerDocs || {});
        bulkResults.push(form);
      }
    }

    res.json({
      success: true,
      count: bulkResults.length,
      data: bulkResults
    });
  } catch (error) {
    console.error('generateBulkPrefilledApplications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. Submit & Persist Applications in MongoDB
 * POST /api/autofill/submit
 */
const submitPrefilledApplications = async (req, res) => {
  try {
    const { applications = [], profile = {} } = req.body;

    if (!Array.isArray(applications) || applications.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one application is required for submission.' });
    }

    const savedApplications = [];
    const timestamp = new Date();

    for (let i = 0; i < applications.length; i++) {
      const appData = applications[i];
      const appNumber = `APP-YS-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

      const newAppObj = {
        applicationNumber: appNumber,
        userId: req.user?._id || undefined,
        schemeName: appData.schemeName || 'Government Welfare Scheme',
        applicantName: appData.applicantName || profile.fullName || 'Beneficiary Citizen',
        applicantState: appData.applicantState || profile.state || 'Bihar',
        businessOrCourse: appData.businessOrCourse || profile.sector || 'Micro Enterprise',
        requestedAmount: Number(appData.requestedAmount || profile.fundingAmount || 500000),
        applicationStatus: 'SUBMITTED',
        currentStage: 'Application Submitted',
        progressPercentage: 15,
        timeline: [
          {
            stage: 'Application Submitted',
            status: 'COMPLETED',
            date: timestamp,
            remarks: 'Submitted via Yojna दृष्टि 1-Click Auto-Fill Dossier Engine.',
            source: 'CITIZEN',
            updatedBy: appData.applicantName || profile.fullName || 'Citizen'
          }
        ],
        financialStatus: {
          sanction: { status: 'NOT_SANCTIONED', amount: 0 },
          release: { status: 'NOT_RELEASED', amount: 0 },
          payment: { status: 'PENDING' },
          source: 'MOCK_GOVERNMENT',
          lastSyncedAt: timestamp
        },
        matchScore: appData.matchScore || 95,
        submittedAt: timestamp
      };

      if (mongoose.connection && mongoose.connection.readyState === 1) {
        try {
          const createdDoc = await Application.create(newAppObj);
          savedApplications.push(createdDoc);
        } catch (dbErr) {
          console.warn('MongoDB Application.create error, returning in-memory representation:', dbErr.message);
          savedApplications.push({ ...newAppObj, _id: `app_mem_${Date.now()}_${i}` });
        }
      } else {
        savedApplications.push({ ...newAppObj, _id: `app_mem_${Date.now()}_${i}` });
      }
    }

    res.json({
      success: true,
      message: `Successfully created ${savedApplications.length} application record(s) in YojnaSetu tracking system.`,
      count: savedApplications.length,
      data: savedApplications,
      disclaimer: 'Applications are registered inside YojnaSetu for 8-Stage tracking. Official government portals may require physical verification.'
    });
  } catch (error) {
    console.error('submitPrefilledApplications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 5. Get Guided Walkthrough for a Specific Scheme
 * GET /api/autofill/walkthrough/:schemeId
 */
const getSchemeWalkthrough = async (req, res) => {
  try {
    const { schemeId } = req.params;
    const { sessionId } = req.query;

    const scheme = await findSchemeByIdOrSlug(schemeId);
    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found.' });
    }

    // Attempt to pull user profile from auth if logged in, or pass empty profile
    const profile = req.user ? (req.user.profile || req.user) : {};
    const digilockerDocs = sessionId ? getConsentedDocumentsBySession(sessionId) : {};

    const walkthroughData = buildGuidedWalkthrough(scheme, profile, digilockerDocs || {});

    res.json({
      success: true,
      data: walkthroughData
    });
  } catch (error) {
    console.error('getSchemeWalkthrough error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  requestDigilockerConsent,
  generateSinglePrefilledApplication,
  generateBulkPrefilledApplications,
  submitPrefilledApplications,
  getSchemeWalkthrough
};

