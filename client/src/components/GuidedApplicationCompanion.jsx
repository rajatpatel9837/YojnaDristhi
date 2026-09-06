import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Compass, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Sparkles, 
  ShieldAlert, 
  HelpCircle,
  ArrowRight,
  BookOpen,
  Info
} from 'lucide-react';

export default function GuidedApplicationCompanion({
  isOpen,
  onClose,
  scheme,
  profile = {},
  sessionId,
  onAskChatbot
}) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [walkthroughData, setWalkthroughData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState(null);
  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = sessionStorage.getItem(`ys_step_prog_${scheme?._id || scheme?.slug}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    if (!isOpen || !scheme) return;
    fetchWalkthrough();
  }, [isOpen, scheme, sessionId]);

  const fetchWalkthrough = async () => {
    setLoading(true);
    try {
      const sId = scheme._id || scheme.slug;
      const res = await axios.get(`/api/autofill/walkthrough/${sId}${sessionId ? `?sessionId=${sessionId}` : ''}`);
      if (res.data && res.data.success && res.data.data) {
        setWalkthroughData(res.data.data);
      }
    } catch (err) {
      console.warn('Walkthrough API error, generating local fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyValue = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const toggleStepCompleted = (stepNumber) => {
    let next;
    if (completedSteps.includes(stepNumber)) {
      next = completedSteps.filter(s => s !== stepNumber);
    } else {
      next = [...completedSteps, stepNumber];
    }
    setCompletedSteps(next);
    try {
      sessionStorage.setItem(`ys_step_prog_${scheme?._id || scheme?.slug}`, JSON.stringify(next));
    } catch (e) {}
  };

  if (!isOpen || !scheme) return null;

  const steps = walkthroughData?.steps || [
    {
      stepNumber: 1,
      stepTitle: 'Access Official Portal & Register',
      instruction: `Visit the official portal (${scheme.officialUrl}) and click on "New Beneficiary Registration" or "Apply Online".`,
      commonPitfall: 'Ensure your mobile number is actively linked with your Aadhaar for OTP verification.',
      isPlaceholderContent: true,
      fieldsNeeded: [
        { fieldLabel: 'Applicant Full Name', resolvedValue: profile.fullName || 'Citizen', tip: 'Enter matching Aadhaar card' },
        { fieldLabel: 'Identity Number (Aadhaar)', resolvedValue: profile.aadhaarNumber || 'XXXX-XXXX-7842', tip: 'UIDAI standard' }
      ]
    },
    {
      stepNumber: 2,
      stepTitle: 'Personal & Demographic Details',
      instruction: 'Enter your category, state of residence, and family annual income in Section 2 of the portal.',
      commonPitfall: 'Income entered on portal must match the exact amount on your official Tehsildar income certificate.',
      isPlaceholderContent: true,
      fieldsNeeded: [
        { fieldLabel: 'Social Category', resolvedValue: profile.category || 'SC', tip: 'SC/ST/OBC/General' },
        { fieldLabel: 'State of Residence', resolvedValue: profile.state || 'Bihar', tip: 'Beneficiary state' },
        { fieldLabel: 'Annual Family Income (₹)', resolvedValue: profile.familyIncome ? `₹${profile.familyIncome.toLocaleString('en-IN')}` : '₹1,80,000', tip: 'Must match certificate' }
      ]
    },
    {
      stepNumber: 3,
      stepTitle: 'Enterprise & Project Proposal',
      instruction: 'Select your business sector, describe the activity, and input the total capital project cost.',
      commonPitfall: 'Do not exceed the maximum allowed ceiling for project cost specified in scheme guidelines.',
      isPlaceholderContent: true,
      fieldsNeeded: [
        { fieldLabel: 'Business Sector', resolvedValue: profile.sector || 'Food processing', tip: 'Manufacturing / Service' },
        { fieldLabel: 'Total Project Cost (₹)', resolvedValue: profile.fundingAmount ? `₹${profile.fundingAmount.toLocaleString('en-IN')}` : '₹5,00,000', tip: 'Loan + margin money' }
      ]
    }
  ];

  const currentStep = steps[activeStepIndex] || steps[0];
  const officialUrl = scheme.officialUrl || walkthroughData?.officialUrl || 'https://www.india.gov.in';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#173B57]/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col h-[90vh] text-[#173B57]">
        
        {/* Header Bar */}
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[#173B57]">Guided Application Co-Pilot</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#115E59] text-[10px] font-bold border border-[#14B8A6]/30">
                  Live Companion
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-md">{scheme.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#173B57] hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Split Screen Container */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden text-xs">
          
          {/* LEFT PANEL: Step Checklist & Copy-Paste Dossier */}
          <div className="w-full md:w-1/2 border-r border-[#E2E8F0] flex flex-col bg-white overflow-y-auto">
            
            {/* Step Progress Tracker */}
            <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-500">Application Progress:</span>
                <span className="text-[#0F766E]">{completedSteps.length} of {steps.length} Steps Completed</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#0F766E] h-full transition-all duration-300"
                  style={{ width: `${(completedSteps.length / Math.max(1, steps.length)) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Selection Accordion */}
            <div className="p-4 space-y-2 border-b border-[#E2E8F0] overflow-x-auto">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Application Steps</div>
              <div className="flex md:flex-col gap-2">
                {steps.map((step, idx) => {
                  const isActive = activeStepIndex === idx;
                  const isDone = completedSteps.includes(step.stepNumber);

                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveStepIndex(idx)}
                      className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between shrink-0 ${
                        isActive 
                          ? 'bg-[#F0FDFA] border-[#0F766E] text-[#0F766E] font-bold shadow-xs' 
                          : 'bg-white border-slate-200 text-[#173B57] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStepCompleted(step.stepNumber);
                          }}
                          className={`w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition ${
                            isDone ? 'bg-[#0F766E] border-[#0F766E] text-white' : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isDone && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className="text-xs">Step {step.stepNumber}: {step.stepTitle}</span>
                      </div>

                      {step.isPlaceholderContent && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-medium">
                          Guide
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Step Fields & Copy Tools */}
            <div className="p-5 space-y-4 flex-1 overflow-y-auto">
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#0F766E]">Active Step {currentStep.stepNumber}</div>
                <h4 className="font-extrabold text-sm text-[#173B57]">{currentStep.stepTitle}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{currentStep.instruction}</p>
              </div>

              {/* 1-Click Copy Fields */}
              <div className="space-y-2.5 pt-2">
                <div className="text-[11px] font-bold text-[#173B57] flex items-center justify-between">
                  <span>Fields Needed for this Step:</span>
                  <span className="text-[10px] text-slate-400">Click button to copy value</span>
                </div>

                {(currentStep.fieldsNeeded || []).map((field, fIdx) => {
                  const val = field.resolvedValue || '';
                  const isCopied = copiedField === field.fieldLabel;

                  return (
                    <div key={fIdx} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#173B57]">{field.fieldLabel}</span>
                        {field.tip && <span className="text-[10px] text-slate-400 italic">{field.tip}</span>}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={val || 'Not Available'}
                          className="flex-1 px-3 py-1.5 text-xs font-mono font-bold bg-white border border-[#CBD5E1] rounded-lg text-[#173B57] select-all"
                        />

                        <button
                          type="button"
                          onClick={() => handleCopyValue(val, field.fieldLabel)}
                          disabled={!val}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition flex items-center gap-1 shrink-0 ${
                            isCopied
                              ? 'bg-[#CCFBF1] text-[#0F766E] border border-[#14B8A6]/40'
                              : 'bg-[#0F766E] hover:bg-[#115E59] text-white shadow-xs'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* RIGHT PANEL: Official Portal Gateway & Assistant Advice */}
          <div className="w-full md:w-1/2 flex flex-col bg-[#F8FAFC] overflow-y-auto p-5 sm:p-6 space-y-5">
            
            {/* Official Portal Direct Launch Card */}
            <div className="bg-white border-2 border-[#0F766E] rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#CCFBF1] text-[#115E59] text-[10px] font-bold uppercase tracking-wider border border-[#14B8A6]/30 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-[#0F766E]" /> Direct Verified Portal
                </span>
                <span className="text-[10px] font-mono text-slate-400">gov.in / nic.in</span>
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-sm text-[#173B57]">Open Destination Application Portal</h4>
                <p className="text-[11px] text-slate-500 font-mono break-all">{officialUrl}</p>
              </div>

              <button
                type="button"
                onClick={() => window.open(officialUrl, '_blank', 'noopener,noreferrer')}
                className="w-full py-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Open Official Portal in New Tab ↗️</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <div className="text-[10px] text-slate-500 text-center leading-relaxed">
                Keep this Co-Pilot open side-by-side to copy your verified details into the official portal fields.
              </div>
            </div>

            {/* Common Pitfall Warning Banner */}
            {currentStep.commonPitfall && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-amber-900">
                <div className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Important Pitfall to Avoid on Step {currentStep.stepNumber}</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed pl-5">
                  {currentStep.commonPitfall}
                </p>
              </div>
            )}

            {/* Unverified / Placeholder Content Transparency */}
            {currentStep.isPlaceholderContent && (
              <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-[10px] text-slate-500 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Illustrative Portal Flow:</strong> Exact portal button labels and form step numbers may vary across state portal revisions. Always follow the official instructions on the live government site.
                </div>
              </div>
            )}

            {/* Ask Chatbot for Help with this Step */}
            <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl space-y-2.5">
              <div className="flex items-center gap-2 text-[#173B57] font-bold text-xs">
                <Sparkles className="w-4 h-4 text-[#0F766E]" />
                <span>Stuck on this step? Ask Yojna दृष्टि AI</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Our AI assistant can guide you in Hindi, Punjabi, or English through any field requirements or document questions.
              </p>

              <button
                type="button"
                onClick={() => {
                  if (onAskChatbot) {
                    onAskChatbot(`I am on Step ${currentStep.stepNumber} (${currentStep.stepTitle}) for ${scheme.name}. How do I complete this on the official portal?`);
                  }
                }}
                className="w-full py-2 rounded-lg bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#14B8A6]/30 font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>Ask AI About Step {currentStep.stepNumber} →</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

