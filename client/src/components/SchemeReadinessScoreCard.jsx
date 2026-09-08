// client/src/components/SchemeReadinessScoreCard.jsx
import React from 'react';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight,
  Zap
} from 'lucide-react';

/**
 * "योजना रेडीनेस स्कोर" (Scheme Readiness Score: 0 to 1000)
 * Gamified CIBIL-like readiness meter showing milestones to unlock higher subsidies
 * and collateral-free lending.
 */
export default function SchemeReadinessScoreCard({ 
  profile, 
  onResolveDocument 
}) {
  const docs = profile?.documentsAvailable || [];
  const hasAadhaar = docs.includes('Aadhaar/Identity') || !!profile?.idNumber;
  const hasIncome = docs.includes('Income Certificate') || !!profile?.annualTurnover;
  const hasCategory = docs.includes('Category Certificate') || (profile?.category && profile?.category !== 'General');
  const hasUdyam = docs.includes('Udyam Certificate') || profile?.udyamStatus === 'Registered';
  const hasBankStmt = docs.includes('Bank Statement');
  const hasBusinessExp = (profile?.annualTurnover > 0) || (profile?.existingUnits > 0);

  // Calculate score (0 to 1000)
  let score = 500;
  if (hasAadhaar) score += 100;
  if (hasIncome) score += 90;
  if (hasCategory) score += 110;
  if (hasUdyam) score += 100;
  if (hasBankStmt) score += 50;
  if (hasBusinessExp) score += 50;
  score = Math.min(score, 1000);

  // Determine Tier
  let tierInfo = {
    label_hi: 'उत्कृष्ट (Yojna Ready Elite)',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    progressColor: 'from-emerald-400 to-teal-300',
    approvalChance: '95%+',
    summary_hi: 'आपकी प्रोफ़ाइल पूर्णतः तैयार है। नोडल बैंक शाखा में सीधे उच्च प्राथमिकता पर मंज़ूरी मिलेगी।'
  };

  if (score < 700) {
    tierInfo = {
      label_hi: 'विकासशील (Moderate Readiness)',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      progressColor: 'from-amber-400 to-orange-400',
      approvalChance: '70%',
      summary_hi: 'कुछ महत्वपूर्ण प्रमाण पत्र जोड़कर अपने स्कोर को 850+ तक बढ़ाएं और अधिकतम सब्सिडी पाएं।'
    };
  } else if (score < 850) {
    tierInfo = {
      label_hi: 'उत्तम (High Readiness)',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
      progressColor: 'from-sky-400 to-emerald-400',
      approvalChance: '88%',
      summary_hi: 'अधिकांश केंद्रीय योजनाओं (PMEGP, मुद्रा) के लिए आपकी पात्रता मजबूत है।'
    };
  }

  // Missing unlocks
  const unlockItems = [];
  if (!hasUdyam) {
    unlockItems.push({
      docId: 'Udyam Certificate',
      points: '+100 अंक',
      title_hi: 'उद्यम पंजीकरण जोड़ें',
      benefit_hi: '₹10 लाख तक बिना गारंटी लोन अनलॉक',
      color: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30'
    });
  }
  if (!hasCategory && profile?.category !== 'General') {
    unlockItems.push({
      docId: 'Category Certificate',
      points: '+110 अंक',
      title_hi: 'जाति प्रमाण पत्र जोड़ें',
      benefit_hi: '35% विशेष श्रेणी सब्सिडी अनलॉक',
      color: 'border-sky-500/40 text-sky-300 bg-sky-950/30'
    });
  }
  if (!hasIncome) {
    unlockItems.push({
      docId: 'Income Certificate',
      points: '+90 अंक',
      title_hi: 'आय प्रमाण पत्र जोड़ें',
      benefit_hi: 'ब्याज अनुदान व मार्जिन मनी अनलॉक',
      color: 'border-amber-500/40 text-amber-300 bg-amber-950/30'
    });
  }
  if (!hasBankStmt) {
    unlockItems.push({
      docId: 'Bank Statement',
      points: '+50 अंक',
      title_hi: '6 माह का बैंक स्टेटमेंट जोड़ें',
      benefit_hi: 'त्वरित बैंक डिस्बर्सल 7 दिनों में',
      color: 'border-teal-500/40 text-teal-300 bg-teal-950/30'
    });
  }

  const scorePercentage = Math.round((score / 1000) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6 text-slate-100">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-300" />
              <span>CIBIL-शैली योजना स्कोर • Yojna Readiness</span>
            </span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">0 से 1000 का पैमाना</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            योजना रेडीनेस स्कोर: <span className="text-emerald-400">{score}</span> / 1000
          </h2>
          <p className="text-xs text-slate-300">
            {tierInfo.summary_hi}
          </p>
        </div>

        {/* Tier Status Badge */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-black border ${tierInfo.badgeColor}`}>
            {tierInfo.label_hi}
          </span>
          <span className="text-xs font-bold text-slate-300">
            स्वीकृति संभावना: <span className="text-emerald-400 font-extrabold">{tierInfo.approvalChance}</span>
          </span>
        </div>
      </div>

      {/* Visual Gauge Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] font-bold text-slate-400">
          <span>0 (प्रारंभिक)</span>
          <span className="text-amber-400">500 (सामान्य)</span>
          <span className="text-sky-400">700 (उत्तम)</span>
          <span className="text-emerald-400">850+ (एलीट रेडी)</span>
          <span>1000</span>
        </div>

        {/* Progress Bar Track */}
        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700 relative">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${tierInfo.progressColor} transition-all duration-1000 shadow-md relative`}
            style={{ width: `${scorePercentage}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Actionable Unlocks Section */}
      {unlockItems.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>अगला स्तर अनलॉक करें (स्कोर बढ़ाएं और अधिक लाभ पाएं):</span>
            </h3>
            <span className="text-[11px] text-slate-400">क्लिक कर सरकारी प्रक्रिया देखें</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unlockItems.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onResolveDocument && onResolveDocument(item.docId)}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between gap-2 shadow-sm hover:scale-[1.02] active:scale-95 ${item.color}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-xs">{item.title_hi}</span>
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-white/10 text-white">
                    {item.points}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 flex items-center justify-between">
                  <span>{item.benefit_hi}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
