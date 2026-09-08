// client/src/data/bankCounterGuideData.js
/**
 * Bank Counter Defense Guide Data for Yojna दृष्टि.
 * Arms grassroots citizens, women entrepreneurs, and rural artisans
 * with exact counter-arguments, RBI circular citations, and helpline numbers.
 */

export const BANK_COUNTER_GUIDE_DATA = {
  title_hi: 'बैंक काउंटर रक्षा गाइड (Bank Counter Defense Shield)',
  subtitle_hi: 'जब बैंक मैनेजर लोन देने में आनाकानी करे, तो घबराएं नहीं — इन सरकारी नियमों और कानूनी अधिकारों से अपनी बात रखें।',
  
  goldenRule_hi: 'याद रखें: सरकारी ऋण योजनाएं बैंक की दया नहीं, आपका संवैधानिक अधिकार हैं। आवेदन पत्र जमा करने पर पावती (Acknowledgement Receipt) लेना कभी न भूलें।',

  excuses: [
    {
      id: 'excuse_no_target',
      excuse_hi: '1. "हमारे पास इस योजना का कोई टारगेट / कोटा नहीं बचा है।"',
      reason_analysis_hi: 'बैंक कर्मचारी अक्सर सरकारी योजनाओं के काम से बचने के लिए टारगेट खत्म होने का बहाना बनाते हैं।',
      counterScript_hi: 'सर, PMEGP और PM मुद्रा योजना भारत सरकार के प्राथमिकता प्राप्त क्षेत्र (Priority Sector Lending - PSL) के तहत अनिवार्य हैं। मेरा ऑनलाइन आवेदन KVIC / Udyamitra पोर्टल पर दर्ज हो चुका है और इस शाखा को आवंटित है। कृपया पोर्टल पर मेरा आवेदन क्रमांक (Application ID) चेक करके मुझे आधिकारिक पावती रसीद दें। यदि कोटा समाप्त हो गया है तो मुझे लिखित में कारण दें ताकि मैं ज़िला उद्योग केंद्र (DIC) में सूचित कर सकूँ।',
      rbiCircularTitle: 'RBI Master Direction — Priority Sector Lending (PSL)',
      rbiCircularCode: 'FIDD.CO.Plan.BC.5/04.09.01/2020-21',
      actionTips_hi: [
        'पोर्टल की आवेदन रसीद (Application Acknowledgement Slip) अपने साथ रखें।',
        'आवेदन जमा करने की तिथि और कर्मचारी का नाम डायरी में नोट करें।'
      ]
    },
    {
      id: 'excuse_collateral',
      excuse_hi: '2. "लोन के लिए ज़मीन के कागज़, मकान की रजिस्ट्री या सरकारी कर्मचारी की गारंटी लानी होगी।"',
      reason_analysis_hi: 'बैंक बिना जोखिम लिए सुरक्षित लोन देना चाहते हैं, जबकि सरकार ने 10 लाख तक गारंटी-मुक्त लोन अनिवार्य किया है।',
      counterScript_hi: 'सर, भारतीय रिज़र्व बैंक (RBI) के मास्टर सर्कुलर के अनुसार ₹10 लाख तक के किसी भी सूक्ष्म एवं लघु उद्यम (MSME) ऋण पर कोई संपार्श्विक प्रतिभूति (Collateral Security) या थर्ड पार्टी गारंटी नहीं मांगी जा सकती। इस लोन की क्रेडिट गारंटी सरकार की CGTMSE ट्रस्ट द्वारा बैंक को स्वतः दी जाती है, जिसका वार्षिक प्रीमियम केंद्र सरकार वहन करती है।',
      rbiCircularTitle: 'RBI Collateral-Free Lending Mandate for MSEs up to ₹10 Lakhs',
      rbiCircularCode: 'RPCD.SME&NFS.BC.No.79/06.02.31/2009-10',
      actionTips_hi: [
        'अपने योजना पर्चा पर छपा हुआ RBI सर्कुलर नंबर बैंक मैनेजर को दिखाएं।',
        'यदि बैंक ज़मीन मांगता है, तो उनसे यह मांग लिखित में देने को कहें।'
      ]
    },
    {
      id: 'excuse_forced_insurance',
      excuse_hi: '3. "पहले 50,000 की FD कराओ या ₹15,000 का जीवन बीमा लो, तभी लोन की फाइल आगे बढ़ेगी।"',
      reason_analysis_hi: 'अवैध क्रॉस-सेलिंग (Cross-Selling) — बैंक अपने बीमा या डिपॉज़िट के टारगेट पूरे करने के लिए गरीबों पर दबाव बनाते हैं।',
      counterScript_hi: 'सर, सरकारी ऋण योजना के साथ किसी भी प्रकार का जबरन बीमा, पॉलिसी या सावधि जमा (FD) की शर्त लगाना भारतीय बैंकिंग संहिता और बैंकिंग लोकपाल (Banking Ombudsman) के नियमों का खुला उल्लंघन है। लोन के लिए केवल व्यवसाय से संबंधित प्राथमिक परिसंपत्तियों का सामान्य हाइपोथेकेशन होता है। कृपया इस शर्त को लिखित में दें, ताकि मैं इसे RBI CMS पोर्टल पर दर्ज कर सकूँ।',
      rbiCircularTitle: 'RBI Charter of Customer Rights — Prohibition of Forced Bundling',
      rbiCircularCode: 'DBR.No.Leg.BC.78/09.07.005/2014-15',
      actionTips_hi: [
        'किसी भी अप्रत्याशित बीमा या FD फॉर्म पर हस्ताक्षर न करें।',
        'सीधे कहें कि आप केवल सरकारी योजना की अधिकृत प्रोसेसिंग फीस (यदि लागू हो) देंगे।'
      ]
    },
    {
      id: 'excuse_cibil',
      excuse_hi: '4. "आपका सिबिल स्कोर 750 नहीं है या आपका कोई पुराना क्रेडिट इतिहास (Track Record) नहीं है।"',
      reason_analysis_hi: 'नए उद्यमियों के पास पुराना लोन न होने के कारण सिबिल स्कोर शून्य (-1 या NH) होता है।',
      counterScript_hi: 'सर, प्रधानमंत्री मुद्रा योजना और पहली पीढ़ी के उद्यमियों के लिए भारतीय रिज़र्व बैंक की स्पष्ट "New to Credit" नीति है। यदि मैंने कभी पुराना ऋण लेकर डिफ़ॉल्ट नहीं किया है, तो केवल क्रेडिट स्कोर न होने के आधार पर लोन अस्वीकार नहीं किया जा सकता। मेरा प्रोजेक्ट रिपोर्ट और उद्यम पंजीकरण मेरी व्यापारिक साख प्रमाणित करता है।',
      rbiCircularTitle: 'DFS Guidelines on Credit Facilities to New-to-Credit Micro Entrepreneurs',
      rbiCircularCode: 'MUDRA Operations Manual Section 4.2',
      actionTips_hi: [
        'यदि स्कोर -1 (No History) है, तो यह नकारात्मक नहीं बल्कि साफ रिकॉर्ड है।',
        'अपने पिछले 6 महीने के बैंक स्टेटमेंट में नियमित लेन-देन दिखाएं।'
      ]
    }
  ],

  grievanceHelplines: [
    {
      agency: 'KVIC PMEGP Helpdesk',
      phone: '1800-180-6763',
      type: 'Toll-Free Helpline',
      desc_hi: 'PMEGP आवेदन रुकने या बैंक द्वारा अस्वीकृत होने पर सीधे शिकायत दर्ज करें।'
    },
    {
      agency: 'PM Mudra Yojana Nodal Helpline',
      phone: '1800-180-1111',
      type: 'Toll-Free Helpline',
      desc_hi: 'शिशु, किशोर और तरुण मुद्रा लोन से जुड़ी किसी भी समस्या के लिए।'
    },
    {
      agency: 'RBI Banking Ombudsman (लोकपाल)',
      phone: '14448',
      portalUrl: 'https://cms.rbi.org.in',
      type: 'Official RBI Portal',
      desc_hi: 'बैंक द्वारा 30 दिनों में जवाब न मिलने या बदसलूकी करने पर RBI में ऑनलाइन शिकायत दर्ज करें।'
    },
    {
      agency: 'MSME Samadhaan & Champions',
      phone: '011-23063288',
      portalUrl: 'https://samadhaan.msme.gov.in',
      type: 'MSME Ministry Portal',
      desc_hi: 'सूक्ष्म एवं लघु उद्यमियों की शिकायतों के निवारण हेतु भारत सरकार का आधिकारिक पोर्टल।'
    }
  ]
};

export default BANK_COUNTER_GUIDE_DATA;

