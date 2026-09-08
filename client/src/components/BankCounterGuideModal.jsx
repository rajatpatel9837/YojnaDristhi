// client/src/components/BankCounterGuideModal.jsx
import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  PhoneCall, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Scale, 
  Award,
  Sparkles,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import BANK_COUNTER_GUIDE_DATA from '../data/bankCounterGuideData.js';

/**
 * Bank Counter Defense Guide Modal
 * Equips citizens with counter-arguments, RBI circular citations,
 * and 1-tap dialable helplines.
 */
export default function BankCounterGuideModal({ isOpen, onClose }) {
  const [expandedExcuseId, setExpandedExcuseId] = useState('excuse_collateral');
  const [copiedScriptId, setCopiedScriptId] = useState(null);

  if (!isOpen) return null;

  const toggleExcuse = (id) => {
    setExpandedExcuseId(prev => (prev === id ? null : id));
  };

  const handleCopy = (id, text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedScriptId(id);
      setTimeout(() => setCopiedScriptId(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-[#173B57] to-[#0F766E] text-white p-5 sm:p-6 flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider border border-emerald-400/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>बैंक काउंटर रक्षा शील्ड (Citizen Legal Armor)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {BANK_COUNTER_GUIDE_DATA.title_hi}
            </h2>
            <p className="text-xs text-slate-200 leading-relaxed max-w-xl">
              {BANK_COUNTER_GUIDE_DATA.subtitle_hi}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 text-slate-800 text-xs">
          
          {/* Golden Rule Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-bold text-sm">
              ⚖️
            </div>
            <div>
              <span className="font-black text-xs uppercase tracking-wider text-amber-900 block mb-0.5">
                नागरिकों का स्वर्ण नियम (Citizen Golden Rule)
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                {BANK_COUNTER_GUIDE_DATA.goldenRule_hi}
              </p>
            </div>
          </div>

          {/* Bank Excuses Accordion List */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-[#173B57] text-sm uppercase tracking-wide flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#0F766E]" />
              <span>बैंक मैनेजर के 4 आम बहाने और आपका सटीक जवाब:</span>
            </h3>

            {BANK_COUNTER_GUIDE_DATA.excuses.map((item) => {
              const isExpanded = expandedExcuseId === item.id;
              const isCopied = copiedScriptId === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs transition hover:border-slate-300"
                >
                  {/* Accordion Header */}
                  <button
                    type="button"
                    onClick={() => toggleExcuse(item.id)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100 transition"
                  >
                    <span className="font-black text-[#173B57] text-xs sm:text-sm">
                      {item.excuse_hi}
                    </span>
                    <span className="p-1 rounded-lg text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 space-y-4 border-t border-slate-200 text-xs">
                      
                      {/* Reason Analysis */}
                      <div className="text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        <strong className="text-slate-700 font-bold not-italic">अंदर की बात:</strong> {item.reason_analysis_hi}
                      </div>

                      {/* Exact Spoken Counter Script */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-black uppercase tracking-wider text-emerald-800 text-[11px] flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span>मैनेजर को यह सटीक जवाब दें (बोलें या दिखाएं):</span>
                          </span>
                          
                          <button
                            type="button"
                            onClick={() => handleCopy(item.id, item.counterScript_hi)}
                            className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 transition"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>कॉपी हो गया!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>स्क्रिप्ट कॉपी करें</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-400/60 text-emerald-950 font-medium text-xs sm:text-sm leading-relaxed">
                          "{item.counterScript_hi}"
                        </div>
                      </div>

                      {/* RBI Regulatory Citation */}
                      <div className="p-3 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-emerald-400 uppercase font-extrabold tracking-wider block">
                            वैधानिक नियम एवं सर्कुलर (Govt & RBI Mandate)
                          </span>
                          <span className="text-xs font-bold text-slate-100 block">
                            {item.rbiCircularTitle}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono text-[11px] border border-emerald-400/30">
                          {item.rbiCircularCode}
                        </span>
                      </div>

                      {/* Action Tips */}
                      {item.actionTips_hi && (
                        <div className="space-y-1">
                          <span className="font-bold text-slate-700 text-[11px]">ज़रूरी सलाह:</span>
                          <ul className="list-disc pl-4 space-y-1 text-slate-600">
                            {item.actionTips_hi.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Official Grievance Helplines */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h3 className="font-extrabold text-[#173B57] text-sm uppercase tracking-wide flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-[#0F766E]" />
              <span>आधिकारिक शिकायत हेल्पलाइन एवं पोर्टल (Official Grievance Channels):</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BANK_COUNTER_GUIDE_DATA.grievanceHelplines.map((hl, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#173B57] text-xs">{hl.agency}</span>
                    <span className="text-[10px] font-bold text-[#0F766E] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {hl.type}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug">
                    {hl.desc_hi}
                  </p>

                  <div className="pt-1 flex items-center gap-2">
                    {hl.phone && (
                      <a
                        href={`tel:${hl.phone}`}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{hl.phone}</span>
                      </a>
                    )}

                    {hl.portalUrl && (
                      <a
                        href={hl.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[#173B57] font-bold text-xs border border-slate-300 flex items-center gap-1.5 transition shadow-xs"
                      >
                        <span>पोर्टल खोलें</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#173B57] hover:bg-[#0F766E] text-white font-bold text-xs transition shadow-sm"
          >
            समझ गया, बंद करें
          </button>
        </div>

      </div>
    </div>
  );
}
