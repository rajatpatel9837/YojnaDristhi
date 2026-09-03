import React, { useRef } from 'react';
import { Landmark, FileText, AlertTriangle, CheckCircle2, UploadCloud, Info } from 'lucide-react';

/**
 * Government Relationship Claim Component
 * Triggered when an organization claims official government relationship / authorization.
 */
export default function GovernmentRelationshipForm({ formData, onChange, onUploadEvidence }) {
  const evidenceInputRef = useRef(null);
  const claimed = formData.claimed || false;

  const handleEvidenceClick = () => {
    if (evidenceInputRef.current) {
      evidenceInputRef.current.value = '';
      evidenceInputRef.current.click();
    }
  };

  const handleEvidenceChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUploadEvidence) {
      onUploadEvidence('GOVERNMENT_NOTIFICATION', 'Government Order / MOU Evidence', file);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hidden File Input */}
      <input
        type="file"
        ref={evidenceInputRef}
        onChange={handleEvidenceChange}
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
      />
      
      {/* Primary Opt-In Toggle */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#0F766E]" />
              <h3 className="text-sm font-bold text-[#173B57]">Government Relationship or Authorization Claim</h3>
            </div>
            <p className="text-xs text-slate-500">
              Does your organization claim to be an official government body, government scheme implementer, government-funded, or government-partnered entity?
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onChange({ claimed: false, relationshipType: 'NONE' })}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                !claimed 
                  ? 'bg-white text-[#173B57] border-[#CBD5E1] shadow-sm' 
                  : 'bg-slate-100 text-slate-500 border-transparent hover:text-[#173B57]'
              }`}
            >
              No Claimed Relationship
            </button>

            <button
              type="button"
              onClick={() => onChange({ claimed: true, relationshipType: formData.relationshipType === 'NONE' ? 'GOVERNMENT_PARTNER' : formData.relationshipType })}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
                claimed 
                  ? 'bg-[#0F766E] hover:bg-[#115E59] text-white border-[#0F766E] shadow-sm' 
                  : 'bg-white text-[#0F766E] border-[#CCFBF1] hover:bg-[#F0FDFA]'
              }`}
            >
              Yes, Claim Relationship
            </button>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Mandatory Evidence Requirement:</span> Claims of government relationship or authorization require documentary evidence (Government Order, MOU, Sanction Letter, Gazette Notification). Uploaded PDFs are reviewed by administrators before any official government badge is displayed.
          </div>
        </div>
      </div>

      {/* Extended Form Fields if Claimed */}
      {claimed && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-6 shadow-sm animate-fadeIn text-[#173B57]">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* Relationship Type */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#173B57]">Relationship Classification *</label>
              <select
                value={formData.relationshipType || 'GOVERNMENT_PARTNER'}
                onChange={(e) => onChange({ relationshipType: e.target.value })}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
              >
                <option value="OFFICIAL_GOVERNMENT_BODY">Official Government Ministry / Department / Agency</option>
                <option value="GOVERNMENT_SCHEME_IMPLEMENTER">Government Scheme Nodal Implementer</option>
                <option value="GOVERNMENT_PARTNER">Official Government Partner (MOU Signed)</option>
                <option value="GOVERNMENT_EMPANELLED">Empanelled Implementation Agency</option>
                <option value="GOVERNMENT_RECOGNIZED">Government Recognized Institution</option>
                <option value="GOVERNMENT_FUNDED">Government Funded Program / Incubator</option>
                <option value="OTHER_GOVERNMENT_RELATIONSHIP">Other Government Relationship</option>
              </select>
            </div>

            {/* Department / Ministry Name */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#173B57]">Nodal Ministry / Government Department *</label>
              <input
                type="text"
                placeholder="e.g. Ministry of MSME / Dept of Industries Bihar"
                value={formData.departmentName || ''}
                onChange={(e) => onChange({ departmentName: e.target.value })}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            {/* Reference Number / Sanction Order No */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#173B57]">Government Order / MOU / Reference Number</label>
              <input
                type="text"
                placeholder="e.g. GO/MSME/2025/1104 or MOU-8849"
                value={formData.referenceNumber || ''}
                onChange={(e) => onChange({ referenceNumber: e.target.value })}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            {/* Official Source URL */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#173B57]">Official Government Webpage / Gazette Reference URL</label>
              <input
                type="url"
                placeholder="https://msme.gov.in/official-order-doc"
                value={formData.sourceUrl || ''}
                onChange={(e) => onChange({ sourceUrl: e.target.value })}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

          </div>

          {/* Description of Claimed Relationship */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-[#173B57]">Description of Claimed Government Relationship & Scope *</label>
            <textarea
              rows={3}
              placeholder="Describe the exact nature of government partnership, scheme implementation scope, or departmental empanelment..."
              value={formData.relationshipDescription || ''}
              onChange={(e) => onChange({ relationshipDescription: e.target.value })}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          {/* Upload Evidence Slot */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="font-bold text-xs text-[#173B57] block">Upload Government Gazette / Order / MOU Proof (PDF) *</span>
              <span className="text-[11px] text-slate-500">Official evidence is required for government verification badge</span>
            </div>

            <button
              type="button"
              onClick={handleEvidenceClick}
              className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Proof PDF</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
