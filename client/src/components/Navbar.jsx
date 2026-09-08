import React, { useState } from 'react';
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
  Search,
  Phone
} from 'lucide-react';

export default function Navbar({ onOpenAiModal }) {
  const { currentLang, changeLanguage, t } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-sm">
      {/* Top National Portal Accent Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-[#F59E0B] via-white to-[#14B8A6]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Official Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <img 
              src="/logo.png" 
              alt="Yojna दृष्टि Official Emblem" 
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-contain shadow-sm border border-[#E2E8F0] group-hover:scale-105 transition-transform" 
            />
            <div>
              <div className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#173B57] leading-none flex items-center gap-1.5">
                <span>Yojna</span>
                <span className="text-[#0F766E]">दृष्टि</span>
              </div>
              <div className="text-[11px] text-[#0F766E] font-bold tracking-wide mt-0.5 flex items-center gap-1.5">
                <span>Discover. Apply. Track.</span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-[#64748B] text-[10px] hidden sm:inline">GovTech Portal</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm">
            <Link 
              to="/wizard" 
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                isActive('/wizard')
                  ? 'bg-[#0F766E] text-white font-bold shadow-sm'
                  : 'text-[#173B57] hover:text-[#0F766E] hover:bg-[#F0FDFA]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>{t('nav_check_eligibility')}</span>
            </Link>

            <Link 
              to="/doc-verify" 
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                isActive('/doc-verify')
                  ? 'bg-[#0F766E] text-white font-bold shadow-sm'
                  : 'text-[#0F766E] bg-[#CCFBF1]/60 hover:bg-[#CCFBF1] border border-[#14B8A6]/30 font-semibold'
              }`}
            >
              <FileCheck className="w-4 h-4 text-[#0F766E]" />
              <span>DocVerifier</span>
            </Link>

            <Link 
              to="/track-application" 
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                isActive('/track-application')
                  ? 'bg-[#0F766E] text-white font-bold shadow-sm'
                  : 'text-[#173B57] hover:text-[#0F766E] hover:bg-[#F0FDFA]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
              <span>Track Application</span>
            </Link>

            <Link 
              to="/scholarsetu" 
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                isActive('/scholarsetu')
                  ? 'bg-[#0F766E] text-white font-bold shadow-sm'
                  : 'text-[#173B57] hover:text-[#0F766E] hover:bg-[#F0FDFA]'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[#173B57]" />
              <span>{t('nav_scholarsetu')}</span>
            </Link>

            <Link 
              to="/provider" 
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                isActive('/provider')
                  ? 'bg-[#0F766E] text-white font-bold shadow-sm'
                  : 'text-[#173B57] hover:text-[#0F766E] hover:bg-[#F0FDFA]'
              }`}
            >
              <Building2 className="w-4 h-4 text-[#64748B]" />
              <span>{t('nav_provider')}</span>
            </Link>

            <Link 
              to="/sponsorship" 
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                isActive('/sponsorship')
                  ? 'bg-[#0F766E] text-white font-bold shadow-sm'
                  : 'text-[#173B57] hover:text-[#0F766E] hover:bg-[#F0FDFA]'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-[#F59E0B]" />
              <span>{t('nav_sponsorship')}</span>
            </Link>

            <Link 
              to="/admin" 
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                isActive('/admin')
                  ? 'bg-[#173B57] text-white'
                  : 'text-[#64748B] hover:text-[#173B57] hover:bg-slate-100'
              }`}
            >
              {t('nav_admin')}
            </Link>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Phone Call Assistant Helpline CTA */}
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('yojnasetu_open_call_assistant'))}
              title="स्वचालित फोन कॉल पर योजना जानें"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition shadow-sm"
            >
              <Phone className="w-3.5 h-3.5 text-white" />
              <span className="hidden md:inline">📞 कॉल सहायक</span>
            </button>

            {/* Ask AI Voice Assistant CTA */}
            <button
              onClick={onOpenAiModal}
              title="Voice Assistant"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#14B8A6]/40 text-xs font-bold transition shadow-sm"
            >
              <Mic className="w-3.5 h-3.5 text-[#0F766E]" />
              <span className="hidden sm:inline">{t('nav_ask_ai')}</span>
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative flex items-center gap-1 bg-white border border-[#CBD5E1] rounded-lg p-1 text-xs shadow-sm">
              <Globe className="w-3.5 h-3.5 text-[#64748B] ml-1" />
              <select
                value={currentLang}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent text-[#173B57] focus:outline-none cursor-pointer text-xs pr-1 font-semibold"
                aria-label="Select Language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="pa">ਪੰਜਾਬੀ</option>
              </select>
            </div>

            {/* Auth / Profile */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="hidden xl:block text-right">
                  <div className="text-xs font-bold text-[#173B57]">{user?.name}</div>
                  <div className="text-[10px] text-[#0F766E] font-semibold">{user?.role}</div>
                </div>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  title="Logout"
                  className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition border border-[#E2E8F0]"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white text-xs font-bold shadow-sm transition"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#173B57] hover:bg-slate-100 transition border border-[#E2E8F0]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Responsive Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E2E8F0] px-4 py-4 space-y-2 shadow-lg animate-fadeIn">
          <button 
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              window.dispatchEvent(new CustomEvent('yojnasetu_open_call_assistant'));
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm"
          >
            <Phone className="w-4 h-4 text-white" />
            <span>📞 कॉल पर योजना जानें (Free Helpline)</span>
          </button>

          <Link 
            to="/wizard" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#173B57] hover:bg-[#F0FDFA] hover:text-[#0F766E]"
          >
            <Briefcase className="w-4 h-4 text-[#0F766E]" />
            <span>{t('nav_check_eligibility')}</span>
          </Link>

          <Link 
            to="/doc-verify" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#0F766E] bg-[#CCFBF1]/40"
          >
            <FileCheck className="w-4 h-4 text-[#0F766E]" />
            <span>DocVerifier AI</span>
          </Link>

          <Link 
            to="/track-application" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#173B57] hover:bg-[#F0FDFA]"
          >
            <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
            <span>Track Application</span>
          </Link>

          <Link 
            to="/scholarsetu" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#173B57] hover:bg-[#F0FDFA]"
          >
            <GraduationCap className="w-4 h-4 text-[#173B57]" />
            <span>{t('nav_scholarsetu')}</span>
          </Link>

          <Link 
            to="/provider" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#173B57] hover:bg-[#F0FDFA]"
          >
            <Building2 className="w-4 h-4 text-[#64748B]" />
            <span>{t('nav_provider')}</span>
          </Link>

          <Link 
            to="/sponsorship" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#173B57] hover:bg-[#F0FDFA]"
          >
            <HeartHandshake className="w-4 h-4 text-[#F59E0B]" />
            <span>{t('nav_sponsorship')}</span>
          </Link>

          <Link 
            to="/admin" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#64748B] hover:bg-slate-100"
          >
            <span>{t('nav_admin')}</span>
          </Link>
        </div>
      )}
    </header>
  );
}
