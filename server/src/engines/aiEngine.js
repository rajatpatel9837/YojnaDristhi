/**
 * Yojna दृष्टि — AI Conversational Knowledge & Domain Engine
 * 
 * Features:
 * 1. Automatic Multilingual Detection (Hindi, Hinglish, Punjabi, English, regional languages)
 * 2. Strict Domain Scope Guardrail (Politely apologizes for queries outside government schemes / platform)
 * 3. Deep Platform Knowledge (Explains site working, 8-stage tracking, DocVerifier OCR, ScholarSetu, Provider KYB, Admin studio)
 * 4. Dynamic Scheme Synthesizer (Grounded in all 15+ Central & State schemes with live metadata)
 * 5. Gemini 1.5/2.0 Integration with fallback to Dynamic Knowledge Synthesizer
 */

const { mockSchemes } = require('../seed/seedData');

/**
 * Detect language of user question
 */
const detectLanguage = (text = '', requestedLang = 'auto') => {
  const clean = String(text || '').trim();
  if (!clean) return { langCode: 'en', langName: 'English', promptLang: 'English' };

  // 1. Script checks (Unicode ranges)
  if (/[\u0900-\u097F]/.test(clean)) {
    return { langCode: 'hi', langName: 'Hindi (हिंदी)', promptLang: 'Hindi (हिंदी लिपि में)' };
  }
  if (/[\u0A00-\u0A7F]/.test(clean)) {
    return { langCode: 'pa', langName: 'Punjabi (ਪੰਜਾਬੀ)', promptLang: 'Punjabi (ਗੁਰਮੁਖੀ ਲਿਪੀ ਵਿੱਚ)' };
  }
  if (/[\u0980-\u09FF]/.test(clean)) {
    return { langCode: 'bn', langName: 'Bengali (বাংলা)', promptLang: 'Bengali (বাংলায়)' };
  }
  if (/[\u0B80-\u0BFF]/.test(clean)) {
    return { langCode: 'ta', langName: 'Tamil (தமிழ்)', promptLang: 'Tamil (தமிழில்)' };
  }
  if (/[\u0C00-\u0C7F]/.test(clean)) {
    return { langCode: 'te', langName: 'Telugu (తెలుగు)', promptLang: 'Telugu (తెలుగులో)' };
  }
  if (/[\u0A80-\u0AFF]/.test(clean)) {
    return { langCode: 'gu', langName: 'Gujarati (ગુજરાતી)', promptLang: 'Gujarati (ગુજરાતીમાં)' };
  }

  // 2. Romanized vocabulary checks (Hinglish & Roman Punjabi)
  const lower = clean.toLowerCase();

  const punjabiKeywords = [
    'mainu', 'tuhanu', 'assi', 'tussi', 'tusi', 'kiven', 'kiwe', 'kado', 'kithe', 'kinna',
    'kinne', 'kinni', 'kehra', 'kehri', 'chahida', 'chahidi', 'chahide', 'dasso', 'daso',
    'karobar', 'pind', 'pinda', 'ditti', 'jandi', 'haiji', 'hovega', 'hovegi', 'veere',
    'bhaji', 'bai', 'paji', 'satshriakal', 'satsriakal', 'laiye', 'laho', 'eh', 'kardi', 'karda', 'karde', 'dasna'
  ];
  let punjabiMatches = 0;
  for (const w of punjabiKeywords) {
    if (new RegExp(`\\b${w}\\b`, 'i').test(lower)) punjabiMatches++;
  }

  const hinglishKeywords = [
    'bhai', 'bhaiya', 'namaste', 'namaskar', 'pranam', 'mujhe', 'mera', 'meri',
    'mere', 'hum', 'humein', 'hamara', 'hamari', 'hamare', 'apna', 'apni', 'apne', 'kya',
    'kaise', 'kare', 'karein', 'karo', 'karna', 'karni', 'karne', 'karta', 'karti', 'karte',
    'hoga', 'hogi', 'honge', 'tha', 'thi', 'chahiye', 'milega',
    'milegi', 'milenge', 'milta', 'milti', 'milte', 'milna', 'batao', 'bataye', 'batayein',
    'bataiye', 'batana', 'suno', 'dekho', 'lena', 'lenge', 'sakta',
    'sakte', 'sakti', 'dukan', 'dukaan', 'vyapar', 'karobar', 'kisan', 'krishi', 'kheti',
    'mahila', 'aurat', 'ladki', 'yuvak', 'chhatra', 'padhai', 'shiksha', 'paise', 'paisa',
    'rupaye', 'rupiya', 'dastavez', 'kagaz', 'praman',
    'patra', 'aavedan', 'yojana', 'yojna', 'sarkar', 'sarkari', 'pradhanmantri',
    'mukhyamantri', 'mudra', 'pmegp', 'vishwakarma', 'svanidhi', 'anudan', 'chhoot', 'byaj',
    'khata', 'kholna', 'kholni', 'kholne', 'shuru', 'kaun', 'konsi', 'kaunsi',
    'kis', 'kisko', 'kitna', 'kitni', 'kitne', 'lagta', 'bhasa', 'bhasha', 'uttar', 'sawal',
    'madad', 'sahayata'
  ];
  let hinglishMatches = 0;
  for (const w of hinglishKeywords) {
    if (new RegExp(`\\b${w}\\b`, 'i').test(lower)) hinglishMatches++;
  }

  if (punjabiMatches > hinglishMatches && punjabiMatches > 0) {
    return { langCode: 'pa', langName: 'Punjabi (ਪੰਜਾਬੀ)', promptLang: 'Punjabi (ਪੰਜਾਬੀ ਵਿੱਚ)' };
  }

  if (hinglishMatches > 0) {
    return { langCode: 'hi', langName: 'Hindi (हिंदी)', promptLang: 'Hindi (हिंदी में स्पष्ट रूप से)' };
  }

  if (requestedLang === 'hi' || requestedLang === 'Hindi') {
    return { langCode: 'hi', langName: 'Hindi (हिंदी)', promptLang: 'Hindi (हिंदी में)' };
  }
  if (requestedLang === 'pa' || requestedLang === 'Punjabi') {
    return { langCode: 'pa', langName: 'Punjabi (ਪੰਜਾਬੀ)', promptLang: 'Punjabi (ਪੰਜਾਬੀ ਵਿੱਚ)' };
  }

  return { langCode: 'en', langName: 'English', promptLang: 'English' };
};

/**
 * Strict Domain Scope Evaluator
 * Checks whether query pertains to Government Schemes, Business/Student Finance,
 * Document Verification, Application Tracking, or Platform Operations.
 */
const evaluateDomainScope = (query = '') => {
  const q = query.toLowerCase().trim();
  if (!q) return { isDomain: false, reason: 'EMPTY' };

  // 1. Explicit Out-of-Domain topics (sports, cooking, coding, movies, non-scheme trivia, random banter)
  const outOfDomainPatterns = [
    /\b(cricket|ipl|football|fifa|messi|ronaldo|world cup|match score|batting|bowling)\b/i,
    /\b(recipe|cake|cook|cooking|biryani|paneer|pizza|burger|bake|kitchen)\b/i,
    /\b(python|javascript|react|html|css|c\+\+|coding|write a code|write a script|algorithm|program)\b/i,
    /\b(movie|cinema|actor|actress|hollywood|bollywood|song|lyrics|singer|album)\b/i,
    /\b(capital of|speed of light|quantum|black hole|solar system|planets|astronomy)\b/i,
    /\b(tell me a joke|tell me a story|write a poem|shayari|love letter)\b/i,
    /\b(who won the|history of rome|french revolution|weather forecast)\b/i
  ];

  for (const pattern of outOfDomainPatterns) {
    if (pattern.test(q)) {
      // Check if it's explicitly tied to a scheme (e.g. "cooking business loan" or "food processing")
      if (!/\b(scheme|yojana|loan|subsidy|business|mudra|pmegp|pmfme|fund|dpr)\b/i.test(q)) {
        return { isDomain: false, reason: 'OUT_OF_DOMAIN_TOPIC' };
      }
    }
  }

  // 2. Greetings and Identity (Always in domain for polite interaction)
  const greetingPatterns = [
    /\b(hi|hello|hey|namaste|namaskar|pranam|satshriakal|good morning|good afternoon|good evening)\b/i,
    /\b(who are you|what is your name|aap kaun ho|tum kaun ho|tussi kaun ho)\b/i,
    /\b(help|help me|madad|kya kar sakte ho|what can you do)\b/i
  ];
  for (const pattern of greetingPatterns) {
    if (pattern.test(q)) return { isDomain: true, type: 'GREETING' };
  }

  // 3. Platform & Website Operations Keywords
  const platformKeywords = [
    'yojna', 'drishti', 'yojnasetu', 'website', 'site', 'portal', 'platform', 'app', 'system',
    'kaam', 'working', 'process', 'feature', 'features', 'flow', 'steps', 'how does', 'kaise kaam',
    'track', 'tracking', 'status', 'stage', 'stages', 'pfms', 'sanction', 'disbursal', 'release',
    'wizard', 'match', 'readiness', 'score', 'ml', 'calculator',
    'docverifier', 'document', 'ocr', 'verify', 'verification', 'aadhaar', 'pan', 'income certificate',
    'scholarsetu', 'scholarship', 'student', 'school', 'college', 'vidyarthi', 'chhatravritti',
    'provider', 'csr', 'corporate', 'organization', 'kyb', 'partner', 'bank', 'branch',
    'sponsor', 'sponsorship', 'campaign', 'artisan', 'crowdfunding',
    'admin', 'audit', 'nodal'
  ];
  for (const kw of platformKeywords) {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(q) || q.includes(kw)) {
      return { isDomain: true, type: 'PLATFORM_OPERATION' };
    }
  }

  // 4. Scheme & Government Benefit Keywords
  const schemeKeywords = [
    'scheme', 'schemes', 'yojana', 'yojna', 'loan', 'loans', 'subsidy', 'subsidies', 'grant', 'grants',
    'credit', 'collateral', 'guarantee', 'interest', 'byaj', 'chhoot', 'anudan', 'paisa', 'paise', 'fund',
    'pmegp', 'mudra', 'vishwakarma', 'stand-up', 'standup', 'pmfme', 'svanidhi', 'cgtmse', 'startup',
    'aspire', 'sfurti', 'kvic', 'msme', 'nabard', 'nsp',
    'shop', 'dukan', 'dukaan', 'retail', 'kirana', 'business', 'vyapar', 'karobar', 'startup', 'store',
    'kisan', 'krishi', 'dairy', 'poultry', 'fisheries', 'farming', 'food processing', 'tailor', 'darzi',
    'silai', 'artisan', 'karigar', 'weaver', 'bunkar', 'carpenter', 'badhai', 'barber', 'potter',
    'mahila', 'woman', 'women', 'female', 'sc', 'st', 'obc', 'minority', 'youth', 'yuva',
    'apply', 'aavedan', 'registration', 'panjikaran', 'form', 'paper', 'dastavez', 'eligibility', 'patrata'
  ];
  for (const kw of schemeKeywords) {
    if (new RegExp(`\\b${kw}\\b`, 'i').test(q) || q.includes(kw)) {
      return { isDomain: true, type: 'SCHEME_FINANCE' };
    }
  }

  // If query is very short or unclear, assume in-domain query to offer help
  if (q.split(/\s+/).length <= 3) {
    return { isDomain: true, type: 'BRIEF_INQUIRY' };
  }

  return { isDomain: false, reason: 'OUT_OF_DOMAIN_UNMATCHED' };
};

/**
 * Polite Out-of-Domain Apology Builder
 */
const getPoliteDomainApology = (langCode = 'en') => {
  if (langCode === 'hi') {
    return `क्षमा करें, मैं केवल **योजना दृष्टि** पोर्टल की कार्यप्रणाली, सरकारी योजनाओं (ऋण, सब्सिडी, अनुदान, छात्रवृत्ति), दस्तावेज़ सत्यापन (OCR) और आवेदन ट्रैकिंग से जुड़े विषयों में सहायता करने के लिए अधिकृत हूँ।

कृपया सरकारी योजनाओं, व्यावसायिक सहायता, छात्रवृत्ति या इस पोर्टल के उपयोग से संबंधित कोई भी प्रश्न पूछें — मुझे आपकी मदद करने में बहुत खुशी होगी!`;
  }
  if (langCode === 'pa') {
    return `ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਸਿਰਫ਼ **Yojna दृष्टि** ਪੋਰਟਲ, ਸਰਕਾਰੀ ਸਕੀਮਾਂ (ਕਰਜ਼ੇ, ਸਬਸਿਡੀਆਂ, ਵਜ਼ੀਫ਼ੇ), ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ ਅਤੇ ਅਰਜ਼ੀ ਟਰੈਕਿੰਗ ਨਾਲ ਸਬੰਧਤ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦੇਣ ਲਈ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਹਾਂ।

ਕਿਰਪਾ ਕਰਕੇ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਜਾਂ ਇਸ ਪੋਰਟਲ ਦੀ ਵਰਤੋਂ ਬਾਰੇ ਪੁੱਛੋ — ਮੈਨੂੰ ਤੁਹਾਡੀ ਮਦਦ ਕਰਨ ਵਿੱਚ ਖੁਸ਼ੀ ਹੋਵੇਗੀ!`;
  }
  return `I apologize, but I am specifically authorized to assist with **Yojna दृष्टि** platform operations, government financial schemes (loans, subsidies, grants, scholarships), AI document verification, and PFMS application tracking.

Please feel free to ask any question regarding central or state government schemes, business eligibility, or navigating this portal, and I will be delighted to guide you!`;
};

/**
 * Dynamic Platform Workings Knowledge Generator
 * Answers queries about how Yojna दृष्टि works, its 8-stage tracking, DocVerifier, ScholarSetu, etc.
 */
const generatePlatformProcessAnswer = (query = '', langCode = 'en') => {
  const q = query.toLowerCase();

  // 1. 8-Stage Tracking / PFMS / Status
  if (q.includes('track') || q.includes('stage') || q.includes('pfms') || q.includes('status') || q.includes('disburs') || q.includes('sanction') || q.includes('स्टेटस') || q.includes('ट्रैक')) {
    if (langCode === 'hi') {
      return `**योजना दृष्टि 8-चरणीय पारदर्शी आवेदन ट्रैकिंग प्रणाली (/track):**

हमारा पोर्टल किसी भी सरकारी योजना या ऋण आवेदन को 8 स्पष्ट चरणों में ट्रैक करता है:

1. **चरण 1: आवेदन जमा (Application Submitted)** — नागरिक द्वारा प्रारंभिक विवरण और दस्तावेज जमा।
2. **चरण 2: दस्तावेज़ सत्यापन (Document Verification)** — AI OCR और नोडल अधिकारी द्वारा प्रामाणिकता की जांच।
3. **चरण 3: विभागीय समीक्षा (Department Review & Inspection)** — उद्योग विभाग द्वारा भौतिक या तकनीकी मूल्यांकन।
4. **चरण 4: स्वीकृति पत्र जारी (Sanction Generated)** — औपचारिक स्वीकृति पत्र (Sanction Letter) जारी।
5. **चरण 5: PFMS प्रोसेसिंग (PFMS Processing)** — केंद्र/राज्य ट्रेजरी PFMS ट्रैकिंग आईडी जनरेट होना।
6. **चरण 6: फंड रिलीज (Fund Released)** — सरकार द्वारा सब्सिडी/अनुदान राशि ट्रेजरी से रिलीज।
7. **चरण 7: बैंक डिस्बर्सल (Bank Disbursal)** — नोडल बैंक द्वारा स्वीकृत ऋण राशि नागरिक के खाते में क्रेडिट।
8. **चरण 8: लाभ प्राप्ति (Benefit Received)** — संयंत्र/मशीनरी स्थापना और माइलस्टोन पूर्ण।

💡 **वित्तीय स्पष्टता**: पोर्टल **Sanctioned Amount** (स्वीकृत राशि), **Released Amount** (जारी राशि) और **Disbursed Amount** (खाते में प्राप्त राशि) को अलग-अलग पारदर्शी रूप से दिखाता है।`;
    }
    if (langCode === 'pa') {
      return `**Yojna दृष्टि 8-ਪੜਾਵੀ ਪਾਰਦਰਸ਼ੀ ਅਰਜ਼ੀ ਟਰੈਕਿੰਗ ਸਿਸਟਮ (/track):**

ਸਾਡਾ ਪੋਰਟਲ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਅਤੇ ਕਰਜ਼ਿਆਂ ਨੂੰ 8 ਸਪਸ਼ਟ ਪੜਾਵਾਂ ਵਿੱਚ ਟਰੈਕ ਕਰਦਾ ਹੈ:
1. ਅਰਜ਼ੀ ਜਮ੍ਹਾਂ (Application Submitted)
2. ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ (Document Verification via AI OCR)
3. ਵਿਭਾਗੀ ਸਮੀਖਿਆ (Department Review)
4. ਮਨਜ਼ੂਰੀ ਪੱਤਰ (Sanction Generated)
5. PFMS ਟ੍ਰੈਜ਼ਰੀ ਪ੍ਰੋਸੈਸਿੰਗ (PFMS Processing)
6. ਫੰਡ ਜਾਰੀ (Fund Released)
7. ਬੈਂਕ ਡਿਸਬਰਸਲ (Bank Disbursal to Account)
8. ਲਾਭ ਪ੍ਰਾਪਤੀ (Benefit Received)

ਤੁਸੀਂ **'Sync Government Status (PFMS)'** ਬਟਨ 'ਤੇ ਕਲਿੱਕ ਕਰਕੇ ਲਾਈਵ ਅੱਪਡੇਟ ਵੇਖ ਸਕਦੇ ਹੋ।`;
    }
    return `**Yojna दृष्टि 8-Stage Transparent Tracking Architecture (/track):**

Our platform tracks every government scheme or enterprise loan through 8 tamper-evident lifecycle stages:

1. **Stage 1: Application Submitted** — Citizen profile & initial application logged.
2. **Stage 2: Document Verification** — Verified by AI OCR engine and nodal officers.
3. **Stage 3: Department Review & Inspection** — Technical & economic feasibility assessment.
4. **Stage 4: Sanction Generated** — Formal sanction letter generated with approved financial limit.
5. **Stage 5: PFMS Processing** — Direct Public Financial Management System (PFMS) tracking ID assigned.
6. **Stage 6: Fund Released** — Capital subsidy / grant quota released by Government Treasury.
7. **Stage 7: Bank Disbursal** — Partner nodal bank credits funds directly into applicant's account.
8. **Stage 8: Benefit Received / Milestone Complete** — Equipment procured and utilization certificate logged.

💡 **Financial Separation**: The platform transparently tracks **Sanctioned Amount**, **Released Amount**, and **Disbursed Amount** independently to eliminate corruption.`;
  }

  // 2. Scheme Discovery Wizard & ML Readiness Score
  if (q.includes('wizard') || q.includes('score') || q.includes('match') || q.includes('readiness') || q.includes('विज़ार्ड') || q.includes('स्कोर') || q.includes('पात्रता')) {
    if (langCode === 'hi') {
      return `**योजना डिस्कवरी विज़ार्ड और ML स्कोरिंग प्रणाली (/wizard):**

1. **4-चरणीय स्मार्ट प्रोफाइलिंग**:
   - **व्यक्तिगत विवरण**: जाति श्रेणी (SC/ST/OBC/General), लिंग, आयु, राज्य और दिव्यांगता स्थिति।
   - **व्यवसाय विवरण**: क्षेत्र (फूड प्रोसेसिंग, विनिर्माण, रिटेल, टेक्सटाइल), उद्यम का प्रकार और चरण।
   - **वित्तीय आवश्यकता**: आवश्यक लोन राशि, अनुमानित वार्षिक टर्नओवर और क्रेडिट/CIBIL स्कोर।
   - **दस्तावेज़ स्थिति**: आपके पास उपलब्ध कागजात (आधार, पैन, उद्यम, प्रोजेक्ट रिपोर्ट)।

2. **AI & ML स्कोरिंग इंजन**:
   - **Scheme Match Compatibility (0-100%)**: आपके प्रोफाइल के आधार पर केंद्र और राज्य की सभी 15+ योजनाओं से मिलान।
   - **Credit Readiness Index**: बैंक ऋण स्वीकृति की संभावना और सब्सिडी प्राप्त करने की तैयारी का अनुमानित स्तर।
   - **Nearby Bank Partners**: आपके जिले में निकटतम सत्यापित बैंक शाखाएं और Common Service Centres (CSC) दिखाता है।`;
    }
    return `**Citizen Scheme Discovery Wizard & ML Scoring Engine (/wizard):**

1. **4-Step Guided Profiling**:
   - Captures social demographic profile (Gender, Category, Age, State).
   - Enterprise specifics (Sector: Food processing, Manufacturing, Retail, Handicrafts; Stage: New or Expansion).
   - Financial needs (Loan requirement, Projected turnover, Credit/CIBIL score).
   - Available documentation readiness.

2. **Algorithmic Evaluation**:
   - **Scheme Compatibility Engine**: Matches rules across all 15+ Central & State schemes.
   - **ML Credit Readiness Index**: Estimates bank loan feasibility and subsidy eligibility probability.
   - **Bank Branch Geolocation**: Identifies nearby verified public sector bank branches (PSBs) and CSC centres using Haversine distance calculations.`;
  }

  // 3. Document Verification / DocVerifier AI OCR
  if (q.includes('docverifier') || q.includes('ocr') || q.includes('document') || q.includes('dastavez') || q.includes('कागज') || q.includes('सत्यापन') || q.includes('दस्तावेज')) {
    if (langCode === 'hi') {
      return `**DocVerifier — AI दस्तावेज़ सत्यापन स्टूडियो (/document-verification):**

- **स्वचालित AI OCR**: आधार कार्ड, पैन कार्ड, आय प्रमाण पत्र, जाति प्रमाण पत्र और उद्यम रजिस्ट्रेशन प्रमाण पत्र की डिजिटल स्कैनिंग और टेक्स्ट निष्कर्षण।
- **मिसिंग दस्तावेज़ चेकलिस्ट**: चुनी गई सरकारी योजना (जैसे PMEGP या मुद्रा) के अनुसार आवश्यक कागजातों की रीयल-टाइम जांच करता है और बताता है कि कौन सा दस्तावेज बाकी है।
- **सुरक्षा व गोपनीयता**: सभी दस्तावेज सुरक्षित एन्क्रिप्शन के साथ प्रोसेस होते हैं और केवल आधिकारिक सत्यापन हेतु उपयोग किए जाते हैं।`;
    }
    return `**DocVerifier — AI Document Verification Studio (/document-verification):**

- **Automated AI OCR Engine**: Extracts and cross-references data from Aadhaar, PAN Cards, Income Certificates, Caste Certificates, and Udyam Registration.
- **Dynamic Scheme Checklist**: Automatically computes the exact required document checklist based on chosen schemes (e.g., PMEGP DPR requirements vs MUDRA identity requirements).
- **Audit & Privacy**: Encrypted processing with immutable audit logs ensuring complete data integrity.`;
  }

  // 4. ScholarSetu (Student Portal)
  if (q.includes('scholarsetu') || q.includes('scholarship') || q.includes('student') || q.includes('विद्यार्थी') || q.includes('छात्रवृत्ति') || q.includes('स्कॉलर')) {
    if (langCode === 'hi') {
      return `**ScholarSetu — विद्यार्थी वित्तीय अवसर पोर्टल (/scholarsetu):**

- **विशेष रूप से छात्रों हेतु**: प्री-मैट्रिक, पोस्ट-मैट्रिक, उच्च शिक्षा और बालिका प्रोत्साहन छात्रवृत्तियों की सीधी पात्रता जांच।
- **पारदर्शी मानदंड**: पारिवारिक आय सीमा, पिछले शैक्षणिक अंक, और श्रेणी (SC/ST/OBC/Minority/EWS) के अनुसार राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) की योजनाओं से सीधा मिलान।
- **आवेदन सुविधा**: छात्र बिना किसी बिचौलिए के सही सरकारी छात्रवृत्ति खोजकर सीधे आवेदन कर सकते हैं।`;
    }
    return `**ScholarSetu — Student Financial Opportunity Portal (/scholarsetu):**

- **Dedicated for Students**: Matches pre-matric, post-matric, higher education, and girl-child scholarships.
- **Criteria Matching**: Evaluates family income thresholds, academic marks, and affirmative action categories against National Scholarship Portal (NSP) programs.
- **Direct Access**: Eliminates middlemen by providing verified official application links.`;
  }

  // 5. Provider, CSR, Sponsorship & Admin Portals
  if (q.includes('provider') || q.includes('csr') || q.includes('sponsor') || q.includes('admin') || q.includes('प्रदाता') || q.includes('सीएसआर') || q.includes('एडमिन')) {
    if (langCode === 'hi') {
      return `**योजना दृष्टि संगठनात्मक व प्रशासनिक मॉड्यूल:**

1. **Provider & CSR पोर्टल (/provider)**:
   - कॉर्पोरेट CSR फाउंडेशन, NGO और ट्रस्ट अपनी CIN, PAN और CSR-1 रजिस्ट्रेशन के साथ पंजीकरण कर सकते हैं।
   - Two-tier KYB (Know Your Business) सत्यापन के बाद ही उन्हें ग्रांट और सब्सिडी पोस्ट करने की अनुमति मिलती है।

2. **Sponsorship माइक्रो-अभियान (/sponsorship)**:
   - ग्रामीण महिला समूहों, जनजातीय कारीगरों और छोटे चक्की/हथकरघा उद्यमियों हेतु पारदर्शी क्राउड-सपोर्ट लेजर।

3. **Admin Verification Studio (/admin)**:
   - सरकारी नोडल अधिकारी और ऑडिटर पार्टनर संगठनों, योजनाओं और दस्तावेजों की समीक्षा करके डिजिटल अप्रूवल या रिजेक्शन ऑडिट लॉग दर्ज करते हैं।`;
    }
    return `**Yojna दृष्टि Organizational & Admin Ecosystem:**

1. **Provider & CSR Portal (/provider)**:
   - CSR Foundations, NGOs, and Corporate donors register with CIN, PAN, and MCA Form CSR-1.
   - Undergoes rigorous Two-tier KYB verification before granting official partner credentials.

2. **Sponsorship Portal (/sponsorship)**:
   - Micro-funding campaigns supporting rural artisans, women cooperatives, and village entrepreneurs with a transparent contributions ledger.

3. **Admin Verification Studio (/admin)**:
   - Dedicated dashboard for government auditors and nodal officers to inspect dossiers, issue sanction audits, and maintain compliance records.`;
  }

  // 6. Complete Website Overview / General How it Works
  if (langCode === 'hi') {
    return `**योजना दृष्टि (Yojna दृष्टि) पोर्टल की सम्पूर्ण कार्यप्रणाली:**

'योजना दृष्टि' भारत सरकार और राज्य सरकारों की वित्तीय योजनाओं, ऋण, सब्सिडी और छात्रवृत्तियों को आम नागरिकों तक पारदर्शी तरीके से पहुंचाने वाला आधुनिक प्लेटफॉर्म है (टैगलाइन: *"Discover. Apply. Track."*)।

यह पोर्टल 5 मुख्य स्तंभों पर कार्य करता है:
1. **योजना डिस्कवरी विज़ार्ड (/wizard)**: अपनी प्रोफाइल (श्रेणी, आयु, व्यवसाय, आवश्यक पूंजी) दर्ज करें और AI से 15+ योजनाओं में से अपने लिए सबसे उपयुक्त योजना व ऋण रेडीनेस स्कोर पाएं।
2. **पारदर्शी 8-चरणीय ट्रैकिंग (/track)**: आवेदन से लेकर स्वीकृति (Sanction), ट्रेजरी फंड रिलीज (PFMS) और बैंक खाते में डिस्बर्सल तक की लाइव ट्रैकिंग।
3. **DocVerifier AI OCR (/document-verification)**: आधार, पैन और आय प्रमाण पत्र का तुरंत डिजिटल सत्यापन।
4. **ScholarSetu छात्र पोर्टल (/scholarsetu)**: विद्यार्थियों के लिए प्री/पोस्ट-मैट्रिक छात्रवृत्तियों की खोज।
5. **प्रदाता (CSR) व स्पॉन्सरशिप (/provider व /sponsorship)**: सत्यापित संस्थानों द्वारा अनुदान और ग्रामीण कारीगरों को सहायता।

आप इनमें से किसी भी सुविधा के बारे में विस्तार से पूछ सकते हैं!`;
  }

  if (langCode === 'pa') {
    return `**Yojna दृष्टि ਪੋਰਟਲ ਦੀ ਕਾਰਜਪ੍ਰਣਾਲੀ (Discover. Apply. Track.):**

'Yojna दृष्टि' ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ, ਸਬਸਿਡੀਆਂ ਅਤੇ ਕਰਜ਼ਿਆਂ ਨੂੰ ਨਾਗਰਿਕਾਂ ਤੱਕ ਆਸਾਨੀ ਨਾਲ ਪਹੁੰਚਾਉਣ ਵਾਲਾ ਪਲੇਟਫਾਰਮ ਹੈ।

ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ:
1. **ਯੋਜਨਾ ਖੋਜ ਵਿਜ਼ਾਰਡ (/wizard)**: ਆਪਣੀ ਯੋਗਤਾ ਅਨੁਸਾਰ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਲੱਭੋ।
2. **8-ਪੜਾਵੀ ਲਾਈਵ ਟਰੈਕਿੰਗ (/track)**: ਅਰਜ਼ੀ ਤੋਂ ਲੈ ਕੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ ਪੈਸੇ ਆਉਣ ਤੱਕ ਹਰ ਪੜਾਅ ਦੀ ਜਾਣਕਾਰੀ।
3. **AI ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ (/document-verification)**: ਆਧਾਰ, ਪੈਨ ਕਾਰਡ ਦੀ ਤੁਰੰਤ ਜਾਂਚ।
4. **ScholarSetu (/scholarsetu)**: ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਵਜ਼ੀਫ਼ਾ ਪੋਰਟਲ।
5. **CSR ਅਤੇ ਸਪਾਂਸਰਸ਼ਿਪ (/provider ਤੇ /sponsorship)**: ਕਾਰੋਬਾਰੀਆਂ ਅਤੇ ਕਾਰੀਗਰਾਂ ਲਈ ਸਹਾਇਤਾ।`;
  }

  return `**How Yojna दृष्टि Works (Discover. Apply. Track.):**

Yojna दृष्टि is an authoritative, end-to-end platform bridging citizens to Central & State government schemes, capital subsidies, and educational scholarships.

**Key Functional Pillars:**
1. **Citizen Scheme Discovery Wizard (/wizard)**: Enter your profile (Sector, Investment needed, Social category, State) to receive real-time compatibility match scores and an ML Credit Readiness Index across 15+ official schemes.
2. **8-Stage Transparent Tracking (/track)**: Track applications from preliminary submission through Department Inspection, Formal Sanction, PFMS Treasury release, to final Bank Account Disbursal.
3. **DocVerifier Studio (/document-verification)**: Instant AI OCR verification for Aadhaar, PAN, and Income certificates with automated missing document alerts.
4. **ScholarSetu Portal (/scholarsetu)**: Direct scholarship mapping for students based on academic performance and affirmative action quotas.
5. **Provider CSR & Sponsorship (/provider & /sponsorship)**: KYB-verified corporate grants and micro-sponsorships for rural grassroots entrepreneurs.`;
};

/**
 * Dynamic Scheme Knowledge Synthesizer
 * Dynamically matches schemes from mockSchemes database and formats rich answers
 */
const synthesizeDynamicSchemeAnswer = (query = '', langCode = 'en') => {
  const q = query.toLowerCase();

  // Search through all schemes in mockSchemes
  let matchedSchemes = mockSchemes.filter(s => {
    const sName = s.name.toLowerCase();
    const sSlug = s.slug.toLowerCase();
    const sDesc = (s.description || '').toLowerCase();
    const sSecs = (s.sectors || []).map(x => x.toLowerCase()).join(' ');
    const sBens = (s.targetBeneficiaries || []).map(x => x.toLowerCase()).join(' ');

    if (q.includes('mudra') || q.includes('मुद्रा')) return sSlug.includes('mudra');
    if (q.includes('pmegp') || q.includes('रोजगार सृजन')) return sSlug.includes('pmegp');
    if (q.includes('vishwakarma') || q.includes('विश्वकर्मा') || q.includes('artisan') || q.includes('कारीगर') || q.includes('दर्जी')) return sSlug.includes('vishwakarma');
    if (q.includes('stand-up') || q.includes('standup') || q.includes('स्टैंड-अप')) return sSlug.includes('stand-up');
    if (q.includes('food') || q.includes('pmfme') || q.includes('खाद्य') || q.includes('डेयरी')) return sSlug.includes('pmfme') || sSlug.includes('pmegp');
    if (q.includes('svanidhi') || q.includes('स्वनिधि') || q.includes('vendor') || q.includes('ठेला')) return sSlug.includes('svanidhi');
    if (q.includes('startup') || q.includes('सीड फंड')) return sSlug.includes('startup');
    if (q.includes('cgtmse') || q.includes('गारंटी ट्रस्ट')) return sSlug.includes('cgtmse');
    if (q.includes('mahila') || q.includes('woman') || q.includes('महिला')) return sSlug.includes('mahila') || sSlug.includes('stand-up') || sSlug.includes('pmegp');
    if (q.includes('shop') || q.includes('dukan') || q.includes('dukaan') || q.includes('किराना') || q.includes('दुकान')) return sSlug.includes('mudra') || sSlug.includes('pmegp') || sSlug.includes('svanidhi');
    if (q.includes('scholarship') || q.includes('student') || q.includes('छात्रवृत्ति')) return s.category === 'Scholarship';

    // Generic match
    return sName.split(' ').some(w => w.length > 3 && q.includes(w)) || sSecs.includes(q) || sBens.includes(q);
  });

  if (matchedSchemes.length === 0) {
    matchedSchemes = mockSchemes.slice(0, 4); // Default to top 4 flagship schemes
  }

  // Format dynamically in requested language
  if (langCode === 'hi') {
    let out = `**आपकी खोज के आधार पर सत्यापित सरकारी योजनाएं:**\n\n`;
    matchedSchemes.slice(0, 3).forEach((s, idx) => {
      out += `${idx + 1}. **${s.name}**:\n`;
      out += `   - **वित्तीय सहायता**: ₹${(s.maximumSupport / 100000).toFixed(1)} लाख तक (${s.fundingType || 'ऋण/सब्सिडी'})।\n`;
      if (s.subsidyPercentage) {
        out += `   - **सब्सिडी**: परियोजना लागत पर **${s.subsidyPercentage}% तक सरकारी अनुदान**।\n`;
      }
      if (s.interestRate) {
        out += `   - **ब्याज दर**: ${s.interestRate}% प्रति वर्ष (रियायती)।\n`;
      }
      out += `   - **पात्र क्षेत्र**: ${(s.sectors || ['सभी क्षेत्र']).slice(0, 4).join(', ')}।\n`;
      out += `   - **आवश्यक कागजात**: ${(s.requiredDocuments || ['आधार कार्ड', 'पैन कार्ड', 'उद्यम रजिस्ट्रेशन']).slice(0, 4).join(', ')}।\n\n`;
    });
    out += `💡 **आवेदन कैसे करें**: योजना दृष्टि के **Scheme Discovery Wizard (/wizard)** में अपनी प्रोफाइल भरें या संबंधित नोडल बैंक में संपर्क करें।`;
    return out;
  }

  if (langCode === 'pa') {
    let out = `**ਤੁਹਾਡੀ ਪੁੱਛਗਿੱਛ ਅਨੁਸਾਰ ਪ੍ਰਮਾਣਿਤ ਸਰਕਾਰੀ ਸਕੀਮਾਂ:**\n\n`;
    matchedSchemes.slice(0, 3).forEach((s, idx) => {
      out += `${idx + 1}. **${s.name}**:\n`;
      out += `   - **ਵਿੱਤੀ ਸਹਾਇਤਾ**: ₹${(s.maximumSupport / 100000).toFixed(1)} ਲੱਖ ਤੱਕ।\n`;
      if (s.subsidyPercentage) {
        out += `   - **ਸਬਸਿਡੀ**: **${s.subsidyPercentage}% ਤੱਕ ਸਰਕਾਰੀ ਗ੍ਰਾਂਟ**।\n`;
      }
      out += `   - **ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼**: ${(s.requiredDocuments || ['ਆਧਾਰ ਕਾਰਡ', 'ਪੈਨ ਕਾਰਡ']).slice(0, 3).join(', ')}।\n\n`;
    });
    out += `💡 **ਅਰਜ਼ੀ ਕਿਵੇਂ ਦੇਣੀ ਹੈ**: Yojna दृष्टि ਵਿਜ਼ਾਰਡ (/wizard) ਰਾਹੀਂ ਅਪਲਾਈ ਕਰੋ।`;
    return out;
  }

  // English
  let out = `**Verified Government Financial Schemes for Your Query:**\n\n`;
  matchedSchemes.slice(0, 3).forEach((s, idx) => {
    out += `${idx + 1}. **${s.name}**:\n`;
    out += `   - **Financial Limit**: Up to ₹${(s.maximumSupport / 100000).toFixed(1)} Lakh (${s.fundingType || 'Loan / Subsidy'}).\n`;
    if (s.subsidyPercentage) {
      out += `   - **Government Subsidy**: Up to **${s.subsidyPercentage}% capital subsidy**.\n`;
    }
    if (s.interestRate) {
      out += `   - **Subsidized Interest**: ${s.interestRate}% p.a.\n`;
    }
    out += `   - **Eligible Sectors**: ${(s.sectors || ['All eligible sectors']).slice(0, 4).join(', ')}.\n`;
    out += `   - **Documentation**: ${(s.requiredDocuments || ['Aadhaar', 'PAN', 'Project DPR']).slice(0, 4).join(', ')}.\n\n`;
  });
  out += `💡 **Next Steps**: Complete your profile in the **Scheme Discovery Wizard (/wizard)** or locate partner banks near you!`;
  return out;
};

module.exports = {
  detectLanguage,
  evaluateDomainScope,
  getPoliteDomainApology,
  generatePlatformProcessAnswer,
  synthesizeDynamicSchemeAnswer
};
