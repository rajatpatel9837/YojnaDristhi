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
import { useLanguage } from '../context/LanguageContext';

/**
 * "योजना रेडीनेस स्कोर" (Scheme Readiness Score: 0 to 1000)
 * Gamified CIBIL-like readiness meter showing milestones to unlock higher subsidies
 * and collateral-free lending.
 */
export default function SchemeReadinessScoreCard({ 
  profile, 
  onResolveDocument 
}) {
  const { isHindi } = useLanguage();

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
    label_en: 'Yojna Ready Elite (Excellent)',
    badgeColor: 'bg-[#CCFBF1] text-[#0F766E] border-[#14B8A6]/40',
    progressColor: 'from-[#0F766E] to-[#14B8A6]',
    approvalChance: '95%+',
    summary_hi: 'आपकी प्रोफ़ाइल पूर्णतः तैयार है। नोडल बैंक शाखा में सीधे उच्च प्राथमिकता पर मंज़ूरी मिलेगी।',
    summary_en: 'Your profile is fully prepared. Direct high-priority sanction and processing at nodal bank branches.'
  };

  if (score < 700) {
    tierInfo = {
      label_hi: 'विकासशील (Moderate Readiness)',
      label_en: 'Moderate Readiness (Building)',
      badgeColor: 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]/40',
      progressColor: 'from-amber-500 to-amber-400',
      approvalChance: '70%',
      summary_hi: 'कुछ महत्वपूर्ण प्रमाण पत्र जोड़कर अपने स्कोर को 850+ तक बढ़ाएं और अधिकतम सब्सिडी पाएं।',
      summary_en: 'Add a few essential certificates to elevate your readiness above 850 and maximize government subsidies.'
    };
  } else if (score < 850) {
    tierInfo = {
      label_hi: 'उत्तम (High Readiness)',
      label_en: 'High Readiness (Strong)',
      badgeColor: 'bg-[#E0F2FE] text-[#0369A1] border-[#38BDF8]/40',
      progressColor: 'from-[#0284C7] to-[#0F766E]',
      approvalChance: '88%',
      summary_hi: 'अधिकांश केंद्रीय योजनाओं (PMEGP, मुद्रा) के लिए आपकी पात्रता मजबूत है।',
      summary_en: 'Strong eligibility profile across major central schemes (PMEGP, Mudra, Stand-Up India).'
    };
  }

  // Missing unlocks
  const unlockItems = [];
  if (!hasUdyam) {
    unlockItems.push({
      docId: 'Udyam Certificate',
      points: isHindi ? '+100 अंक' : '+100 Pts',
      title_hi: 'उद्यम पंजीकरण जोड़ें',
      title_en: 'Add MSME Udyam Registration',
      benefit_hi: '₹10 लाख तक बिना गारंटी लोन अनलॉक',
      benefit_en: 'Unlocks up to ₹10 Lakhs collateral-free credit',
      color: 'border-[#14B8A6]/40 text-[#0F766E] bg-[#F0FDFA] hover:bg-[#CCFBF1]/40'
    });
  }
  if (!hasCategory && profile?.category !== 'General') {
    unlockItems.push({
      docId: 'Category Certificate',
      points: isHindi ? '+110 अंक' : '+110 Pts',
      title_hi: 'जाति प्रमाण पत्र जोड़ें',
      title_en: 'Add Category Certificate',
      benefit_hi: '35% विशेष श्रेणी सब्सिडी अनलॉक',
      benefit_en: 'Unlocks 35% special category subsidy',
      color: 'border-[#38BDF8]/40 text-[#0369A1] bg-[#F0F9FF] hover:bg-[#E0F2FE]/40'
    });
  }
  if (!hasIncome) {
    unlockItems.push({
      docId: 'Income Certificate',
      points: isHindi ? '+90 अंक' : '+90 Pts',
      title_hi: 'आय प्रमाण पत्र जोड़ें',
      title_en: 'Add Income Certificate',
      benefit_hi: 'ब्याज अनुदान व मार्जिन मनी अनलॉक',
      benefit_en: 'Unlocks interest subvention & margin grant',
      color: 'border-[#F59E0B]/40 text-[#92400E] bg-[#FFFBEB] hover:bg-[#FEF3C7]/40'
    });
  }
  if (!hasBankStmt) {
    unlockItems.push({
      docId: 'Bank Statement',
      points: isHindi ? '+50 अंक' : '+50 Pts',
      title_hi: '6 माह का बैंक स्टेटमेंट जोड़ें',
      title_en: 'Add 6-Month Bank Statement',
      benefit_hi: 'त्वरित बैंक डिस्बर्सल 7 दिनों में',
      benefit_en: 'Enables quick 7-day bank disbursal',
      color: 'border-[#CBD5E1] text-[#173B57] bg-[#F8FAFC] hover:bg-[#F1F5F9]'
    });
  }

  const scorePercentage = Math.round((score / 1000) * 100);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-7 shadow-sm space-y-6 text-[#173B57]">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#CCFBF1] text-[#0F766E] text-[10px] font-extrabold uppercase tracking-wider border border-[#14B8A6]/40 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{isHindi ? 'CIBIL-शैली योजना स्कोर • Yojna Readiness' : 'CIBIL-Style Scheme Score • Yojna Readiness'}</span>
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              {isHindi ? '0 से 1000 का पैमाना' : '0 to 1000 Scale'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#173B57]">
            {isHindi ? 'योजना रेडीनेस स्कोर:' : 'Scheme Readiness Score:'} <span className="text-[#0F766E]">{score}</span> / 1000
          </h2>
          <p className="text-xs text-slate-600">
            {isHindi ? tierInfo.summary_hi : tierInfo.summary_en}
          </p>
        </div>

        {/* Tier Status Badge */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${tierInfo.badgeColor}`}>
            {isHindi ? tierInfo.label_hi : tierInfo.label_en}
          </span>
          <span className="text-xs font-semibold text-slate-600">
            {isHindi ? 'स्वीकृति संभावना:' : 'Approval Probability:'} <span className="text-[#0F766E] font-extrabold">{tierInfo.approvalChance}</span>
          </span>
        </div>
      </div>

      {/* Visual Gauge Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] font-bold text-slate-500">
          <span>{isHindi ? '0 (प्रारंभिक)' : '0 (Initial)'}</span>
          <span className="text-amber-600">{isHindi ? '500 (सामान्य)' : '500 (Moderate)'}</span>
          <span className="text-sky-600">{isHindi ? '700 (उत्तम)' : '700 (High)'}</span>
          <span className="text-[#0F766E]">{isHindi ? '850+ (एलीट रेडी)' : '850+ (Elite Ready)'}</span>
          <span>1000</span>
        </div>

        {/* Progress Bar Track */}
        <div className="h-3.5 w-full bg-[#F1F5F9] rounded-full overflow-hidden p-0.5 border border-[#E2E8F0] relative">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${tierInfo.progressColor} transition-all duration-1000 relative`}
            style={{ width: `${scorePercentage}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Actionable Unlocks Section */}
      {unlockItems.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#173B57] uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{isHindi ? 'अगला स्तर अनलॉक करें (स्कोर बढ़ाएं और अधिक लाभ पाएं):' : 'Unlock Next Level (Boost Score & Maximize Subsidies):'}</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              {isHindi ? 'क्लिक कर सरकारी प्रक्रिया देखें' : 'Click to View Resolution Guide'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {unlockItems.map((item, idx) => {
              const itemTitle = isHindi ? item.title_hi : item.title_en;
              const itemBenefit = isHindi ? item.benefit_hi : item.benefit_en;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onResolveDocument && onResolveDocument(item.docId)}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between gap-2 shadow-xs hover:shadow-sm ${item.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{itemTitle}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-[#CBD5E1] text-[#173B57]">
                      {item.points}
                    </span>
                  </div>
                  <div className="text-[11px] opacity-90 flex items-center justify-between">
                    <span>{itemBenefit}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
