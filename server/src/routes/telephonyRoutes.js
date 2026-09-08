// server/src/routes/telephonyRoutes.js
const express = require('express');
const router = express.Router();
const telephonyController = require('../controllers/telephonyController');

// 1. Outbound phone call trigger (Real Twilio or Simulated)
router.post('/initiate-call', telephonyController.initiateCall);
router.post('/request-call', telephonyController.requestCall);

// 2. Twilio Spoken IVR Conversation Webhook (TwiML)
router.post('/voice-webhook', telephonyController.handleVoiceWebhook);
router.get('/voice-webhook', telephonyController.handleVoiceWebhook);

// 3. Twilio DTMF Keypad Webhook
router.post('/handle-dtmf', telephonyController.handleDtmfWebhook);
router.get('/handle-dtmf', telephonyController.handleDtmfWebhook);

// 4. WhatsApp / SMS Scheme Summary Dispatch
router.post('/send-whatsapp', telephonyController.sendWhatsAppDirect);
router.post('/dispatch-summary', telephonyController.dispatchSummary);

// 5. Step-by-Step IVR Simulation Webhook
router.post('/ivr-webhook', telephonyController.handleIvrWebhook);

module.exports = router;
