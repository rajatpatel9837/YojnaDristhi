import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Info, Landmark, Building2, HeartHandshake } from 'lucide-react';

/**
 * Public Verification Badge Component
 * Renders precise, non-misleading trust badges with interactive tooltips.
 */
export default function VerificationBadge({ status, type = 'OPPORTUNITY', className = '' }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const getBadgeConfig = () => {
    // 1. OPPORTUNITY VERIFICATION BADGES
    if (type === 'OPPORTUNITY') {
      switch (status) {
        case 'OFFICIAL_GOVERNMENT_SCHEME':
          return {
            label: 'Official Government Scheme',
            icon: Landmark,
            color: 'bg-[#CCFBF1] text-[#115E59] border-[#14B8A6]/40 hover:bg-[#CCFBF1]/80',
            iconColor: 'text-[#0F766E]',
            description: 'This opportunity is linked to an official government source and has been verified against official Gazette / Nodal Ministry guidelines.'
          };

        case 'GOVERNMENT_PARTNERED_OPPORTUNITY':
          return {
            label: 'Government-Partnered Opportunity',
            icon: HeartHandshake,
            color: 'bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100',
            iconColor: 'text-sky-600',
            description: 'This opportunity has documented evidence of a formal government relationship, MOU, or empanelment relevant to this specific program.'
          };

        case 'VERIFIED_PRIVATE_OR_CSR_OPPORTUNITY':
        case 'VERIFIED_CSR_OPPORTUNITY':
          return {
            label: 'Verified CSR Opportunity',
            icon: Building2,
            color: 'bg-[#F0FDFA] text-[#0F766E] border-[#CCFBF1] hover:bg-[#CCFBF1]/40',
            iconColor: 'text-[#0F766E]',
            description: 'This opportunity is provided by a verified legal entity/CSR agency and is NOT represented as an official government scheme.'
          };

        case 'VERIFIED_PRIVATE_OPPORTUNITY':
          return {
            label: 'Verified Private Opportunity',
            icon: ShieldCheck,
            color: 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100',
            iconColor: 'text-indigo-600',
            description: 'This opportunity is offered by a verified legal business entity.'
          };

        case 'SOURCE_REQUIRES_REVIEW':
          return {
            label: 'Source Requires Review',
            icon: AlertTriangle,
            color: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100',
            iconColor: 'text-amber-600',
            description: 'Source information is currently being reviewed. Users should independently verify details before proceeding.'
          };

        case 'REJECTED':
          return {
            label: 'Verification Rejected',
            icon: XCircle,
            color: 'bg-rose-50 text-rose-800 border-rose-300',
            iconColor: 'text-rose-600',
            description: 'Submitted claims could not be verified or were rejected by administrators.'
          };

        default:
          return {
            label: 'Unverified Opportunity',
            icon: AlertTriangle,
            color: 'bg-slate-100 text-slate-600 border-slate-300',
            iconColor: 'text-slate-500',
            description: 'This opportunity has not undergone formal Yojna दृष्टि verification review.'
          };
      }
    }

    // 2. ORGANIZATION VERIFICATION BADGES
    switch (status) {
      case 'VERIFIED_LEGAL_ENTITY':
        return {
          label: 'Verified Legal Entity',
          icon: ShieldCheck,
          color: 'bg-[#CCFBF1] text-[#115E59] border-[#14B8A6]/40 hover:bg-[#CCFBF1]/80',
          iconColor: 'text-[#0F766E]',
          description: 'The legal existence of this organization has been verified via official incorporation documents (CIN / PAN / Registration).'
        };

      case 'GOVERNMENT_REGISTERED_OR_RECOGNIZED':
        return {
          label: 'Government-Registered / Recognized',
          icon: Landmark,
          color: 'bg-cyan-50 text-cyan-800 border-cyan-300 hover:bg-cyan-100',
          iconColor: 'text-cyan-700',
          description: 'The organization has submitted evidence supporting relevant government registration or listing (e.g. NGO Darpan / CSR-1).'
        };

      case 'UNDER_REVIEW':
      case 'DOCUMENTS_SUBMITTED':
        return {
          label: 'Verification Under Review',
          icon: AlertTriangle,
          color: 'bg-amber-50 text-amber-800 border-amber-300',
          iconColor: 'text-amber-600',
          description: 'Submitted organizational registration dossier is currently under administrator review.'
        };

      case 'REQUIRES_MORE_INFORMATION':
        return {
          label: 'Action Required',
          icon: Info,
          color: 'bg-orange-50 text-orange-800 border-orange-300',
          iconColor: 'text-orange-600',
          description: 'Additional documentation or clarification requested by review administrators.'
        };

      case 'REJECTED':
      case 'SUSPENDED':
        return {
          label: status === 'SUSPENDED' ? 'Organization Suspended' : 'Verification Rejected',
          icon: XCircle,
          color: 'bg-rose-50 text-rose-800 border-rose-300',
          iconColor: 'text-rose-600',
          description: status === 'SUSPENDED' ? 'Organization status temporarily restricted by administrators.' : 'Uploaded documents could not be verified.'
        };

      default:
        return {
          label: 'Unverified Organization',
          icon: AlertTriangle,
          color: 'bg-slate-100 text-slate-600 border-slate-300',
          iconColor: 'text-slate-500',
          description: 'Organization has not completed legal entity verification.'
        };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className={`px-2.5 py-1 rounded-full border text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm ${config.color}`}
      >
        <IconComponent className={`w-3.5 h-3.5 ${config.iconColor}`} />
        <span>{config.label}</span>
        <Info className="w-3 h-3 opacity-60 hover:opacity-100 transition ml-0.5" />
      </div>

      {/* Interactive Tooltip Popover */}
      {showTooltip && (
        <div className="absolute z-50 bottom-full mb-2 left-0 sm:left-auto w-64 p-3.5 rounded-xl bg-[#173B57] border border-[#E2E8F0] text-white text-xs shadow-2xl space-y-1.5 pointer-events-none animate-fadeIn">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <IconComponent className="w-4 h-4 text-[#14B8A6]" />
            <span>{config.label}</span>
          </div>
          <p className="text-[11px] text-slate-200 leading-relaxed">
            {config.description}
          </p>
          <div className="text-[10px] text-slate-300 pt-1.5 border-t border-slate-600/60 flex justify-between">
            <span>Verified by Yojna दृष्टि</span>
            <span className="text-[#14B8A6] font-bold">Audited</span>
          </div>
        </div>
      )}
    </div>
  );
}
