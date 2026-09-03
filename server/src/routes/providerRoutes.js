const express = require('express');
const router = express.Router();
const {
  getOrganizationProfile,
  updateOrganization,
  createPrivateOpportunity,
  getCandidateMatches,
  getProviderDashboardMetrics
} = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/organization', protect, getOrganizationProfile);
router.put('/organization', protect, authorize('PROVIDER', 'ADMIN'), updateOrganization);
router.post('/opportunities', protect, authorize('PROVIDER', 'ADMIN'), createPrivateOpportunity);
router.get('/candidates/:opportunityId', protect, authorize('PROVIDER', 'ADMIN'), getCandidateMatches);
router.get('/metrics', protect, authorize('PROVIDER', 'ADMIN'), getProviderDashboardMetrics);

module.exports = router;
