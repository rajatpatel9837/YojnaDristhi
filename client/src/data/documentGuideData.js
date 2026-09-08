// client/src/data/documentGuideData.js
/**
 * Grassroots Action Directory for Missing Documents in Yojna दृष्टि.
 * Contains official government fees, timelines, prerequisites, tout warnings,
 * and direct links to state e-District / RTPS portals.
 */

export const DOCUMENT_GUIDE_DATA = {
  'Income Certificate': {
    id: 'Income Certificate',
    label_hi: 'आय प्रमाण पत्र',
    label_en: 'Income Certificate',
    icon: '💰',
    govtFee: '₹15 - ₹30',
    govtFee_en: '₹15 - ₹30',
    timeline: '7 - 10 कार्य दिवस (Working Days)',
    timeline_en: '7 - 10 Working Days',
    validity: '1 वर्ष (1 Year)',
    validity_en: '1 Year',
    description_hi: 'यह प्रमाण पत्र प्रमाणित करता है कि आपके परिवार की कुल सालाना आय कितनी है। सब्सिडी और ब्याज छूट प्राप्त करने के लिए यह अनिवार्य दस्तावेज है।',
    description_en: 'Certifies your total household annual income. Essential for claiming capital subsidies, interest subventions, and margin money.',
    requiredDocs_hi: [
      'राशन कार्ड या बिजली बिल (निवास प्रमाण हेतु)',
      'वेतन पर्ची या आय का स्व-घोषणा पत्र (Self-Declaration)',
      'पासपोर्ट साइज फोटो और आधार कार्ड'
    ],
    requiredDocs_en: [
      'Ration card or Electricity bill (Address proof)',
      'Salary slip or Self-Declaration affidavit of income',
      'Passport size photo and Aadhaar card'
    ],
    statePortals: [
      { state: 'Bihar', portalName: 'RTPS Bihar (Service Online)', url: 'https://serviceonline.bihar.gov.in' },
      { state: 'Uttar Pradesh', portalName: 'e-District UP', url: 'https://edistrict.up.gov.in' },
      { state: 'Punjab', portalName: 'e-District Punjab', url: 'https://edistrict.punjab.gov.in' },
      { state: 'Madhya Pradesh', portalName: 'MP e-District (लोक सेवा)', url: 'https://mpedistrict.gov.in' },
      { state: 'Rajasthan', portalName: 'Emitra / SSO Rajasthan', url: 'https://sso.rajasthan.gov.in' },
      { state: 'Maharashtra', portalName: 'Aaple Sarkar (आपले सरकार)', url: 'https://aaplesarkar.mahaonline.gov.in' },
      { state: 'All India / CSC', portalName: 'Digital Seva CSC Portal', url: 'https://digitalseva.csc.gov.in' }
    ],
    toutWarning_hi: '⚠️ सरकारी फीस मात्र ₹15 से ₹30 है। किसी भी प्राइवेट एजेंट या दलाल को ₹500-₹1000 न दें। अपने मोबाइल से या नज़दीकी सीएससी केंद्र पर जाकर ₹30 में बनवाएं।',
    toutWarning_en: '⚠️ The official government fee is only ₹15 to ₹30. Do not pay ₹500–₹1000 to touts or private agents. Apply directly online or visit your local CSC center for ₹30.'
  },

  'Category Certificate': {
    id: 'Category Certificate',
    label_hi: 'जाति प्रमाण पत्र (SC / ST / OBC / EWS)',
    label_en: 'Caste / Category Certificate (SC / ST / OBC / EWS)',
    icon: '📜',
    govtFee: '₹15 - ₹30',
    govtFee_en: '₹15 - ₹30',
    timeline: '10 - 15 कार्य दिवस',
    timeline_en: '10 - 15 Working Days',
    validity: 'SC/ST: आजीवन (Lifetime), OBC-NCL/EWS: 1 वर्ष',
    validity_en: 'SC/ST: Lifetime, OBC-NCL/EWS: 1 Year',
    description_hi: 'PMEGP, Stand-Up India, और पीएम मुद्रा जैसी योजनाओं में 25% से 35% तक की विशेष सब्सिडी प्राप्त करने के लिए यह प्रमाण पत्र सबसे महत्वपूर्ण है।',
    description_en: 'Crucial for unlocking 25% to 35% enhanced capital subsidies under PMEGP, Stand-Up India, and Mudra special category quotas.',
    requiredDocs_hi: [
      'पिता या परिवार के किसी सदस्य का पुराना जाति प्रमाण पत्र या खतियान/जमाबंदी',
      'निवास प्रमाण पत्र या राशन कार्ड',
      'आधार कार्ड एवं स्व-सत्यापित फोटो'
    ],
    requiredDocs_en: [
      'Father or family member existing caste certificate or land records',
      'Residence certificate or Ration card',
      'Aadhaar card and self-attested photograph'
    ],
    statePortals: [
      { state: 'Bihar', portalName: 'RTPS Bihar', url: 'https://serviceonline.bihar.gov.in' },
      { state: 'Uttar Pradesh', portalName: 'e-District UP', url: 'https://edistrict.up.gov.in' },
      { state: 'Punjab', portalName: 'e-District Punjab', url: 'https://edistrict.punjab.gov.in' },
      { state: 'Madhya Pradesh', portalName: 'MP e-District', url: 'https://mpedistrict.gov.in' },
      { state: 'Rajasthan', portalName: 'Emitra Rajasthan', url: 'https://sso.rajasthan.gov.in' },
      { state: 'Maharashtra', portalName: 'Aaple Sarkar', url: 'https://aaplesarkar.mahaonline.gov.in' },
      { state: 'All India / CSC', portalName: 'Digital Seva Portal', url: 'https://digitalseva.csc.gov.in' }
    ],
    toutWarning_hi: '⚠️ जाति प्रमाण पत्र केवल सरकारी ई-डिस्ट्रिक्ट पोर्टल या ब्लॉक (अंचल कार्यालय) से ही जारी होता है। किसी बाहरी व्यक्ति को पैसे न दें।',
    toutWarning_en: '⚠️ Caste certificates are issued solely through government e-District portals or Block revenue offices. Never pay touts.'
  },

  'Udyam Certificate': {
    id: 'Udyam Certificate',
    label_hi: 'उद्यम पंजीकरण (MSME Udyam Registration)',
    label_en: 'MSME Udyam Registration Certificate',
    icon: '🏷️',
    govtFee: 'बिल्कुल मुफ़्त (₹0.00 Free)',
    govtFee_en: '100% Free (₹0.00)',
    timeline: '10 मिनट में डिजिटल डाउनलोड',
    timeline_en: '10 Minutes (Instant Digital Download)',
    validity: 'आजीवन (Lifetime)',
    validity_en: 'Lifetime',
    description_hi: 'यह केंद्र सरकार द्वारा सूक्ष्म, लघु एवं मध्यम उद्यमों को दिया जाने वाला आधिकारिक पहचान पत्र है। इसके बिना बैंक एमएसएमई सब्सिडी और प्राथमिकता ऋण नहीं देते।',
    description_en: 'Official identity certificate issued by the Ministry of MSME. Mandatory for banks to grant priority sector lending and interest subsidies.',
    requiredDocs_hi: [
      'उद्यमी का आधार कार्ड (जिसमें मोबाइल नंबर लिंक हो)',
      'पैन कार्ड (PAN Card)',
      'बैंक खाता संख्या एवं IFSC कोड',
      'व्यवसाय का पता और कर्मचारियों की संख्या'
    ],
    requiredDocs_en: [
      'Entrepreneur Aadhaar Card (linked to active mobile)',
      'PAN Card',
      'Bank Account Number & IFSC Code',
      'Business Address & Employee Count'
    ],
    statePortals: [
      { state: 'National', portalName: 'Official National Udyam Portal', url: 'https://udyamregistration.gov.in' }
    ],
    toutWarning_hi: '🚨 सख्त चेतावनी: भारत सरकार का उद्यम पंजीकरण 100% मुफ़्त है! गूगल पर .org या .in वाली कई फर्ज़ी प्राइवेट वेबसाइट्स ₹1000-2000 ठगती हैं। केवल सरकारी वेबसाइट udyamregistration.gov.in पर ही आवेदन करें।',
    toutWarning_en: '🚨 Critical Warning: Government Udyam registration is 100% FREE! Fake websites charge ₹1,000-2,000. Apply ONLY on official udyamregistration.gov.in.'
  },

  'Business Registration': {
    id: 'Business Registration',
    label_hi: 'दुकान / व्यवसाय पंजीकरण (Trade License / Gumasta)',
    label_en: 'Shop / Business Registration (Trade License / Gumasta)',
    icon: '🏢',
    govtFee: '₹100 - ₹500 (शहरी/ग्रामीण निकाय अनुसार)',
    govtFee_en: '₹100 - ₹500 (As per Urban/Rural body)',
    timeline: '2 - 3 कार्य दिवस',
    timeline_en: '2 - 3 Working Days',
    validity: '1 से 5 वर्ष (नवीकरणीय)',
    validity_en: '1 to 5 Years (Renewable)',
    description_hi: 'दुकान, वर्कशॉप, या व्यापार के लिए स्थानीय नगर निगम, नगर पालिका या ग्राम पंचायत से मिलने वाला व्यापार प्रमाण पत्र।',
    description_en: 'Commercial establishment registration issued by local Municipal Corporation, Municipality, or Gram Panchayat.',
    requiredDocs_hi: [
      'दुकान/प्रतिष्ठान के किराये का अनुबंध (Rent Agreement) या मालिकाना पर्चा',
      'दुकान का बिजली बिल',
      'मालिक का आधार कार्ड और पैन कार्ड',
      'दुकान के बोर्ड की फोटो'
    ],
    requiredDocs_en: [
      'Rent agreement or ownership papers of business premises',
      'Commercial electricity bill',
      'Owner Aadhaar Card & PAN Card',
      'Photograph of shop signboard'
    ],
    statePortals: [
      { state: 'Urban', portalName: 'राज्य नगर विकास एवं आवास पोर्टल / नगर निगम काउंटर', url: 'https://udyamitra.in' },
      { state: 'Rural', portalName: 'स्थानीय ग्राम पंचायत मुखिया/सचिव काउंटर', url: 'https://panchayat.gov.in' }
    ],
    toutWarning_hi: '⚠️ अपने स्थानीय नगर निगम या ग्राम पंचायत कार्यालय में सीधे जाकर आवेदन करें। किसी अनाधिकृत ब्रोकर के झांसे में न आएं।',
    toutWarning_en: '⚠️ Apply directly at your local Municipal or Gram Panchayat office. Avoid unauthorized brokers.'
  },

  'Project Report': {
    id: 'Project Report',
    label_hi: 'प्रोजेक्ट रिपोर्ट (Detailed Project Report - DPR)',
    label_en: 'Detailed Project Report (DPR)',
    icon: '📊',
    govtFee: 'मुफ़्त टेम्पलेट / सीएससी पर ₹100',
    govtFee_en: 'Free Templates / ₹100 at CSC',
    timeline: '1 दिन (तैयार टेम्पलेट से)',
    timeline_en: '1 Day (Using pre-made template)',
    validity: 'योजना आवेदन तक',
    validity_en: 'Valid for scheme application',
    description_hi: 'बैंक को यह समझाने के लिए 2-3 पन्नों का दस्तावेज़ कि व्यवसाय में कितना खर्च आएगा, कच्चा माल कहाँ से आएगा, और सालाना कितना मुनाफ़ा होगा।',
    description_en: 'A 2-3 page document outlining setup costs, machinery requirements, raw material sources, and projected annual profit.',
    requiredDocs_hi: [
      'मशीनरी या उपकरणों के कोटेशन (दुकानदार से अनुमानित मूल्य)',
      'कच्चे माल और मजदूरी का मासिक खर्च विवरण',
      'अनुमानित मासिक बिक्री और लाभ का ब्यौरा'
    ],
    requiredDocs_en: [
      'Machinery/equipment quotations from authorized vendors',
      'Monthly raw materials and labor expense breakdown',
      'Estimated monthly sales revenue and net margin'
    ],
    statePortals: [
      { state: 'KVIC / PMEGP', portalName: 'KVIC Model Project Profiles (100+ मुफ़्त रिपोर्ट्स)', url: 'https://www.kviconline.gov.in/pmegp/pmegpweb/docs/jsp/newprojectReports.jsp' },
      { state: 'National MSME', portalName: 'MSME Project Profiles Portal', url: 'https://dcmsme.gov.in' }
    ],
    toutWarning_hi: '💡 बैंक केवल सरल अनुमान मांगता है। CA को ₹5000 देने की आवश्यकता नहीं है। KVIC की वेबसाइट से अपने व्यवसाय का मुफ़्त मॉडल प्रोजेक्ट डाउनलोड करें।',
    toutWarning_en: '💡 Banks only require realistic estimates. Do NOT pay ₹5,000 to private consultants. Download free model profiles from the KVIC website.'
  },

  'Bank Statement': {
    id: 'Bank Statement',
    label_hi: '6 माह का बैंक खाता विवरण (Bank Statement / Passbook)',
    label_en: '6-Month Bank Statement / Passbook',
    icon: '🏦',
    govtFee: 'बिल्कुल मुफ़्त (₹0.00)',
    govtFee_en: '100% Free (₹0.00)',
    timeline: 'तुरंत (Instant)',
    timeline_en: 'Instant',
    validity: 'आवेदन तिथि से पिछले 6 महीने',
    validity_en: 'Last 6 months up to application date',
    description_hi: 'आपके बचत या चालू खाते के पिछले 6 महीनों के लेन-देन का आधिकारिक रिकॉर्ड, जो बैंक को आपकी वित्तीय क्षमता प्रमाणित करता है।',
    description_en: 'Official record of bank transactions proving active cashflow and financial viability to lending banks.',
    requiredDocs_hi: [
      'बैंक पासबुक (शाखा से हालिया मुहर व हस्ताक्षर सहित एंट्री)',
      'या मोबाइल बैंकिंग (YONO, PNB One, iMobile) से डाउनलोड किया गया PDF',
      'बैंक का नाम, खाता संख्या एवं IFSC कोड साफ़ दिखना चाहिए'
    ],
    requiredDocs_en: [
      'Bank passbook with latest entry and branch seal',
      'Or digital PDF downloaded from mobile/net banking (YONO, PNB One, iMobile)',
      'Clear bank name, account number, and IFSC code'
    ],
    statePortals: [
      { state: 'NetBanking', portalName: 'अपनी बैंक की इंटरनेट/मोबाइल बैंकिंग ऐप', url: 'https://www.rbi.org.in' }
    ],
    toutWarning_hi: '⚠️ पासबुक पर पिछले 6 महीने की एंट्री अपनी गृह शाखा से मुफ़्त में करवाएं। किसी भी ऑनलाइन स्टेटमेंट में पासवर्ड हटाकर प्रिंट करें।',
    toutWarning_en: '⚠️ Get passbook updated free at your home branch. When uploading digital statements, ensure the PDF password is removed.'
  },

  'Aadhaar/Identity': {
    id: 'Aadhaar/Identity',
    label_hi: 'आधार कार्ड / सरकारी पहचान पत्र (UIDAI Aadhaar)',
    label_en: 'Aadhaar Card / Government Identity Proof',
    icon: '🆔',
    govtFee: 'डाउनलोड मुफ़्त / अपडेट ₹50',
    govtFee_en: 'Free Download / ₹50 Update',
    timeline: 'तुरंत (Download)',
    timeline_en: 'Instant',
    validity: 'आजीवन (Lifetime)',
    validity_en: 'Lifetime',
    description_hi: 'प्रत्येक सरकारी योजना में डीबीटी (प्रत्यक्ष लाभ अंतरण) और ई-केवाईसी के लिए आधार कार्ड सबसे पहली ज़रूरत है।',
    description_en: 'Primary foundation for Direct Benefit Transfer (DBT) and e-KYC in all central and state government schemes.',
    requiredDocs_hi: [
      '12 अंकों का आधार नंबर',
      'आधार से जुड़ा सक्रिय मोबाइल नंबर (OTP सत्यापन के लिए अनिवार्य)',
      'यदि नाम या पता बदला हो तो नज़दीकी डाकघर से अपडेट'
    ],
    requiredDocs_en: [
      '12-digit Aadhaar Number',
      'Active mobile number linked to Aadhaar (Mandatory for OTP verification)',
      'Updated address or biometric at nearest Post Office'
    ],
    statePortals: [
      { state: 'UIDAI Official', portalName: 'myAadhaar UIDAI Portal', url: 'https://myaadhaar.uidai.gov.in' },
      { state: 'India Post', portalName: 'डाकघर आधार सेवा केंद्र खोजें', url: 'https://www.indiapost.gov.in' }
    ],
    toutWarning_hi: '⚠️ सुनिश्चित करें कि आपके आधार में मोबाइल नंबर चालू हो, ताकि योजना की सब्सिडी और बैंक ओटीपी सीधे आपके फ़ोन पर आ सके।',
    toutWarning_en: '⚠️ Ensure your mobile number is actively linked to Aadhaar so government subsidies and bank OTPs arrive directly.'
  }
};

export default DOCUMENT_GUIDE_DATA;

