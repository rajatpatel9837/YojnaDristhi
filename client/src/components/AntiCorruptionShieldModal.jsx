// client/src/components/AntiCorruptionShieldModal.jsx
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
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const complaintTemplate = 
`शिकायत: सरकारी योजना में अनधिकृत कमीशन/रिश्वत की मांग के संबंध में
दिनांक: ${new Date().toLocaleDateString('hi-IN')}
आवेदक का नाम: ${profile?.fullName || 'नागरिक'}
ज़िला: ${profile?.district || 'पटना'}, राज्य: ${profile?.state || 'बिहार'}
योजना: ${schemeName}

शिकायत विवरण:
उक्त योजनान्तर्गत आवेदन के संबंध में किसी अनाधिकृत व्यक्ति/बिचौलिये द्वारा लोन स्वीकृति के बदले अनुचित धनराशि/कमीशन की मांग की जा रही है।
कृपया भ्रष्टाचार निवारण अधिनियम (Prevention of Corruption Act) के अंतर्गत त्वरित जांच एवं विधिक कार्रवाई करने की कृपा करें।`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(complaintTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-950 p-5 sm:p-6 border-b border-amber-500/20 flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
              <span>भ्रष्टाचार एवं दलाल रोधी शील्ड • Anti-Corruption Shield</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>🛡️ 100% निःशुल्क सरकारी योजना — दलालों से सावधान!</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              भारत सरकार या राज्य सरकार की किसी भी योजना में आवेदन करने का कोई गुप्त शुल्क या कमीशन नहीं होता। रिश्वत मांगना व देना दोनों संज्ञेय अपराध हैं।
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
          
          {/* Zero-Fee Certificate Stamp */}
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wide flex items-center justify-center sm:justify-start gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>आधिकारिक भारत सरकार अधिदेश (Zero-Fee Rule)</span>
              </div>
              <div className="text-base sm:text-lg font-black text-white">
                योजना पोर्टल रजिस्ट्रेशन व बैंक फॉर्म पूर्णतः मुफ़्त है
              </div>
              <p className="text-[11px] text-slate-300">
                यदि कोई व्यक्ति या सीएससी ऑपरेटर सामान्य सरकारी फ़ीस (₹15-30) से अधिक कमीशन मांगता है, तो वह पूरी तरह अवैध है।
              </p>
            </div>

            <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono font-black text-sm text-center shrink-0">
              ₹0 शुल्क
            </div>
          </div>

          {/* 3 Red Flag Warnings */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>दलालों व धोखेबाज़ों की 3 प्रमुख पहचान (Beware of These Signs):</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-1.5">
                <div className="font-bold text-rose-400 flex items-center gap-1">
                  <UserX className="w-3.5 h-3.5" />
                  <span>5% - 10% कमीशन मांगना</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  "लोन पास कराने के लिए बैंक मैनेजर को हिस्सा देना पड़ेगा" — यह 100% झूठ और धोखाधड़ी है।
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-1.5">
                <div className="font-bold text-amber-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>निजी खाते में पैसे मंगाना</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  सरकारी सब्सिडी सीधे आपके बैंक खाते (DBT) में आती है, किसी भी बिचौलिये के खाते में नहीं।
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-1.5">
                <div className="font-bold text-sky-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>फर्जी मंज़ूरी पत्र (Fake Sanction)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  व्हाट्सएप पर आए किसी भी अनधिकृत लोन पत्र पर विश्वास न करें। हमेशा बैंक शाखा जाकर पुष्टि करें।
                </p>
              </div>
            </div>
          </div>

          {/* Official Vigilance & Anti-Corruption Hotlines */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              सीधी शिकायत हेतु आधिकारिक सरकारी सतर्कता नंबर (Toll-Free Vigilance Helplines):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">केंद्रीय सतर्कता आयोग (CVC)</div>
                  <div className="text-[11px] text-slate-400">भ्रष्टाचार विरोधी राष्ट्रीय हेल्पलाइन</div>
                </div>
                <a
                  href="tel:1964"
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-400/30 font-bold hover:bg-rose-500/30 transition flex items-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> 1964
                </a>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">CBI भ्रष्टाचार निरोधक ब्यूरो</div>
                  <div className="text-[11px] text-slate-400">बैंक अधिकारियों द्वारा रिश्वत मांग पर</div>
                </div>
                <a
                  href="tel:1800115555"
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold hover:bg-amber-500/30 transition flex items-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> 1800-11-5555
                </a>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">राज्य सतर्कता अन्वेषण ब्यूरो (ACB)</div>
                  <div className="text-[11px] text-slate-400">राज्य स्तर पर सरकारी दफ्तरों में रिश्वतखोरी पर</div>
                </div>
                <a
                  href="tel:1064"
                  className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-400/30 font-bold hover:bg-sky-500/30 transition flex items-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> 1064
                </a>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">MSME समाधान व लोकपाल</div>
                  <div className="text-[11px] text-slate-400">एमएसएमई उद्यमियों की सीधी सहायता</div>
                </div>
                <a
                  href="tel:14448"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold hover:bg-emerald-500/30 transition flex items-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> 14448
                </a>
              </div>
            </div>
          </div>

          {/* Quick Copy Complaint Template */}
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>तैयार शिकायत प्रारूप (Copyable Complaint Text):</span>
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-[11px] transition flex items-center gap-1 active:scale-95"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'कॉपी हो गया' : 'कॉपी करें'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono whitespace-pre-line select-text leading-relaxed">
              {complaintTemplate}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs transition active:scale-95"
          >
            सुरक्षित समझें • बंद करें
          </button>
        </div>

      </div>
    </div>
  );
}
