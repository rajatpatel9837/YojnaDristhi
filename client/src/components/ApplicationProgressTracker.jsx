import React, { useState } from 'react';
import axios from 'axios';
import { 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck, 
  Building, 
  DollarSign, 
  CreditCard,
  ArrowRight
} from 'lucide-react';
import FinancialTrackingCard from './FinancialTrackingCard';

export default function ApplicationProgressTracker({ application, onSyncComplete }) {
  const [app, setApp] = useState(application);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);

  const STAGES = [
    { key: 'SUBMITTED', name: 'Application Submitted', desc: 'Application received and registered on Yojna दृष्टि portal' },
    { key: 'DOCUMENT_VERIFICATION', name: 'Documents Verification', desc: 'Aadhaar, Income & Udyam certificates verified by Nodal Officer' },
    { key: 'ELIGIBILITY_VERIFICATION', name: 'Eligibility Verification', desc: 'Scheme criteria, margin money & subsidy eligibility validated' },
    { key: 'APPROVED', name: 'Officer Approval', desc: 'District Nodal Committee approval granted for sanction' },
    { key: 'SANCTIONED', name: 'Sanctioned', desc: 'Ministry / Nodal Bank sanction order issued' },
    { key: 'RELEASED', name: 'Fund Released', desc: 'Central Nodal Treasury release order executed' },
    { key: 'PAYMENT_SUCCESS', name: 'Payment/Credit', desc: 'Direct Benefit Transfer (DBT) credit settled to bank account' },
    { key: 'COMPLETED', name: 'Completed', desc: 'Full application lifecycle complete with asset verification' }
  ];

  const getCurrentStageIndex = (status) => {
    if (status === 'REJECTED') return -1;
    const idx = STAGES.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const currentIdx = getCurrentStageIndex(app.applicationStatus);
  const isRejected = app.applicationStatus === 'REJECTED';

  const handleSyncGovStatus = async () => {
    setSyncing(true);
    setSyncMessage(null);
    try {
      const res = await axios.post(`/api/integration/government/sync/${app._id || app.applicationNumber}`);
      if (res.data && res.data.success) {
        // Refetch updated app status
        const progressRes = await axios.get(`/api/applications/${app._id || app.applicationNumber}/progress`);
        const finRes = await axios.get(`/api/applications/${app._id || app.applicationNumber}/financial-status`);
        
        const updated = {
          ...app,
          applicationStatus: progressRes.data.data.currentStatus,
          currentStage: progressRes.data.data.currentStage,
          progressPercentage: progressRes.data.data.progressPercentage,
          timeline: progressRes.data.data.timeline,
          financialStatus: finRes.data.data.financialStatus
        };

        setApp(updated);
        setSyncMessage('✓ Synchronized with Government / PFMS Nodal Registry!');
        if (onSyncComplete) onSyncComplete(updated);
      }
    } catch (err) {
      console.error('Gov sync error:', err);
      setSyncMessage('⚠ Unable to connect to PFMS gateway. Displaying cached status.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#0F766E] font-bold uppercase text-[11px] tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
            End-to-End Application & Financial Disbursal Lifecycle
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-[#173B57]">
              Application ID: <span className="text-[#0F766E] font-mono">{app.applicationNumber}</span>
            </h2>
            <span className="px-3 py-1 rounded-full bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] text-xs font-bold">
              {app.schemeName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleSyncGovStatus}
            disabled={syncing}
            className="px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs shadow-sm transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing PFMS...' : 'Sync Government Status'}</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 font-medium ${
          syncMessage.startsWith('✓') 
            ? 'bg-[#F0FDFA] border-[#CCFBF1] text-[#115E59]' 
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Authoritative Current Status Bar */}
      <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider block">Current Lifecycle Stage</span>
          <div className="text-lg font-black text-[#173B57] flex items-center gap-2 mt-0.5">
            {isRejected ? (
              <span className="text-rose-600 font-bold">🔴 REJECTED</span>
            ) : (
              <span className="text-[#0F766E] flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-5 h-5 text-[#0F766E]" />
                {app.currentStage || app.applicationStatus}
              </span>
            )}
            <span className="text-xs font-semibold text-slate-500">({app.progressPercentage || 0}% Completed)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-72 space-y-1.5">
          <div className="h-2.5 rounded-full bg-slate-200 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${isRejected ? 'bg-rose-500' : 'bg-gradient-to-r from-[#0F766E] to-[#14B8A6]'}`}
              style={{ width: `${app.progressPercentage || 15}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 block text-right font-medium">
            Last Updated: {new Date(app.updatedAt || Date.now()).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* 8-Stage Progress Stepper */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#0F766E]" /> Official Milestone Lifecycle (8 Stages)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STAGES.map((stg, i) => {
            const isCompleted = i < currentIdx;
            const isCurrent = i === currentIdx;
            const isPending = i > currentIdx;

            return (
              <div 
                key={stg.key}
                className={`p-3.5 rounded-xl border transition ${
                  isCurrent
                    ? 'bg-white border-2 border-[#0F766E] shadow-sm ring-1 ring-[#CCFBF1]'
                    : isCompleted
                    ? 'bg-[#F0FDFA] border-[#CCFBF1]'
                    : 'bg-white border-[#E2E8F0] opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                    isCompleted ? 'bg-[#0F766E] text-white' : isCurrent ? 'bg-[#14B8A6] text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isCompleted ? '✓' : i + 1}
                  </span>
                  <span className={`text-[10px] font-bold uppercase ${
                    isCurrent ? 'text-[#0F766E]' : isCompleted ? 'text-[#0F766E]' : 'text-slate-400'
                  }`}>
                    {isCurrent ? 'In Progress' : isCompleted ? 'Passed' : 'Pending'}
                  </span>
                </div>

                <h4 className="font-bold text-[#173B57] text-xs leading-snug">{stg.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{stg.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Financial Tracking Card (Separation of Sanction vs Release vs Payment) */}
      <FinancialTrackingCard financialStatus={app.financialStatus} requestedAmount={app.requestedAmount} />

      {/* Timeline Audit Logs Drawer */}
      {app.timeline && app.timeline.length > 0 && (
        <details className="text-xs text-slate-600 cursor-pointer pt-2">
          <summary className="font-bold text-[#173B57] hover:text-[#0F766E] flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-[#E2E8F0]">
            <FileCheck className="w-4 h-4 text-[#0F766E]" /> View Detailed Stage Audit History ({app.timeline.length} Events)
          </summary>
          
          <div className="mt-3 space-y-2 pt-2">
            {app.timeline.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-[#173B57]">{item.stage}</strong>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {item.source}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{item.remarks}</p>
                </div>

                <div className="text-[11px] text-slate-500 shrink-0">
                  <span>{new Date(item.date).toLocaleDateString('en-IN')}</span> • <span className="font-medium text-[#173B57]">{item.updatedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

    </div>
  );
}
