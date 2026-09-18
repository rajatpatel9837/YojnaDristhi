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
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#14B8A6]/40 bg-[#F0FDFA] p-5 sm:p-6 text-[#173B57] shadow-xs transition-all">

      {/* Top Bar: Live Status & Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#CCFBF1] text-xs">
        <div className="flex items-center gap-2">
          {/* Animated State Pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#CBD5E1] shadow-2xs">
            {isSpeaking && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F766E] animate-pulse" />
                <Volume2 className="w-3.5 h-3.5 text-[#0F766E]" />
                <span className="text-[#0F766E] font-bold">बोल रहे हैं...</span>
              </>
            )}
            {isListening && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <Mic className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span className="text-rose-700 font-bold">सुन रहे हैं... बोलें</span>
              </>
            )}
            {isProcessing && (
              <>
                <Loader2 className="w-3.5 h-3.5 text-[#0369A1] animate-spin" />
                <span className="text-[#0369A1] font-bold">समझ रहे हैं...</span>
              </>
            )}
            {isAutoAdvancing && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E] animate-bounce" />
                <span className="text-[#0F766E] font-bold">सत्यापित · आगे बढ़ रहे हैं</span>
              </>
            )}
            {isConfirming && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                <span className="text-amber-800 font-bold">पुष्टि करें (हाँ या नहीं)</span>
              </>
            )}
            {sessionState === 'idle' && !isAutoAdvancing && (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-slate-600 font-medium">तैयार</span>
              </>
            )}
          </div>

          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            बोलकर भरें 2.0 — Yojna दृष्टि
          </span>
        </div>

        {/* Progress Counter */}
        <div className="text-[11px] font-medium text-slate-600 bg-white px-3 py-1 rounded-lg border border-[#CBD5E1] shadow-2xs">
          फ़ील्ड <span className="text-[#0F766E] font-bold">{fieldProgress?.currentFieldIndex}</span> / {fieldProgress?.totalFieldsInStep} · चरण <span className="text-[#0369A1] font-bold">{fieldProgress?.currentStep}</span> / {fieldProgress?.totalSteps}
          {fieldProgress?.stepTitle_hi && (
            <span className="text-slate-500 ml-1.5 hidden md:inline">({fieldProgress.stepTitle_hi})</span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="py-4 sm:py-5 space-y-3.5">
        {currentFieldLabel_hi && (
          <div className="text-[11px] uppercase tracking-wider font-bold text-[#0F766E] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{currentFieldLabel_hi}</span>
          </div>
        )}

        {/* Question in Large Subtitle Font */}
        <h2 className="text-lg sm:text-xl font-black text-[#173B57] leading-relaxed tracking-tight">
          {currentQuestion_hi || 'कृपया अपनी जानकारी बोलें...'}
        </h2>

        {/* Live Audio Visualizer + Subtitles */}
        <div className="p-3.5 rounded-xl bg-white border border-[#CCFBF1] flex flex-col sm:flex-row items-center justify-between gap-3 text-sm shadow-2xs">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {isListening ? (
              <div className="relative flex items-center justify-center w-7 h-7 shrink-0">
                <span className="absolute w-6 h-6 rounded-full bg-rose-500/20 animate-ping" />
                <Mic className="w-4 h-4 text-rose-600" />
              </div>
            ) : isSpeaking ? (
              <div className="w-7 h-7 rounded-full bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4 text-[#0F766E]" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-slate-500" />
              </div>
            )}

            <div className="flex-1">
              {liveCaption ? (
                <p className="text-[#0F766E] font-bold italic text-sm sm:text-base">
                  "{liveCaption}"
                </p>
              ) : (
                <p className="text-slate-500 text-xs sm:text-sm italic">
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
          <div className="p-4 rounded-xl bg-[#CCFBF1] border border-[#14B8A6]/40 shadow-xs flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white border border-[#14B8A6]/40 flex items-center justify-center shrink-0 text-[#0F766E] font-bold">
                <Check className="w-4 h-4 text-[#0F766E]" />
              </div>
              <div>
                <p className="text-xs text-[#115E59] font-medium">
                  {pendingAdvance.label_hi || 'दर्ज किया गया'}: <span className="text-[#173B57] font-black text-sm underline decoration-[#0F766E]">{String(pendingAdvance.value)}</span>
                </p>
                <p className="text-[11px] text-slate-600">
                  <strong className="text-[#0F766E]">{pendingAdvance.countdown}s</strong> में आगे बढ़ेंगे · गलत हो तो <strong>"रुको"</strong> या <strong>"बदलो"</strong> बोलें
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onCancelAdvance}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-2xs"
                title="बदलो (Undo)"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>बदलो (Undo)</span>
              </button>

              <button
                type="button"
                onClick={onConfirmAdvance}
                className="px-3.5 py-1.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow-2xs"
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
          <div className="p-3 rounded-xl bg-[#FEF3C7] border border-[#F59E0B]/40 text-[#92400E] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span>अगर यह सही है तो <strong>"हाँ"</strong> बोलें, गलत है तो <strong>"नहीं"</strong> या <strong>"दोबारा"</strong> बोलें।</span>
          </div>
        )}

        {currentHint_hi && !isConfirming && !pendingAdvance && (
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>सुझाव: {currentHint_hi}</span>
          </div>
        )}
      </div>

      {/* Footer Control Bar: Accessible Fallback Buttons */}
      <div className="pt-3 border-t border-[#CCFBF1] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-[#173B57] text-xs font-semibold border border-[#CBD5E1] transition flex items-center gap-1.5 shadow-2xs"
            title="पिछला सवाल (या 'पीछे' बोलें)"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>पीछे</span>
          </button>

          <button
            type="button"
            onClick={onRepeat}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-[#173B57] text-xs font-semibold border border-[#CBD5E1] transition flex items-center gap-1.5 shadow-2xs"
            title="सवाल दोबारा सुनें (या 'दोहराओ' बोलें)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>दोहराएं</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onPause}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
          title="आवाज़ मोड रोकें (या 'रोकें' बोलें)"
        >
          <Pause className="w-3.5 h-3.5 text-rose-600" />
          <span>रोकें (Pause)</span>
        </button>
      </div>
    </div>
  );
}
