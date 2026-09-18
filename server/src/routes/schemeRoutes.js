const express = require('express');
const router = express.Router();
const { matchSchemes, getAllSchemes, getSchemeBySlug, getSchemeStats, searchSchemesByName } = require('../controllers/schemeController');

router.post('/match', matchSchemes);
router.get('/stats', getSchemeStats);
router.get('/search', searchSchemesByName);
router.get('/', getAllSchemes);
router.get('/:slug', getSchemeBySlug);

module.exports = router;
