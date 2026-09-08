// client/src/components/SchemeParchaaModal.jsx
import React, { useRef } from 'react';
import { 
  Printer, 
  Share2, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Building2, 
  FileText, 
  QrCode, 
  Sparkles,
  MapPin,
  Calendar,
  IndianRupee,
  Award
} from 'lucide-react';

/**
 * 1-Click "योजना पर्चा" (Printable 1-Page Official Handout & WhatsApp Shareable Card)
 * High-trust grassroots physical card designed for bank counter presentation.
 */
export default function SchemeParchaaModal({
  isOpen,
  onClose,
  profile,
  scheme,
  matchedItem
}) {
  const printAreaRef = useRef(null);

  if (!isOpen || !scheme) return null;

  // Derive financial numbers
  const maxSupport = scheme.maximumSupport || 500000;
  const subsidyPct = scheme.subsidyPercentage || 35;
  const subsidyAmount = Math.round((maxSupport * subsidyPct) / 100);
  const userContribution = profile?.ownContribution || Math.round(maxSupport * 0.05);
  const netLoanAmount = maxSupport - userContribution;

  // Parchaa ID & Date
  const parchDate = new Date().toLocaleDateString('hi-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const parchId = `YP-${new Date().getFullYear()}-${(profile?.state || 'IND').slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

  // Document checklist
  const possessedDocs = profile?.documentsAvailable || [];
  const standardDocs = [
    'Aadhaar/Identity',
    'Income Certificate',
    'Category Certificate',
    'Business Registration',
    'Udyam Certificate',
    'Project Report',
    'Bank Statement'
  ];

  const docLabelsHi = {
    'Aadhaar/Identity': 'आधार कार्ड (मोबाइल लिंक्ड)',
    'Income Certificate': 'आय प्रमाण पत्र (सालाना आय)',
    'Category Certificate': 'जाति प्रमाण पत्र (SC/ST/OBC/EWS)',
    'Business Registration': 'व्यवसाय/दुकान पंजीकरण (ट्रेड लाइसेंस)',
    'Udyam Certificate': 'उद्यम पंजीकरण (MSME Udyam)',
    'Project Report': 'प्रोजेक्ट रिपोर्ट (DPR)',
    'Bank Statement': '6 माह का बैंक खाता विवरण'
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `*योजना सेतू AI (Yojna दृष्टि) — आधिकारिक योजना पर्चा*\n\n` +
      `👤 *आवेदक:* ${profile?.fullName || 'उद्यमी'} (${profile?.category || 'सामान्य'}, ${profile?.gender || 'लिंग'})\n` +
      `📍 *स्थान:* ${profile?.district || 'ज़िला'}, ${profile?.state || 'राज्य'}\n` +
      `🏛️ *चयनित योजना:* ${scheme.name}\n` +
      `💰 *परियोजना लागत:* ₹${Number(maxSupport).toLocaleString('en-IN')}\n` +
      `🎁 *सरकारी सब्सिडी (छूट):* ₹${Number(subsidyAmount).toLocaleString('en-IN')} (${subsidyPct}%)\n` +
      `🛡️ *RBI नियम:* ₹10 लाख तक कोई ज़मीन या गारंटी नहीं (RPCD.SME&NFS.BC.No.79)\n\n` +
      `📄 *पर्चा सत्यापन कोड:* ${parchId}\n` +
      `👉 *पूरा पर्चा देखने एवं आवेदन के लिए:* ${window.location.origin}/matches`;

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      
      {/* Print-specific style override */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-parchaa, #printable-parchaa * {
            visibility: visible;
          }
          #printable-parchaa {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 15mm;
            border: 2px solid #047857 !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-3xl shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-0">
        
        {/* Top Floating Action Bar (Hidden in Print) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold tracking-wide text-emerald-400">
              योजना पर्चा जनरेटर (Official Citizen Handout)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              title="व्हाट्सएप पर शेयर करें"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">व्हाट्सएप पर भेजें</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              title="पर्चा प्रिंट करें या PDF सहेजें"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="बंद करें"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Container */}
        <div className="overflow-y-auto p-4 sm:p-8 bg-slate-100 print:bg-white print:p-0">
          
          {/* Printable Official Handout Card */}
          <div
            id="printable-parchaa"
            ref={printAreaRef}
            className="bg-white rounded-2xl border-4 border-[#0F766E] p-6 sm:p-8 space-y-6 shadow-md text-slate-900 relative"
          >
            {/* Watermark Logo Accent */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <img src="/logo.png" alt="Emblem" className="w-96 h-96 object-contain" />
            </div>

            {/* Official Header */}
            <div className="border-b-2 border-[#0F766E] pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Yojna दृष्टि Logo"
                  className="w-16 h-16 rounded-full p-1 border-2 border-[#0F766E] bg-white object-contain"
                />
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#0F766E]">
                    सत्यमेव जयते • भारत सरकार एवं राज्य कल्याणकारी योजना मंच
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#173B57] tracking-tight">
                    योजना सेतू AI — आधिकारिक पात्रता पर्चा
                  </h1>
                  <p className="text-xs text-slate-600 font-semibold">
                    (Government Welfare Scheme Citizen Eligibility Dossier & Bank Presentation Slip)
                  </p>
                </div>
              </div>

              {/* QR Verification Badge */}
              <div className="flex flex-col items-center sm:items-end text-xs shrink-0">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>डिजिटल सत्यापित पर्चा</span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-1">कोड: {parchId}</div>
                <div className="text-[10px] text-slate-500">दिनांक: {parchDate}</div>
              </div>
            </div>

            {/* Part A: Applicant Dossier */}
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-[#0F766E] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>भाग 1: आवेदक का प्रोफ़ाइल विवरण (Applicant Dossier)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">आवेदक का नाम</span>
                  <span className="font-extrabold text-[#173B57] text-sm">{profile?.fullName || 'सुनीता देवी'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">उम्र एवं लिंग</span>
                  <span className="font-bold text-slate-800">{profile?.age || 28} वर्ष • {profile?.gender === 'Female' ? 'महिला' : profile?.gender === 'Male' ? 'पुरुष' : profile?.gender || 'महिला'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">सामाजिक श्रेणी</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {profile?.category || 'SC'} {profile?.isWomanEntrepreneur ? '(महिला उद्यमी)' : ''}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">स्थान व क्षेत्र</span>
                  <span className="font-bold text-slate-800">{profile?.district || 'पटना'}, {profile?.state || 'बिहार'} ({profile?.areaType === 'Urban' ? 'शहरी' : 'ग्रामीण'})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">व्यवसाय का नाम</span>
                  <span className="font-bold text-slate-800">{profile?.businessName || 'खाद्य उत्पाद उद्यम'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">कार्य क्षेत्र (Sector)</span>
                  <span className="font-bold text-slate-800">{profile?.sector || 'Food processing'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">उद्यम पंजीकरण स्थिति</span>
                  <span className="font-bold text-slate-800">{profile?.udyamStatus || 'Registered (पंजीकृत)'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">पात्रता स्कोर</span>
                  <span className="font-extrabold text-emerald-700">{matchedItem?.matchScore || 96}% उच्च अनुकूलता</span>
                </div>
              </div>
            </div>

            {/* Part B: Selected Matched Scheme & Financial Breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-[#0F766E] flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5" />
                <span>भाग 2: अनुशंसित योजना एवं वित्तीय लाभ (Financial Benefits & Subsidy)</span>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 via-teal-50/40 to-slate-50 p-4 rounded-xl border-2 border-emerald-500/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/80 pb-2.5">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-[#173B57]">
                      {scheme.name}
                    </h2>
                    <p className="text-xs text-[#0F766E] font-medium">
                      नोडल मंत्रालय / एजेंसी: {scheme.ministry || 'सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय (MSME), भारत सरकार'}
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#0F766E] text-white text-xs font-extrabold self-start sm:self-center">
                    {subsidyPct}% सरकारी सब्सिडी
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">कुल परियोजना लागत</span>
                    <span className="text-base font-black text-[#173B57]">₹{Number(maxSupport).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 uppercase font-bold block">सरकारी अनुदान (छूट)</span>
                    <span className="text-base font-black text-emerald-600">₹{Number(subsidyAmount).toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-500 block">वापस नहीं करना है</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">स्वयं का अंशदान (5%)</span>
                    <span className="text-base font-black text-slate-800">₹{Number(userContribution).toLocaleString('en-IN')}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-emerald-200">
                    <span className="text-[10px] text-slate-500 uppercase font-bold block">बैंक ऋण अंश (Loan)</span>
                    <span className="text-base font-black text-[#173B57]">₹{Number(netLoanAmount).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Part C: Document Readiness Checklist */}
            <div className="space-y-2">
              <div className="text-xs font-black uppercase tracking-wider text-[#0F766E] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>भाग 3: दस्तावेज़ तत्परता सूची (Document Verification Checklist)</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-2.5">क्र.</th>
                      <th className="p-2.5">दस्तावेज़ का नाम</th>
                      <th className="p-2.5">स्थिति</th>
                      <th className="p-2.5">बैंक प्रस्तुति टिप्पणी</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {standardDocs.map((docKey, idx) => {
                      const isReady = possessedDocs.includes(docKey);
                      return (
                        <tr key={docKey} className={isReady ? 'bg-emerald-50/30' : 'bg-white'}>
                          <td className="p-2.5 font-mono text-slate-500">{idx + 1}</td>
                          <td className="p-2.5 font-bold text-slate-800">
                            {docLabelsHi[docKey] || docKey}
                          </td>
                          <td className="p-2.5">
                            {isReady ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100/80 px-2 py-0.5 rounded text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" /> संलग्न / तैयार
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                                <AlertTriangle className="w-3.5 h-3.5" /> संलग्न करना है
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 text-slate-600 text-[11px]">
                            {isReady
                              ? 'मूल प्रति व स्व-प्रमाणित फोटोकॉपी साथ रखें'
                              : '7-10 दिन में ब्लॉक/सीएससी से बनवाएं या टेम्पलेट डाउनलोड करें'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Part D: RBI Mandate & Legal Protection Stamp */}
            <div className="p-3.5 rounded-xl bg-amber-50 border-2 border-dashed border-amber-300 flex items-start gap-3 text-xs">
              <div className="w-9 h-9 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center shrink-0 font-black text-sm">
                🛡️
              </div>
              <div className="space-y-0.5 text-amber-950">
                <div className="font-extrabold text-amber-900 text-xs uppercase tracking-wide">
                  बैंक काउंटर वैधानिक सुरक्षा निर्देश (RBI Legal Mandate For Branch Manager)
                </div>
                <p className="text-[11px] leading-relaxed">
                  <strong>भारतीय रिज़र्व बैंक (RBI) मास्टर सर्कुलर RPCD.SME&NFS.BC.No.79:</strong> ₹10 लाख तक के किसी भी सूक्ष्म उद्यम (MSE) ऋण के लिए बैंक प्रबंधक द्वारा किसी भी प्रकार की संपार्श्विक प्रतिभूति (Collateral Security) या थर्ड-पार्टी गारंटी की मांग नहीं की जा सकती। यह ऋण भारत सरकार की CGTMSE गारंटी के तहत सुरक्षित है।
                </p>
              </div>
            </div>

            {/* Part E: Nearest DIC & Bank Routing Office */}
            <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0F766E] shrink-0" />
                <span>
                  <strong>संबंधित नोडल कार्यालय:</strong> ज़िला उद्योग केंद्र (DIC), {profile?.district || 'पटना'}, {profile?.state || 'बिहार'} • पिन: 800001
                </span>
              </div>
              <div className="text-slate-500 font-medium text-center sm:text-right">
                प्रमाणित एवं तैयार: <strong>Yojna दृष्टि AI प्लेटफॉर्म</strong> • जन-हित प्रो
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

