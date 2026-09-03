import React from 'react';
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
  FileCheck
} from 'lucide-react';

export default function LandingPage({ onOpenAiModal }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleDemoProfile = () => {
    navigate('/wizard?demo=true');
  };

  return (
    <div className="space-y-16 py-6 sm:py-10">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-4 pb-12 sm:pb-16 bg-gradient-to-b from-[#F0FDFA]/60 via-[#F7FAFA] to-[#F7FAFA] border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 sm:space-y-8 relative z-10">
          
          {/* Official Emblem Banner */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <img 
              src="/logo.png" 
              alt="Yojna दृष्टि Official Emblem" 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-contain shadow-md border-2 border-[#E2E8F0] p-1 bg-white hover:scale-105 transition-transform" 
            />
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CCFBF1] border border-[#14B8A6]/40 text-[#115E59] text-xs font-bold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Smart India Hackathon 2026 • Problem ID SIH26092</span>
            </div>
          </div>

          <div className="space-y-3 max-w-4xl mx-auto">
            <div className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#0F766E]">
              सत्यमेव जयते • Ministry of Social Justice & Empowerment AI Initiative
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
              { label: 'FIND', icon: Search, text: 'Scheme Discovery', color: 'text-[#F59E0B] bg-amber-50 border-amber-200' },
              { label: 'MATCH', icon: CheckSquare, text: 'Eligibility Engine', color: 'text-[#0F766E] bg-[#CCFBF1] border-[#14B8A6]/40' },
              { label: 'GUIDE', icon: Target, text: 'Document Checklist', color: 'text-[#F59E0B] bg-amber-50 border-amber-200' },
              { label: 'EMPOWER', icon: TrendingUp, text: 'PFMS Fund Tracking', color: 'text-[#0F766E] bg-[#CCFBF1] border-[#14B8A6]/40' }
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
              <span>Track Application & Disbursal</span>
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
            Public Service Innovation
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B57]">
            Empowering Marginalized & Small Entrepreneurs
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Translating complex central and state government policy criteria into simple, transparent, and actionable financial opportunities.
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
            <h3 className="font-bold text-lg text-[#173B57]">DocVerifier AI & OCR</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Scan Aadhaar, Income & Udyam certificates for instant authenticity verification and auto-profile completion.</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:border-[#0F766E] transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] text-[#0F766E] border border-[#CCFBF1] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#173B57]">Application & DBT Tracking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Track every milestone from submission and nodal committee approval to treasury sanction and PFMS bank credit.</p>
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
            <h3 className="font-bold text-lg text-[#173B57]">Multilingual Voice Assistant</h3>
            <p className="text-xs text-slate-600 leading-relaxed">Accessible in English, Hindi, and Punjabi with speech recognition and audio playback for low-literacy citizens.</p>
          </div>

        </div>
      </section>

      {/* How It Works (8-Step Visual Workflow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">Clear & Transparent Journey</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#173B57]">How Yojna दृष्टि Works</h2>
            <p className="text-xs text-slate-500">From single profile input to official fund disbursal in 8 structured steps</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            {[
              { num: '01', title: 'Tell Us About Yourself', desc: 'Enter personal & category details once' },
              { num: '02', title: 'Add Enterprise Scope', desc: 'Business stage, sector, turnover & Udyam' },
              { num: '03', title: 'Eligibility Filtering', desc: 'Rule-based hard criteria verification' },
              { num: '04', title: 'Compatibility Score', desc: 'Weighted scoring for maximum benefits' },
              { num: '05', title: 'Personalized Matches', desc: 'Classified into 🟢 Eligible & 🟡 Verify' },
              { num: '06', title: 'DocVerifier AI Scan', desc: 'Instant OCR check on certificates' },
              { num: '07', title: 'Channel Partner Map', desc: 'Locate authorized nodal bank branches' },
              { num: '08', title: 'End-to-End Tracking', desc: 'Real-time PFMS treasury & DBT updates' }
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
          <h3 className="text-xl font-bold">ScholarSetu — Student Scholarship Portal</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Powers academic scholarship discovery for students pursuing post-matric, STEM, and higher education. Translates complex academic and financial criteria into verified scholarships.
          </p>
          <Link to="/scholarsetu" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:text-[#115E59]">
            Explore ScholarSetu <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] text-[#173B57] space-y-4 shadow-sm hover:border-[#0F766E] transition">
          <div className="w-11 h-11 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] text-[#0F766E] flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold">Company & CSR Provider Portal</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Enables corporate enterprises, foundations, and CSR implementing agencies to publish verified funding opportunities, evaluate candidate eligibility, and monitor verifiable social impact.
          </p>
          <Link to="/provider" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:text-[#115E59]">
            Access Provider Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </section>

    </div>
  );
}
