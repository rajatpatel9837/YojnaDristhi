import React, { useState } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  ChevronRight, 
  MoreHorizontal, 
  Printer, 
  Calculator, 
  Layers, 
  Volume2, 
  VolumeX, 
  Share2,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import { useLanguage } from '../context/LanguageContext';

/**
 * SchemeResultCard
 * A compact, scannable opportunity card (~220-270px on desktop)
 * Following the Buddy4Study & myScheme hierarchy:
 * 1. Title (max 2 lines) & Ministry/Provider
 * 2. Official verification badge
 * 3. Primary benefit (e.g. Up to ₹25 Lakh or 35% Subsidy)
 * 4. Compact match fit label
 * 5. Eligibility snapshot (at most 3 short bullet points)
 * 6. One primary CTA: Apply with guidance
 * 7. One quiet secondary action: View details
 * 8. Overflow tools menu for secondary utilities
 */
export default function SchemeResultCard({
  item,
  onApply,
  onViewDetails,
  onOpenParchaa,
  onOpenCalculator,
  onToggleCompare,
  isCompared = false,
  onToggleNarration,
  isPlayingAudio = false,
  onShareWhatsApp,
  isHighlighted = false
}) {
  const { t, isHindi } = useLanguage();
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const scheme = item.scheme || {};
  const isNotEligible = item.eligibilityStatus === 'NOT_ELIGIBLE';

  // Format main benefit string
  const maxSupportFormatted = scheme.maximumSupport 
    ? `₹${((scheme.maximumSupport) / 100000).toFixed(1)} ${isHindi ? 'लाख तक' : 'Lakh'}`
    : null;
  const subsidyFormatted = scheme.subsidyPercentage 
    ? `${scheme.subsidyPercentage}% ${isHindi ? 'सब्सिडी' : 'Subsidy'}`
    : null;
  const mainBenefit = subsidyFormatted || maxSupportFormatted || (isHindi ? 'सरकारी वित्तीय सहायता' : 'Financial Support');

  // Build compact 3-bullet eligibility snapshot
  const eligibilityBullets = [];
  
  // 1. Why you match
  if (item.matchedCriteria && item.matchedCriteria.length > 0) {
    const topMatch = item.matchedCriteria[0];
    eligibilityBullets.push({
      type: 'match',
      icon: CheckCircle2,
      color: 'text-[#0F766E]',
      label: isHindi ? 'पात्रता:' : 'Why you match:',
      text: typeof topMatch === 'string' ? topMatch : topMatch.text || topMatch.criterion || 'Demographic criteria met'
    });
  }

  // 2. Still needed / Missing doc
  if (item.gapAnalysis && item.gapAnalysis.length > 0) {
    const topGap = item.gapAnalysis[0];
    eligibilityBullets.push({
      type: 'gap',
      icon: AlertCircle,
      color: 'text-amber-700',
      label: isHindi ? 'कागज़ चाहिए:' : 'Still needed:',
      text: topGap.item ? `${topGap.item}` : (topGap.action || 'Certificate needed')
    });
  } else if (item.failedCriteria && item.failedCriteria.length > 0) {
    const topFail = item.failedCriteria[0];
    eligibilityBullets.push({
      type: 'fail',
      icon: AlertCircle,
      color: 'text-rose-600',
      label: isHindi ? 'अपात्रता:' : 'Criteria gap:',
      text: typeof topFail === 'object' ? (topFail.reason || topFail.field) : topFail
    });
  }

  // 3. Important note (Interest rate, collateral waiver, or guarantee)
  const importantNote = scheme.interestRate 
    ? `${scheme.interestRate}% ${isHindi ? 'ब्याज दर' : 'interest p.a.'}`
    : (scheme.moratoriumPeriodMonths ? `${scheme.moratoriumPeriodMonths} ${isHindi ? 'माह मोरेटोरियम' : 'months moratorium'}` : 'RBI collateral waiver applies');
  
  eligibilityBullets.push({
    type: 'note',
    icon: Info,
    color: 'text-slate-600',
    label: isHindi ? 'महत्वपूर्ण:' : 'Key term:',
    text: importantNote
  });

  const cardDomId = `scheme-card-${scheme.slug || scheme._id || scheme.id}`;

  return (
    <div 
      id={cardDomId}
      className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative ${
        isHighlighted
          ? 'ring-4 ring-[#0F766E]/50 border-2 border-[#0F766E] shadow-xl bg-[#F0FDFA]/30'
          : isNotEligible 
            ? 'border-rose-200 hover:border-rose-300' 
            : 'border-[#E2E8F0] hover:border-[#0F766E]'
      }`}
    >
      {/* Search Highlight Indicator Badge */}
      {isHighlighted && (
        <div className="absolute -top-3.5 left-5 bg-[#0F766E] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 z-10 animate-fadeIn">
          <Sparkles className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
          <span>{isHindi ? '🎯 खोजी गई योजना • विवरण सक्रिय' : '🎯 Selected from Search • Details Active'}</span>
        </div>
      )}
      
      {/* Top Meta Row */}
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            {/* Status Pill */}
            <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${
              isNotEligible 
                ? 'bg-rose-100 text-rose-800'
                : item.eligibilityStatus === 'ELIGIBLE'
                  ? 'bg-[#CCFBF1] text-[#115E59]'
                  : 'bg-amber-100 text-amber-900'
            }`}>
              {isNotEligible ? (isHindi ? 'अपात्र' : 'Not Eligible') : (isHindi ? 'संभावित पात्र' : 'Eligible')}
            </span>

            {/* Official Source Badge */}
            <VerificationBadge 
              status={scheme.verificationStatus === 'VERIFIED' ? 'OFFICIAL_GOVERNMENT_SCHEME' : scheme.verificationStatus || 'OFFICIAL_GOVERNMENT_SCHEME'} 
              type="OPPORTUNITY" 
            />

            {scheme.sourceType && (
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200 font-medium">
                {scheme.sourceType}
              </span>
            )}
          </div>

          {/* Compact Match Score */}
          <div className="shrink-0 text-right">
            <span className={`text-base font-black px-2.5 py-0.5 rounded-lg border ${
              isNotEligible 
                ? 'bg-rose-50 text-rose-600 border-rose-200' 
                : 'bg-[#F0FDFA] text-[#0F766E] border-[#14B8A6]/40'
            }`}>
              {item.matchScore}% {isHindi ? 'मेल' : 'fit'}
            </span>
          </div>
        </div>

        {/* Title & Ministry */}
        <div>
          <h3 
            onClick={() => onViewDetails(scheme, item)}
            className="text-base sm:text-lg font-bold text-[#173B57] line-clamp-2 leading-snug cursor-pointer hover:text-[#0F766E] transition"
            title={scheme.name}
          >
            {scheme.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
            {scheme.provider}
          </p>
        </div>

        {/* Primary Benefit Display */}
        <div className="bg-[#F8FAFC] px-3.5 py-2 rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs">
          <span className="text-slate-500 font-semibold">
            {isHindi ? 'सरकारी लाभ:' : 'Main Benefit:'}
          </span>
          <span className="font-extrabold text-sm text-[#0F766E]">
            {mainBenefit}
          </span>
        </div>

        {/* Eligibility Snapshot (At most 3 short human bullet points) */}
        <div className="space-y-1.5 pt-1 text-xs">
          {eligibilityBullets.slice(0, 3).map((bullet, bIdx) => {
            const Icon = bullet.icon;
            return (
              <div key={bIdx} className="flex items-start gap-1.5 text-[11px] leading-tight text-slate-700">
                <Icon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${bullet.color}`} />
                <span className="line-clamp-1">
                  <strong className="text-slate-900 font-semibold">{bullet.label}</strong> {bullet.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          {/* Exactly ONE Primary Filled CTA */}
          <button
            type="button"
            onClick={() => onApply(scheme)}
            className="ys-btn-primary text-xs py-2 px-3.5 min-h-[38px] shadow-xs flex-1 sm:flex-initial"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('card_apply_guidance', isHindi ? 'मार्गदर्शन से आवेदन' : 'Apply with guidance')}</span>
          </button>

          {/* Quiet Secondary Action: View Details */}
          <button
            type="button"
            onClick={() => onViewDetails(scheme, item)}
            className="ys-btn-secondary text-xs py-2 px-3 min-h-[38px]"
          >
            <span>{t('card_view_details', isHindi ? 'विवरण देखें' : 'View details')}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>

        {/* Overflow / More Tools Popover Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowToolsMenu(!showToolsMenu)}
            className={`p-2 rounded-xl border text-slate-600 transition min-h-[38px] min-w-[38px] flex items-center justify-center ${
              showToolsMenu ? 'bg-slate-100 border-slate-300' : 'bg-white hover:bg-slate-50 border-[#CBD5E1]'
            }`}
            title={isHindi ? 'अतिरिक्त विकल्प' : 'More tools'}
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {showToolsMenu && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setShowToolsMenu(false)} 
              />
              <div className="absolute right-0 bottom-full mb-2 w-56 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-1.5 z-30 space-y-0.5 text-xs animate-fadeIn">
                
                {/* Official Portal */}
                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2"
                  onClick={() => setShowToolsMenu(false)}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>{isHindi ? 'आधिकारिक पोर्टल खोलें ↗' : 'Open Official Portal ↗'}</span>
                </a>

                {/* Print Leaflet */}
                <button
                  type="button"
                  onClick={() => {
                    setShowToolsMenu(false);
                    onOpenParchaa(scheme, item);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isHindi ? 'योजना पर्चा प्रिंट करें' : 'Print Scheme Leaflet'}</span>
                </button>

                {/* Calculator */}
                <button
                  type="button"
                  onClick={() => {
                    setShowToolsMenu(false);
                    onOpenCalculator(scheme);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2"
                >
                  <Calculator className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isHindi ? 'वित्तीय कैलकुलेटर' : 'Financial Calculator'}</span>
                </button>

                {/* Compare */}
                <button
                  type="button"
                  onClick={() => {
                    setShowToolsMenu(false);
                    onToggleCompare(item);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2"
                >
                  <Layers className="w-3.5 h-3.5 text-slate-600" />
                  <span>{isCompared ? (isHindi ? 'तुलना से हटाएं' : 'Remove from Compare') : (isHindi ? 'तुलना में जोड़ें' : 'Add to Compare')}</span>
                </button>

                {/* Audio Listen */}
                <button
                  type="button"
                  onClick={() => {
                    setShowToolsMenu(false);
                    onToggleNarration(scheme, item);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-2"
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                      <span>{isHindi ? 'आवाज़ रोकें' : 'Stop Audio'}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#0F766E]" />
                      <span>{isHindi ? 'बोलकर सुनें' : 'Listen Narration'}</span>
                    </>
                  )}
                </button>

                {/* WhatsApp Share */}
                <button
                  type="button"
                  onClick={() => {
                    setShowToolsMenu(false);
                    onShareWhatsApp(scheme, item);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 text-emerald-800 font-semibold flex items-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isHindi ? 'व्हाट्सएप पर शेयर करें' : 'Share on WhatsApp'}</span>
                </button>

              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
