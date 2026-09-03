const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  getMyOrganization,
  createOrUpdateOrganization,
  uploadDocument,
  submitVerification
} = require('../controllers/organizationController');

router.get('/me', getMyOrganization);
router.post('/', createOrUpdateOrganization);
router.put('/me', createOrUpdateOrganization);
router.post('/documents', upload.single('file'), uploadDocument);
router.post('/submit-verification', submitVerification);

module.exports = router;
