import React, { useRef, useState } from 'react';
import { FileText, CheckCircle2, AlertCircle, UploadCloud, Shield, HelpCircle, ExternalLink } from 'lucide-react';

/**
 * Dynamic Document Checklist Component
 * Supports actual local storage file picker upload (PDF, PNG, JPG max 10MB)
 */
export default function DynamicDocumentChecklist({ organizationType, uploadedDocs = [], onUploadDoc }) {
  const fileInputRef = useRef(null);
  const [activeUploadDoc, setActiveUploadDoc] = useState(null);

  const getDocumentRequirements = () => {
    switch (organizationType) {
      case 'PRIVATE_COMPANY':
      case 'PUBLIC_COMPANY':
        return {
          required: [
            { type: 'INCORPORATION_CERTIFICATE', label: 'Certificate of Incorporation (COI)', desc: 'Official MCA document proving company registration & CIN.' },
            { type: 'PAN_DOCUMENT', label: 'Organization PAN Card', desc: 'Permanent Account Number issued to company.' },
            { type: 'AUTHORIZATION_LETTER', label: 'Authorized Representative Designation Letter', desc: 'Board resolution or letter authorizing user.' }
          ],
          optional: [
            { type: 'GSTIN_CERTIFICATE', label: 'GSTIN Certificate', desc: 'Goods & Services Tax Registration.' },
            { type: 'BOARD_RESOLUTION', label: 'Board Resolution for CSR / Grants', desc: 'Board authorization for opportunity creation.' }
          ]
        };

      case 'SECTION_8_COMPANY':
      case 'NGO':
      case 'REGISTERED_SOCIETY':
      case 'REGISTERED_TRUST':
        return {
          required: [
            { type: 'REGISTRATION_CERTIFICATE', label: 'Trust Deed / Society / Sec 8 Certificate', desc: 'Legal registration deed/certificate.' },
            { type: 'PAN_DOCUMENT', label: 'Organization PAN Card', desc: 'PAN Card issued to NGO/Trust.' },
            { type: 'AUTHORIZATION_LETTER', label: 'Authorized Signatory Proof', desc: 'Trustee/Secretary authorization letter.' }
          ],
          optional: [
            { type: 'NGO_DARPAN_PROOF', label: 'NITI Aayog NGO Darpan Registration', desc: 'Unique Darpan ID certificate/screenshot.' },
            { type: 'REGISTRATION_12A', label: 'Income Tax 12A Registration', desc: 'Tax exemption certificate under 12A.' },
            { type: 'REGISTRATION_80G', label: 'Income Tax 80G Certificate', desc: 'Donor tax exemption certificate under 80G.' }
          ]
        };

      case 'CSR_IMPLEMENTING_AGENCY':
        return {
          required: [
            { type: 'CSR_REGISTRATION_PROOF', label: 'MCA Form CSR-1 Registration Certificate', desc: 'Mandatory MCA registration for CSR implementation.' },
            { type: 'REGISTRATION_CERTIFICATE', label: 'Entity Registration Certificate', desc: 'Trust / Sec 8 / Society Registration.' },
            { type: 'PAN_DOCUMENT', label: 'Organization PAN Card', desc: 'Organization PAN Card.' }
          ],
          optional: [
            { type: 'REGISTRATION_80G', label: '80G Tax Exemption Certificate', desc: 'Active 80G certificate.' },
            { type: 'CSR_AUDITED_FINANCIALS', label: 'Audited Financial Statements (Last 3 Yrs)', desc: 'Financial audit statements for CSR eligibility.' }
          ]
        };

      case 'GOVERNMENT_BODY':
      case 'GOVERNMENT_RECOGNIZED_INSTITUTION':
        return {
          required: [
            { type: 'OFFICIAL_GAZETTE_NOTIFICATION', label: 'Government Gazette / Order of Establishment', desc: 'Official order constituting the department/institution.' },
            { type: 'NODAL_OFFICER_APPOINTMENT', label: 'Nodal Officer Designation / Appointment Order', desc: 'Authorized nodal officer administrative order.' }
          ],
          optional: [
            { type: 'SANCTION_AUTHORITY_LETTER', label: 'Scheme Administration Mandate', desc: 'Official mandate for managing grants.' }
          ]
        };

      default:
        return {
          required: [
            { type: 'REGISTRATION_CERTIFICATE', label: 'Registration Proof / Incorporation', desc: 'Legal identification proving entity existence.' },
            { type: 'PAN_DOCUMENT', label: 'PAN Card / Tax ID', desc: 'PAN Card or equivalent tax identifier.' }
          ],
          optional: [
            { type: 'GSTIN_CERTIFICATE', label: 'GSTIN Registration', desc: 'Tax registration certificate.' }
          ]
        };
    }
  };

  const reqs = getDocumentRequirements();

  const handleSelectFile = (docType, label) => {
    setActiveUploadDoc({ docType, label });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && activeUploadDoc && onUploadDoc) {
      onUploadDoc(activeUploadDoc.docType, file, activeUploadDoc.label);
      setActiveUploadDoc(null);
    }
  };

  const getUploadedDoc = (docType) => {
    return uploadedDocs.find(d => d.documentType === docType);
  };

  return (
    <div className="space-y-6">
      
      {/* Hidden File Input for Real Local Storage Picking */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
      />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
        <div>
          <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#0F766E]" /> Entity Verification Document Checklist
          </span>
        </div>
        <div className="text-slate-500 text-xs font-medium">
          Uploaded: <span className="font-bold text-[#173B57]">{uploadedDocs.length}</span> files
        </div>
      </div>

      {/* Mandatory Documents Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-amber-600" /> Mandatory Legal Entity Documents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reqs.required.map((doc, idx) => {
            const uploadedItem = getUploadedDoc(doc.type);
            return (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                  uploadedItem ? 'bg-[#F0FDFA] border-[#CCFBF1]' : 'bg-white border-[#E2E8F0] shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#173B57] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#0F766E]" /> {doc.label}
                    </span>
                    {uploadedItem ? (
                      <span className="text-[10px] font-bold text-[#115E59] bg-[#CCFBF1] px-2 py-0.5 rounded-full border border-[#14B8A6]/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#0F766E]" /> Uploaded
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{doc.desc}</p>
                </div>

                {uploadedItem && (
                  <div className="text-[10px] bg-white p-2 rounded-lg border border-slate-200 flex justify-between items-center text-slate-700">
                    <span className="font-mono truncate max-w-[200px]">{uploadedItem.documentName}</span>
                    <a
                      href={uploadedItem.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0F766E] hover:text-[#115E59] font-bold flex items-center gap-1"
                    >
                      View File <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSelectFile(doc.type, doc.label)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                      uploadedItem 
                        ? 'bg-white hover:bg-slate-50 text-[#173B57] border border-[#CBD5E1]' 
                        : 'bg-[#0F766E] hover:bg-[#115E59] text-white shadow-sm'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{uploadedItem ? 'Re-upload Local File' : 'Upload Local File'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional / Recognition Documents Section */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-[#0F766E] uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[#0F766E]" /> Optional Supporting / Tax Exemption Evidence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reqs.optional.map((doc, idx) => {
            const uploadedItem = getUploadedDoc(doc.type);
            return (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                  uploadedItem ? 'bg-[#F0FDFA] border-[#CCFBF1]' : 'bg-white border-[#E2E8F0] shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#173B57] flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-400" /> {doc.label}
                    </span>
                    {uploadedItem ? (
                      <span className="text-[10px] font-bold text-[#115E59] bg-[#CCFBF1] px-2 py-0.5 rounded-full border border-[#14B8A6]/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#0F766E]" /> Uploaded
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        Optional
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{doc.desc}</p>
                </div>

                {uploadedItem && (
                  <div className="text-[10px] bg-white p-2 rounded-lg border border-slate-200 flex justify-between items-center text-slate-700">
                    <span className="font-mono truncate max-w-[200px]">{uploadedItem.documentName}</span>
                    <a
                      href={uploadedItem.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0F766E] hover:text-[#115E59] font-bold flex items-center gap-1"
                    >
                      View File <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSelectFile(doc.type, doc.label)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                      uploadedItem 
                        ? 'bg-white hover:bg-slate-50 text-[#173B57] border border-[#CBD5E1]' 
                        : 'bg-[#0F766E] hover:bg-[#115E59] text-white shadow-sm'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{uploadedItem ? 'Re-upload Local File' : 'Upload Local File'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
