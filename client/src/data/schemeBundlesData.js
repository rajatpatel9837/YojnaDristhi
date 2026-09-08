// client/src/data/schemeBundlesData.js

/**
 * Pre-engineered Synergistic Multi-Scheme Bundles (Scheme Stacking & Basket Optimizer)
 * Combines primary capex loans, clean energy subsidies, and working capital
 * to unlock 35% - 60% higher financial benefits than standalone scheme applications.
 */

export const SCHEME_BUNDLES = [
  {
    id: 'dairy_agro_stack',
    sector: 'Food processing',
    secondarySectors: ['Dairy', 'Agriculture allied', 'Manufacturing'],
    title_hi: 'डेयरी व खाद्य प्रसंस्करण महा-बंडल',
    title_en: 'Dairy & Agro-Processing Mega Bundle',
    badge_hi: 'सबसे लोकप्रिय बंडल',
    badge_en: 'Most Popular Stack',
    icon: '🥛',
    description_hi: 'PMEGP लोन सब्सिडी के साथ सोलर रूफटॉप व पशु किसान क्रेडिट कार्ड का संयुक्त लाभ। बिजली बिल शून्य और कम ब्याज पर कार्यशील पूंजी।',
    schemes: [
      {
        name: 'Prime Minister Employment Generation Programme (PMEGP)',
        slug: 'pmegp-micro-units-grant-loan',
        role_hi: 'मुख्य संयंत्र व मशीनरी ऋण (Capex)',
        benefit_hi: '₹5 लाख लोन पर ₹1,75,000 (35%) सरकारी सब्सिडी (Margin Money Rebate)',
        sharePercent: 55
      },
      {
        name: 'PM Surya Ghar Muft Bijli Yojana (Solar Subsidy)',
        slug: 'pm-surya-ghar-solar-subsidy',
        role_hi: 'कोल्ड स्टोरेज व चिलिंग यूनिट हेतु सौर ऊर्जा',
        benefit_hi: '₹78,000 सीधी सोलर सब्सिडी (3kW सोलर सिस्टम, मासिक बिजली बिल ₹0)',
        sharePercent: 25
      },
      {
        name: 'Pashu Kisan Credit Card (KCC Allied)',
        slug: 'pashu-kisan-credit-card',
        role_hi: 'दूध खरीद व पशु चारा कार्यशील पूंजी (Working Capital)',
        benefit_hi: '₹1.6 लाख तक बिना किसी बंधक के मात्र 4% रियायती ब्याज दर पर ऋण',
        sharePercent: 20
      }
    ],
    totalExtraSavings_hi: '₹2,53,000 कुल सरकारी सहायता',
    standaloneSavings_hi: '₹1,75,000 (केवल 1 योजना में)',
    netGainAmount: 253000,
    standaloneAmount: 175000,
    netGainPercent: 44,
    synergyTip_hi: 'PMEGP में यूनिट स्थापित करने के तुरंत बाद उसी परिसर के बिजली कनेक्शन पर PM सूर्य घर का आवेदन करें। इससे बैंक प्रोजेक्ट रिपोर्ट में ऑपरेटिंग खर्च 30% घट जाता है और लोन तुरंत मंज़ूर होता है।',
    roadmapSteps_hi: [
      'चरण 1: PMEGP पोर्टल पर आवेदन करें और DIC से स्वीकृति पत्र प्राप्त करें।',
      'चरण 2: परिसर बिजली बिल पर PM Surya Ghar पोर्टल से 3kW रूफटॉप सोलर बुक करें।',
      'चरण 3: स्थानीय बैंक शाखा में KCC पशुपालन फॉर्म भरकर 4% ब्याज पर कार्यशील पूंजी प्राप्त करें।'
    ]
  },
  {
    id: 'retail_women_stack',
    sector: 'Retail',
    secondarySectors: ['Services', 'Textiles', 'Trading', 'Food processing'],
    title_hi: 'महिला खुदरा व्यापार व दुकान विस्तार बंडल',
    title_en: 'Women Retail & Shop Expansion Stack',
    badge_hi: 'महिलाओं के लिए विशेष',
    badge_en: 'Special for Women',
    icon: '🛍️',
    description_hi: 'मुद्रा लोन (किशोर) + स्टैंड-अप इंडिया मार्जिन सहायता + डिजिटल पेमेंट कैशबैक प्रोत्साहन।',
    schemes: [
      {
        name: 'Pradhan Mantri MUDRA Yojana (Kishore Loan)',
        slug: 'pm-mudra-micro-finance-loans',
        role_hi: 'दुकान का सामान व इन्वेंट्री ऋण',
        benefit_hi: '₹5 लाख बिना किसी गारंटी के 8.5% रियायती ब्याज पर',
        sharePercent: 60
      },
      {
        name: 'Stand-Up India Margin Grant Support',
        slug: 'stand-up-india-sc-st-women',
        role_hi: 'महिला उद्यमी मार्जिन मनी सहायता',
        benefit_hi: 'महिला उद्यमी को 15% मार्जिन मनी सरकारी सहायता (स्वयं की पूंजी मात्र 10%)',
        sharePercent: 30
      },
      {
        name: 'PM SVANidhi / UPI Digital Incentive Scheme',
        slug: 'pm-svanidhi-digital-incentive',
        role_hi: 'डिजिटल पेमेंट प्रोत्साहन',
        benefit_hi: 'दुकान पर UPI क्यूआर कोड से लेनदेन पर ₹1,200 सालाना सीधा बैंक कैशबैक',
        sharePercent: 10
      }
    ],
    totalExtraSavings_hi: '₹76,200 शुद्ध ब्याज व इंसेंटिव बचत',
    standaloneSavings_hi: '₹0 (सामान्य कॉमर्शियल बैंक लोन में)',
    netGainAmount: 76200,
    standaloneAmount: 0,
    netGainPercent: 38,
    synergyTip_hi: 'दुकान का Udyam पंजीकरण करने से मुद्रा लोन पर बैंक कोई प्रोसेसिंग फीस या फाइल चार्ज नहीं काट सकता।',
    roadmapSteps_hi: [
      'चरण 1: उद्यम आधार (Udyam) पोर्टल पर 5 मिनट में निःशुल्क पंजीकरण करें।',
      'चरण 2: किसी भी सरकारी बैंक में मुद्रा (Kishore) और स्टैंड-अप इंडिया मार्जिन आवेदन जमा करें।',
      'चरण 3: चालू खाते पर सरकारी UPI QR सक्रिय कर मासिक कैशबैक प्राप्त करना शुरू करें।'
    ]
  },
  {
    id: 'artisan_craft_stack',
    sector: 'Artisan',
    secondarySectors: ['Handloom', 'Textiles', 'Woodwork', 'Leatherwork', 'Services'],
    title_hi: 'पारंपरिक कारीगर व शिल्पी स्वावलंबन बंडल',
    title_en: 'Artisan & Craft Mastery Stack',
    badge_hi: '100% कोलैटरल-फ्री',
    badge_en: '100% Collateral-Free',
    icon: '🪵',
    description_hi: 'PM विश्वकर्मा टूलकिट अनुदान + 5% रियायती ऋण + GeM पोर्टल पर सीधे सरकारी खरीद का अवसर।',
    schemes: [
      {
        name: 'PM Vishwakarma Scheme (ToolKit & Loan)',
        slug: 'pm-vishwakarma-scheme',
        role_hi: 'मुफ़्त आधुनिक टूलकिट व प्रथम चरण ऋण',
        benefit_hi: '₹15,000 का आधुनिक टूलकिट ई-वाउचर + ₹1,00,000 का ऋण मात्र 5% ब्याज पर',
        sharePercent: 50
      },
      {
        name: 'PM MUDRA Shishu Expansion',
        slug: 'pm-mudra-micro-finance-loans',
        role_hi: 'कच्चा माल खरीद (Raw Material)',
        benefit_hi: '₹50,000 अतिरिक्त कार्यशील पूंजी बिना किसी गिरवी के',
        sharePercent: 30
      },
      {
        name: 'GeM Portal Artisan Direct Onboarding',
        slug: 'gem-artisan-onboarding',
        role_hi: 'सरकारी विभागों को सीधी बिक्री',
        benefit_hi: 'बिना बिचौलियों के सरकारी कार्यालयों व मेलों में सीधे उत्पाद बिक्री',
        sharePercent: 20
      }
    ],
    totalExtraSavings_hi: '₹65,000 टूलकिट अनुदान व ब्याज बचत',
    standaloneSavings_hi: '₹15,000 (केवल टूलकिट)',
    netGainAmount: 65000,
    standaloneAmount: 15000,
    netGainPercent: 52,
    synergyTip_hi: 'PM विश्वकर्मा का डिजिटल प्रमाण पत्र मिलते ही GeM पोर्टल पर फ्री सेलर अकाउंट खुल जाता है, जिससे सरकारी टेंडरों में 25% का कोटा मिलता है।',
    roadmapSteps_hi: [
      'चरण 1: सीएससी (CSC) केंद्र जाकर बायोमेट्रिक से PM विश्वकर्मा में निःशुल्क आवेदन करें।',
      'चरण 2: 5 दिवसीय बेसिक स्किल ट्रेनिंग पूरी कर ₹15,000 का टूलकिट वाउचर और ₹1 लाख का 5% लोन लें।',
      'चरण 3: GeM पोर्टल पर अपने हस्तशिल्प उत्पाद सूचीबद्ध करें।'
    ]
  },
  {
    id: 'green_energy_msme_stack',
    sector: 'Manufacturing',
    secondarySectors: ['Engineering', 'Food processing', 'Packaging', 'Cold Storage'],
    title_hi: 'हरित ऊर्जा व सोलर MSME महा-बंडल',
    title_en: 'Green Energy & Solar MSME Stack',
    badge_hi: 'बिजली बिल शून्य बचत',
    badge_en: 'Zero Electricity Stack',
    icon: '⚡',
    description_hi: 'PMEGP मैन्युफैक्चरिंग लोन + SIDBI 4E एनर्जी एफिशिएंसी लोन + ग्रीन टेक्नोलॉजी कैपिटल सब्सिडी।',
    schemes: [
      {
        name: 'PMEGP Manufacturing Unit Loan',
        slug: 'pmegp-micro-units-grant-loan',
        role_hi: 'फैक्ट्री मशीनरी व प्लांट स्थापना',
        benefit_hi: '₹25 लाख परियोजना पर ₹8,75,000 (35%) तक की बैक-एंडेड सरकारी सब्सिडी',
        sharePercent: 65
      },
      {
        name: 'SIDBI 4E Scheme for Energy Efficiency',
        slug: 'sidbi-4e-green-energy',
        role_hi: 'ऊर्जा बचत उपकरण व इनवर्टर ग्रिड',
        benefit_hi: 'रियायती 7.25% ब्याज दर और बिना अतिरिक्त कोलैटरल के ₹10 लाख ग्रीन लोन',
        sharePercent: 25
      },
      {
        name: 'State Renewable Energy Incentive',
        slug: 'state-green-energy-incentive',
        role_hi: 'राज्य सोलर संयंत्र अनुदान',
        benefit_hi: 'सोलर प्लांट लगाने पर राज्य सरकार से ₹1,50,000 तक अतिरिक्त कैपिटल ग्रांट',
        sharePercent: 10
      }
    ],
    totalExtraSavings_hi: '₹10,25,000 कुल पूंजीगत व बिजली बचत',
    standaloneSavings_hi: '₹8,75,000 (केवल PMEGP)',
    netGainAmount: 1025000,
    standaloneAmount: 875000,
    netGainPercent: 41,
    synergyTip_hi: 'ग्रीन एनर्जी उपकरणों को प्रोजेक्ट रिपोर्ट में शामिल करने से SIDBI और सरकारी बैंक लोन को "हाई प्रायोरिटी ग्रीन MSME" में रखकर 10 दिनों में पास कर देते हैं।',
    roadmapSteps_hi: [
      'चरण 1: ग्रीन टेक्नोलॉजी कंपोनेंट सहित DPR (विस्तृत प्रोजेक्ट रिपोर्ट) तैयार करें।',
      'चरण 2: PMEGP ऑनलाइन पोर्टल पर मैन्युफैक्चरिंग श्रेणी में आवेदन करें।',
      'चरण 3: नोडल बैंक शाखा से SIDBI 4E ग्रीन क्रेडिट लिंक करवाएं।'
    ]
  }
];

/**
 * Returns the best matching scheme bundle for a user profile
 */
export function getMatchingBundle(profile) {
  if (!profile) return SCHEME_BUNDLES[0];
  const sector = (profile.sector || '').toLowerCase();

  if (sector.includes('food') || sector.includes('dairy') || sector.includes('agri')) {
    return SCHEME_BUNDLES[0]; // Dairy Agro Stack
  }
  if (profile.gender === 'Female' || profile.isWomanEntrepreneur || sector.includes('retail') || sector.includes('service')) {
    return SCHEME_BUNDLES[1]; // Retail Women Stack
  }
  if (sector.includes('artisan') || sector.includes('handloom') || sector.includes('craft')) {
    return SCHEME_BUNDLES[2]; // Artisan Craft Stack
  }
  if (sector.includes('manufactur') || sector.includes('solar') || sector.includes('energy')) {
    return SCHEME_BUNDLES[3]; // Green Energy Stack
  }

  return SCHEME_BUNDLES[0];
}
