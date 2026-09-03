const express = require('express');
const router = express.Router();
const { matchSchemes, getAllSchemes, getSchemeBySlug } = require('../controllers/schemeController');

router.post('/match', matchSchemes);
router.get('/', getAllSchemes);
router.get('/:slug', getSchemeBySlug);

module.exports = router;
