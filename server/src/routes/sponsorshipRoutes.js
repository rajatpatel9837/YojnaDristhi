const express = require('express');
const router = express.Router();
const { getSponsorshipCampaigns, contributeSponsorship } = require('../controllers/sponsorshipController');

router.get('/campaigns', getSponsorshipCampaigns);
router.post('/pay', contributeSponsorship);

module.exports = router;
