import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import DocumentOCRUploadZone from '../components/DocumentOCRUploadZone';
import { 
  FileCheck, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  UserCheck, 
  FileText 
} from 'lucide-react';

export default function DocumentVerificationPage() {
  const { t, isHindi } = useLanguage();
  const navigate = useNavigate();

  // Profile Form Data state initialized from localStorage or default
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('ys_current_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      fullName: 'Sunita Devi',
      age: 28,
      gender: 'Female',
      state: 'Bihar',
      district: 'Patna',
      sector: 'Food processing',
      category: 'SC',
      isWomanEntrepreneur: true,
      fundingAmount: 500000,
      annualTurnover: 400000,
      familyIncome: 250000,
      udyamStatus: 'Registered',
      documentsAvailable: ['Income Certificate', 'Category Certificate', 'Business Registration', 'Aadhaar/Identity', 'Udyam Certificate']
    };
  });

  const [notification, setNotification] = useState(null);

  const handleAutoFillProfile = (extractedFields) => {
    if (!extractedFields) return;

    setFormData(prev => {
      const updated = {
        ...prev,
        ...(extractedFields.fullName && { fullName: extractedFields.fullName }),
        ...(extractedFields.state && { state: extractedFields.state }),
        ...(extractedFields.familyIncome && { familyIncome: extractedFields.familyIncome }),
        ...(extractedFields.category && { category: extractedFields.category }),
        ...(extractedFields.udyamStatus && { udyamStatus: extractedFields.udyamStatus })
      };
      localStorage.setItem('ys_current_profile', JSON.stringify(updated));
      return updated;
    });

    setNotification(isHindi ? 'दस्तावेज़ से विवरण सफलतापूर्वक निकाले गए और प्रोफ़ाइल भर दी गई!' : 'Successfully extracted & auto-filled profile fields from scanned document!');
    setTimeout(() => setNotification(null), 4000);
  };

  const handleProceedToMatches = () => {
    localStorage.setItem('ys_current_profile', JSON.stringify(formData));
    navigate('/matches');
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6">
      
      {/* Top Banner & Header Section */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFBF1] border border-[#14B8A6]/40 text-[#115E59] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
              <span>{isHindi ? 'आधिकारिक नागरिक दस्तावेज़ OCR इंजन' : 'Official Citizen Document OCR Engine'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-[#173B57] tracking-tight flex items-center gap-3">
              <FileCheck className="w-8 h-8 text-[#0F766E]" />
              {t('doc_verify_title', isHindi ? 'दस्तावेज़ सत्यापन AI — त्वरित OCR एवं प्रमाण पत्र सत्यापन' : 'DocVerifier — Instant Document Verification & Detail Extractor')}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {t('doc_verify_subtitle', isHindi 
                ? 'सरकारी प्रमाण पत्र (आधार, आय प्रमाण पत्र, जाति प्रमाण पत्र, उद्यम, पैन, बैंक पासबुक) अपलोड करें। हमारा OCR इंजन प्रमाण पत्र की सत्यता जांचता है और अधिकतम सब्सिडी हेतु विवरण स्वतः भरता है।' 
                : 'Upload official central and state government certificates (Aadhaar, Income Certificate, Caste Certificate, MSME Udyam, PAN, Bank Statements). Our OCR engine analyzes image legibility, validates authenticity markers, and auto-populates your profile for maximum scheme eligibility.')}
            </p>
          </div>

          <button
            onClick={handleProceedToMatches}
            className="px-6 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm shrink-0"
          >
            <span>{isHindi ? 'योजना मिलान परिणाम देखें' : 'Proceed to Scheme Matches'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Live Extracted Summary Bar */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">{isHindi ? 'सत्यापित नाम' : 'Verified Name'}</span>
            <strong className="text-[#173B57] font-bold text-sm">{formData.fullName || (isHindi ? 'स्कैन नहीं हुआ' : 'Not Scanned')}</strong>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">{isHindi ? 'राज्य' : 'State'}</span>
            <strong className="text-[#0F766E] font-bold text-sm">{formData.state || (isHindi ? 'स्कैन नहीं हुआ' : 'Not Scanned')}</strong>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">{isHindi ? 'वार्षिक आय' : 'Annual Income'}</span>
            <strong className="text-[#0F766E] font-bold text-sm">₹{(formData.familyIncome || 0).toLocaleString('en-IN')}</strong>
          </div>
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">{isHindi ? 'श्रेणी एवं उद्यम स्थिति' : 'Category & MSME Status'}</span>
            <strong className="text-[#173B57] font-bold text-sm">{formData.category} • {formData.udyamStatus}</strong>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="p-4 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] text-[#115E59] text-xs font-bold flex items-center gap-3 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-[#0F766E] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Upload Zone Section */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#173B57] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#0F766E]" />
              {isHindi ? 'दस्तावेज़ अपलोड एवं सत्यापन वॉल्ट' : 'Document Upload & Verification Vault'}
            </h2>
            <p className="text-xs text-slate-500">
              {isHindi 
                ? 'तुरंत AI OCR स्कैनिंग के लिए कोई भी दस्तावेज़ फ़ाइल (PDF, PNG, JPG) चुनें।' 
                : 'Select any document file (PDF, PNG, JPG, JPEG) to run instant AI OCR scanning.'}
            </p>
          </div>

          <div className="text-xs text-[#0F766E] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isHindi 
                ? `${formData.documentsAvailable?.length || 0} दस्तावेज़ तैयार` 
                : `${formData.documentsAvailable?.length || 0} Documents Ready`}
            </span>
          </div>
        </div>

        <DocumentOCRUploadZone
          formData={formData}
          setFormData={setFormData}
          onAutoFillProfile={handleAutoFillProfile}
        />
      </div>

      {/* Bottom Action Footer */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
          <span>{isHindi ? 'सभी अपलोड किए गए दस्तावेज़ सुरक्षित रूप से संसाधित होते हैं।' : 'All uploaded documents are processed securely and stored locally in /uploads.'}</span>
        </div>

        <button
          onClick={handleProceedToMatches}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isHindi ? 'सत्यापित पात्रता जांचें एवं योजनाएं देखें' : 'Evaluate Verified Eligibility & Show Scheme Matches'}</span>
        </button>
      </div>

    </div>
  );
}
