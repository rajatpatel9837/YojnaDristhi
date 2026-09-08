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
  X
} from 'lucide-react';
import DocumentOCRUploadZone from '../components/DocumentOCRUploadZone';

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
    <div className="space-y-16 py-6 sm:py-10">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-4 pb-12 sm:pb-16 bg-gradient-to-b from-[#F0FDFA]/60 via-[#F7FAFA] to-[#F7FAFA] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8 relative z-10">
          
          {/* Brand Emblem & SIH 2026 Top Badge */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <img 
              src="/logo.png" 
              alt="Yojna दृष्टि Official Emblem" 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-contain shadow-md border-2 border-[#E2E8F0] p-1 bg-white hover:scale-105 transition-transform" 
            />
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CCFBF1] border border-[#14B8A6]/40 text-[#115E59] text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{t('hero_sih_badge')}</span>
            </div>
          </div>

          <div className="space-y-3 max-w-4xl mx-auto">
            <div className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#0F766E]">
              {t('hero_initiative')}
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#173B57] tracking-tight leading-tight sm:leading-tight">
              {t('hero_heading')}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {t('hero_subheading')}
            </p>
          </div>

          {/* Core Pillars from Brand Emblem: FIND | MATCH | GUIDE | EMPOWER */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-1">
            {[
              { label: t('pillar_find_label'), icon: Search, text: t('pillar_find_desc'), color: 'text-[#F59E0B] bg-amber-50 border-amber-200' },
              { label: t('pillar_match_label'), icon: CheckSquare, text: t('pillar_match_desc'), color: 'text-[#0F766E] bg-[#CCFBF1] border-[#14B8A6]/40' },
              { label: t('pillar_guide_label'), icon: Target, text: t('pillar_guide_desc'), color: 'text-[#F59E0B] bg-amber-50 border-amber-200' },
              { label: t('pillar_empower_label'), icon: TrendingUp, text: t('pillar_empower_desc'), color: 'text-[#0F766E] bg-[#CCFBF1] border-[#14B8A6]/40' }
            ].map((pillar, idx) => (
              <div key={idx} className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 ${pillar.color}`}>
                <pillar.icon className="w-4 h-4" />
                <span className="text-[11px] font-extrabold tracking-wider">{pillar.label}</span>
                <span className="text-[10px] text-slate-600 font-medium">{pillar.text}</span>
              </div>
            ))}
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-wrap justify-center items-center gap-3.5 pt-2">
            <button
              onClick={() => navigate('/wizard')}
              className="px-6 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>{t('hero_cta_primary')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleDemoProfile}
              className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#173B57] font-bold text-sm border border-[#CBD5E1] shadow-sm transition flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#0F766E]" />
              <span>{t('hero_cta_secondary')}</span>
            </button>

            <button
              onClick={() => navigate('/track-application')}
              className="px-5 py-3.5 rounded-xl bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] font-bold text-sm border border-[#14B8A6]/40 shadow-sm transition flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
              <span>{t('hero_cta_track')}</span>
            </button>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('yojnasetu_open_call_assistant'))}
              className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition flex items-center gap-2 active:scale-95 border border-emerald-400/40"
            >
              <Phone className="w-4 h-4 text-emerald-200" />
              <span>{t('hero_cta_call')}</span>
            </button>
          </div>

          {/* Zero-Typing OCR Grassroots Hero Card */}
          <div className="max-w-2xl mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-950 via-[#173B57] to-[#0F766E] text-white shadow-xl border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-300/30">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{t('hero_ocr_badge')}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {t('hero_ocr_title')}
              </h3>
              <p className="text-xs text-slate-200">
                {t('hero_ocr_desc')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSnapModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-2 shrink-0 active:scale-95"
            >
              <Camera className="w-4 h-4 text-slate-950" />
              <span>{t('hero_ocr_btn')}</span>
            </button>
          </div>

          {/* Trust Banner */}
          <div className="pt-2 flex justify-center items-center gap-2 text-xs text-slate-700 font-medium bg-white py-2.5 px-4 rounded-xl border border-[#E2E8F0] shadow-sm max-w-2xl mx-auto">
            <ShieldCheck className="w-4 h-4 text-[#0F766E] shrink-0" />
            <span>{t('disclaimer_trust')}</span>
          </div>

        </div>
      </section>

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

      {/* How It Works (8-Step Visual Workflow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
              {isHindi ? 'पारदर्शी व सुगम यात्रा' : 'Clear & Transparent Journey'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B57]">
              {isHindi ? 'योजना दृष्टि कैसे काम करता है' : 'How Yojna दृष्टि Works'}
            </h2>
            <p className="text-xs text-slate-500">
              {isHindi 
                ? 'एकल प्रोफ़ाइल इनपुट से लेकर बैंक खाते में आधिकारिक संवितरण तक 8 चरण' 
                : 'From single profile input to official fund disbursal in 8 structured steps'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {[
              { 
                num: '01', 
                title: isHindi ? 'अपनी बुनियादी जानकारी बताएं' : 'Tell Us About Yourself', 
                desc: isHindi ? 'व्यक्तिगत और श्रेणी विवरण एक बार दर्ज करें' : 'Enter personal & category details once' 
              },
              { 
                num: '02', 
                title: isHindi ? 'व्यवसाय का दायरा जोड़ें' : 'Add Enterprise Scope', 
                desc: isHindi ? 'व्यवसाय स्तर, क्षेत्र, टर्नओवर और उद्यम स्थिति' : 'Business stage, sector, turnover & Udyam' 
              },
              { 
                num: '03', 
                title: isHindi ? 'सख्त पात्रता फ़िल्टरिंग' : 'Eligibility Filtering', 
                desc: isHindi ? 'नियम-आधारित सरकारी मानदंडों का सत्यापन' : 'Rule-based hard criteria verification' 
              },
              { 
                num: '04', 
                title: isHindi ? 'अनुकूलता स्कोर गणना' : 'Compatibility Score', 
                desc: isHindi ? 'अधिकतम लाभ हेतु भारित स्कोरिंग' : 'Weighted scoring for maximum benefits' 
              },
              { 
                num: '05', 
                title: isHindi ? 'व्यक्तिगत योजना मिलान' : 'Personalized Matches', 
                desc: isHindi ? '🟢 पूर्णतः पात्र और 🟡 सत्यापन आवश्यक में वर्गीकृत' : 'Classified into 🟢 Eligible & 🟡 Verify' 
              },
              { 
                num: '06', 
                title: isHindi ? 'दस्तावेज़ AI व OCR स्कैन' : 'DocVerifier AI Scan', 
                desc: isHindi ? 'प्रमाण पत्रों की तुरंत सत्यता जांच' : 'Instant OCR check on certificates' 
              },
              { 
                num: '07', 
                title: isHindi ? 'चैनल पार्टनर बैंक मैप' : 'Channel Partner Map', 
                desc: isHindi ? 'नज़दीकी अधिकृत नोडल बैंक शाखाएं खोजें' : 'Locate authorized nodal bank branches' 
              },
              { 
                num: '08', 
                title: isHindi ? 'संवितरण व PFMS ट्रैकिंग' : 'End-to-End Tracking', 
                desc: isHindi ? 'ट्रेजरी स्वीकृति और बैंक खाते में DBT अपडेट' : 'Real-time PFMS treasury & DBT updates' 
              }
            ].map((step, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#F7FAFA] border border-[#E2E8F0] hover:border-[#14B8A6] transition space-y-2">
                <span className="text-xs font-black text-[#0F766E] font-mono bg-[#CCFBF1] px-2 py-0.5 rounded">{step.num}</span>
                <h4 className="font-bold text-[#173B57] text-xs pt-1">{step.title}</h4>
                <p className="text-[11px] text-slate-500 leading-normal">{step.desc}</p>
              </div>
            ))}
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
