const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');

// Citizen Application & Tracking Endpoints
router.get('/applications', trackingController.getUserApplications);
router.get('/applications/:id/progress', trackingController.getApplicationProgress);
router.get('/applications/:id/financial-status', trackingController.getApplicationFinancialStatus);

// Officer Verification & Financial Status Update Endpoints
router.patch('/officer/applications/:id/status', trackingController.updateOfficerApplicationStatus);
router.patch('/officer/applications/:id/financial-status', trackingController.updateOfficerFinancialStatus);

// Government / PFMS Synchronization Trigger Endpoint
router.post('/integration/government/sync/:applicationId', trackingController.syncGovernmentStatus);
router.post('/applications/:id/sync-government', trackingController.syncGovernmentStatus);

module.exports = router;
