import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Landmark, Building2, Layers, CheckCircle2 } from 'lucide-react';

/**
 * High-Speed Upward Rolling Digit Column
 * 60+ digit reel — spins fast for ~5s then dramatically decelerates into target.
 * Physics easing: cubic-bezier(0.05, 0.9, 0.25, 1) — fires fast, brakes hard at end.
 */
function DigitReelColumn({ targetDigit, isStarted, duration = 5600, delay = 0, columnIndex = 0, isSpinning = false }) {
  // Long deterministic upward sequences (60+ digits) ending precisely on targetDigit
  const strip = useMemo(() => {
    const sequences = [
      [0,7,3,9,2,8,4,1,6,0,5,2,9,3,7,1,8,4,0,6,2,9,5,3,8,1,7,4,0,6,9,2,5,8,3,1,7,4,9,0,6,3,8,2,5,1,7,0,9,4,6,2,8,3,5,1,0,7,4,9],
      [0,4,8,1,7,3,9,2,6,0,5,2,8,4,9,3,7,1,5,0,8,6,2,9,4,1,7,3,8,0,5,9,2,6,4,1,7,3,0,8,5,9,2,6,3,1,7,4,0,8,5,2,9,6,3,1,7,4,8,0],
      [0,9,2,6,1,8,4,0,7,3,9,5,1,6,2,8,0,4,7,3,1,9,6,2,5,8,3,0,7,4,1,9,6,3,8,2,5,0,7,4,9,1,6,3,8,2,0,5,7,4,9,1,6,3,2,8,0,5,7,4],
      [0,3,7,2,8,4,9,1,5,0,6,2,7,3,8,4,9,1,5,0,4,8,2,6,3,9,1,7,5,0,4,8,3,6,2,9,1,7,5,0,3,8,2,6,4,9,1,7,5,0,3,8,2,6,4,9,1,7,5,0]
    ];
    const seq = sequences[columnIndex % sequences.length];
    return [...seq, parseInt(targetDigit, 10) || 0];
  }, [targetDigit, columnIndex]);

  const targetOffsetPercent = ((strip.length - 1) / strip.length) * 100;

  return (
    <span className="relative h-[1.2em] overflow-hidden inline-flex flex-col select-none text-center align-middle">
      <span
        className="flex flex-col items-center will-change-transform"
        style={{
          transform: isStarted ? `translateY(-${targetOffsetPercent}%)` : 'translateY(0%)',
          // Fast initial rush, then hard dramatic brake at the end
          transition: `transform ${duration}ms cubic-bezier(0.05, 0.9, 0.25, 1) ${delay}ms`,
          filter: isSpinning ? 'blur(0.4px)' : 'none',
        }}
      >
        {strip.map((d, idx) => (
          <span
            key={idx}
            className="h-[1.2em] flex items-center justify-center font-black tabular-nums leading-none shrink-0 px-[0.04em]"
            style={{ height: '1.2em' }}
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * Upward Odometer Counter:
 * Orchestrates multi-digit high-speed upward roll with staggered brakes
 * and an authentic spring pop on the '+' suffix.
 */
function UpwardOdometerCounter({ targetNumber, suffix = '+', cardStartDelay = 0, onFinished }) {
  const [isStarted, setIsStarted] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const digits = useMemo(() => String(targetNumber).split(''), [targetNumber]);
  const onFinishedRef = useRef(onFinished);
  onFinishedRef.current = onFinished;

  useEffect(() => {
    // Phase 1: Short pause then launch high-speed upward rush
    const startTimer = setTimeout(() => {
      setIsStarted(true);
      setIsSpinning(true);
    }, cardStartDelay + 60);

    // Total duration: 6 seconds of animation with stagger per digit
    // Base 5800ms + extra per digit column so last digit brakes last
    const totalDuration = 5800 + (digits.length - 1) * 120;

    // Phase 2: Stop motion blur ~400ms before lock-in
    const blurTimer = setTimeout(() => {
      setIsSpinning(false);
    }, cardStartDelay + totalDuration - 400);

    // Phase 3: Lock-in and spring-pop suffix '+'
    const finishTimer = setTimeout(() => {
      setIsFinished(true);
      if (onFinishedRef.current) onFinishedRef.current();
    }, cardStartDelay + totalDuration);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(blurTimer);
      clearTimeout(finishTimer);
    };
  }, [targetNumber, cardStartDelay, digits.length]);

  return (
    <span className="inline-flex items-center font-black text-lg sm:text-2xl text-[#173B57] leading-none tracking-tight">
      <span className="inline-flex items-center">
        {digits.map((digit, idx) => (
          <DigitReelColumn
            key={`${targetNumber}-${idx}`}
            targetDigit={digit}
            isStarted={isStarted}
            isSpinning={isSpinning}
            duration={5600 + idx * 120}
            delay={idx * 60}
            columnIndex={idx}
          />
        ))}
      </span>
      {suffix && (
        <span
          className={`font-black text-[#0F766E] transition-all duration-300 transform inline-block ml-0.5 ${
            isFinished
              ? 'scale-100 opacity-100 translate-y-0 text-emerald-600'
              : 'scale-90 opacity-70 translate-y-0.5'
          }`}
        >
          {suffix}
        </span>
      )}
    </span>
  );
}

export default function SchemeStatsSection() {
  const { t } = useLanguage();
  
  // Card finish / highlight state for the professional lock-in pulse
  const [cardPulse, setCardPulse] = useState({ 1: false, 2: false, 3: false, 4: false });
  const [replayCount, setReplayCount] = useState(0);

  const handleFinish = React.useCallback((cardNum) => {
    setCardPulse((prev) => ({ ...prev, [cardNum]: true }));
    setTimeout(() => {
      setCardPulse((prev) => ({ ...prev, [cardNum]: false }));
    }, 600);
  }, []);

  const handleCardClick = () => {
    // Replay animation on click/touch for interactive delight
    setReplayCount((c) => c + 1);
  };

  return (
    <div className="w-full">
      {/* 4 Balanced Cards Grid without redundant headers, sleek & compact */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3.5" key={replayCount}>
        
        {/* Card 1: Total Schemes (Stops at 1500+) */}
        <div
          onClick={handleCardClick}
          title="Click to replay animation"
          className={`ys-card p-2.5 sm:p-3 bg-white border rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-3 shadow-2xs hover:border-[#0F766E]/50 hover:shadow-xs transition-all relative overflow-hidden cursor-pointer group ${
            cardPulse[1] ? 'border-emerald-400 bg-emerald-50/20 shadow-xs' : 'border-[#E2E8F0]'
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center shrink-0 border border-[#CCFBF1] group-hover:scale-105 transition-transform">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F766E]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <UpwardOdometerCounter
                targetNumber={1500}
                suffix="+"
                cardStartDelay={50}
                onFinished={() => handleFinish(1)}
              />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Live verified"></span>
            </div>
            <p className="text-xs font-bold text-slate-700 leading-tight truncate mt-0.5">
              {t('stats_total_schemes', 'Total schemes available')}
            </p>
            <p className="text-[10px] text-slate-500 hidden sm:block truncate mt-0.5">
              {t('stats_total_caption', 'Verified & active pan-India')}
            </p>
          </div>
        </div>

        {/* Card 2: Central Schemes (Stops at 1200+) */}
        <div
          onClick={handleCardClick}
          title="Click to replay animation"
          className={`ys-card p-2.5 sm:p-3 bg-white border rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-3 shadow-2xs hover:border-[#0F766E]/50 hover:shadow-xs transition-all relative overflow-hidden cursor-pointer group ${
            cardPulse[2] ? 'border-emerald-400 bg-emerald-50/20 shadow-xs' : 'border-[#E2E8F0]'
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center shrink-0 border border-[#CCFBF1] group-hover:scale-105 transition-transform">
            <Landmark className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F766E]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <UpwardOdometerCounter
                targetNumber={1200}
                suffix="+"
                cardStartDelay={120}
                onFinished={() => handleFinish(2)}
              />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Live verified"></span>
            </div>
            <p className="text-xs font-bold text-slate-700 leading-tight truncate mt-0.5">
              {t('stats_central_schemes', 'Central Government schemes')}
            </p>
            <p className="text-[10px] text-slate-500 hidden sm:block truncate mt-0.5">
              {t('stats_central_caption', 'National ministry schemes')}
            </p>
          </div>
        </div>

        {/* Card 3: State / UT Schemes (Stops at 234+) */}
        <div
          onClick={handleCardClick}
          title="Click to replay animation"
          className={`ys-card p-2.5 sm:p-3 bg-white border rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-3 shadow-2xs hover:border-[#0F766E]/50 hover:shadow-xs transition-all relative overflow-hidden cursor-pointer group ${
            cardPulse[3] ? 'border-emerald-400 bg-emerald-50/20 shadow-xs' : 'border-[#E2E8F0]'
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center shrink-0 border border-[#CCFBF1] group-hover:scale-105 transition-transform">
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F766E]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <UpwardOdometerCounter
                targetNumber={234}
                suffix="+"
                cardStartDelay={190}
                onFinished={() => handleFinish(3)}
              />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Live verified"></span>
            </div>
            <p className="text-xs font-bold text-slate-700 leading-tight truncate mt-0.5">
              {t('stats_state_schemes', 'State / UT schemes')}
            </p>
            <p className="text-[10px] text-slate-500 hidden sm:block truncate mt-0.5">
              {t('stats_state_caption', 'Regional state benefits')}
            </p>
          </div>
        </div>

        {/* Card 4: Key Sectors / Benefits (Stops at 200+) */}
        <div
          onClick={handleCardClick}
          title="Click to replay animation"
          className={`ys-card p-2.5 sm:p-3 bg-white border rounded-xl sm:rounded-2xl flex items-center gap-2.5 sm:gap-3 shadow-2xs hover:border-[#0F766E]/50 hover:shadow-xs transition-all relative overflow-hidden cursor-pointer group ${
            cardPulse[4] ? 'border-emerald-400 bg-emerald-50/20 shadow-xs' : 'border-[#E2E8F0]'
          }`}
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center shrink-0 border border-[#CCFBF1] group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F766E]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <UpwardOdometerCounter
                targetNumber={200}
                suffix="+"
                cardStartDelay={260}
                onFinished={() => handleFinish(4)}
              />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Live verified"></span>
            </div>
            <p className="text-xs font-bold text-slate-700 leading-tight truncate mt-0.5">
              {t('stats_categories', 'Key Sectors')}
            </p>
            <p className="text-[10px] text-slate-500 hidden sm:block truncate mt-0.5">
              {t('stats_categories_caption', 'Financial, Agri, Education & MSME')}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
