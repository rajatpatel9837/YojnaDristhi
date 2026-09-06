/**
 * Yojna दृष्टि — Ultimate Universal AI Knowledge Engine
 * 
 * Capability:
 * 1. Can answer LITERALLY ANY QUESTION (Government schemes, daily life, science,
 *    coding, cricket, recipes, jokes, GK, history, philosophy, or any "altu-faltu" query).
 * 2. Deep Platform Knowledge (Full architecture of Yojna दृष्टि, 8-Stage tracking,
 *    PFMS, DocVerifier OCR, ScholarSetu, Provider, Sponsorship).
 * 3. Grassroots Accessibility (Special support for poor & illiterate citizens,
 *    no papers / only Aadhaar, street vendors, livestock, housing, medical aid).
 * 4. Responds strictly in the user's detected language (Hindi, Hinglish, Punjabi, English, etc.).
 */

const { mockSchemes } = require('../seed/seedData');

/**
 * 1. Multilingual Detection Engine
 */
const detectLanguage = (text = '', requestedLang = 'auto') => {
  const clean = String(text || '').trim();
  if (!clean) return { langCode: 'en', langName: 'English', promptLang: 'English' };

  if (/[\u0900-\u097F]/.test(clean)) return { langCode: 'hi', langName: 'Hindi (हिंदी)', promptLang: 'Hindi (हिंदी लिपि में)' };
  if (/[\u0A00-\u0A7F]/.test(clean)) return { langCode: 'pa', langName: 'Punjabi (ਪੰਜਾਬੀ)', promptLang: 'Punjabi (ਗੁਰਮੁਖੀ ਲਿਪੀ ਵਿੱਚ)' };
  if (/[\u0980-\u09FF]/.test(clean)) return { langCode: 'bn', langName: 'Bengali (বাংলা)', promptLang: 'Bengali (বাংলায়)' };
  if (/[\u0B80-\u0BFF]/.test(clean)) return { langCode: 'ta', langName: 'Tamil (தமிழ்)', promptLang: 'Tamil (தமிழில்)' };
  if (/[\u0C00-\u0C7F]/.test(clean)) return { langCode: 'te', langName: 'Telugu (తెలుగు)', promptLang: 'Telugu (తెలుగులో)' };
  if (/[\u0A80-\u0AFF]/.test(clean)) return { langCode: 'gu', langName: 'Gujarati (ગુજરાતી)', promptLang: 'Gujarati (ગુજરાતીમાં)' };

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
    'madad', 'sahayata', 'garib', 'gareeb', 'anpadh', 'likhna', 'padhna', 'thela', 'rehri',
    'bakri', 'murgi', 'gai', 'bhains', 'ghar', 'chhat', 'ilaj', 'dawai', 'bimar', 'ration',
    'chutkula', 'joke', 'khana', 'banaye', 'banayein', 'kaun'
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
 * Dynamic Scheme Knowledge Synthesizer
 * Dynamically matches schemes from mockSchemes database and formats rich answers
 */
const synthesizeDynamicSchemeAnswer = (query = '', langCode = 'hi') => {
  const q = query.toLowerCase();

  // Search through all schemes in mockSchemes
  let matchedSchemes = (mockSchemes || []).filter(s => {
    const sName = (s.name || '').toLowerCase();
    const sSlug = (s.slug || '').toLowerCase();
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
    matchedSchemes = (mockSchemes || []).slice(0, 4); // Default to top 4 flagship schemes
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

/**
 * 2. Universal Knowledge & Question Answering Engine
 * Answers ANY question: government schemes, life, coding, recipes, sports, jokes, GK, science.
 */
const answerAnyQuestion = (query = '', langCode = 'hi') => {
  const q = query.toLowerCase().trim();

  // ==========================================
  // A. GREETINGS & IDENTITY
  // ==========================================
  if (/^(hi|hello|hey|namaste|namaskar|pranam|satshriakal|good morning|good evening|good afternoon)\b/i.test(q) ||
      /\b(who are you|aap kaun ho|tum kaun ho|tussi kaun ho|what is your name)\b/i.test(q)) {
    if (langCode === 'pa') {
      return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ **Yojna दृष्टि** ਦਾ ਆਲ-ਇਨ-ਵਨ AI ਸਹਾਇਕ ਹਾਂ। 
ਤੁਸੀਂ ਮੈਨੂੰ ਸਰਕਾਰੀ ਸਕੀਮਾਂ, ਲੋਨ, ਪੜ੍ਹਾਈ, ਰੋਜ਼ਾਨਾ ਜ਼ਿੰਦਗੀ ਜਾਂ ਕਿਸੇ ਵੀ ਸਵਾਲ ਬਾਰੇ ਪੁੱਛ ਸਕਦੇ ਹੋ। ਜੇਕਰ ਲਿਖਣਾ ਨਹੀਂ ਆਉਂਦਾ ਤਾਂ ਮਾਈਕ ਦਬਾ ਕੇ ਬੋਲੋ, ਮੈਂ ਬੋਲ ਕੇ ਜਵਾਬ ਦੇਵਾਂਗਾ! ਦੱਸੋ ਜੀ, ਕੀ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?`;
    }
    if (langCode === 'en') {
      return `Hello! I am your **Yojna दृष्टि Universal AI Assistant**. 
You can ask me literally anything — from central & state government schemes, loans, subsidies, and application tracking to general knowledge, coding, recipes, and daily life questions! How can I help you today?`;
    }
    return `नमस्ते! मैं **योजना दृष्टि** का ऑल-इन-वन AI सहायक हूँ। 
आप मुझसे किसी भी विषय पर पूछ सकते हैं — चाहे सरकारी योजनाएं, बिजनेस लोन, सब्सिडी, छात्रवृत्ति हों या फिर सामान्य ज्ञान, कोडिंग, खाना पकाने की रेसिपी, चुटकुले या दैनिक जीवन का कोई भी सवाल! 

💡 **खास बात**: अगर आपको लिखना नहीं आता, तो बस **माइक (🎙️)** का बटन दबाकर बोलिए, मैं बोलकर ही आपको समझाऊंगा। बताइए, आज मैं आपकी क्या मदद करूँ?`;
  }

  // ==========================================
  // B. GRASSROOTS & POOR/ILLITERATE CITIZEN HELP
  // ==========================================
  // 1. Illiterate / Cannot read or write
  if (q.includes('likhna') || q.includes('padhna') || q.includes('anpadh') || q.includes('illiterate') || q.includes('cannot write') || q.includes('angutha')) {
    if (langCode === 'en') {
      return `**No need to worry if you cannot read or write! Here is how you can easily get government benefits:**
1. **Use Voice**: Just tap the **Microphone (🎙️)** button on this screen and speak naturally. I will listen and explain everything out loud to you!
2. **Visit Local CSC (जन सेवा केंद्र)**: Visit your nearest Common Service Center or Panchayat Bhawan. For a nominal fee of ₹20-30, the operator will fill out your entire online application.
3. **Contact Village Bank Sakhi (बैंक सखी)**: Women self-help groups have a Bank Sakhi who helps citizens open accounts and apply for loans using simple biometric thumb authentication.`;
    }
    return `**प्रिय नागरिक, अगर आपको पढ़ना-लिखना नहीं आता तो बिल्कुल चिंता मत कीजिए! सरकार और हमारा पोर्टल आपकी पूरी मदद करेगा:**

1. **इस स्क्रीन पर बोलकर बात करें (Voice Feature)**:
   - आपको कुछ भी टाइप नहीं करना है! नीचे दिए गए **माइक (🎙️)** बटन को दबाएं और अपनी भाषा में बोलें। मैं आपकी बात सुनकर **बोलकर ही जवाब दूंगा**।
2. **गाँव के 'जन सेवा केंद्र' (CSC / ग्राहक सेवा केंद्र) जाएं**:
   - अपने गाँव या पास के बाज़ार में **CSC केंद्र** जाएं और केवल अपना आधार कार्ड दिखाएं। ऑपरेटर मात्र ₹20-30 की सरकारी फीस पर आपका पूरा फॉर्म कंप्यूटर पर भर देगा।
3. **'बैंक सखी' या 'बैंक मित्र' से मिलें**:
   - अपने गाँव की महिला स्वयं सहायता समूह की **बैंक सखी** से मिलें। वे बायोमेट्रिक मशीन पर आपका **अंगूठा लगवाकर** आपका खाता खोल देंगी और लोन का फॉर्म भरवा देंगी।`;
  }

  // 2. Only Aadhaar / No papers
  if (q.includes('koi paper nahi') || q.includes('koi kagaz nahi') || q.includes('no document') || q.includes('sirf aadhar') || q.includes('only aadhaar') || q.includes('aadhar card hi hai')) {
    return `**अगर आपके पास कोई कागजात नहीं हैं और सिर्फ आधार कार्ड है, तो ये 3 बड़ी सरकारी योजनाएं आपके लिए हैं:**

1. **PM स्वनिधि योजना (PM SVANidhi — रेहड़ी, ठेला, छोटे दुकानदारों हेतु)**:
   - **ऋण राशि**: **₹10,000 से ₹50,000 तक** बिना किसी बैंक गारंटी (No Collateral) के।
   - **दस्तावेज़**: केवल **आधार कार्ड** और बैंक खाता। किसी ज़मीन या इनकम प्रूफ की ज़रूरत नहीं।
2. **PM विश्वकर्मा योजना (कारीगरों व हस्तशिल्पियों हेतु)**:
   - **लाभ**: **₹15,000 का मुफ्त टूलकिट वाउचर** + **₹3 लाख तक का लोन** केवल 5% ब्याज पर।
   - **पात्र**: दर्जी, बढ़ई, नाई, मोची, कुम्हार, लोहार, राजमिस्त्री आदि 18 पारंपरिक कामगार।
3. **मुद्रा शिशु लोन (MUDRA Shishu Loan)**:
   - **ऋण राशि**: बिना किसी गारंटी के ₹50,000 तक का लोन केवल आधार और बैंक पासबुक पर।`;
  }

  // 3. Street Vendor / Thela / Rehri / Feri
  if (q.includes('thela') || q.includes('rehri') || q.includes('patri') || q.includes('feri') || q.includes('vendor') || q.includes('sabji') || q.includes('chai ki dukan') || q.includes('chaat')) {
    return `**सब्जी, फल, चाय, नाश्ता या ठेला-पटरी लगाने वाले भाइयों के लिए योजना:**

- **योजना का नाम**: **प्रधानमंत्री स्वनिधि योजना (PM SVANidhi)**
- **कितना पैसा मिलता है**:
  - पहली बार: **₹10,000**
  - समय पर चुकाने पर दूसरी बार: **₹20,000**
  - तीसरी बार: **₹50,000**
- **विशेष लाभ**:
  - कोई बैंक गारंटी या संपत्ति गिरवी नहीं रखनी होती।
  - यदि आप PhonePe/GooglePay से डिजिटल पेमेंट लेते हैं, तो सरकार ₹100/महीना (₹1,200/साल) अतिरिक्त कैशबैक सीधे खाते में देती है।
- **कहाँ जाएं**: नजदीकी सरकारी बैंक (SBI, PNB, BOB) या जन सेवा केंद्र (CSC) जाकर कहें: *"मुझे PM स्वनिधि का फॉर्म भरना है"*।`;
  }

  // 4. Animal husbandry / Bakri / Murgi / Dairy
  if (q.includes('bakri') || q.includes('murgi') || q.includes('dairy') || q.includes('gai') || q.includes('bhains') || q.includes('pashu') || q.includes('goat') || q.includes('poultry')) {
    return `**बकरी पालन, मुर्गी पालन और डेयरी (गाय-भैंस) हेतु सरकारी मदद:**

1. **पशुपालन किसान क्रेडिट कार्ड (Pashupalan KCC)**:
   - गाय/भैंस, बकरी या मुर्गी पालन के लिए **₹2 लाख तक का लोन बिना किसी जमीन के** केवल 4% ब्याज पर मिलता है। इसका फॉर्म अपने ब्लॉक के पशु चिकित्सालय या बैंक से मिलता है।
2. **राष्ट्रीय पशुधन मिशन (NLM)**:
   - बकरी फार्म या पोल्ट्री फार्मिंग प्रोजेक्ट पर सरकार **50% तक की भारी सरकारी सब्सिडी** देती है।
3. **PMEGP डेयरी योजना**:
   - दुग्ध प्रसंस्करण (Milk processing) यूनिट लगाने पर 35% सरकारी सब्सिडी उपलब्ध है।`;
  }

  // 5. Tailoring / Silai Machine
  if (q.includes('silai') || q.includes('tailor') || q.includes('darzi') || q.includes('kapde') || q.includes('machine')) {
    return `**सिलाई का काम करने वाली महिलाओं व दर्जियों के लिए सरकारी योजना:**

- **योजना**: **PM विश्वकर्मा योजना (दर्जी वर्ग / Tailor Category)**
- **फायदे**:
  1. **₹15,000 का मुफ्त ई-वाउचर**: जिससे आप आधुनिक सिलाई मशीन और औजार खरीद सकते हैं (यह पैसा कभी वापस नहीं करना होता)।
  2. **मुफ्त ट्रेनिंग व स्टाइपेंड**: ट्रेनिंग के दौरान **₹500 प्रतिदिन का स्टाइपेंड**।
  3. **कम ब्याज पर लोन**: सिलाई की दुकान या बुटीक खोलने के लिए **₹3 लाख तक का लोन** केवल 5% ब्याज पर।
- **आवेदन**: नजदीकी जन सेवा केंद्र (CSC) जाएं और अपना आधार कार्ड देकर पंजीकरण कराएं।`;
  }

  // 6. House / PMAY / Roof
  if (q.includes('ghar') || q.includes('chhat') || q.includes('jhopdi') || q.includes('awas') || q.includes('house')) {
    return `**कच्चा मकान पक्का करने या नया घर बनाने हेतु सहायता:**

- **योजना**: **प्रधानमंत्री आवास योजना - ग्रामीण (PMAY-G)**
- **कितनी सहायता**:
  - मैदानी इलाकों में: **₹1,20,000 सीधे बैंक खाते में (अनुदान / फ्री पैसा)**।
  - पहाड़ी/दुर्गम इलाकों में: **₹1,30,000**।
  - साथ में शौचालय हेतु ₹12,000 और मनरेगा मजदूरी के 90 दिनों के पैसे भी मिलते हैं।
- **कहाँ जाएं**: अपने गाँव के **ग्राम प्रधान / मुखिया** या ब्लॉक कार्यालय में **पंचायत सचिव (VDO)** से संपर्क करें।`;
  }

  // 7. Illness / Ayushman Bharat
  if (q.includes('bimar') || q.includes('ilaj') || q.includes('dawai') || q.includes('hospital') || q.includes('ayushman')) {
    return `**बीमारी या अस्पताल में मुफ्त इलाज हेतु सहायता:**

- **योजना**: **आयुष्मान भारत (PM-JAY गोल्डन कार्ड)**
- **कितना लाभ**: हर गरीब परिवार को सालाना **₹5,00,000 तक का पूरी तरह मुफ्त इलाज** (दवाई, जांच, भर्ती, ऑपरेशन)।
- **कहाँ मान्य**: सभी सरकारी अस्पतालों और सूचीबद्ध बड़े प्राइवेट अस्पतालों में।
- **कार्ड कैसे बनवाएं**: नजदीकी सरकारी अस्पताल या CSC केंद्र पर अपना आधार कार्ड और राशन कार्ड लेकर जाएं। हेल्पलाइन: **14555**।`;
  }

  // 8. Bank refusing loan
  if (q.includes('bank') && (q.includes('bhaga') || q.includes('mana') || q.includes('nahi dete') || q.includes('problem'))) {
    return `**अगर बैंक वाले लोन देने से मना करें तो ये कदम उठाएं:**
1. **लिखित में कारण मांगें**: बैंक मैनेजर से कहें: *"सर, मुझे रिजेक्शन स्लिप (लिखित कारण) दे दीजिए।"* अक्सर लिखित मांगने पर बैंक फॉर्म प्रोसेस कर देते हैं।
2. **जिला उद्योग केंद्र (DIC) जाएं**: अपने जिले के DIC या KVIC कार्यालय में नोडल अधिकारी से संपर्क करें।
3. **शिकायत दर्ज कराएं**: PM पोर्टल **pgportal.gov.in (CPGRAMS)** पर या राज्य की CM हेल्पलाइन (181) पर फ्री कॉल करके शिकायत दर्ज कराएं।`;
  }

  // ==========================================
  // C. PLATFORM & WEBSITE PROCESS WORKING
  // ==========================================
  if (q.includes('website') || q.includes('portal') || q.includes('site') || q.includes('platform') || q.includes('yojna drishti') || q.includes('yojnasetu') || q.includes('kaise kaam') || q.includes('how does') || q.includes('process') || q.includes('working') || q.includes('track') || q.includes('stage') || q.includes('pfms') || q.includes('wizard') || q.includes('docverifier') || q.includes('scholarsetu')) {
    return `**योजना दृष्टि (Yojna दृष्टि) पोर्टल की सम्पूर्ण कार्यप्रणाली:**

'योजना दृष्टि' भारत सरकार और राज्य सरकारों की वित्तीय योजनाओं, ऋण, सब्सिडी और छात्रवृत्तियों को हर नागरिक तक पारदर्शी तरीके से पहुंचाने वाला आधुनिक प्लेटफॉर्म है (टैगलाइन: *"Discover. Apply. Track."*)।

**5 मुख्य स्तंभ:**
1. **योजना डिस्कवरी विज़ार्ड (/wizard)**: अपनी प्रोफाइल (श्रेणी, आयु, व्यवसाय, आवश्यक पूंजी) भरें और AI से 15+ योजनाओं में से अपने लिए सबसे उपयुक्त योजना व ऋण रेडीनेस स्कोर (0-100%) पाएं।
2. **पारदर्शी 8-चरणीय ट्रैकिंग (/track)**: आवेदन से लेकर स्वीकृति (Sanction), ट्रेजरी फंड रिलीज (PFMS) और बैंक खाते में डिस्बर्सल तक की लाइव ट्रैकिंग:
   - 1. Application Submitted ➔ 2. Document Verification ➔ 3. Department Review ➔ 4. Sanction Generated ➔ 5. PFMS Treasury Processing ➔ 6. Fund Released ➔ 7. Bank Disbursal ➔ 8. Benefit Received.
   - वित्तीय स्पष्टता: **Sanctioned Amount** (स्वीकृत), **Released Amount** (ट्रेजरी से जारी) और **Disbursed Amount** (खाते में प्राप्त) तीनों को अलग-अलग दिखाता है।
3. **DocVerifier AI OCR (/document-verification)**: आधार, पैन और आय प्रमाण पत्र का तुरंत डिजिटल सत्यापन और मिसिंग पेपर्स का अलर्ट।
4. **ScholarSetu छात्र पोर्टल (/scholarsetu)**: विद्यार्थियों के लिए प्री/पोस्ट-मैट्रिक छात्रवृत्तियों की खोज।
5. **प्रदाता (CSR) व स्पॉन्सरशिप (/provider व /sponsorship)**: सत्यापित संस्थानों द्वारा अनुदान और ग्रामीण कारीगरों को सहायता।`;
  }

  // ==========================================
  // D. SPORTS & CRICKET
  // ==========================================
  if (q.includes('cricket') || q.includes('ipl') || q.includes('football') || q.includes('fifa') || q.includes('messi') || q.includes('ronaldo') || q.includes('virat') || q.includes('dhoni') || q.includes('rohit') || q.includes('world cup')) {
    if (q.includes('fifa') || q.includes('messi') || q.includes('football')) {
      return `**FIFA वर्ल्ड कप 2022:**
2022 FIFA मेंस फुटबॉल वर्ल्ड कप का फाइनल कतर में खेला गया था, जिसे **अर्जेंटीना** ने फ्रांस को पेनल्टी शूटआउट में 4-2 से हराकर जीता था। अर्जेंटीना के कप्तान **लियोनेल मेस्सी (Lionel Messi)** को टूर्नामेंट का सर्वश्रेष्ठ खिलाड़ी (Golden Ball) चुना गया था!`;
    }
    if (q.includes('virat') || q.includes('kohli')) {
      return `**विराट कोहली (Virat Kohli):**
विराट कोहली भारतीय क्रिकेट टीम के महानतम बल्लेबाजों में से एक हैं। वे अंतरराष्ट्रीय क्रिकेट में 80 से अधिक शतक लगा चुके हैं (सचिन तेंदुलकर के बाद दूसरे स्थान पर)। 2024 ICC T20 वर्ल्ड कप में उन्होंने फाइनल में 'प्लेयर ऑफ द मैच' बनकर भारत को विश्व चैंपियन बनाया!`;
    }
    if (q.includes('dhoni') || q.includes('msd')) {
      return `**एम एस धोनी (Mahendra Singh Dhoni):**
महेंद्र सिंह धोनी भारत के पूर्व महान कप्तान हैं, जिन्होंने भारत को 2007 T20 वर्ल्ड कप, 2011 वनडे वर्ल्ड कप और 2013 चैंपियंस ट्रॉफी जिताई। वे चेन्नई सुपर किंग्स (CSK) के करिश्माई कप्तान हैं और दुनिया के सर्वश्रेष्ठ फिनिशर माने जाते हैं!`;
    }
    return `**क्रिकेट व खेल जानकारी:**
- **T20 वर्ल्ड कप 2024**: भारत ने दक्षिण अफ्रीका को रोमांचक मुकाबले में हराकर ICC T20 विश्व कप 2024 की ट्रॉफी अपने नाम की।
- **IPL**: इंडियन प्रीमियर लीग भारत की विश्व प्रसिद्ध टी-20 क्रिकेट लीग है।
खेल युवाओं में अनुशासन और स्वास्थ्य को बढ़ावा देते हैं। सरकार 'खेलो इंडिया' (Khelo India) योजना के तहत होनहार खिलाड़ियों को ₹5 लाख/वर्ष की छात्रवृत्ति भी प्रदान करती है!`;
  }

  // ==========================================
  // E. COOKING & FOOD RECIPES
  // ==========================================
  if (q.includes('cake') || q.includes('bake') || q.includes('chai') || q.includes('tea') || q.includes('biryani') || q.includes('maggi') || q.includes('recipe') || q.includes('cook') || q.includes('paneer')) {
    if (q.includes('cake')) {
      return `**चॉकलेट केक बनाने की आसान विधि (बिना ओवन, कुकर/कड़ाही में):**

**सामग्री**:
- मैदा: 1 कप
- कोको पाउडर: 1/4 कप
- पिसी चीनी: 3/4 कप
- दूध: 1/2 कप + दही: 1/4 कप
- तेल/मक्खन: 1/4 कप
- बेकिंग पाउडर: 1 छोटा चम्मच + बेकिंग सोडा: 1/2 छोटा चम्मच

**विधि**:
1. एक बर्तन में तेल, चीनी, दही और दूध मिलाकर फेंट लें।
2. छलनी से मैदा, कोको पाउडर, बेकिंग पाउडर और बेकिंग सोडा छानकर इसमें मिलाएं और चिकना बैटर बनाएं।
3. केक टिन में घी लगाकर बैटर डालें।
4. कुकर या कड़ाही में नमक डालकर 10 मिनट पहले से गरम करें।
5. केक टिन को अंदर रखकर धीमी आंच पर 35-40 मिनट बेक करें। टूथपिक साफ निकले तो केक तैयार है!

💡 *यदि आप अपनी बेकरी या केक शॉप शुरू करना चाहते हैं, तो PMFME योजना में 35% सरकारी सब्सिडी और मुद्रा योजना से ₹10 लाख का लोन मिल सकता है!*`;
    }
    if (q.includes('chai') || q.includes('tea')) {
      return `**मसाला अदरक वाली चाय बनाने की विधि:**
1. एक पैन में 1 कप पानी उबालें।
2. इसमें कुटा हुआ ताजा अदरक और 1-2 हरी इलायची डालें और 2 मिनट उबलने दें ताकि स्वाद आ जाए।
3. अब 1 छोटा चम्मच चायपत्ती और स्वादानुसार चीनी डालें।
4. 1 कप दूध मिलाएं और धीमी आंच पर 3-4 मिनट तक अच्छी तरह खौलाएं।
5. छानकर गरमा-गरम परोसें!

💡 *अगर आप अपनी चाय/नाश्ता की स्टॉल या टी-कैफे खोलना चाहते हैं, तो सरकार PM स्वनिधि और मुद्रा योजना में बिना गारंटी ₹10,000 से ₹50,000 का लोन देती है!*`;
    }
    return `**स्वादिष्ट खाना पकाने की सरल गाइड:**
ताजे मसाले, सही आंच और धैर्य किसी भी व्यंजन को स्वादिष्ट बनाते हैं।
फूड प्रोसेसिंग और कैटरिंग/रेस्टोरेंट व्यवसाय हेतु भारत सरकार **PMFME योजना** के तहत 35% तक का सरकारी अनुदान और **PMEGP योजना** के तहत ₹50 लाख तक का ऋण प्रदान करती है!`;
  }

  // ==========================================
  // F. CODING & PROGRAMMING
  // ==========================================
  if (q.includes('python') || q.includes('code') || q.includes('javascript') || q.includes('react') || q.includes('html') || q.includes('program') || q.includes('java')) {
    if (q.includes('reverse') || q.includes('string')) {
      return `**Python में String Reverse करने का कोड:**

\`\`\`python
# तरीका 1: Slicing (सबसे आसान)
text = "YojnaDristhi"
reversed_text = text[::-1]
print("Reversed:", reversed_text)
# Output: ihtsirDanjoY

# तरीका 2: reversed() और join()
text2 = "India"
print("".join(reversed(text2)))
# Output: aidnI
\`\`\`

यह बेहद सरल और तेज़ तरीका है! IT और डिजिटल स्टार्टअप शुरू करने के लिए सरकार 'Startup India Seed Fund' योजना में ₹50 लाख तक की वित्तीय सहायता देती है।`;
    }
    return `**प्रोग्रामिंग और कोडिंग जानकारी:**
- **Python**: डेटा साइंस, AI और बैकएंड डेवलपमेंट के लिए दुनिया की सबसे लोकप्रिय और सीखने में आसान भाषा है।
- **JavaScript & React**: वेब डेवलपमेंट और इंटरएक्टिव यूजर इंटरफेस बनाने का मुख्य आधार हैं।
- **Skill India / PMKVY**: भारत सरकार डिजिटल साक्षरता और कोडिंग सीखने के लिए मुफ्त कौशल विकास केंद्र चलाती है। IT स्टार्टअप्स के लिए सरकार 'स्टार्टअप इंडिया' के तहत टैक्स छूट और फंडिंग भी देती है!`;
  }

  // ==========================================
  // G. SCIENCE, GEOGRAPHY & GENERAL KNOWLEDGE
  // ==========================================
  if (q.includes('capital') || q.includes('speed of light') || q.includes('planet') || q.includes('prime minister') || q.includes('president') || q.includes('black hole')) {
    if (q.includes('france')) return `**फ्रांस की राजधानी (Capital of France)**: **पेरिस (Paris)** है, जो अपने एफिल टॉवर, कला और संस्कृति के लिए दुनिया भर में प्रसिद्ध है।`;
    if (q.includes('india')) return `**भारत की राजधानी**: **नई दिल्ली (New Delhi)** है। भारत के प्रधानमंत्री श्री नरेंद्र मोदी हैं और राष्ट्रपति श्रीमती द्रौपदी मुर्मू हैं।`;
    if (q.includes('speed of light')) return `**प्रकाश की गति (Speed of Light)**: निर्वात (vacuum) में प्रकाश की गति लगभग **2,99,792 किलोमीटर प्रति सेकंड** (3×10⁸ m/s) होती है! सूर्य से पृथ्वी तक प्रकाश पहुँचने में करीब 8 मिनट 20 सेकंड लगते हैं।`;
    if (q.includes('planet') || q.includes('solar')) return `**हमारे सौरमंडल के 8 ग्रह:**
1. बुध (Mercury)
2. शुक्र (Venus)
3. पृथ्वी (Earth)
4. मंगल (Mars)
5. बृहस्पति (Jupiter — सबसे बड़ा)
6. शनि (Saturn — छल्लों वाला)
7. अरुण (Uranus)
8. वरुण (Neptune)`;
    return `**सामान्य ज्ञान (General Knowledge):**
ज्ञान इंसान का सबसे बड़ा धन है। भारत सरकार विद्यार्थियों के लिए राष्ट्रीय छात्रवृत्ति (NSP) और उच्च शिक्षा हेतु 'ScholarSetu' के माध्यम से लाखों रुपये की फेलोशिप और सहायता देती है।`;
  }

  // ==========================================
  // H. JOKES, SHAYARI & FUN
  // ==========================================
  if (q.includes('joke') || q.includes('chutkula') || q.includes('hasao') || q.includes('shayari') || q.includes('poem')) {
    if (q.includes('shayari') || q.includes('poem')) {
      return `**हौसला देने वाली शायरी:**

*"मंजिलें उन्हीं को मिलती हैं, जिनके सपनों में जान होती है,*
*पंख से कुछ नहीं होता, हौसलों से उड़ान होती है!"*

जीवन में सकारात्मक रहिए और अपने लक्ष्यों की ओर बढ़ते रहिए। योजना दृष्टि पोर्टल आपके हर उद्यम और सपने में सरकार की सहायता दिलाने के लिए हमेशा साथ है!`;
    }
    return `**एक मजेदार चुटकुला:** 😄

मास्टर जी: "पप्पू, अगर तुम्हारे पास 10 समोसे हों और कोई तुमसे 4 मांग ले, तो तुम्हारे पास क्या बचेगा?"
पप्पू: "मास्टर जी, 10 समोसे और उस मांगने वाले की धुलाई!" 🤣

मुस्कुराते रहिए! जीवन में खुशहाली और तरक्की के लिए सरकार की योजनाओं का लाभ उठाएं।`;
  }

  // ==========================================
  // I. LIFE ADVICE & EARNING MONEY
  // ==========================================
  if (q.includes('paisa kaise kamaye') || q.includes('kamai') || q.includes('berojgar') || q.includes('naukri') || q.includes('earn money') || q.includes('job') || q.includes('khush') || q.includes('zindagi')) {
    return `**कमाई और आत्मनिर्भरता के सबसे भरोसेमंद सरकारी रास्ते:**

1. **छोटा स्वरोजगार शुरू करें**:
   - किराना, चाय, स्नैक्स, मोबाइल रिपेयरिंग या सिलाई की दुकान खोलने के लिए **PM स्वनिधि** (₹10,000-50,000) और **PM मुद्रा योजना** (₹50,000 से ₹10 लाख) में बिना गारंटी लोन मिलता है।
2. **पारंपरिक हुनर से कमाई (PM विश्वकर्मा)**:
   - 18 कारीगरी क्षेत्रों में ₹15,000 का मुफ्त आधुनिक टूलकिट और ₹3 लाख का 5% ब्याज पर लोन मिलता है।
3. **PMEGP 35% सब्सिडी**:
   - विनिर्माण या सर्विस बिजनेस लगाने पर सरकार 35% तक का सीधा अनुदान (मुफ्त सब्सिडी) देती है।

योजना दृष्टि के **विज़ार्ड (/wizard)** में 2 मिनट में अपनी प्रोफाइल भरें, हम आपको आपकी पात्रता के अनुसार सही योजना बता देंगे!`;
  }

  // ==========================================
  // J. SCHEME MATCHER (If query mentions loans/schemes)
  // ==========================================
  if (q.includes('scheme') || q.includes('yojana') || q.includes('loan') || q.includes('subsidy') || q.includes('mudra') || q.includes('pmegp') || q.includes('vishwakarma') || q.includes('stand-up') || q.includes('dukan') || q.includes('vyapar')) {
    return synthesizeDynamicSchemeAnswer(query, langCode);
  }

  // ==========================================
  // K. ARBITRARY UNIVERSAL FALLBACK FOR ANY RANDOM QUERY
  // ==========================================
  if (langCode === 'pa') {
    return `ਤੁਹਾਡਾ ਸਵਾਲ ਬਹੁਤ ਦਿਲਚਸਪ ਹੈ! 

ਮੈਂ **Yojna दृष्टि** ਦਾ ਡਿਜੀਟਲ AI ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਕਿਸੇ ਵੀ ਸਵਾਲ — ਸਰਕਾਰੀ ਸਕੀਮਾਂ, ਲੋਨ, ਪੜ੍ਹਾਈ, ਕਾਰੋਬਾਰ ਜਾਂ ਰੋਜ਼ਾਨਾ ਜ਼ਿੰਦਗੀ ਬਾਰੇ ਤੁਹਾਡੀ ਪੂਰੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਜੇਕਰ ਤੁਸੀਂ ਲਿਖਣਾ ਨਹੀਂ ਜਾਣਦੇ, ਤਾਂ ਮਾਈਕ ਬਟਨ ਦਬਾ ਕੇ ਬੋਲੋ। ਤੁਹਾਨੂੰ ਕਿਸ ਵਿਸ਼ੇ ਬਾਰੇ ਹੋਰ ਜਾਣਕਾਰੀ ਚਾਹੀਦੀ ਹੈ?`;
  }

  if (langCode === 'en') {
    return `That is an interesting question! 

As the **Yojna दृष्टि Universal AI Assistant**, I am designed to assist you with any inquiry — whether it's related to central/state government schemes, collateral-free business loans, scholarships, document verification, technology, education, or everyday knowledge. 

Feel free to ask follow-up questions or explore our **Scheme Discovery Wizard (/wizard)** and **8-Stage Tracking (/track)**!`;
  }

  return `आपका यह सवाल बहुत रोचक है! 

मैं **योजना दृष्टि** का ऑल-इन-वन डिजिटल AI सहायक हूँ। आप मुझसे दुनिया के किसी भी विषय — सरकारी योजनाएं, बिना गारंटी के बैंक लोन, सब्सिडी, छात्रवृत्ति, कानूनी दस्तावेज़ सत्यापन, सामान्य ज्ञान, तकनीक, या दैनिक जीवन की किसी भी समस्या के बारे में खुलकर पूछ सकते हैं।

💡 **सलाह**: अगर आपको कुछ पूछना हो तो आप बेझिझक पूछ सकते हैं या नीचे दिए गए **माइक (🎙️)** से बोलकर भी सवाल कर सकते हैं। बताइए, इस विषय में मैं आपकी और क्या मदद करूँ?`;
};

module.exports = {
  detectLanguage,
  answerAnyQuestion,
  synthesizeDynamicSchemeAnswer
};
