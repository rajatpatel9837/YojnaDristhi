import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  Coins, 
  TrendingUp, 
  Coffee, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  IndianRupee
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * "रोज़ाना मुनाफ़ा vs क़िस्त" (Fear-Free Daily Cashflow Simulator)
 * Eliminates fear of bank debt by breaking down intimidating lump-sum EMIs
 * into relatable daily micro-units (e.g. "सिर्फ ₹135 प्रतिदिन के मुनाफ़े से भरें पूरी क़िस्त").
 */
export default function DailyCashflowSimulatorModal({ 
  isOpen, 
  onClose, 
  scheme, 
  profile 
}) {
  const { t, isHindi } = useLanguage();
  const defaultLoan = scheme?.maximumSupport ? Math.min(scheme.maximumSupport, 500000) : 500000;
  const defaultSubsidy = scheme?.subsidyPercentage || 35;
  const defaultInterest = parseFloat(scheme?.interestRate) || 8.5;

  const [loanAmount, setLoanAmount] = useState(defaultLoan);
  const [subsidyPct, setSubsidyPct] = useState(defaultSubsidy);
  const [tenureYears, setTenureYears] = useState(5);
  const [estimatedDailyProfit, setEstimatedDailyProfit] = useState(800);

  if (!isOpen) return null;

  const tenureMonths = tenureYears * 12;

  // 1. Govt Subsidized Loan Math
  const subsidyAmount = Math.round((loanAmount * subsidyPct) / 100);
  const effectivePrincipal = Math.max(loanAmount - subsidyAmount, 10000);
  const monthlyRateGovt = (defaultInterest / 100) / 12;
  const monthlyEmiGovt = Math.round(
    (effectivePrincipal * monthlyRateGovt * Math.pow(1 + monthlyRateGovt, tenureMonths)) /
    (Math.pow(1 + monthlyRateGovt, tenureMonths) - 1)
  );
  const dailyEmiGovt = Math.round(monthlyEmiGovt / 30);

  // 2. Private High-Interest Moneylender Comparison (18% interest, 0% subsidy)
  const privateRate = (18 / 100) / 12;
  const monthlyEmiPrivate = Math.round(
    (loanAmount * privateRate * Math.pow(1 + privateRate, tenureMonths)) /
    (Math.pow(1 + privateRate, tenureMonths) - 1)
  );
  const dailyEmiPrivate = Math.round(monthlyEmiPrivate / 30);

  // 3. Lifetime 5-Year Savings
  const totalPaidGovt = monthlyEmiGovt * tenureMonths;
  const totalPaidPrivate = monthlyEmiPrivate * tenureMonths;
  const netFiveYearSavings = Math.max(totalPaidPrivate - totalPaidGovt, 0);

  // 4. Daily Profit Margin Coverage
  const profitRemainingAfterEmi = Math.max(estimatedDailyProfit - dailyEmiGovt, 0);
  const emiShareOfDailyProfit = Math.min(Math.round((dailyEmiGovt / estimatedDailyProfit) * 100), 100);

  return (
    <div className="ys-modal-overlay animate-fadeIn">
      <div className="ys-modal-dialog max-w-3xl">
        
        {/* Header Bar */}
        <div className="ys-modal-header">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E] text-xs font-bold uppercase tracking-wider border border-[#14B8A6]/30">
              <Calculator className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{isHindi ? 'रोज़ाना मुनाफ़ा vs क़िस्त सिम्युलेटर' : 'Daily Profit vs EMI Simulator'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#173B57] flex items-center gap-2">
              <span>{isHindi ? '📊 क़िस्त का डर दूर करें — दैनिक कमाई से हिसाब' : '📊 Overcome Debt Fear — Daily Micro-Repayment Math'}</span>
            </h2>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              {isHindi
                ? 'बैंक की भारी-भरकम किस्तों के डर से न रुकें। जानिए कि आपकी रोज़ की 2-3 कप चाय या थोड़े से मुनाफ़े से यह लोन कैसे चुकता होगा।'
                : 'Do not fear lump-sum bank installments. See how just 2-3 cups of tea or a fraction of daily earnings covers your loan.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-[#173B57] hover:bg-slate-100 transition shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-[#173B57]">
          
          {/* Big Hero Stat: Daily Burden & Tea Cup Analogy */}
          <div className="bg-[#F0FDFA] p-5 rounded-2xl border border-[#14B8A6]/30 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
            <div className="space-y-1.5">
              <div className="text-[11px] text-[#0F766E] font-bold uppercase tracking-wide flex items-center justify-center sm:justify-start gap-1.5">
                <Coffee className="w-4 h-4 text-amber-600" />
                <span>{isHindi ? 'दैनिक आसान बोझ (Daily Repayment Burden)' : 'Daily Repayment Burden'}</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#173B57] flex items-center justify-center sm:justify-start gap-1">
                <span className="text-sm text-slate-500 font-bold">{isHindi ? 'सिर्फ' : 'Only'}</span>
                <span className="text-[#0F766E]">₹{dailyEmiGovt}</span>
                <span className="text-sm text-slate-500 font-bold">{isHindi ? '/प्रति दिन' : '/day'}</span>
              </div>
              <p className="text-xs text-slate-600">
                {isHindi ? 'मासिक क़िस्त:' : 'Monthly EMI:'} <span className="font-bold text-[#173B57]">₹{monthlyEmiGovt.toLocaleString('en-IN')}/{isHindi ? 'माह' : 'mo'}</span> • {isHindi ? 'सरकारी छूट (सब्सिडी):' : 'Govt Subsidy:'} <span className="font-bold text-[#0F766E]">₹{subsidyAmount.toLocaleString('en-IN')}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] text-center shrink-0 space-y-1 shadow-2xs">
              <div className="text-2xl">☕ ☕ ☕</div>
              <div className="text-[11px] font-bold text-amber-800">
                {isHindi ? 'रोज़ की मात्र 2-3 कप चाय के बराबर!' : 'Equivalent to 2-3 cups of tea daily!'}
              </div>
              <div className="text-[10px] text-slate-500">
                {isHindi ? 'किसी भी छोटे काम से आसानी से चुकता' : 'Easily manageable from basic business cashflow'}
              </div>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            {/* Slider 1: Loan Amount */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#173B57] font-bold">{isHindi ? 'ऋण राशि (Loan Amount):' : 'Loan Amount:'}</span>
                <span className="font-bold text-[#0F766E] font-mono">₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={50000}
                max={2500000}
                step={25000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F766E]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>{isHindi ? '₹50 हज़ार' : '₹50k'}</span>
                <span>{isHindi ? '₹10 लाख' : '₹10L'}</span>
                <span>{isHindi ? '₹25 लाख' : '₹25L'}</span>
              </div>
            </div>

            {/* Slider 2: Daily Expected Profit */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#173B57] font-bold">{isHindi ? 'आपकी रोज़ाना अपेक्षित कमाई (Daily Profit):' : 'Expected Daily Profit:'}</span>
                <span className="font-bold text-[#0369A1] font-mono">₹{estimatedDailyProfit}/{isHindi ? 'दिन' : 'day'}</span>
              </div>
              <input
                type="range"
                min={300}
                max={5000}
                step={50}
                value={estimatedDailyProfit}
                onChange={(e) => setEstimatedDailyProfit(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0284C7]"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹300/{isHindi ? 'दिन' : 'day'}</span>
                <span>₹2,000/{isHindi ? 'दिन' : 'day'}</span>
                <span>₹5,000/{isHindi ? 'दिन' : 'day'}</span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison: Govt Subsidized vs Private Moneylender */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#173B57] uppercase tracking-wider">
              {isHindi ? 'सरकारी योजना बनाम साहूकार/प्राइवेट लोन का अंतर:' : 'Govt Scheme vs Private Moneylender Comparison:'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Govt Card */}
              <div className="p-4 rounded-xl bg-[#F0FDFA] border border-[#14B8A6]/40 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#CCFBF1] text-[#0F766E] text-[10px] font-bold uppercase">
                    {isHindi ? '🟢 सरकारी सब्सिडी लोन' : '🟢 Govt Subsidized Loan'}
                  </span>
                  <span className="text-xs font-bold text-[#0F766E]">{defaultInterest}% {isHindi ? 'ब्याज' : 'Interest'}</span>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">{isHindi ? 'प्रतिदिन की क़िस्त' : 'Daily Installment'}</div>
                  <div className="text-2xl font-black text-[#0F766E]">₹{dailyEmiGovt} <span className="text-xs text-slate-500 font-normal">/{isHindi ? 'दिन' : 'day'}</span></div>
                </div>
                <div className="space-y-1 pt-2 border-t border-[#CCFBF1] text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>{isHindi ? 'मासिक क़िस्त:' : 'Monthly EMI:'}</span>
                    <span className="font-bold text-[#173B57]">₹{monthlyEmiGovt.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isHindi ? 'सरकारी सब्सिडी (छूट):' : 'Govt Subsidy:'}</span>
                    <span className="font-bold text-[#0F766E]">₹{subsidyAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Private Moneylender Card */}
              <div className="p-4 rounded-xl bg-[#FFF1F2] border border-rose-200 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase">
                    {isHindi ? '🔴 प्राइवेट साहूकार / माइक्रोफाइनेंस' : '🔴 Private Moneylender / MFI'}
                  </span>
                  <span className="text-xs font-bold text-rose-700">18%+ {isHindi ? 'ब्याज' : 'Interest'}</span>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">{isHindi ? 'प्रतिदिन की क़िस्त' : 'Daily Installment'}</div>
                  <div className="text-2xl font-black text-rose-700">₹{dailyEmiPrivate} <span className="text-xs text-slate-500 font-normal">/{isHindi ? 'दिन' : 'day'}</span></div>
                </div>
                <div className="space-y-1 pt-2 border-t border-rose-200 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <span>{isHindi ? 'मासिक क़िस्त:' : 'Monthly EMI:'}</span>
                    <span className="font-bold text-[#173B57]">₹{monthlyEmiPrivate.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isHindi ? 'सब्सिडी छूट:' : 'Subsidy Discount:'}</span>
                    <span className="font-bold text-rose-700">₹0 {isHindi ? '(शून्य)' : '(Zero)'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Year Total Lifetime Savings Highlight */}
          <div className="p-4 rounded-xl bg-[#FEF3C7] border border-[#F59E0B]/30 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-[#92400E] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D97706]" />
                <span>{isHindi ? 'सरकारी योजना चुनने पर आपकी 5 वर्ष की कुल बचत:' : 'Total 5-Year Lifetime Savings with Govt Scheme:'}</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#173B57]">
                ₹{netFiveYearSavings.toLocaleString('en-IN')} {isHindi ? 'शुद्ध बचत!' : 'Net Savings!'}
              </div>
            </div>
            <div className="text-right text-[11px] text-[#0F766E] font-bold hidden sm:block">
              {isHindi ? 'ब्याज व सब्सिडी का सीधा लाभ' : 'Direct interest & subsidy benefit'}
            </div>
          </div>

          {/* Profit Safety Gauge */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[#173B57] font-bold">{isHindi ? 'आपकी दैनिक कमाई में क़िस्त का हिस्सा:' : 'EMI Share of Daily Profit:'}</span>
              <span className="font-bold text-[#0F766E]">{emiShareOfDailyProfit}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#0F766E] h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(emiShareOfDailyProfit, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-600 pt-1">
              <span>{isHindi ? 'क़िस्त देने के बाद रोज़ आपकी जेब में बचेगा:' : 'Remaining in your pocket daily after EMI:'}</span>
              <span className="font-bold text-[#173B57]">
                ₹{profitRemainingAfterEmi}/{isHindi ? 'दिन' : 'day'} (₹{(profitRemainingAfterEmi * 30).toLocaleString('en-IN')}/{isHindi ? 'माह' : 'mo'})
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
            <span>{isHindi ? '₹10 लाख तक के ऋण पर कोई ज़मीन या गारंटी बंधक नहीं रखी जाती।' : 'No collateral or third-party guarantee required up to ₹10 Lakh.'}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ys-btn-primary"
          >
            {isHindi ? 'समझ आ गया • बंद करें' : 'Understood • Close'}
          </button>
        </div>

      </div>
    </div>
  );
}
