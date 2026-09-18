import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Mic, 
  Globe, 
  ShieldCheck, 
  User, 
  LogOut, 
  Briefcase, 
  GraduationCap, 
  Building2, 
  HeartHandshake, 
  FileCheck,
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown,
  Sparkles,
  Search,
  ExternalLink,
  ArrowRight,
  Info,
  LifeBuoy,
  Zap
} from 'lucide-react';

/**
 * Navbar Component
 * Upgraded to prioritized Information Architecture:
 * 1. Primary Citizen Links: Find schemes, Search schemes, Quick apply, Track application, Document verifier, ScholarSetu
 * 2. More Dropdown: Provider portal, Sponsorship, About YojnaSetu, Contact & Support, Admin
 * 3. Single standard primary navigation CTA: "Find schemes"
 * 4. Quiet utility actions for voice and call assistance
 * 5. Full multilingual support (English, Hindi, Punjabi)
 */
export default function Navbar({ onOpenAiModal }) {
  const { currentLang, changeLanguage, t, isHindi } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Handle Search Input Change for Mobile Drawer
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Submit search query
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim().length > 0) {
      setMobileMenuOpen(false);
      navigate(`/matches?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMoreDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  }, [location.pathname]);

  // Navigate/Scroll to Scheme Discovery Hub
  const handleSearchSchemesClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const hub = document.getElementById('scheme-discovery');
      if (hub) {
        hub.scrollIntoView({ behavior: 'smooth' });
        const input = document.getElementById('scheme-discovery-search-input');
        if (input) input.focus();
      }
    } else {
      navigate('/#scheme-discovery');
      setTimeout(() => {
        const hub = document.getElementById('scheme-discovery');
        if (hub) {
          hub.scrollIntoView({ behavior: 'smooth' });
          const input = document.getElementById('scheme-discovery-search-input');
          if (input) input.focus();
        }
      }, 150);
    }
  };

  // Quick Apply handler: route to matches if profile exists, otherwise to wizard
  const handleQuickApplyClick = (e) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    try {
      const storedProfile = localStorage.getItem('ys_current_profile');
      if (storedProfile) {
        navigate('/matches');
      } else {
        navigate('/wizard');
      }
    } catch {
      navigate('/wizard');
    }
  };

  // Scroll to About or Contact
  const handleScrollToSection = (sectionId) => {
    setMoreDropdownOpen(false);
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const target = document.getElementById(sectionId);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  };

  const isMoreActive = ['/provider', '/sponsorship', '/admin'].includes(location.pathname);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-xs">
      
      {/* Top National Portal Tricolor Accent Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-[#F59E0B] via-white to-[#0F766E]" />

      {/* TIER 1: Official Top Utility Bar */}
      <div className="bg-[#F8FAFC] border-b border-[#E2E8F0] py-1.5 text-xs text-slate-600">
        <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between gap-4">
          
          {/* Note on Left */}
          <div className="flex items-center gap-2 text-xs text-slate-600 truncate">
            <span className="font-extrabold text-[#0F766E] shrink-0">
              {isHindi ? 'नोट:' : 'Note:'}
            </span>
            <span className="truncate font-medium text-slate-700">
              {isHindi 
                ? 'राष्ट्रीय नागरिक कल्याण व योजना पात्रता मिलान पोर्टल • 100% निःशुल्क एवं सुरक्षित सरकारी सेवा' 
                : 'National Citizen Scheme & Public Benefit Matching Portal • 100% Free & Secure Service'}
            </span>
          </div>

          {/* Contact Details & Quiet Utilities on Right */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-xs font-semibold">
            
            {/* Phone contact */}
            <a 
              href="tel:1800111979" 
              className="hidden md:flex items-center gap-1.5 text-slate-700 hover:text-[#0F766E] transition"
              title="National Toll-Free Helpline"
            >
              <Phone className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>1800-11-1979</span>
            </a>

            <span className="hidden md:inline text-slate-300">|</span>

            {/* Email contact */}
            <a 
              href="mailto:support@yojnasetu.gov.in" 
              className="hidden lg:flex items-center gap-1.5 text-slate-700 hover:text-[#0F766E] transition"
              title="Official Citizen Helpdesk"
            >
              <Mail className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>support@yojnasetu.gov.in</span>
            </a>

            <span className="hidden lg:inline text-slate-300">|</span>

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 bg-white border border-[#CBD5E1] rounded-lg px-2.5 py-1 shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-[#0F766E]" />
              <select
                value={currentLang}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent text-[#173B57] font-bold text-xs focus:outline-none cursor-pointer"
                aria-label="Select Language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="pa">ਪੰਜਾਬੀ</option>
                <option value="ml">മലയാളം</option>
                <option value="te">తెలుగు</option>
                <option value="ur">اردو</option>
              </select>
            </div>

            {/* Phone Assistant (Quiet utility action) */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('yojnasetu_open_call_assistant'))}
              title="Toll-Free Helpline / Phone Assistant"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-slate-700 hover:text-[#0F766E] hover:bg-slate-100 rounded-lg text-xs font-semibold transition shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{t('nav_call_assistant')}</span>
            </button>

            {/* Voice Assistant (Quiet utility action) */}
            <button
              type="button"
              onClick={onOpenAiModal}
              title="Voice Assistant"
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-slate-700 hover:text-[#0F766E] hover:bg-slate-100 rounded-lg text-xs font-semibold transition shrink-0"
            >
              <Mic className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{t('nav_ask_ai')}</span>
            </button>

          </div>
        </div>
      </div>

      {/* TIER 2: Main Brand, Prioritized Citizen Navigation & Actions */}
      <div className="w-full max-w-[1680px] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-6">
          
          {/* Left Block: Logo + Navigation Links Shifted to Left with Sufficient Spacing */}
          <div className="flex items-center gap-3 lg:gap-4 xl:gap-6 min-w-0">
            
            {/* Official Brand Logo */}
            <Link to="/" className="flex items-center space-x-2.5 group shrink-0">
              <img 
                src="/logo.png" 
                alt="Yojna दृष्टि Official Emblem" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-contain shadow-xs border border-[#E2E8F0] group-hover:scale-105 transition-transform" 
              />
              <div className="shrink-0">
                <div className="font-black text-lg sm:text-xl tracking-tight text-[#173B57] leading-none flex items-center gap-1">
                  <span>Yojna</span>
                  <span className="text-[#0F766E]">दृष्टि</span>
                </div>
                <div className="text-[9.5px] text-[#0F766E] font-bold tracking-wide mt-0.5 flex items-center gap-1">
                  <span>{t('nav_tagline')}</span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <span className="text-slate-500 text-[9.5px] hidden sm:inline">GovTech Portal</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation: Shifted cleanly to the Left with Professional Spacing */}
            <nav className="hidden lg:flex items-center space-x-1 lg:space-x-1.5 xl:space-x-2.5 font-semibold text-xs xl:text-sm whitespace-nowrap">
              
              {/* 1. Find schemes */}
              <Link 
                to="/wizard" 
                className={`px-2.5 py-1.5 rounded-lg transition relative ${
                  isActive('/wizard') 
                    ? 'text-[#0F766E] font-bold bg-teal-50/60' 
                    : 'text-[#173B57] hover:text-[#0F766E] hover:bg-slate-50'
                }`}
              >
                <span>{t('nav_find_schemes') || (isHindi ? 'योजना खोजें' : 'Find schemes')}</span>
              </Link>

              {/* 2. Search schemes */}
              <button
                type="button"
                onClick={handleSearchSchemesClick}
                className="px-2.5 py-1.5 rounded-lg text-[#173B57] hover:text-[#0F766E] hover:bg-slate-50 transition font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>{t('nav_search_schemes') || (isHindi ? 'योजना सर्च' : 'Search schemes')}</span>
              </button>

              {/* 3. Quick apply */}
              <button 
                type="button"
                onClick={handleQuickApplyClick}
                className="px-2.5 py-1.5 rounded-lg text-[#173B57] hover:text-[#0F766E] hover:bg-slate-50 transition font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>{t('nav_quick_apply') || (isHindi ? 'त्वरित आवेदन' : 'Quick apply')}</span>
              </button>

              {/* 4. Track application */}
              <Link 
                to="/track-application" 
                className={`px-2.5 py-1.5 rounded-lg transition relative ${
                  isActive('/track-application') 
                    ? 'text-[#0F766E] font-bold bg-teal-50/60' 
                    : 'text-[#173B57] hover:text-[#0F766E] hover:bg-slate-50'
                }`}
              >
                <span>{t('nav_track_application') || (isHindi ? 'आवेदन ट्रैक' : 'Track application')}</span>
              </Link>

              {/* 5. Document verifier */}
              <Link 
                to="/doc-verify" 
                className={`px-2.5 py-1.5 rounded-lg transition relative ${
                  isActive('/doc-verify') 
                    ? 'text-[#0F766E] font-bold bg-teal-50/60' 
                    : 'text-[#173B57] hover:text-[#0F766E] hover:bg-slate-50'
                }`}
              >
                <span>{t('nav_doc_verify') || (isHindi ? 'दस्तावेज़ सत्यापन' : 'DocVerifier')}</span>
              </Link>

              {/* 6. ScholarSetu */}
              <Link 
                to="/scholarsetu" 
                className={`px-2.5 py-1.5 rounded-lg transition relative ${
                  isActive('/scholarsetu') 
                    ? 'text-[#0F766E] font-bold bg-teal-50/60' 
                    : 'text-[#173B57] hover:text-[#0F766E] hover:bg-slate-50'
                }`}
              >
                <span>ScholarSetu</span>
              </Link>

              {/* More Menu (Consolidates lower-frequency & partner links) */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 font-semibold ${
                    isMoreActive 
                      ? 'text-[#0F766E] font-bold bg-teal-50/60' 
                      : 'text-[#173B57] hover:text-[#0F766E] hover:bg-slate-50'
                  }`}
                >
                  <span>{t('nav_more_menu', isHindi ? 'अन्य विकल्प' : 'More')}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180 text-[#0F766E]' : 'text-slate-400'}`} />
                </button>

                {/* Single Organized More Dropdown */}
                {moreDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-2 z-50 animate-fadeIn">
                    
                    <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      {t('nav_more_services') || 'Services & Partnerships'}
                    </div>

                    {/* Provider Portal */}
                    <Link
                      to="/provider"
                      className={`flex items-center gap-3 px-3.5 py-2.5 text-xs transition ${
                        isActive('/provider') ? 'bg-[#F0FDFA] text-[#0F766E] font-bold' : 'text-[#173B57] hover:bg-slate-50'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 text-[#0F766E]">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">{t('nav_provider')}</div>
                        <div className="text-[10px] text-slate-500">Corporate & CSR Partnerships</div>
                      </div>
                    </Link>

                    {/* Sponsorship */}
                    <Link
                      to="/sponsorship"
                      className={`flex items-center gap-3 px-3.5 py-2.5 text-xs transition ${
                        isActive('/sponsorship') ? 'bg-[#F0FDFA] text-[#0F766E] font-bold' : 'text-[#173B57] hover:bg-slate-50'
                      }`}
                    >
                      <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                        <HeartHandshake className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">{t('nav_sponsorship')}</div>
                        <div className="text-[10px] text-slate-500">Direct Citizen Support</div>
                      </div>
                    </Link>

                    <div className="border-t border-slate-100 my-1" />

                    {/* About YojnaSetu */}
                    <button
                      type="button"
                      onClick={() => handleScrollToSection('about-section')}
                      className="w-full text-left flex items-center gap-3 px-3.5 py-2 text-xs text-[#173B57] hover:bg-slate-50 transition"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                        <Info className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold">{t('nav_about_yojnasetu') || 'About YojnaSetu'}</span>
                    </button>

                    {/* Contact / Helpline */}
                    <button
                      type="button"
                      onClick={() => handleScrollToSection('contact-section')}
                      className="w-full text-left flex items-center gap-3 px-3.5 py-2 text-xs text-[#173B57] hover:bg-slate-50 transition"
                    >
                      <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                        <LifeBuoy className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-semibold">{t('nav_contact_support') || 'Contact & Support'}</span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    {/* Admin Portal */}
                    <Link
                      to="/admin"
                      className={`flex items-center gap-3 px-3.5 py-2 text-xs transition ${
                        isActive('/admin') ? 'bg-[#173B57] text-white font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="p-1 rounded bg-slate-100 text-slate-700">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold">{t('nav_admin')}</span>
                    </Link>

                  </div>
                )}
              </div>

            </nav>

          </div>

          {/* Right Header Actions (Sufficient space, never cut off) */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 ml-auto pl-3">
            
            {/* Login / Profile Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-[#173B57] font-bold text-xs sm:text-sm">
                  <User className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span className="max-w-[100px] sm:max-w-[120px] truncate">{user?.name}</span>
                </div>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  title="Logout"
                  className="p-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition min-h-[36px] min-w-[36px] flex items-center justify-center border border-slate-200 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl border border-[#CBD5E1] hover:border-[#173B57] text-[#173B57] hover:bg-[#173B57] hover:text-white font-bold text-xs sm:text-sm transition min-h-[38px] shrink-0 whitespace-nowrap shadow-2xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('nav_login', 'Login')}</span>
              </Link>
            )}

            {/* Single Standard Primary Navigation CTA */}
            <Link
              to="/wizard"
              className="hidden sm:flex items-center gap-1.5 px-3.5 sm:px-4 xl:px-4.5 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] active:bg-[#134E4A] text-white font-bold text-xs sm:text-sm shadow-xs transition min-h-[38px] shrink-0 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
              <span className="shrink-0">{t('nav_find_schemes') || (isHindi ? 'योजना खोजें ↗' : 'Find schemes ↗')}</span>
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#173B57] hover:bg-slate-100 transition border border-[#CBD5E1] min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Responsive Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E2E8F0] px-4 py-4 space-y-4 shadow-xl animate-fadeIn max-h-[85vh] overflow-y-auto">
          
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={isHindi ? 'योजना खोजें (मुद्रा, PMEGP)...' : 'Search schemes...'}
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#173B57] font-medium"
            />
          </form>

          {/* Quick Voice Assistant Trigger on Mobile */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAiModal?.();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#F0FDFA] border border-[#14B8A6]/40 text-[#0F766E] font-bold text-xs min-h-[44px]"
          >
            <Mic className="w-4 h-4 text-[#0F766E]" />
            <span>{t('nav_ask_ai')} (Voice AI)</span>
          </button>

          {/* Mobile Primary Priority Links */}
          <div className="space-y-1.5 pt-1">
            
            {/* 1. Find schemes */}
            <Link 
              to="/wizard" 
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition min-h-[44px] ${
                isActive('/wizard') ? 'bg-[#0F766E] text-white' : 'bg-[#F0FDFA] text-[#0F766E]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>{t('nav_find_schemes') || 'Find schemes'}</span>
            </Link>

            {/* 2. Search schemes */}
            <button
              type="button"
              onClick={handleSearchSchemesClick}
              className="w-full text-left flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold text-[#173B57] hover:bg-slate-50 min-h-[44px]"
            >
              <Search className="w-4 h-4 text-[#0F766E]" />
              <span>{t('nav_search_schemes') || 'Search schemes'}</span>
            </button>

            {/* 3. Quick apply */}
            <button
              type="button"
              onClick={handleQuickApplyClick}
              className="w-full text-left flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold text-[#173B57] hover:bg-slate-50 min-h-[44px]"
            >
              <Zap className="w-4 h-4 text-[#0F766E]" />
              <span>{t('nav_quick_apply') || 'Quick apply'}</span>
            </button>

            {/* 4. Track application */}
            <Link 
              to="/track-application" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold text-[#173B57] hover:bg-slate-50 min-h-[44px]"
            >
              <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
              <span>{t('nav_track_application')}</span>
            </Link>

            {/* 5. Document verifier */}
            <Link 
              to="/doc-verify" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold text-[#173B57] hover:bg-slate-50 min-h-[44px]"
            >
              <FileCheck className="w-4 h-4 text-[#0F766E]" />
              <span>{t('nav_doc_verify')}</span>
            </Link>

            {/* 6. ScholarSetu */}
            <Link 
              to="/scholarsetu" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold text-[#173B57] hover:bg-slate-50 min-h-[44px]"
            >
              <GraduationCap className="w-4 h-4 text-[#173B57]" />
              <span>{t('nav_scholarsetu')}</span>
            </Link>

            {/* More / Supporting Section */}
            <div className="border-t border-slate-100 my-2 pt-2 space-y-1">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {t('nav_more_services') || 'Services & Support'}
              </div>

              <Link 
                to="/provider" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#173B57] hover:bg-slate-50 min-h-[44px]"
              >
                <Building2 className="w-4 h-4 text-[#64748B]" />
                <span>{t('nav_provider')}</span>
              </Link>

              <Link 
                to="/sponsorship" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#173B57] hover:bg-slate-50 min-h-[44px]"
              >
                <HeartHandshake className="w-4 h-4 text-[#F59E0B]" />
                <span>{t('nav_sponsorship')}</span>
              </Link>

              <button
                type="button"
                onClick={() => handleScrollToSection('about-section')}
                className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#173B57] hover:bg-slate-50 min-h-[44px]"
              >
                <Info className="w-4 h-4 text-[#64748B]" />
                <span>{t('nav_about_yojnasetu') || 'About YojnaSetu'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleScrollToSection('contact-section')}
                className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#173B57] hover:bg-slate-50 min-h-[44px]"
              >
                <LifeBuoy className="w-4 h-4 text-[#64748B]" />
                <span>{t('nav_contact_support') || 'Contact & Support'}</span>
              </button>

              <Link 
                to="/admin" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-[#64748B] hover:bg-slate-100 min-h-[44px]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t('nav_admin')}</span>
              </Link>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
