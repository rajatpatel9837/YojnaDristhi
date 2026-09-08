// client/src/voice/dtmfToneGenerator.js

/**
 * Web Audio API DTMF (Dual-Tone Multi-Frequency) Keypad Synthesizer
 * Generates true telephone dual-frequency tones and authentic ringing cadence.
 */

const DTMF_FREQUENCIES = {
  '1': [697, 1209],
  '2': [697, 1336],
  '3': [697, 1477],
  '4': [770, 1209],
  '5': [770, 1336],
  '6': [770, 1477],
  '7': [852, 1209],
  '8': [852, 1336],
  '9': [852, 1477],
  '*': [941, 1209],
  '0': [941, 1336],
  '#': [941, 1477]
};

let audioCtx = null;
let ringInterval = null;
let ringOscillators = [];

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play standard DTMF Dual-Frequency tone for a pressed telephone key
 * @param {string} key - '0'-'9', '*', '#'
 * @param {number} durationMs - Duration in milliseconds (default: 160ms)
 */
export function playDtmfTone(key, durationMs = 150) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const freqs = DTMF_FREQUENCIES[String(key)];
  if (!freqs) return;

  const [lowFreq, highFreq] = freqs;
  const now = ctx.currentTime;
  const durationSec = durationMs / 1000;

  // Master Gain for smooth envelope (prevents clicking)
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, now);
  masterGain.gain.linearRampToValueAtTime(0.18, now + 0.01);
  masterGain.gain.setValueAtTime(0.18, now + durationSec - 0.02);
  masterGain.gain.linearRampToValueAtTime(0.001, now + durationSec);
  masterGain.connect(ctx.destination);

  // Low frequency oscillator
  const oscLow = ctx.createOscillator();
  oscLow.type = 'sine';
  oscLow.frequency.setValueAtTime(lowFreq, now);
  oscLow.connect(masterGain);

  // High frequency oscillator
  const oscHigh = ctx.createOscillator();
  oscHigh.type = 'sine';
  oscHigh.frequency.setValueAtTime(highFreq, now);
  oscHigh.connect(masterGain);

  oscLow.start(now);
  oscHigh.start(now);

  oscLow.stop(now + durationSec);
  oscHigh.stop(now + durationSec);
}

/**
 * Starts realistic incoming phone call ringtone cadence (400Hz + 450Hz tones)
 */
export function startRingtone() {
  stopRingtone();
  const ctx = getAudioContext();
  if (!ctx) return;

  const playRingBurst = () => {
    const now = ctx.currentTime;
    const burstDuration = 1.6; // Ring ring duration

    const ringGain = ctx.createGain();
    ringGain.gain.setValueAtTime(0.001, now);
    ringGain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    ringGain.gain.setValueAtTime(0.12, now + burstDuration - 0.05);
    ringGain.gain.linearRampToValueAtTime(0.001, now + burstDuration);
    ringGain.connect(ctx.destination);

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(400, now);
    osc1.connect(ringGain);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(450, now);
    osc2.connect(ringGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + burstDuration);
    osc2.stop(now + burstDuration);

    ringOscillators = [osc1, osc2];
  };

  playRingBurst();
  ringInterval = setInterval(playRingBurst, 3200); // Standard Indian/UK ring cadence
}

/**
 * Stops any active ringtone playback
 */
export function stopRingtone() {
  if (ringInterval) {
    clearInterval(ringInterval);
    ringInterval = null;
  }
  ringOscillators.forEach(osc => {
    try {
      osc.stop();
    } catch (e) {
      // already stopped
    }
  });
  ringOscillators = [];
}
