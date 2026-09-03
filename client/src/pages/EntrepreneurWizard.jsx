import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { 
  User, 
  Briefcase, 
  IndianRupee, 
  Users, 
  Target, 
  FileCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Save, 
  AlertCircle 
} from 'lucide-react';
import DocumentOCRUploadZone from '../components/DocumentOCRUploadZone';

export default function EntrepreneurWizard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: '',
    age: 28,
    gender: 'Female',
    state: 'Bihar',
    district: 'Patna',
    city: 'Patna',
    pincode: '800001',
    areaType: 'Rural',

    // Step 2: Business
    businessName: '',
    businessType: 'Proprietary',
    sector: 'Food processing',
    stage: 'Existing business',
    yearsInOperation: 2,
    annualTurnover: 400000,
    employeesCount: 3,
    investmentAmount: 150000,
    udyamStatus: 'Registered',

    // Step 3: Financial
    familyIncome: 250000,
    existingLoans: false,
    existingEMI: 0,
    ownContribution: 50000,
    hasIncomeCertificate: true,

    // Step 4: Social
    category: 'SC',
    isWomanEntrepreneur: true,
    isMinority: false,
    isPwD: false,
    isFirstGeneration: true,
    isRuralEntrepreneur: true,

    // Step 5: Funding
    fundingType: ['Loan', 'Subsidy', 'Equipment'],
    fundingAmount: 500000,
    fundingPurpose: 'Machinery procurement and dairy processing expansion',

    // Step 6: Documents
    documentsAvailable: [
      'Income Certificate',
      'Category Certificate',
      'Business Registration',
      'Aadhaar/Identity',
      'Udyam Certificate'
    ]
  });

  // Auto-fill Demo Profile if demo parameter is present
  useEffect(() => {
    if (searchParams.get('demo') === 'true') {
      loadDemoData();
    }
  }, [searchParams]);

  const loadDemoData = async () => {
    try {
      const res = await axios.get('/api/entrepreneurs/demo');
      if (res.data.success) {
        setFormData(res.data.data);
      }
    } catch (err) {
      console.warn('Demo load failed, using local fallback.');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDocument = (docName) => {
    setFormData(prev => {
      const docs = prev.documentsAvailable || [];
      if (docs.includes(docName)) {
        return { ...prev, documentsAvailable: docs.filter(d => d !== docName) };
      } else {
        return { ...prev, documentsAvailable: [...docs, docName] };
      }
    });
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      await axios.post('/api/entrepreneurs/save', formData);
    } catch (err) {}
    
    // Store in localStorage for instant matching display
    localStorage.setItem('ys_current_profile', JSON.stringify(formData));
    setLoading(false);
    navigate('/matches');
  };

  const steps = [
    { num: 1, label: t('step_1'), icon: User },
    { num: 2, label: t('step_2'), icon: Briefcase },
    { num: 3, label: t('step_3'), icon: IndianRupee },
    { num: 4, label: t('step_4'), icon: Users },
    { num: 5, label: t('step_5'), icon: Target },
    { num: 6, label: t('step_6'), icon: FileCheck },
    { num: 7, label: t('step_7'), icon: CheckCircle2 }
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      
      {/* Wizard Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#0F766E] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-[#0F766E]" />
            Eligibility Assessment Wizard
          </div>
          <h1 className="text-xl font-extrabold text-[#173B57]">Step {currentStep} of 7 — {steps[currentStep - 1].label}</h1>
          <p className="text-xs text-slate-500">Discover and verify matching government schemes</p>
        </div>

        <button
          onClick={loadDemoData}
          className="px-3.5 py-2 rounded-xl bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#14B8A6]/40 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Demo Profile</span>
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs">
        {steps.map((s) => {
          const IconComponent = s.icon;
          const isActive = currentStep === s.num;
          const isDone = currentStep > s.num;
          return (
            <div
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`p-2 sm:p-2.5 rounded-xl border cursor-pointer transition flex flex-col items-center gap-1 ${
                isActive
                  ? 'bg-[#0F766E] border-[#0F766E] text-white shadow-sm font-bold'
                  : isDone
                  ? 'bg-[#CCFBF1] border-[#14B8A6]/40 text-[#115E59] font-semibold'
                  : 'bg-white border-[#E2E8F0] text-slate-400 hover:text-[#173B57]'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="hidden md:inline text-[10px] font-bold truncate w-full">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Step Form Body */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm text-[#173B57] text-xs space-y-6">
        
        {/* STEP 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">Step 1 — Personal Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="e.g. Sunita Devi"
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', Number(e.target.value))}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Transgender">Transgender</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
                >
                  <option value="Bihar">Bihar</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">District / City</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Area Type</label>
                <select
                  value={formData.areaType}
                  onChange={(e) => handleInputChange('areaType', e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
                >
                  <option value="Rural">Rural</option>
                  <option value="Urban">Urban</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Business Details */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">Step 2 — Business Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Business Name</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="e.g. Sunita Food Products"
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Business Sector</label>
                <select
                  value={formData.sector}
                  onChange={(e) => handleInputChange('sector', e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
                >
                  <option value="Food processing">Food processing</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Services">Services</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Retail">Retail</option>
                  <option value="Textiles">Textiles / Handloom</option>
                  <option value="Agriculture allied">Agriculture allied</option>
                  <option value="Trading">Trading</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Business Stage</label>
                <select
                  value={formData.stage}
                  onChange={(e) => handleInputChange('stage', e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
                >
                  <option value="Idea">Idea</option>
                  <option value="New business">New business</option>
                  <option value="Existing business">Existing business</option>
                  <option value="Expansion">Expansion</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Annual Turnover (₹)</label>
                <input
                  type="number"
                  value={formData.annualTurnover}
                  onChange={(e) => handleInputChange('annualTurnover', Number(e.target.value))}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Udyam Registration Status</label>
                <select
                  value={formData.udyamStatus}
                  onChange={(e) => handleInputChange('udyamStatus', e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
                >
                  <option value="Registered">Registered</option>
                  <option value="Not Registered">Not Registered</option>
                  <option value="Applied">Applied</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Employees Count</label>
                <input
                  type="number"
                  value={formData.employeesCount}
                  onChange={(e) => handleInputChange('employeesCount', Number(e.target.value))}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Financial Details */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">Step 3 — Financial Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Annual Family Income (₹)</label>
                <input
                  type="number"
                  value={formData.familyIncome}
                  onChange={(e) => handleInputChange('familyIncome', Number(e.target.value))}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Own Contribution / Savings (₹)</label>
                <input
                  type="number"
                  value={formData.ownContribution}
                  onChange={(e) => handleInputChange('ownContribution', Number(e.target.value))}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="incCert"
                  checked={formData.hasIncomeCertificate}
                  onChange={(e) => handleInputChange('hasIncomeCertificate', e.target.checked)}
                  className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                />
                <label htmlFor="incCert" className="text-slate-300 cursor-pointer">Income Certificate Available</label>
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="existLoans"
                  checked={formData.existingLoans}
                  onChange={(e) => handleInputChange('existingLoans', e.target.checked)}
                  className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                />
                <label htmlFor="existLoans" className="text-slate-300 cursor-pointer">Existing Business Loans Active</label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Social & Eligibility */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">Step 4 — Social & Category Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Social Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
                >
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                  <option value="OBC">Other Backward Class (OBC)</option>
                  <option value="EWS">Economically Weaker Section (EWS)</option>
                  <option value="General">General Category</option>
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="womanEnt"
                    checked={formData.isWomanEntrepreneur}
                    onChange={(e) => handleInputChange('isWomanEntrepreneur', e.target.checked)}
                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                  />
                  <label htmlFor="womanEnt" className="text-slate-300 cursor-pointer">Woman Entrepreneur Enterprise</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="firstGen"
                    checked={formData.isFirstGeneration}
                    onChange={(e) => handleInputChange('isFirstGeneration', e.target.checked)}
                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                  />
                  <label htmlFor="firstGen" className="text-slate-300 cursor-pointer">First Generation Entrepreneur</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pwd"
                    checked={formData.isPwD}
                    onChange={(e) => handleInputChange('isPwD', e.target.checked)}
                    className="accent-emerald-500 w-4 h-4 rounded cursor-pointer"
                  />
                  <label htmlFor="pwd" className="text-slate-300 cursor-pointer">Person with Benchmark Disability (PwD)</label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Funding Requirements */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-4 border-b border-slate-800 pb-2">Step 5 — Funding Requirements</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Total Required Funding (₹)</label>
                <input
                  type="number"
                  value={formData.fundingAmount}
                  onChange={(e) => handleInputChange('fundingAmount', Number(e.target.value))}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1] font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Funding Purpose</label>
                <input
                  type="text"
                  value={formData.fundingPurpose}
                  onChange={(e) => handleInputChange('fundingPurpose', e.target.value)}
                  placeholder="e.g. Machinery procurement"
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Document Readiness */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white mb-2 border-b border-slate-800 pb-2">Step 6 — Document Readiness</h3>
            <p className="text-slate-400 text-xs">Select documents you currently possess. Missing documents will be listed in your readiness gap analysis.</p>

            <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-sky-950/40 border border-emerald-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-emerald-300 text-xs">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Need instant AI file scanning & auto-extraction? Try <strong>DocVerifier AI</strong> at the top bar.</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/doc-verify')}
                className="px-3 py-1.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-[11px] shrink-0 transition shadow-sm"
              >
                Open DocVerifier AI →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                'Income Certificate',
                'Category Certificate',
                'Business Registration',
                'Aadhaar/Identity',
                'Udyam Certificate',
                'Project Report',
                'Bank Statement'
              ].map((doc, idx) => {
                const isSelected = (formData.documentsAvailable || []).includes(doc);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleDocument(doc)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#F0FDFA] border-[#0F766E] text-[#115E59] font-bold shadow-sm'
                        : 'bg-white border-[#E2E8F0] text-slate-600 hover:border-[#14B8A6]'
                    }`}
                  >
                    <span>{doc}</span>
                    {isSelected ? <CheckCircle2 className="w-4 h-4 text-[#0F766E]" /> : <div className="w-4 h-4 rounded-full border border-slate-300" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 7: Review & Match */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-[#173B57] border-b border-[#E2E8F0] pb-2">Step 7 — Review Your Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
                <div className="font-bold text-[#0F766E] uppercase text-[10px]">Personal & Social Category</div>
                <div className="text-[#173B57] font-semibold">{formData.fullName} ({formData.age} yrs, {formData.gender})</div>
                <div className="text-slate-600">Category: <span className="font-bold text-[#173B57]">{formData.category}</span></div>
                <div className="text-slate-600">Location: {formData.district}, {formData.state} ({formData.areaType})</div>
              </div>

              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
                <div className="font-bold text-[#173B57] uppercase text-[10px]">Business & Funding Need</div>
                <div className="text-[#173B57] font-semibold">{formData.businessName || 'Proposed Enterprise'}</div>
                <div className="text-slate-600">Sector: {formData.sector} ({formData.stage})</div>
                <div className="text-slate-600">Funding Need: <span className="font-bold text-[#0F766E]">₹{formData.fundingAmount.toLocaleString('en-IN')}</span></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] text-[#115E59] text-center font-bold">
              Ready to evaluate explainable eligibility across 15+ central & state schemes!
            </div>
          </div>
        )}

        {/* Wizard Navigation Controls */}
        <div className="flex justify-between items-center pt-6 border-t border-[#E2E8F0]">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#173B57] border border-[#CBD5E1] font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}

          {currentStep < 7 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-extrabold text-xs transition flex items-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Analyzing Eligibility...' : 'Analyze My Profile & Show Matches'}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
