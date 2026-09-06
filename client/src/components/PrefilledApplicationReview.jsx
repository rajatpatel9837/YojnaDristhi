import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Send, 
  X, 
  FileText, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Building2,
  User,
  BadgeCheck
} from 'lucide-react';

export default function PrefilledApplicationReview({
  isOpen,
  onClose,
  prefilledApplications = [],
  profile = {},
  onSubmitSuccess
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [formsData, setFormsData] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  useEffect(() => {
    if (prefilledApplications && prefilledApplications.length > 0) {
      const mapped = prefilledApplications.map(app => {
        const fieldMap = {};
        (app.fields || []).forEach(f => {
          fieldMap[f.formField] = f.value || '';
        });
        return {
          ...app,
          fieldValues: fieldMap
        };
      });
      setFormsData(mapped);
      setActiveTab(0);
      setSubmittedResult(null);
    }
  }, [prefilledApplications, isOpen]);

  if (!isOpen) return null;

  if (formsData.length === 0 && !submittedResult) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173B57]/70 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white rounded-2xl p-8 max-w-sm text-center space-y-3 shadow-2xl border border-[#E2E8F0]">
          <RefreshCw className="w-8 h-8 text-[#0F766E] animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#173B57]">Generating Pre-Filled Application Dossier...</p>
          <p className="text-[11px] text-slate-500">Resolving profile & DigiLocker e-KYC documents</p>
        </div>
      </div>
    );
  }

  const currentForm = formsData[activeTab] || formsData[0] || { fields: [], fieldValues: {} };

  const handleFieldChange = (formIdx, fieldName, newValue) => {
    const updated = [...formsData];
    updated[formIdx].fieldValues[fieldName] = newValue;
    setFormsData(updated);
  };

  const handleDownloadSummary = () => {
    const summaryText = formsData.map((form, i) => {
      const fieldsStr = Object.entries(form.fieldValues)
        .map(([k, v]) => `  • ${k}: ${v || '[MISSING - MUST COMPLETE]'}`)
        .join('\n');

      return `====================================================
YOJNASETU APPLICATION DOSSIER #${i + 1}
Scheme: ${form.schemeName}
Provider: ${form.provider}
Official Portal: ${form.officialUrl}
Generated: ${new Date().toLocaleString()}
----------------------------------------------------
APPLICANT & BUSINESS INFORMATION:
${fieldsStr}
====================================================\n`;
    }).join('\n\n');

    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `YojnaSetu_Prefilled_Dossier_${profile.fullName || 'Citizen'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = formsData.map(form => ({
        schemeId: form.schemeId,
        schemeName: form.schemeName,
        applicantName: form.fieldValues['Applicant Full Name'] || profile.fullName || 'Citizen',
        applicantState: form.fieldValues['State of Domicile'] || profile.state || 'Bihar',
        businessOrCourse: form.fieldValues['Business / Project Sector'] || profile.sector || 'Micro Enterprise',
        requestedAmount: Number(form.fieldValues['Total Estimated Project Cost / Funding Required (INR)'] || profile.fundingAmount || 500000),
        formData: form.fieldValues,
        matchScore: 95
      }));

      const res = await axios.post('/api/autofill/submit', {
        applications: payload,
        profile
      });

      if (res.data && res.data.success) {
        setSubmittedResult(res.data.data);
        if (onSubmitSuccess) {
          onSubmitSuccess(res.data.data);
        }
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to register applications in tracking system. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#173B57]/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#173B57]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#173B57]">
                  {submittedResult ? 'Application Submitted to YojnaSetu' : 'Review & Confirm Pre-filled Application Dossier'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#115E59] text-[10px] font-bold border border-[#14B8A6]/30">
                  {formsData.length} Scheme{formsData.length > 1 ? 's' : ''} Ready
                </span>
              </div>
              <p className="text-xs text-slate-500">Auto-filled from User Profile & DigiLocker e-KYC Sandbox</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#173B57] hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Submitted Success View */}
        {submittedResult ? (
          <div className="p-8 overflow-y-auto space-y-6 text-center text-xs">
            <div className="w-16 h-16 rounded-full bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-[#173B57]">
                {submittedResult.length} Application{submittedResult.length > 1 ? 's' : ''} Registered Successfully!
              </h4>
              <p className="text-slate-600 max-w-md mx-auto">
                Your application records have been created in YojnaSetu's <strong>8-Stage Tracking & Disbursal Lifecycle Engine</strong>.
              </p>
            </div>

            {/* Application Reference Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-left">
              {submittedResult.map((app, idx) => (
                <div key={idx} className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-[#0F766E] uppercase">Application Ref Number</div>
                  <div className="font-mono font-bold text-xs text-[#173B57]">{app.applicationNumber}</div>
                  <div className="text-[11px] font-medium text-slate-700 truncate">{app.schemeName}</div>
                  <div className="text-[10px] text-slate-500">Initial Stage: <strong>Application Submitted (15%)</strong></div>
                </div>
              ))}
            </div>

            {/* Next Steps Guidance */}
            <div className="p-4 bg-[#F0FDFA] border border-[#CCFBF1] rounded-xl max-w-2xl mx-auto text-left space-y-2 text-[#134E4A]">
              <div className="font-bold text-xs text-[#0F766E] flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4" /> Next Steps: Official Portal Submission
              </div>
              <p className="text-[11px] leading-relaxed">
                YojnaSetu stores your profile and dossier for 8-Stage tracking. Use the <strong>"Guide Me Through This" Co-Pilot</strong> to copy and paste your verified details directly into the official government portal without typing errors.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadSummary}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#173B57] font-bold text-xs border border-slate-300 transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download Dossier
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs shadow-sm transition"
              >
                Go to Tracking Dashboard →
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Multi-Scheme Tab Navigation */}
            {formsData.length > 1 && (
              <div className="flex items-center gap-2 p-3 bg-[#F8FAFC] border-b border-[#E2E8F0] overflow-x-auto text-xs">
                {formsData.map((form, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 shrink-0 ${
                      activeTab === idx
                        ? 'bg-[#0F766E] text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-[#CBD5E1] hover:bg-slate-50'
                    }`}
                  >
                    <span>{idx + 1}. {form.schemeName.length > 28 ? form.schemeName.substring(0, 28) + '...' : form.schemeName}</span>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded">
                      {form.completionPercentage || 90}%
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Scheme Details & Form Review */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              
              {/* Scheme Header Banner */}
              <div className="bg-[#F0FDFA] border border-[#CCFBF1] rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-[#0F766E]">Selected Scheme</div>
                  <h4 className="font-extrabold text-sm text-[#173B57]">{currentForm.schemeName}</h4>
                  <p className="text-[11px] text-slate-600">{currentForm.provider}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Form Readiness</div>
                    <div className="font-extrabold text-sm text-[#0F766E]">{currentForm.completionPercentage || 92}% Complete</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#CCFBF1] flex items-center justify-center text-[#0F766E] font-bold text-xs">
                    {currentForm.completionPercentage || 92}%
                  </div>
                </div>
              </div>

              {/* Editable Fields Grid */}
              <div className="space-y-3">
                <div className="font-bold text-xs text-[#173B57] flex items-center justify-between">
                  <span>Pre-Filled Application Form Fields:</span>
                  <span className="text-[10px] text-slate-500 font-normal">Review and edit any field before submitting</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {(currentForm.fields || []).map((field, fIdx) => {
                    const val = currentForm.fieldValues[field.formField] || '';
                    const isMissing = field.required && (!val || !String(val).trim());

                    return (
                      <div 
                        key={fIdx} 
                        className={`p-3 rounded-xl border transition ${
                          isMissing 
                            ? 'bg-amber-50/70 border-amber-300' 
                            : 'bg-white border-[#E2E8F0]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold text-[#173B57] flex items-center gap-1">
                            <span>{field.formField}</span>
                            {field.required && <span className="text-rose-600">*</span>}
                          </label>

                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-medium">
                            {field.sourceOrigin}
                          </span>
                        </div>

                        <input
                          type="text"
                          value={val}
                          onChange={(e) => handleFieldChange(activeTab, field.formField, e.target.value)}
                          placeholder={isMissing ? 'Required — please enter value' : ''}
                          className={`w-full px-3 py-1.5 text-xs font-semibold rounded-lg border text-[#173B57] focus:outline-none ${
                            isMissing 
                              ? 'border-amber-400 bg-white placeholder-amber-600' 
                              : 'border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white focus:border-[#0F766E]'
                          }`}
                        />

                        {isMissing && (
                          <div className="text-[10px] text-amber-700 flex items-center gap-1 mt-1 font-medium">
                            <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                            <span>This required field was not found in profile/DigiLocker. Please enter it.</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Honest Limitation Notice */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 leading-relaxed">
                <strong>Honest Architecture Disclaimer:</strong> Clicking "Confirm & Submit" creates an active tracking record inside YojnaSetu for 8-Stage tracking & PFMS simulation. To complete external government portal submission, open the official portal and paste your verified dossier.
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleDownloadSummary}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#173B57] font-bold text-xs border border-[#CBD5E1] transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Download Dossier (TXT)</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  disabled={submitting}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Registering Applications...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm & Register ({formsData.length})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

