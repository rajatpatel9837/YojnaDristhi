import React, { useState, useEffect } from 'react';
import { Calculator, X, HelpCircle, CheckCircle2, TrendingUp, Info } from 'lucide-react';

export default function FinancialCalculatorModal({ isOpen, onClose, scheme }) {
  const [loanAmount, setLoanAmount] = useState(scheme?.maximumSupport || 500000);
  const [interestRate, setInterestRate] = useState(scheme?.interestRate || 8.5);
  const [tenureYears, setTenureYears] = useState(scheme?.repaymentPeriodYears || 5);
  const [moratoriumMonths, setMoratoriumMonths] = useState(scheme?.moratoriumPeriodMonths || 6);
  const [subsidyPercent, setSubsidyPercent] = useState(scheme?.subsidyPercentage || 35);

  useEffect(() => {
    if (scheme) {
      setLoanAmount(scheme.maximumSupport || 500000);
      setInterestRate(scheme.interestRate ?? 8.5);
      setTenureYears(scheme.repaymentPeriodYears || 5);
      setMoratoriumMonths(scheme.moratoriumPeriodMonths || 6);
      setSubsidyPercent(scheme.subsidyPercentage ?? 0);
    }
  }, [scheme]);

  if (!isOpen) return null;

  // Calculation Math
  const subsidyAmount = (loanAmount * subsidyPercent) / 100;
  const netLoanPrincipal = Math.max(0, loanAmount - subsidyAmount);

  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  let monthlyEMI = 0;
  if (monthlyRate > 0 && totalMonths > 0) {
    monthlyEMI = Math.round(
      (netLoanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );
  } else {
    monthlyEMI = Math.round(netLoanPrincipal / totalMonths);
  }

  const totalRepayment = monthlyEMI * totalMonths;
  const totalInterest = Math.max(0, totalRepayment - netLoanPrincipal);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173B57]/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-[#173B57]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center">
              <Calculator className="w-5 h-5 text-[#0F766E]" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#173B57]">Scheme Financial Calculator</h2>
              <p className="text-xs text-slate-500">
                {scheme ? scheme.name : 'Estimate EMI, Moratorium & Subsidy Savings'}
              </p>
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

        {/* Calculator Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <label className="text-[#173B57]">Required Loan Amount</label>
                <span className="text-[#0F766E] font-extrabold">₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="50000"
                max="5000000"
                step="50000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-[#0F766E] bg-slate-200 rounded cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <label className="text-[#173B57]">Annual Interest Rate (%)</label>
                <span className="text-[#0F766E] font-extrabold">{interestRate}% p.a.</span>
              </div>
              <input
                type="range"
                min="4"
                max="14"
                step="0.25"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-[#0F766E] bg-slate-200 rounded cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <label className="text-[#173B57]">Repayment Tenure</label>
                <span className="text-[#0F766E] font-extrabold">{tenureYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-[#0F766E] bg-slate-200 rounded cursor-pointer h-2"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <label className="text-[#173B57]">Government Subsidy (%)</label>
                <span className="text-[#0F766E] font-extrabold">{subsidyPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                step="5"
                value={subsidyPercent}
                onChange={(e) => setSubsidyPercent(Number(e.target.value))}
                className="w-full accent-[#0F766E] bg-slate-200 rounded cursor-pointer h-2"
              />
            </div>

            <div className="p-3 bg-[#F0FDFA] rounded-xl border border-[#CCFBF1] text-xs text-[#134E4A] space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#0F766E]" />
                Moratorium Period: {moratoriumMonths} Months
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Deferred repayment period during business establishment where principal repayments may be paused according to official scheme guidelines.
              </p>
            </div>
          </div>

          {/* Results Card */}
          <div className="bg-[#F8FAFC] p-5 rounded-xl border border-[#E2E8F0] flex flex-col justify-between space-y-4 shadow-sm">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                Financial Summary & Estimated EMI
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#CCFBF1] text-center mb-4 shadow-sm">
                <div className="text-[10px] uppercase text-[#0F766E] font-bold tracking-wider">Estimated Monthly EMI</div>
                <div className="text-3xl font-black text-[#173B57] mt-1">₹{monthlyEMI.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-slate-500 mt-1">Payable for {totalMonths} months after moratorium</div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Total Project Cost</span>
                  <span className="font-bold text-[#173B57]">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200 text-[#0F766E]">
                  <span className="font-bold">Government Subsidy ({subsidyPercent}%)</span>
                  <span className="font-extrabold">- ₹{subsidyAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Net Principal Payable</span>
                  <span className="font-bold text-[#173B57]">₹{netLoanPrincipal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Total Interest Payable</span>
                  <span className="font-bold text-[#F59E0B]">₹{totalInterest.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-700">
                  <span className="font-bold text-[#173B57]">Total Amount Repaid</span>
                  <span className="font-black text-[#173B57]">₹{totalRepayment.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('yojnasetu_open_call_assistant'));
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold transition shadow-sm text-xs flex items-center justify-center gap-2 active:scale-95"
              >
                <span>📞 फ़ोन पर पर्चा मंगाएं (Call Report)</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#173B57] font-bold transition text-xs"
              >
                Done & Return to Matches
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
