import React, { useState } from 'react';
import { 
  X, 
  Scale, 
  Printer, 
  Copy, 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  FileText, 
  Building2, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * AI "Rejection Reverser" & Bank Denial Appeal Generator
 * Generates official legal grievance notices citing RBI Master Directions & Circulars
 * when bank officers unlawfully refuse or stall government-backed MSME loans.
 */
export default function RejectionAppealModal({ 
  isOpen, 
  onClose, 
  profile, 
  scheme 
}) {
  const { t, isHindi } = useLanguage();
  const [selectedExcuse, setSelectedExcuse] = useState('collateral');
  const [bankName, setBankName] = useState('State Bank of India');
  const [branchAddress, setBranchAddress] = useState(`${profile?.district || 'Patna'} Main Branch`);
  const [applicationRef, setApplicationRef] = useState(`APP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const excuses = [
    {
      id: 'collateral',
      title: isHindi ? 'ज़मीन के कागज़ / गारंटी की मांग' : 'Demand for Collateral / Guarantor',
      desc: isHindi ? 'मैनेजर संपार्श्विक गारंटी (Collateral Security) या थर्ड-पार्टी गारंटर मांग रहा है।' : 'Manager is demanding collateral security or third-party guarantor.',
      legalClause: isHindi
        ? 'RBI Circular RPCD.SME&NFS.BC.No.79/06.02.31/2009-10 दिनांक 6 मई 2010 के अनुसार सूक्ष्म एवं लघु उद्यमों को ₹10 लाख तक के ऋण पर किसी भी प्रकार की संपार्श्विक सुरक्षा (Collateral) की मांग करना पूर्णतः प्रतिबंधित एवं दंडनीय है।'
        : 'Under RBI Circular RPCD.SME&NFS.BC.No.79/06.02.31/2009-10 dated May 6, 2010, banks are strictly mandated to waive collateral requirements for MSE loans up to ₹10 Lakhs.',
      remedyDemand: isHindi
        ? 'उक्त परिपत्र के अनुपालन में बिना किसी कोलेटरल या गारंटर के आवेदन को त्वरित स्वीकृति प्रदान की जाए।'
        : 'In strict adherence to the RBI circular, grant expeditious sanction without collateral or third-party guarantor.'
    },
    {
      id: 'target',
      title: isHindi ? 'सरकारी टारगेट / कोटा खत्म होने का बहाना' : 'Target / Quota Exhaustion Excuse',
      desc: isHindi ? 'बैंक कह रहा है कि इस वित्तीय वर्ष का सरकारी लक्ष्य (Target) पूरा हो चुका है।' : 'Bank claims the government quota/target for this financial year is over.',
      legalClause: isHindi
        ? 'RBI Master Direction on Priority Sector Lending (FIDD.CO.Plan.BC.5/04.09.01/2020-21) एवं KVIC दिशानिर्देशों के तहत प्राथमिक क्षेत्र ऋण (Priority Sector) एवं PMEGP निरंतर मांग-आधारित (Continuous Credit) योजनाएं हैं, जिन्हें वर्ष भर बिना रोके स्वीकृत करना अनिवार्य है।'
        : 'Under RBI Master Direction on Priority Sector Lending (FIDD.CO.Plan.BC.5/04.09.01/2020-21), MSME priority lending is a continuous mandate and cannot be stopped arbitrarily under quota excuses.',
      remedyDemand: isHindi
        ? 'आरबीआई प्राथमिक क्षेत्र ऋण नीति के तहत आवेदन को बिना कोटा अवरोध के तत्काल प्रोसेस किया जाए।'
        : 'Process the application immediately under continuous PSL guidelines without arbitrary target caps.'
    },
    {
      id: 'delay',
      title: isHindi ? '30 दिनों से अधिक समय से अकारण लंबित' : 'Stalled for >30 Days Without Reason',
      desc: isHindi ? 'आवेदन को 30 दिनों से अधिक समय से बिना किसी लिखित आपत्ति या कारण के लटकाया गया है।' : 'Application has been stalled for over 30 days without written reasons or formal communication.',
      legalClause: isHindi
        ? 'MSME सिटीजन्स चार्टर एवं RBI BCSBI Code के अंतर्गत ₹5 लाख तक के एमएसएमई ऋण आवेदनों का निस्तारण अधिकतम 2 से 3 सप्ताह में करना अनिवार्य है। अनावश्यक विलंब प्रशासनिक दुर्भावना का प्रतीक है।'
        : 'Under MSME Citizen Charter and BCSBI standards, micro-credit applications must be disposed of within 2 to 3 weeks. Unexplained delay amounts to deficiency in banking service.',
      remedyDemand: isHindi
        ? 'अगले 7 कार्य दिवसों के भीतर ऋण स्वीकृति पत्र जारी किया जाए अन्यथा मामले को रिज़र्व बैंक लोकपाल को प्रेषित किया जाएगा।'
        : 'Issue formal sanction or disposal letter within 7 working days, failing which the matter shall be referred to the RBI Ombudsman.'
    },
    {
      id: 'coercive',
      title: isHindi ? 'कमीशन या निजी बीमा लेने का अनुचित दबाव' : 'Coercive Third-Party Insurance / Commission',
      desc: isHindi ? 'बैंक अधिकारी द्वारा ऋण स्वीकृति हेतु अनावश्यक निजी बीमा पॉलिसी या कमीशन का दबाव बनाया जा रहा है।' : 'Bank officials are coercing purchase of bundled insurance policies or undue fees.',
      legalClause: isHindi
        ? 'IRDAI एवं भारतीय रिज़र्व बैंक के संयुक्त निर्देशानुसार किसी भी ऋण स्वीकृति हेतु बैंक द्वारा किसी विशेष तृतीय-पक्ष बीमा उत्पाद की अनिवार्य खरीद (Forced Bundling / Tying-in) पूर्णतः गैर-कानूनी एवं कदाचार की श्रेणी में आता है।'
        : 'Per RBI & IRDAI joint guidelines, forced bundling or tying-in of third-party insurance products with credit facilities is strictly prohibited and illegal.',
      remedyDemand: isHindi
        ? 'ऋण से किसी भी अवांछित बीमा उत्पाद को हटाया जाए और शुद्ध सरकारी पात्रता के आधार पर राशि संवितरित की जाए।'
        : 'De-link all unrequested insurance products and disburse loan purely on verified scheme eligibility.'
    }
  ];

  const currentExcuse = excuses.find(e => e.id === selectedExcuse) || excuses[0];
  const currentDate = isHindi
    ? new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const applicantName = profile?.fullName || (isHindi ? 'उद्यमी (आवेदक)' : 'Entrepreneur (Applicant)');
  const applicantCategory = profile?.category || (isHindi ? 'सामान्य' : 'General');
  const applicantState = profile?.state || (isHindi ? 'बिहार' : 'Bihar');
  const applicantDistrict = profile?.district || (isHindi ? 'पटना' : 'Patna');
  const targetSchemeName = scheme?.name || 'Prime Minister Employment Generation Programme (PMEGP)';

  // Formal legal appeal letter content
  const fullLetterText = isHindi ? 
`दिनांक: ${currentDate}

सेवा में,
शाखा प्रबंधक महोदय,
${bankName},
शाखा: ${branchAddress}, ज़िला: ${applicantDistrict}, ${applicantState}

विषय: सरकारी योजनान्तर्गत ऋण आवेदन संख्या [${applicationRef}] के नियम विरुद्ध अस्वीकार/अवरोध के संबंध में औपचारिक वैधानिक अभ्यावेदन (Grievance Notice)।

महोदय,
सादर निवेदन है कि प्रार्थी ${applicantName}, निवासी: ${applicantDistrict} (${applicantState}), सामाजिक श्रेणी: ${applicantCategory}, ने भारत सरकार की महत्वाकांक्षी योजना "${targetSchemeName}" के तहत स्वरोज़गार स्थापना हेतु अपनी शाखा में विधिवत आवेदन (संदर्भ सं: ${applicationRef}) प्रस्तुत किया था।

अत्यंत खेद का विषय है कि उक्त आवेदन के संबंध में शाखा द्वारा निम्नलिखित अनुचित एवं गैर-कानूनी आधार प्रस्तुत किया गया:
"${currentExcuse.desc}"

इस संबंध में शाखा का ध्यान भारतीय रिज़र्व बैंक (RBI) एवं भारत सरकार के निम्नलिखित अधिदेशों की ओर आकर्षित किया जाता है:
1. ${currentExcuse.legalClause}
2. भारतीय रिज़र्व बैंक एकीकृत लोकपाल योजना 2021 (Integrated Ombudsman Scheme) के तहत बिना विधिक कारण के प्राथमिक क्षेत्र ऋण को अस्वीकार करना गंभीर सेवा न्यूनता (Deficiency in Service) है।

मांग एवं प्रार्थना:
अतः आपसे सादर अनुरोध है कि ${currentExcuse.remedyDemand}।
यदि आगामी 7 कार्य दिवसों में शाखा द्वारा उक्त आवेदन पर न्यायोचित निर्णय नहीं लिया जाता है, तो प्रार्थी विवश होकर निम्नलिखित सक्षम अधिकारियों के समक्ष लिखित शिकायत एवं हर्जाने हेतु वाद दायर करेगा:
1. माननीय ज़िला दंडाधिकारी (DM) एवं ज़िला परामर्शदात्री समिति (DCC)
2. ज़िला अग्रणी बैंक प्रबंधक (Lead District Manager - LDM)
3. भारतीय रिज़र्व बैंक (RBI) बैंकिंग लोकपाल पोर्टल (CMS - complaint management system)

भवदीय,
हस्ताक्षर: ________________________
नाम: ${applicantName}
मोबाईल: ________________________
पता: ${applicantDistrict}, ${applicantState}

प्रतिलिपि सूचनार्थ प्रेषित:
1. माननीय ज़िला दंडाधिकारी / उपायुक्त, ज़िला: ${applicantDistrict}
2. ज़िला अग्रणी बैंक प्रबंधक (LDM), ${applicantDistrict}
3. भारतीय रिज़र्व बैंक, बैंकिंग लोकपाल प्रकोष्ठ (RBI CMS Portal)` :
`Date: ${currentDate}

To,
The Branch Manager,
${bankName},
Branch: ${branchAddress}, District: ${applicantDistrict}, ${applicantState}

Subject: Formal Legal Grievance Notice against unlawful rejection / stalling of Credit Application No. [${applicationRef}] under Government Scheme.

Respected Sir/Madam,
With due respect, the applicant ${applicantName}, residing at ${applicantDistrict} (${applicantState}), Social Category: ${applicantCategory}, duly submitted an enterprise credit application (Ref: ${applicationRef}) under the prestigious Government Scheme "${targetSchemeName}".

It is deeply regrettable that the branch raised the following arbitrary and unlawful reason for refusal / stall:
"${currentExcuse.desc}"

In this regard, the attention of the branch is invited to binding Reserve Bank of India (RBI) mandates:
1. ${currentExcuse.legalClause}
2. Under the RBI Integrated Ombudsman Scheme 2021, arbitrary refusal of Priority Sector Lending constitutes severe Deficiency in Banking Service.

Demand & Prayer:
Hence, it is formally prayed that: ${currentExcuse.remedyDemand}
If the branch fails to take appropriate lawful action within 7 working days, the applicant shall formally lodge complaints and claim damages before:
1. District Magistrate (DM) & District Consultative Committee (DCC)
2. Lead District Manager (LDM)
3. RBI Banking Ombudsman (CMS Portal - cms.rbi.org.in)

Yours faithfully,
Signature: ________________________
Name: ${applicantName}
Mobile: ________________________
Address: ${applicantDistrict}, ${applicantState}

Copy forwarded for necessary information & intervention to:
1. The District Magistrate / Deputy Commissioner, District: ${applicantDistrict}
2. Lead District Manager (LDM), ${applicantDistrict}
3. Banking Ombudsman Cell, Reserve Bank of India (RBI CMS Portal)`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullLetterText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="ys-modal-overlay print:p-0 print:bg-white print:static animate-fadeIn">
      
      {/* Print isolation styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-appeal-letter, #printable-appeal-letter * {
            visibility: visible;
          }
          #printable-appeal-letter {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20mm;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #000000 !important;
            font-size: 13pt;
            line-height: 1.6;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="ys-modal-dialog max-w-4xl print:max-h-none print:shadow-none print:border-0">
        
        {/* Header Bar */}
        <div className="no-print ys-modal-header">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider border border-rose-200">
              <Scale className="w-3.5 h-3.5 text-rose-600" />
              <span>{isHindi ? 'AI Rejection Reverser • विधिक अपील जनरेटर' : 'AI Rejection Reverser • Legal Appeal Generator'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#173B57] flex items-center gap-2">
              <span>{isHindi ? '⚖️ बैंक ऋण अस्वीकृति / विलंब अपील पत्र' : '⚖️ Bank Loan Denial & Delay Appeal Notice'}</span>
            </h2>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              {isHindi
                ? 'अगर बैंक मैनेजर ने आपका लोन बिना लिखित कारण के मना किया या ज़मीन मांगी है, तो यह 1-क्लिक में आधिकारिक कानूनी नोटिस तैयार करता है।'
                : 'If a bank manager rejected your loan without written justification or demanded collateral, generate an official legal notice in 1-click.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-[#173B57] hover:bg-slate-100 transition shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-[#173B57]">
          
          {/* Step 1: Select Bank Excuse */}
          <div className="no-print space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#173B57] uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>{isHindi ? 'चरण 1: बैंक मैनेजर ने क्या बहाना बनाया? (कारण चुनें)' : 'Step 1: What excuse did the bank give?'}</span>
              </h3>
              <span className="text-[11px] text-slate-500">{isHindi ? 'आरबीआई नियम स्वतः शामिल होंगे' : 'RBI rules cited automatically'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {excuses.map((excuse) => (
                <button
                  key={excuse.id}
                  type="button"
                  onClick={() => setSelectedExcuse(excuse.id)}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between gap-1.5 ${
                    selectedExcuse === excuse.id
                      ? 'bg-[#F0FDFA] border-[#0F766E] text-[#115E59] shadow-xs'
                      : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1] text-[#173B57]'
                  }`}
                >
                  <div className="font-bold text-sm flex items-center justify-between">
                    <span>{excuse.title}</span>
                    {selectedExcuse === excuse.id && (
                      <span className="w-2 h-2 rounded-full bg-[#0F766E]" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{excuse.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Quick Bank Inputs */}
          <div className="no-print p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] text-[#173B57] font-bold block mb-1">{isHindi ? 'बैंक का नाम' : 'Bank Name'}</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="ys-input"
                placeholder={isHindi ? "उदा. State Bank of India" : "e.g. State Bank of India"}
              />
            </div>
            <div>
              <label className="text-[11px] text-[#173B57] font-bold block mb-1">{isHindi ? 'शाखा / शाखा पता' : 'Branch Address'}</label>
              <input
                type="text"
                value={branchAddress}
                onChange={(e) => setBranchAddress(e.target.value)}
                className="ys-input"
                placeholder={isHindi ? "उदा. गांधी मैदान शाखा, पटना" : "e.g. Main Branch, Patna"}
              />
            </div>
            <div>
              <label className="text-[11px] text-[#173B57] font-bold block mb-1">{isHindi ? 'आवेदन / पावती संख्या' : 'Application Ref'}</label>
              <input
                type="text"
                value={applicationRef}
                onChange={(e) => setApplicationRef(e.target.value)}
                className="ys-input"
                placeholder="PMEGP-2026-98124"
              />
            </div>
          </div>

          {/* Step 3: Generated Formal Legal Notice Preview */}
          <div className="space-y-2">
            <div className="no-print flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#173B57]">
                <FileText className="w-4 h-4 text-[#0F766E]" />
                <span>{isHindi ? 'तैयार विधिक अभ्यावेदन पत्र (Legal Grievance Letter):' : 'Generated Legal Grievance Letter:'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#173B57] font-bold text-xs transition flex items-center gap-1.5 border border-[#CBD5E1] shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#0F766E]" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : (isHindi ? 'पत्र कॉपी करें' : 'Copy Notice')}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs transition flex items-center gap-1.5 shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'प्रिंट / PDF' : 'Print / PDF'}</span>
                </button>
              </div>
            </div>

            {/* The Printable Letter Paper */}
            <div 
              id="printable-appeal-letter"
              className="p-6 sm:p-8 rounded-xl bg-white text-slate-900 shadow-2xs border border-[#CBD5E1] font-serif leading-relaxed whitespace-pre-line text-xs sm:text-sm select-text"
            >
              {fullLetterText}
            </div>
          </div>

          {/* Legal Escalation Hotlines */}
          <div className="no-print p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-600 text-xs">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#0F766E] shrink-0" />
              <span>{isHindi ? 'अगर बैंक फिर भी न सुने, तो सीधे रिज़र्व बैंक लोकपाल को कॉल करें:' : 'If the bank still stalls, escalate to RBI Banking Ombudsman:'}</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="tel:14448"
                className="px-3 py-1.5 rounded-lg bg-white text-[#0F766E] border border-[#14B8A6]/40 font-bold hover:bg-[#F0FDFA] transition flex items-center gap-1"
              >
                <span>📞 RBI Ombudsman: 14448</span>
              </a>
              <a
                href="https://cms.rbi.org.in"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white text-[#0369A1] border border-[#38BDF8]/40 font-bold hover:bg-[#F0F9FF] transition flex items-center gap-1"
              >
                <span>CMS Portal ↗</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="no-print p-4 sm:p-5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="ys-btn-secondary"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="ys-btn-primary"
          >
            <Printer className="w-4 h-4" />
            <span>{isHindi ? 'पत्र प्रिंट / PDF डाउनलोड करें' : 'Print / Save PDF Notice'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
