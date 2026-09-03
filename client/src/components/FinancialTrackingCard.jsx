import React from 'react';
import { DollarSign, CheckCircle2, Clock, ShieldCheck, Lock, Building, FileText, AlertTriangle } from 'lucide-react';

export default function FinancialTrackingCard({ financialStatus, requestedAmount }) {
  const fin = financialStatus || {};
  const sanction = fin.sanction || {};
  const release = fin.release || {};
  const payment = fin.payment || {};

  return (
    <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 sm:p-6 space-y-5 shadow-sm">
      
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F766E] flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-[#0F766E]" /> Financial Disbursal Separation
          </span>
          <h3 className="text-base font-extrabold text-[#173B57]">
            Sanction, Treasury Release & DBT Payment Status
          </h3>
        </div>

        <div className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold flex items-center gap-1.5 shrink-0 shadow-sm">
          <Lock className="w-3.5 h-3.5 text-amber-700" />
          <span>Demo Government Data / PFMS Sandbox</span>
        </div>
      </div>

      {/* 3-Column Financial Lifecycle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        
        {/* 1. Sanction Status */}
        <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">1. Sanction Status</span>
            {sanction.status === 'SANCTIONED' ? (
              <span className="px-2.5 py-0.5 rounded-full bg-[#CCFBF1] text-[#115E59] border border-[#14B8A6]/30 text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#0F766E]" /> SANCTIONED
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> NOT SANCTIONED
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-xl font-black text-[#173B57]">
              {sanction.status === 'SANCTIONED' ? `₹${(sanction.amount || 0).toLocaleString('en-IN')}` : '₹0 (Awaiting)'}
            </div>
            <p className="text-[11px] text-slate-500">Requested Amount: ₹{(requestedAmount || 50000).toLocaleString('en-IN')}</p>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Sanction Ref:</span>
              <strong className="text-[#0F766E] font-mono">{sanction.referenceId || 'Pending'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sanction Date:</span>
              <span className="text-[#173B57] font-medium">{sanction.date ? new Date(sanction.date).toLocaleDateString('en-IN') : 'Awaiting Order'}</span>
            </div>
          </div>
        </div>

        {/* 2. Release Status */}
        <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">2. Treasury Release</span>
            {release.status === 'RELEASED' ? (
              <span className="px-2.5 py-0.5 rounded-full bg-[#CCFBF1] text-[#115E59] border border-[#14B8A6]/30 text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#0F766E]" /> RELEASED
              </span>
            ) : release.status === 'RELEASE_PENDING' ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" /> RELEASE PENDING
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> NOT RELEASED
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-xl font-black text-[#173B57]">
              {release.status === 'RELEASED' ? `₹${(release.amount || 0).toLocaleString('en-IN')}` : '₹0'}
            </div>
            <p className="text-[11px] text-slate-500">Nodal Treasury Order Execution</p>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Release Date:</span>
              <span className="text-[#173B57] font-medium">{release.date ? new Date(release.date).toLocaleDateString('en-IN') : 'Pending Treasury'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Nodal Source:</span>
              <span className="text-[#0F766E] font-semibold">{fin.source || 'MOCK_GOVERNMENT'}</span>
            </div>
          </div>
        </div>

        {/* 3. Payment Status */}
        <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">3. DBT Payment / Credit</span>
            {payment.status === 'PAYMENT_SUCCESS' || payment.status === 'SUCCESS' ? (
              <span className="px-2.5 py-0.5 rounded-full bg-[#CCFBF1] text-[#115E59] border border-[#14B8A6]/30 text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#0F766E]" /> SETTLED
              </span>
            ) : payment.status === 'PAYMENT_PROCESSING' ? (
              <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[10px] font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-600" /> PROCESSING
              </span>
            ) : payment.status === 'PAYMENT_FAILED' ? (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" /> FAILED
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> PENDING
              </span>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-xl font-black text-[#173B57]">
              {(payment.status === 'PAYMENT_SUCCESS' || payment.status === 'SUCCESS') ? 'Settled to Beneficiary' : 'Awaiting Settlement'}
            </div>
            <p className="text-[11px] text-slate-500">Direct Benefit Transfer (DBT)</p>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Txn Reference:</span>
              <strong className="text-[#0F766E] font-mono">{payment.transactionReference || 'Awaiting DBT'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Credit Date:</span>
              <span className="text-[#173B57] font-medium">{payment.date ? new Date(payment.date).toLocaleDateString('en-IN') : 'Pending Credit'}</span>
            </div>
          </div>
        </div>

      </div>

      <div className="text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 border-t border-slate-200 gap-1">
        <span>Last Synchronized with PFMS Nodal Service: <strong className="text-[#173B57]">{new Date(fin.lastSyncedAt || Date.now()).toLocaleString('en-IN')}</strong></span>
        <span className="text-slate-400">Account identifiers masked for citizen privacy (TXN****)</span>
      </div>

    </div>
  );
}
