// server/src/controllers/telephonyController.js
const { evaluateEligibility } = require('../engines/eligibilityEngine');

/**
 * Automated Phone Call Assistant (IVR Telephony Controller)
 * Supports outbound call simulation, DTMF digit webhook processing,
 * and WhatsApp/SMS scheme summary dispatch.
 */

// In-memory call sessions store
const callSessions = new Map();

/**
 * Initiates an outbound automated helpline call
 * POST /api/telephony/request-call
 */
exports.requestCall = async (req, res) => {
  try {
    const rawNumber = req.body.phoneNumber || req.body.phone;

    if (!rawNumber) {
      return res.status(400).json({ success: false, message: 'कृपया 10 अंकों का मोबाइल नंबर दर्ज करें।' });
    }

    const cleaned = String(rawNumber).replace(/\D/g, '');
    const indianPhoneRegex = /^[6-9]\d{9}$/;

    if (!indianPhoneRegex.test(cleaned)) {
      return res.status(400).json({
        success: false,
        message: 'कृपया वैध 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें (शुरुआत 6, 7, 8 या 9 से)।'
      });
    }

    const callSessionId = `call_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    const sessionData = {
      callSessionId,
      phoneNumber: cleaned,
      currentStep: 0,
      profile: {
        phoneNumber: cleaned,
        age: 30,
        state: 'Bihar',
        category: 'OBC'
      },
      startTime: new Date(),
      status: 'RINGING'
    };

    callSessions.set(callSessionId, sessionData);

    return res.status(200).json({
      success: true,
      callSessionId,
      status: 'RINGING',
      phoneNumber: cleaned,
      callerId: 'योजनासेतु सरकारी हेल्पलाइन (1800-YOJNA)',
      message: 'कॉल शुरू हो रही है...'
    });
  } catch (err) {
    console.error('Telephony requestCall error:', err);
    return res.status(500).json({ success: false, message: 'कॉल शुरू करने में तकनीकी समस्या हुई।' });
  }
};

/**
 * Handles IVR DTMF keypad and speech webhooks
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

    // Map responses to user profile attributes
    if (currentStepNum === 1) {
      // Gender question
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
      // Area question
      if (digit === '1' || speechInput?.includes('गांव') || speechInput?.includes('देहात') || speechInput?.includes('ग्रामीण')) {
        session.profile.areaType = 'Rural';
      } else {
        session.profile.areaType = 'Urban';
      }
    } else if (currentStepNum === 3) {
      // Business stage
      if (digit === '1' || speechInput?.includes('हां') || speechInput?.includes('चल रहा')) {
        session.profile.businessStage = 'Existing business';
        session.profile.annualTurnover = 350000;
      } else {
        session.profile.businessStage = 'New business';
        session.profile.annualTurnover = 0;
      }
    } else if (currentStepNum === 4) {
      // Funding requirement
      if (digit === '1') {
        session.profile.fundingAmount = 50000;
      } else if (digit === '2') {
        session.profile.fundingAmount = 500000;
      } else {
        session.profile.fundingAmount = 1500000;
      }
    }

    // Evaluate scheme eligibility using server/src/engines/eligibilityEngine.js
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
      },
      {
        name: 'Stand-Up India Scheme (महिला उद्यमी विशेष)',
        minAge: 18,
        maxAge: 65,
        genderEligibility: 'Female Only',
        benefit_hi: 'महिला उद्यमियों को 15% मार्जिन मनी सरकारी सहायता',
        subsidyPct: 15,
        maxLoan: 10000000
      }
    ];

    const matchedSchemes = candidateSchemes.filter(scheme => {
      const evaluation = evaluateEligibility(session.profile, scheme);
      return evaluation.status !== 'NOT_ELIGIBLE';
    });

    // Determine Next Prompt
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
 * Dispatches scheme summary to citizen via WhatsApp or SMS
 * POST /api/telephony/dispatch-summary
 */
exports.dispatchSummary = async (req, res) => {
  try {
    const { phoneNumber, deliveryMethod, matchedSchemes, profile } = req.body;

    const phone = phoneNumber || '9876543210';
    const method = deliveryMethod === 'sms' ? 'SMS' : 'WhatsApp';

    const schemeNames = (matchedSchemes || [
      { name: 'PMEGP Scheme (35% Subsidy)' },
      { name: 'PM MUDRA Yojana (Collateral-Free)' }
    ]).map(s => `• ${s.name}: ${s.benefit_hi || 'पात्र'}`).join('\n');

    const previewText = 
`*योजना सेतू AI (Yojna दृष्टि) — कॉल हेल्पलाइन सारांश*

नमस्ते! आपके फोन कॉल सर्वेक्षण के आधार पर आप निम्नलिखित सरकारी योजनाओं के लिए पात्र पाए गए हैं:

${schemeNames}

🛡️ *RBI सुरक्षा नियम:* ₹10 लाख तक के ऋण पर बैंक आपसे कोई ज़मीन या गारंटी नहीं मांग सकता।
📄 *विस्तृत पर्चा व ऑनलाइन आवेदन हेतु:*
${process.env.CLIENT_URL || 'https://yojnasetu.gov.in'}/matches

— योजना दृष्टि AI हेल्पलाइन (1800-YOJNA)`;

    return res.status(200).json({
      success: true,
      message: `${method} द्वारा योजना पर्चा सफलतापूर्वक भेज दिया गया है।`,
      deliveryMethod: method,
      phoneNumber: phone,
      previewText,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('Telephony dispatchSummary error:', err);
    return res.status(500).json({ success: false, message: 'डिस्पैच करने में समस्या हुई।' });
  }
};
