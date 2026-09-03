import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink, Lock, CheckCircle2, Award, FileText } from 'lucide-react';

export default function Footer() {
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
                <span className="text-xl font-extrabold text-[#173B57] tracking-tight">Yojna दृष्टि</span>
                <span className="block text-xs font-bold text-[#0F766E]">Discover. Apply. Track.</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
              National Citizen Scheme Discovery, Document Verification & Financial Disbursal Tracking Platform. Empowering micro-entrepreneurs and marginalized citizens with transparent, explainable government opportunities.
            </p>
            <div className="p-3.5 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] text-[11px] text-[#134E4A] leading-relaxed">
              <strong>PUBLIC SERVICE NOTICE:</strong> Yojna दृष्टि provides intelligent scheme discovery, eligibility assessment, and prototype PFMS tracking. Official sanctions and fund transfers are executed exclusively by authorized Ministry nodal treasuries and scheduled banks.
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#173B57] uppercase tracking-wider mb-4">Core Ecosystem</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/wizard" className="hover:text-[#0F766E] transition font-medium">Eligibility Assessment Wizard</Link></li>
              <li><Link to="/doc-verify" className="hover:text-[#0F766E] transition font-medium">DocVerifier AI Engine</Link></li>
              <li><Link to="/track-application" className="hover:text-[#0F766E] transition font-medium">Application & Fund Disbursal Tracker</Link></li>
              <li><Link to="/scholarsetu" className="hover:text-[#0F766E] transition font-medium">ScholarSetu Student Portal</Link></li>
              <li><Link to="/provider" className="hover:text-[#0F766E] transition font-medium">Company & CSR Portal</Link></li>
              <li><Link to="/sponsorship" className="hover:text-[#0F766E] transition font-medium">Direct Beneficiary Sponsorship</Link></li>
              <li><Link to="/admin" className="hover:text-[#0F766E] transition font-medium">Source Registry & Admin Studio</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#173B57] uppercase tracking-wider mb-4">Trust & Verification</h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-[#0F766E] font-semibold">
                <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                <span>Verified Gazette Guidelines</span>
              </li>
              <li className="flex items-center gap-2 text-[#0F766E] font-semibold">
                <Lock className="w-4 h-4 text-[#0F766E]" />
                <span>Privacy-Preserving Architecture</span>
              </li>
              <li className="flex items-center gap-2 text-[#173B57] font-semibold">
                <Award className="w-4 h-4 text-[#F59E0B]" />
                <span>Smart India Hackathon 2026</span>
              </li>
              <li className="text-slate-400 pt-2 text-[11px]">
                Nodal Registry Synchronized: August 2026
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-[#E2E8F0] text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            © 2026 Yojna दृष्टि Platform. Ministry of Social Justice & Empowerment (MoSJE) SIH26092.
          </div>
          <div className="flex gap-4 font-medium">
            <span className="hover:text-[#0F766E] cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#0F766E] cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-[#0F766E] cursor-pointer">Legal Disclaimer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
