import React, { useState } from 'react';
import axios from 'axios';
import { 
  FileCheck, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Eye, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Zap,
  ArrowRight
} from 'lucide-react';

export default function DocumentOCRUploadZone({ formData, setFormData, onAutoFillProfile }) {
  const documentTypes = [
    { id: 'Income Certificate', name: 'Income Certificate', desc: 'Government Income Proof / Salary Slip / Form 16', required: true, icon: '💰' },
    { id: 'Aadhaar/Identity', name: 'Aadhaar Card / Government Identity', desc: 'UIDAI Aadhaar Card / Voter ID / Passport', required: true, icon: '🆔' },
    { id: 'Category Certificate', name: 'Category / Caste Certificate', desc: 'SC / ST / OBC / EWS Caste Certificate (if applicable)', required: false, icon: '📜' },
    { id: 'Business Registration', name: 'Business Registration / PAN', desc: 'Udyam / GSTIN / PAN / Certificate of Incorporation', required: false, icon: '🏢' },
    { id: 'Udyam Certificate', name: 'Udyam Registration Certificate', desc: 'MSME Udyam Registration (UDYAM-XX-00-0000000)', required: false, icon: '🏷️' },
    { id: 'Bank Statement', name: 'Bank Statement / Passbook', desc: '6-Month Bank Account Statement or Passbook Copy', required: false, icon: '🏦' },
    { id: 'Project Report', name: 'Detailed Project Report (DPR)', desc: 'Business Proposal & DPR for loan/subsidy approval', required: false, icon: '📊' }
  ];

  // OCR state map: { [docType]: { scanning: bool, uploadedFile: object, ocrData: object, error: string } }
  const [ocrStates, setOcrStates] = useState({});

  const handleFileUpload = async (docType, file) => {
    if (!file) return;

    // Set scanning progress state
    setOcrStates(prev => ({
      ...prev,
      [docType]: { scanning: true, error: null }
    }));

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('documentType', docType);

      const res = await axios.post('/api/documents/scan-ocr', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data && res.data.success) {
        const ocrData = res.data.ocr;

        setOcrStates(prev => ({
          ...prev,
          [docType]: {
            scanning: false,
            uploadedFile: res.data.file,
            ocrData: ocrData,
            error: null
          }
        }));

        // Automatically update formData.documentsAvailable
        setFormData(prev => {
          const currentDocs = prev.documentsAvailable || [];
          if (!currentDocs.includes(docType)) {
            return { ...prev, documentsAvailable: [...currentDocs, docType] };
          }
          return prev;
        });

        // If extracted fields are present, offer auto-fill
        if (ocrData && ocrData.extractedFields && onAutoFillProfile) {
          onAutoFillProfile(ocrData.extractedFields);
        }
      } else {
        throw new Error(res.data.message || 'OCR processing failed');
      }
    } catch (err) {
      console.error('OCR Upload Error:', err);
      setOcrStates(prev => ({
        ...prev,
        [docType]: {
          scanning: false,
          error: err.response?.data?.message || err.message || 'File upload failed.'
        }
      }));
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#0F766E] font-bold uppercase text-[11px] tracking-wider">
            <Zap className="w-4 h-4 text-[#0F766E]" /> AI Optical Character Recognition (OCR) Engine
          </div>
          <h3 className="text-sm font-extrabold text-[#173B57]">Upload Your Documents for Instant Verification & Auto-Fill</h3>
          <p className="text-[11px] text-slate-600">
            Our scanner inspects image clarity, verifies document authenticity, and extracts key details (Aadhaar #, Income, Category, Udyam ID).
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-[#CCFBF1] border border-[#14B8A6]/40 text-[#115E59] text-xs font-bold flex items-center gap-1.5 shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
          <span>Local Storage Secured</span>
        </div>
      </div>

      {/* Document Upload Slots */}
      <div className="space-y-3.5">
        {documentTypes.map((doc) => {
          const state = ocrStates[doc.id] || {};
          const isUploaded = !!state.uploadedFile;
          const ocr = state.ocrData;

          return (
            <div 
              key={doc.id}
              className={`p-4 rounded-xl border transition shadow-sm ${
                state.scanning
                  ? 'bg-[#F0FDFA] border-[#0F766E]'
                  : isUploaded && ocr?.isClear
                  ? 'bg-[#F0FDFA]/60 border-[#CCFBF1]'
                  : isUploaded && !ocr?.isClear
                  ? 'bg-amber-50/60 border-amber-200'
                  : 'bg-white border-[#E2E8F0] hover:border-[#0F766E]'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-xl p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] shrink-0">{doc.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#173B57] text-xs">{doc.name}</h4>
                      {doc.required && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[9px] font-bold uppercase">Required</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">{doc.desc}</p>
                  </div>
                </div>

                {/* Upload Button or Status Indicator */}
                <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
                  {state.scanning ? (
                    <div className="px-4 py-2 rounded-lg bg-[#CCFBF1] border border-[#14B8A6]/40 text-[#115E59] text-xs font-bold flex items-center gap-2 animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0F766E]" />
                      <span>Scanning with AI OCR...</span>
                    </div>
                  ) : isUploaded ? (
                    <div className="flex items-center gap-2">
                      <a
                        href={state.uploadedFile.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#173B57] border border-[#CBD5E1] text-xs font-bold transition flex items-center gap-1 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" /> View File
                      </a>

                      <label className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#173B57] border border-[#CBD5E1] text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-sm">
                        <Upload className="w-3.5 h-3.5 text-[#0F766E]" /> Re-upload
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(doc.id, e.target.files[0])}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm">
                      <Upload className="w-4 h-4" /> Upload File (PDF/Image)
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(doc.id, e.target.files[0])}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* OCR Scan Results Banner */}
              {isUploaded && ocr && (
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5">
                  
                  {/* Legibility & Clarity Score Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      {ocr.isClear ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#CCFBF1] text-[#115E59] border border-[#14B8A6]/30 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0F766E]" /> Legible Document ({ocr.clarityScore}% Clarity Score)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Image Low Clarity ({ocr.clarityScore}%) - Consider clear scan
                        </span>
                      )}

                      {ocr.tamperDetected ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Discrepancy Flagged
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#CCFBF1] text-[#115E59] border border-[#14B8A6]/30 font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E]" /> Verified Authenticity
                        </span>
                      )}
                    </div>

                    <span className="text-slate-500 font-medium">Confidence: <strong className="text-[#173B57] font-bold">{ocr.confidence}%</strong></span>
                  </div>

                  {/* Extracted Details Grid */}
                  {ocr.extractedFields && Object.keys(ocr.extractedFields).length > 0 && (
                    <div className="p-3 bg-white rounded-lg border border-[#E2E8F0] space-y-1.5 shadow-sm">
                      <div className="text-[10px] font-bold text-[#0F766E] uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Auto-Extracted Details:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {Object.entries(ocr.extractedFields).map(([k, v]) => (
                          <div key={k} className="p-1.5 bg-[#F8FAFC] rounded border border-slate-100">
                            <span className="text-[10px] text-slate-500 uppercase font-medium block">{k}</span>
                            <span className="font-bold text-[#173B57] truncate block">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {state.error && (
                <div className="mt-2 text-[11px] text-rose-600 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> {state.error}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
