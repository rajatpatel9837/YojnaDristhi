// client/src/components/VoiceWaveformVisualizer.jsx
import React from 'react';

/**
 * Animated soundwave visualizer for YojnaDristhi Voice Mode.
 * Renders pulsating harmonic bars when listening, with graceful resting state.
 */
export default function VoiceWaveformVisualizer({ isListening = false, isSpeaking = false, className = '' }) {
  // 14 bars with varying initial heights and animation delays
  const bars = [
    { height: '35%', delay: '0.05s', duration: '0.9s' },
    { height: '60%', delay: '0.15s', duration: '0.75s' },
    { height: '85%', delay: '0.25s', duration: '0.85s' },
    { height: '45%', delay: '0.10s', duration: '0.7s' },
    { height: '95%', delay: '0.30s', duration: '1.0s' },
    { height: '70%', delay: '0.20s', duration: '0.8s' },
    { height: '100%', delay: '0.35s', duration: '0.65s' },
    { height: '80%', delay: '0.18s', duration: '0.92s' },
    { height: '60%', delay: '0.28s', duration: '0.78s' },
    { height: '90%', delay: '0.12s', duration: '0.88s' },
    { height: '50%', delay: '0.22s', duration: '0.72s' },
    { height: '75%', delay: '0.32s', duration: '0.82s' },
    { height: '40%', delay: '0.14s', duration: '0.74s' },
    { height: '25%', delay: '0.08s', duration: '0.95s' },
  ];

  return (
    <div className={`flex items-center justify-center gap-1.5 h-10 px-3 py-1 ${className}`} aria-hidden="true">
      <style>{`
        @keyframes soundwave-pulse {
          0%, 100% {
            transform: scaleY(0.2);
            opacity: 0.5;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }
        .soundwave-bar-active {
          animation-name: soundwave-pulse;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          transform-origin: center;
        }
      `}</style>

      {bars.map((bar, idx) => {
        const active = isListening || isSpeaking;
        const bgGradient = isListening
          ? 'bg-gradient-to-t from-emerald-500 via-teal-400 to-sky-400'
          : isSpeaking
          ? 'bg-gradient-to-t from-sky-500 via-indigo-400 to-purple-400'
          : 'bg-emerald-300/40';

        return (
          <div
            key={idx}
            className={`w-1 rounded-full transition-all duration-300 ${bgGradient} ${
              active ? 'soundwave-bar-active' : ''
            }`}
            style={{
              height: active ? bar.height : '20%',
              animationDuration: active ? bar.duration : '0s',
              animationDelay: active ? bar.delay : '0s',
            }}
          />
        );
      })}
    </div>
  );
}
