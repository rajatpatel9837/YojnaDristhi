import React from 'react';
import { X, Check, Minus, ExternalLink, ShieldCheck } from 'lucide-react';

export default function SchemeCompareModal({ isOpen, onClose, schemes }) {
  if (!isOpen || !schemes || schemes.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173B57]/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden text-[#173B57] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#0F766E]" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#173B57]">Compare Government Schemes</h2>
              <p className="text-xs text-slate-500">Side-by-side comparison of benefits, eligibility, and subsidy details</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-[#173B57] hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-x-auto p-6 text-xs">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 text-slate-500 font-bold w-1/4 uppercase tracking-wider text-[10px]">Feature / Metric</th>
                {schemes.map((s, idx) => (
                  <th key={idx} className="p-3 text-[#0F766E] font-black text-sm w-1/4">
                    {s.scheme ? s.scheme.name : s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-slate-600 font-medium">Provider / Ministry</td>
                {schemes.map((s, idx) => {
                  const item = s.scheme || s;
                  return <td key={idx} className="p-3 text-[#173B57] font-semibold">{item.provider}</td>;
                })}
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-slate-600 font-medium">Support Category</td>
                {schemes.map((s, idx) => {
                  const item = s.scheme || s;
                  return <td key={idx} className="p-3 text-[#173B57] font-bold">{item.category}</td>;
                })}
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-slate-600 font-medium">Maximum Financial Support</td>
                {schemes.map((s, idx) => {
                  const item = s.scheme || s;
                  return (
                    <td key={idx} className="p-3 text-[#0F766E] font-extrabold text-sm">
                      ₹{((item.maximumSupport || 0) / 100000).toFixed(1)} Lakh
                    </td>
                  );
                })}
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-slate-600 font-medium">Government Subsidy %</td>
                {schemes.map((s, idx) => {
                  const item = s.scheme || s;
                  return (
                    <td key={idx} className="p-3 text-[#0F766E] font-bold">
                      {item.subsidyPercentage ? `${item.subsidyPercentage}% Margin Subsidy` : 'Zero Direct Subsidy'}
                    </td>
                  );
                })}
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-slate-600 font-medium">Interest Rate</td>
                {schemes.map((s, idx) => {
                  const item = s.scheme || s;
                  return <td key={idx} className="p-3 text-slate-700">{item.interestRate || '8.5'}% p.a.</td>;
                })}
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-slate-600 font-medium">Moratorium Grace Period</td>
                {schemes.map((s, idx) => {
                  const item = s.scheme || s;
                  return <td key={idx} className="p-3 text-slate-700">{item.moratoriumPeriodMonths || 6} Months</td>;
                })}
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-slate-600 font-medium">Repayment Tenure</td>
                {schemes.map((s, idx) => {
                  const item = s.scheme || s;
                  return <td key={idx} className="p-3 text-slate-700">{item.repaymentPeriodYears || 5} Years</td>;
                })}
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-slate-600 font-medium">Estimated Match Score</td>
                {schemes.map((s, idx) => {
                  return (
                    <td key={idx} className="p-3 font-black text-[#0F766E] text-sm">
                      {s.matchScore ? `${s.matchScore}% Match` : 'N/A'}
                    </td>
                  );
                })}
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 text-slate-600 font-medium">Official Application</td>
                {schemes.map((s, idx) => {
                  const item = s.scheme || s;
                  return (
                    <td key={idx} className="p-3">
                      <a
                        href={item.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] bg-[#0F766E] hover:bg-[#115E59] text-white px-3 py-1.5 rounded-lg font-bold transition shadow-sm"
                      >
                        Official Source <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#173B57] font-bold text-xs transition"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
}
