import React from 'react';
import { 
  X, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  Share2, 
  ShieldCheck, 
  Zap, 
  Coins, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SCHEME_BUNDLES } from '../data/schemeBundlesData.js';

/**
 * Scheme Stacking & Basket Optimizer Modal (योजनाओं का बंडल)
 * Demonstrates how bundling 2-3 government schemes increases citizen savings by 40-60%.
 */
export default function SchemeBasketModal({ 
  isOpen, 
  onClose, 
  bundle = SCHEME_BUNDLES[0], 
  profile,
  onApplyBundle
}) {
  const { t, isHindi } = useLanguage();
  if (!isOpen || !bundle) return null;

  const handleWhatsAppShare = () => {
    const text = isHindi
      ? `*योजना सेतू AI (Yojna दृष्टि) — योजना महा-बंडल (Scheme Stacking)*\n\n` +
        `📦 *बंडल नाम:* ${bundle.title_hi}\n` +
        `👤 *उद्यमी:* ${profile?.fullName || 'उद्यमी'} (${profile?.sector || 'लघु उद्योग'}, ${profile?.state || 'भारत'})\n\n` +
        `🔥 *शामिल योजनाएं:*\n` +
        bundle.schemes.map((s, idx) => `${idx + 1}. *${s.name}*: ${s.benefit_hi}`).join('\n') +
        `\n\n💰 *कुल सरकारी लाभ:* ${bundle.totalExtraSavings_hi} (+${bundle.netGainPercent}% अतिरिक्त बचत)\n` +
        `💡 *विशेष तालमेल:* ${bundle.synergyTip_hi}\n\n` +
        `👉 *पूरा बंडल देखने हेतु:* ${window.location.origin}/matches`
      : `*YojnaSetu AI — Scheme Stacking Optimizer*\n\n` +
        `📦 *Bundle Name:* ${bundle.title_en || bundle.title_hi}\n` +
        `👤 *Entrepreneur:* ${profile?.fullName || 'Entrepreneur'} (${profile?.sector || 'Enterprise'}, ${profile?.state || 'India'})\n\n` +
        `🔥 *Included Schemes:*\n` +
        bundle.schemes.map((s, idx) => `${idx + 1}. *${s.name}*: ${s.benefit_hi}`).join('\n') +
        `\n\n💰 *Total Support:* ${bundle.totalExtraSavings_hi} (+${bundle.netGainPercent}% extra benefit)\n\n` +
        `👉 *View Full Stack:* ${window.location.origin}/matches`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="ys-modal-overlay animate-fadeIn">
      <div className="ys-modal-dialog max-w-3xl">
        
        {/* Header Bar */}
        <div className="ys-modal-header">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFBF1] text-[#0F766E] text-xs font-bold uppercase tracking-wider border border-[#14B8A6]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{(isHindi ? bundle.badge_hi : bundle.badge_en) || bundle.badge_hi || (isHindi ? 'योजना बंडल' : 'Scheme Stack')} • {bundle.sector}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#173B57] flex items-center gap-2">
              <span>{bundle.icon || '🧺'}</span>
              <span>{isHindi ? bundle.title_hi : (bundle.title_en || bundle.title_hi)}</span>
            </h2>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              {bundle.description_hi}
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

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-[#173B57]">
          
          {/* Synergy Gain Spotlight Banner */}
          <div className="bg-[#F0FDFA] p-4 sm:p-5 rounded-2xl border border-[#14B8A6]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-[11px] text-[#0F766E] font-bold uppercase tracking-wide">
                {isHindi ? 'मल्टी-स्कीम बंडलिंग लाभ' : 'Multi-Scheme Bundling Benefit (Synergistic Net Benefit)'}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[#173B57] flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[#0F766E]">{bundle.totalExtraSavings_hi}</span>
                <span className="text-xs bg-[#CCFBF1] text-[#0F766E] border border-[#14B8A6]/30 px-2.5 py-0.5 rounded-full font-bold">
                  +{bundle.netGainPercent}% {isHindi ? 'अधिक बचत' : 'Extra Benefit'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {isHindi ? (
                  <>अकेले 1 योजना लेने पर केवल <span className="line-through text-slate-400">{bundle.standaloneSavings_hi}</span> मिलता है।</>
                ) : (
                  <>Standalone single scheme provides only <span className="line-through text-slate-400">{bundle.standaloneSavings_hi}</span>.</>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0F766E] border border-[#14B8A6]/40 font-bold transition flex items-center gap-1.5 shadow-2xs text-xs"
              >
                <Share2 className="w-4 h-4 text-[#0F766E]" />
                <span>{isHindi ? 'व्हाट्सएप शेयर' : 'Share WhatsApp'}</span>
              </button>
            </div>
          </div>

          {/* Bundled Schemes Cards List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#173B57] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0F766E]" />
                <span>{isHindi ? 'बंडल में शामिल पूरक सरकारी योजनाएं:' : 'Complementary Government Schemes in Stack:'}</span>
              </h3>
              <span className="text-[11px] text-[#0F766E] font-bold">{isHindi ? 'योजनाओं का 1-साथ लाभ' : 'Multi-Scheme Advantage'}</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {bundle.schemes.map((sch, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#0F766E] transition space-y-2 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#0F766E] bg-[#F0FDFA] px-2 py-0.5 rounded border border-[#CCFBF1]">
                        {isHindi ? 'योजना' : 'Scheme'} 0{i + 1} • {sch.role_hi}
                      </span>
                      <h4 className="text-sm font-bold text-[#173B57] mt-1">{sch.name}</h4>
                    </div>
                    <span className="text-xs font-bold text-[#0F766E] bg-[#F0FDFA] px-2.5 py-1 rounded-lg border border-[#CCFBF1] shrink-0">
                      {sch.sharePercent}% {isHindi ? 'प्रभाव' : 'Impact'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                    <span>{sch.benefit_hi}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Ground-Level Synergy Pro-Tip */}
          <div className="p-4 rounded-xl bg-[#FEF3C7] border border-[#F59E0B]/30 space-y-1.5 text-[#92400E]">
            <div className="flex items-center gap-2 font-bold text-xs">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>{isHindi ? 'ज़मीनी तालमेल सीक्रेट (Field Synergy Rule):' : 'Ground-Level Synergy Secret (Field Synergy Rule):'}</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              {bundle.synergyTip_hi}
            </p>
          </div>

          {/* Step-by-Step Simultaneous Application Roadmap */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <h3 className="text-xs font-bold text-[#173B57] uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0369A1]" />
              <span>{isHindi ? 'एक साथ आवेदन का 3-चरणीय रोडमैप (Sequential Action Roadmap):' : 'Sequential Application Roadmap (3-Step):'}</span>
            </h3>

            <div className="space-y-2">
              {bundle.roadmapSteps_hi?.map((step, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-[#CBD5E1] flex items-start gap-3 shadow-2xs">
                  <span className="w-5 h-5 rounded-full bg-[#CCFBF1] text-[#0F766E] font-bold text-[10px] flex items-center justify-center shrink-0 border border-[#14B8A6]/30 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-[#173B57]">{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Action Bar */}
        <div className="p-4 sm:p-5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
            <span>{isHindi ? 'सभी योजनाएं आधिकारिक भारत सरकार / राज्य पोर्टल पर उपलब्ध हैं।' : 'All schemes available on official central & state portals.'}</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="ys-btn-secondary w-full sm:w-auto"
            >
              {isHindi ? 'बंद करें' : 'Close'}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onApplyBundle) onApplyBundle(bundle);
              }}
              className="ys-btn-primary w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isHindi ? 'पूरे बंडल के लिए आवेदन करें ↗' : 'Apply for Full Stack Bundle ↗'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
