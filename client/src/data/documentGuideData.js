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
    icon: '💰',
    govtFee: '₹15 - ₹30',
    timeline: '7 - 10 कार्य दिवस (Working Days)',
    validity: '1 वर्ष (1 Year)',
    description_hi: 'यह प्रमाण पत्र प्रमाणित करता है कि आपके परिवार की कुल सालाना आय कितनी है। सब्सिडी और ब्याज छूट प्राप्त करने के लिए यह अनिवार्य दस्तावेज है।',
    requiredDocs_hi: [
      'राशन कार्ड या बिजली बिल (निवास प्रमाण हेतु)',
      'वेतन पर्ची या आय का स्व-घोषणा पत्र (Self-Declaration)',
      'पासपोर्ट साइज फोटो और आधार कार्ड'
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
    toutWarning_hi: '⚠️ सरकारी फीस मात्र ₹15 से ₹30 है। किसी भी प्राइवेट एजेंट या दलाल को ₹500-₹1000 न दें। अपने मोबाइल से या नज़दीकी सीएससी केंद्र पर जाकर ₹30 में बनवाएं।'
  },

  'Category Certificate': {
    id: 'Category Certificate',
    label_hi: 'जाति प्रमाण पत्र (SC / ST / OBC / EWS)',
    icon: '📜',
    govtFee: '₹15 - ₹30',
    timeline: '10 - 15 कार्य दिवस',
    validity: 'SC/ST: आजीवन (Lifetime), OBC-NCL/EWS: 1 वर्ष',
    description_hi: 'PMEGP, Stand-Up India, और पीएम मुद्रा जैसी योजनाओं में 25% से 35% तक की विशेष सब्सिडी प्राप्त करने के लिए यह प्रमाण पत्र सबसे महत्वपूर्ण है।',
    requiredDocs_hi: [
      'पिता या परिवार के किसी सदस्य का पुराना जाति प्रमाण पत्र या खतियान/जमाबंदी',
      'निवास प्रमाण पत्र या राशन कार्ड',
      'आधार कार्ड एवं स्व-सत्यापित फोटो'
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
    toutWarning_hi: '⚠️ जाति प्रमाण पत्र केवल सरकारी ई-डिस्ट्रिक्ट पोर्टल या ब्लॉक (अंचल कार्यालय) से ही जारी होता है। किसी बाहरी व्यक्ति को पैसे न दें।'
  },

  'Udyam Certificate': {
    id: 'Udyam Certificate',
    label_hi: 'उद्यम पंजीकरण (MSME Udyam Registration)',
    icon: '🏷️',
    govtFee: 'बिल्कुल मुफ़्त (₹0.00 Free)',
    timeline: '10 मिनट में डिजिटल डाउनलोड',
    validity: 'आजीवन (Lifetime)',
    description_hi: 'यह केंद्र सरकार द्वारा सूक्ष्म, लघु एवं मध्यम उद्यमों को दिया जाने वाला आधिकारिक पहचान पत्र है। इसके बिना बैंक एमएसएमई सब्सिडी और प्राथमिकता ऋण नहीं देते।',
    requiredDocs_hi: [
      'उद्यमी का आधार कार्ड (जिसमें मोबाइल नंबर लिंक हो)',
      'पैन कार्ड (PAN Card)',
      'बैंक खाता संख्या एवं IFSC कोड',
      'व्यवसाय का पता और कर्मचारियों की संख्या'
    ],
    statePortals: [
      { state: 'National', portalName: 'Official National Udyam Portal', url: 'https://udyamregistration.gov.in' }
    ],
    toutWarning_hi: '🚨 सख्त चेतावनी: भारत सरकार का उद्यम पंजीकरण 100% मुफ़्त है! गूगल पर .org या .in वाली कई फर्ज़ी प्राइवेट वेबसाइट्स ₹1000-2000 ठगती हैं। केवल सरकारी वेबसाइट udyamregistration.gov.in पर ही आवेदन करें।'
  },

  'Business Registration': {
    id: 'Business Registration',
    label_hi: 'दुकान / व्यवसाय पंजीकरण (Trade License / Gumasta)',
    icon: '🏢',
    govtFee: '₹100 - ₹500 (शहरी/ग्रामीण निकाय अनुसार)',
    timeline: '2 - 3 कार्य दिवस',
    validity: '1 से 5 वर्ष (नवीकरणीय)',
    description_hi: 'दुकान, वर्कशॉप, या व्यापार के लिए स्थानीय नगर निगम, नगर पालिका या ग्राम पंचायत से मिलने वाला व्यापार प्रमाण पत्र।',
    requiredDocs_hi: [
      'दुकान/प्रतिष्ठान के किराये का अनुबंध (Rent Agreement) या मालिकाना पर्चा',
      'दुकान का बिजली बिल',
      'मालिक का आधार कार्ड और पैन कार्ड',
      'दुकान के बोर्ड की फोटो'
    ],
    statePortals: [
      { state: 'Urban', portalName: 'राज्य नगर विकास एवं आवास पोर्टल / नगर निगम काउंटर', url: 'https://udyamitra.in' },
      { state: 'Rural', portalName: 'स्थानीय ग्राम पंचायत मुखिया/सचिव काउंटर', url: 'https://panchayat.gov.in' }
    ],
    toutWarning_hi: '⚠️ अपने स्थानीय नगर निगम या ग्राम पंचायत कार्यालय में सीधे जाकर आवेदन करें। किसी अनाधिकृत ब्रोकर के झांसे में न आएं।'
  },

  'Project Report': {
    id: 'Project Report',
    label_hi: 'प्रोजेक्ट रिपोर्ट (Detailed Project Report - DPR)',
    icon: '📊',
    govtFee: 'मुफ़्त टेम्पलेट / सीएससी पर ₹100',
    timeline: '1 दिन (तैयार टेम्पलेट से)',
    validity: 'योजना आवेदन तक',
    description_hi: 'बैंक को यह समझाने के लिए 2-3 पन्नों का दस्तावेज़ कि व्यवसाय में कितना खर्च आएगा, कच्चा माल कहाँ से आएगा, और सालाना कितना मुनाफ़ा होगा।',
    requiredDocs_hi: [
      'मशीनरी या उपकरणों के कोटेशन (दुकानदार से अनुमानित मूल्य)',
      'कच्चे माल और मजदूरी का मासिक खर्च विवरण',
      'अनुमानित मासिक बिक्री और लाभ का ब्यौरा'
    ],
    statePortals: [
      { state: 'KVIC / PMEGP', portalName: 'KVIC Model Project Profiles (100+ मुफ़्त रिपोर्ट्स)', url: 'https://www.kviconline.gov.in/pmegp/pmegpweb/docs/jsp/newprojectReports.jsp' },
      { state: 'National MSME', portalName: 'MSME Project Profiles Portal', url: 'https://dcmsme.gov.in' }
    ],
    toutWarning_hi: '💡 बैंक केवल सरल अनुमान मांगता है। CA को ₹5000 देने की आवश्यकता नहीं है। KVIC की वेबसाइट से अपने व्यवसाय का मुफ़्त मॉडल प्रोजेक्ट डाउनलोड करें।'
  },

  'Bank Statement': {
    id: 'Bank Statement',
    label_hi: '6 माह का बैंक खाता विवरण (Bank Statement / Passbook)',
    icon: '🏦',
    govtFee: 'बिल्कुल मुफ़्त (₹0.00)',
    timeline: 'तुरंत (Instant)',
    validity: 'आवेदन तिथि से पिछले 6 महीने',
    description_hi: 'आपके बचत या चालू खाते के पिछले 6 महीनों के लेन-देन का आधिकारिक रिकॉर्ड, जो बैंक को आपकी वित्तीय क्षमता प्रमाणित करता है।',
    requiredDocs_hi: [
      'बैंक पासबुक (शाखा से हालिया मुहर व हस्ताक्षर सहित एंट्री)',
      'या मोबाइल बैंकिंग (YONO, PNB One, iMobile) से डाउनलोड किया गया PDF',
      'बैंक का नाम, खाता संख्या एवं IFSC कोड साफ़ दिखना चाहिए'
    ],
    statePortals: [
      { state: 'NetBanking', portalName: 'अपनी बैंक की इंटरनेट/मोबाइल बैंकिंग ऐप', url: 'https://www.rbi.org.in' }
    ],
    toutWarning_hi: '⚠️ पासबुक पर पिछले 6 महीने की एंट्री अपनी गृह शाखा से मुफ़्त में करवाएं। किसी भी ऑनलाइन स्टेटमेंट में पासवर्ड हटाकर प्रिंट करें।'
  },

  'Aadhaar/Identity': {
    id: 'Aadhaar/Identity',
    label_hi: 'आधार कार्ड / सरकारी पहचान पत्र (UIDAI Aadhaar)',
    icon: '🆔',
    govtFee: 'डाउनलोड मुफ़्त / अपडेट ₹50',
    timeline: 'तुरंत (Download)',
    validity: 'आजीवन (Lifetime)',
    description_hi: 'प्रत्येक सरकारी योजना में डीबीटी (प्रत्यक्ष लाभ अंतरण) और ई-केवाईसी के लिए आधार कार्ड सबसे पहली ज़रूरत है।',
    requiredDocs_hi: [
      '12 अंकों का आधार नंबर',
      'आधार से जुड़ा सक्रिय मोबाइल नंबर (OTP सत्यापन के लिए अनिवार्य)',
      'यदि नाम या पता बदला हो तो नज़दीकी डाकघर से अपडेट'
    ],
    statePortals: [
      { state: 'UIDAI Official', portalName: 'myAadhaar UIDAI Portal', url: 'https://myaadhaar.uidai.gov.in' },
      { state: 'India Post', portalName: 'डाकघर आधार सेवा केंद्र खोजें', url: 'https://www.indiapost.gov.in' }
    ],
    toutWarning_hi: '⚠️ सुनिश्चित करें कि आपके आधार में मोबाइल नंबर चालू हो, ताकि योजना की सब्सिडी और बैंक ओटीपी सीधे आपके फ़ोन पर आ सके।'
  }
};

export default DOCUMENT_GUIDE_DATA;
