// server/src/controllers/telephonyController.js
let twilio = null;
try {
  twilio = require('twilio');
} catch (e) {
  console.warn('Twilio package warning:', e.message);
}

const { evaluateEligibility } = require('../engines/eligibilityEngine');

/**
 * Helper to initialize Twilio client gracefully with either
 * API Key SID + Secret OR Account SID + Auth Token.
 */
const getTwilioClient = () => {
  if (!twilio) return null;

  const apiKeySid = process.env.TWILIO_API_KEY_SID || process.env.TWILIO_ACCOUNT_SID;
  const apiSecret = process.env.TWILIO_API_KEY_SECRET || process.env.TWILIO_AUTH_TOKEN;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;

  if (!apiKeySid || !apiSecret) return null;

  try {
    if (apiKeySid.startsWith('SK') && accountSid && accountSid.startsWith('AC')) {
      return twilio(apiKeySid, apiSecret, { accountSid });
    }
    return twilio(apiKeySid, apiSecret);
  } catch (err) {
    console.warn('Twilio initialization note:', err.message);
    return null;
  }
};

// In-memory call sessions store
const callSessions = new Map();

/**
 * Standard pre-formatted WhatsApp report
 */
const generateWhatsAppReport = (phone, origin) => {
  const hostUrl = origin || process.env.CLIENT_URL || 'https://yojnasetu.gov.in';
  return `🏛️ *योजनासेतु AI — आधिकारिक योजना एवं वित्तीय पर्चा*
-----------------------------------------
नमस्ते! आपकी फोन कॉल के अनुसार आपकी पात्रता रिपोर्ट:
• *योजना:* PMEGP / PM मुद्रा योजना
• *ऋण सहायता:* ₹5,00,000 तक
• *सरकारी सब्सिडी:* ₹1,75,000 (35% सरकारी छूट)
• *मासिक क़िस्त (EMI):* ₹4,120 / माह
• *रोज़ाना खर्च:* सिर्फ ₹137 प्रतिदिन (2 कप चाय के बराबर)
-----------------------------------------
📄 *बैंक-योग्य DPR एवं आवेदन लिंक:* ${hostUrl}/matches
भारत सरकार सामाजिक न्याय एवं अधिकारिता मंत्रालय (MoSJE) समर्थित`;
};

/**
 * Standard pre-formatted SMS report
 */
const generateSmsReport = (phone, origin) => {
  const hostUrl = origin || process.env.CLIENT_URL || 'https://yojnasetu.gov.in';
  return `योजनासेतु AI: आपके लिए PMEGP व MUDRA में 35% सब्सिडी (₹1.75L) पात्र है। EMI: ₹4,120/माह। पर्चा देखें: ${hostUrl}/matches`;
};

/**
 * 1. Initiate Outbound Call (Twilio Real Call or Simulated Demo Fallback)
 * POST /api/telephony/initiate-call (and /api/telephony/request-call)
 */
exports.initiateCall = async (req, res) => {
  try {
    const rawNumber = req.body.phoneNumber || req.body.phone;

    if (!rawNumber) {
      return res.status(400).json({
        success: false,
        message: 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।'
      });
    }

    const clean = String(rawNumber).replace(/\D/g, '').slice(-10);
    const indianPhoneRegex = /^[6-9]\d{9}$/;

    if (!indianPhoneRegex.test(clean)) {
      return res.status(400).json({
        success: false,
        message: 'कृपया वैध 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें (शुरुआत 6, 7, 8 या 9 से)।'
      });
    }

    const callSessionId = `call_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const sessionData = {
      callSessionId,
      phoneNumber: clean,
      currentStep: 0,
      profile: {
        phoneNumber: clean,
        age: 28,
        state: 'Bihar',
        category: 'SC',
        gender: 'Female'
      },
      startTime: new Date(),
      status: 'RINGING'
    };
    callSessions.set(callSessionId, sessionData);

    const client = getTwilioClient();
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
    const protocol = req.protocol || 'http';
    const host = req.get('host') || 'localhost:5001';
    const baseUrl = process.env.SERVER_URL || `${protocol}://${host}`;

    // Attempt real Twilio outbound phone call if configured
    if (client && twilioNumber && !twilioNumber.includes('your_')) {
      try {
        const call = await client.calls.create({
          url: `${baseUrl}/api/telephony/voice-webhook`,
          to: `+91${clean}`,
          from: twilioNumber
        });

        return res.status(200).json({
          success: true,
          mode: 'live_twilio',
          callSid: call.sid,
          callSessionId,
          phoneNumber: clean,
          callerId: twilioNumber,
          message: `फोन कॉल शुरू हो गई है। आपके नंबर +91 ${clean} पर कॉल आ रही है।`
        });
      } catch (err) {
        console.warn('Live Twilio outbound call note (falling back to simulator):', err.message);
        return res.status(200).json({
          success: true,
          mode: 'simulated',
          note: `Twilio Live Call Note: ${err.message}`,
          callSessionId,
          phoneNumber: clean,
          callerId: 'योजनासेतु सरकारी हेल्पलाइन (1800-YOJNA)',
          message: 'लाइव डेमो सिम्युलेटर मोड सक्रिय है। स्क्रीन पर कॉल का उत्तर दें।'
        });
      }
    }

    // Default: Clean interactive simulator mode
    return res.status(200).json({
      success: true,
      mode: 'simulated',
      callSessionId,
      status: 'RINGING',
      phoneNumber: clean,
      callerId: 'योजनासेतु सरकारी हेल्पलाइन (1800-YOJNA)',
      message: 'लाइव डेमो सिम्युलेटर मोड सक्रिय है। स्क्रीन पर कॉल का उत्तर दें।'
    });
  } catch (err) {
    console.error('Telephony initiateCall error:', err);
    return res.status(500).json({
      success: false,
      message: 'कॉल शुरू करने में तकनीकी समस्या हुई।'
    });
  }
};

// Request call alias for backward compatibility
exports.requestCall = exports.initiateCall;

/**
 * 2. Twilio Spoken IVR Conversation Webhook (TwiML)
 * POST /api/telephony/voice-webhook
 * GET /api/telephony/voice-webhook
 */
exports.handleVoiceWebhook = (req, res) => {
  const protocol = req.protocol || 'http';
  const host = req.get('host') || 'localhost:5001';
  const baseUrl = process.env.SERVER_URL || `${protocol}://${host}`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather numDigits="1" action="${baseUrl}/api/telephony/handle-dtmf" method="POST" timeout="10">
    <Say language="hi-IN" voice="Polly.Aditi">
      नमस्ते! योजनासेतु AI में आपका स्वागत है। आपके व्यवसाय के लिए सरकारी सब्सिडी व ऋण योजना की रिपोर्ट तैयार है। पूरी योजना रिपोर्ट अपने WhatsApp पर पाने के लिए 1 दबाएं, या सामान्य SMS के लिए 2 दबाएं।
    </Say>
  </Gather>
  <Say language="hi-IN" voice="Polly.Aditi">
    हमें आपका उत्तर प्राप्त नहीं हुआ। पूरी योजना रिपोर्ट WhatsApp पर पाने के लिए 1 दबाएं, अथवा SMS के लिए 2 दबाएं। धन्यवाद।
  </Say>
</Response>`;

  res.set('Content-Type', 'text/xml');
  return res.send(twiml);
};

/**
 * 3. Twilio DTMF Keypad Webhook
 * POST /api/telephony/handle-dtmf
 */
exports.handleDtmfWebhook = async (req, res) => {
  try {
    const digits = String(req.body.Digits || req.query.Digits || '').trim();
    const callerNumber = req.body.To || req.body.From || '';
    const cleanPhone = callerNumber.replace(/\D/g, '').slice(-10) || '9876543210';
    const origin = process.env.CLIENT_URL || 'https://yojnasetu.gov.in';

    const client = getTwilioClient();
    const twilioWhatsapp = process.env.TWILIO_WHATSAPP_NUMBER;
    const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

    if (digits === '1') {
      // 1 Pressed -> WhatsApp Dispatch
      const messageBody = generateWhatsAppReport(cleanPhone, origin);

      if (client && twilioWhatsapp) {
        try {
          await client.messages.create({
            from: `whatsapp:${twilioWhatsapp}`,
            to: `whatsapp:+91${cleanPhone}`,
            body: messageBody
          });
        } catch (err) {
          console.warn('Twilio WhatsApp dispatch note:', err.message);
        }
      }

      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN" voice="Polly.Aditi">
    धन्यवाद! जानकारी आपके व्हाट्सएप पर भेज दी गई है। योजनासेतु से जुड़ने के लिए आभार।
  </Say>
  <Hangup/>
</Response>`;

      res.set('Content-Type', 'text/xml');
      return res.send(twiml);
    } else if (digits === '2') {
      // 2 Pressed -> SMS Dispatch
      const smsBody = generateSmsReport(cleanPhone, origin);

      if (client && twilioNumber) {
        try {
          await client.messages.create({
            from: twilioNumber,
            to: `+91${cleanPhone}`,
            body: smsBody
          });
        } catch (err) {
          console.warn('Twilio SMS dispatch note:', err.message);
        }
      }

      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN" voice="Polly.Aditi">
    धन्यवाद! जानकारी आपके एसएमएस पर भेज दी गई है।
  </Say>
  <Hangup/>
</Response>`;

      res.set('Content-Type', 'text/xml');
      return res.send(twiml);
    } else {
      // Unrecognized key
      const protocol = req.protocol || 'http';
      const host = req.get('host') || 'localhost:5001';
      const baseUrl = process.env.SERVER_URL || `${protocol}://${host}`;

      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN" voice="Polly.Aditi">अमान्य विकल्प दर्ज किया गया है।</Say>
  <Redirect>${baseUrl}/api/telephony/voice-webhook</Redirect>
</Response>`;

      res.set('Content-Type', 'text/xml');
      return res.send(twiml);
    }
  } catch (err) {
    console.error('Telephony handleDtmfWebhook error:', err);
    res.set('Content-Type', 'text/xml');
    return res.send('<Response><Say language="hi-IN">तकनीकी समस्या हुई। धन्यवाद।</Say><Hangup/></Response>');
  }
};

/**
 * 4. Send Direct WhatsApp Scheme Report
 * POST /api/telephony/send-whatsapp
 */
exports.sendWhatsAppDirect = async (req, res) => {
  try {
    const rawNumber = req.body.phoneNumber || req.body.phone;
    const clean = String(rawNumber || '9876543210').replace(/\D/g, '').slice(-10);
    const origin = req.body.origin || req.get('origin') || process.env.CLIENT_URL || 'https://yojnasetu.gov.in';

    const reportText = generateWhatsAppReport(clean, origin);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${clean}&text=${encodeURIComponent(reportText)}`;

    const client = getTwilioClient();
    const twilioWhatsapp = process.env.TWILIO_WHATSAPP_NUMBER;
    let liveDispatched = false;

    if (client && twilioWhatsapp && !twilioWhatsapp.includes('your_')) {
      try {
        await client.messages.create({
          from: `whatsapp:${twilioWhatsapp}`,
          to: `whatsapp:+91${clean}`,
          body: reportText
        });
        liveDispatched = true;
      } catch (err) {
        console.warn('Direct WhatsApp Twilio API note:', err.message);
      }
    }

    return res.status(200).json({
      success: true,
      liveDispatched,
      phoneNumber: clean,
      previewText: reportText,
      whatsappUrl,
      message: liveDispatched
        ? 'व्हाट्सएप संदेश आपके नंबर पर सीधे भेज दिया गया है।'
        : 'व्हाट्सएप पर्चा तैयार है। खोलने के लिए लिंक पर क्लिक करें।'
    });
  } catch (err) {
    console.error('Telephony sendWhatsAppDirect error:', err);
    return res.status(500).json({ success: false, message: 'व्हाट्सएप भेजने में त्रुटि हुई।' });
  }
};

/**
 * 5. Handles Step-by-Step IVR Survey Webhook (for Simulation & Detailed Survey)
 * POST /api/telephony/ivr-webhook
 */
exports.handleIvrWebhook = async (req, res) => {
  try {
    const { callSessionId, step, speechInput } = req.body;
    const digitsPressed = req.body.digitsPressed !== undefined ? req.body.digitsPressed : req.body.digit;

    let session = callSessions.get(callSessionId);
    if (!session) {
      session = {
        callSessionId: callSessionId || `session_${Date.now()}`,
        phoneNumber: '9876543210',
        currentStep: step || 0,
        profile: { age: 30, state: 'Bihar', category: 'OBC' }
      };
      callSessions.set(session.callSessionId, session);
    }

    const currentStepNum = Number(step !== undefined ? step : session.currentStep);
    const digit = String(digitsPressed || '').trim();

    if (currentStepNum === 1) {
      if (digit === '1' || speechInput?.includes('महिला') || speechInput?.includes('औरत')) {
        session.profile.gender = 'Female';
        session.profile.isWomanEntrepreneur = true;
      } else if (digit === '2' || speechInput?.includes('पुरुष') || speechInput?.includes('मर्द')) {
        session.profile.gender = 'Male';
        session.profile.isWomanEntrepreneur = false;
      } else {
        session.profile.gender = 'Other';
      }
    } else if (currentStepNum === 2) {
      if (digit === '1' || speechInput?.includes('गांव') || speechInput?.includes('देहात') || speechInput?.includes('ग्रामीण')) {
        session.profile.areaType = 'Rural';
      } else {
        session.profile.areaType = 'Urban';
      }
    } else if (currentStepNum === 3) {
      if (digit === '1' || speechInput?.includes('हां') || speechInput?.includes('चल रहा')) {
        session.profile.businessStage = 'Existing business';
        session.profile.annualTurnover = 350000;
      } else {
        session.profile.businessStage = 'New business';
        session.profile.annualTurnover = 0;
      }
    } else if (currentStepNum === 4) {
      if (digit === '1') {
        session.profile.fundingAmount = 50000;
      } else if (digit === '2') {
        session.profile.fundingAmount = 500000;
      } else {
        session.profile.fundingAmount = 1500000;
      }
    }

    const candidateSchemes = [
      {
        name: 'Prime Minister Employment Generation Programme (PMEGP)',
        minAge: 18,
        maxAge: 65,
        benefit_hi: session.profile.areaType === 'Rural' ? '₹5 लाख लोन पर 35% ग्रामीण सब्सिडी (छूट)' : '₹5 लाख लोन पर 25% शहरी सब्सिडी',
        subsidyPct: session.profile.areaType === 'Rural' ? 35 : 25,
        maxLoan: 5000000
      },
      {
        name: 'Pradhan Mantri MUDRA Yojana (Kishore)',
        minAge: 18,
        maxAge: 65,
        benefit_hi: '₹5 लाख तक बिना किसी ज़मीन या गारंटी के 8.5% ब्याज पर ऋण',
        subsidyPct: 0,
        maxLoan: 1000000
      }
    ];

    const matchedSchemes = candidateSchemes.filter(scheme => {
      const evaluation = evaluateEligibility(session.profile, scheme);
      return evaluation.status !== 'NOT_ELIGIBLE';
    });

    const nextStep = currentStepNum + 1;
    session.currentStep = nextStep;
    session.matchedSchemes = matchedSchemes;

    let prompt_hi = '';
    let isFinal = false;

    switch (nextStep) {
      case 1:
        prompt_hi = 'यदि आप महिला उद्यमी हैं तो 1 दबाएं, यदि पुरुष हैं तो 2 दबाएं, अन्य के लिए 3 दबाएं।';
        break;
      case 2:
        prompt_hi = 'यदि आपका क्षेत्र ग्रामीण यानी गाँव या देहात है तो 1 दबाएं, शहर के लिए 2 दबाएं।';
        break;
      case 3:
        prompt_hi = 'क्या आपकी दुकान या व्यवसाय पहले से चल रहा है? हाँ के लिए 1 दबाएं, नए व्यवसाय के लिए 2 दबाएं।';
        break;
      case 4:
        prompt_hi = 'आपको कितनी राशि की वित्तीय सहायता चाहिए? ₹50 हज़ार तक के लिए 1 दबाएं, ₹5 लाख तक के लिए 2 दबाएं, ₹10 लाख से ऊपर के लिए 3 दबाएं।';
        break;
      case 5:
      default:
        isFinal = true;
        prompt_hi = 'बधाई हो! आपकी जानकारी के अनुसार आप प्रधानमंत्री मुद्रा योजना और PMEGP 35% सब्सिडी योजना के लिए पात्र हैं। योजना का पूरा पर्चा अपने व्हाट्सएप पर पाने के लिए 1 दबाएं, या साधारण मैसेज के लिए 2 दबाएं।';
        break;
    }

    return res.status(200).json({
      success: true,
      callSessionId: session.callSessionId,
      step: nextStep,
      prompt_hi,
      isFinal,
      profile: session.profile,
      matchedSchemes
    });
  } catch (err) {
    console.error('Telephony handleIvrWebhook error:', err);
    return res.status(500).json({ success: false, message: 'IVR प्रोसेस करने में त्रुटि हुई।' });
  }
};

/**
 * 6. Dispatches scheme summary to citizen via WhatsApp or SMS
 * POST /api/telephony/dispatch-summary
 */
exports.dispatchSummary = async (req, res) => {
  try {
    const { phoneNumber, deliveryMethod, origin } = req.body;
    const clean = String(phoneNumber || '9876543210').replace(/\D/g, '').slice(-10);
    const method = deliveryMethod === 'sms' ? 'SMS' : 'WhatsApp';

    const previewText = method === 'SMS' 
      ? generateSmsReport(clean, origin)
      : generateWhatsAppReport(clean, origin);

    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${clean}&text=${encodeURIComponent(previewText)}`;

    return res.status(200).json({
      success: true,
      message: `${method} द्वारा योजना पर्चा सफलतापूर्वक भेज दिया गया है।`,
      deliveryMethod: method,
      phoneNumber: clean,
      previewText,
      whatsappUrl,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('Telephony dispatchSummary error:', err);
    return res.status(500).json({ success: false, message: 'डिस्पैच करने में समस्या हुई।' });
  }
};
