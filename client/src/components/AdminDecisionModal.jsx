import React, { useState } from 'react';
import { X, ShieldCheck, Landmark, AlertTriangle, XCircle, FileText, CheckCircle2 } from 'lucide-react';

/**
 * Admin Decision Modal Component
 * Used by administrators to update verification status for Organizations or Opportunities with notes.
 */
export default function AdminDecisionModal({ isOpen, onClose, entity, entityType = 'ORGANIZATION', onSubmitDecision }) {
  const [selectedAction, setSelectedAction] = useState('');
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !entity) return null;

  const isOrg = entityType === 'ORGANIZATION';

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAction) {
      alert('Please select a verification decision action.');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmitDecision({
        entityId: entity._id,
        action: selectedAction,
        status: selectedAction,
        notes,
        rejectionReason
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173B57]/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#173B57]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <span className="text-[10px] font-bold text-[#0F766E] uppercase tracking-widest bg-[#CCFBF1] px-2 py-0.5 rounded border border-[#14B8A6]/30">
              Admin Verification Panel
            </span>
            <h2 className="text-base font-bold text-[#173B57] mt-1">
              Reviewing: {entity.legalName || entity.name || entity.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-[#173B57] hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-5 text-xs overflow-y-auto">
          
          {/* Current Status Banner */}
          <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Current Status:</span>
            <span className="font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {entity.verification?.status || 'PENDING'}
            </span>
          </div>

          {/* Action Decision Options */}
          <div className="space-y-2">
            <label className="font-bold text-[#173B57]">Select Verification Decision Action *</label>

            {isOrg ? (
              <div className="space-y-2">
                <label 
                  onClick={() => setSelectedAction('APPROVE_LEGAL_ENTITY')}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                    selectedAction === 'APPROVE_LEGAL_ENTITY' ? 'bg-[#F0FDFA] border-[#0F766E]' : 'bg-white border-[#E2E8F0] hover:border-[#0F766E]'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#0F766E]">Approve as VERIFIED LEGAL ENTITY</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Verifies legal incorporation (CIN / PAN / Registration). Does NOT grant government scheme status.</p>
                  </div>
                </label>

                <label 
                  onClick={() => setSelectedAction('APPROVE_GOVERNMENT_RECOGNIZED')}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                    selectedAction === 'APPROVE_GOVERNMENT_RECOGNIZED' ? 'bg-[#F0FDFA] border-[#0F766E]' : 'bg-white border-[#E2E8F0] hover:border-[#0F766E]'
                  }`}
                >
                  <Landmark className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#0F766E]">Approve as GOVERNMENT REGISTERED / RECOGNIZED</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Verifies official listing (NGO Darpan / CSR-1 / Government Empanelment).</p>
                  </div>
                </label>

                <label 
                  onClick={() => setSelectedAction('REQUEST_INFORMATION')}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                    selectedAction === 'REQUEST_INFORMATION' ? 'bg-amber-50 border-amber-400' : 'bg-white border-[#E2E8F0] hover:border-amber-400'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-800">Request More Information / Additional Documents</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Notifies organization to re-upload clear or missing documentation.</p>
                  </div>
                </label>

                <label 
                  onClick={() => setSelectedAction('REJECT')}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                    selectedAction === 'REJECT' ? 'bg-rose-50 border-rose-400' : 'bg-white border-[#E2E8F0] hover:border-rose-400'
                  }`}
                >
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-rose-800">Reject Verification Application</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Information could not be verified or documents are invalid.</p>
                  </div>
                </label>
              </div>
            ) : (
              /* OPPORTUNITY DECISION OPTIONS */
              <div className="space-y-2">
                <label 
                  onClick={() => setSelectedAction('OFFICIAL_GOVERNMENT_SCHEME')}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                    selectedAction === 'OFFICIAL_GOVERNMENT_SCHEME' ? 'bg-[#F0FDFA] border-[#0F766E]' : 'bg-white border-[#E2E8F0] hover:border-[#0F766E]'
                  }`}
                >
                  <Landmark className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#0F766E]">OFFICIAL GOVERNMENT SCHEME</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Assign ONLY when reliable official Government Gazette / Nodal Ministry evidence is confirmed.</p>
                  </div>
                </label>

                <label 
                  onClick={() => setSelectedAction('GOVERNMENT_PARTNERED_OPPORTUNITY')}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                    selectedAction === 'GOVERNMENT_PARTNERED_OPPORTUNITY' ? 'bg-[#F0FDFA] border-[#0F766E]' : 'bg-white border-[#E2E8F0] hover:border-[#0F766E]'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#0F766E]">GOVERNMENT-PARTNERED OPPORTUNITY</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Assign when verified MOU or official Government partnership evidence exists.</p>
                  </div>
                </label>

                <label 
                  onClick={() => setSelectedAction('VERIFIED_PRIVATE_OR_CSR_OPPORTUNITY')}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                    selectedAction === 'VERIFIED_PRIVATE_OR_CSR_OPPORTUNITY' ? 'bg-[#F0FDFA] border-[#0F766E]' : 'bg-white border-[#E2E8F0] hover:border-[#0F766E]'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#0F766E]">VERIFIED PRIVATE / CSR OPPORTUNITY</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Opportunity & provider verified, but explicitly NOT represented as a government scheme.</p>
                  </div>
                </label>

                <label 
                  onClick={() => setSelectedAction('REJECT')}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                    selectedAction === 'REJECT' ? 'bg-rose-50 border-rose-400' : 'bg-white border-[#E2E8F0] hover:border-rose-400'
                  }`}
                >
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-rose-800">Reject Opportunity Submission</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Does not meet verification guidelines or eligibility criteria.</p>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Admin Verification Notes */}
          <div>
            <label className="block text-[#173B57] font-bold mb-1">
              Official Review / Audit Notes (Recorded in Permanent Audit Trail)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verified MCA CIN and PAN via official registry. Assigned status."
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] h-20 focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          {/* Rejection Reason if Rejected */}
          {selectedAction === 'REJECT' && (
            <div>
              <label className="block text-rose-700 font-bold mb-1">
                Citizen-Facing Rejection / Clarification Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain clearly why this application is rejected or what documentation is missing..."
                className="w-full bg-white border border-rose-300 rounded-xl px-3 py-2 text-[#173B57] h-20 focus:outline-none focus:border-rose-500"
                required
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#173B57] font-bold hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold transition shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Applying Decision...' : 'Confirm Decision & Log Audit'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
