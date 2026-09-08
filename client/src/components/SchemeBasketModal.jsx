// client/src/components/SchemeBasketModal.jsx
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
  if (!isOpen || !bundle) return null;

  const handleWhatsAppShare = () => {
    const text = `*योजना सेतू AI (Yojna दृष्टि) — योजना महा-बंडल (Scheme Stacking)*\n\n` +
      `📦 *बंडल नाम:* ${bundle.title_hi}\n` +
      `👤 *उद्यमी:* ${profile?.fullName || 'उद्यमी'} (${profile?.sector || 'लघु उद्योग'}, ${profile?.state || 'भारत'})\n\n` +
      `🔥 *शामिल योजनाएं:*\n` +
      bundle.schemes.map((s, idx) => `${idx + 1}. *${s.name}*: ${s.benefit_hi}`).join('\n') +
      `\n\n💰 *कुल सरकारी लाभ:* ${bundle.totalExtraSavings_hi} (+${bundle.netGainPercent}% अतिरिक्त बचत)\n` +
      `💡 *विशेष तालमेल:* ${bundle.synergyTip_hi}\n\n` +
      `👉 *पूरा बंडल देखने हेतु:* ${window.location.origin}/matches`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 p-5 sm:p-6 border-b border-emerald-500/20 flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>{bundle.badge_hi || 'योजना बंडल'} • {bundle.sector}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>{bundle.icon || '🧺'}</span>
              <span>{bundle.title_hi}</span>
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {bundle.description_hi}
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

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* Synergy Gain Spotlight Banner */}
          <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-4 sm:p-5 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-[11px] text-emerald-400 font-extrabold uppercase tracking-wide">
                मल्टी-स्कीम बंडलिंग लाभ (Synergistic Net Benefit)
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
                <span>{bundle.totalExtraSavings_hi}</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                  +{bundle.netGainPercent}% अधिक बचत
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                अकेले 1 योजना लेने पर केवल <span className="line-through text-slate-500">{bundle.standaloneSavings_hi}</span> मिलता है।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>व्हाट्सएप शेयर</span>
              </button>
            </div>
          </div>

          {/* Bundled Schemes Cards List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>बंडल में शामिल 3 पूरक सरकारी योजनाएं:</span>
              </h3>
              <span className="text-[11px] text-emerald-400 font-bold">3 योजनाओं का 1-साथ लाभ</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {bundle.schemes.map((sch, i) => (
                <div 
                  key={i} 
                  className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/40 transition space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        योजना 0{i + 1} • {sch.role_hi}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{sch.name}</h4>
                    </div>
                    <span className="text-xs font-black text-emerald-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700 shrink-0">
                      {sch.sharePercent}% प्रभाव
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{sch.benefit_hi}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Ground-Level Synergy Pro-Tip */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-slate-300">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>ज़मीनी तालमेल सीक्रेट (Field Synergy Rule):</span>
            </div>
            <p className="text-xs text-amber-100/90 leading-relaxed">
              {bundle.synergyTip_hi}
            </p>
          </div>

          {/* Step-by-Step Simultaneous Application Roadmap */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>एक साथ आवेदन का 3-चरणीय रोडमैप (Sequential Action Roadmap):</span>
            </h3>

            <div className="space-y-2">
              {bundle.roadmapSteps_hi?.map((step, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-slate-700/50 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-[10px] flex items-center justify-center shrink-0 border border-emerald-400/30 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-xs text-slate-200">{step}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Action Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>सभी 3 योजनाएं आधिकारिक भारत सरकार / राज्य पोर्टल पर उपलब्ध हैं।</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition active:scale-95 w-full sm:w-auto"
            >
              बंद करें
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onApplyBundle) onApplyBundle(bundle);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95 w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>पूरे बंडल के लिए आवेदन करें ↗</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
