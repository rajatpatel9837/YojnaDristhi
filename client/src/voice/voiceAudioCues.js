// client/src/voice/voiceAudioCues.js
// Native Web Audio API earcons for YojnaDristhi Voice Experience
// Zero external dependencies; creates soft, non-intrusive chimes.

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtxClass) return null;

  if (!audioCtx) {
    audioCtx = new AudioCtxClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play an ascending 2-tone pleasant chime when microphone opens (C5 -> E5).
 */
export function playListenChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency ramp: 523Hz (C5) to 659Hz (E5)
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);

    // Gain envelope: fast attack, smooth exponential decay
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.24);
  } catch (err) {
    console.debug('Audio chime skipped:', err);
  }
}

/**
 * Play a bright confirmation chime when field is recognized and captured (D5 -> A5).
 */
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    // Two-tone bright ping: 587.33Hz (D5) to 880Hz (A5)
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.setValueAtTime(880.0, now + 0.08);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.27);
  } catch (err) {
    console.debug('Audio chime skipped:', err);
  }
}

/**
 * Play a gentle low descending tone when input was not recognized (A4 -> F#4).
 */
export function playRetryChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Subtle low descending tone: 440Hz (A4) to 369.99Hz (F#4)
    osc.frequency.setValueAtTime(440.0, now);
    osc.frequency.exponentialRampToValueAtTime(369.99, now + 0.16);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.24);
  } catch (err) {
    console.debug('Audio chime skipped:', err);
  }
}

export default {
  playListenChime,
  playSuccessChime,
  playRetryChime,
};

