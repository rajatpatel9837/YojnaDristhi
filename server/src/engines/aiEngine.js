/**
 * Yojna दृष्टि — Comprehensive AI Citizen & Platform Knowledge Engine
 * 
 * Special Capabilities:
 * 1. Grassroots Citizen Support (गरीब और अनपढ़ नागरिकों की हर तरह से सहायता — नो पेपर्स, सिर्फ आधार कार्ड, अनपढ़, बैंक अस्वीकृति, रेहड़ी-पटरी, पशुपालन, घर, इलाज)
 * 2. Deep Platform Architecture (वेबसाइट कैसे काम करती है, 8-Stage Tracking, PFMS, DocVerifier OCR, ScholarSetu, Provider, Sponsorship)
 * 3. Dynamic Scheme Knowledge (15+ Central & State Schemes with live limits, subsidies, and DPRs)
 * 4. Universal Query Resolver (किसी भी रैंडम सवाल का समझदारी व सहानुभूति से जवाब देना और सरकारी सशक्तिकरण से जोड़ना)
 * 5. Same-Language Response (हिंदी, Hinglish, ਪੰਜਾਬੀ, English)
 */

const { mockSchemes } = require('../seed/seedData');

/**
 * 1. High-Accuracy Language & Script Detection
 */
const detectLanguage = (text = '', requestedLang = 'auto') => {
  const clean = String(text || '').trim();
  if (!clean) return { langCode: 'en', langName: 'English', promptLang: 'English' };

  // Unicode Script Checks
  if (/[\u0900-\u097F]/.test(clean)) return { langCode: 'hi', langName: 'Hindi (हिंदी)', promptLang: 'Hindi (हिंदी लिपि में)' };
  if (/[\u0A00-\u0A7F]/.test(clean)) return { langCode: 'pa', langName: 'Punjabi (ਪੰਜਾਬੀ)', promptLang: 'Punjabi (ਗੁਰਮੁਖੀ ਲਿਪੀ ਵਿੱਚ)' };
  if (/[\u0980-\u09FF]/.test(clean)) return { langCode: 'bn', langName: 'Bengali (বাংলা)', promptLang: 'Bengali (বাংলায়)' };
  if (/[\u0B80-\u0BFF]/.test(clean)) return { langCode: 'ta', langName: 'Tamil (தமிழ்)', promptLang: 'Tamil (தமிழில்)' };
  if (/[\u0C00-\u0C7F]/.test(clean)) return { langCode: 'te', langName: 'Telugu (తెలుగు)', promptLang: 'Telugu (తెలుగులో)' };
  if (/[\u0A80-\u0AFF]/.test(clean)) return { langCode: 'gu', langName: 'Gujarati (ગુજરાતી)', promptLang: 'Gujarati (ગુજરાતીમાં)' };

  const lower = clean.toLowerCase();

  // Punjabi Roman Vocabulary
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

  // Hinglish / Hindi Roman Vocabulary
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
    'madad', 'sahayata', 'garib', 'gareeb', 'anpadh', 'likhna', 'padhna', 'thela', 'rehri',
    'bakri', 'murgi', 'gai', 'bhains', 'ghar', 'chhat', 'ilaj', 'dawai', 'bimar', 'ration'
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
 * 2. Multi-Tier Semantic Intent Classifier
 */
const classifyQueryIntent = (query = '') => {
  const q = query.toLowerCase().trim();
  if (!q) return 'EMPTY';

  // A. Poor / Illiterate / Grassroots Assistance
  const grassrootsPatterns = [
    /\b(likhna|padhna|anpadh|illiterate|cannot write|cannot read|likhna nahi aata|padhna nahi aata|angutha)\b/i,
    /\b(koi paper nahi|koi kagaz nahi|no document|no papers|sirf aadhar|only aadhaar|aadhar card hi hai)\b/i,
    /\b(bank wale bhaga|bank mana|loan nahi dete|bank problem|bank manager|bribe|ghoos)\b/i,
    /\b(thela|rehri|patri|feri|street vendor|sabji|chai ki dukan|pani puri|chaat|fal bechna)\b/i,
    /\b(bakri|murgi|dairy|gai|bhains|pashupalan|poultry|goat|animal husbandry)\b/i,
    /\b(silai|silai machine|tailor|sewing|darzi|bunkar|weaver|karigar|artisan|vishwakarma)\b/i,
    /\b(ghar nahi|chhat tapak|kaccha ghar|jhopdi|awas|pmay|house loan)\b/i,
    /\b(bimar|ilaj|dawai|hospital|treatment|ayushman|medical|operation)\b/i,
    /\b(ration|anaj|khana|garib|gareeb|bhookh|roti|paisa nahi hai)\b/i,
    /\b(gaon me|panchayat|gram pradhan|sarpanch|kisse mile|kahan jaye)\b/i
  ];
  for (const p of grassrootsPatterns) {
    if (p.test(q)) return 'POOR_CITIZEN_SUPPORT';
  }

  // B. Platform & Website Working
  const platformPatterns = [
    /\b(website|portal|site|platform|yojna drishti|yojnasetu|app|kaise kaam|how does|process|working)\b/i,
    /\b(track|tracking|status|stage|8-stage|pfms|sanction|disbursal|disbursed|release)\b/i,
    /\b(wizard|score|eligibility|match|readiness|calculator)\b/i,
    /\b(docverifier|ocr|document verification|aadhaar verify|pan verify)\b/i,
    /\b(scholarsetu|scholarship portal|student portal)\b/i,
    /\b(provider|csr|corporate|kyb|partner bank|nearby|branch locator)\b/i,
    /\b(sponsor|sponsorship|crowdfund|artisan support)\b/i,
    /\b(admin|audit|nodal officer)\b/i,
    /\b(voice|bolkar|mic|microphone|awaaz)\b/i
  ];
  for (const p of platformPatterns) {
    if (p.test(q)) return 'PLATFORM_OPERATION';
  }

  // C. Greetings and Bot Identity
  const greetingPatterns = [
    /\b(hi|hello|hey|namaste|namaskar|pranam|satshriakal|good morning|good evening|good afternoon)\b/i,
    /\b(who are you|aap kaun ho|tum kaun ho|tussi kaun ho|what is your name)\b/i,
    /\b(kya kar sakte ho|what can you do|help me|madad karo)\b/i
  ];
  for (const p of greetingPatterns) {
    if (p.test(q)) return 'GREETING';
  }

  // D. Schemes & Finance Keywords
  const schemePatterns = [
    /\b(scheme|yojana|yojna|loan|subsidy|grant|credit|byaj|interest|pmegp|mudra|vishwakarma|pmfme|svanidhi|stand-up|startup|cgtmse|kisan|kcc)\b/i,
    /\b(dukan|dukaan|shop|store|business|vyapar|karobar|startup|factory|udyam|msme)\b/i,
    /\b(mahila|woman|women|female|sc|st|obc|minority|youth|yuva|student|scholarship)\b/i,
    /\b(apply|aavedan|form|registration|panjikaran|dastavez|kagaz)\b/i
  ];
  for (const p of schemePatterns) {
    if (p.test(q)) return 'SCHEME_FINANCE';
  }

  // E. Random Life / Curiosity Queries (General questions)
  return 'GENERAL_LIFE_AND_CURIOSITY';
};

/**
 * 3. Compassionate Grassroots Assistance for Poor & Illiterate Citizens
 * (गरीब, अनपढ़ और बिना कागजात वाले नागरिकों के लिए विशेष सरल मार्गदर्शन)
 */
const generatePoorCitizenGuidance = (query = '', langCode = 'hi') => {
  const q = query.toLowerCase();

  // A. Illiterate / Cannot read or write (लिखना-पढ़ना नहीं आता)
  if (q.includes('likhna') || q.includes('padhna') || q.includes('anpadh') || q.includes('illiterate') || q.includes('cannot write') || q.includes('angutha')) {
    if (langCode === 'pa') {
      return `**ਪਿਆਰੇ ਵੀਰ/ਭੈਣ, ਤੁਹਾਨੂੰ ਲਿਖਣ-ਪੜ੍ਹਨ ਦੀ ਬਿਲਕੁਲ ਲੋੜ ਨਹੀਂ ਹੈ! ਸਰਕਾਰ ਅਤੇ ਸਾਡਾ ਪੋਰਟਲ ਤੁਹਾਡੀ ਇਸ ਤਰ੍ਹਾਂ ਮਦਦ ਕਰੇਗਾ:**

1. **ਆਵਾਜ਼ ਨਾਲ ਗੱਲ ਕਰੋ (Voice Assistant)**:
   - ਸਕ੍ਰੀਨ ਦੇ ਹੇਠਾਂ ਦਿੱਤੇ **ਮਾਈਕ (🎙️)** ਬਟਨ ਨੂੰ ਦਬਾਓ ਅਤੇ ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਬੋਲੋ। ਸਾਡਾ ਸਹਾਇਕ ਤੁਹਾਨੂੰ ਬੋਲ ਕੇ ਹੀ ਸਾਰੀ ਜਾਣਕਾਰੀ ਸੁਣਾਵੇਗਾ।

2. **ਪਿੰਡ ਦੇ ਸਾਂਝੇ ਸੇਵਾ ਕੇਂਦਰ (CSC / Jan Seva Kendra) ਜਾਓ**:
   - ਆਪਣੇ ਪਿੰਡ ਜਾਂ ਨੇੜਲੇ ਕਸਬੇ ਦੇ **ਜਨ ਸੇਵਾ ਕੇਂਦਰ (CSC)** ਜਾਓ।
   - ਉੱਥੇ ਸਿਰਫ਼ ਆਪਣਾ ਆਧਾਰ ਕਾਰਡ ਦਿਓ, ਕੇਂਦਰ ਦਾ ਆਪਰੇਟਰ ₹20-30 ਦੀ ਸਰਕਾਰੀ ਫੀਸ 'ਤੇ ਤੁਹਾਡਾ ਪੂਰਾ ਫਾਰਮ ਕੰਪਿਊਟਰ 'ਤੇ ਭਰ ਦੇਵੇਗਾ।

3. **ਬੈਂਕ ਸਖੀ / ਬੈਂਕ ਮਿੱਤਰ ਨਾਲ ਮਿਲੋ**:
   - ਪਿੰਡ ਦੀ ਪੰਚਾਇਤ ਜਾਂ ਸਵੈ-ਸਹਾਇਤਾ ਸਮੂਹ (SHG) ਦੀ **ਬੈਂਕ ਸਖੀ** ਨਾਲ ਮਿਲੋ। ਉਹ ਅੰਗੂਠਾ ਲਗਵਾ ਕੇ ਤੁਹਾਡਾ ਖਾਤਾ ਖੋਲ੍ਹਣ ਅਤੇ ਲੋਨ ਦਿਵਾਉਣ ਵਿੱਚ ਪੂਰੀ ਮਦਦ ਕਰਦੀ ਹੈ।`;
    }
    return `**प्रिय नागरिक, अगर आपको पढ़ना-लिखना नहीं आता तो बिल्कुल चिंता मत कीजिए! सरकार और हमारा पोर्टल आपकी पूरी मदद करेगा:**

1. **इस वेबसाइट पर बोलकर बात करें (आवाज़ से मदद)**:
   - आपको कुछ भी टाइप नहीं करना है! नीचे दिए गए **माइक (🎙️)** के बटन को एक बार दबाएं और अपनी भाषा में बोलें। मैं आपकी बात सुनकर **बोलकर ही जवाब दूंगा**।

2. **गाँव के 'जन सेवा केंद्र' (CSC / ग्राहक सेवा केंद्र) जाएं**:
   - अपने गाँव या पास के बाज़ार में **CSC / जन सेवा केंद्र** पर जाएं।
   - वहाँ केवल अपना **आधार कार्ड** और बैंक पासबुक लेकर जाएं। संचालक कंप्यूटर पर आपका सरकारी फॉर्म भर देगा (इसकी सरकारी फीस मात्र ₹20-30 होती है)।

3. **'बैंक सखी' या 'बैंक मित्र' से मिलें**:
   - अपने गाँव की पंचायत या महिला स्वयं सहायता समूह (SHG) की **बैंक सखी** से मिलें।
   - वे बायोमेट्रिक मशीन पर आपका **अंगूठा लगवाकर** आपका खाता खोल देंगी और लोन का आवेदन करवा देंगी।

💡 **सलाह**: किसी भी अनजान व्यक्ति या दलाल को पैसे न दें। सरकारी योजनाओं का आवेदन पूरी तरह पारदर्शी है।`;
  }

  // B. No documents or Only Aadhaar Card (कागजात नहीं हैं या सिर्फ आधार कार्ड है)
  if (q.includes('koi paper nahi') || q.includes('koi kagaz nahi') || q.includes('no document') || q.includes('sirf aadhar') || q.includes('only aadhaar') || q.includes('aadhar card hi hai')) {
    return `**अगर आपके पास ज्यादा कागजात नहीं हैं और केवल आधार कार्ड है, तो ये 3 बड़ी योजनाएं आपके लिए हैं:**

1. **PM स्वनिधि योजना (PM SVANidhi — रेहड़ी, ठेला, छोटे दुकानदारों हेतु)**:
   - **ऋण राशि**: **₹10,000 से ₹50,000 तक** बिना किसी गारंटी (No Collateral)।
   - **दस्तावेज़**: केवल **आधार कार्ड** और बैंक पासबुक। किसी जमीन, इनकम टैक्स या गारंटर की ज़रूरत नहीं है।
   - **ब्याज**: समय पर चुकाने पर 7% की ब्याज छूट और ₹1,200 सालाना कैशबैक।

2. **PM विश्वकर्मा योजना (कारीगरों व दस्तकारों हेतु)**:
   - **सहायता**: **₹15,000 का मुफ्त टूलकिट वाउचर** + **₹3 लाख तक का लोन** मात्र 5% ब्याज पर।
   - **पात्र**: दर्जी, बढ़ई, नाई, मोची, कुम्हार, लोहार, राजमिस्त्री, धोबी, मालाकार आदि।
   - **कागजात**: केवल आधार कार्ड और मोबाइल नंबर।

3. **मुद्रा शिशु लोन (MUDRA Shishu Loan)**:
   - **ऋण राशि**: ₹50,000 तक का बिजनेस लोन।
   - **कागजात**: आधार कार्ड, पैन कार्ड (यदि हो) और 6 महीने की बैंक पासबुक।`;
  }

  // C. Street Vendors / Thela / Rehri / Feri (रेहड़ी-पटरी, ठेला, फेरीवाले)
  if (q.includes('thela') || q.includes('rehri') || q.includes('patri') || q.includes('feri') || q.includes('vendor') || q.includes('sabji') || q.includes('chai')) {
    return `**सब्जी, फल, चाय, नाश्ता, चाट या ठेला-पटरी लगाने वाले भाइयों के लिए योजना:**

- **योजना का नाम**: **प्रधानमंत्री स्वनिधि योजना (PM SVANidhi)**
- **कितना पैसा मिलता है**:
  - पहली बार में: **₹10,000**
  - समय पर चुकाने पर: **₹20,000**
  - तीसरी बार में: **₹50,000**
- **विशेष लाभ**:
  - कोई बैंक गारंटी या संपत्ति गिरवी नहीं रखनी होती।
  - अगर आप फोनपे/गूगलपे से डिजिटल पेमेंट लेते हैं, तो सरकार ₹100 प्रति माह (₹1,200/साल) अतिरिक्त कैशबैक देती है।
- **कहाँ जाना होगा**:
  - अपने नगर निगम / नगर पालिका / ग्राम पंचायत के टाउन वेंडिंग सेल में जाएं, या नजदीकी सरकारी बैंक (SBI, PNB, Bank of Baroda) में जाकर कहें: *"मुझे PM स्वनिधि का फॉर्म भरना है"*, या किसी CSC केंद्र से आवेदन करवाएं।`;
  }

  // D. Animal Husbandry / Dairy / Bakri / Murgi (पशुपालन, बकरी पालन, मुर्गी पालन, डेयरी)
  if (q.includes('bakri') || q.includes('murgi') || q.includes('dairy') || q.includes('gai') || q.includes('bhains') || q.includes('pashu') || q.includes('goat') || q.includes('poultry')) {
    return `**बकरी पालन, मुर्गी पालन और डेयरी (गाय-भैंस) के लिए सरकारी योजनाएं:**

1. **पशुपालन किसान क्रेडिट कार्ड (Pashupalan KCC)**:
   - गाय/भैंस, बकरी (10+1 यूनिट) या मुर्गी पालन के लिए **₹2 लाख तक का लोन बिना किसी जमीन के** केवल 4% ब्याज पर मिलता है।
   - इसका फॉर्म अपने ब्लॉक के **पशु चिकित्सालय (Veterinary Hospital)** या बैंक से मिलता है।

2. **राष्ट्रीय पशुधन मिशन (NLM — National Livestock Mission)**:
   - बकरी पालन / मुर्गी फार्मिंग प्रोजेक्ट पर सरकार **50% तक की भारी सब्सिडी (अनुदान)** देती है।

3. **डेयरी उद्यमिता विकास (DEDS / PMEGP Dairy)**:
   - दुग्ध प्रोसेसिंग या छोटी डेयरी यूनिट लगाने के लिए PMEGP के तहत 35% सरकारी सब्सिडी उपलब्ध है।`;
  }

  // E. Tailoring / Silai Machine (सिलाई मशीन / दर्जी / हस्तशिल्प)
  if (q.includes('silai') || q.includes('tailor') || q.includes('darzi') || q.includes('kapde') || q.includes('machine')) {
    return `**सिलाई का काम करने वाली महिलाओं और दर्जियों के लिए सरकारी मदद:**

- **योजना**: **PM विश्वकर्मा योजना (दर्जी वर्ग / Tailor Category)**
- **फायदे**:
  1. **₹15,000 का मुफ्त वाउचर**: जिससे आप आधुनिक सिलाई मशीन और उपकरण खरीद सकते हैं (यह पैसा वापस नहीं करना होता)।
  2. **मुफ्त ट्रेनिंग**: 5 से 15 दिनों की आधुनिक सिलाई ट्रेनिंग + **₹500 प्रतिदिन का स्टाइपेंड (खर्चा)**।
  3. **कम ब्याज पर लोन**: सिलाई की दुकान या बुटीक खोलने के लिए **₹3 लाख तक का लोन** केवल 5% ब्याज पर।
- **आवेदन कैसे करें**: नजदीकी जन सेवा केंद्र (CSC) जाएं और अपना आधार कार्ड देकर PM विश्वकर्मा पोर्टल (pmvishwakarma.gov.in) पर दर्जी वर्ग में पंजीकरण कराएं।`;
  }

  // F. Bank refusal / Bank Turn Away (बैंक वाले मना कर रहे हैं)
  if (q.includes('bank') && (q.includes('bhaga') || q.includes('mana') || q.includes('nahi dete') || q.includes('problem'))) {
    return `**अगर बैंक वाले आपको लोन देने से मना कर रहे हैं या टरका रहे हैं, तो ये 4 कदम उठाएं:**

1. **लिखित में कारण (Reason in Writing) मांगें**:
   - बैंक मैनेजर से विनम्रता से कहें: *"सर, कृपया मुझे रिजेक्शन मेमो (कारण पर्ची) दे दीजिए कि मेरा फॉर्म किस नियम के तहत खारिज हुआ है।"* अक्सर लिखित मांगने पर बैंक फॉर्म प्रोसेस कर देते हैं।

2. **जिला उद्योग केंद्र (DIC) के अधिकारी से संपर्क करें**:
   - अगर यह PMEGP या मुद्रा लोन है, तो अपने जिले के **DIC (जिला उद्योग केंद्र)** या **KVIC कार्यालय** जाएं। वहां के नोडल अधिकारी बैंक से जवाब तलब करते हैं।

3. **लीड बैंक मैनेजर (LDM) से मिलें**:
   - हर जिले में एक 'लीड बैंक मैनेजर' होता है जो सभी बैंकों में सरकारी योजनाओं का नोडल प्रभारी होता है।

4. **181 या PM पोर्टल पर शिकायत दर्ज कराएं**:
   - भारत सरकार के पोर्टल **pgportal.gov.in (CPGRAMS)** पर या राज्य की CM हेल्पलाइन (181) पर फ्री कॉल करके शिकायत दर्ज कराएं।`;
  }

  // G. House / Roof / PMAY (घर, छत, आवास)
  if (q.includes('ghar') || q.includes('chhat') || q.includes('jhopdi') || q.includes('awas') || q.includes('house')) {
    return `**कच्चा घर पक्का करने या नया मकान बनाने हेतु सहायता:**

- **योजना**: **प्रधानमंत्री आवास योजना - ग्रामीण (PMAY-G)**
- **कितनी सहायता मिलती है**:
  - मैदानी क्षेत्रों में: **₹1,20,000 सीधे बैंक खाते में (अनुदान / फ्री पैसा)**।
  - पहाड़ी/दुर्गम क्षेत्रों में: **₹1,30,000**।
  - साथ में शौचालय निर्माण हेतु **₹12,000** और मनरेगा के तहत 90-95 दिनों की मजदूरी भी मिलती है।
- **किसे मिलता है**: कच्चे मकान, बेघर, गरीब ग्रामीण परिवारों को जिनका नाम आवास-प्लस सूची में हो।
- **कहाँ जाना होगा**: अपने गाँव के **ग्राम प्रधान / मुखिया** या ब्लॉक कार्यालय में **पंचायत सचिव (VDO)** से मिलें।`;
  }

  // H. Illness / Medicine / Hospital (बीमारी, इलाज, दवाई)
  if (q.includes('bimar') || q.includes('ilaj') || q.includes('dawai') || q.includes('hospital') || q.includes('ayushman')) {
    return `**बीमारी या अस्पताल में मुफ्त इलाज हेतु सहायता:**

- **योजना**: **आयुष्मान भारत (PM-JAY गोल्डन कार्ड)**
- **कितना लाभ**: हर गरीब परिवार को सालाना **₹5,00,000 तक का पूरी तरह मुफ्त इलाज** (दवाई, जांच, भर्ती, ऑपरेशन)।
- **कहाँ मान्य है**: सभी सरकारी अस्पतालों और सूचीबद्ध बड़े प्राइवेट अस्पतालों में।
- **कार्ड कैसे बनवाएं**:
  - नजदीकी सरकारी अस्पताल (PHC/CHC) या CSC केंद्र पर अपना आधार कार्ड और राशन कार्ड लेकर जाएं।
  - यदि आपका नाम सूची में है, तो 5 मिनट में आयुष्मान कार्ड बन जाता है।
  - टोल-फ्री हेल्पलाइन: **14555** पर कॉल करके पात्रता पूछ सकते हैं।`;
  }

  // Default Grassroots Help
  return `**गरीब एवं ग्रामीण नागरिकों के लिए सरकार की प्रमुख जनकल्याणकारी योजनाएं:**

- **छोटा काम/दुकान**: PM स्वनिधि (₹10,000-50,000 बिना गारंटी लोन) और PM मुद्रा शिशु लोन।
- **कारीगर व दस्तकार**: PM विश्वकर्मा (₹15,000 टूलकिट अनुदान + ₹3 लाख 5% लोन)।
- **खेती-किसानी व पशुपालन**: PM किसान (₹6,000/वर्ष) और पशुपालन KCC (₹2 लाख 4% ब्याज पर)।
- **पक्का मकान**: PM आवास योजना (₹1.20 लाख सीधे खाते में)।
- **मुफ्त इलाज**: आयुष्मान भारत कार्ड (₹5 लाख/वर्ष मुफ्त इलाज)।

यदि आपको कोई फॉर्म भरना है, तो अपने गाँव के **जन सेवा केंद्र (CSC)** या पंचायत भवन जाएं।`;
};

/**
 * 4. Deep Platform Architecture & Workflow Knowledge
 * (Yojna दृष्टि पोर्टल की सम्पूर्ण कार्यप्रणाली)
 */
const generatePlatformProcessAnswer = (query = '', langCode = 'hi') => {
  const q = query.toLowerCase();

  // Voice Navigation / How to use with voice
  if (q.includes('voice') || q.includes('bolkar') || q.includes('mic') || q.includes('awaaz') || q.includes('बोलकर') || q.includes('माइक')) {
    return `**Yojna दृष्टि वॉइस असिस्टेंट (बोलकर इस्तेमाल करने का तरीका):**

1. **माइक बटन दबाएं**: स्क्रीन के नीचे दाएं कोने में बने **माइक (🎙️)** आइकॉन पर क्लिक करें।
2. **अपनी भाषा में बोलें**: आप हिंदी, हिंग्लिश, पंजाबी या अंग्रेजी में जैसा बोलना चाहें बोलें (जैसे: *"मुझे किराना दुकान के लिए लोन चाहिए"* या *"8-stage tracking क्या है?"*)।
3. **ऑटो-सेंड व ऑटो-स्पीक**: बोलते ही आपका सवाल अपने आप चला जाएगा और हमारा AI असिस्टेंट **उसी भाषा में बोलकर उत्तर सुनाएगा**।
4. **लिखने की ज़रूरत नहीं**: जो नागरिक पढ़ या लिख नहीं सकते, वे पूरी वेबसाइट केवल आवाज़ से इस्तेमाल कर सकते हैं!`;
  }

  // 8-Stage Tracking & PFMS
  if (q.includes('track') || q.includes('stage') || q.includes('pfms') || q.includes('status') || q.includes('disburs') || q.includes('sanction') || q.includes('ट्रैक') || q.includes('स्टेटस')) {
    if (langCode === 'pa') {
      return `**Yojna दृष्टि 8-ਪੜਾਵੀ ਪਾਰਦਰਸ਼ੀ ਅਰਜ਼ੀ ਟਰੈਕਿੰਗ (/track):**

ਸਾਡਾ ਪੋਰਟਲ ਸਰਕਾਰੀ ਲੋਨ ਅਤੇ ਸਬਸਿਡੀ ਅਰਜ਼ੀਆਂ ਨੂੰ 8 ਸਪਸ਼ਟ ਪੜਾਵਾਂ ਵਿੱਚ ਟਰੈਕ ਕਰਦਾ ਹੈ:
1. **ਅਰਜ਼ੀ ਜਮ੍ਹਾਂ (Application Submitted)** — ਨਾਗਰਿਕ ਵੱਲੋਂ ਵੇਰਵੇ ਦਰਜ।
2. **ਦਸਤਾਵੇਜ਼ ਤਸਦੀਕ (Document Verification)** — AI OCR ਰਾਹੀਂ ਆਧਾਰ/ਪੈਨ ਦੀ ਜਾਂਚ।
3. **ਵਿਭਾਗੀ ਨਿਰੀਖਣ (Department Review)** — ਤਕਨੀਕੀ ਮੁਲਾਂਕਣ।
4. **ਮਨਜ਼ੂਰੀ ਪੱਤਰ (Sanction Generated)** — ਸਰਕਾਰੀ ਮਨਜ਼ੂਰੀ ਰਾਸ਼ੀ ਤੈਅ।
5. **PFMS ਪ੍ਰੋਸੈਸਿੰਗ (PFMS Treasury Processing)** — ਸਰਕਾਰੀ ਟ੍ਰੈਜ਼ਰੀ ਆਈਡੀ ਬਣਨਾ।
6. **ਫੰਡ ਰਿਲੀਜ਼ (Fund Released)** — ਸਬਸਿਡੀ ਰਿਲੀਜ਼ ਹੋਣਾ।
7. **ਬੈਂਕ ਡਿਸਬਰਸਲ (Bank Disbursal)** — ਬੈਂਕ ਵੱਲੋਂ ਖਾਤੇ ਵਿੱਚ ਪੈਸੇ ਪਾਉਣਾ।
8. **ਲਾਭ ਪ੍ਰਾਪਤੀ (Benefit Received)** — ਯੂਨਿਟ ਸ਼ੁਰੂ ਹੋਣਾ।

💡 **ਵਿੱਤੀ ਪਾਰਦਰਸ਼ਤਾ**: ਪੋਰਟਲ 'ਤੇ Sanctioned, Released ਅਤੇ Disbursed ਰਕਮਾਂ ਵੱਖ-ਵੱਖ ਦਿਖਾਈ ਦਿੰਦੀਆਂ ਹਨ।`;
    }
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

  // Scheme Discovery Wizard (/wizard)
  if (q.includes('wizard') || q.includes('score') || q.includes('match') || q.includes('readiness') || q.includes('विज़ार्ड') || q.includes('पात्रता')) {
    return `**नागरिक योजना डिस्कवरी विज़ार्ड एवं ML रेडीनेस स्कोर (/wizard):**

1. **4-चरणीय सरल प्रोफाइलिंग**:
   - **व्यक्तिगत विवरण**: जाति श्रेणी (SC/ST/OBC/General), लिंग, आयु और राज्य।
   - **काम/व्यवसाय विवरण**: फूड प्रोसेसिंग, विनिर्माण, दुकान/किराना, सिलाई, हैंडीक्राफ्ट आदि।
   - **वित्तीय आवश्यकता**: कितना लोन चाहिए और अनुमानित टर्नओवर।
   - **दस्तावेज़**: आपके पास उपलब्ध कागजात (आधार, पैन, उद्यम आदि)।

2. **AI & ML गणना इंजन**:
   - **Compatibility Match Score (0-100%)**: 15+ केंद्रीय और राज्य योजनाओं में से सर्वोत्तम मिलान।
   - **Credit Readiness Index**: बैंक द्वारा ऋण स्वीकृत होने की संभावना का अनुमान।
   - **Nearby Bank Partners**: आपके जिले में नजदीकी बैंक शाखाओं और जन सेवा केंद्रों (CSC) की दूरी व पता।`;
  }

  // DocVerifier AI OCR (/document-verification)
  if (q.includes('docverifier') || q.includes('ocr') || q.includes('document') || q.includes('dastavez') || q.includes('कागज') || q.includes('सत्यापन')) {
    return `**DocVerifier — AI दस्तावेज़ सत्यापन स्टूडियो (/document-verification):**

- **स्वचालित AI OCR**: आधार कार्ड, पैन कार्ड, आय प्रमाण पत्र, जाति प्रमाण पत्र और उद्यम रजिस्ट्रेशन प्रमाण पत्र की डिजिटल स्कैनिंग और टेक्स्ट निष्कर्षण।
- **मिसिंग दस्तावेज़ चेकलिस्ट**: चुनी गई सरकारी योजना (जैसे PMEGP या मुद्रा) के अनुसार आवश्यक कागजातों की रीयल-टाइम जांच करता है और बताता है कि कौन सा दस्तावेज बाकी है।
- **सुरक्षा व गोपनीयता**: सभी दस्तावेज सुरक्षित एन्क्रिप्शन के साथ प्रोसेस होते हैं और केवल आधिकारिक सत्यापन हेतु उपयोग किए जाते हैं।`;
  }

  // ScholarSetu (/scholarsetu)
  if (q.includes('scholarsetu') || q.includes('scholarship') || q.includes('student') || q.includes('विद्यार्थी') || q.includes('छात्रवृत्ति')) {
    return `**ScholarSetu — विद्यार्थी वित्तीय अवसर पोर्टल (/scholarsetu):**

- **विशेष रूप से छात्रों हेतु**: प्री-मैट्रिक, पोस्ट-मैट्रिक, उच्च शिक्षा और बालिका प्रोत्साहन छात्रवृत्तियों की सीधी पात्रता जांच।
- **पारदर्शी मानदंड**: पारिवारिक आय सीमा, पिछले शैक्षणिक अंक, और श्रेणी (SC/ST/OBC/Minority/EWS) के अनुसार राष्ट्रीय छात्रवृत्ति पोर्टल (NSP) की योजनाओं से सीधा मिलान।
- **आवेदन सुविधा**: छात्र बिना किसी बिचौलिए के सही सरकारी छात्रवृत्ति खोजकर सीधे आवेदन कर सकते हैं।`;
  }

  // Provider, Sponsorship & Admin
  if (q.includes('provider') || q.includes('csr') || q.includes('sponsor') || q.includes('admin')) {
    return `**योजना दृष्टि संगठनात्मक व प्रशासनिक मॉड्यूल:**

1. **Provider & CSR पोर्टल (/provider)**: कॉर्पोरेट CSR फाउंडेशन, NGO और ट्रस्ट अपनी CIN, PAN और CSR-1 रजिस्ट्रेशन के साथ Two-tier KYB सत्यापन करा सकते हैं।
2. **Sponsorship माइक्रो-अभियान (/sponsorship)**: ग्रामीण महिला समूहों, जनजातीय कारीगरों और छोटे चक्की/हथकरघा उद्यमियों हेतु पारदर्शी क्राउड-सपोर्ट लेजर।
3. **Admin Verification Studio (/admin)**: सरकारी नोडल अधिकारी और ऑडिटर पार्टनर संगठनों, योजनाओं और दस्तावेजों की समीक्षा करके डिजिटल अप्रूवल या रिजेक्शन ऑडिट लॉग दर्ज करते हैं।`;
  }

  // General Portal Overview
  return `**योजना दृष्टि (Yojna दृष्टि) पोर्टल की सम्पूर्ण कार्यप्रणाली:**

'योजना दृष्टि' भारत सरकार और राज्य सरकारों की वित्तीय योजनाओं, ऋण, सब्सिडी और छात्रवृत्तियों को आम नागरिकों तक पारदर्शी तरीके से पहुंचाने वाला आधुनिक प्लेटफॉर्म है (टैगलाइन: *"Discover. Apply. Track."*)।

यह पोर्टल 5 मुख्य स्तंभों पर कार्य करता है:
1. **योजना डिस्कवरी विज़ार्ड (/wizard)**: अपनी प्रोफाइल (श्रेणी, आयु, व्यवसाय, आवश्यक पूंजी) दर्ज करें और AI से 15+ योजनाओं में से अपने लिए सबसे उपयुक्त योजना व ऋण रेडीनेस स्कोर पाएं।
2. **पारदर्शी 8-चरणीय ट्रैकिंग (/track)**: आवेदन से लेकर स्वीकृति (Sanction), ट्रेजरी फंड रिलीज (PFMS) और बैंक खाते में डिस्बर्सल तक की लाइव ट्रैकिंग।
3. **DocVerifier AI OCR (/document-verification)**: आधार, पैन और आय प्रमाण पत्र का तुरंत डिजिटल सत्यापन।
4. **ScholarSetu छात्र पोर्टल (/scholarsetu)**: विद्यार्थियों के लिए प्री/पोस्ट-मैट्रिक छात्रवृत्तियों की खोज।
5. **प्रदाता (CSR) व स्पॉन्सरशिप (/provider व /sponsorship)**: सत्यापित संस्थानों द्वारा अनुदान और ग्रामीण कारीगरों को सहायता।

आप इनमें से किसी भी सुविधा के बारे में विस्तार से पूछ सकते हैं!`;
};

/**
 * 5. Dynamic Scheme Knowledge Synthesizer
 */
const synthesizeDynamicSchemeAnswer = (query = '', langCode = 'hi') => {
  const q = query.toLowerCase();

  let matchedSchemes = mockSchemes.filter(s => {
    const sName = s.name.toLowerCase();
    const sSlug = s.slug.toLowerCase();
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

    return sName.split(' ').some(w => w.length > 3 && q.includes(w)) || sSecs.includes(q) || sBens.includes(q);
  });

  if (matchedSchemes.length === 0) {
    matchedSchemes = mockSchemes.slice(0, 3);
  }

  if (langCode === 'pa') {
    let out = `**ਤੁਹਾਡੀ ਪੁੱਛਗਿੱਛ ਅਨੁਸਾਰ ਪ੍ਰਮਾਣਿਤ ਸਰਕਾਰੀ ਸਕੀਮਾਂ:**\n\n`;
    matchedSchemes.slice(0, 3).forEach((s, idx) => {
      out += `${idx + 1}. **${s.name}**:\n`;
      out += `   - **ਵਿੱਤੀ ਸਹਾਇਤਾ**: ₹${(s.maximumSupport / 100000).toFixed(1)} ਲੱਖ ਤੱਕ।\n`;
      if (s.subsidyPercentage) out += `   - **ਸਬਸਿਡੀ**: **${s.subsidyPercentage}% ਤੱਕ ਸਰਕਾਰੀ ਗ੍ਰਾਂਟ**।\n`;
      out += `   - **ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼**: ${(s.requiredDocuments || ['ਆਧਾਰ ਕਾਰਡ', 'ਪੈਨ ਕਾਰਡ']).slice(0, 4).join(', ')}।\n\n`;
    });
    out += `💡 **ਅਰਜ਼ੀ ਕਿਵੇਂ ਦੇਣੀ ਹੈ**: Yojna दृष्टि ਵਿਜ਼ਾਰਡ (/wizard) ਰਾਹੀਂ ਅਪਲਾਈ ਕਰੋ।`;
    return out;
  }

  if (langCode === 'en') {
    let out = `**Verified Government Financial Schemes for Your Query:**\n\n`;
    matchedSchemes.slice(0, 3).forEach((s, idx) => {
      out += `${idx + 1}. **${s.name}**:\n`;
      out += `   - **Financial Limit**: Up to ₹${(s.maximumSupport / 100000).toFixed(1)} Lakh (${s.fundingType || 'Loan / Subsidy'}).\n`;
      if (s.subsidyPercentage) out += `   - **Government Subsidy**: Up to **${s.subsidyPercentage}% capital subsidy**.\n`;
      if (s.interestRate) out += `   - **Interest Rate**: ${s.interestRate}% p.a.\n`;
      out += `   - **Documentation**: ${(s.requiredDocuments || ['Aadhaar', 'PAN', 'Project DPR']).slice(0, 4).join(', ')}.\n\n`;
    });
    out += `💡 **Next Steps**: Fill your profile in the **Scheme Discovery Wizard (/wizard)** or visit your nearest public sector bank.`;
    return out;
  }

  // Hindi Default
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
};

/**
 * 6. Empathetic Universal Life & Curiosity Resolver
 * (किसी भी रैंडम सवाल का समझदारी व संवेदनशीलता से जवाब देकर सरकारी सशक्तिकरण से जोड़ना)
 */
const generateRandomLifeAnswer = (query = '', langCode = 'hi') => {
  const q = query.toLowerCase();

  // How to earn money / berojgari (पैसा कैसे कमाएं / बेरोजगारी)
  if (q.includes('paisa kaise kamaye') || q.includes('kamai') || q.includes('berojgar') || q.includes('naukri') || q.includes('earn money') || q.includes('job')) {
    return `**रोजगार और कमाई शुरू करने के सबसे सुरक्षित व आसान सरकारी रास्ते:**

1. **छोटा व्यापार / दुकान शुरू करें**:
   - यदि आप किराना, चाय, फल-सब्जी या रिपेयरिंग का काम करना चाहते हैं, तो सरकार **PM स्वनिधि** (₹10,000-50,000) और **PM मुद्रा योजना** (₹50,000 से ₹10 लाख) में बिना किसी गारंटी के आसान लोन देती है।

2. **पारंपरिक हुनर से कमाई (PM विश्वकर्मा)**:
   - सिलाई, बढ़ई, नाई, मोची, राजमिस्त्री आदि के लिए सरकार ₹15,000 के आधुनिक औजार मुफ्त देती है और ₹3 लाख का 5% ब्याज पर लोन देती है।

3. **फ्री कौशल प्रशिक्षण (PMKVY - Skill India)**:
   - अगर आप कोई नया हुनर (कंप्यूटर, मोबाइल रिपेयर, सोलर पैनल, ऑटोमोबाइल) सीखना चाहते हैं, तो प्रधानमंत्री कौशल विकास योजना में फ्री ट्रेनिंग और सर्टिफिकेट मिलता है।

💡 योजना दृष्टि पोर्टल के **विज़ार्ड (/wizard)** पर अपना विवरण भरें, हमारा AI आपको आपकी स्थिति के अनुसार सबसे उपयुक्त काम और योजना सुझाएगा!`;
  }

  // General happiness / Life stress (खुश कैसे रहें / जिंदगी)
  if (q.includes('khush') || q.includes('zindagi') || q.includes('life') || q.includes('stress') || q.includes('tension')) {
    return `जिंदगी में खुश और तनावमुक्त रहने के लिए अपने स्वास्थ्य का ध्यान रखें, परिवार के साथ समय बिताएं और छोटे-छोटे लक्ष्यों पर काम करें।

आत्मनिर्भरता और स्वाभिमान इंसान को सबसे बड़ी खुशी देते हैं। यदि आप या आपके परिवार का कोई सदस्य अपने पैरों पर खड़ा होने के लिए कोई छोटा काम या उद्यम शुरू करना चाहता है, तो भारत सरकार की कई योजनाएं (मुद्रा, विश्वकर्मा, महिला उद्यमिता) आपकी मदद के लिए तैयार हैं।

हमारा **योजना दृष्टि** पोर्टल आपके हर कदम पर सही योजना चुनने और लोन प्राप्त करने में सहायता करेगा!`;
  }

  // General Curiosity / Conversational Out of Box
  if (langCode === 'pa') {
    return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ **Yojna दृष्टि** ਦਾ ਡਿਜੀਟਲ ਸਹਾਇਕ ਹਾਂ। ਮੇਰਾ ਮੁੱਖ ਮਕਸਦ ਦੇਸ਼ ਦੇ ਹਰ ਨਾਗਰਿਕ, ਗਰੀਬ ਪਰਿਵਾਰਾਂ, ਕਾਰੋਬਾਰੀਆਂ ਅਤੇ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ, ਲੋਨ, ਸਬਸਿਡੀਆਂ ਅਤੇ ਸਕਾਲਰਸ਼ਿਪਾਂ ਦੀ ਸਹੀ ਜਾਣਕਾਰੀ ਦੇਣਾ ਹੈ।

ਤੁਹਾਡਾ ਸਵਾਲ ਬਹੁਤ ਦਿਲਚਸਪ ਹੈ! ਜੇਕਰ ਤੁਹਾਨੂੰ ਕਿਸੇ ਸਰਕਾਰੀ ਯੋਜਨਾ, ਛੋਟੇ ਕਾਰੋਬਾਰੀ ਲੋਨ ਜਾਂ ਇਸ ਵੈੱਬਸਾਈਟ ਦੀ ਵਰਤੋਂ ਬਾਰੇ ਕੋਈ ਮਦਦ ਚਾਹੀਦੀ ਹੈ, ਤਾਂ ਬੇਝਿਜਕ ਪੁੱਛੋ।`;
  }

  if (langCode === 'en') {
    return `Hello! I am your **Yojna दृष्टि Digital Assistant**. My core mission is to empower every citizen, small entrepreneur, student, and underprivileged household by connecting them transparently to Central & State government schemes, loans, subsidies, and scholarships.

Thank you for your question! While I am specially trained in citizen welfare and financial opportunities, please feel free to ask anything about starting a small enterprise, getting collateral-free loans, verifying documents, or tracking government funds. How may I best assist your livelihood today?`;
  }

  return `नमस्ते! मैं **योजना दृष्टि** का डिजिटल मित्र और सहायक हूँ। मेरा मुख्य उद्देश्य देश के हर नागरिक, गरीब परिवारों, छोटे व्यवसायियों और विद्यार्थियों को बिना किसी दलाल के सरकारी योजनाओं, ऋण, सब्सिडी और छात्रवृत्तियों का सीधा लाभ पहुंचाना है।

आपका प्रश्न बहुत अच्छा है! मैं विशेष रूप से जनकल्याण, रोजगार और सरकारी योजनाओं के लिए प्रशिक्षित हूँ। यदि आप कोई नया काम शुरू करना चाहते हैं, सरकारी लोन/सब्सिडी पाना चाहते हैं, या इस वेबसाइट की मदद लेना चाहते हैं, तो कृपया बताइए — मैं आपकी पूरी मदद करूँगा!`;
};

module.exports = {
  detectLanguage,
  classifyQueryIntent,
  generatePoorCitizenGuidance,
  generatePlatformProcessAnswer,
  synthesizeDynamicSchemeAnswer,
  generateRandomLifeAnswer
};
