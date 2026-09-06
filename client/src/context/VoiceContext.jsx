import React, { createContext, useContext, useState, useRef } from 'react';
import axios from 'axios';

const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const audioRef = useRef(null);

  const startListening = (onResultCallback, preferredLang = 'hi-IN') => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome/Edge or type your question.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = preferredLang;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        if (onResultCallback) onResultCallback(text);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  const speakText = async (text) => {
    if (!text) return;
    let clean = text.replace(/[*_#`~[\]()]/g, ' ').replace(/\s+/g, ' ').trim();

    // Auto-detect speech language from text script
    let targetLang = 'en-IN';
    if (/[\u0900-\u097F]/.test(clean)) {
      targetLang = 'hi-IN';
      // If there is Hindi, start from the first Devanagari character so it speaks only Hindi
      const devanagariIndex = clean.search(/[\u0900-\u097F]/);
      if (devanagariIndex > 0) {
        clean = clean.substring(devanagariIndex).trim();
      }
    } else if (/[\u0A00-\u0A7F]/.test(clean)) {
      targetLang = 'pa-IN';
      const paIndex = clean.search(/[\u0A00-\u0A7F]/);
      if (paIndex > 0) {
        clean = clean.substring(paIndex).trim();
      }
    } else if (/[\u0980-\u09FF]/.test(clean)) {
      targetLang = 'bn-IN';
    } else if (/[\u0B80-\u0BFF]/.test(clean)) {
      targetLang = 'ta-IN';
    }

    const textToSpeak = clean.substring(0, 450);

    // 1. Try Sarvam AI high quality audio via backend
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const res = await axios.post('/api/voice/tts', { text: textToSpeak, language: targetLang });
      if (res.data?.success && res.data?.data?.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${res.data.data.audioBase64}`);
        audioRef.current = audio;
        audio.play();
        return;
      }
    } catch (err) {
      // fallback to browser speech synthesis
    }

    // 2. Fallback: Browser Web Speech API
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = targetLang;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <VoiceContext.Provider value={{ isListening, transcript, startListening, speakText }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => useContext(VoiceContext);
