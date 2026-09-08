const express = require('express');
const router = express.Router();
const {
  askYojnaSetuAssistant,
  generateSpeech,
  getMLModelsStatus,
  predictMLMatch,
  parseVoiceField
} = require('../controllers/aiController');

router.post('/chat', askYojnaSetuAssistant);
router.post('/tts', generateSpeech);
router.get('/ml-models', getMLModelsStatus);
router.post('/predict', predictMLMatch);
router.post('/parse-voice-field', parseVoiceField);

module.exports = router;
