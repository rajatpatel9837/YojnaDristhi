// client/src/components/RejectionAppealModal.jsx
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
  const [selectedExcuse, setSelectedExcuse] = useState('collateral');
  const [bankName, setBankName] = useState('State Bank of India');
  const [branchAddress, setBranchAddress] = useState(`${profile?.district || 'Patna'} Main Branch`);
  const [applicationRef, setApplicationRef] = useState(`APP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const excuses = [
    {
      id: 'collateral',
      title_hi: 'ज़मीन के कागज़ / गारंटी की मांग',
      desc_hi: 'मैनेजर संपार्श्विक गारंटी (Collateral Security) या थर्ड-पार्टी गारंटर मांग रहा है।',
      legalClause_hi: 'RBI Circular RPCD.SME&NFS.BC.No.79/06.02.31/2009-10 दिनांक 6 मई 2010 के अनुसार सूक्ष्म एवं लघु उद्यमों को ₹10 लाख तक के ऋण पर किसी भी प्रकार की संपार्श्विक सुरक्षा (Collateral) की मांग करना पूर्णतः प्रतिबंधित एवं दंडनीय है।',
      remedyDemand_hi: 'उक्त परिपत्र के अनुपालन में बिना किसी कोलेटरल या गारंटर के आवेदन को त्वरित स्वीकृति प्रदान की जाए।'
    },
    {
      id: 'target',
      title_hi: 'सरकारी टारगेट / कोटा खत्म होने का बहाना',
      desc_hi: 'बैंक कह रहा है कि इस वित्तीय वर्ष का सरकारी लक्ष्य (Target) पूरा हो चुका है।',
      legalClause_hi: 'RBI Master Direction on Priority Sector Lending (FIDD.CO.Plan.BC.5/04.09.01/2020-21) एवं KVIC दिशानिर्देशों के तहत प्राथमिक क्षेत्र ऋण (Priority Sector) एवं PMEGP निरंतर मांग-आधारित (Continuous Credit) योजनाएं हैं, जिन्हें वर्ष भर बिना रोके स्वीकृत करना अनिवार्य है।',
      remedyDemand_hi: 'आरबीआई प्राथमिक क्षेत्र ऋण नीति के तहत आवेदन को बिना कोटा अवरोध के तत्काल प्रोसेस किया जाए।'
    },
    {
      id: 'delay',
      title_hi: '30 दिनों से अधिक समय से अकारण लंबित',
      desc_hi: 'आवेदन को 30 दिनों से अधिक समय से बिना किसी लिखित आपत्ति या कारण के लटकाया गया है।',
      legalClause_hi: 'MSME सिटीजन्स चार्टर एवं RBI BCSBI Code के अंतर्गत ₹5 लाख तक के एमएसएमई ऋण आवेदनों का निस्तारण अधिकतम 2 से 3 सप्ताह में करना अनिवार्य है। अनावश्यक विलंब प्रशासनिक दुर्भावना का प्रतीक है।',
      remedyDemand_hi: 'अगले 7 कार्य दिवसों के भीतर ऋण स्वीकृति पत्र जारी किया जाए अन्यथा मामले को रिज़र्व बैंक लोकपाल को प्रेषित किया जाएगा।'
    },
    {
      id: 'coercive',
      title_hi: 'कमीशन या निजी बीमा लेने का अनुचित दबाव',
      desc_hi: 'बैंक अधिकारी द्वारा ऋण स्वीकृति हेतु अनावश्यक निजी बीमा पॉलिसी या कमीशन का दबाव बनाया जा रहा है।',
      legalClause_hi: 'IRDAI एवं भारतीय रिज़र्व बैंक के संयुक्त निर्देशानुसार किसी भी ऋण स्वीकृति हेतु बैंक द्वारा किसी विशेष तृतीय-पक्ष बीमा उत्पाद की अनिवार्य खरीद (Forced Bundling / Tying-in) पूर्णतः गैर-कानूनी एवं कदाचार की श्रेणी में आता है।',
      remedyDemand_hi: 'ऋण से किसी भी अवांछित बीमा उत्पाद को हटाया जाए और शुद्ध सरकारी पात्रता के आधार पर राशि संवितरित की जाए।'
    }
  ];

  const currentExcuse = excuses.find(e => e.id === selectedExcuse) || excuses[0];
  const currentDate = new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const applicantName = profile?.fullName || 'उद्यमी (आवेदक)';
  const applicantCategory = profile?.category || 'सामान्य';
  const applicantState = profile?.state || 'बिहार';
  const applicantDistrict = profile?.district || 'पटना';
  const targetSchemeName = scheme?.name || 'Prime Minister Employment Generation Programme (PMEGP)';

  // Formal legal appeal letter content
  const fullLetterText = 
`दिनांक: ${currentDate}

सेवा में,
शाखा प्रबंधक महोदय,
${bankName},
शाखा: ${branchAddress}, ज़िला: ${applicantDistrict}, ${applicantState}

विषय: सरकारी योजनान्तर्गत ऋण आवेदन संख्या [${applicationRef}] के नियम विरुद्ध अस्वीकार/अवरोध के संबंध में औपचारिक वैधानिक अभ्यावेदन (Grievance Notice)।

महोदय,
सादर निवेदन है कि प्रार्थी ${applicantName}, निवासी: ${applicantDistrict} (${applicantState}), सामाजिक श्रेणी: ${applicantCategory}, ने भारत सरकार की महत्वाकांक्षी योजना "${targetSchemeName}" के तहत स्वरोज़गार स्थापना हेतु अपनी शाखा में विधिवत आवेदन (संदर्भ सं: ${applicationRef}) प्रस्तुत किया था।

अत्यंत खेद का विषय है कि उक्त आवेदन के संबंध में शाखा द्वारा निम्नलिखित अनुचित एवं गैर-कानूनी आधार प्रस्तुत किया गया:
"${currentExcuse.desc_hi}"

इस संबंध में शाखा का ध्यान भारतीय रिज़र्व बैंक (RBI) एवं भारत सरकार के निम्नलिखित अधिदेशों की ओर आकर्षित किया जाता है:
1. ${currentExcuse.legalClause_hi}
2. भारतीय रिज़र्व बैंक एकीकृत लोकपाल योजना 2021 (Integrated Ombudsman Scheme) के तहत बिना विधिक कारण के प्राथमिक क्षेत्र ऋण को अस्वीकार करना गंभीर सेवा न्यूनता (Deficiency in Service) है।

मांग एवं प्रार्थना:
अतः आपसे सादर अनुरोध है कि ${currentExcuse.remedyDemand_hi}।
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
3. भारतीय रिज़र्व बैंक, बैंकिंग लोकपाल प्रकोष्ठ (RBI CMS Portal)`;

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static animate-fadeIn">
      
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

      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100 print:max-h-none print:shadow-none print:border-0">
        
        {/* Header Bar */}
        <div className="no-print bg-gradient-to-r from-rose-900 via-slate-900 to-slate-950 p-5 sm:p-6 border-b border-rose-500/20 flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black uppercase tracking-wider border border-rose-400/30">
              <Scale className="w-3.5 h-3.5 text-rose-400" />
              <span>AI Rejection Reverser • विधिक अपील जनरेटर</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>⚖️ बैंक ऋण अस्वीकृति / विलंब अपील पत्र</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              अगर बैंक मैनेजर ने आपका लोन बिना लिखित कारण के मना किया या ज़मीन मांगी है, तो यह 1-क्लिक में आधिकारिक कानूनी नोटिस तैयार करता है।
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Step 1: Select Bank Excuse */}
          <div className="no-print space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>चरण 1: बैंक मैनेजर ने क्या बहाना बनाया? (कारण चुनें)</span>
              </h3>
              <span className="text-[11px] text-slate-400">आरबीआई नियम स्वतः शामिल होंगे</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {excuses.map((excuse) => (
                <button
                  key={excuse.id}
                  type="button"
                  onClick={() => setSelectedExcuse(excuse.id)}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between gap-1.5 ${
                    selectedExcuse === excuse.id
                      ? 'bg-rose-950/40 border-rose-500 text-white ring-1 ring-rose-500'
                      : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 text-slate-300'
                  }`}
                >
                  <div className="font-bold text-sm flex items-center justify-between">
                    <span>{excuse.title_hi}</span>
                    {selectedExcuse === excuse.id && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{excuse.desc_hi}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Quick Bank Inputs */}
          <div className="no-print p-4 rounded-2xl bg-slate-800/50 border border-slate-700/70 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">बैंक का नाम</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-rose-500"
                placeholder="उदा. State Bank of India"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">शाखा / शाखा पता</label>
              <input
                type="text"
                value={branchAddress}
                onChange={(e) => setBranchAddress(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-rose-500"
                placeholder="उदा. गांधी मैदान शाखा, पटना"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-bold uppercase">आवेदन / पावती संख्या</label>
              <input
                type="text"
                value={applicationRef}
                onChange={(e) => setApplicationRef(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-rose-500"
                placeholder="उदा. PMEGP-2026-98124"
              />
            </div>
          </div>

          {/* Step 3: Generated Formal Legal Notice Preview */}
          <div className="space-y-2">
            <div className="no-print flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>तैयार विधिक अभ्यावेदन पत्र (Legal Grievance Letter):</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5 border border-slate-700 active:scale-95"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'कॉपी हो गया!' : 'पत्र कॉपी करें'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>प्रिंट / PDF</span>
                </button>
              </div>
            </div>

            {/* The Printable Letter Paper */}
            <div 
              id="printable-appeal-letter"
              className="p-6 sm:p-8 rounded-2xl bg-white text-slate-900 shadow-inner border border-slate-300 font-serif leading-relaxed whitespace-pre-line text-xs sm:text-sm select-text"
            >
              {fullLetterText}
            </div>
          </div>

          {/* Legal Escalation Hotlines */}
          <div className="no-print p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-300 text-xs">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>अगर बैंक फिर भी न सुने, तो सीधे रिज़र्व बैंक लोकपाल को कॉल करें:</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="tel:14448"
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold hover:bg-emerald-500/30 transition flex items-center gap-1"
              >
                <span>📞 RBI Ombudsman: 14448</span>
              </a>
              <a
                href="https://cms.rbi.org.in"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30 font-bold hover:bg-sky-500/30 transition flex items-center gap-1"
              >
                <span>CMS Portal ↗</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="no-print p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
          >
            बंद करें
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>पत्र प्रिंट / PDF डाउनलोड करें</span>
          </button>
        </div>

      </div>
    </div>
  );
}
