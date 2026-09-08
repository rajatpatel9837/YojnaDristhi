// client/src/components/PhoneCallAssistantModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Grid, 
  X, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare, 
  Share2, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { playDtmfTone, startRingtone, stopRingtone } from '../voice/dtmfToneGenerator.js';

export default function PhoneCallAssistantModal({ isOpen, onClose }) {
  // Call States: 'IDLE' | 'RINGING' | 'CONNECTED' | 'COMPLETED'
  const [callState, setCallState] = useState('IDLE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showDialpad, setShowDialpad] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeSpeechText, setActiveSpeechText] = useState('');
  const [matchedSchemes, setMatchedSchemes] = useState([]);
  const [dispatchStatus, setDispatchStatus] = useState(null); // 'whatsapp' | 'sms' | null
  const [smsBanner, setSmsBanner] = useState(false);
  const [collectedProfile, setCollectedProfile] = useState({
    gender: 'Female',
    areaType: 'Rural',
    businessStage: 'Existing business',
    fundingAmount: 500000
  });

  const timerIntervalRef = useRef(null);
  const audioPlayerRef = useRef(null);

  // Stop ringtone and timer on unmount or close
  useEffect(() => {
    if (!isOpen) {
      handleEndCall(false);
    }
    return () => {
      stopRingtone();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [isOpen]);

  // Handle Call Timer when connected
  useEffect(() => {
    if (callState === 'CONNECTED') {
      timerIntervalRef.current = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [callState]);

  if (!isOpen) return null;

  // Format call duration MM:SS
  const formatCallTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Speak text in vernacular Hindi using Sarvam / Web Speech API
   */
  const speakIvrPrompt = async (text, onFinished) => {
    if (!text) return;
    setActiveSpeechText(text);

    // Cancel any ongoing speech
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }

    // 1. Try Sarvam TTS via backend
    try {
      const res = await axios.post('/api/voice/tts', { text, language: 'hi-IN' });
      if (res.data?.success && res.data?.data?.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${res.data.data.audioBase64}`);
        audioPlayerRef.current = audio;
        audio.onended = () => {
          if (onFinished) onFinished();
        };
        audio.play();
        return;
      }
    } catch (err) {
      // fallback to browser speech synthesis
    }

    // 2. Fallback: Browser Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.onend = () => {
        if (onFinished) onFinished();
      };
      utterance.onerror = () => {
        if (onFinished) onFinished();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      if (onFinished) onFinished();
    }
  };

  // Start Call Trigger from User
  const handleInitiateCall = async (e) => {
    e.preventDefault();
    const cleanNum = phoneNumber.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanNum)) {
      setPhoneError('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें (शुरुआत 6, 7, 8 या 9 से)।');
      return;
    }

    setPhoneError('');
    setCallState('RINGING');
    startRingtone();

    try {
      await axios.post('/api/telephony/request-call', { phoneNumber: cleanNum });
    } catch (err) {
      console.warn('Call request endpoint note:', err.message);
    }
  };

  // User accepts incoming call
  const handleAcceptCall = () => {
    stopRingtone();
    setCallState('CONNECTED');
    setCallTimer(0);
    setCurrentStep(0);

    // Step 0: Greeting Prompt, then auto-advance to Step 1
    const greetingText = 'नमस्ते! मैं योजनासेतु AI से बोल रहा हूँ। आइए जानते हैं कि आपको कौन सी सरकारी योजना या सब्सिडी मिल सकती है।';
    speakIvrPrompt(greetingText, () => {
      // Transition to Step 1 after greeting finishes
      setTimeout(() => {
        advanceToStep(1);
      }, 500);
    });
  };

  // Advance to IVR Step and speak its prompt
  const advanceToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    let prompt = '';
    switch (stepNumber) {
      case 1:
        prompt = 'यदि आप महिला उद्यमी हैं तो 1 दबाएं, यदि पुरुष हैं तो 2 दबाएं, अन्य के लिए 3 दबाएं।';
        break;
      case 2:
        prompt = 'यदि आपका क्षेत्र ग्रामीण यानी गाँव या देहात है तो 1 दबाएं, शहर के लिए 2 दबाएं।';
        break;
      case 3:
        prompt = 'क्या आपकी दुकान या व्यवसाय पहले से चल रहा है? हाँ के लिए 1 दबाएं, नए व्यवसाय के लिए 2 दबाएं।';
        break;
      case 4:
        prompt = 'आपको कितनी राशि की वित्तीय सहायता चाहिए? ₹50 हज़ार तक के लिए 1 दबाएं, ₹5 लाख तक के लिए 2 दबाएं, ₹10 लाख से ऊपर के लिए 3 दबाएं।';
        break;
      case 5:
      default:
        prompt = 'बधाई हो! आपकी जानकारी के अनुसार आप प्रधानमंत्री मुद्रा योजना और PMEGP 35% सब्सिडी योजना के लिए पात्र हैं। योजना का पूरा पर्चा अपने व्हाट्सएप पर पाने के लिए 1 दबाएं, या साधारण मैसेज के लिए 2 दबाएं।';
        break;
    }
    speakIvrPrompt(prompt);
  };

  // User presses telephone key on dialpad
  const handleKeyPress = async (key) => {
    playDtmfTone(key, 160);

    if (callState !== 'CONNECTED') return;

    // Process key based on current step
    if (currentStep === 1) {
      // Gender
      const genderVal = key === '1' ? 'Female' : key === '2' ? 'Male' : 'Other';
      setCollectedProfile(prev => ({ ...prev, gender: genderVal, isWomanEntrepreneur: genderVal === 'Female' }));
      advanceToStep(2);
    } else if (currentStep === 2) {
      // Area Type
      const areaVal = key === '1' ? 'Rural' : 'Urban';
      setCollectedProfile(prev => ({ ...prev, areaType: areaVal }));
      advanceToStep(3);
    } else if (currentStep === 3) {
      // Stage
      const stageVal = key === '1' ? 'Existing business' : 'New business';
      setCollectedProfile(prev => ({ ...prev, businessStage: stageVal }));
      advanceToStep(4);
    } else if (currentStep === 4) {
      // Funding
      const fundingVal = key === '1' ? 50000 : key === '2' ? 500000 : 1500000;
      setCollectedProfile(prev => ({ ...prev, fundingAmount: fundingVal }));

      // Matched schemes calculation
      const matches = [
        {
          name: 'Prime Minister Employment Generation Programme (PMEGP)',
          benefit_hi: '₹5 लाख लोन पर 35% सरकारी सब्सिडी (Margin Money Rebate)',
          subsidyPct: 35
        },
        {
          name: 'Pradhan Mantri MUDRA Yojana (Kishore)',
          benefit_hi: '₹5 लाख तक 8.5% रियायती ब्याज पर बिना गारंटी ऋण',
          subsidyPct: 0
        }
      ];
      setMatchedSchemes(matches);

      // Advance to final dispatch question
      advanceToStep(5);
    } else if (currentStep === 5) {
      // Final Choice: 1 for WhatsApp, 2 for SMS
      if (key === '1') {
        handleWhatsAppDispatch();
      } else {
        handleSmsDispatch();
      }
    }
  };

  // WhatsApp Dispatch Handler (Key '1')
  const handleWhatsAppDispatch = () => {
    setDispatchStatus('whatsapp');
    const dispatchText = 'धन्यवाद! योजना पर्चा आपके व्हाट्सएप पर भेजा जा रहा है।';
    speakIvrPrompt(dispatchText, () => {
      setCallState('COMPLETED');
    });

    // Save profile to local storage so they see matching schemes on web too
    const finalProfile = {
      fullName: 'उद्यमी (Phone Helpline User)',
      phoneNumber: phoneNumber || '9876543210',
      gender: collectedProfile.gender,
      isWomanEntrepreneur: collectedProfile.gender === 'Female',
      state: 'Bihar',
      district: 'Patna',
      sector: 'Food processing',
      category: 'OBC',
      fundingAmount: collectedProfile.fundingAmount,
      documentsAvailable: ['Aadhaar/Identity', 'Income Certificate', 'Category Certificate']
    };
    localStorage.setItem('ys_current_profile', JSON.stringify(finalProfile));

    // Construct WhatsApp prefilled message
    const msg = `*योजना सेतू AI (Yojna दृष्टि) — हेल्पलाइन कॉल योजना पर्चा*\n\n` +
      `📞 *आवेदक नंबर:* ${phoneNumber || 'उद्यमी'}\n` +
      `👤 *प्रोफाइल:* ${collectedProfile.gender === 'Female' ? 'महिला उद्यमी' : 'पुरुष उद्यमी'}, ${collectedProfile.areaType === 'Rural' ? 'ग्रामीण क्षेत्र' : 'शहरी क्षेत्र'}\n\n` +
      `🎉 *आपकी योग्य सरकारी योजनाएं:*\n` +
      `1. *PMEGP योजना:* ₹5 लाख पर 35% सरकारी सब्सिडी (छूट)\n` +
      `2. *PM मुद्रा योजना:* ₹5 लाख तक बिना किसी ज़मीन या गारंटी के 8.5% ऋण\n\n` +
      `🛡️ *RBI नियम:* ₹10 लाख तक कोई ज़मीन या बंधक अनिवार्य नहीं (RPCD.79)\n\n` +
      `👉 *पूरा योजना पर्चा देखने हेतु:* ${window.location.origin}/matches`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // SMS Dispatch Handler (Key '2')
  const handleSmsDispatch = () => {
    setDispatchStatus('sms');
    setSmsBanner(true);
    const dispatchText = 'धन्यवाद! योजना विवरण आपके मोबाइल पर सामान्य SMS द्वारा भेज दिया गया है।';
    speakIvrPrompt(dispatchText, () => {
      setCallState('COMPLETED');
    });

    // Save profile to local storage
    const finalProfile = {
      fullName: 'उद्यमी (Phone Helpline User)',
      phoneNumber: phoneNumber || '9876543210',
      gender: collectedProfile.gender,
      isWomanEntrepreneur: collectedProfile.gender === 'Female',
      state: 'Bihar',
      district: 'Patna',
      sector: 'Food processing',
      category: 'OBC',
      fundingAmount: collectedProfile.fundingAmount,
      documentsAvailable: ['Aadhaar/Identity', 'Income Certificate']
    };
    localStorage.setItem('ys_current_profile', JSON.stringify(finalProfile));
  };

  // End Call / Reset
  const handleEndCall = (resetState = true) => {
    stopRingtone();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if (resetState) {
      setCallState('IDLE');
      setCallTimer(0);
      setCurrentStep(0);
      setDispatchStatus(null);
      setSmsBanner(false);
    }
  };

  const dialpadKeys = [
    { num: '1', sub: '' },
    { num: '2', sub: 'ABC' },
    { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' },
    { num: '5', sub: 'JKL' },
    { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' },
    { num: '8', sub: 'TUV' },
    { num: '9', sub: 'WXYZ' },
    { num: '*', sub: '' },
    { num: '0', sub: '+' },
    { num: '#', sub: '' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      {/* Smartphone Mockup Container */}
      <div className="w-full max-w-sm sm:max-w-md bg-slate-950 rounded-[40px] border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col relative text-white min-h-[640px]">
        
        {/* Phone Top Notch / Dynamic Island */}
        <div className="h-7 w-full bg-slate-950 flex items-center justify-between px-6 pt-2 text-[10px] text-slate-400 font-mono select-none">
          <span>09:41</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="w-4 h-2 border border-slate-400 rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-emerald-400 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Top Close Button (Simulator Control) */}
        <button
          type="button"
          onClick={() => {
            handleEndCall(true);
            onClose();
          }}
          className="absolute top-3 right-4 z-20 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
          title="सिम्युलेटर बंद करें"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ========================================================================= */}
        {/* SCREEN 1: IDLE (Enter Mobile Number) */}
        {/* ========================================================================= */}
        {callState === 'IDLE' && (
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4 text-center mt-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 animate-pulse">
                <PhoneCall className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                  मुफ़्त सरकारी फोन कॉल हेल्पलाइन
                </span>
                <h2 className="text-xl font-black text-white">योजना कॉल सहायक</h2>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  टाइपिंग या फॉर्म भरने की झंझट नहीं! अपना मोबाइल नंबर दर्ज करें और 2 मिनट के ऑटोमेटेड फोन कॉल पर अपनी पात्रता जानें।
                </p>
              </div>
            </div>

            {/* Phone Number Input Form */}
            <form onSubmit={handleInitiateCall} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                  अपना 10 अंकों का मोबाइल नंबर दर्ज करें:
                </label>
                <div className="flex items-center rounded-2xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 focus-within:border-emerald-500 transition">
                  <span className="text-xs font-bold text-slate-400 mr-2 font-mono">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-transparent text-white font-mono text-sm focus:outline-none placeholder:text-slate-600 tracking-wider font-bold"
                  />
                </div>
                {phoneError && (
                  <p className="text-[10px] text-rose-400 font-medium">{phoneError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-95"
              >
                <Phone className="w-4 h-4 text-slate-950" />
                <span>📞 कॉल शुरू करें (Receive Call)</span>
              </button>
            </form>

            <div className="text-center text-[10px] text-slate-500 pb-2">
              🔒 100% सुरक्षित • कोई ओटीपी या व्यक्तिगत पासवर्ड नहीं मांगा जाएगा
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: RINGING (Incoming Helpline Call) */}
        {/* ========================================================================= */}
        {callState === 'RINGING' && (
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between items-center text-center animate-fadeIn">
            {/* Caller Info */}
            <div className="space-y-2 mt-8">
              <div className="text-xs text-emerald-400 font-extrabold uppercase tracking-widest animate-pulse">
                इनकमिंग कॉल... (Incoming Call)
              </div>
              <h2 className="text-2xl font-black text-white">योजनासेतु सरकारी हेल्पलाइन</h2>
              <p className="text-xs text-slate-400 font-mono">1800-YOJNA (Toll-Free Helpline)</p>
              <p className="text-[11px] text-slate-500">Government of India AI Initiative</p>
            </div>

            {/* Glowing Pulsing Emblem Avatar */}
            <div className="relative my-auto">
              <div className="w-32 h-32 rounded-full bg-emerald-500/20 animate-ping absolute inset-0" />
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center border-4 border-emerald-400 shadow-2xl relative z-10">
                <img 
                  src="/logo.png" 
                  alt="Yojna दृष्टि Logo" 
                  className="w-20 h-20 rounded-full object-contain p-1 bg-white"
                />
              </div>
            </div>

            {/* Accept / Decline Action Buttons */}
            <div className="w-full flex items-center justify-around pt-8 pb-4">
              {/* Decline Button */}
              <div className="text-center space-y-1">
                <button
                  type="button"
                  onClick={() => handleEndCall(true)}
                  className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition active:scale-90"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
                <div className="text-[11px] text-slate-400 font-bold">काटें</div>
              </div>

              {/* Accept Button */}
              <div className="text-center space-y-1">
                <button
                  type="button"
                  onClick={handleAcceptCall}
                  className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/40 transition active:scale-90 animate-bounce"
                >
                  <Phone className="w-7 h-7 text-slate-950" />
                </button>
                <div className="text-[11px] text-emerald-400 font-extrabold">उठाएं</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: CONNECTED (Active Call & Interactive DTMF Dialpad) */}
        {/* ========================================================================= */}
        {callState === 'CONNECTED' && (
          <div className="p-5 flex-1 flex flex-col justify-between animate-fadeIn text-center">
            
            {/* Active Header & Timer */}
            <div className="space-y-1">
              <div className="text-base font-black text-white">योजनासेतु AI हेल्पलाइन</div>
              <div className="text-xs text-emerald-400 font-mono font-bold tracking-wider">
                ● कॉल जारी है: {formatCallTime(callTimer)}
              </div>
            </div>

            {/* Spoken IVR Subtitle Box */}
            <div className="my-2 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-1 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span>हेल्पलाइन ऑडियो (IVR Prompt):</span>
                </span>
                <span className="text-slate-500 font-mono">चरण 0{currentStep}/05</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                "{activeSpeechText || 'नमस्ते! कृपया प्रश्न सुनकर कीपैड दबाएं...'}"
              </p>
            </div>

            {/* Interactive Telephone DTMF Dialpad */}
            {showDialpad && (
              <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto my-1">
                {dialpadKeys.map((key) => (
                  <button
                    key={key.num}
                    type="button"
                    onClick={() => handleKeyPress(key.num)}
                    className="w-18 h-14 rounded-2xl bg-slate-900/90 hover:bg-slate-800 active:bg-emerald-600 border border-slate-800 text-white flex flex-col items-center justify-center transition active:scale-95 shadow-sm group"
                  >
                    <span className="text-lg font-black leading-none group-active:text-white">{key.num}</span>
                    {key.sub && (
                      <span className="text-[9px] text-slate-500 font-bold tracking-widest mt-0.5 leading-none group-active:text-emerald-200">{key.sub}</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Call Controls Bar */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-center gap-5 text-slate-400">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full border transition ${
                    isMuted ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-slate-900 border-slate-800 hover:text-white'
                  }`}
                  title={isMuted ? 'अनम्यूट करें' : 'म्यूट करें'}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setShowDialpad(!showDialpad)}
                  className={`p-3 rounded-full border transition ${
                    showDialpad ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 hover:text-white'
                  }`}
                  title="कीपैड छुपाएं / दिखाएं"
                >
                  <Grid className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className={`p-3 rounded-full border transition ${
                    isSpeakerOn ? 'bg-sky-500/20 border-sky-500 text-sky-400' : 'bg-slate-900 border-slate-800 hover:text-white'
                  }`}
                  title="स्पीकर टॉगल"
                >
                  {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>

              {/* Red Hangup Call Button */}
              <button
                type="button"
                onClick={() => handleEndCall(true)}
                className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-rose-600/40 transition active:scale-90"
                title="कॉल समाप्त करें"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: COMPLETED (Dispatched Result Screen) */}
        {/* ========================================================================= */}
        {callState === 'COMPLETED' && (
          <div className="p-6 flex-1 flex flex-col justify-between animate-fadeIn text-center space-y-4">
            <div className="space-y-3 mt-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">कॉल सफलतापूर्वक पूर्ण!</h3>
              <p className="text-xs text-slate-300">
                आपकी जानकारी के आधार पर योजना पर्चा तैयार कर दिया गया है।
              </p>
            </div>

            {/* Dispatch Feedback Cards */}
            <div className="space-y-2.5 text-left">
              {dispatchStatus === 'whatsapp' && (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <Share2 className="w-4 h-4 text-emerald-400" />
                    <span>व्हाट्सएप पर पर्चा भेजा गया (Dispatched)</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    PMEGP 35% सब्सिडी और मुद्रा लोन का पूरा पर्चा आपके व्हाट्सएप नंबर पर भेज दिया गया है।
                  </p>
                </div>
              )}

              {smsBanner && (
                <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                    <MessageSquare className="w-4 h-4 text-sky-400" />
                    <span>सामान्य SMS भेजा गया</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    योजनाओं के नाम व आवेदन लिंक आपके मोबाइल नंबर पर एसएमएस द्वारा प्रेषित कर दिए गए हैं।
                  </p>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>आपकी पात्र योजनाएं:</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  • PMEGP (35% मार्जिन मनी सब्सिडी)<br />
                  • प्रधानमंत्री मुद्रा योजना (शून्य गारंटी)
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <a
                href="/matches"
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2"
              >
                <span>पोर्टल पर योजनाएं देखें (View Matches)</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => handleEndCall(true)}
                className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold text-xs transition"
              >
                नया कॉल करें
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
