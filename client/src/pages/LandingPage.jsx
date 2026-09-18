import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Briefcase, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  MapPin, 
  Calculator, 
  Globe, 
  HeartHandshake, 
  Building2, 
  Users, 
  Award, 
  BookOpen, 
  Search, 
  CheckSquare, 
  Target, 
  TrendingUp, 
  FileCheck,
  Camera,
  Phone,
  X,
  ClipboardList,
  MousePointerClick,
  ChevronRight
} from 'lucide-react';
import DocumentOCRUploadZone from '../components/DocumentOCRUploadZone';
import { SchemeSearchBar, SchemeQuickDiscovery } from '../components/SchemeDiscoveryHub';

export default function LandingPage({ onOpenAiModal }) {
  const { t, isHindi } = useLanguage();
  const navigate = useNavigate();

  const [isSnapModalOpen, setIsSnapModalOpen] = useState(false);
  const [ocrFormData, setOcrFormData] = useState({ documentsAvailable: [] });

  const handleDemoProfile = () => {
    navigate('/wizard?demo=true');
  };

  const handleAutoFillAndNavigate = (extracted) => {
    const existing = localStorage.getItem('ys_current_profile');
    const prevProfile = existing ? JSON.parse(existing) : {};

    const mergedProfile = {
      fullName: extracted.fullName || prevProfile.fullName || 'सुनीता देवी (उद्यमी)',
      age: extracted.age || prevProfile.age || 28,
      gender: extracted.gender || prevProfile.gender || 'Female',
      state: extracted.state || prevProfile.state || 'Bihar',
      district: extracted.district || prevProfile.district || 'Patna',
      sector: extracted.sector || prevProfile.sector || 'Food processing',
      category: extracted.category || prevProfile.category || 'SC',
      isWomanEntrepreneur: extracted.gender ? (extracted.gender.toLowerCase() === 'female') : true,
      fundingAmount: extracted.fundingAmount || prevProfile.fundingAmount || 500000,
      annualTurnover: extracted.annualTurnover || prevProfile.annualTurnover || 400000,
      udyamStatus: extracted.udyamRegistrationNumber ? 'Registered' : (prevProfile.udyamStatus || 'Registered'),
      documentsAvailable: Array.from(new Set([
        ...(prevProfile.documentsAvailable || ['Aadhaar/Identity', 'Income Certificate', 'Category Certificate']),
        ...(extracted.documentsAvailable || [])
      ]))
    };

    localStorage.setItem('ys_current_profile', JSON.stringify(mergedProfile));
    setTimeout(() => {
      setIsSnapModalOpen(false);
      navigate('/matches');
    }, 400);
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      
      {/* 1. Unified Scheme Search & Live Stats Bar (Extended wide, merged seamlessly) */}
      <SchemeSearchBar />

      {/* 3. Hero Section (Middle logo removed as requested, sized for optimal 100% zoom viewport visibility) */}
      <section className="relative overflow-hidden py-5 sm:py-7 bg-gradient-to-b from-[#F0FDFA]/60 via-[#F7FAFA] to-[#F7FAFA] border-t border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4 relative z-10">

          <div className="space-y-1.5 sm:space-y-2 max-w-4xl mx-auto">
            <div className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#0F766E]">
              {t('hero_initiative')}
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-[#173B57] tracking-tight leading-tight sm:leading-snug">
              {t('hero_heading')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {t('hero_subheading')}
            </p>
          </div>

          {/* Core Pillars from Brand Emblem: FIND | MATCH | GUIDE | EMPOWER */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 max-w-2xl mx-auto pt-0.5">
            {[
              { label: t('pillar_find_label'), icon: Search, text: t('pillar_find_desc'), color: 'text-[#F59E0B] bg-amber-50 border-amber-200' },
              { label: t('pillar_match_label'), icon: CheckSquare, text: t('pillar_match_desc'), color: 'text-[#0F766E] bg-[#CCFBF1] border-[#14B8A6]/40' },
              { label: t('pillar_guide_label'), icon: Target, text: t('pillar_guide_desc'), color: 'text-[#F59E0B] bg-amber-50 border-amber-200' },
              { label: t('pillar_empower_label'), icon: TrendingUp, text: t('pillar_empower_desc'), color: 'text-[#0F766E] bg-[#CCFBF1] border-[#14B8A6]/40' }
            ].map((pillar, idx) => (
              <div key={idx} className={`p-2 sm:p-2.5 rounded-xl border flex flex-col items-center justify-center gap-0.5 ${pillar.color}`}>
                <pillar.icon className="w-3.5 h-3.5" />
                <span className="text-[10.5px] font-extrabold tracking-wider">{pillar.label}</span>
                <span className="text-[9.5px] text-slate-600 font-medium">{pillar.text}</span>
              </div>
            ))}
          </div>

          {/* Hero CTAs: Single Primary Action with Clean Secondary Options */}
          <div className="flex flex-wrap justify-center items-center gap-2.5 pt-1">
            <button
              onClick={() => navigate('/wizard')}
              className="ys-btn-primary px-5 py-2.5 text-xs sm:text-sm shadow-sm"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{t('hero_cta_primary')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDemoProfile}
              className="ys-btn-secondary px-4 sm:px-5 py-2.5 text-xs sm:text-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{t('hero_cta_secondary')}</span>
            </button>

            <button
              onClick={() => navigate('/track-application')}
              className="ys-btn-secondary px-4 sm:px-5 py-2.5 text-xs sm:text-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{t('hero_cta_track')}</span>
            </button>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('yojnasetu_open_call_assistant'))}
              className="ys-btn-secondary px-4 sm:px-5 py-2.5 text-xs sm:text-sm"
            >
              <Phone className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{t('hero_cta_call')}</span>
            </button>
          </div>

        </div>
      </section>

      {/* 4. Scheme Quick Discovery Actions (Placed in original location below Hero section) */}
      <SchemeQuickDiscovery 
        onOpenSnapModal={() => setIsSnapModalOpen(true)}
        onOpenAiModal={onOpenAiModal}
      />

      {/* Core Capabilities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-[#0F766E] uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            {isHindi ? 'सार्वजनिक सेवा नवाचार' : 'Public Service Innovation'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B57]">
            {isHindi ? 'वंचित व छोटे उद्यमियों का सशक्तीकरण' : 'Empowering Marginalized & Small Entrepreneurs'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {isHindi 
              ? 'जटिल केंद्रीय व राज्य नीति नियमों को पारदर्शी, सरल व त्वरित वित्तीय अवसरों में बदलना।' 
              : 'Translating complex central and state government policy criteria into simple, transparent, and actionable financial opportunities.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#0F766E] transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] flex items-center justify-center font-bold">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#173B57]">{t('feature_matching_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('feature_matching_desc')}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#0F766E] transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#173B57]">{t('feature_explainable_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('feature_explainable_desc')}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#0F766E] transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] flex items-center justify-center font-bold">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#173B57]">
              {isHindi ? 'दस्तावेज़ सत्यापन AI और OCR' : 'DocVerifier AI & OCR'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHindi 
                ? 'आधार, आय और उद्यम प्रमाण पत्र स्कैन कर तुरंत प्रामाणिकता जांचें और प्रोफ़ाइल भरें।' 
                : 'Scan Aadhaar, Income & Udyam certificates for instant authenticity verification and auto-profile completion.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#0F766E] transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#173B57]">
              {isHindi ? 'आवेदन एवं DBT संवितरण ट्रैकिंग' : 'Application & DBT Tracking'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHindi 
                ? 'नोडल समिति अनुमोदन से लेकर ट्रेजरी स्वीकृति और बैंक खाते में डीबीटी क्रेडिट तक ट्रैक करें।' 
                : 'Track every milestone from submission and nodal committee approval to treasury sanction and PFMS bank credit.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#0F766E] transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#173B57]">{t('feature_partner_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t('feature_partner_desc')}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#0F766E] transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] flex items-center justify-center font-bold">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#173B57]">
              {isHindi ? 'बहुभाषी वॉइस असिस्टेंट' : 'Multilingual Voice Assistant'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isHindi 
                ? 'कम पढ़े-लिखे नागरिकों के लिए हिंदी, अंग्रेजी व पंजाबी में वॉइस इनपुट व ऑडियो प्लेबैक।' 
                : 'Accessible in English, Hindi, and Punjabi with speech recognition and audio playback for low-literacy citizens.'}
            </p>
          </div>

        </div>
      </section>

      {/* How It Works (Simplified 3-Step Clear Workflow inspired by reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white to-[#F0FDFA]/30 border border-[#E2E8F0] p-6 sm:p-12 shadow-xs">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10 sm:mb-12">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isHindi ? 'यह कैसे काम करता है' : 'How it works'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#173B57] tracking-tight">
              {isHindi ? 'सरकारी योजनाओं के लिए आवेदन के सरल चरण' : 'Easy steps to apply for Government Schemes'}
            </h2>
          </div>

          {/* 3 Step Cards with Chevrons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 sm:gap-6">
            
            {/* Step 1: Enter Details */}
            <div className="w-full md:w-1/3 bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#0F766E]/40 transition-all text-center flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-[#F0FDFA] border border-[#CCFBF1] text-[#0F766E] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-2xs">
                <ClipboardList className="w-8 h-8 text-[#0F766E]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0F766E] mb-2">
                {isHindi ? 'विवरण दर्ज करें' : 'Enter Details'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs">
                {isHindi ? (
                  <>अपनी <strong>बुनियादी जानकारी</strong> दर्ज करके या <strong>दस्तावेज़ स्कैन</strong> करके शुरुआत करें!</>
                ) : (
                  <>Start by entering your <strong>basic details</strong> or <strong>scanning your document</strong>!</>
                )}
              </p>
            </div>

            {/* Connecting Chevron 1 */}
            <div className="hidden md:flex items-center justify-center text-[#99F6E4] shrink-0">
              <ChevronRight className="w-8 h-8 text-[#0F766E]/30 stroke-[2.5]" />
            </div>

            {/* Step 2: Search */}
            <div className="w-full md:w-1/3 bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#0F766E]/40 transition-all text-center flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-[#F0FDFA] border border-[#CCFBF1] text-[#0F766E] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-2xs">
                <Search className="w-8 h-8 text-[#0F766E]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0F766E] mb-2">
                {isHindi ? 'योजना खोजें' : 'Search'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs">
                {isHindi ? (
                  <>हमारा खोज इंजन आपके लिए <strong>सर्वाधिक प्रासंगिक योजनाएं</strong> खोजेगा!</>
                ) : (
                  <>Our search engine will <strong>find the relevant schemes</strong> for you!</>
                )}
              </p>
            </div>

            {/* Connecting Chevron 2 */}
            <div className="hidden md:flex items-center justify-center text-[#99F6E4] shrink-0">
              <ChevronRight className="w-8 h-8 text-[#0F766E]/30 stroke-[2.5]" />
            </div>

            {/* Step 3: Select & Apply */}
            <div className="w-full md:w-1/3 bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#0F766E]/40 transition-all text-center flex flex-col items-center group">
              <div className="w-16 h-16 rounded-2xl bg-[#F0FDFA] border border-[#CCFBF1] text-[#0F766E] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shadow-2xs">
                <MousePointerClick className="w-8 h-8 text-[#0F766E]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#0F766E] mb-2">
                {isHindi ? 'चुनें एवं आवेदन करें' : 'Select & Apply'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs">
                {isHindi ? (
                  <>सबसे उपयुक्त योजना <strong>चुनें और मार्गदर्शन के साथ आवेदन करें</strong>!</>
                ) : (
                  <><strong>Select and apply</strong> for the best suited scheme with guidance!</>
                )}
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Ecosystem Modules Promo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] text-[#173B57] space-y-4 shadow-sm hover:border-[#0F766E] transition">
          <div className="w-11 h-11 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] text-[#0F766E] flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold">{t('eco_scholar_title')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('eco_scholar_desc')}
          </p>
          <Link to="/scholarsetu" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:text-[#115E59]">
            {t('eco_scholar_btn')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] text-[#173B57] space-y-4 shadow-sm hover:border-[#0F766E] transition">
          <div className="w-11 h-11 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] text-[#0F766E] flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold">{t('eco_csr_title')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('eco_csr_desc')}
          </p>
          <Link to="/provider" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:text-[#115E59]">
            {t('eco_csr_btn')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </section>

      {/* Zero-Typing OCR Modal */}
      {isSnapModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-900 via-[#173B57] to-[#0F766E] text-white p-5 sm:p-6 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-300/30">
                  <Camera className="w-3 h-3 text-amber-300" />
                  <span>{isHindi ? 'ज़ीरो-टाइपिंग योजना खोज (Zero-Typing)' : 'Zero-Typing Scheme Search'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {isHindi 
                    ? '📸 सिर्फ कागज़ की फोटो डालें — कोई फॉर्म नहीं भरना' 
                    : '📸 Snap Document Photo — No Manual Form Filling'}
                </h2>
                <p className="text-xs text-slate-200">
                  {isHindi 
                    ? 'अपना आधार कार्ड, आय प्रमाण पत्र या उद्यम सर्टिफिकेट अपलोड करें। AI अपने आप जानकारी निकालकर तुरंत योग्य योजनाएं दिखाएगा।' 
                    : 'Upload a photo of your Aadhaar, Income, or Udyam Certificate. AI automatically extracts fields and discovers eligible schemes instantly.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSnapModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95 shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with OCR Upload Zone */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
              <DocumentOCRUploadZone
                formData={ocrFormData}
                setFormData={setOcrFormData}
                onAutoFillProfile={handleAutoFillAndNavigate}
              />

              {/* Action Bar inside modal */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500 text-center sm:text-left">
                  {isHindi 
                    ? '🔒 सुरक्षित सरकारी प्रोटोकॉल। दस्तावेज़ केवल योजना पात्रता मिलान के लिए पढ़े जाते हैं।' 
                    : '🔒 Secure government protocol. Documents are evaluated solely for scheme eligibility assessment.'}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSnapModalOpen(false);
                      navigate('/matches');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 active:scale-95"
                  >
                    <span>{isHindi ? 'सीधे योजनाएं देखें →' : 'View Schemes Directly →'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
