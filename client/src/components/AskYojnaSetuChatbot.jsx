import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Bot, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Languages, 
  MessageSquare,
  RefreshCw,
  User,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export default function AskYojnaSetuChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('auto'); // 'auto', 'hi', 'en', 'pa'
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initial welcome message based on language
  useEffect(() => {
    let welcomeText = 'नमस्ते! मैं **योजना दृष्टि** AI सहायक हूँ। आप मुझसे किसी भी भाषा (हिंदी, Hinglish, English, ਪੰਜਾਬੀ) में बोलकर या लिखकर पूछ सकते हैं — मैं **उसी भाषा में उत्तर** दूँगा।';
    if (language === 'hi') {
      welcomeText = 'नमस्ते! मैं **योजना दृष्टि** AI सहायक हूँ। आप मुझसे सरकारी योजनाओं, सब्सिडी, लोन, दस्तावेज़ सत्यापन और PFMS ट्रैकिंग के बारे में हिंदी में पूछ सकते हैं।';
    } else if (language === 'pa') {
      welcomeText = 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਮੈਂ **Yojna दृष्टि** AI ਸਹਾਇਕ ਹਾਂ। ਤੁਸੀਂ ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ, ਸਬਸਿਡੀ ਅਤੇ ਲੋਨ ਬਾਰੇ ਪੰਜਾਬੀ ਵਿੱਚ ਪੁੱਛ ਸਕਦੇ ਹੋ।';
    } else if (language === 'en') {
      welcomeText = 'Hello! I am the **Yojna दृष्टि** AI Assistant. Ask or speak to me in English about government schemes, loans, subsidies, and document verification.';
    }

    setMessages([
      {
        sender: 'bot',
        text: welcomeText,
        detectedLanguageName: language === 'auto' ? 'स्वतः भाषा पहचान (Auto)' : language,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [language]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Initialize Speech Recognition (Mic Input)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (language === 'pa') recognitionRef.current.lang = 'pa-IN';
      else if (language === 'en') recognitionRef.current.lang = 'en-IN';
      else recognitionRef.current.lang = 'hi-IN'; // hi-IN handles Hindi, Hinglish, and regional speech best

      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userQuestion = inputText.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: userQuestion, timestamp }]);
    setInputText('');
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/chat', {
        question: userQuestion,
        language
      });

      if (res.data && res.data.success) {
        const botReply = res.data.data.reply;
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: botReply,
            detectedLanguageName: res.data.data?.detectedLanguageName,
            suggestedScheme: res.data.data?.suggestedScheme,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('No valid reply received');
      }
    } catch (err) {
      console.warn('Chat error fallback:', err.message);
      const isHindiQuery = /[\u0900-\u097F]/.test(userQuestion) || /bhai|mujhe|dukaan|yojana|chahiye/i.test(userQuestion);
      const isPunjabiQuery = /[\u0A00-\u0A7F]/.test(userQuestion) || /mainu|chahida|dasso/i.test(userQuestion);

      const fallbackReply = isHindiQuery
        ? 'प्रधान मंत्री रोजगार सृजन कार्यक्रम (PMEGP) और मुद्रा योजना सूक्ष्म उद्यमियों के लिए सबसे उपयुक्त योजनाएँ हैं। इनमें 35% तक सब्सिडी और ₹10 लाख तक संपार्श्विक-मुक्त ऋण उपलब्ध है।'
        : isPunjabiQuery
        ? 'ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਰੋਜ਼ਗਾਰ ਉਤਪਤੀ ਪ੍ਰੋਗਰਾਮ (PMEGP) ਅਤੇ ਮੁਦਰਾ ਯੋਜਨਾ ਛੋਟੇ ਉੱਦਮੀਆਂ ਲਈ ਉੱਤਮ ਯੋਜਨਾਵਾਂ ਹਨ।'
        : 'The Prime Minister Employment Generation Programme (PMEGP) offers up to 35% capital subsidy, while MUDRA offers collateral-free loans up to ₹10 Lakhs.';

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const speakBotResponse = async (text, msgIdx) => {
    if (isPlayingAudio && currentPlayingIndex === msgIdx) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setCurrentPlayingIndex(null);
      return;
    }

    setIsPlayingAudio(true);
    setCurrentPlayingIndex(msgIdx);

    const cleanText = text.replace(/[*_#`~[\]()]/g, ' ').replace(/\s+/g, ' ').slice(0, 450);

    // Auto-detect speech language from the response text itself
    let speechLangCode = 'en-IN';
    if (/[\u0900-\u097F]/.test(cleanText)) speechLangCode = 'hi-IN';
    else if (/[\u0A00-\u0A7F]/.test(cleanText)) speechLangCode = 'pa-IN';
    else if (/[\u0980-\u09FF]/.test(cleanText)) speechLangCode = 'bn-IN';
    else if (/[\u0B80-\u0BFF]/.test(cleanText)) speechLangCode = 'ta-IN';

    try {
      const res = await axios.post('/api/voice/tts', {
        text: cleanText,
        language: speechLangCode
      });

      if (res.data && res.data.success && res.data.data?.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${res.data.data.audioBase64}`);
        audioRef.current = audio;
        audio.onended = () => {
          setIsPlayingAudio(false);
          setCurrentPlayingIndex(null);
        };
        audio.play();
        return;
      }
    } catch (err) {
      console.warn('Sarvam TTS unavailable, using browser speech synthesis:', err.message);
    }

    // Fallback: Browser Web Speech API
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = speechLangCode;
      utterance.rate = 0.95;

      utterance.onend = () => {
        setIsPlayingAudio(false);
        setCurrentPlayingIndex(null);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-2.5 rounded-full bg-white hover:bg-[#F0FDFA] border-2 border-[#0F766E] text-[#0F766E] shadow-xl hover:scale-105 transition-transform flex items-center gap-2 group"
          aria-label="Open Yojna दृष्टि Assistant"
        >
          <img src="/logo.png" alt="Logo" className="w-9 h-9 rounded-full object-contain" />
          <span className="hidden sm:inline text-xs font-bold text-[#173B57] pr-2">
            Ask Yojna दृष्टि
          </span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[92vw] sm:w-[420px] h-[580px] bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#173B57] animate-fadeIn">
          
          {/* Header Bar */}
          <div className="bg-[#F8FAFC] p-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full object-contain border border-[#E2E8F0]" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-[#173B57]">Yojna दृष्टि Assistant</h3>
                  <span className="px-1.5 py-0.5 rounded bg-[#CCFBF1] text-[#115E59] text-[10px] font-bold border border-[#14B8A6]/30">
                    AI Voice
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                  <Sparkles className="w-3 h-3 text-[#0F766E]" /> Multilingual Government Scheme Guidance
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-slate-400 hover:text-[#173B57] hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Multilingual Switcher Bar */}
          <div className="bg-white px-4 py-2 border-b border-[#E2E8F0] flex items-center justify-between text-xs">
            <span className="text-slate-500 text-[11px] flex items-center gap-1 font-semibold">
              <Languages className="w-3.5 h-3.5 text-[#0F766E]" /> Language:
            </span>
            <div className="flex items-center space-x-1">
              {[
                { code: 'auto', label: 'Auto (स्वतः)' },
                { code: 'hi', label: 'हिंदी' },
                { code: 'en', label: 'English' },
                { code: 'pa', label: 'ਪੰਜਾਬੀ' }
              ].map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                    language === item.code
                      ? 'bg-[#0F766E] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-[#F8FAFC]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <img src="/logo.png" alt="Bot" className="w-7 h-7 rounded-full object-contain shrink-0 mt-0.5 border border-[#E2E8F0]" />
                )}

                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl space-y-2 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#0F766E] text-white rounded-br-none font-medium'
                      : 'bg-white text-[#173B57] border border-[#E2E8F0] rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed text-[12px]">{msg.text}</p>
                  
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span>{msg.timestamp}</span>
                      {msg.detectedLanguageName && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-100 text-[9px] text-[#0F766E] font-medium">
                          {msg.detectedLanguageName}
                        </span>
                      )}
                    </div>
                    {msg.sender === 'bot' && (
                      <button
                        onClick={() => speakBotResponse(msg.text, idx)}
                        className={`flex items-center gap-1 font-bold px-2 py-0.5 rounded transition ${
                          isPlayingAudio && currentPlayingIndex === idx
                            ? 'bg-[#CCFBF1] text-[#115E59]'
                            : 'hover:text-[#0F766E] text-slate-500 bg-slate-50'
                        }`}
                      >
                        {isPlayingAudio && currentPlayingIndex === idx ? (
                          <>
                            <VolumeX className="w-3 h-3 text-[#0F766E] animate-pulse" /> Stop Voice
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-[#0F766E]" /> Listen Voice
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#173B57] flex items-center justify-center shrink-0 mt-0.5 text-white font-bold text-[10px]">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-slate-500 text-xs py-2">
                <RefreshCw className="w-4 h-4 text-[#0F766E] animate-spin" />
                <span>Searching official guidelines...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input & Voice Controls */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-[#E2E8F0] flex items-center gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-xl border transition ${
                isListening 
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse' 
                  : 'bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] border-[#14B8A6]/40'
              }`}
              title="Speak Question"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask in English, हिंदी, or ਪੰਜਾਬੀ..."}
              className="flex-1 p-2 rounded-xl bg-white border border-[#CBD5E1] text-[#173B57] placeholder-slate-400 text-xs focus:outline-none focus:border-[#0F766E]"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white disabled:opacity-50 transition shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
