const express = require('express');
const router = express.Router();
const { askYojnaSetuAssistant, generateSpeech, getMLModelsStatus, predictMLMatch } = require('../controllers/aiController');

router.post('/chat', askYojnaSetuAssistant);
router.post('/tts', generateSpeech);
router.get('/ml-models', getMLModelsStatus);
router.post('/predict', predictMLMatch);

module.exports = router;
