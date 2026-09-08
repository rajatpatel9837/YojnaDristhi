// client/src/components/DailyCashflowSimulatorModal.jsx
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 p-5 sm:p-6 border-b border-emerald-500/20 flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
              <Calculator className="w-3.5 h-3.5 text-emerald-300" />
              <span>रोज़ाना मुनाफ़ा vs क़िस्त सिम्युलेटर</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>📊 क़िस्त का डर दूर करें — दैनिक कमाई से हिसाब</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              बैंक की भारी-भरकम किस्तों के डर से न रुकें। जानिए कि आपकी रोज़ की 2-3 कप चाय या थोड़े से मुनाफ़े से यह लोन कैसे चुकता होगा।
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Big Hero Stat: Daily Burden & Tea Cup Analogy */}
          <div className="bg-gradient-to-br from-emerald-500/15 via-teal-500/5 to-transparent p-5 rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
            <div className="space-y-1.5">
              <div className="text-[11px] text-emerald-400 font-extrabold uppercase tracking-wide flex items-center justify-center sm:justify-start gap-1.5">
                <Coffee className="w-4 h-4 text-amber-400" />
                <span>दैनिक आसान बोझ (Daily Repayment Burden)</span>
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white flex items-center justify-center sm:justify-start gap-1">
                <span>सिर्फ</span>
                <span className="text-emerald-400">₹{dailyEmiGovt}</span>
                <span className="text-lg text-slate-300 font-bold">/प्रति दिन</span>
              </div>
              <p className="text-xs text-slate-300">
                मासिक क़िस्त: <span className="font-bold text-white">₹{monthlyEmiGovt.toLocaleString('en-IN')}/माह</span> • सरकारी छूट (सब्सिडी): <span className="font-bold text-emerald-400">₹{subsidyAmount.toLocaleString('en-IN')}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center shrink-0 space-y-1">
              <div className="text-2xl">☕ ☕ ☕</div>
              <div className="text-[11px] font-bold text-amber-300">
                रोज़ की मात्र 2-3 कप चाय के बराबर!
              </div>
              <div className="text-[10px] text-slate-400">
                किसी भी छोटे काम से आसानी से चुकता
              </div>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60">
            {/* Slider 1: Loan Amount */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold">ऋण राशि (Loan Amount):</span>
                <span className="font-extrabold text-emerald-400 font-mono">₹{loanAmount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={50000}
                max={2500000}
                step={25000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹50 हज़ार</span>
                <span>₹10 लाख</span>
                <span>₹25 लाख</span>
              </div>
            </div>

            {/* Slider 2: Daily Expected Profit */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold">आपकी रोज़ाना अपेक्षित कमाई (Daily Profit):</span>
                <span className="font-extrabold text-sky-400 font-mono">₹{estimatedDailyProfit}/दिन</span>
              </div>
              <input
                type="range"
                min={300}
                max={5000}
                step={50}
                value={estimatedDailyProfit}
                onChange={(e) => setEstimatedDailyProfit(Number(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₹300/दिन</span>
                <span>₹2,000/दिन</span>
                <span>₹5,000/दिन</span>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison: Govt Subsidized vs Private Moneylender */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              सरकारी योजना बनाम साहूकार/प्राइवेट लोन का अंतर:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Govt Card */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase">
                    🟢 सरकारी सब्सिडी लोन
                  </span>
                  <span className="text-xs font-black text-emerald-400">{defaultInterest}% ब्याज</span>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">प्रतिदिन की क़िस्त</div>
                  <div className="text-2xl font-black text-emerald-400">₹{dailyEmiGovt} <span className="text-xs text-slate-400">/दिन</span></div>
                </div>
                <div className="space-y-1 pt-2 border-t border-emerald-500/20 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span>मासिक क़िस्त:</span>
                    <span className="font-bold text-white">₹{monthlyEmiGovt.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>सरकारी सब्सिडी (छूट):</span>
                    <span className="font-bold text-emerald-400">₹{subsidyAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Private Moneylender Card */}
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase">
                    🔴 प्राइवेट साहूकार / माइक्रोफाइनेंस
                  </span>
                  <span className="text-xs font-black text-rose-400">18%+ ब्याज</span>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">प्रतिदिन की क़िस्त</div>
                  <div className="text-2xl font-black text-rose-400">₹{dailyEmiPrivate} <span className="text-xs text-slate-400">/दिन</span></div>
                </div>
                <div className="space-y-1 pt-2 border-t border-rose-500/20 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span>मासिक क़िस्त:</span>
                    <span className="font-bold text-white">₹{monthlyEmiPrivate.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>सब्सिडी छूट:</span>
                    <span className="font-bold text-rose-400">₹0 (शून्य)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Year Total Lifetime Savings Highlight */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent border border-amber-500/30 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>सरकारी योजना चुनने पर आपकी 5 वर्ष की कुल बचत:</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                ₹{netFiveYearSavings.toLocaleString('en-IN')} शुद्ध बचत!
              </div>
            </div>
            <div className="text-right text-[11px] text-emerald-300 font-bold hidden sm:block">
              ब्याज व सब्सिडी का सीधा लाभ
            </div>
          </div>

          {/* Profit Safety Gauge */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-bold">आपकी दैनिक कमाई में क़िस्त का हिस्सा:</span>
              <span className="font-bold text-emerald-400">{emiShareOfDailyProfit}%</span>
            </div>
            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(emiShareOfDailyProfit, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-1">
              <span>क़िस्त देने के बाद रोज़ आपकी जेब में बचेगा:</span>
              <span className="font-bold text-white">₹{profitRemainingAfterEmi}/दिन (₹{(profitRemainingAfterEmi * 30).toLocaleString('en-IN')}/माह)</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>₹10 लाख तक के ऋण पर कोई ज़मीन या गारंटी बंधक नहीं रखी जाती।</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition active:scale-95"
          >
            समझ आ गया • बंद करें
          </button>
        </div>

      </div>
    </div>
  );
}
