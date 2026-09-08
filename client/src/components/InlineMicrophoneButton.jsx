// client/src/components/InlineMicrophoneButton.jsx
import React, { useState, useRef } from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { parseHindiNumber } from '../voice/hindiNumberParser.js';
import { matchSelectOption, matchBoolean } from '../voice/fieldMatcher.js';
import { playListenChime, playSuccessChime, playRetryChime } from '../voice/voiceAudioCues.js';

/**
 * Compact inline microphone button for individual form inputs.
 * Allows single-field voice input even when global voice wizard is off.
 */
export default function InlineMicrophoneButton({
  fieldDef = { type: 'text' },
  onValueCaptured,
  className = ''
}) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isListening) {
      stopListening();
      return;
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('ब्राउज़र आवाज़ पहचान का समर्थन नहीं करता। (Voice input not supported in this browser)');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = 'hi-IN';
      recognition.interimResults = false;
      recognition.continuous = false;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
        playListenChime();
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        stopListening();

        let parsedVal = null;
        if (fieldDef.type === 'number') {
          parsedVal = parseHindiNumber(transcript, fieldDef.min, fieldDef.max);
        } else if (fieldDef.type === 'select') {
          parsedVal = matchSelectOption(transcript, fieldDef.options || []);
        } else if (fieldDef.type === 'boolean') {
          parsedVal = matchBoolean(transcript);
        } else {
          // Text
          const clean = transcript.trim();
          if (clean) {
            parsedVal = clean.charAt(0).toUpperCase() + clean.slice(1);
          }
        }

        if (parsedVal !== null && parsedVal !== undefined) {
          playSuccessChime();
          if (onValueCaptured) onValueCaptured(parsedVal);
        } else {
          playRetryChime();
        }
      };

      recognition.onerror = () => {
        stopListening();
        playRetryChime();
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Micro-mic start error:', err);
      setIsListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center justify-center p-1.5 rounded-lg transition-all ${
        isListening
          ? 'bg-rose-500/20 text-rose-500 ring-2 ring-rose-500 animate-pulse'
          : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800'
      } ${className}`}
      title={isListening ? 'सुन रहे हैं... (Listening...)' : 'बोलकर भरें (Speak to fill)'}
    >
      {isListening ? (
        <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
}

