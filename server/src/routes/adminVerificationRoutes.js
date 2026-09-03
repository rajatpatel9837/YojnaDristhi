const express = require('express');
const router = express.Router();
const {
  getOrganizationQueue,
  getOrganizationDetails,
  updateOrganizationVerification,
  getOpportunityQueue,
  updateOpportunityVerification
} = require('../controllers/adminVerificationController');

router.get('/organizations/verification-queue', getOrganizationQueue);
router.get('/organizations/:id', getOrganizationDetails);
router.patch('/organizations/:id/verification', updateOrganizationVerification);

router.get('/opportunities/verification-queue', getOpportunityQueue);
router.patch('/opportunities/:id/verification', updateOpportunityVerification);

module.exports = router;
