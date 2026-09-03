const express = require('express');
const router = express.Router();
const {
  createOpportunity,
  getMyOpportunities,
  submitOpportunityVerification
} = require('../controllers/opportunityController');

router.post('/', createOpportunity);
router.get('/my-opportunities', getMyOpportunities);
router.post('/:id/submit-verification', submitOpportunityVerification);

module.exports = router;
