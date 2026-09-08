// client/src/data/bankCounterGuideData.js
/**
 * Bank Counter Defense Guide Data for Yojna दृष्टि.
 * Arms grassroots citizens, women entrepreneurs, and rural artisans
 * with exact counter-arguments, RBI circular citations, and helpline numbers.
 */

export const BANK_COUNTER_GUIDE_DATA = {
  title_hi: 'बैंक काउंटर रक्षा गाइड (Bank Counter Defense Shield)',
  title_en: 'Bank Counter Defense Guide (Citizen Legal Armor)',
  subtitle_hi: 'जब बैंक मैनेजर लोन देने में आनाकानी करे, तो घबराएं नहीं — इन सरकारी नियमों और कानूनी अधिकारों से अपनी बात रखें।',
  subtitle_en: 'When a bank manager hesitates or gives excuses for loan refusal, stay confident — use these statutory rules and RBI mandates to defend your rights.',
  
  goldenRule_hi: 'याद रखें: सरकारी ऋण योजनाएं बैंक की दया नहीं, आपका संवैधानिक अधिकार हैं। आवेदन पत्र जमा करने पर पावती (Acknowledgement Receipt) लेना कभी न भूलें।',
  goldenRule_en: 'Remember: Government credit schemes are your statutory right, not a bank favor. Always demand an official Acknowledgement Receipt upon submitting your application.',

  excuses: [
    {
      id: 'excuse_no_target',
      excuse_hi: '1. "हमारे पास इस योजना का कोई टारगेट / कोटा नहीं बचा है।"',
      excuse_en: '1. "We do not have any target or quota left for this scheme."',
      reason_analysis_hi: 'बैंक कर्मचारी अक्सर सरकारी योजनाओं के काम से बचने के लिए टारगेट खत्म होने का बहाना बनाते हैं।',
      reason_analysis_en: 'Bank staff often cite exhausted quotas to avoid priority sector lending paperwork.',
      counterScript_hi: 'सर, PMEGP और PM मुद्रा योजना भारत सरकार के प्राथमिकता प्राप्त क्षेत्र (Priority Sector Lending - PSL) के तहत अनिवार्य हैं। मेरा ऑनलाइन आवेदन KVIC / Udyamitra पोर्टल पर दर्ज हो चुका है और इस शाखा को आवंटित है। कृपया पोर्टल पर मेरा आवेदन क्रमांक (Application ID) चेक करके मुझे आधिकारिक पावती रसीद दें। यदि कोटा समाप्त हो गया है तो मुझे लिखित में कारण दें ताकि मैं ज़िला उद्योग केंद्र (DIC) में सूचित कर सकूँ।',
      counterScript_en: 'Sir, PMEGP and PM Mudra schemes are mandatory under Reserve Bank of India Priority Sector Lending (PSL) targets. My application is registered on the national portal and officially assigned to this branch. Please verify my Application ID and issue an official Acknowledgement Receipt. If the quota is exhausted, kindly provide the refusal reason in writing so I may submit it to the District Industries Centre (DIC).',
      rbiCircularTitle: 'RBI Master Direction — Priority Sector Lending (PSL)',
      rbiCircularCode: 'FIDD.CO.Plan.BC.5/04.09.01/2020-21',
      actionTips_hi: [
        'पोर्टल की आवेदन रसीद (Application Acknowledgement Slip) अपने साथ रखें।',
        'आवेदन जमा करने की तिथि और कर्मचारी का नाम डायरी में नोट करें।'
      ],
      actionTips_en: [
        'Carry your online portal application acknowledgement slip.',
        'Record the submission date and officer name in your notebook.'
      ]
    },
    {
      id: 'excuse_collateral',
      excuse_hi: '2. "लोन के लिए ज़मीन के कागज़, मकान की रजिस्ट्री या सरकारी कर्मचारी की गारंटी लानी होगी।"',
      excuse_en: '2. "You must provide property papers, land mortgage, or a government servant guarantor."',
      reason_analysis_hi: 'बैंक बिना जोखिम लिए सुरक्षित लोन देना चाहते हैं, जबकि सरकार ने 10 लाख तक गारंटी-मुक्त लोन अनिवार्य किया है।',
      reason_analysis_en: 'Banks prefer zero-risk backed loans, even though the government has mandated collateral-free loans up to ₹10 Lakhs.',
      counterScript_hi: 'सर, भारतीय रिज़र्व बैंक (RBI) के मास्टर सर्कुलर के अनुसार ₹10 लाख तक के किसी भी सूक्ष्म एवं लघु उद्यम (MSME) ऋण पर कोई संपार्श्विक प्रतिभूति (Collateral Security) या थर्ड पार्टी गारंटी नहीं मांगी जा सकती। इस लोन की क्रेडिट गारंटी सरकार की CGTMSE ट्रस्ट द्वारा बैंक को स्वतः दी जाती है, जिसका वार्षिक प्रीमियम केंद्र सरकार वहन करती है।',
      counterScript_en: 'Sir, under the Reserve Bank of India Master Circular on MSME Lending, no bank can demand collateral security or third-party guarantee for any micro or small enterprise loan up to ₹10 Lakhs. The credit risk is covered by the Government CGTMSE guarantee trust, whose annual guarantee fee is borne under central scheme guidelines.',
      rbiCircularTitle: 'RBI Collateral-Free Lending Mandate for MSEs up to ₹10 Lakhs',
      rbiCircularCode: 'RPCD.SME&NFS.BC.No.79/06.02.31/2009-10',
      actionTips_hi: [
        'अपने योजना पर्चा पर छपा हुआ RBI सर्कुलर नंबर बैंक मैनेजर को दिखाएं।',
        'यदि बैंक ज़मीन मांगता है, तो उनसे यह मांग लिखित में देने को कहें।'
      ],
      actionTips_en: [
        'Show the printed RBI circular number on your scheme leaflet to the bank manager.',
        'If the bank insists on land/property, politely request the requirement in writing.'
      ]
    },
    {
      id: 'excuse_forced_insurance',
      excuse_hi: '3. "पहले 50,000 की FD कराओ या ₹15,000 का जीवन बीमा लो, तभी लोन की फाइल आगे बढ़ेगी।"',
      excuse_en: '3. "First open a ₹50,000 Fixed Deposit or buy a ₹15,000 life insurance policy, only then will we process the file."',
      reason_analysis_hi: 'अवैध क्रॉस-सेलिंग (Cross-Selling) — बैंक अपने बीमा या डिपॉज़िट के टारगेट पूरे करने के लिए गरीबों पर दबाव बनाते हैं।',
      reason_analysis_en: 'Illegal Cross-Selling — bank staff attempt to fulfill private insurance or deposit targets by coercing applicants.',
      counterScript_hi: 'सर, सरकारी ऋण योजना के साथ किसी भी प्रकार का जबरन बीमा, पॉलिसी या सावधि जमा (FD) की शर्त लगाना भारतीय बैंकिंग संहिता और बैंकिंग लोकपाल (Banking Ombudsman) के नियमों का खुला उल्लंघन है। लोन के लिए केवल व्यवसाय से संबंधित प्राथमिक परिसंपत्तियों का सामान्य हाइपोथेकेशन होता है। कृपया इस शर्त को लिखित में दें, ताकि मैं इसे RBI CMS पोर्टल पर दर्ज कर सकूँ।',
      counterScript_en: 'Sir, making government scheme loans conditional on purchasing private insurance policies or term deposits is a direct violation of the RBI Charter of Customer Rights and Banking Ombudsman directives against forced bundling. Scheme loans only involve primary hypothecation of business assets. Please provide this insurance condition in writing so I may file it on the RBI CMS portal.',
      rbiCircularTitle: 'RBI Charter of Customer Rights — Prohibition of Forced Bundling',
      rbiCircularCode: 'DBR.No.Leg.BC.78/09.07.005/2014-15',
      actionTips_hi: [
        'किसी भी अप्रत्याशित बीमा या FD फॉर्म पर हस्ताक्षर न करें।',
        'सीधे कहें कि आप केवल सरकारी योजना की अधिकृत प्रोसेसिंग फीस (यदि लागू हो) देंगे।'
      ],
      actionTips_en: [
        'Never sign any unexpected insurance or FD mandate form.',
        'State clearly that you will only pay authorized statutory processing charges (if applicable).'
      ]
    },
    {
      id: 'excuse_cibil',
      excuse_hi: '4. "आपका सिबिल स्कोर 750 नहीं है या आपका कोई पुराना क्रेडिट इतिहास (Track Record) नहीं है।"',
      excuse_en: '4. "Your CIBIL score is not 750, or you have no prior credit history (Track Record)."',
      reason_analysis_hi: 'नए उद्यमियों के पास पुराना लोन न होने के कारण सिबिल स्कोर शून्य (-1 या NH) होता है।',
      reason_analysis_en: 'First-time grassroots entrepreneurs have a score of -1 (NH - No History) due to lack of prior formal loans.',
      counterScript_hi: 'सर, प्रधानमंत्री मुद्रा योजना और पहली पीढ़ी के उद्यमियों के लिए भारतीय रिज़र्व बैंक की स्पष्ट "New to Credit" नीति है। यदि मैंने कभी पुराना ऋण लेकर डिफ़ॉल्ट नहीं किया है, तो केवल क्रेडिट स्कोर न होने के आधार पर लोन अस्वीकार नहीं किया जा सकता। मेरा प्रोजेक्ट रिपोर्ट और उद्यम पंजीकरण मेरी व्यापारिक साख प्रमाणित करता है।',
      counterScript_en: 'Sir, under Department of Financial Services (DFS) and PM Mudra guidelines, there is an explicit "New to Credit" mandate for first-generation micro-entrepreneurs. A score of -1 or lack of borrowing history is not a default and cannot be grounds for loan rejection. My Detailed Project Report and Udyam Registration establish my enterprise viability.',
      rbiCircularTitle: 'DFS Guidelines on Credit Facilities to New-to-Credit Micro Entrepreneurs',
      rbiCircularCode: 'MUDRA Operations Manual Section 4.2',
      actionTips_hi: [
        'यदि स्कोर -1 (No History) है, तो यह नकारात्मक नहीं बल्कि साफ रिकॉर्ड है।',
        'अपने पिछले 6 महीने के बैंक स्टेटमेंट में नियमित लेन-देन दिखाएं।'
      ],
      actionTips_en: [
        'A credit score of -1 (No History) indicates a clean slate, not a negative record.',
        'Provide 6 months of savings bank statements showing steady deposits and cashflow.'
      ]
    }
  ],

  grievanceHelplines: [
    {
      agency: 'KVIC PMEGP Helpdesk',
      phone: '1800-180-6763',
      type: 'Toll-Free Helpline',
      desc_hi: 'PMEGP आवेदन रुकने या बैंक द्वारा अस्वीकृत होने पर सीधे शिकायत दर्ज करें।',
      desc_en: 'Lodge direct grievances if PMEGP applications are stalled or rejected unlawfully.'
    },
    {
      agency: 'PM Mudra Yojana Nodal Helpline',
      phone: '1800-180-1111',
      type: 'Toll-Free Helpline',
      desc_hi: 'शिशु, किशोर और तरुण मुद्रा लोन से जुड़ी किसी भी समस्या के लिए।',
      desc_en: 'National toll-free helpline for Shishu, Kishore, and Tarun Mudra loan issues.'
    },
    {
      agency: 'RBI Banking Ombudsman (लोकपाल)',
      phone: '14448',
      portalUrl: 'https://cms.rbi.org.in',
      type: 'Official RBI Portal',
      desc_hi: 'बैंक द्वारा 30 दिनों में जवाब न मिलने या बदसलूकी करने पर RBI में ऑनलाइन शिकायत दर्ज करें।',
      desc_en: 'File an online complaint with the RBI Banking Ombudsman if the bank fails to respond within 30 days.'
    },
    {
      agency: 'MSME Samadhaan & Champions',
      phone: '011-23063288',
      portalUrl: 'https://samadhaan.msme.gov.in',
      type: 'MSME Ministry Portal',
      desc_hi: 'सूक्ष्म एवं लघु उद्यमियों की शिकायतों के निवारण हेतु भारत सरकार का आधिकारिक पोर्टल।',
      desc_en: 'Official Government of India grievance redressal portal for micro and small entrepreneurs.'
    }
  ]
};

export default BANK_COUNTER_GUIDE_DATA;

