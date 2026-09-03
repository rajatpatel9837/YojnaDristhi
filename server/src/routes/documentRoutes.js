const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { scanDocument } = require('../controllers/documentController');

// Upload and Scan Single Document with AI OCR
router.post('/scan-ocr', upload.single('file'), scanDocument);

module.exports = router;
