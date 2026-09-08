// server/src/routes/telephonyRoutes.js
const express = require('express');
const router = express.Router();
const telephonyController = require('../controllers/telephonyController');

// Outbound phone call trigger
router.post('/request-call', telephonyController.requestCall);

// IVR DTMF Keypad & Speech Webhook
router.post('/ivr-webhook', telephonyController.handleIvrWebhook);

// WhatsApp / SMS Scheme Summary Dispatch
router.post('/dispatch-summary', telephonyController.dispatchSummary);

module.exports = router;
