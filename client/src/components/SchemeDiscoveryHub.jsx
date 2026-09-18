import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  Sparkles, 
  FileScan, 
  Mic, 
  ArrowRight, 
  GraduationCap, 
  Briefcase, 
  Building2, 
  Landmark, 
  Layers, 
  Loader2
} from 'lucide-react';
import axios from 'axios';
import SchemeStatsSection from './SchemeStatsSection';

/**
 * SchemeSearchBar Component
 * Polished direct search bar placed at the top (below Navbar),
 * with real-time debounced autocomplete suggestions.
 */
export function SchemeSearchBar() {
  const { t, isHindi } = useLanguage();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced live suggestion fetch
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/schemes/search?q=${encodeURIComponent(query.trim())}&limit=5`);
        if (res.data && res.data.success) {
          setSuggestions(res.data.data || []);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.warn('Live scheme search error:', err.message);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
        setIsOpen(true);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setIsOpen(false);
    if (query.trim()) {
      navigate(`/matches?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/matches');
    }
  };

  const handleSelectSuggestion = (item) => {
    setIsOpen(false);
    if (item.slug) {
      navigate(`/matches?scheme=${encodeURIComponent(item.slug)}`);
    } else if (item.id) {
      navigate(`/matches?scheme=${encodeURIComponent(item.id)}`);
    } else {
      navigate(`/matches?q=${encodeURIComponent(item.name)}`);
    }
  };

  return (
    <section id="scheme-discovery" className="w-full pt-3 pb-3.5 sm:pt-3.5 sm:pb-4 bg-[#F7FAFA] border-b border-[#E2E8F0] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sleek, Thinner Extended Direct Scheme Search Card */}
        <div className="w-full max-w-5xl sm:max-w-6xl mx-auto relative" ref={wrapperRef}>
          <div className="p-1 sm:p-1.5 shadow-2xs border border-[#CBD5E1] bg-white rounded-xl sm:rounded-2xl relative hover:border-[#0F766E]/40 focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-[#0F766E]/15 transition-all">
            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2">
              <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-400" />
                </div>
                <input
                  id="scheme-discovery-search-input"
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (!isOpen && e.target.value.trim().length >= 2) setIsOpen(true);
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) setIsOpen(true);
                  }}
                  placeholder={t('discovery_search_placeholder', 'Try “PMEGP”, “Mudra loan”, “scholarship” or “housing”')}
                  className="w-full pl-9 sm:pl-10 pr-8 py-2 sm:py-2.5 text-xs sm:text-sm bg-transparent border-0 rounded-lg sm:rounded-xl text-[#173B57] placeholder-slate-400 focus:outline-none focus:ring-0 transition-all font-medium"
                  aria-label={t('discovery_search_label', 'Search a scheme by name or keyword')}
                />
                {isLoading && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Loader2 className="w-4 h-4 text-[#0F766E] animate-spin" />
                  </div>
                )}
              </div>
              <button
                type="submit"
                id="scheme-discovery-search-btn"
                className="w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-2.5 min-h-[38px] sm:min-h-[40px] bg-[#0F766E] hover:bg-[#115E59] active:bg-[#134E4A] text-white font-bold text-xs sm:text-sm rounded-lg sm:rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:ring-offset-2 cursor-pointer"
              >
                <span>{t('discovery_search_btn', 'Search schemes')}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </form>

            {/* Suggestions Dropdown (Max 5 items) */}
            {isOpen && query.trim().length >= 2 && (
              <div 
                role="listbox"
                id="scheme-search-suggestions"
                className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl border border-[#E2E8F0] overflow-hidden z-30 divide-y divide-slate-100"
              >
                {suggestions.length > 0 ? (
                  <>
                    <div className="px-3.5 py-2 bg-[#F8FAFC] text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center justify-between">
                      <span>{t('discovery_suggestions_title', 'Matching Schemes')}</span>
                      <span className="font-normal text-slate-400">({suggestions.length} of max 5)</span>
                    </div>
                    {suggestions.map((item) => (
                      <button
                        key={item._id || item.slug || item.name}
                        type="button"
                        onClick={() => handleSelectSuggestion(item)}
                        className="w-full text-left px-4 py-2.5 hover:bg-[#F0FDFA] transition-colors flex items-start justify-between gap-3 group focus:bg-[#F0FDFA] focus:outline-none cursor-pointer"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-[#173B57] group-hover:text-[#0F766E] truncate">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                            {item.provider && <span className="truncate">{item.provider}</span>}
                            {item.category && (
                              <>
                                <span>•</span>
                                <span className="text-[#0F766E] font-medium">{item.category}</span>
                              </>
                            )}
                          </div>
                          {item.benefit && (
                            <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1 italic">
                              {item.benefit}
                            </p>
                          )}
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0F766E] shrink-0 mt-0.5" />
                      </button>
                    ))}
                    <div className="p-2.5 bg-[#F8FAFC] text-center border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="text-xs font-semibold text-[#0F766E] hover:underline cursor-pointer"
                      >
                        <span>{t('discovery_see_all_results', 'See all results for')} &quot;{query}&quot; →</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-xs text-slate-600 font-medium mb-2.5">
                      {t('discovery_no_results', 'No exact scheme found for this name.')}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/wizard');
                        }}
                        className="text-xs font-bold text-[#0F766E] hover:underline cursor-pointer"
                      >
                        {t('discovery_empty_check_eligibility', 'Check eligibility instead →')}
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          navigate('/matches');
                        }}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                      >
                        {t('discovery_empty_browse_all', 'Browse all schemes')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Seamlessly Merged Live Scheme Statistics Grid directly below sleek search bar */}
        <div className="w-full max-w-5xl sm:max-w-6xl mx-auto mt-2.5 sm:mt-3">
          <SchemeStatsSection />
        </div>

      </div>
    </section>
  );
}

/**
 * SchemeQuickDiscovery Component
 * Placed in its original location directly below the Hero section:
 * 1. "Find schemes for me" quick action card
 * 2. "Scan a document" quick action card
 * 3. Voice AI prompt line ("Prefer speaking? Ask YojnaSetu by voice")
 * 4. Browse without a profile pills row
 */
export function SchemeQuickDiscovery({ onOpenSnapModal, onOpenAiModal }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <section className="w-full py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 2 Quick Action Cards (Find schemes for me & Scan a document) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-6">
        
        {/* Card 1: Personalised Eligibility Wizard */}
        <div 
          onClick={() => navigate('/wizard')}
          className="ys-card p-5 bg-white border border-[#E2E8F0] hover:border-[#0F766E]/40 hover:shadow-md transition-all rounded-2xl cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center shrink-0 border border-[#CCFBF1]">
              <Sparkles className="w-5 h-5 text-[#0F766E]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#173B57] group-hover:text-[#0F766E] transition-colors">
                {t('discovery_action_wizard_title', 'Find schemes for me')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-snug">
                {t('discovery_action_wizard_desc', 'Answer a few questions for personalised, explainable matches.')}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F766E]">
            <span>{t('discovery_action_wizard_btn', 'Start check')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Card 2: Document Scan / OCR Upload */}
        <div 
          onClick={() => onOpenSnapModal?.()}
          className="ys-card p-5 bg-white border border-[#E2E8F0] hover:border-[#0F766E]/40 hover:shadow-md transition-all rounded-2xl cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#F0FDFA] text-[#0F766E] flex items-center justify-center shrink-0 border border-[#CCFBF1]">
              <FileScan className="w-5 h-5 text-[#0F766E]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#173B57] group-hover:text-[#0F766E] transition-colors">
                {t('discovery_action_scan_title', 'Scan a document')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-snug">
                {t('discovery_action_scan_desc', 'Use Aadhaar, income or Udyam details to fill your profile faster.')}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F766E]">
            <span>{t('discovery_action_scan_btn', 'Upload document')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

      </div>

      {/* Voice Assistant Supportive Line (Quiet, non-competing) */}
      <div className="text-center mb-6">
        <p className="text-xs sm:text-sm text-slate-600 inline-flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-2xs">
          <Mic className="w-3.5 h-3.5 text-[#0F766E]" />
          <span>{t('discovery_voice_line', 'Prefer speaking? Ask YojnaSetu by voice.')}</span>
          <button
            type="button"
            onClick={() => onOpenAiModal?.()}
            className="text-[#0F766E] font-bold hover:underline ml-0.5 cursor-pointer"
          >
            {t('discovery_voice_action', 'Ask by Voice')}
          </button>
        </p>
      </div>

      {/* Browse without a profile */}
      <div className="border-t border-[#E2E8F0]/80 pt-5 max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            {t('discovery_browse_label', 'Or browse without a profile:')}
          </span>
          
          <button
            type="button"
            onClick={() => navigate('/matches')}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-[#0F766E] bg-white hover:bg-[#F0FDFA] border border-[#CBD5E1] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('discovery_browse_all', 'Browse by category')}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/matches?source=central')}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-[#0F766E] bg-white hover:bg-[#F0FDFA] border border-[#CBD5E1] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Landmark className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('discovery_browse_central', 'Central schemes')}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/matches?source=state')}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-[#0F766E] bg-white hover:bg-[#F0FDFA] border border-[#CBD5E1] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('discovery_browse_state', 'State schemes')}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/scholarsetu')}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-[#0F766E] bg-white hover:bg-[#F0FDFA] border border-[#CBD5E1] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('discovery_browse_students', 'For students')}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/wizard')}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-[#0F766E] bg-white hover:bg-[#F0FDFA] border border-[#CBD5E1] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('discovery_browse_entrepreneurs', 'For entrepreneurs')}</span>
          </button>
        </div>
      </div>

    </section>
  );
}

// Default export renders SchemeSearchBar for compatibility
export default function SchemeDiscoveryHub({ onOpenSnapModal, onOpenAiModal }) {
  return <SchemeSearchBar />;
}
