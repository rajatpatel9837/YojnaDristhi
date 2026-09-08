/**
 * VoiceWizardOverlay.jsx
 * Visual feedback layer for "बोलकर भरें 2.0" (Seamless Voice Experience for Yojna दृष्टि).
 * Renders live soundwave visualizer, large Hindi subtitles, 2.5s auto-advance countdown
 * with instant undo/next controls, and accessible buttons.
 */

import React from 'react';
import {
  Mic,
  Volume2,
  Loader2,
  CheckCircle2,
  Pause,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Undo2,
  Check
} from 'lucide-react';
import VoiceWaveformVisualizer from './VoiceWaveformVisualizer.jsx';

export default function VoiceWizardOverlay({
  sessionState, // 'idle' | 'speaking' | 'listening' | 'processing' | 'auto_advancing' | 'confirming' | 'error_retry'
  currentQuestion_hi,
  currentHint_hi,
  currentFieldLabel_hi,
  liveCaption,
  fieldProgress,
  pendingAdvance, // { key, label_hi, value, countdown }
  onCancelAdvance,
  onConfirmAdvance,
  onPause,
  onRepeat,
  onBack
}) {
  const isSpeaking = sessionState === 'speaking';
  const isListening = sessionState === 'listening';
  const isProcessing = sessionState === 'processing';
  const isAutoAdvancing = sessionState === 'auto_advancing' || Boolean(pendingAdvance);
  const isConfirming = sessionState === 'confirming' && !isAutoAdvancing;

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-slate-900/95 via-slate-900 to-slate-950 p-5 sm:p-6 text-white shadow-2xl backdrop-blur-md transition-all">
      {/* Glow highlight */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Live Status & Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          {/* Animated State Pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700">
            {isSpeaking && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 font-semibold">बोल रहे हैं...</span>
              </>
            )}
            {isListening && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <Mic className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span className="text-rose-300 font-bold">सुन रहे हैं... बोलें</span>
              </>
            )}
            {isProcessing && (
              <>
                <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                <span className="text-sky-300 font-medium">समझ रहे हैं...</span>
              </>
            )}
            {isAutoAdvancing && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                <span className="text-emerald-300 font-bold">सत्यापित · आगे बढ़ रहे हैं</span>
              </>
            )}
            {isConfirming && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                <span className="text-amber-300 font-bold">पुष्टि करें (हाँ या नहीं)</span>
              </>
            )}
            {sessionState === 'idle' && !isAutoAdvancing && (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-slate-400">तैयार</span>
              </>
            )}
          </div>

          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            बोलकर भरें 2.0 — Yojna दृष्टि
          </span>
        </div>

        {/* Progress Counter */}
        <div className="text-[11px] font-medium text-slate-300 bg-slate-800/60 px-3 py-1 rounded-lg border border-slate-700/60">
          फ़ील्ड <span className="text-emerald-400 font-bold">{fieldProgress?.currentFieldIndex}</span> / {fieldProgress?.totalFieldsInStep} · चरण <span className="text-sky-400 font-bold">{fieldProgress?.currentStep}</span> / {fieldProgress?.totalSteps}
          {fieldProgress?.stepTitle_hi && (
            <span className="text-slate-400 ml-1.5 hidden md:inline">({fieldProgress.stepTitle_hi})</span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="py-4 sm:py-5 space-y-3.5">
        {currentFieldLabel_hi && (
          <div className="text-[11px] uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentFieldLabel_hi}</span>
          </div>
        )}

        {/* Question in Large Subtitle Font */}
        <h2 className="text-lg sm:text-xl font-extrabold text-white leading-relaxed tracking-tight">
          {currentQuestion_hi || 'कृपया अपनी जानकारी बोलें...'}
        </h2>

        {/* Live Audio Visualizer + Subtitles */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {isListening ? (
              <div className="relative flex items-center justify-center w-7 h-7 shrink-0">
                <span className="absolute w-6 h-6 rounded-full bg-rose-500/30 animate-ping" />
                <Mic className="w-4 h-4 text-rose-400" />
              </div>
            ) : isSpeaking ? (
              <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4 text-indigo-400" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              </div>
            )}

            <div className="flex-1">
              {liveCaption ? (
                <p className="text-emerald-300 font-semibold italic text-sm sm:text-base">
                  "{liveCaption}"
                </p>
              ) : (
                <p className="text-slate-400 text-xs sm:text-sm italic">
                  {isSpeaking ? 'सवाल सुना जा रहा है...' : isListening ? 'आपकी आवाज़ सुनी जा रही है, साफ़ बोलें...' : 'अगले सवाल की प्रतीक्षा...'}
                </p>
              )}
            </div>
          </div>

          {/* Harmonic Waveform */}
          <VoiceWaveformVisualizer isListening={isListening} isSpeaking={isSpeaking} className="shrink-0" />
        </div>

        {/* 2.5-Second Auto-Advance Countdown Banner */}
        {pendingAdvance && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/50 shadow-lg flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 text-emerald-400 font-bold">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-emerald-300 font-medium">
                  {pendingAdvance.label_hi || 'दर्ज किया गया'}: <span className="text-white font-bold text-sm underline decoration-emerald-400">{String(pendingAdvance.value)}</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  <strong className="text-emerald-400">{pendingAdvance.countdown}s</strong> में आगे बढ़ेंगे · गलत हो तो <strong>"रुको"</strong> या <strong>"बदलो"</strong> बोलें
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCancelAdvance}
                className="px-3 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-600/50 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-sm"
                title="बदलो (Undo)"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>बदलो (Undo)</span>
              </button>

              <button
                type="button"
                onClick={onConfirmAdvance}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-sm"
                title="तुरंत आगे बढ़ें"
              >
                <span>आगे बढ़ें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Notice (Fallback) */}
        {isConfirming && !pendingAdvance && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>अगर यह सही है तो <strong>"हाँ"</strong> बोलें, गलत है तो <strong>"नहीं"</strong> या <strong>"दोबारा"</strong> बोलें।</span>
          </div>
        )}

        {currentHint_hi && !isConfirming && !pendingAdvance && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>सुझाव: {currentHint_hi}</span>
          </div>
        )}
      </div>

      {/* Footer Control Bar: Three Accessible Fallback Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shadow-sm active:scale-95"
            title="पिछला सवाल (या 'पीछे' बोलें)"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>पीछे</span>
          </button>

          <button
            type="button"
            onClick={onRepeat}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 shadow-sm active:scale-95"
            title="सवाल दोबारा सुनें (या 'दोहराओ' बोलें)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>दोहराएं</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onPause}
          className="px-3.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 border border-rose-700/60 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
          title="आवाज़ मोड रोकें (या 'रोकें' बोलें)"
        >
          <Pause className="w-3.5 h-3.5 text-rose-400" />
          <span>रोकें (Pause)</span>
        </button>
      </div>
    </div>
  );
}
