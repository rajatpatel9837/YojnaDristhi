import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  PhoneCall, 
  ExternalLink, 
  FileText, 
  Check, 
  Copy, 
  Sparkles,
  Lock,
  UserX
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * "दलाल और रिश्वत रोधी शील्ड" (Anti-Middleman Corruption Shield Modal)
 * Protects grassroots citizens from predatory touts, illegal commissions,
 * and provides direct 1-tap vigilance hotlines (CVC, CBI, State ACB).
 */
export default function AntiCorruptionShieldModal({ 
  isOpen, 
  onClose, 
  schemeName = 'PMEGP / MUDRA Scheme', 
  profile 
}) {
  const { t, isHindi } = useLanguage();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const complaintTemplate = isHindi ? 
`शिकायत: सरकारी योजना में अनधिकृत कमीशन/रिश्वत की मांग के संबंध में
दिनांक: ${new Date().toLocaleDateString('hi-IN')}
आवेदक का नाम: ${profile?.fullName || 'नागरिक'}
ज़िला: ${profile?.district || 'पटना'}, राज्य: ${profile?.state || 'बिहार'}
योजना: ${schemeName}

शिकायत विवरण:
उक्त योजनान्तर्गत आवेदन के संबंध में किसी अनाधिकृत व्यक्ति/बिचौलिये द्वारा लोन स्वीकृति के बदले अनुचित धनराशि/कमीशन की मांग की जा रही है।
कृपया भ्रष्टाचार निवारण अधिनियम (Prevention of Corruption Act) के अंतर्गत त्वरित जांच एवं विधिक कार्रवाई करने की कृपा करें।` :
`Complaint: Unlawful Demand of Commission / Bribe under Government Scheme
Date: ${new Date().toLocaleDateString('en-IN')}
Applicant Name: ${profile?.fullName || 'Citizen'}
District: ${profile?.district || 'Patna'}, State: ${profile?.state || 'Bihar'}
Scheme: ${schemeName}

Complaint Details:
An unauthorized individual / agent is unlawfully demanding commission or monetary cut in exchange for sanctioning the credit application under the scheme.
Kindly initiate swift investigation and appropriate legal action under the Prevention of Corruption Act.`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(complaintTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="ys-modal-overlay animate-fadeIn">
      <div className="ys-modal-dialog max-w-3xl">
        
        {/* Header */}
        <div className="ys-modal-header">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold uppercase tracking-wider border border-[#F59E0B]/30">
              <ShieldAlert className="w-3.5 h-3.5 text-[#D97706]" />
              <span>{isHindi ? 'भ्रष्टाचार एवं दलाल रोधी शील्ड • Anti-Corruption Shield' : 'Anti-Corruption & Anti-Middleman Shield'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#173B57] flex items-center gap-2">
              <span>{isHindi ? '🛡️ 100% निःशुल्क सरकारी योजना — दलालों से सावधान!' : '🛡️ 100% Free Govt Schemes — Beware of Middlemen!'}</span>
            </h2>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              {isHindi
                ? 'भारत सरकार या राज्य सरकार की किसी भी योजना में आवेदन करने का कोई गुप्त शुल्क या कमीशन नहीं होता। रिश्वत मांगना व देना दोनों संज्ञेय अपराध हैं।'
                : 'There is zero hidden commission or fee to apply for central or state government schemes. Offering or demanding bribes is a cognizable offense.'}
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
          
          {/* Zero-Fee Certificate Stamp */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#F0FDFA] border border-[#14B8A6]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-bold text-[#0F766E] uppercase tracking-wide flex items-center justify-center sm:justify-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
                <span>{isHindi ? 'आधिकारिक भारत सरकार अधिदेश (Zero-Fee Rule)' : 'Official Government of India Mandate (Zero-Fee Rule)'}</span>
              </div>
              <div className="text-base sm:text-lg font-black text-[#173B57]">
                {isHindi ? 'योजना पोर्टल रजिस्ट्रेशन व बैंक फॉर्म पूर्णतः मुफ़्त है' : 'Scheme Portal Registration & Bank Forms are 100% Free'}
              </div>
              <p className="text-[11px] text-slate-600">
                {isHindi
                  ? 'यदि कोई व्यक्ति या सीएससी ऑपरेटर सामान्य सरकारी फ़ीस (₹15-30) से अधिक कमीशन मांगता है, तो वह पूरी तरह अवैध है।'
                  : 'If any individual or CSC operator demands commissions above nominal portal charges (₹15-30), it is completely illegal.'}
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-white border border-[#14B8A6]/40 text-[#0F766E] font-mono font-black text-sm text-center shrink-0 shadow-xs">
              {isHindi ? '₹0 शुल्क' : '₹0 Fee'}
            </div>
          </div>

          {/* 3 Red Flag Warnings */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#173B57] uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>{isHindi ? 'दलालों व धोखेबाज़ों की 3 प्रमुख पहचान (Beware of These Signs):' : '3 Warning Signs of Middlemen Fraud:'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-rose-200 space-y-1.5 shadow-2xs">
                <div className="font-bold text-rose-700 flex items-center gap-1 text-xs">
                  <UserX className="w-3.5 h-3.5 text-rose-600" />
                  <span>{isHindi ? '5% - 10% कमीशन मांगना' : 'Demanding 5% - 10% Cut'}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {isHindi
                    ? '"लोन पास कराने के लिए बैंक मैनेजर को हिस्सा देना पड़ेगा" — यह 100% झूठ और धोखाधड़ी है।'
                    : '"Must give cut to bank manager to get loan passed" — This is completely fraudulent.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1.5 shadow-2xs">
                <div className="font-bold text-amber-800 flex items-center gap-1 text-xs">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isHindi ? 'निजी खाते में पैसे मंगाना' : 'Demanding Personal Transfer'}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'सरकारी सब्सिडी सीधे आपके बैंक खाते (DBT) में आती है, किसी भी बिचौलिये के खाते में नहीं।'
                    : 'Government subsidies credit directly into your DBT account, never to any intermediary.'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-sky-200 space-y-1.5 shadow-2xs">
                <div className="font-bold text-sky-800 flex items-center gap-1 text-xs">
                  <ShieldAlert className="w-3.5 h-3.5 text-sky-600" />
                  <span>{isHindi ? 'फर्जी मंज़ूरी पत्र (Fake Sanction)' : 'Fake Sanction Letter'}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {isHindi
                    ? 'व्हाट्सएप पर आए किसी भी अनधिकृत लोन पत्र पर विश्वास न करें। हमेशा बैंक शाखा जाकर पुष्टि करें।'
                    : 'Never trust unauthorized sanction letters received on WhatsApp. Always verify directly at the branch.'}
                </p>
              </div>
            </div>
          </div>

          {/* Official Vigilance & Anti-Corruption Hotlines */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#173B57] uppercase tracking-wider">
              {isHindi ? 'सीधी शिकायत हेतु आधिकारिक सरकारी सतर्कता नंबर (Toll-Free Vigilance Helplines):' : 'Official Government Anti-Corruption Hotlines:'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#173B57] text-xs">{isHindi ? 'केंद्रीय सतर्कता आयोग (CVC)' : 'Central Vigilance Commission (CVC)'}</div>
                  <div className="text-[11px] text-slate-500">{isHindi ? 'भ्रष्टाचार विरोधी राष्ट्रीय हेल्पलाइन' : 'National Anti-Corruption Helpline'}</div>
                </div>
                <a
                  href="tel:1964"
                  className="px-3 py-1.5 rounded-lg bg-white text-rose-700 border border-rose-200 font-bold hover:bg-rose-50 transition flex items-center gap-1 text-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> 1964
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#173B57] text-xs">{isHindi ? 'CBI भ्रष्टाचार निरोधक ब्यूरो' : 'CBI Anti-Corruption Bureau'}</div>
                  <div className="text-[11px] text-slate-500">{isHindi ? 'बैंक अधिकारियों द्वारा रिश्वत मांग पर' : 'For bribes demanded by bank officers'}</div>
                </div>
                <a
                  href="tel:1800115555"
                  className="px-3 py-1.5 rounded-lg bg-white text-amber-800 border border-amber-200 font-bold hover:bg-amber-50 transition flex items-center gap-1 text-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> 1800-11-5555
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#173B57] text-xs">{isHindi ? 'राज्य सतर्कता अन्वेषण ब्यूरो (ACB)' : 'State Vigilance & ACB Bureau'}</div>
                  <div className="text-[11px] text-slate-500">{isHindi ? 'राज्य स्तर पर सरकारी दफ्तरों में रिश्वतखोरी पर' : 'For bribes in state government offices'}</div>
                </div>
                <a
                  href="tel:1064"
                  className="px-3 py-1.5 rounded-lg bg-white text-sky-800 border border-sky-200 font-bold hover:bg-sky-50 transition flex items-center gap-1 text-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> 1064
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#173B57] text-xs">{isHindi ? 'MSME समाधान व लोकपाल' : 'MSME Samadhaan & Ombudsman'}</div>
                  <div className="text-[11px] text-slate-500">{isHindi ? 'एमएसएमई उद्यमियों की सीधी सहायता' : 'Direct entrepreneur grievance assistance'}</div>
                </div>
                <a
                  href="tel:14448"
                  className="px-3 py-1.5 rounded-lg bg-white text-[#0F766E] border border-[#14B8A6]/40 font-bold hover:bg-[#F0FDFA] transition flex items-center gap-1 text-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> 14448
                </a>
              </div>
            </div>
          </div>

          {/* Quick Copy Complaint Template */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#173B57] text-xs flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#0F766E]" />
                <span>{isHindi ? 'तैयार शिकायत प्रारूप (Copyable Complaint Text):' : 'Copyable Complaint Template:'}</span>
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#173B57] border border-[#CBD5E1] font-bold text-xs transition flex items-center gap-1.5 shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#0F766E]" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? (isHindi ? 'कॉपी हो गया' : 'Copied!') : (isHindi ? 'कॉपी करें' : 'Copy Text')}</span>
              </button>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-[#CBD5E1] text-[11px] text-[#173B57] font-mono whitespace-pre-line select-text leading-relaxed">
              {complaintTemplate}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="ys-btn-secondary"
          >
            {isHindi ? 'सुरक्षित समझें • बंद करें' : 'Got It • Close'}
          </button>
        </div>

      </div>
    </div>
  );
}
