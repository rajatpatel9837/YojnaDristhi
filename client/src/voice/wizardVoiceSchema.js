/**
 * wizardVoiceSchema.js
 * Authoritative data contract for "बोलकर भरें" (Hindi Voice-Only Wizard) in YojnaSetu AI (Yojna दृष्टि / Yojna Dirithi).
 * Field keys and option values strictly match EntrepreneurProfile.js schema.
 */

export const YES_WORDS_HI = [
  'हाँ', 'हां', 'जी हाँ', 'जी हां', 'है', 'उपलब्ध है', 'सत्य', 'सही', 'बिलकुल', 'बिल्कुल',
  'यस', 'yes', 'ha', 'haan', 'sahi'
];

export const NO_WORDS_HI = [
  'नहीं', 'नही', 'जी नहीं', 'जी नही', 'नहीं है', 'ना', 'गलत', 'नो', 'no', 'nahi', 'nahin'
];

export const STOP_WORDS_HI = [
  'बस', 'हो गया', 'इतना ही', 'बंद करो', 'आगे बढ़ें', 'आगे बढ़ें', 'रुकिए', 'रुको', 'रोकें', 'समाप्त',
  'stop', 'done', 'khatam', 'ho gaya'
];

export const REPEAT_WORDS_HI = [
  'दोहराओ', 'फिर से बोलो', 'दोबारा', 'फिर से', 'समझ नहीं आया', 'एक बार फिर', 'repeat'
];

export const BACK_WORDS_HI = [
  'पीछे', 'पहले वाला सवाल', 'पिछला', 'वापस', 'पीछे चलो', 'back'
];

export const SKIP_WORDS_HI = [
  'छोड़ो', 'स्किप करो', 'बाद में', 'आगे', 'skip'
];

export const HELP_WORDS_HI = [
  'मदद', 'सहायता', 'हेल्प', 'help', 'kya bolna hai'
];

export const WIZARD_VOICE_SCHEMA = [
  // ─── Step 1: व्यक्तिगत विवरण (Personal Information) ────────────────
  {
    step: 1,
    title_hi: 'व्यक्तिगत विवरण',
    stepTransition_hi: 'पहला भाग — व्यक्तिगत विवरण शुरू करते हैं।',
    fields: [
      {
        key: 'fullName',
        type: 'text',
        required: true,
        label_hi: 'पूरा नाम',
        question_hi: 'आपका पूरा नाम क्या है? कृपया साफ़ बोलें।',
        hint_hi: 'उदाहरण: सुनीता देवी या रमेश कुमार',
        unit: null,
        confirm_template_hi: (val) => `तो आपका नाम है ${val}, ठीक है?`
      },
      {
        key: 'age',
        type: 'number',
        required: true,
        label_hi: 'उम्र',
        question_hi: 'आपकी उम्र कितने साल है?',
        hint_hi: 'उदाहरण: अट्ठाईस साल या 28',
        unit: 'years',
        min: 18,
        max: 100,
        confirm_template_hi: (val) => `तो आपकी उम्र है ${val} साल, ठीक है?`
      },
      {
        key: 'gender',
        type: 'select',
        required: true,
        label_hi: 'लिंग',
        question_hi: 'आपका लिंग क्या है? महिला, पुरुष, ट्रांसजेंडर या अन्य में से एक बताएं।',
        hint_hi: 'जैसे: महिला या पुरुष',
        options: [
          { value: 'Female', label_hi: 'महिला', synonyms_hi: ['महिला', 'औरत', 'स्त्री', 'लड़की', 'फीमेल', 'female'] },
          { value: 'Male', label_hi: 'पुरुष', synonyms_hi: ['पुरुष', 'आदमी', 'मर्द', 'लड़का', 'मेल', 'male'] },
          { value: 'Transgender', label_hi: 'ट्रांसजेंडर', synonyms_hi: ['ट्रांसजेंडर', 'किन्नर', 'transgender'] },
          { value: 'Other', label_hi: 'अन्य', synonyms_hi: ['अन्य', 'दूसरा', 'other'] }
        ],
        confirm_template_hi: (val, opt) => `तो लिंग चुना गया है ${opt?.label_hi || val}, ठीक है?`
      },
      {
        key: 'state',
        type: 'select',
        required: true,
        label_hi: 'राज्य',
        question_hi: 'आपका राज्य कौन सा है?',
        hint_hi: 'जैसे: बिहार, पंजाब, या उत्तर प्रदेश',
        options: [
          { value: 'Bihar', label_hi: 'बिहार', synonyms_hi: ['बिहार', 'bihar'] },
          { value: 'Punjab', label_hi: 'पंजाब', synonyms_hi: ['पंजाब', 'punjab'] },
          { value: 'Uttar Pradesh', label_hi: 'उत्तर प्रदेश', synonyms_hi: ['उत्तर प्रदेश', 'यूपी', 'उत्तरप्रदेश', 'up'] },
          { value: 'Jharkhand', label_hi: 'झारखंड', synonyms_hi: ['झारखंड', 'झारखण्ड', 'jharkhand'] },
          { value: 'Maharashtra', label_hi: 'महाराष्ट्र', synonyms_hi: ['महाराष्ट्र', 'maharashtra'] },
          { value: 'Rajasthan', label_hi: 'राजस्थान', synonyms_hi: ['राजस्थान', 'rajasthan'] },
          { value: 'Madhya Pradesh', label_hi: 'मध्य प्रदेश', synonyms_hi: ['मध्य प्रदेश', 'एमपी', 'मध्यप्रदेश', 'mp'] }
        ],
        confirm_template_hi: (val, opt) => `तो आपका राज्य है ${opt?.label_hi || val}, ठीक है?`
      },
      {
        key: 'district',
        type: 'text',
        required: true,
        label_hi: 'ज़िला या शहर',
        question_hi: 'आपका ज़िला या शहर कौन सा है?',
        hint_hi: 'जैसे: पटना, लुधियाना, या वाराणसी',
        unit: null,
        confirm_template_hi: (val) => `तो आपका ज़िला है ${val}, ठीक है?`
      },
      {
        key: 'areaType',
        type: 'select',
        required: true,
        label_hi: 'क्षेत्र',
        question_hi: 'क्या आपका क्षेत्र ग्रामीण है या शहरी?',
        hint_hi: 'गाँव के लिए ग्रामीण, शहर के लिए शहरी बोलें',
        options: [
          { value: 'Rural', label_hi: 'ग्रामीण', synonyms_hi: ['ग्रामीण', 'गाँव', 'गांव', 'देहात', 'रूरल', 'rural'] },
          { value: 'Urban', label_hi: 'शहरी', synonyms_hi: ['शहरी', 'शहर', 'नगर', 'कस्बा', 'अर्बन', 'urban'] }
        ],
        confirm_template_hi: (val, opt) => `तो आपका क्षेत्र है ${opt?.label_hi || val}, ठीक है?`
      }
    ]
  },

  // ─── Step 2: व्यवसाय विवरण (Business Details) ─────────────────────
  {
    step: 2,
    title_hi: 'व्यवसाय विवरण',
    stepTransition_hi: 'बहुत बढ़िया, अब दूसरा भाग — व्यवसाय विवरण।',
    fields: [
      {
        key: 'businessName',
        type: 'text',
        required: true,
        label_hi: 'व्यवसाय का नाम',
        question_hi: 'आपके व्यवसाय या दुकान का क्या नाम है?',
        hint_hi: 'जैसे: सुनीता फूड प्रोडक्ट्स या रामू किराना स्टोर',
        unit: null,
        confirm_template_hi: (val) => `तो व्यवसाय का नाम है ${val}, ठीक है?`
      },
      {
        key: 'sector',
        type: 'select',
        required: true,
        label_hi: 'व्यवसाय का क्षेत्र',
        question_hi: 'आपका व्यवसाय किस क्षेत्र से जुड़ा है — जैसे खाद्य प्रसंस्करण, विनिर्माण, सेवाएं, डेयरी, खुदरा व्यापार, वस्त्र, कृषि संबद्ध, या व्यापार?',
        hint_hi: 'जैसे: खाद्य प्रसंस्करण, डेयरी, या खुदरा व्यापार',
        options: [
          { value: 'Food processing', label_hi: 'खाद्य प्रसंस्करण', synonyms_hi: ['खाद्य प्रसंस्करण', 'खाद्य', 'खाने का काम', 'फूड प्रोसेसिंग', 'फूड', 'अचार पापड़', 'बेकरी'] },
          { value: 'Manufacturing', label_hi: 'विनिर्माण', synonyms_hi: ['विनिर्माण', 'मैन्युफैक्चरिंग', 'फैक्ट्री', 'उत्पादन', 'कारखाना'] },
          { value: 'Services', label_hi: 'सेवाएं', synonyms_hi: ['सेवाएं', 'सेवा', 'सर्विसेज', 'सर्विस', 'रिपेयरिंग', 'सैलून', 'सर्विसिंग'] },
          { value: 'Dairy', label_hi: 'डेयरी', synonyms_hi: ['डेयरी', 'दूध', 'पशुपालन', 'गोपालन', 'दुग्ध'] },
          { value: 'Retail', label_hi: 'खुदरा व्यापार', synonyms_hi: ['खुदरा व्यापार', 'खुदरा', 'रिटेल', 'दुकान', 'किराना', 'स्टोर'] },
          { value: 'Textiles', label_hi: 'वस्त्र', synonyms_hi: ['वस्त्र', 'हथकरघा', 'कपड़ा', 'कपड़े', 'सिलाई', 'टेक्सटाइल', 'गारमेंट'] },
          { value: 'Agriculture allied', label_hi: 'कृषि संबद्ध', synonyms_hi: ['कृषि संबद्ध', 'खेती', 'कृषि', 'मत्स्य पालन', 'मुर्गी पालन', 'पोल्ट्री'] },
          { value: 'Trading', label_hi: 'व्यापार', synonyms_hi: ['व्यापार', 'ट्रेडिंग', 'खरीद बिक्री', 'होलसेल'] }
        ],
        confirm_template_hi: (val, opt) => `तो आपका व्यवसाय क्षेत्र है ${opt?.label_hi || val}, ठीक है?`
      },
      {
        key: 'stage',
        type: 'select',
        required: true,
        label_hi: 'व्यवसाय का चरण',
        question_hi: 'आपका व्यवसाय किस चरण में है — विचार चरण, नया व्यवसाय, चालू व्यवसाय, या विस्तार?',
        hint_hi: 'जैसे: विचार चरण, नया व्यवसाय, या चालू व्यवसाय',
        options: [
          { value: 'Idea', label_hi: 'विचार चरण', synonyms_hi: ['विचार चरण', 'विचार', 'आइडिया', 'शुरुआत सोच रहे हैं', 'सोच रहे हैं', 'idea'] },
          { value: 'New business', label_hi: 'नया व्यवसाय', synonyms_hi: ['नया व्यवसाय', 'नया काम', 'हाल ही में शुरू', 'नया बिजनेस', 'new business'] },
          { value: 'Existing business', label_hi: 'चालू व्यवसाय', synonyms_hi: ['चालू व्यवसाय', 'पहले से चल रहा', 'चालू', 'चल रहा है', 'पुराना', 'existing'] },
          { value: 'Expansion', label_hi: 'विस्तार', synonyms_hi: ['विस्तार', 'बढ़ाना चाहते हैं', 'एक्सपेंशन', 'विस्तार करना है', 'expansion'] }
        ],
        confirm_template_hi: (val, opt) => `तो व्यवसाय का चरण है ${opt?.label_hi || val}, ठीक है?`
      },
      {
        key: 'annualTurnover',
        type: 'number',
        required: true,
        label_hi: 'सालाना टर्नओवर',
        question_hi: 'आपके व्यवसाय का सालाना कारोबार यानी टर्नओवर कितना रुपये है?',
        hint_hi: 'जैसे: चार लाख रुपये या शून्य',
        unit: '₹',
        min: 0,
        max: 1000000000,
        confirm_template_hi: (val) => `तो सालाना कारोबार है ${Number(val).toLocaleString('en-IN')} रुपये, ठीक है?`
      },
      {
        key: 'udyamStatus',
        type: 'select',
        required: true,
        label_hi: 'उद्यम पंजीकरण',
        question_hi: 'क्या आपका व्यवसाय उद्यम में पंजीकृत है — पंजीकृत, पंजीकृत नहीं, या आवेदन किया हुआ?',
        hint_hi: 'जैसे: पंजीकृत या पंजीकृत नहीं',
        options: [
          { value: 'Registered', label_hi: 'पंजीकृत', synonyms_hi: ['पंजीकृत', 'रजिस्टर्ड', 'पंजीकरण है', 'registered', 'हाँ'] },
          { value: 'Not Registered', label_hi: 'पंजीकृत नहीं', synonyms_hi: ['पंजीकृत नहीं', 'नहीं पंजीकृत', 'नॉट रजिस्टर्ड', 'नहीं है', 'not registered', 'नहीं'] },
          { value: 'Applied', label_hi: 'आवेदन किया हुआ', synonyms_hi: ['आवेदन किया हुआ', 'आवेदन कर दिया', 'अप्लाई किया है', 'applied', 'प्रोसेस में है'] }
        ],
        confirm_template_hi: (val, opt) => `तो उद्यम स्थिति है ${opt?.label_hi || val}, ठीक है?`
      },
      {
        key: 'employeesCount',
        type: 'number',
        required: true,
        label_hi: 'कर्मचारियों की संख्या',
        question_hi: 'आपके व्यवसाय में कितने कर्मचारी काम करते हैं?',
        hint_hi: 'जैसे: तीन या शून्य',
        unit: 'people',
        min: 0,
        max: 500,
        confirm_template_hi: (val) => `तो कर्मचारियों की संख्या है ${val}, ठीक है?`
      }
    ]
  },

  // ─── Step 3: वित्तीय विवरण (Financial Information) ─────────────────
  {
    step: 3,
    title_hi: 'वित्तीय विवरण',
    stepTransition_hi: 'शानदार, अब तीसरा भाग — वित्तीय विवरण।',
    fields: [
      {
        key: 'familyIncome',
        type: 'number',
        required: true,
        label_hi: 'सालाना पारिवारिक आय',
        question_hi: 'आपके परिवार की सालाना आय कितनी है?',
        hint_hi: 'जैसे: दो लाख पचास हज़ार रुपये',
        unit: '₹',
        min: 0,
        max: 100000000,
        confirm_template_hi: (val) => `तो पारिवारिक आय है ${Number(val).toLocaleString('en-IN')} रुपये, ठीक है?`
      },
      {
        key: 'ownContribution',
        type: 'number',
        required: true,
        label_hi: 'स्वयं का निवेश',
        question_hi: 'आप स्वयं व्यवसाय में कितनी राशि निवेश या बचत के रूप में लगा सकते हैं?',
        hint_hi: 'जैसे: पचास हज़ार रुपये या एक लाख',
        unit: '₹',
        min: 0,
        max: 100000000,
        confirm_template_hi: (val) => `तो आपका स्वयं का निवेश है ${Number(val).toLocaleString('en-IN')} रुपये, ठीक है?`
      },
      {
        key: 'hasIncomeCertificate',
        type: 'boolean',
        required: true,
        label_hi: 'आय प्रमाण पत्र',
        question_hi: 'क्या आपके पास आय प्रमाण पत्र है? हाँ या नहीं बताएं।',
        hint_hi: 'हाँ या नहीं बोलें',
        confirm_template_hi: (val) => val ? 'तो आपके पास आय प्रमाण पत्र है, ठीक है?' : 'तो आय प्रमाण पत्र उपलब्ध नहीं है, ठीक है?'
      },
      {
        key: 'existingLoans',
        type: 'boolean',
        required: true,
        label_hi: 'मौजूदा लोन',
        question_hi: 'क्या आप पर पहले से कोई व्यवसायिक लोन चल रहा है?',
        hint_hi: 'हाँ या नहीं बोलें',
        confirm_template_hi: (val) => val ? 'तो पहले से लोन सक्रिय है, ठीक है?' : 'तो कोई पुराना लोन नहीं चल रहा है, ठीक है?'
      }
    ]
  },

  // ─── Step 4: सामाजिक वर्ग (Social & Eligibility) ───────────────────
  {
    step: 4,
    title_hi: 'सामाजिक वर्ग और श्रेणी',
    stepTransition_hi: 'अब चौथा भाग — सामाजिक श्रेणी और विशेष पात्रता।',
    fields: [
      {
        key: 'category',
        type: 'select',
        required: true,
        label_hi: 'सामाजिक श्रेणी',
        question_hi: 'आपकी सामाजिक श्रेणी क्या है — अनुसूचित जाति, अनुसूचित जनजाति, अन्य पिछड़ा वर्ग, आर्थिक रूप से कमज़ोर वर्ग, या सामान्य?',
        hint_hi: 'जैसे: अनुसूचित जाति, ओबीसी, या सामान्य वर्ग',
        options: [
          { value: 'SC', label_hi: 'अनुसूचित जाति', synonyms_hi: ['अनुसूचित जाति', 'एससी', 'दलित', 'sc'] },
          { value: 'ST', label_hi: 'अनुसूचित जनजाति', synonyms_hi: ['अनुसूचित जनजाति', 'एसटी', 'आदिवासी', 'st'] },
          { value: 'OBC', label_hi: 'अन्य पिछड़ा वर्ग', synonyms_hi: ['अन्य पिछड़ा वर्ग', 'ओबीसी', 'पिछड़ा वर्ग', 'obc'] },
          { value: 'EWS', label_hi: 'आर्थिक रूप से कमज़ोर वर्ग', synonyms_hi: ['आर्थिक रूप से कमज़ोर वर्ग', 'ईडब्ल्यूएस', 'ई डब्लू एस', 'ews'] },
          { value: 'General', label_hi: 'सामान्य वर्ग', synonyms_hi: ['सामान्य वर्ग', 'सामान्य', 'जनरल', 'general'] }
        ],
        confirm_template_hi: (val, opt) => `तो सामाजिक श्रेणी है ${opt?.label_hi || val}, ठीक है?`
      },
      {
        key: 'isWomanEntrepreneur',
        type: 'boolean',
        required: true,
        label_hi: 'महिला उद्यमी',
        question_hi: 'क्या यह एक महिला उद्यमी का व्यवसाय है?',
        hint_hi: 'हाँ या नहीं बोलें',
        confirm_template_hi: (val) => val ? 'तो यह महिला उद्यमी का व्यवसाय है, ठीक है?' : 'तो यह महिला उद्यमी का व्यवसाय नहीं है, ठीक है?'
      },
      {
        key: 'isFirstGeneration',
        type: 'boolean',
        required: true,
        label_hi: 'पहली पीढ़ी के उद्यमी',
        question_hi: 'क्या आप परिवार में पहली पीढ़ी के उद्यमी हैं, यानी इससे पहले परिवार में किसी ने व्यवसाय नहीं किया?',
        hint_hi: 'हाँ या नहीं बोलें',
        confirm_template_hi: (val) => val ? 'तो आप पहली पीढ़ी के उद्यमी हैं, ठीक है?' : 'तो आप पहली पीढ़ी के उद्यमी नहीं हैं, ठीक है?'
      },
      {
        key: 'isPwD',
        type: 'boolean',
        required: true,
        label_hi: 'दिव्यांग (PwD)',
        question_hi: 'क्या आप दिव्यांग यानी PwD श्रेणी में आते हैं?',
        hint_hi: 'हाँ या नहीं बोलें',
        confirm_template_hi: (val) => val ? 'तो आप दिव्यांग श्रेणी में हैं, ठीक है?' : 'तो आप दिव्यांग श्रेणी में नहीं हैं, ठीक है?'
      }
    ]
  },

  // ─── Step 5: वित्त पोषण आवश्यकताएं (Funding Requirements) ───────────
  {
    step: 5,
    title_hi: 'वित्त पोषण आवश्यकताएं',
    stepTransition_hi: 'अब पांचवां भाग — वित्तीय सहायता की आवश्यकता।',
    fields: [
      {
        key: 'fundingAmount',
        type: 'number',
        required: true,
        label_hi: 'सहायता राशि',
        question_hi: 'आपको कुल कितनी राशि की वित्तीय सहायता चाहिए?',
        hint_hi: 'जैसे: पांच लाख रुपये या दस लाख रुपये',
        unit: '₹',
        min: 1000,
        max: 1000000000,
        confirm_template_hi: (val) => `तो आवश्यक ऋण या सहायता राशि है ${Number(val).toLocaleString('en-IN')} रुपये, ठीक है?`
      },
      {
        key: 'fundingPurpose',
        type: 'text',
        required: true,
        label_hi: 'फंडिंग का उद्देश्य',
        question_hi: 'यह राशि आप किस काम के लिए उपयोग करेंगे? जैसे मशीनरी खरीदना या कच्चा माल।',
        hint_hi: 'जैसे: मशीनरी खरीद और दुकान का विस्तार',
        unit: null,
        confirm_template_hi: (val) => `तो फंडिंग का उद्देश्य दर्ज किया: ${val}, ठीक है?`
      }
    ]
  },

  // ─── Step 6: दस्तावेज़ सूची (Document Readiness) ────────────────────
  {
    step: 6,
    title_hi: 'दस्तावेज़ सूची',
    stepTransition_hi: 'अब छठा भाग — उपलब्ध दस्तावेज़।',
    fields: [
      {
        key: 'documentsAvailable',
        type: 'multiselect',
        required: false,
        label_hi: 'उपलब्ध दस्तावेज़',
        question_hi: "आपके पास अभी कौन-कौन से दस्तावेज़ उपलब्ध हैं? आप एक-एक करके बता सकते हैं, या सभी एक साथ बोल सकते हैं। जब हो जाए तो 'बस' या 'हो गया' बोलें।",
        hint_hi: "जैसे: आधार कार्ड, आय प्रमाण पत्र, जाति प्रमाण पत्र। पूरा होने पर 'बस' बोलें।",
        options: [
          { value: 'Income Certificate', label_hi: 'आय प्रमाण पत्र', synonyms_hi: ['आय प्रमाण पत्र', 'आय प्रमाण', 'इनकम सर्टिफिकेट', 'आय'] },
          { value: 'Category Certificate', label_hi: 'जाति प्रमाण पत्र', synonyms_hi: ['जाति प्रमाण पत्र', 'जाति प्रमाण', 'कास्ट सर्टिफिकेट', 'जाति'] },
          { value: 'Business Registration', label_hi: 'व्यवसाय पंजीकरण', synonyms_hi: ['व्यवसाय पंजीकरण', 'बिजनेस रजिस्ट्रेशन', 'दुकान पंजीकरण', 'गुमास्ता'] },
          { value: 'Aadhaar/Identity', label_hi: 'आधार या पहचान पत्र', synonyms_hi: ['आधार या पहचान पत्र', 'आधार कार्ड', 'आधार', 'पहचान पत्र', 'आईडी कार्ड'] },
          { value: 'Udyam Certificate', label_hi: 'उद्यम प्रमाण पत्र', synonyms_hi: ['उद्यम प्रमाण पत्र', 'उद्यम सर्टिफिकेट', 'उद्यम रजिस्ट्रेशन', 'उद्यम'] },
          { value: 'Project Report', label_hi: 'प्रोजेक्ट रिपोर्ट', synonyms_hi: ['प्रोजेक्ट रिपोर्ट', 'बिजनेस प्लान', 'प्रोजेक्ट'] },
          { value: 'Bank Statement', label_hi: 'बैंक स्टेटमेंट', synonyms_hi: ['बैंक स्टेटमेंट', 'बैंक पासबुक', 'पासबुक', 'खाता विवरण'] }
        ],
        confirm_template_hi: (val) => {
          const list = Array.isArray(val) ? val : [];
          return `तो चुने गए दस्तावेज़ हैं: ${list.length > 0 ? list.join(', ') : 'कोई नहीं'}, ठीक है?`;
        }
      }
    ]
  },

  // ─── Step 7: समीक्षा और मिलान (Review & Match) ─────────────────────
  {
    step: 7,
    title_hi: 'समीक्षा और मिलान',
    stepTransition_hi: 'अंतिम भाग — आपकी प्रोफ़ाइल की समीक्षा।',
    fields: [] // Handled by review synthesizer in useVoiceWizard
  }
];

