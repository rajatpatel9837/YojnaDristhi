const express = require('express');
const router = express.Router();
const { getNearbyPartners } = require('../controllers/partnerController');

router.get('/nearby', getNearbyPartners);

module.exports = router;
