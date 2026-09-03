const express = require('express');
const router = express.Router();
const { getDemoProfile, saveProfile, getProfile } = require('../controllers/entrepreneurController');
const { protect } = require('../middleware/authMiddleware');

router.get('/demo', getDemoProfile);
router.post('/save', saveProfile);
router.get('/my-profile', protect, getProfile);

module.exports = router;
