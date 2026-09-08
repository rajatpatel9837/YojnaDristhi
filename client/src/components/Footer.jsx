import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink, Lock, CheckCircle2, Award, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-white text-slate-600 border-t border-[#E2E8F0] text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Yojna दृष्टि Emblem" 
                className="w-10 h-10 rounded-full object-contain border border-[#E2E8F0] shadow-sm"
              />
              <div>
                <span className="text-xl font-extrabold text-[#173B57] tracking-tight">{t('nav_brand')}</span>
                <span className="block text-xs font-bold text-[#0F766E]">{t('nav_tagline')}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
              {t('footer_brand_desc')}
            </p>
            <div className="p-3.5 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] text-[11px] text-[#134E4A] leading-relaxed">
              <strong>{t('footer_notice_title')}</strong> {t('footer_notice_text')}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#173B57] uppercase tracking-wider mb-4">{t('footer_ecosystem_title')}</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/wizard" className="hover:text-[#0F766E] transition font-medium">{t('nav_check_eligibility')}</Link></li>
              <li><Link to="/doc-verify" className="hover:text-[#0F766E] transition font-medium">{t('nav_doc_verify')}</Link></li>
              <li><Link to="/track-application" className="hover:text-[#0F766E] transition font-medium">{t('nav_track_application')}</Link></li>
              <li><Link to="/scholarsetu" className="hover:text-[#0F766E] transition font-medium">{t('nav_scholarsetu')}</Link></li>
              <li><Link to="/provider" className="hover:text-[#0F766E] transition font-medium">{t('nav_provider')}</Link></li>
              <li><Link to="/sponsorship" className="hover:text-[#0F766E] transition font-medium">{t('nav_sponsorship')}</Link></li>
              <li><Link to="/admin" className="hover:text-[#0F766E] transition font-medium">{t('nav_admin')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#173B57] uppercase tracking-wider mb-4">{t('footer_trust_title')}</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-[#0F766E] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                <span>{t('footer_trust_gazette')}</span>
              </li>
              <li className="flex items-center gap-2 text-[#0F766E] font-semibold">
                <Lock className="w-4 h-4 text-[#0F766E]" />
                <span>{t('footer_trust_privacy')}</span>
              </li>
              <li className="flex items-center gap-2 text-[#173B57] font-semibold">
                <Award className="w-4 h-4 text-[#F59E0B]" />
                <span>{t('footer_trust_sih')}</span>
              </li>
              <li className="text-slate-400 pt-2 text-[11px]">
                {t('footer_trust_sync')}
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-[#E2E8F0] text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            {t('footer_copyright')}
          </div>
          <div className="flex gap-4 font-medium">
            <span className="hover:text-[#0F766E] cursor-pointer">{t('footer_privacy')}</span>
            <span>•</span>
            <span className="hover:text-[#0F766E] cursor-pointer">{t('footer_terms')}</span>
            <span>•</span>
            <span className="hover:text-[#0F766E] cursor-pointer">{t('footer_legal')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
