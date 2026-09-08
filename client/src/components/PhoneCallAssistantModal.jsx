// client/src/components/PhoneCallAssistantModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
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
  ExternalLink,
  Radio,
  Clock,
  Smartphone
} from 'lucide-react';
import { playDtmfTone, startRingtone, stopRingtone } from '../voice/dtmfToneGenerator.js';

export default function PhoneCallAssistantModal({ isOpen, onClose }) {
  const { t, currentLang, isHindi, isEnglish } = useLanguage();

  // Call States: 'IDLE' | 'CALLING_REAL' | 'RINGING' | 'CONNECTED' | 'COMPLETED'
  const [callState, setCallState] = useState('IDLE');
  const [callMode, setCallMode] = useState('simulator'); // 'real' | 'simulator'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [realCallInfo, setRealCallInfo] = useState(null);
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showDialpad, setShowDialpad] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [activeSpeechText, setActiveSpeechText] = useState('');
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
      setRealCallInfo(null);
    }
  };

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
   * Speak text in vernacular Hindi/English using Sarvam / Web Speech API
   */
  const speakIvrPrompt = async (text, onFinished) => {
    if (!text) return;
    setActiveSpeechText(text);

    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }

    const langCode = currentLang === 'pa' ? 'pa-IN' : isEnglish ? 'en-IN' : 'hi-IN';

    // 1. Try Sarvam TTS via backend
    try {
      const res = await axios.post('/api/ai/tts', { text, language: langCode });
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
      utterance.lang = langCode;
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
    const cleanNum = phoneNumber.replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanNum)) {
      setPhoneError('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें (शुरुआत 6, 7, 8 या 9 से)।');
      return;
    }

    setPhoneError('');

    if (callMode === 'real') {
      // Real Outbound Call via Twilio
      setCallState('CALLING_REAL');
      try {
        const res = await axios.post('/api/telephony/initiate-call', { phoneNumber: cleanNum });
        setRealCallInfo(res.data);
        if (res.data?.mode === 'live_twilio') {
          // Live call dialing
        } else {
          // Simulator fallback
          setTimeout(() => {
            setCallState('RINGING');
            startRingtone();
          }, 1500);
        }
      } catch (err) {
        setRealCallInfo({
          mode: 'simulated',
          message: 'कनेक्शन नोट: लाइव सिम्युलेटर मोड सक्रिय किया जा रहा है...'
        });
        setTimeout(() => {
          setCallState('RINGING');
          startRingtone();
        }, 1500);
      }
    } else {
      // On-Screen Live Simulator
      setCallState('RINGING');
      startRingtone();
    }
  };

  // User accepts incoming call
  const handleAcceptCall = () => {
    stopRingtone();
    setCallState('CONNECTED');
    setCallTimer(0);
    setCurrentStep(0);

    // Primary Spoken IVR Prompt
    const mainPrompt = isEnglish
      ? "Hello and welcome to YojnaSetu AI. Up to 35% government subsidy is available for your business enterprise. To receive the complete financial feasibility report on WhatsApp, press 1. For standard SMS, press 2."
      : "नमस्ते! योजनासेतु AI में आपका स्वागत है। आपके व्यवसाय के लिए PMEGP और मुद्रा योजना में 35% तक सरकारी सब्सिडी उपलब्ध है। इस योजना का पूरा वित्तीय पर्चा अपने व्हाट्सएप पर तुरंत पाने के लिए 1 दबाएं, अथवा सामान्य मैसेज के लिए 2 दबाएं।";

    speakIvrPrompt(mainPrompt);
  };

  // User presses telephone key on dialpad
  const handleKeyPress = async (key) => {
    playDtmfTone(key, 150);

    if (callState !== 'CONNECTED') return;

    // Fast-Path: Pressing 1 or 2 at ANY time dispatches WhatsApp or SMS!
    if (key === '1') {
      handleWhatsAppDispatch();
      return;
    }

    if (key === '2') {
      handleSmsDispatch();
      return;
    }

    // Step-by-step diagnostic questionnaire if navigating deeper
    if (currentStep === 1) {
      const genderVal = key === '1' ? 'Female' : key === '2' ? 'Male' : 'Other';
      setCollectedProfile(prev => ({ ...prev, gender: genderVal, isWomanEntrepreneur: genderVal === 'Female' }));
      advanceToStep(2);
    } else if (currentStep === 2) {
      const areaVal = key === '1' ? 'Rural' : 'Urban';
      setCollectedProfile(prev => ({ ...prev, areaType: areaVal }));
      advanceToStep(3);
    } else if (currentStep === 3) {
      const stageVal = key === '1' ? 'Existing business' : 'New business';
      setCollectedProfile(prev => ({ ...prev, businessStage: stageVal }));
      advanceToStep(4);
    } else if (currentStep === 4) {
      const fundingVal = key === '1' ? 50000 : key === '2' ? 500000 : 1500000;
      setCollectedProfile(prev => ({ ...prev, fundingAmount: fundingVal }));
      advanceToStep(5);
    }
  };

  const advanceToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    let prompt = '';
    switch (stepNumber) {
      case 1:
        prompt = isEnglish
          ? "Press 1 for Woman Entrepreneur, 2 for Male, 3 for Other."
          : "यदि आप महिला उद्यमी हैं तो 1 दबाएं, यदि पुरुष हैं तो 2 दबाएं, अन्य के लिए 3 दबाएं।";
        break;
      case 2:
        prompt = isEnglish
          ? "Press 1 for Rural area, 2 for Urban area."
          : "यदि आपका क्षेत्र ग्रामीण यानी गाँव या देहात है तो 1 दबाएं, शहर के लिए 2 दबाएं।";
        break;
      case 3:
        prompt = isEnglish
          ? "Is your business already running? Press 1 for Yes, 2 for New business."
          : "क्या आपकी दुकान या व्यवसाय पहले से चल रहा है? हाँ के लिए 1 दबाएं, नए व्यवसाय के लिए 2 दबाएं।";
        break;
      case 4:
        prompt = isEnglish
          ? "How much funding do you require? Press 1 for up to ₹50,000, 2 for up to ₹5 Lakhs, 3 for above ₹10 Lakhs."
          : "आपको कितनी राशि की वित्तीय सहायता चाहिए? ₹50 हज़ार तक के लिए 1 दबाएं, ₹5 लाख तक के लिए 2 दबाएं, ₹10 लाख से ऊपर के लिए 3 दबाएं।";
        break;
      case 5:
      default:
        prompt = isEnglish
          ? "Congratulations! You are eligible for PMEGP 35% subsidy and MUDRA scheme. Press 1 to get report on WhatsApp, or 2 for SMS."
          : "बधाई हो! आपकी जानकारी के अनुसार आप प्रधानमंत्री मुद्रा योजना और PMEGP 35% सब्सिडी योजना के लिए पात्र हैं। योजना का पूरा पर्चा अपने व्हाट्सएप पर पाने के लिए 1 दबाएं, या साधारण मैसेज के लिए 2 दबाएं।";
        break;
    }
    speakIvrPrompt(prompt);
  };

  // WhatsApp Dispatch Handler (Key '1')
  const handleWhatsAppDispatch = async () => {
    setDispatchStatus('whatsapp');
    const dispatchAck = isEnglish
      ? "Thank you! The complete scheme report has been sent to your WhatsApp."
      : "धन्यवाद! जानकारी आपके व्हाट्सएप पर भेज दी गई है। योजनासेतु से जुड़ने के लिए आभार।";

    speakIvrPrompt(dispatchAck, () => {
      setCallState('COMPLETED');
    });

    const clean = phoneNumber.replace(/\D/g, '').slice(-10) || '9876543210';
    const origin = window.location.origin;

    const preformattedText = `🏛️ *योजनासेतु AI — आधिकारिक योजना एवं वित्तीय पर्चा*
-----------------------------------------
नमस्ते! आपकी फोन कॉल के अनुसार आपकी पात्रता रिपोर्ट:
• *योजना:* PMEGP / PM मुद्रा योजना
• *ऋण सहायता:* ₹5,00,000 तक
• *सरकारी सब्सिडी:* ₹1,75,000 (35% सरकारी छूट)
• *मासिक क़िस्त (EMI):* ₹4,120 / माह
• *रोज़ाना खर्च:* सिर्फ ₹137 प्रतिदिन (2 कप चाय के बराबर)
-----------------------------------------
📄 *बैंक-योग्य DPR एवं आवेदन लिंक:* ${origin}/matches
भारत सरकार सामाजिक न्याय एवं अधिकारिता मंत्रालय (MoSJE) समर्थित`;

    // Save profile to local storage so they see matching schemes on web
    const finalProfile = {
      fullName: 'उद्यमी (Phone Helpline User)',
      phoneNumber: clean,
      gender: collectedProfile.gender,
      isWomanEntrepreneur: collectedProfile.gender === 'Female',
      state: 'Bihar',
      district: 'Patna',
      sector: 'Food processing',
      category: 'SC',
      fundingAmount: collectedProfile.fundingAmount,
      documentsAvailable: ['Aadhaar/Identity', 'Income Certificate', 'Category Certificate']
    };
    localStorage.setItem('ys_current_profile', JSON.stringify(finalProfile));

    // Call backend endpoint
    try {
      await axios.post('/api/telephony/send-whatsapp', {
        phoneNumber: clean,
        origin
      });
    } catch (e) {}

    // Open WhatsApp Web directly with pre-filled report
    const whatsappUrl = `https://api.whatsapp.com/send?phone=91${clean}&text=${encodeURIComponent(preformattedText)}`;
    window.open(whatsappUrl, '_blank');
  };

  // SMS Dispatch Handler (Key '2')
  const handleSmsDispatch = async () => {
    setDispatchStatus('sms');
    setSmsBanner(true);
    const dispatchAck = isEnglish
      ? "Thank you! The scheme summary has been sent via SMS."
      : "धन्यवाद! जानकारी आपके एसएमएस पर भेज दी गई है।";

    speakIvrPrompt(dispatchAck, () => {
      setCallState('COMPLETED');
    });

    const clean = phoneNumber.replace(/\D/g, '').slice(-10) || '9876543210';
    const origin = window.location.origin;

    // Call backend endpoint
    try {
      await axios.post('/api/telephony/handle-dtmf', {
        Digits: '2',
        To: `+91${clean}`
      });
    } catch (e) {}

    const finalProfile = {
      fullName: 'उद्यमी (Phone Helpline User)',
      phoneNumber: clean,
      gender: collectedProfile.gender,
      isWomanEntrepreneur: collectedProfile.gender === 'Female',
      state: 'Bihar',
      district: 'Patna',
      sector: 'Food processing',
      category: 'SC',
      fundingAmount: collectedProfile.fundingAmount,
      documentsAvailable: ['Aadhaar/Identity', 'Income Certificate']
    };
    localStorage.setItem('ys_current_profile', JSON.stringify(finalProfile));
  };

  const dialpadKeys = [
    { num: '1', sub: 'WhatsApp 📱' },
    { num: '2', sub: 'SMS ✉️' },
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
      
      {/* Smartphone Container */}
      <div className="w-full max-w-sm sm:max-w-md bg-slate-950 rounded-[40px] border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col relative text-white min-h-[640px]">
        
        {/* Phone Top Notch */}
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

        {/* Top Close Button */}
        <button
          type="button"
          onClick={() => {
            handleEndCall(true);
            onClose();
          }}
          className="absolute top-3 right-4 z-20 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition"
          title="बंद करें"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ========================================================================= */}
        {/* SCREEN 1: IDLE (Enter Number & Select Mode) */}
        {/* ========================================================================= */}
        {callState === 'IDLE' && (
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4 text-center mt-4">
              <div className="w-18 h-18 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 animate-pulse">
                <PhoneCall className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                  {t('wizard_banner_badge', 'टोल-फ्री हेल्पलाइन')}
                </span>
                <h2 className="text-xl font-black text-white">योजना कॉल सहायक (IVR)</h2>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  टाइपिंग या फॉर्म भरने की झंझट नहीं! 2 मिनट के स्वचालित फोन कॉल पर 1 दबाकर WhatsApp पर्चा पाएं।
                </p>
              </div>
            </div>

            {/* Mode Selector Toggle */}
            <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setCallMode('simulator')}
                className={`py-2 px-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  callMode === 'simulator'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>लाइव सिम्युलेटर</span>
              </button>

              <button
                type="button"
                onClick={() => setCallMode('real')}
                className={`py-2 px-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                  callMode === 'real'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>असली फ़ोन पर कॉल</span>
              </button>
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
                <span>{callMode === 'real' ? '📞 मुझे अभी कॉल करें (Call Me Now)' : '📱 सिम्युलेटर शुरू करें (Start Call)'}</span>
              </button>
            </form>

            <div className="text-center text-[10px] text-slate-500 pb-2">
              🔒 Twilio Voice & IVR सुरक्षित • 100% निःशुल्क सरकारी सेवा
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 1B: REAL OUTBOUND CALLING BANNER */}
        {/* ========================================================================= */}
        {callState === 'CALLING_REAL' && (
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between items-center text-center animate-fadeIn space-y-4">
            <div className="space-y-3 mt-12">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 animate-spin">
                <Radio className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-white">फोन पर कॉल मिलाई जा रही है...</h3>
              <p className="text-xs text-emerald-300 font-mono font-bold">+91 {phoneNumber}</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                {realCallInfo?.message || 'Twilio Telephony सर्वर से कनेक्ट हो रहा है। आपके फ़ोन की घंटी बजने वाली है...'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setCallState('RINGING');
                startRingtone();
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-xs font-bold text-slate-300 transition"
            >
              स्क्रीन पर सिम्युलेटर चालू करें ↗
            </button>

            <button
              type="button"
              onClick={() => handleEndCall(true)}
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: RINGING (Incoming Helpline Call) */}
        {/* ========================================================================= */}
        {callState === 'RINGING' && (
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between items-center text-center animate-fadeIn">
            <div className="space-y-2 mt-8">
              <div className="text-xs text-emerald-400 font-extrabold uppercase tracking-widest animate-pulse">
                इनकमिंग कॉल... (Incoming Call)
              </div>
              <h2 className="text-2xl font-black text-white">योजनासेतु AI हेल्पलाइन</h2>
              <p className="text-xs text-emerald-300 font-mono font-bold">(1800-YOJNA)</p>
              <p className="text-[11px] text-slate-500">Government of India AI Initiative</p>
            </div>

            {/* Glowing Avatar */}
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
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between animate-fadeIn text-center">
            
            <div className="space-y-1">
              <div className="text-base font-black text-white">योजनासेतु AI हेल्पलाइन</div>
              <div className="text-xs text-emerald-400 font-mono font-bold tracking-wider">
                ● कॉल जारी है: {formatCallTime(callTimer)}
              </div>
            </div>

            {/* Spoken IVR Prompt Box */}
            <div className="my-2 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-1 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>हेल्पलाइन आवाज़ (IVR Prompt):</span>
                </span>
                <span className="text-slate-500 font-mono text-[9px]">1: WhatsApp | 2: SMS</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                "{activeSpeechText || 'नमस्ते! कृपया प्रश्न सुनकर 1 या 2 दबाएं...'}"
              </p>
            </div>

            {/* Instant DTMF Action Shortcuts */}
            <div className="grid grid-cols-2 gap-2 my-1">
              <button
                type="button"
                onClick={() => handleKeyPress('1')}
                className="p-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 font-black text-xs transition flex items-center justify-center gap-2 active:scale-95 shadow-sm"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-black">1</span>
                <span>व्हाट्सएप पर्चा 📱</span>
              </button>

              <button
                type="button"
                onClick={() => handleKeyPress('2')}
                className="p-2.5 rounded-xl bg-sky-950/60 hover:bg-sky-900 border border-sky-500/60 text-sky-300 font-black text-xs transition flex items-center justify-center gap-2 active:scale-95 shadow-sm"
              >
                <span className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center text-xs font-black">2</span>
                <span>सामान्य SMS ✉️</span>
              </button>
            </div>

            {/* Telephone DTMF Dialpad */}
            {showDialpad && (
              <div className="grid grid-cols-3 gap-2 max-w-[280px] mx-auto my-1">
                {dialpadKeys.map((key) => (
                  <button
                    key={key.num}
                    type="button"
                    onClick={() => handleKeyPress(key.num)}
                    className="w-18 h-12 rounded-xl bg-slate-900/90 hover:bg-slate-800 active:bg-emerald-600 border border-slate-800 text-white flex flex-col items-center justify-center transition active:scale-95 shadow-sm group"
                  >
                    <span className="text-base font-black leading-none group-active:text-white">{key.num}</span>
                    {key.sub && (
                      <span className="text-[8px] text-slate-500 font-bold tracking-wider mt-0.5 leading-none group-active:text-emerald-200">{key.sub}</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Call Controls Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-center gap-4 text-slate-400">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2.5 rounded-full border transition ${
                    isMuted ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-slate-900 border-slate-800 hover:text-white'
                  }`}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setShowDialpad(!showDialpad)}
                  className={`p-2.5 rounded-full border transition ${
                    showDialpad ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className={`p-2.5 rounded-full border transition ${
                    isSpeakerOn ? 'bg-sky-500/20 border-sky-500 text-sky-400' : 'bg-slate-900 border-slate-800 hover:text-white'
                  }`}
                >
                  {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              {/* Red Hangup Call Button */}
              <button
                type="button"
                onClick={() => handleEndCall(true)}
                className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-rose-600/40 transition active:scale-90"
              >
                <PhoneOff className="w-5 h-5" />
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
                आपकी पात्रता का विस्तृत वित्तीय पर्चा तैयार कर दिया गया है।
              </p>
            </div>

            {/* Dispatch Feedback Cards */}
            <div className="space-y-2.5 text-left">
              {dispatchStatus === 'whatsapp' && (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <Share2 className="w-4 h-4 text-emerald-400" />
                    <span>व्हाट्सएप पर वित्तीय पर्चा भेजा गया</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    PMEGP (35% सब्सिडी) और मुद्रा लोन की EMI और DPR रिपोर्ट आपके WhatsApp पर भेज दी गई है।
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
                  <span>आपकी प्रमुख पात्रता रिपोर्ट:</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <div>• <strong>PMEGP:</strong> ₹5,00,000 ऋण • ₹1,75,000 सब्सिडी (35%)</div>
                  <div>• <strong>मासिक EMI:</strong> ₹4,120 / माह (सिर्फ ₹137 प्रतिदिन)</div>
                  <div>• <strong>सुरक्षा:</strong> RBI नियम अनुसार ₹10 लाख तक शून्य गारंटी</div>
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
                नया कॉल करें (Restart)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
