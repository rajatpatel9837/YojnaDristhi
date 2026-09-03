const express = require('express');
const router = express.Router();
const {
  getAdminMetrics,
  getPendingOrganizations,
  verifyOrganization,
  runSimulatedSourceCheck,
  getAuditLogs
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/metrics', protect, authorize('ADMIN'), getAdminMetrics);
router.get('/pending-organizations', protect, authorize('ADMIN'), getPendingOrganizations);
router.post('/verify-org/:orgId', protect, authorize('ADMIN'), verifyOrganization);
router.post('/run-source-check', protect, authorize('ADMIN'), runSimulatedSourceCheck);
router.get('/audit-logs', protect, authorize('ADMIN'), getAuditLogs);

module.exports = router;
