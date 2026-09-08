// client/src/components/MissingDocumentResolverModal.jsx
import React from 'react';
import { 
  X, 
  ExternalLink, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  Coins, 
  CheckCircle2, 
  FileText, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import DOCUMENT_GUIDE_DATA from '../data/documentGuideData.js';

/**
 * Step-by-step resolution modal for missing government documents.
 * Provides official state portal links, government fees, timelines,
 * and warnings against private touts.
 */
export default function MissingDocumentResolverModal({
  isOpen,
  onClose,
  documentId,
  userState = 'Bihar',
  onViewCSCMap
}) {
  const { isHindi } = useLanguage();

  if (!isOpen || !documentId) return null;

  const doc = DOCUMENT_GUIDE_DATA[documentId] || {
    label_hi: documentId,
    label_en: documentId,
    govtFee: '₹15 - ₹50',
    govtFee_en: '₹15 - ₹50',
    timeline: '7 - 10 कार्य दिवस',
    timeline_en: '7 - 10 Working Days',
    description_hi: 'यह दस्तावेज़ सरकारी योजना में सत्यापन के लिए अनिवार्य है।',
    description_en: 'This document is mandatory for verification under government schemes.',
    requiredDocs_hi: ['आधार कार्ड', 'निवास प्रमाण पत्र', 'फोटो'],
    requiredDocs_en: ['Aadhaar Card', 'Residence Proof', 'Photograph'],
    statePortals: [
      { state: 'All India', portalName: 'Digital Seva CSC Portal', url: 'https://digitalseva.csc.gov.in' }
    ],
    toutWarning_hi: '⚠️ किसी अनाधिकृत दलाल को पैसे न दें। केवल सरकारी सीएससी केंद्र या ई-डिस्ट्रिक्ट पोर्टल से बनवाएं।',
    toutWarning_en: '⚠️ Never pay unauthorized touts or brokers. Apply solely through government CSC centers or e-District portals.'
  };

  const docLabel = isHindi ? doc.label_hi : (doc.label_en || doc.label_hi || documentId);
  const docFee = isHindi ? doc.govtFee : (doc.govtFee_en || doc.govtFee);
  const docTimeline = isHindi ? doc.timeline : (doc.timeline_en || doc.timeline);
  const docValidity = isHindi ? (doc.validity || 'आजीवन') : (doc.validity_en || doc.validity || 'Lifetime');
  const docDesc = isHindi ? doc.description_hi : (doc.description_en || doc.description_hi);
  const docWarning = isHindi ? doc.toutWarning_hi : (doc.toutWarning_en || doc.toutWarning_hi);
  const docRequired = isHindi ? (doc.requiredDocs_hi || []) : (doc.requiredDocs_en || doc.requiredDocs_hi || []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white p-5 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-200 text-[10px] font-extrabold uppercase tracking-wider border border-amber-400/30">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{isHindi ? 'कागज़ नहीं है? ऐसे बनवाएं (Gap Solver)' : 'Missing Document? Resolve Here (Gap Solver)'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{doc.icon || '📄'}</span>
              <span>{docLabel}</span>
            </h2>
            <p className="text-xs text-amber-100/90 font-medium">
              {isHindi ? 'आधिकारिक सरकारी प्रक्रिया, न्यूनतम फीस और डायरेक्ट पोर्टल लिंक' : 'Official government procedure, minimal statutory fees, and direct portal links'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-amber-200 hover:text-white hover:bg-amber-800/80 transition"
            title={isHindi ? 'बंद करें' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-800 text-xs">
          
          {/* Quick Stats: Fee & Timeline */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px] mb-1">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span>{isHindi ? 'सरकारी फीस (Govt Fee)' : 'Govt Fee'}</span>
              </div>
              <div className="text-base sm:text-lg font-black text-emerald-900">
                {docFee}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200">
              <div className="flex items-center gap-1.5 text-sky-700 font-bold text-[11px] mb-1">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>{isHindi ? 'बनने का समय (Timeline)' : 'Timeline'}</span>
              </div>
              <div className="text-base sm:text-lg font-black text-sky-900">
                {docTimeline}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-purple-700 font-bold text-[11px] mb-1">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>{isHindi ? 'मान्यता (Validity)' : 'Validity'}</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-purple-900">
                {docValidity}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed text-xs sm:text-sm">
            {docDesc}
          </div>

          {/* Tout Warning Banner */}
          {docWarning && (
            <div className="p-3.5 rounded-xl bg-rose-50 border-2 border-rose-200 text-rose-900 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <strong className="font-extrabold text-rose-800 uppercase block tracking-wider text-[10px]">
                  {isHindi ? 'सावधानी व सतर्कता (Anti-Fraud Advisory)' : 'Anti-Fraud Advisory & Warning'}
                </strong>
                <p className="leading-relaxed">{docWarning}</p>
              </div>
            </div>
          )}

          {/* Required Documents */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-[#173B57] text-xs uppercase tracking-wide flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{isHindi ? 'आवेदन के लिए क्या-क्या साथ ले जाएं:' : 'Required Documents Checklist to Carry:'}</span>
            </h4>
            <ul className="grid grid-cols-1 gap-2">
              {docRequired.map((req, i) => (
                <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct State Portals */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-[#173B57] text-xs uppercase tracking-wide flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{isHindi ? 'आधिकारिक सरकारी ई-डिस्ट्रिक्ट पोर्टल लिंक्स (Direct Online Apply):' : 'Official Government e-District & RTPS Direct Portal Links:'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {doc.statePortals.map((portal, idx) => (
                <a
                  key={idx}
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 hover:border-[#0F766E] transition flex items-center justify-between gap-2 shadow-xs group"
                >
                  <div>
                    <span className="font-bold text-[#173B57] block group-hover:text-[#0F766E]">
                      {portal.state}
                    </span>
                    <span className="text-[11px] text-slate-500">{portal.portalName}</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#0F766E] shrink-0" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onViewCSCMap) onViewCSCMap();
            }}
            className="px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold transition flex items-center gap-2 shadow-sm"
          >
            <MapPin className="w-4 h-4" />
            <span>{isHindi ? '🗺️ नज़दीकी सीएससी / बैंक शाखा देखें' : '🗺️ Locate Nearby CSC / Bank Branch'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 transition"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
}

