const express = require('express');
const router = express.Router();
const { matchScholarships, getAllScholarships } = require('../controllers/scholarshipController');

router.post('/match', matchScholarships);
router.get('/', getAllScholarships);

module.exports = router;
