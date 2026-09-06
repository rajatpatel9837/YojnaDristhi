import React, { useState } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Clock, 
  AlertCircle,
  Sparkles,
  RefreshCw
} from 'lucide-react';

export default function DigilockerConsentModal({ 
  isOpen, 
  onClose, 
  onConsentSuccess, 
  profile,
  schemeNames = []
}) {
  const [loading, setLoading] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([
    'Aadhaar Card',
    'Annual Income Certificate',
    'Community / Social Category Certificate',
    'Udyam Registration Certificate'
  ]);

  if (!isOpen) return null;

  const docList = [
    {
      id: 'Aadhaar Card',
      title: 'Aadhaar Identity Proof',
      issuer: 'UIDAI (Government of India)',
      purpose: 'Name, Gender, DOB & Domicile Address auto-fill',
      mandatory: true
    },
    {
      id: 'Annual Income Certificate',
      title: 'Annual Income Certificate',
      issuer: 'State Revenue Department / Tehsildar',
      purpose: 'Max family income limit verification & subsidy tier',
      mandatory: true
    },
    {
      id: 'Community / Social Category Certificate',
      title: 'Community / Caste Certificate',
      issuer: 'Department of Social Welfare',
      purpose: 'SC / ST / OBC / EWS special category subsidy reservation',
      mandatory: false
    },
    {
      id: 'Udyam Registration Certificate',
      title: 'Udyam MSME Certificate',
      issuer: 'Ministry of MSME',
      purpose: 'Enterprise name, activity code & business age',
      mandatory: false
    }
  ];

  const toggleDoc = (id) => {
    if (selectedDocs.includes(id)) {
      setSelectedDocs(selectedDocs.filter(d => d !== id));
    } else {
      setSelectedDocs([...selectedDocs, id]);
    }
  };

  const handleGrantConsent = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/autofill/consent', {
        requestedDocTypes: selectedDocs,
        profileHint: profile || {}
      });

      if (res.data && res.data.success && res.data.data) {
        if (onConsentSuccess) {
          onConsentSuccess(res.data.data.sessionId, res.data.data.documents);
        }
      }
    } catch (err) {
      console.warn('Consent request error, using client fallback session:', err.message);
      if (onConsentSuccess) {
        onConsentSuccess('dgl_local_fallback_session', {});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173B57]/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#173B57]">
        
        {/* Modal Header */}
        <div className="p-5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#173B57]">DigiLocker Consent & Auto-Fill</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#115E59] text-[10px] font-bold border border-[#14B8A6]/30">
                  Sandbox Simulation
                </span>
              </div>
              <p className="text-xs text-slate-500">Fast 1-Click Verification for Government Scheme Dossiers</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#173B57] hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Target Schemes Context */}
          {schemeNames.length > 0 && (
            <div className="p-3 bg-[#F0FDFA] rounded-xl border border-[#CCFBF1] space-y-1">
              <div className="text-[11px] font-bold text-[#0F766E]">Applying For:</div>
              <div className="text-xs font-bold text-[#173B57] flex flex-wrap gap-1.5">
                {schemeNames.map((s, idx) => (
                  <span key={idx} className="bg-white px-2 py-0.5 rounded-md border border-[#CCFBF1] text-[#173B57]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Privacy & Storage Limitation Notice (DPDP Act) */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5 text-amber-900">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-[11px] text-amber-900">DPDP Act Storage Limitation Guarantee</div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Raw DigiLocker documents are loaded into a temporary <strong>45-minute server session</strong> solely to pre-fill your application. No raw documents are permanently saved to our database.
              </p>
            </div>
          </div>

          {/* Document Checklist Selection */}
          <div className="space-y-2">
            <div className="font-bold text-xs text-[#173B57] flex items-center justify-between">
              <span>Select Documents to Consent & Import:</span>
              <span className="text-[10px] text-slate-500 font-normal">All verified via e-District / UIDAI</span>
            </div>

            <div className="space-y-2">
              {docList.map((doc) => {
                const isSelected = selectedDocs.includes(doc.id);
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleDoc(doc.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected 
                        ? 'bg-white border-[#0F766E] shadow-sm' 
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center text-white ${
                        isSelected ? 'bg-[#0F766E]' : 'border border-slate-400 bg-white'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="font-bold text-xs text-[#173B57]">{doc.title}</div>
                        <div className="text-[10px] text-slate-500">{doc.issuer} • <span className="text-[#0F766E]">{doc.purpose}</span></div>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium shrink-0">
                      e-KYC
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition"
          >
            Deny / Cancel
          </button>

          <button
            type="button"
            onClick={handleGrantConsent}
            disabled={loading || selectedDocs.length === 0}
            className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs shadow-sm transition flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Connecting to DigiLocker Sandbox...</span>
              </>
            ) : (
              <>
                <span>Allow Access & Pre-fill ({selectedDocs.length})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

