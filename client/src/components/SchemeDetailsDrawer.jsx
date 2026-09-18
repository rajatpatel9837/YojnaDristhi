import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  BookOpen, 
  Layers, 
  ChevronRight,
  Info,
  Building,
  Printer,
  Scale,
  Zap,
  Coffee
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import VerificationBadge from './VerificationBadge';

/**
 * SchemeDetailsDrawer
 * Responsive drawer / centered modal for deep scheme details.
 * Separates full eligibility, documents, application steps, and notes from the result cards list.
 */
export default function SchemeDetailsDrawer({
  isOpen,
  onClose,
  scheme,
  item,
  profile,
  onApply,
  onOpenCompanion,
  onOpenDocResolver,
  onOpenParchaa,
  onOpenCalculator
}) {
  const { t, isHindi } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'eligibility' | 'documents' | 'how_to_apply' | 'notes'

  if (!isOpen || !scheme) return null;

  const matchScore = item?.matchScore || 85;
  const isNotEligible = item?.eligibilityStatus === 'NOT_ELIGIBLE';

  const tabs = [
    { id: 'overview', label: isHindi ? 'योजना सारांश' : 'Overview', icon: Info },
    { id: 'eligibility', label: isHindi ? 'पात्रता विवरण' : 'Eligibility', icon: CheckCircle2 },
    { id: 'documents', label: isHindi ? 'दस्तावेज़' : 'Documents', icon: FileText },
    { id: 'how_to_apply', label: isHindi ? 'आवेदन प्रक्रिया' : 'How to Apply', icon: BookOpen },
    { id: 'notes', label: isHindi ? 'महत्वपूर्ण नियम' : 'Key Terms & RBI Rules', icon: ShieldCheck }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#173B57]/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Dialog Surface (Right Slide-Over on Desktop, Full Height on Mobile) */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden">
        
        {/* Drawer Header */}
        <div className="bg-[#F8FAFC] px-6 py-5 border-b border-[#E2E8F0] space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <VerificationBadge 
                  status={scheme.verificationStatus === 'VERIFIED' ? 'OFFICIAL_GOVERNMENT_SCHEME' : scheme.verificationStatus || 'OFFICIAL_GOVERNMENT_SCHEME'} 
                  type="OPPORTUNITY" 
                />
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  isNotEligible 
                    ? 'bg-rose-100 text-rose-800' 
                    : 'bg-[#CCFBF1] text-[#115E59]'
                }`}>
                  {isNotEligible ? (isHindi ? 'अपात्र' : 'Not Eligible') : (isHindi ? 'संभावित पात्र' : 'Eligible')}
                </span>
                <span className="text-[11px] font-bold text-[#0F766E] bg-[#F0FDFA] px-2.5 py-0.5 rounded-full border border-[#14B8A6]/30">
                  {matchScore}% {isHindi ? 'पात्रता मेल' : 'Match Fit'}
                </span>
              </div>

              <h2 className="text-xl font-bold text-[#173B57] leading-snug pt-1">
                {scheme.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {scheme.provider}
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

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-1.5 border-b border-[#E2E8F0] pt-2 overflow-x-auto no-scrollbar text-xs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-2.5 px-3 font-bold transition whitespace-nowrap flex items-center gap-1.5 border-b-2 -mb-px ${
                    isActive 
                      ? 'border-[#0F766E] text-[#0F766E]' 
                      : 'border-transparent text-slate-500 hover:text-[#173B57]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Short Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  {isHindi ? 'योजना का उद्देश्य' : 'About this Scheme'}
                </h4>
                <p className="text-slate-700 leading-relaxed text-sm">
                  {scheme.description || (isHindi 
                    ? 'यह भारत सरकार की प्रमुख कल्याणकारी योजना है, जिसका उद्देश्य सूक्ष्म, लघु और मध्यम उद्यमियों एवं प्राथमिकता प्राप्त वर्गों को वित्तीय सहायता, सब्सिडी एवं रियायती ऋण उपलब्ध कराना है।'
                    : 'A flagship government initiative designed to empower entrepreneurs and eligible citizens with collateral-free credit, capital subsidies, and institutional support.')}
                </p>
              </div>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-2 gap-3.5 bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                    {isHindi ? 'अधिकतम वित्तीय सहायता' : 'Max Financial Support'}
                  </span>
                  <span className="text-lg font-black text-[#173B57] block mt-0.5">
                    {typeof scheme.maximumSupport === 'number'
                      ? `₹${((scheme.maximumSupport) / 100000).toFixed(1)} ${isHindi ? 'लाख' : 'Lakh'}`
                      : (scheme.maximumSupport || scheme.benefit || (isHindi ? '₹10 लाख तक' : 'Up to ₹10 Lakh'))}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                    {isHindi ? 'सरकारी सब्सिडी' : 'Subsidy Percentage'}
                  </span>
                  <span className="text-lg font-black text-[#0F766E] block mt-0.5">
                    {scheme.subsidyPercentage ? `${scheme.subsidyPercentage}% Margin Subsidy` : (isHindi ? 'सीधा अनुदान' : 'Direct Support')}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                    {isHindi ? 'ब्याज दर' : 'Interest Rate'}
                  </span>
                  <span className="text-sm font-bold text-[#173B57] block mt-0.5">
                    {scheme.interestRate || '8.5'}% {isHindi ? 'प्रति वर्ष' : 'p.a.'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                    {isHindi ? 'मोरेटोरियम (छूट अवधि)' : 'Moratorium Period'}
                  </span>
                  <span className="text-sm font-bold text-[#173B57] block mt-0.5">
                    {scheme.moratoriumPeriodMonths || 6} {isHindi ? 'महीने' : 'Months'}
                  </span>
                </div>
              </div>

              {/* Ministry & Source Disclaimers */}
              <div className="p-4 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] space-y-1 text-xs text-[#0F766E]">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
                  <span>{isHindi ? 'आधिकारिक सरकारी स्रोत से सत्यापित' : 'Verified Official Government Source'}</span>
                </div>
                <p className="text-slate-600 text-xs">
                  {scheme.provider} • {isHindi ? 'मंत्रालय राजपत्र एवं दिशानिर्देश' : 'Ministry Gazette & Guidelines'}
                </p>
                {scheme.officialUrl && (
                  <a
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-[#0F766E] underline pt-1"
                  >
                    <span>{isHindi ? 'आधिकारिक पोर्टल लिंक देखें ↗' : 'Visit Official Ministry Website ↗'}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ELIGIBILITY */}
          {activeTab === 'eligibility' && (
            <div className="space-y-5">
              {/* Group 1: You Already Meet */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-[#0F766E] font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                  <span>{isHindi ? 'शर्तें जो आप पूरी करते हैं (You Already Meet)' : 'Criteria You Already Meet'}</span>
                </div>
                <div className="p-4 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] space-y-2">
                  {item?.matchedCriteria && item.matchedCriteria.length > 0 ? (
                    item.matchedCriteria.map((match, mIdx) => (
                      <div key={mIdx} className="flex items-start gap-2 text-xs sm:text-sm text-[#134E4A]">
                        <span className="font-black text-[#0F766E] shrink-0">✓</span>
                        <span>{typeof match === 'string' ? match : match.text || match.criterion}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500">
                      {isHindi ? 'आपके बुनियादी जनसांख्यिकीय विवरण इस योजना के अनुरूप हैं।' : 'Your primary profile details match general demographic norms.'}
                    </p>
                  )}
                </div>
              </div>

              {/* Group 2: You Need to Confirm / Verification items */}
              {item?.gapAnalysis && item.gapAnalysis.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>{isHindi ? 'पुष्टि आवश्यक / बाकी कागज़ (You Need to Confirm)' : 'Verification & Documents Needed'}</span>
                  </div>
                  <div className="space-y-2">
                    {item.gapAnalysis.map((gap, gIdx) => (
                      <div key={gIdx} className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <strong className="text-amber-900 font-bold text-xs sm:text-sm">{gap.item}:</strong>{' '}
                          <span className="text-amber-800 text-xs">{gap.action}</span>
                        </div>
                        {onOpenDocResolver && (
                          <button
                            type="button"
                            onClick={() => onOpenDocResolver(gap.item || 'Income Certificate')}
                            className="ys-btn-secondary text-xs py-1 px-2.5 shrink-0"
                          >
                            <span>{isHindi ? 'कागज़ गाइड ↗' : 'How to Obtain ↗'}</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Group 3: Failed criteria (if any) */}
              {item?.failedCriteria && item.failedCriteria.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>{isHindi ? 'अपात्रता के बिंदु (Not Currently Eligible)' : 'Criteria Not Met'}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2 text-xs sm:text-sm text-rose-900">
                    {item.failedCriteria.map((fail, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2">
                        <span className="font-black text-rose-600 shrink-0">✕</span>
                        <span>{typeof fail === 'object' ? `${fail.field}: ${fail.reason}` : fail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  {isHindi ? 'दस्तावेज़ स्थिति' : 'Document Checklist & Status'}
                </h4>
                <p className="text-xs text-slate-600">
                  {isHindi 
                    ? 'आवेदन को तेज़ी से स्वीकृत कराने के लिए आवश्यक प्रमाणपत्र एवं विवरण।'
                    : 'Documents and certificates required for seamless verification and sanction.'}
                </p>
              </div>

              {/* Ready Documents */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isHindi ? 'तैयार दस्तावेज़ (Ready)' : 'Available / Ready Documents'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {['Aadhaar / Identity Proof', 'Bank Account / Passbook', 'Photograph', 'Mobile Linked OTP'].map((doc, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Still Needed Documents */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>{isHindi ? 'आवश्यक प्रमाणपत्र (Still Needed)' : 'Certificates Often Requested'}</span>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { name: 'Income Certificate (आय प्रमाण पत्र)', desc: 'Required for special margin subsidy slab' },
                    { name: 'Category Certificate (जाति प्रमाण पत्र)', desc: 'Required for SC/ST/OBC special quotas' },
                    { name: 'Udyam Registration (उद्यम प्रमाण पत्र)', desc: 'Instant 5-minute registration via MSME portal' }
                  ].map((doc, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3">
                      <div>
                        <strong className="text-slate-800 block text-xs">{doc.name}</strong>
                        <span className="text-slate-500 text-[11px]">{doc.desc}</span>
                      </div>
                      {onOpenDocResolver && (
                        <button
                          type="button"
                          onClick={() => onOpenDocResolver(doc.name)}
                          className="ys-btn-secondary text-[11px] py-1 px-2.5 shrink-0"
                        >
                          {isHindi ? 'गाइड देखें' : 'Get Help'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HOW TO APPLY */}
          {activeTab === 'how_to_apply' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  {isHindi ? 'आवेदन कैसे करें (3 सरल चरण)' : 'How to Apply (3 Clear Steps)'}
                </h4>
                <p className="text-xs text-slate-600">
                  {isHindi
                    ? 'योजना सेतु के माध्यम से आवेदन प्रक्रिया पारदर्शी एवं सरल है:'
                    : 'Follow these straightforward steps to submit your application without intermediaries:'}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    step: 1,
                    title: isHindi ? 'योजना सेतु पर ऑटो-फ़िल आवेदन समीक्षा' : 'Auto-Fill Review on YojnaSetu',
                    desc: isHindi ? 'आपके प्रोफ़ाइल डेटा से आवेदन पत्र पहले से भरा जाता है। विवरण की पुष्टि करें।' : 'Your profile data pre-fills the standard application form in 1-click.'
                  },
                  {
                    step: 2,
                    title: isHindi ? 'DigiLocker / दस्तावेज़ सत्यापन' : 'DigiLocker / Document Consent',
                    desc: isHindi ? 'सत्यापित प्रमाणपत्र स्वतः संलग्न होते हैं, कागज़ी प्रति जमा करने की आवश्यकता नहीं।' : 'Securely verify identity and certificates with instant verification.'
                  },
                  {
                    step: 3,
                    title: isHindi ? 'आधिकारिक पोर्टल या बैंक में जमा' : 'Official Portal Submission & PFMS Tracking',
                    desc: isHindi ? 'आवेदन संख्या प्राप्त करें और PFMS के माध्यम से सब्सिडी ट्रैकिंग शुरू करें।' : 'Receive your application ID and track status through the 8-stage PFMS lifecycle.'
                  }
                ].map((s) => (
                  <div key={s.step} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#0F766E] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {s.step}
                    </div>
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-[#173B57] text-xs sm:text-sm">{s.title}</h5>
                      <p className="text-slate-600 text-xs">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guided Companion Launcher */}
              {onOpenCompanion && (
                <div className="p-4 rounded-xl bg-[#F0FDFA] border border-[#14B8A6]/30 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-[#0F766E] text-xs">
                      {isHindi ? 'कदम-दर-कदम मार्गदर्शन चाहिए?' : 'Need Step-by-Step Live Assistance?'}
                    </h5>
                    <p className="text-slate-600 text-xs">
                      {isHindi ? 'गाइडेड कंपेनियन आपको फॉर्म भरने में मदद करेगा।' : 'Launch Guided Application Companion.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenCompanion(scheme)}
                    className="ys-btn-secondary text-xs py-1.5 px-3 shrink-0"
                  >
                    <span>{isHindi ? 'कंपेनियन शुरू करें ↗' : 'Launch Companion ↗'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: KEY TERMS & RBI RULES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Statutory Mandate Note */}
              <div className="p-4 rounded-xl bg-[#173B57] text-white space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#5EEAD4]" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#5EEAD4]">
                    {isHindi ? 'RBI वैधानिक नियम — संपार्श्विक सुरक्षा छूट' : 'Statutory Mandate — Collateral Exemption'}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {isHindi
                    ? 'आरबीआई सर्कुलर (RPCD.PLNFS.BC.No.39/06.02.31/2009-10) के अनुसार, ₹10 लाख तक के ऋणों के लिए बैंक किसी भी तृतीय पक्ष गारंटी (Third-party Guarantee) या संपार्श्विक सुरक्षा (Collateral) की मांग नहीं कर सकते।'
                    : 'Per RBI Master Circular, banks are mandated not to accept collateral or third-party guarantee for MSME loans up to ₹10 Lakh covered under CGTMSE / Govt schemes.'}
                </p>
              </div>

              {/* Anti-Corruption Notice */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 space-y-1 text-emerald-950 text-xs">
                <strong className="font-bold text-emerald-900 block">
                  {isHindi ? '100% निःशुल्क सरकारी योजना — दलाल मुक्त' : '100% Free Government Scheme — Zero Intermediaries'}
                </strong>
                <p className="text-slate-700">
                  {isHindi
                    ? 'सरकारी योजनाओं के लिए कोई भी दलाली या सेवा शुल्क देय नहीं है। यदि कोई अधिकारी रिश्वत मांगता है तो सीधे निगरानी पोर्टल पर रिपोर्ट करें।'
                    : 'No registration fee or agent commissions apply to government schemes. Submit directly through official portal.'}
                </p>
              </div>

              {/* Quick Leaflet Print */}
              {onOpenParchaa && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-700 font-medium">
                    {isHindi ? 'नागरिक योजना पर्चा (Official Citizen Leaflet) प्रिंट करें:' : 'Print 1-page Official Citizen Leaflet:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenParchaa(scheme, item)}
                    className="ys-btn-secondary text-xs py-1.5 px-3 shrink-0"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'पर्चा प्रिंट' : 'Print Leaflet'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="bg-[#F8FAFC] px-6 py-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {scheme.officialUrl && (
              <a
                href={scheme.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ys-btn-secondary text-xs py-2 px-3 min-h-[40px]"
              >
                <span>{isHindi ? 'आधिकारिक पोर्टल ↗' : 'Official Portal ↗'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {onOpenCalculator && (
              <button
                type="button"
                onClick={() => onOpenCalculator(scheme)}
                className="ys-btn-secondary text-xs py-2 px-3 min-h-[40px] hidden sm:flex"
              >
                <span>{isHindi ? 'कैलकुलेटर' : 'Calculator'}</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onApply(scheme);
            }}
            className="ys-btn-primary text-xs sm:text-sm py-2 px-5 min-h-[40px] shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('card_apply_guidance', isHindi ? 'मार्गदर्शन से आवेदन करें' : 'Apply with guidance')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
