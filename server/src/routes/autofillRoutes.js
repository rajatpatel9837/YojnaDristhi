const express = require('express');
const router = express.Router();
const {
  requestDigilockerConsent,
  generateSinglePrefilledApplication,
  generateBulkPrefilledApplications,
  submitPrefilledApplications,
  getSchemeWalkthrough
} = require('../controllers/autofillController');

// 1. Consent flow & temporary session retrieval
router.post('/consent', requestDigilockerConsent);

// 2. Pre-filled application generation
router.post('/generate/:schemeId', generateSinglePrefilledApplication);
router.post('/generate-bulk', generateBulkPrefilledApplications);

// 3. Application persistence
router.post('/submit', submitPrefilledApplications);

// 4. Task 3: Guided walkthrough data
router.get('/walkthrough/:schemeId', getSchemeWalkthrough);

module.exports = router;

