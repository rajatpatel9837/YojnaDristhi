/**
 * useVoiceWizard.js
 * State machine engine hook for "बोलकर भरें" (Hindi Voice-Only Wizard).
 * Manages question-by-question spoken interaction, TTS, STT, field parsing, confirmations,
 * step auto-advancement, and final review submission.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  WIZARD_VOICE_SCHEMA,
  YES_WORDS_HI,
  NO_WORDS_HI,
  STOP_WORDS_HI,
  REPEAT_WORDS_HI,
  BACK_WORDS_HI,
  SKIP_WORDS_HI,
  HELP_WORDS_HI
} from './wizardVoiceSchema.js';
import { parseHindiNumber } from './hindiNumberParser.js';
import {
  matchSelectOption,
  matchBoolean,
  matchMultiSelect,
  isStopPhrase,
  isRepeatPhrase,
  isBackPhrase,
  isSkipPhrase,
  isHelpPhrase,
  extractMultiFields
} from './fieldMatcher.js';
import {
  playListenChime,
  playSuccessChime,
  playRetryChime
} from './voiceAudioCues.js';

export function useVoiceWizard({
  formData,
  setFormData, // handleInputChange(key, value)
  currentStep,
  setCurrentStep,
  onAnalyze
}) {
  const [isVoiceModeOn, setIsVoiceModeOn] = useState(false);
  const [sessionState, setSessionState] = useState('idle'); // 'idle' | 'speaking' | 'listening' | 'processing' | 'confirming' | 'error_retry'
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [liveCaption, setLiveCaption] = useState('');
  const [lastError, setLastError] = useState(null);
  const [pendingValue, setPendingValue] = useState(null);
  const [pendingAdvance, setPendingAdvance] = useState(null); // { key, label_hi, value, countdown }
  const [isUnsupported, setIsUnsupported] = useState(false);
  const [step6SelectedDocs, setStep6SelectedDocs] = useState([]);

  // Refs to avoid stale closures in event handlers
  const isVoiceModeOnRef = useRef(false);
  const sessionStateRef = useRef('idle');
  const currentStepRef = useRef(currentStep);
  const currentFieldIndexRef = useRef(0);
  const attemptsRef = useRef({}); // { [fieldKey]: number }
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const advanceTimerRef = useRef(null);
  const advanceIntervalRef = useRef(null);
  const formDataRef = useRef(formData);
  const pendingValueRef = useRef(null);
  const pendingAdvanceRef = useRef(null);

  // Stable callback refs to prevent TDZ & circular dependency issues
  const advanceToNextFieldRef = useRef(null);
  const askCurrentFieldRef = useRef(null);
  const cancelAutoAdvanceRef = useRef(null);
  const confirmAutoAdvanceRef = useRef(null);
  const startAutoAdvanceRef = useRef(null);
  const runStep7ReviewRef = useRef(null);
  const runStep6MultiselectRef = useRef(null);
  const handleFieldTranscriptRef = useRef(null);
  const goToPreviousFieldRef = useRef(null);

  // Sync refs
  useEffect(() => {
    isVoiceModeOnRef.current = isVoiceModeOn;
  }, [isVoiceModeOn]);

  useEffect(() => {
    sessionStateRef.current = sessionState;
  }, [sessionState]);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    currentFieldIndexRef.current = currentFieldIndex;
  }, [currentFieldIndex]);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    pendingValueRef.current = pendingValue;
  }, [pendingValue]);

  useEffect(() => {
    pendingAdvanceRef.current = pendingAdvance;
  }, [pendingAdvance]);

  // Current step schema & current field
  const currentStepObj = WIZARD_VOICE_SCHEMA.find(s => s.step === currentStep) || WIZARD_VOICE_SCHEMA[0];
  const currentFields = currentStepObj.fields || [];
  const currentField = currentFields[currentFieldIndex] || null;

  // ─── Text-To-Speech (TTS) Priority Chain ───────────────────────────
  const speakHindi = useCallback((text) => {
    return new Promise((resolve) => {
      if (!text) {
        resolve();
        return;
      }

      // Stop any existing audio or speech synthesis
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      let resolved = false;
      const safeResolve = () => {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      };

      // 1. Try backend Sarvam TTS
      const cleanText = text.replace(/[*_#`~[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
      
      const ttsController = new AbortController();
      const timeoutId = setTimeout(() => {
        ttsController.abort();
      }, 2800);

      axios.post('/api/voice/tts', { text: cleanText, language: 'hi-IN' }, { signal: ttsController.signal })
        .then((res) => {
          clearTimeout(timeoutId);
          if (res.data?.success && res.data?.data?.audioBase64) {
            const audio = new Audio(`data:audio/wav;base64,${res.data.data.audioBase64}`);
            audioRef.current = audio;
            audio.onended = () => {
              audioRef.current = null;
              safeResolve();
            };
            audio.onerror = () => {
              fallbackToWebSpeech(cleanText, safeResolve);
            };
            audio.play().catch(() => {
              fallbackToWebSpeech(cleanText, safeResolve);
            });
          } else {
            fallbackToWebSpeech(cleanText, safeResolve);
          }
        })
        .catch(() => {
          clearTimeout(timeoutId);
          fallbackToWebSpeech(cleanText, safeResolve);
        });
    });
  }, []);

  const fallbackToWebSpeech = (text, callback) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.92;
      utterance.onend = () => callback();
      utterance.onerror = () => callback();
      window.speechSynthesis.speak(utterance);
    } else {
      callback();
    }
  };

  // ─── Speech Recognition (STT) ──────────────────────────────────────
  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
  }, []);

  // ─── Step 7 Review Flow ────────────────────────────────────────────
  const runStep7Review = useCallback(async () => {
    setSessionState('speaking');
    const d = formDataRef.current;
    const summaryText = `आपकी प्रोफ़ाइल: नाम ${d.fullName || 'दर्ज नहीं'}, सामाजिक श्रेणी ${d.category || 'सामान्य'}, स्थान ${d.district || ''} ${d.state || ''}, व्यवसाय ${d.businessName || 'नया व्यवसाय'}, और आवश्यक सहायता राशि ${Number(d.fundingAmount || 0).toLocaleString('en-IN')} रुपये है। क्या यह सारी जानकारी सही है? हाँ बोलकर आगे बढ़ें, या नहीं बोलें।`;

    await speakHindi(summaryText);

    if (!isVoiceModeOnRef.current) return;

    setSessionState('listening');
    setLiveCaption('');

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    const recognition = new SpeechRec();
    recognition.lang = 'hi-IN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onresult = async (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          const finalTranscript = e.results[i][0].transcript;
          setLiveCaption(finalTranscript);
          stopListening();
          setSessionState('processing');

          const isAffirmative = matchBoolean(finalTranscript);
          if (isAffirmative === true) {
            await speakHindi('बहुत बढ़िया! अब आपके लिए उपयुक्त सरकारी योजनाओं की जाँच की जा रही है।');
            setIsVoiceModeOn(false);
            if (onAnalyze) onAnalyze();
          } else if (isAffirmative === false) {
            await speakHindi('ठीक है। आप जिस भाग को बदलना चाहते हैं, उस पर क्लिक करें या स्क्रीन पर बदलें। आवाज़ मोड को रोक दिया गया है।');
            setIsVoiceModeOn(false);
          } else if (isRepeatPhrase(finalTranscript)) {
            runStep7ReviewRef.current?.();
          } else {
            await speakHindi('कृपया केवल हाँ या नहीं में बताएं।');
            runStep7ReviewRef.current?.();
          }
          return;
        } else {
          interim += e.results[i][0].transcript;
        }
      }
      setLiveCaption(interim);
    };

    recognition.onerror = () => {
      stopListening();
      if (isVoiceModeOnRef.current) {
        runStep7ReviewRef.current?.();
      }
    };

    recognition.start();
  }, [speakHindi, stopListening, onAnalyze]);
  runStep7ReviewRef.current = runStep7Review;

  // ─── Auto-Advance Timers & Undo Engine ─────────────────────────────
  const clearAdvanceTimers = useCallback(() => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    if (advanceIntervalRef.current) {
      clearInterval(advanceIntervalRef.current);
      advanceIntervalRef.current = null;
    }
  }, []);

  const cancelAutoAdvance = useCallback(async () => {
    clearAdvanceTimers();
    stopListening();
    const currentPending = pendingAdvanceRef.current;
    if (currentPending && setFormData) {
      setFormData(currentPending.key, '');
    }
    playRetryChime();
    setPendingAdvance(null);
    setPendingValue(null);
    await speakHindi('ठीक है, दोबारा बताएं।');
    askCurrentFieldRef.current?.();
  }, [clearAdvanceTimers, stopListening, setFormData, speakHindi]);
  cancelAutoAdvanceRef.current = cancelAutoAdvance;

  const confirmAutoAdvance = useCallback(() => {
    clearAdvanceTimers();
    stopListening();
    setPendingAdvance(null);
    setPendingValue(null);
    advanceToNextFieldRef.current?.();
  }, [clearAdvanceTimers, stopListening]);
  confirmAutoAdvanceRef.current = confirmAutoAdvance;

  const startAutoAdvance = useCallback((candidateVal, field) => {
    clearAdvanceTimers();
    stopListening();

    // 1. Immediately write to formData & play earcon
    if (setFormData) {
      setFormData(field.key, candidateVal);
    }
    playSuccessChime();
    attemptsRef.current[field.key] = 0;
    setPendingValue(candidateVal);

    // 2. Set auto_advancing state with 2.5s countdown
    setSessionState('auto_advancing');
    let timeLeft = 2.5;
    setPendingAdvance({
      key: field.key,
      label_hi: field.label_hi,
      value: candidateVal,
      countdown: timeLeft
    });

    advanceIntervalRef.current = setInterval(() => {
      timeLeft = Math.max(0, +(timeLeft - 0.1).toFixed(1));
      setPendingAdvance(prev => (prev ? { ...prev, countdown: timeLeft } : null));
    }, 100);

    advanceTimerRef.current = setTimeout(() => {
      clearAdvanceTimers();
      stopListening();
      setPendingAdvance(null);
      setPendingValue(null);
      advanceToNextFieldRef.current?.();
    }, 2500);

    // 3. Keep speech listener active for verbal "रुको" / "बदलो" / "आगे"
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.lang = 'hi-IN';
        recognition.interimResults = false;
        recognition.continuous = false;
        recognitionRef.current = recognition;

        recognition.onresult = async (e) => {
          const transcript = e.results[0][0].transcript.toLowerCase();
          if (/\b(?:रुको|रोक|बदलो|गलत|वापस|undo|nahi|नहीं|गलत है)\b/i.test(transcript) || isStopPhrase(transcript)) {
            clearAdvanceTimers();
            stopListening();
            if (setFormData) setFormData(field.key, '');
            playRetryChime();
            setPendingAdvance(null);
            setPendingValue(null);
            await speakHindi('ठीक है, दोबारा बताएं।');
            askCurrentFieldRef.current?.();
          } else if (/\b(?:आगे|हाँ|नेक्स्ट|सही|ठीक है|yes|बढ़ो|बढ़ो)\b/i.test(transcript)) {
            clearAdvanceTimers();
            stopListening();
            setPendingAdvance(null);
            setPendingValue(null);
            advanceToNextFieldRef.current?.();
          }
        };

        recognition.onerror = () => {
          // Soft ignore errors during auto-advance grace period
        };

        recognition.start();
      } catch (err) {
        // Fallback: timer will auto-advance smoothly
      }
    }
  }, [clearAdvanceTimers, stopListening, setFormData, speakHindi]);
  startAutoAdvanceRef.current = startAutoAdvance;

  // Backward compatibility alias for Step 6 multiselect finish
  const runConfirmationPhase = useCallback((candidateVal, field) => {
    startAutoAdvanceRef.current?.(candidateVal, field);
  }, []);

  // ─── Advance to Next Field / Step ──────────────────────────────────
  const advanceToNextField = useCallback(async () => {
    const stepIdx = currentStepRef.current;
    const fieldIdx = currentFieldIndexRef.current;
    const stepObj = WIZARD_VOICE_SCHEMA.find(s => s.step === stepIdx);
    const fields = stepObj ? stepObj.fields : [];

    if (fieldIdx + 1 < fields.length) {
      // Move to next field in same step
      setCurrentFieldIndex(fieldIdx + 1);
    } else {
      // Step complete! Advance step
      if (stepIdx < 7) {
        const nextStepNum = stepIdx + 1;
        const nextStepObj = WIZARD_VOICE_SCHEMA.find(s => s.step === nextStepNum);
        if (nextStepObj?.stepTransition_hi) {
          setSessionState('speaking');
          await speakHindi(nextStepObj.stepTransition_hi);
        }
        setCurrentStep(nextStepNum);
        setCurrentFieldIndex(0);
      } else {
        // Step 7 Review
        runStep7ReviewRef.current?.();
      }
    }
  }, [setCurrentStep, speakHindi]);
  advanceToNextFieldRef.current = advanceToNextField;

  // ─── Move to Previous Field ────────────────────────────────────────
  const goToPreviousField = useCallback(async () => {
    stopListening();
    const stepIdx = currentStepRef.current;
    const fieldIdx = currentFieldIndexRef.current;

    if (fieldIdx > 0) {
      setCurrentFieldIndex(fieldIdx - 1);
    } else if (stepIdx > 1) {
      const prevStepNum = stepIdx - 1;
      const prevStepObj = WIZARD_VOICE_SCHEMA.find(s => s.step === prevStepNum);
      const prevFields = prevStepObj ? prevStepObj.fields : [];
      setCurrentStep(prevStepNum);
      setCurrentFieldIndex(Math.max(0, prevFields.length - 1));
    }
  }, [stopListening, setCurrentStep]);
  goToPreviousFieldRef.current = goToPreviousField;

  // ─── Core Question-By-Question Driver ──────────────────────────────
  const askCurrentField = useCallback(async () => {
    if (!isVoiceModeOnRef.current) return;

    const stepIdx = currentStepRef.current;
    const fieldIdx = currentFieldIndexRef.current;

    // Step 7 is handled by review synthesizer
    if (stepIdx === 7) {
      runStep7ReviewRef.current?.();
      return;
    }

    const stepObj = WIZARD_VOICE_SCHEMA.find(s => s.step === stepIdx);
    const fields = stepObj ? stepObj.fields : [];
    const field = fields[fieldIdx];

    if (!field) {
      advanceToNextFieldRef.current?.();
      return;
    }

    const key = field.key;
    const currentAttempts = attemptsRef.current[key] || 0;

    // Build spoken prompt: add hint if this is a retry
    let promptText = field.question_hi;
    if (currentAttempts >= 1 && field.hint_hi) {
      promptText += ` (${field.hint_hi})`;
    }

    setSessionState('speaking');
    setLiveCaption('');
    await speakHindi(promptText);

    if (!isVoiceModeOnRef.current) return;

    // ── Special handling for Step 6 Multiselect ──────────────────────
    if (field.type === 'multiselect') {
      runStep6MultiselectRef.current?.(field);
      return;
    }

    // Standard single-answer field STT
    setSessionState('listening');
    setLiveCaption('');

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    const recognition = new SpeechRec();
    recognition.lang = 'hi-IN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onresult = async (e) => {
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          const transcript = e.results[i][0].transcript;
          setLiveCaption(transcript);
          stopListening();
          setSessionState('processing');

          await handleFieldTranscriptRef.current?.(transcript, field);
          return;
        } else {
          setLiveCaption(e.results[i][0].transcript);
        }
      }
    };

    recognition.onerror = async (err) => {
      stopListening();
      playRetryChime();
      if (!isVoiceModeOnRef.current) return;

      attemptsRef.current[key] = (attemptsRef.current[key] || 0) + 1;
      if (attemptsRef.current[key] >= 3) {
        await speakHindi('कोई बात नहीं, आप इसे स्क्रीन पर टाइप करके भर सकते हैं।');
        setIsVoiceModeOn(false);
      } else {
        await speakHindi('माफ़ कीजिए, आवाज़ सुनाई नहीं दी। कृपया फिर से बताएं।');
        askCurrentFieldRef.current?.();
      }
    };

    playListenChime();
    recognition.start();
  }, [speakHindi, stopListening]);
  askCurrentFieldRef.current = askCurrentField;

  // ─── Step 6 Multiselect Continuous Flow ────────────────────────────
  const runStep6Multiselect = useCallback(async (field) => {
    setSessionState('listening');
    const accumulatedDocs = new Set(formDataRef.current.documentsAvailable || []);

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    const recognition = new SpeechRec();
    recognition.lang = 'hi-IN';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;

    const resetSilenceTimer = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(async () => {
        stopListening();
        finishStep6();
      }, 8000);
    };

    const finishStep6 = async () => {
      const finalDocs = Array.from(accumulatedDocs);
      if (setFormData) {
        setFormData(field.key, finalDocs);
      }
      runConfirmationPhase(finalDocs, field);
    };

    recognition.onresult = async (e) => {
      resetSilenceTimer();
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        const text = e.results[i][0].transcript;
        setLiveCaption(text);

        if (e.results[i].isFinal) {
          // Check stop phrase
          if (isStopPhrase(text)) {
            stopListening();
            finishStep6();
            return;
          }

          // Match documents
          const matched = matchMultiSelect(text, field.options);
          if (matched.length > 0) {
            let newlyAdded = false;
            for (const doc of matched) {
              if (!accumulatedDocs.has(doc)) {
                accumulatedDocs.add(doc);
                newlyAdded = true;
              }
            }
            if (newlyAdded) {
              const latestDoc = matched[matched.length - 1];
              const opt = (field.options || []).find(o => o.value === latestDoc);
              setStep6SelectedDocs(Array.from(accumulatedDocs));
              if (setFormData) {
                setFormData(field.key, Array.from(accumulatedDocs));
              }
              // Quick acknowledgement
              if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(`ठीक है, ${opt?.label_hi || latestDoc} जोड़ दिया।`);
                u.lang = 'hi-IN';
                window.speechSynthesis.speak(u);
              }
            }
          }
        }
      }
    };

    recognition.onerror = () => {
      // Ignore silence or restart
      resetSilenceTimer();
    };

    resetSilenceTimer();
    recognition.start();
  }, [stopListening, setFormData, runConfirmationPhase]);
  runStep6MultiselectRef.current = runStep6Multiselect;

  // ─── Field Transcript Processor ────────────────────────────────────
  const handleFieldTranscript = useCallback(async (transcript, field) => {
    const key = field.key;

    // 1. Global Commands Check
    if (isStopPhrase(transcript)) {
      await speakHindi('आवाज़ मोड रोक दिया गया है। आप कभी भी फिर से शुरू कर सकते हैं।');
      setIsVoiceModeOn(false);
      return;
    }

    if (isRepeatPhrase(transcript)) {
      askCurrentFieldRef.current?.();
      return;
    }

    if (isBackPhrase(transcript)) {
      await speakHindi('पिछले सवाल पर वापस जा रहे हैं।');
      goToPreviousFieldRef.current?.();
      return;
    }

    if (isHelpPhrase(transcript)) {
      await speakHindi('आप साफ़ आवाज़ में जवाब दें। अगर दोबारा सुनना हो तो दोहराओ बोलें, या पीछे बोलें।');
      askCurrentFieldRef.current?.();
      return;
    }

    if (isSkipPhrase(transcript)) {
      if (!field.required) {
        await speakHindi('यह सवाल छोड़ दिया गया है।');
        advanceToNextFieldRef.current?.();
        return;
      } else {
        await speakHindi('यह जानकारी ज़रूरी है, कृपया बताएं।');
        askCurrentFieldRef.current?.();
        return;
      }
    }

    // 2. Multi-Slot Compound Utterance Check across current step's fields
    const multiExtracted = extractMultiFields(transcript, currentFields);
    const multiKeys = Object.keys(multiExtracted);

    if (multiKeys.length >= 2) {
      // Batch fill all captured fields
      for (const [mKey, mVal] of Object.entries(multiExtracted)) {
        if (setFormData) setFormData(mKey, mVal);
        attemptsRef.current[mKey] = 0;
      }
      playSuccessChime();

      // Find the next unfilled field in current step
      const nextUnfilledIdx = currentFields.findIndex(f => {
        return multiExtracted[f.key] === undefined && !formDataRef.current[f.key];
      });

      if (nextUnfilledIdx !== -1) {
        setCurrentFieldIndex(nextUnfilledIdx);
        await speakHindi('बहुत बढ़िया, कई जानकारियां दर्ज कर ली गईं।');
      } else {
        await speakHindi('शानदार, इस भाग की सभी जानकारियां पूरी हो गईं।');
        advanceToNextFieldRef.current?.();
      }
      return;
    }

    // 3. Single-Field Type Parsing
    let parsedValue = multiExtracted[key] !== undefined ? multiExtracted[key] : null;

    if (parsedValue === null) {
      if (field.type === 'text') {
        const clean = transcript.trim();
        if (clean.length > 0) {
          parsedValue = clean.charAt(0).toUpperCase() + clean.slice(1);
        }
      } else if (field.type === 'number') {
        parsedValue = parseHindiNumber(transcript);
        if (parsedValue !== null) {
          if (field.min !== undefined && parsedValue < field.min) parsedValue = null;
          if (field.max !== undefined && parsedValue > field.max) parsedValue = null;
        }
      } else if (field.type === 'select') {
        parsedValue = matchSelectOption(transcript, field.options);
      } else if (field.type === 'boolean') {
        parsedValue = matchBoolean(transcript);
      }
    }

    // 4. Fallback to Server NLU if local parse returned null and attempts >= 1
    if (parsedValue === null && (attemptsRef.current[key] || 0) >= 1) {
      try {
        const nluRes = await axios.post('/api/ai/parse-voice-field', {
          transcript,
          field: {
            key: field.key,
            type: field.type,
            min: field.min,
            max: field.max,
            options: (field.options || []).map(o => ({ value: o.value, label_hi: o.label_hi }))
          }
        });
        if (nluRes.data?.success && nluRes.data?.data?.value !== undefined) {
          parsedValue = nluRes.data.data.value;
        }
      } catch (err) {
        console.warn('Server NLU parse error:', err.message);
      }
    }

    // 5. Handle Result (Smart Auto-Advance) or Retry
    if (parsedValue !== null && parsedValue !== undefined) {
      attemptsRef.current[key] = 0;
      startAutoAdvanceRef.current?.(parsedValue, field);
    } else {
      playRetryChime();
      attemptsRef.current[key] = (attemptsRef.current[key] || 0) + 1;
      const count = attemptsRef.current[key];

      if (count >= 3) {
        await speakHindi('कोई बात नहीं, आप इसे स्क्रीन पर भरकर आगे बढ़ सकते हैं।');
        setIsVoiceModeOn(false);
      } else {
        if (field.type === 'number') {
          await speakHindi('माफ़ कीजिए, मुझे संख्या समझ नहीं आई। कृपया केवल संख्या में बताएं, जैसे पचास हज़ार या 28।');
        } else if (field.type === 'select') {
          const choices = (field.options || []).map(o => o.label_hi).join(', ');
          await speakHindi(`माफ़ कीजिए, कृपया दिए गए विकल्पों में से बताएं: ${choices}।`);
        } else if (field.type === 'boolean') {
          await speakHindi('कृपया केवल हाँ या नहीं में उत्तर दें।');
        } else {
          await speakHindi('कृपया एक बार फिर से साफ़ आवाज़ में बताएं।');
        }
        askCurrentFieldRef.current?.();
      }
    }
  }, [speakHindi, currentFields, setFormData]);
  handleFieldTranscriptRef.current = handleFieldTranscript;

  // ─── Watch currentField or currentStep Changes & Smooth Auto-Scroll ───
  useEffect(() => {
    if (isVoiceModeOn) {
      askCurrentFieldRef.current?.();

      // Smooth auto-scroll and focus active input
      if (currentField?.key) {
        setTimeout(() => {
          const el = document.getElementById(currentField.key) || document.querySelector(`[name="${currentField.key}"]`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            if (el.focus) {
              try { el.focus({ preventScroll: true }); } catch (e) {}
            }
          }
        }, 250);
      }
    }
  }, [currentStep, currentFieldIndex, isVoiceModeOn, currentField?.key]);

  // ─── Toggle Voice Mode ─────────────────────────────────────────────
  const toggleVoiceMode = useCallback(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setIsUnsupported(true);
      alert('आपका ब्राउज़र आवाज़ पहचान का समर्थन नहीं करता। कृपया Chrome या Edge इस्तेमाल करें, या फॉर्म खुद भरें।');
      return;
    }

    if (isVoiceModeOn) {
      // Turn off / pause
      clearAdvanceTimers();
      stopListening();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsVoiceModeOn(false);
      setSessionState('idle');
      setLiveCaption('');
      setPendingAdvance(null);
    } else {
      // Turn on
      setIsVoiceModeOn(true);
      setLastError(null);
    }
  }, [isVoiceModeOn, stopListening, clearAdvanceTimers]);

  const pauseVoiceMode = useCallback(() => {
    clearAdvanceTimers();
    stopListening();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsVoiceModeOn(false);
    setSessionState('idle');
    setPendingAdvance(null);
  }, [stopListening, clearAdvanceTimers]);

  const resumeVoiceMode = useCallback(() => {
    setIsVoiceModeOn(true);
  }, []);

  const repeatCurrentQuestion = useCallback(() => {
    clearAdvanceTimers();
    setPendingAdvance(null);
    askCurrentFieldRef.current?.();
  }, [clearAdvanceTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAdvanceTimers();
      stopListening();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stopListening, clearAdvanceTimers]);

  // Progress metadata
  const totalFieldsInStep = currentFields.length;
  const fieldProgress = {
    currentFieldIndex: currentFieldIndex + 1,
    totalFieldsInStep: Math.max(1, totalFieldsInStep),
    currentStep,
    totalSteps: 7,
    stepTitle_hi: currentStepObj.title_hi
  };

  return {
    isVoiceModeOn,
    toggleVoiceMode,
    sessionState,
    currentFieldKey: currentField?.key || null,
    currentFieldLabel_hi: currentField?.label_hi || '',
    currentQuestion_hi: currentStep === 7 ? 'समीक्षा और अंतिम मिलान' : (currentField?.question_hi || ''),
    currentHint_hi: currentField?.hint_hi || '',
    liveCaption,
    lastError,
    pauseVoiceMode,
    resumeVoiceMode,
    repeatCurrentQuestion,
    goToPreviousField,
    fieldProgress,
    isUnsupported,
    step6SelectedDocs,
    pendingAdvance,
    cancelAutoAdvance,
    confirmAutoAdvance,
    isListening: sessionState === 'listening',
    isSpeaking: sessionState === 'speaking'
  };
}

export default useVoiceWizard;
