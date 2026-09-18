import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { 
  User, 
  Target, 
  Users, 
  FileCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle,
  Mic,
  MicOff,
  ShieldCheck,
  Building,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import DocumentOCRUploadZone from '../components/DocumentOCRUploadZone';
import useVoiceWizard from '../voice/useVoiceWizard';
import VoiceWizardOverlay from '../components/VoiceWizardOverlay';
import InlineMicrophoneButton from '../components/InlineMicrophoneButton';
import { WIZARD_VOICE_SCHEMA } from '../voice/wizardVoiceSchema';

/**
 * EntrepreneurWizard
 * Redesigned 5-stage progressive scheme discovery flow following official myScheme pattern:
 * Stage 1: About you (age, gender, state/district, rural/urban, name)
 * Stage 2: Your need (persona goal, sector, funding amount & purpose, assistance type)
 * Stage 3: Your situation (income, category, demographics, business details)
 * Stage 4: Documents (available certificates, OCR scan, DigiLocker choice)
 * Stage 5: Find my schemes (review summary & primary CTA)
 * 
 * Preserves 100% of data contracts, matching inputs, voice hooks, demo loader, and localStorage.
 */
export default function EntrepreneurWizard() {
  const { t, isHindi, isEnglish } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 5 Visual Stages (1 to 5)
  const [currentStep, setCurrentStep] = useState(1);
  const [voiceStep, setVoiceStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [personaType, setPersonaType] = useState('entrepreneur'); // 'entrepreneur' | 'student' | 'farmer' | 'artisan'

  // Complete Form State (Strictly Preserved)
  const [formData, setFormData] = useState({
    // Stage 1: Personal
    fullName: '',
    age: 28,
    gender: 'Female',
    state: 'Bihar',
    district: 'Patna',
    city: 'Patna',
    pincode: '800001',
    areaType: 'Rural',

    // Stage 2: Need & Goal
    sector: 'Food processing',
    fundingType: ['Loan', 'Subsidy', 'Equipment'],
    fundingAmount: 500000,
    fundingPurpose: 'Machinery procurement and food processing unit setup',

    // Stage 3: Situation & Business
    businessName: '',
    businessType: 'Proprietary',
    stage: 'Existing business',
    yearsInOperation: 2,
    annualTurnover: 400000,
    employeesCount: 3,
    investmentAmount: 150000,
    udyamStatus: 'Registered',
    familyIncome: 250000,
    existingLoans: false,
    existingEMI: 0,
    ownContribution: 50000,
    hasIncomeCertificate: true,
    category: 'SC',
    isWomanEntrepreneur: true,
    isMinority: false,
    isPwD: false,
    isFirstGeneration: true,
    isRuralEntrepreneur: true,

    // Stage 4: Documents
    documentsAvailable: [
      'Income Certificate',
      'Category Certificate',
      'Business Registration',
      'Aadhaar/Identity',
      'Udyam Certificate'
    ]
  });

  // Auto-fill Demo Profile if demo parameter is present
  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      loadDemoData();
    }
  }, [searchParams]);

  const loadDemoData = async () => {
    try {
      const res = await axios.get('/api/entrepreneurs/demo');
      if (res.data.success) {
        setFormData(res.data.data);
      }
    } catch (err) {
      console.warn('Demo load failed, using local fallback.');
      setFormData(prev => ({
        ...prev,
        fullName: 'Sunita Devi',
        age: 28,
        gender: 'Female',
        state: 'Bihar',
        district: 'Patna',
        sector: 'Food processing',
        category: 'SC',
        isWomanEntrepreneur: true,
        fundingAmount: 500000,
        annualTurnover: 400000,
        udyamStatus: 'Registered'
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDocument = (docName) => {
    setFormData(prev => {
      const docs = prev.documentsAvailable || [];
      if (docs.includes(docName)) {
        return { ...prev, documentsAvailable: docs.filter(d => d !== docName) };
      } else {
        return { ...prev, documentsAvailable: [...docs, docName] };
      }
    });
  };

  const toggleFundingType = (type) => {
    setFormData(prev => {
      const types = prev.fundingType || [];
      if (types.includes(type)) {
        return { ...prev, fundingType: types.filter(t => t !== type) };
      } else {
        return { ...prev, fundingType: [...types, type] };
      }
    });
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      await axios.post('/api/entrepreneurs/save', formData);
    } catch (err) {}
    
    // Store in localStorage for instant matching display (Strictly Preserved)
    localStorage.setItem('ys_current_profile', JSON.stringify(formData));
    setLoading(false);
    navigate('/matches');
  };

  // Sync Voice Wizard Step with Visual Stages
  const handleVoiceStepChange = (vStep) => {
    setVoiceStep(vStep);
    if (vStep === 1) setCurrentStep(1);
    else if (vStep === 2 || vStep === 5) setCurrentStep(2);
    else if (vStep === 3 || vStep === 4) setCurrentStep(3);
    else if (vStep === 6) setCurrentStep(4);
    else setCurrentStep(5);
  };

  const {
    isVoiceModeOn,
    toggleVoiceMode,
    sessionState,
    currentFieldKey,
    currentFieldLabel_hi,
    currentQuestion_hi,
    currentHint_hi,
    liveCaption,
    pauseVoiceMode,
    repeatCurrentQuestion,
    goToPreviousField,
    fieldProgress,
    pendingAdvance,
    cancelAutoAdvance,
    confirmAutoAdvance
  } = useVoiceWizard({
    formData,
    setFormData: handleInputChange,
    currentStep: voiceStep,
    setCurrentStep: handleVoiceStepChange,
    onAnalyze: handleAnalyze
  });

  const getVoiceFieldDef = (key) => {
    for (const step of WIZARD_VOICE_SCHEMA) {
      const f = step.fields?.find(field => field.key === key);
      if (f) return f;
    }
    return { key, type: 'text' };
  };

  const getVoiceActiveBorder = (fieldKey) => {
    return isVoiceModeOn && currentFieldKey === fieldKey
      ? 'ring-2 ring-[#0F766E] border-[#0F766E] shadow-sm bg-[#F0FDFA]'
      : '';
  };

  // 5 Progressive Stages Structure
  const stages = [
    { 
      num: 1, 
      label: t('wizard_stage_1', isHindi ? 'आपके बारे में' : 'About you'), 
      icon: User,
      title: isHindi ? 'व्यक्तिगत जानकारी' : 'About You',
      reason: t('wizard_reason_1', isHindi ? 'यह हमें आपके राज्य एवं क्षेत्र के लिए लागू सरकारी योजनाओं की पहचान करने में मदद करता है।' : 'This helps us identify central and state-specific schemes meant for your domicile.')
    },
    { 
      num: 2, 
      label: t('wizard_stage_2', isHindi ? 'आपकी आवश्यकता' : 'Your need'), 
      icon: Target,
      title: isHindi ? 'आवश्यकता एवं लक्ष्य' : 'Your Need & Goal',
      reason: t('wizard_reason_2', isHindi ? 'बताएं कि आपको किस प्रकार की वित्तीय सहायता या सब्सिडी चाहिए ताकि सटीक योजनाएं मिल सकें।' : 'Tell us what assistance you need so we can match the exact subsidy, loan, or training grant.')
    },
    { 
      num: 3, 
      label: t('wizard_stage_3', isHindi ? 'आपकी स्थिति' : 'Your situation'), 
      icon: Users,
      title: isHindi ? 'सामाजिक पृष्ठभूमि व उद्यम स्थिति' : 'Your Situation',
      reason: t('wizard_reason_3', isHindi ? 'सरकारी योजनाएं आय सीमा और सामाजिक पृष्ठभूमि के आधार पर अधिक सब्सिडी प्रदान करती हैं। डेटा पूरी तरह सुरक्षित रहता है।' : 'Government benefits offer higher subsidies based on income slab and social background. All data stays private.')
    },
    { 
      num: 4, 
      label: t('wizard_stage_4', isHindi ? 'दस्तावेज़' : 'Documents'), 
      icon: FileCheck,
      title: isHindi ? 'उपलब्ध दस्तावेज़' : 'Documents',
      reason: t('wizard_reason_4', isHindi ? 'जांचें कि आपके पास कौन से कागज़ तैयार हैं। यदि कुछ नहीं भी हैं, तो भी योजनाएं खोजी जा सकती हैं!' : 'Check which documents you have ready. You can still discover schemes even if some are missing!')
    },
    { 
      num: 5, 
      label: t('wizard_stage_5', isHindi ? 'योजनाएं खोजें' : 'Find my schemes'), 
      icon: Sparkles,
      title: isHindi ? 'समीक्षा एवं योजना खोज' : 'Find My Schemes',
      reason: t('wizard_reason_5', isHindi ? 'योजना मिलान से पहले अपने मुख्य विवरणों की समीक्षा करें। एक क्लिक में सभी योग्य योजनाएं देखें।' : 'Review your key details before evaluating against 15+ verified central and state welfare databases.')
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      
      {/* Phone Call Assistant Alternative Banner */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F0FDFA] border border-[#14B8A6]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-xs font-black text-base">
            📞
          </div>
          <div>
            <div className="font-extrabold text-[#173B57] text-sm flex items-center gap-2">
              <span>{t('wizard_banner_alt', isHindi ? 'कंप्यूटर पर फॉर्म नहीं भरना चाहते?' : 'Prefer voice or phone call?')}</span>
              <span className="text-[#115E59] bg-[#CCFBF1] border border-[#14B8A6]/30 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                {t('wizard_banner_badge', isHindi ? 'टोल-फ्री हेल्पलाइन' : 'Toll-Free Helpline')}
              </span>
            </div>
            <p className="text-slate-600 text-xs mt-0.5">
              {t('wizard_banner_desc', isHindi ? '2 मिनट के स्वचालित फोन कॉल पर पूरा फॉर्म बोलकर भरें। कीपैड या आवाज़ से उत्तर दें।' : 'Complete your profile in a 2-minute automated phone call. Answer with speech or keypad.')}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('yojnasetu_open_call_assistant'))}
          className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-extrabold text-xs shadow-xs transition active:scale-95 shrink-0 flex items-center gap-1.5 min-h-[38px]"
        >
          <span>{t('wizard_banner_btn', isHindi ? '📞 कॉल शुरू करें ↗' : '📞 Call Helpline ↗')}</span>
        </button>
      </div>

      {/* Wizard Header with Calm Step Indicator */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#0F766E] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{isHindi ? 'योजना खोज यात्रा' : 'Find Schemes Discovery'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#173B57]">
            {isHindi 
              ? `चरण ${currentStep} / 5 — ${stages[currentStep - 1]?.label}` 
              : `Step ${currentStep} of 5 — ${stages[currentStep - 1]?.label}`}
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            {stages[currentStep - 1]?.reason}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleVoiceMode}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs border min-h-[38px] ${
              isVoiceModeOn
                ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500 animate-pulse'
                : 'bg-[#0F766E] hover:bg-[#115E59] text-white border-[#0F766E]'
            }`}
            title={isHindi ? "बोलकर पूरा फॉर्म भरें" : "Fill with voice"}
          >
            {isVoiceModeOn ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isVoiceModeOn ? t('wizard_voice_on', isHindi ? '🎤 आवाज़ मोड चालू' : '🎤 Voice Active') : t('wizard_voice_btn', isHindi ? '🎤 बोलकर भरें' : '🎤 Speak')}</span>
          </button>

          <button
            type="button"
            onClick={loadDemoData}
            className="px-3.5 py-2 rounded-xl bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#14B8A6]/40 text-xs font-bold transition flex items-center gap-1.5 shadow-xs min-h-[38px]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('wizard_demo_btn', isHindi ? 'डेमो प्रोफ़ाइल' : 'Demo Profile')}</span>
          </button>
        </div>
      </div>

      {/* Voice-Only Mode Visual Overlay */}
      {isVoiceModeOn && (
        <VoiceWizardOverlay
          sessionState={sessionState}
          currentQuestion_hi={currentQuestion_hi}
          currentHint_hi={currentHint_hi}
          currentFieldLabel_hi={currentFieldLabel_hi}
          liveCaption={liveCaption}
          fieldProgress={fieldProgress}
          pendingAdvance={pendingAdvance}
          onCancelAdvance={cancelAutoAdvance}
          onConfirmAdvance={confirmAutoAdvance}
          onPause={pauseVoiceMode}
          onRepeat={repeatCurrentQuestion}
          onBack={goToPreviousField}
        />
      )}

      {/* 5-Stage Visual Progress Bar */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        {stages.map((s) => {
          const IconComponent = s.icon;
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num;
          return (
            <button
              key={s.num}
              type="button"
              onClick={() => setCurrentStep(s.num)}
              className={`p-2.5 rounded-xl border transition flex flex-col sm:flex-row items-center justify-center gap-1.5 min-h-[44px] ${
                isActive
                  ? 'bg-[#0F766E] border-[#0F766E] text-white shadow-xs font-bold'
                  : isDone
                  ? 'bg-[#CCFBF1] border-[#14B8A6]/40 text-[#115E59] font-semibold hover:bg-[#CCFBF1]/80'
                  : 'bg-white border-[#E2E8F0] text-slate-400 hover:text-[#173B57] hover:border-slate-300'
              }`}
            >
              <IconComponent className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline text-xs truncate">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Step Form Container */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs text-[#173B57] text-xs space-y-6">
        
        {/* ──────── STAGE 1: ABOUT YOU ──────── */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="border-b border-[#E2E8F0] pb-3">
              <h2 className="text-lg font-bold text-[#173B57]">
                {stages[0].title}
              </h2>
              <p className="text-xs text-[#0F766E] font-medium mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{stages[0].reason}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="fullName" className="block text-slate-600 font-semibold">{t('field_full_name', 'Full Name')}</label>
                  <InlineMicrophoneButton
                    fieldDef={getVoiceFieldDef('fullName')}
                    onValueCaptured={(val) => handleInputChange('fullName', val)}
                  />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder={t('field_full_name_placeholder', 'e.g. Sunita Devi')}
                  className={`w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1] min-h-[40px] ${getVoiceActiveBorder('fullName')}`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="age" className="block text-slate-600 font-semibold">{t('field_age', 'Age (Years)')}</label>
                  <InlineMicrophoneButton
                    fieldDef={getVoiceFieldDef('age')}
                    onValueCaptured={(val) => handleInputChange('age', val)}
                  />
                </div>
                <input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', Number(e.target.value))}
                  className={`w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1] min-h-[40px] ${getVoiceActiveBorder('age')}`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="gender" className="block text-slate-600 font-semibold">{t('field_gender', 'Gender')}</label>
                  <InlineMicrophoneButton
                    fieldDef={getVoiceFieldDef('gender')}
                    onValueCaptured={(val) => handleInputChange('gender', val)}
                  />
                </div>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className={`w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1] min-h-[40px] ${getVoiceActiveBorder('gender')}`}
                >
                  <option value="Female">{t('field_gender_female', 'Female')}</option>
                  <option value="Male">{t('field_gender_male', 'Male')}</option>
                  <option value="Transgender">{t('field_gender_trans', 'Transgender')}</option>
                  <option value="Other">{t('field_gender_other', 'Other')}</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="state" className="block text-slate-600 font-semibold">{t('field_state', 'State')}</label>
                  <InlineMicrophoneButton
                    fieldDef={getVoiceFieldDef('state')}
                    onValueCaptured={(val) => handleInputChange('state', val)}
                  />
                </div>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className={`w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1] min-h-[40px] ${getVoiceActiveBorder('state')}`}
                >
                  <option value="Bihar">{isHindi ? 'बिहार' : 'Bihar'}</option>
                  <option value="Punjab">{isHindi ? 'पंजाब' : 'Punjab'}</option>
                  <option value="Uttar Pradesh">{isHindi ? 'उत्तर प्रदेश' : 'Uttar Pradesh'}</option>
                  <option value="Jharkhand">{isHindi ? 'झारखंड' : 'Jharkhand'}</option>
                  <option value="Maharashtra">{isHindi ? 'महाराष्ट्र' : 'Maharashtra'}</option>
                  <option value="Rajasthan">{isHindi ? 'राजस्थान' : 'Rajasthan'}</option>
                  <option value="Madhya Pradesh">{isHindi ? 'मध्य प्रदेश' : 'Madhya Pradesh'}</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="district" className="block text-slate-600 font-semibold">{t('field_district', 'District / City')}</label>
                  <InlineMicrophoneButton
                    fieldDef={getVoiceFieldDef('district')}
                    onValueCaptured={(val) => handleInputChange('district', val)}
                  />
                </div>
                <input
                  id="district"
                  name="district"
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  placeholder={isHindi ? "जैसे: पटना या लुधियाना" : "e.g. Patna"}
                  className={`w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1] min-h-[40px] ${getVoiceActiveBorder('district')}`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="areaType" className="block text-slate-600 font-semibold">{t('field_area_type', 'Area Type')}</label>
                  <InlineMicrophoneButton
                    fieldDef={getVoiceFieldDef('areaType')}
                    onValueCaptured={(val) => handleInputChange('areaType', val)}
                  />
                </div>
                <select
                  id="areaType"
                  name="areaType"
                  value={formData.areaType}
                  onChange={(e) => handleInputChange('areaType', e.target.value)}
                  className={`w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1] min-h-[40px] ${getVoiceActiveBorder('areaType')}`}
                >
                  <option value="Rural">{t('field_area_rural', isHindi ? 'ग्रामीण (Rural)' : 'Rural')}</option>
                  <option value="Urban">{t('field_area_urban', isHindi ? 'शहरी (Urban)' : 'Urban')}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ──────── STAGE 2: YOUR NEED ──────── */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="border-b border-[#E2E8F0] pb-3">
              <h2 className="text-lg font-bold text-[#173B57]">
                {stages[1].title}
              </h2>
              <p className="text-xs text-[#0F766E] font-medium mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{stages[1].reason}</span>
              </p>
            </div>

            {/* Persona Goal Selector (myScheme inspired) */}
            <div className="space-y-2">
              <label className="block text-slate-600 font-semibold">
                {isHindi ? 'आप किस भूमिका के लिए योजना खोज रहे हैं?' : 'What role best describes your need?'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'entrepreneur', icon: '🏭', label: isHindi ? 'उद्यमी / व्यवसाय' : 'Entrepreneur / Business' },
                  { id: 'farmer', icon: '🌾', label: isHindi ? 'किसान / कृषि' : 'Farmer / Agriculture' },
                  { id: 'student', icon: '🎓', label: isHindi ? 'छात्र / युवा' : 'Student / Youth' },
                  { id: 'artisan', icon: '🎨', label: isHindi ? 'कारीगर / शिल्पी' : 'Artisan / Craftsman' }
                ].map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setPersonaType(p.id)}
                    className={`p-3 rounded-xl border text-center cursor-pointer transition flex flex-col items-center gap-1 ${
                      personaType === p.id
                        ? 'bg-[#F0FDFA] border-[#0F766E] text-[#0F766E] font-bold shadow-xs'
                        : 'bg-white border-[#E2E8F0] text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xl">{p.icon}</span>
                    <span className="text-xs">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="sector" className="block text-slate-600 font-semibold">{t('field_sector', 'Business Sector / Field')}</label>
                  <InlineMicrophoneButton
                    fieldDef={getVoiceFieldDef('sector')}
                    onValueCaptured={(val) => handleInputChange('sector', val)}
                  />
                </div>
                <select
                  id="sector"
                  name="sector"
                  value={formData.sector}
                  onChange={(e) => handleInputChange('sector', e.target.value)}
                  className={`w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1] min-h-[40px] ${getVoiceActiveBorder('sector')}`}
                >
                  <option value="Food processing">{isHindi ? 'खाद्य प्रसंस्करण (Food Processing)' : 'Food processing'}</option>
                  <option value="Manufacturing">{isHindi ? 'विनिर्माण / उत्पादन (Manufacturing)' : 'Manufacturing'}</option>
                  <option value="Services">{isHindi ? 'सेवा क्षेत्र (Services)' : 'Services'}</option>
                  <option value="Dairy">{isHindi ? 'डेयरी व पशुपालन (Dairy & Animal Husbandry)' : 'Dairy'}</option>
                  <option value="Retail">{isHindi ? 'खुदरा व्यापार (Retail Store)' : 'Retail'}</option>
                  <option value="Textiles">{isHindi ? 'वस्त्र एवं हथकरघा (Textiles / Handloom)' : 'Textiles / Handloom'}</option>
                  <option value="Agriculture allied">{isHindi ? 'कृषि आधारित (Agriculture allied)' : 'Agriculture allied'}</option>
                  <option value="Trading">{isHindi ? 'थोक व खुदरा व्यापार (Trading)' : 'Trading'}</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="fundingAmount" className="block text-slate-600 font-semibold">
                    {t('field_funding_amount', 'Required Financial Support (₹)')}
                  </label>
                  <InlineMicrophoneButton
                    fieldDef={getVoiceFieldDef('fundingAmount')}
                    onValueCaptured={(val) => handleInputChange('fundingAmount', val)}
                  />
                </div>
                <input
                  id="fundingAmount"
                  name="fundingAmount"
                  type="number"
                  step="50000"
                  value={formData.fundingAmount}
                  onChange={(e) => handleInputChange('fundingAmount', Number(e.target.value))}
                  className={`w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1] font-bold min-h-[40px] ${getVoiceActiveBorder('fundingAmount')}`}
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  ₹{(formData.fundingAmount / 100000).toFixed(1)} {isHindi ? 'लाख (Mudra/PMEGP ऋण सीमा के अनुसार)' : 'Lakh (Within PMEGP/Mudra limits)'}
                </span>
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="fundingPurpose" className="block text-slate-600 font-semibold">{t('field_funding_purpose', 'Specific Goal / Funding Purpose')}</label>
                  <InlineMicrophoneButton
                    fieldDef={getVoiceFieldDef('fundingPurpose')}
                    onValueCaptured={(val) => handleInputChange('fundingPurpose', val)}
                  />
                </div>
                <input
                  id="fundingPurpose"
                  name="fundingPurpose"
                  type="text"
                  value={formData.fundingPurpose}
                  onChange={(e) => handleInputChange('fundingPurpose', e.target.value)}
                  placeholder={isHindi ? "जैसे: मशीनरी खरीद, दुकान विस्तार, कच्चा माल" : "e.g. Machinery procurement, equipment or working capital"}
                  className={`w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1] min-h-[40px] ${getVoiceActiveBorder('fundingPurpose')}`}
                />
              </div>

              {/* Assistance Type Checkboxes */}
              <div className="sm:col-span-2 space-y-2 pt-1">
                <label className="block text-slate-600 font-semibold">{isHindi ? 'किस प्रकार की सरकारी सहायता चाहिए?' : 'Assistance type preferred:'}</label>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { id: 'Loan', label: isHindi ? 'कम ब्याज ऋण (Bank Loan)' : 'Low-Interest Loan' },
                    { id: 'Subsidy', label: isHindi ? 'सरकारी सब्सिडी (Govt Subsidy)' : 'Direct Subsidy' },
                    { id: 'Equipment', label: isHindi ? 'मशीनरी / उपकरण सहायता' : 'Machinery / Tools Support' }
                  ].map((item) => {
                    const isChecked = (formData.fundingType || []).includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleFundingType(item.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 min-h-[38px] ${
                          isChecked
                            ? 'bg-[#F0FDFA] border-[#0F766E] text-[#0F766E] font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isChecked ? 'text-[#0F766E]' : 'text-slate-300'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──────── STAGE 3: YOUR SITUATION ──────── */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="border-b border-[#E2E8F0] pb-3">
              <h2 className="text-lg font-bold text-[#173B57]">
                {stages[2].title}
              </h2>
              <p className="text-xs text-[#0F766E] font-medium mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{stages[2].reason}</span>
              </p>
            </div>

            {/* Income & Social Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="familyIncome" className="block text-slate-600 font-semibold">{t('field_annual_income', 'Annual Family Income (₹)')}</label>
                  <InlineMicrophoneButton
                    fieldDef={getVoiceFieldDef('familyIncome')}
                    onValueCaptured={(val) => handleInputChange('familyIncome', val)}
                  />
                </div>
                <input
                  id="familyIncome"
                  name="familyIncome"
                  type="number"
                  value={formData.familyIncome}
                  onChange={(e) => handleInputChange('familyIncome', Number(e.target.value))}
                  className={`w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1] min-h-[40px] ${getVoiceActiveBorder('familyIncome')}`}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="category" className="block text-slate-600 font-semibold">{t('field_category', 'Category / Social Group')}</label>
                  <InlineMicrophoneButton
                    fieldDef={getVoiceFieldDef('category')}
                    onValueCaptured={(val) => handleInputChange('category', val)}
                  />
                </div>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1] min-h-[40px] ${getVoiceActiveBorder('category')}`}
                >
                  <option value="SC">{isHindi ? 'अनुसूचित जाति (SC)' : 'Scheduled Caste (SC)'}</option>
                  <option value="ST">{isHindi ? 'अनुसूचित जनजाति (ST)' : 'Scheduled Tribe (ST)'}</option>
                  <option value="OBC">{isHindi ? 'अन्य पिछड़ा वर्ग (OBC)' : 'Other Backward Class (OBC)'}</option>
                  <option value="EWS">{isHindi ? 'आर्थिक रूप से कमजोर वर्ग (EWS)' : 'Economically Weaker Section (EWS)'}</option>
                  <option value="General">{isHindi ? 'सामान्य श्रेणी (General)' : 'General Category'}</option>
                </select>
              </div>

              {/* Special Priority Checkboxes */}
              <div className="sm:col-span-2 space-y-2 pt-1 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
                <span className="font-bold text-slate-700 text-xs block">
                  {isHindi ? 'विशेष प्राथमिकता समूह (अधिक सरकारी सब्सिडी हेतु):' : 'Special Priority Criteria (for maximum subsidy):'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="isWomanEntrepreneur"
                      checked={formData.isWomanEntrepreneur}
                      onChange={(e) => handleInputChange('isWomanEntrepreneur', e.target.checked)}
                      className="accent-[#0F766E] w-4 h-4 rounded"
                    />
                    <span className="text-slate-700 font-medium">{t('field_is_woman', isHindi ? 'महिला उद्यमी' : 'Woman Entrepreneur')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="isFirstGeneration"
                      checked={formData.isFirstGeneration}
                      onChange={(e) => handleInputChange('isFirstGeneration', e.target.checked)}
                      className="accent-[#0F766E] w-4 h-4 rounded"
                    />
                    <span className="text-slate-700 font-medium">{isHindi ? 'प्रथम पीढ़ी उद्यमी' : 'First Gen Entrepreneur'}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="isPwD"
                      checked={formData.isPwD}
                      onChange={(e) => handleInputChange('isPwD', e.target.checked)}
                      className="accent-[#0F766E] w-4 h-4 rounded"
                    />
                    <span className="text-slate-700 font-medium">{t('field_is_pwd', isHindi ? 'दिव्यांगजन (PwD)' : 'Person with Disability')}</span>
                  </label>
                </div>
              </div>

              {/* Conditional Enterprise Fields */}
              <div className="sm:col-span-2 space-y-3 pt-2">
                <span className="font-bold text-[#173B57] text-xs block border-b border-slate-200 pb-1">
                  {isHindi ? 'उद्यम / व्यवसाय विवरण (यदि लागू हो):' : 'Enterprise / Business Information (if applicable):'}
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="businessName" className="block text-slate-600 font-semibold mb-1">{t('field_business_name', 'Business Name')}</label>
                    <input
                      id="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder={isHindi ? "जैसे: सुनीता फूड प्रोडक्ट्स" : "e.g. Sunita Food Products"}
                      className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] min-h-[40px]"
                    />
                  </div>

                  <div>
                    <label htmlFor="stage" className="block text-slate-600 font-semibold mb-1">{t('field_stage', 'Business Stage')}</label>
                    <select
                      id="stage"
                      value={formData.stage}
                      onChange={(e) => handleInputChange('stage', e.target.value)}
                      className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] min-h-[40px]"
                    >
                      <option value="Idea">{t('field_stage_idea', 'Idea')}</option>
                      <option value="New business">{t('field_stage_new', 'New business')}</option>
                      <option value="Existing business">{t('field_stage_existing', 'Existing business')}</option>
                      <option value="Expansion">{t('field_stage_expansion', 'Expansion')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="annualTurnover" className="block text-slate-600 font-semibold mb-1">{t('field_annual_turnover', 'Annual Turnover (₹)')}</label>
                    <input
                      id="annualTurnover"
                      type="number"
                      value={formData.annualTurnover}
                      onChange={(e) => handleInputChange('annualTurnover', Number(e.target.value))}
                      className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] min-h-[40px]"
                    />
                  </div>

                  <div>
                    <label htmlFor="udyamStatus" className="block text-slate-600 font-semibold mb-1">{t('field_udyam_status', 'Udyam Registration Status')}</label>
                    <select
                      id="udyamStatus"
                      value={formData.udyamStatus}
                      onChange={(e) => handleInputChange('udyamStatus', e.target.value)}
                      className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] min-h-[40px]"
                    >
                      <option value="Registered">{t('field_udyam_registered', 'Registered')}</option>
                      <option value="Not Registered">{t('field_udyam_not_registered', 'Not Registered')}</option>
                      <option value="Applied">{t('field_udyam_in_process', 'Applied')}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ──────── STAGE 4: DOCUMENTS ──────── */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="border-b border-[#E2E8F0] pb-3">
              <h2 className="text-lg font-bold text-[#173B57]">
                {stages[3].title}
              </h2>
              <p className="text-xs text-[#0F766E] font-medium mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{stages[3].reason}</span>
              </p>
            </div>

            {/* Document OCR Zone Banner */}
            <div className="p-4 rounded-xl bg-[#F0FDFA] border border-[#14B8A6]/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-[#0F766E] shrink-0" />
                <span className="text-slate-700">
                  {isHindi ? 'क्या आप दस्तावेज़ फोटो से स्वतः विवरण भरना चाहते हैं?' : 'Want AI to automatically extract data from your Aadhaar or Udyam certificate?'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/doc-verify')}
                className="ys-btn-primary py-1.5 px-3.5 text-xs shrink-0 min-h-[36px]"
              >
                {isHindi ? 'फोटो स्कैन खोलें →' : 'Open Photo Scanner →'}
              </button>
            </div>

            {/* Available Documents Checklist */}
            <div className="space-y-2">
              <label className="block text-slate-700 font-semibold text-xs">
                {isHindi ? 'वर्तमान में आपके पास कौन से दस्तावेज़ उपलब्ध हैं?' : 'Select all documents currently available with you:'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {[
                  'Income Certificate',
                  'Category Certificate',
                  'Business Registration',
                  'Aadhaar/Identity',
                  'Udyam Certificate',
                  'Project Report',
                  'Bank Statement'
                ].map((doc, idx) => {
                  const isSelected = (formData.documentsAvailable || []).includes(doc);
                  const docLabels = {
                    'Income Certificate': isHindi ? 'आय प्रमाण पत्र' : 'Income Certificate',
                    'Category Certificate': isHindi ? 'जाति / श्रेणी प्रमाण पत्र' : 'Category Certificate',
                    'Business Registration': isHindi ? 'व्यवसाय पंजीकरण प्रमाण' : 'Business Registration',
                    'Aadhaar/Identity': isHindi ? 'आधार कार्ड / पहचान प्रमाण' : 'Aadhaar / Identity Proof',
                    'Udyam Certificate': isHindi ? 'उद्यम आधार प्रमाण पत्र' : 'Udyam Certificate',
                    'Project Report': isHindi ? 'प्रोजेक्ट रिपोर्ट (DPR)' : 'Project Report (DPR)',
                    'Bank Statement': isHindi ? 'बैंक खाता विवरण (पासबुक)' : 'Bank Statement / Passbook'
                  };
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleDocument(doc)}
                      className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between min-h-[44px] ${
                        isSelected
                          ? 'bg-[#F0FDFA] border-[#0F766E] text-[#115E59] font-bold shadow-xs'
                          : 'bg-white border-[#E2E8F0] text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs">{docLabels[doc] || doc}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DigiLocker Notice */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
              <span className="text-base">🔒</span>
              <span>
                {isHindi 
                  ? 'डिजीलॉकर से सरकारी प्रमाणित दस्तावेज़ जोड़ने की सुविधा परिणाम पृष्ठ पर उपलब्ध रहेगी।'
                  : 'Govt verified DigiLocker fetching is available during 1-click apply on the matches page.'}
              </span>
            </div>
          </div>
        )}

        {/* ──────── STAGE 5: FIND MY SCHEMES (REVIEW) ──────── */}
        {currentStep === 5 && (
          <div className="space-y-5">
            <div className="border-b border-[#E2E8F0] pb-3">
              <h2 className="text-lg font-bold text-[#173B57]">
                {stages[4].title}
              </h2>
              <p className="text-xs text-[#0F766E] font-medium mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{stages[4].reason}</span>
              </p>
            </div>

            {/* Scannable Profile Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F766E] uppercase text-[10px] tracking-wider">
                    {isHindi ? 'व्यक्तिगत व सामाजिक विवरण' : 'Personal & Location'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-[11px] text-[#0F766E] font-bold hover:underline"
                  >
                    {isHindi ? 'संशोधन करें' : 'Edit'}
                  </button>
                </div>
                <div className="text-sm font-bold text-[#173B57]">
                  {formData.fullName || (isHindi ? 'नागरिक' : 'Citizen')} ({formData.age} {isHindi ? 'वर्ष' : 'yrs'}, {formData.gender})
                </div>
                <div className="text-slate-600">
                  {isHindi ? 'स्थान' : 'Location'}: <strong className="text-slate-800">{formData.district}, {formData.state}</strong> ({formData.areaType})
                </div>
                <div className="text-slate-600">
                  {isHindi ? 'सामाजिक वर्ग' : 'Category'}: <strong className="text-slate-800">{formData.category}</strong>
                </div>
              </div>

              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#173B57] uppercase text-[10px] tracking-wider">
                    {isHindi ? 'आवश्यकता एवं ऋण' : 'Need & Funding'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-[11px] text-[#0F766E] font-bold hover:underline"
                  >
                    {isHindi ? 'संशोधन करें' : 'Edit'}
                  </button>
                </div>
                <div className="text-sm font-bold text-[#173B57]">
                  {formData.sector} ({formData.stage})
                </div>
                <div className="text-slate-600">
                  {isHindi ? 'आवश्यक राशि' : 'Required Amount'}: <strong className="text-[#0F766E] text-sm">₹{formData.fundingAmount.toLocaleString('en-IN')}</strong>
                </div>
                <div className="text-slate-600">
                  {isHindi ? 'उद्देश्य' : 'Purpose'}: {formData.fundingPurpose}
                </div>
              </div>

              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                    {isHindi ? 'उद्यम स्थिति' : 'Enterprise Details'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-[11px] text-[#0F766E] font-bold hover:underline"
                  >
                    {isHindi ? 'संशोधन करें' : 'Edit'}
                  </button>
                </div>
                <div className="text-slate-700 font-semibold">
                  {formData.businessName || (isHindi ? 'प्रस्तावित उद्यम' : 'Proposed Unit')}
                </div>
                <div className="text-slate-600">
                  {isHindi ? 'वार्षिक कारोबार' : 'Turnover'}: ₹{(formData.annualTurnover || 0).toLocaleString('en-IN')} • Udyam: {formData.udyamStatus}
                </div>
              </div>

              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-600 uppercase text-[10px] tracking-wider">
                    {isHindi ? 'दस्तावेज़' : 'Documents Ready'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="text-[11px] text-[#0F766E] font-bold hover:underline"
                  >
                    {isHindi ? 'संशोधन करें' : 'Edit'}
                  </button>
                </div>
                <div className="text-slate-700 font-semibold">
                  {formData.documentsAvailable?.length || 0} {isHindi ? 'प्रमाण पत्र तैयार' : 'Certificates Ready'}
                </div>
                <div className="text-slate-500 text-[11px] truncate">
                  {formData.documentsAvailable?.join(', ')}
                </div>
              </div>
            </div>

            {/* Ready Callout Banner */}
            <div className="p-4 rounded-xl bg-[#F0FDFA] border border-[#14B8A6]/40 text-[#115E59] text-center font-bold text-xs">
              {isHindi 
                ? '✓ आपकी प्रोफ़ाइल 15+ केंद्रीय और राज्य योजनाओं में पारदर्शी पात्रता मूल्यांकन के लिए तैयार है!' 
                : '✓ Your profile is ready for transparent, explainable matching across 15+ central and state schemes!'}
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Controls (Strictly One Primary CTA per View) */}
        <div className="flex justify-between items-center pt-6 border-t border-[#E2E8F0] gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="ys-btn-secondary text-xs min-h-[42px] px-4"
            >
              <ArrowLeft className="w-4 h-4" /> 
              <span>{t('wizard_prev', isHindi ? '← पिछला' : '← Back')}</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            {/* Safe Skip for Now Link */}
            {currentStep < 5 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold px-2 py-1 transition"
              >
                {isHindi ? 'अभी छोड़ें (Skip)' : 'Skip for now'}
              </button>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="ys-btn-primary text-xs min-h-[42px] px-5"
              >
                <span>{isHindi ? 'आगे बढ़ें →' : 'Continue →'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading}
                className="ys-btn-primary text-xs min-h-[44px] px-6 shadow-sm font-bold"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? t('wizard_submitting', isHindi ? 'योजनाओं का मूल्यांकन हो रहा है...' : 'Evaluating Schemes...') : (isHindi ? 'मेरी योजनाएं खोजें ↗' : 'Find My Schemes ↗')}</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
