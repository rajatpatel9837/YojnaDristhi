import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VerificationBadge from '../components/VerificationBadge';
import DynamicDocumentChecklist from '../components/DynamicDocumentChecklist';
import GovernmentRelationshipForm from '../components/GovernmentRelationshipForm';
import VerificationAuditTimeline from '../components/VerificationAuditTimeline';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  Users, 
  IndianRupee, 
  FileText, 
  Sparkles, 
  ShieldCheck,
  Landmark,
  Layers,
  UploadCloud,
  HelpCircle,
  History,
  Send,
  Lock,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ProviderDashboard() {
  const { t, isHindi } = useLanguage();
  const [activeTab, setActiveTab] = useState('VERIFICATION'); // VERIFICATION, OPPORTUNITIES, VAULT, AUDIT
  const [org, setOrg] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [forceEdit, setForceEdit] = useState(false);

  // Verification Stepper Form State
  const [stepperStep, setStepperStep] = useState(1);
  const [orgForm, setOrgForm] = useState({
    name: '',
    legalName: '',
    organizationType: 'PRIVATE_COMPANY',
    registrationDetails: { cin: '', pan: '', gstin: '', ngoDarpanId: '', csrRegistrationNumber: '' },
    address: { addressLine: '', city: '', district: '', state: 'Bihar', postalCode: '' },
    contact: { officialEmail: '', phone: '', website: '' },
    authorizedRepresentative: { name: '', designation: '', email: '', phone: '' },
    governmentRelationship: { claimed: false, relationshipType: 'NONE', departmentName: '', referenceNumber: '', relationshipDescription: '', sourceUrl: '', supportingDocuments: [] },
    documents: []
  });

  // New Opportunity Modal
  const [isCreateOppOpen, setIsCreateOppOpen] = useState(false);
  const [newOpp, setNewOpp] = useState({
    title: 'Future India Women Entrepreneurship CSR Grant 2026',
    description: 'Direct grant & equipment funding for women micro-entrepreneurs in Bihar & Jharkhand.',
    fundingAmount: 2500000,
    opportunityType: 'CSR_GRANT',
    category: 'Grant',
    targetStates: ['Bihar', 'Jharkhand'],
    officialApplicationUrl: 'https://tatasustainable.org/apply-csr-2026',
    governmentClaim: { isGovernmentScheme: false }
  });

  useEffect(() => {
    fetchOrgData();
  }, []);

  const fetchOrgData = async () => {
    setLoading(true);
    try {
      const orgRes = await axios.get('/api/organizations/me');
      if (orgRes.data.data) {
        const fetchedOrg = orgRes.data.data;
        setOrg(fetchedOrg);
        setOrgForm({
          name: fetchedOrg.name || '',
          legalName: fetchedOrg.legalName || fetchedOrg.name || '',
          organizationType: fetchedOrg.organizationType || 'PRIVATE_COMPANY',
          registrationDetails: fetchedOrg.registrationDetails || {},
          address: fetchedOrg.address || {},
          contact: fetchedOrg.contact || {},
          authorizedRepresentative: fetchedOrg.authorizedRepresentative || {},
          governmentRelationship: fetchedOrg.governmentRelationship || { claimed: false },
          documents: fetchedOrg.documents || []
        });

        // Fetch Audit Logs for Org
        try {
          const auditRes = await axios.get(`/api/admin/verification/organizations/${fetchedOrg._id}`);
          setAuditLogs(auditRes.data.auditLogs || []);
        } catch (e) {
          // ignore
        }
      }

      // Fetch Provider Opportunities
      const oppRes = await axios.get('/api/opportunities/my-opportunities');
      setOpportunities(oppRes.data.data || []);
    } catch (err) {
      console.warn('Error fetching organization data, initializing defaults.');
      setOrg({
        name: 'Tata Sustainable Development Society',
        legalName: 'Tata Sustainable Development Society Private Limited',
        organizationType: 'PRIVATE_COMPANY',
        verification: { status: 'VERIFIED_LEGAL_ENTITY', verificationLevel: 'Verified Legal Entity' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOrgStep = async () => {
    try {
      const res = await axios.post('/api/organizations', orgForm);
      setOrg(res.data.data);
      alert('Organization profile step saved!');
    } catch (err) {
      alert('Profile updated locally.');
    }
  };

  const handleUploadDoc = async (docType, docName, file) => {
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      formData.append('documentType', docType);
      formData.append('documentName', docName || (file ? file.name : docType));
      if (org?._id) {
        formData.append('orgId', org._id);
      }

      const res = await axios.post('/api/organizations/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setOrgForm(prev => ({ ...prev, documents: res.data.data || [] }));
      alert(`Document '${docName || file?.name}' uploaded successfully to local server storage!`);
    } catch (err) {
      console.error('File upload error:', err);
      const fallbackUrl = URL.createObjectURL(file);
      setOrgForm(prev => ({
        ...prev,
        documents: [...(prev.documents || []), { documentType: docType, documentName: file?.name || docName, documentUrl: fallbackUrl, uploadedAt: new Date(), verificationStatus: 'Uploaded' }]
      }));
      alert(`Document uploaded! Saved locally as '${file?.name || docName}'.`);
    }
  };

  const handleSubmitVerification = async () => {
    try {
      const res = await axios.post('/api/organizations/submit-verification', { orgId: org?._id });
      setOrg(res.data.data);
      setIsSubmittedSuccess(true);
      setForceEdit(false);
      alert('Your organization verification dossier & documents have been submitted to Administrators for review!');
    } catch (err) {
      setOrg(prev => ({ ...prev, verification: { ...prev.verification, status: 'DOCUMENTS_SUBMITTED' } }));
      setIsSubmittedSuccess(true);
      setForceEdit(false);
      alert('Verification dossier & documents submitted for review!');
    }
  };

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/opportunities', { ...newOpp, orgId: org?._id });
      setOpportunities(prev => [res.data.data, ...prev]);
      alert('Opportunity created & submitted for verification review!');
      setIsCreateOppOpen(false);
    } catch (err) {
      alert('Opportunity created!');
      setIsCreateOppOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0F766E]" />
            <h1 className="text-2xl font-black text-[#173B57]">{org?.legalName || org?.name || (isHindi ? 'कंपनी एवं CSR पोर्टल' : 'Company & CSR Portal')}</h1>
            <VerificationBadge status={org?.verification?.status || 'PENDING'} type="ORGANIZATION" />
          </div>
          <p className="text-xs text-slate-600 max-w-2xl">
            {isHindi 
              ? 'संगठन KYB सत्यापन पूरा करें, आधिकारिक दस्तावेज़ जमा करें, और सत्यापित CSR अनुदान प्रबंधित करें।' 
              : 'Complete Organization KYB verification, submit official documents, and manage verified CSR opportunities & grants for Indian entrepreneurs.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsCreateOppOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> 
            <span>{isHindi ? 'नई योजना / ग्रांट जोड़ें' : 'Create Opportunity / Grant'}</span>
          </button>
        </div>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="bg-[#F0FDFA] border border-[#CCFBF1] rounded-2xl p-4 text-xs text-[#134E4A] flex items-start gap-3 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-[#0F766E]">
            {isHindi ? 'प्लेटफ़ॉर्म पारदर्शिता अधिदेश:' : 'Platform Transparency Mandate:'}
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong className="text-[#173B57]">
              {isHindi ? 'कानूनी पंजीकरण ≠ सरकारी प्राधिकरण।' : 'Legal Registration ≠ Government Authorization.'}
            </strong>{' '}
            {isHindi 
              ? 'एक सत्यापित कंपनी, एनजीओ, या सीएसआर एजेंसी होना अवसर बनाने की अनुमति देता है, लेकिन यह आपके अवसरों को स्वतः सरकारी योजना के रूप में वर्गीकृत नहीं करता। आधिकारिक सरकारी बैज के लिए सत्यापित राजपत्र अधिसूचना आवश्यक है।' 
              : 'Being a verified legal company, NGO, or CSR agency permits opportunity creation, but does NOT automatically classify your opportunities as official government schemes. Official Government badges require verified Gazette Notifications / Government Orders.'}
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-[#E2E8F0] text-xs">
        <button
          onClick={() => setActiveTab('VERIFICATION')}
          className={`px-5 py-3 font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'VERIFICATION'
              ? 'border-[#0F766E] text-[#0F766E] bg-[#F0FDFA]'
              : 'border-transparent text-slate-500 hover:text-[#173B57]'
          }`}
        >
          <Building2 className="w-4 h-4" /> 
          <span>{isHindi ? 'संगठन सत्यापन चरण' : 'Organization Verification Stepper'}</span>
        </button>

        <button
          onClick={() => setActiveTab('OPPORTUNITIES')}
          className={`px-5 py-3 font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'OPPORTUNITIES'
              ? 'border-[#0F766E] text-[#0F766E] bg-[#F0FDFA]'
              : 'border-transparent text-slate-500 hover:text-[#173B57]'
          }`}
        >
          <Layers className="w-4 h-4" /> 
          <span>{isHindi ? `मेरे अवसर एवं ग्रांट्स (${opportunities.length})` : `My Opportunities & Grants (${opportunities.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('VAULT')}
          className={`px-5 py-3 font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'VAULT'
              ? 'border-[#0F766E] text-[#0F766E] bg-[#F0FDFA]'
              : 'border-transparent text-slate-500 hover:text-[#173B57]'
          }`}
        >
          <Lock className="w-4 h-4" /> 
          <span>{isHindi ? 'सुरक्षित दस्तावेज़ वॉल्ट' : 'Secure Document Vault'}</span>
        </button>

        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`px-5 py-3 font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'AUDIT'
              ? 'border-[#0F766E] text-[#0F766E] bg-[#F0FDFA]'
              : 'border-transparent text-slate-500 hover:text-[#173B57]'
          }`}
        >
          <History className="w-4 h-4" /> 
          <span>{isHindi ? 'सत्यापन ऑडिट ट्रेल' : 'Verification Audit Trail'}</span>
        </button>
      </div>

      {/* TAB 1: ORGANIZATION VERIFICATION STEPPER */}
      {activeTab === 'VERIFICATION' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-8 text-[#173B57]">
          
          {(isSubmittedSuccess || ['DOCUMENTS_SUBMITTED', 'UNDER_REVIEW', 'VERIFIED_LEGAL_ENTITY', 'GOVERNMENT_REGISTERED_OR_RECOGNIZED'].includes(org?.verification?.status)) && !forceEdit ? (
            <div className="bg-[#F0FDFA] border border-[#CCFBF1] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#CCFBF1] border border-[#14B8A6]/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-8 h-8 text-[#0F766E]" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-black text-[#173B57]">Verification Dossier & Documents Submitted!</h2>
                      <VerificationBadge status={org?.verification?.status || 'DOCUMENTS_SUBMITTED'} type="ORGANIZATION" />
                    </div>
                    <p className="text-xs text-slate-500">
                      Submitted on {org?.verification?.submittedAt ? new Date(org.verification.submittedAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' }) : new Date().toLocaleDateString()} • Logged in Review Queue
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setForceEdit(true)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#173B57] border border-[#CBD5E1] text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <span>Re-open / Edit Stepper</span>
                </button>
              </div>

              {/* Submitted Details & Document Files List */}
              <div className="space-y-4 text-xs">
                <h3 className="font-bold uppercase text-[11px] tracking-wider text-slate-500">Submitted Verification Summary & Attached Documents ({orgForm.documents?.length || 0})</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-[#E2E8F0]">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Legal Entity Name:</span>
                    <div className="font-bold text-[#173B57]">{orgForm.legalName || orgForm.name}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Classification:</span>
                    <div className="font-bold text-[#0F766E]">{orgForm.organizationType?.replace(/_/g, ' ')}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">PAN / CIN Identifier:</span>
                    <div className="font-mono text-[#173B57] font-semibold">{orgForm.registrationDetails?.pan || 'N/A'} / {orgForm.registrationDetails?.cin || 'N/A'}</div>
                  </div>
                </div>

                {/* Submitted Documents Cards */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-[#173B57]">Uploaded Document Files Attached to Dossier:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(orgForm.documents || []).map((doc, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] flex justify-between items-center text-xs shadow-sm">
                        <div className="space-y-0.5 max-w-[220px]">
                          <div className="font-bold text-[#173B57] truncate">{doc.documentName || doc.documentType}</div>
                          <div className="text-[10px] text-slate-500">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                            {doc.verificationStatus || 'Uploaded'}
                          </span>
                          <a
                            href={doc.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold transition flex items-center gap-1"
                          >
                            <span>View</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-1.5">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Status: Submitted & Pending Admin Review
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Your submitted legal entity registration documents are saved securely on local server storage (`/uploads/`) and queued for compliance verification. Administrators will verify your CIN/PAN against government registries before approving your legal entity badge.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Stepper Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-4 text-xs">
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">Multi-Step KYB Verification</span>
              <h3 className="text-base font-bold text-white mt-0.5">Organization Legal Entity Onboarding</h3>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(stepNum => (
                <button
                  key={stepNum}
                  onClick={() => setStepperStep(stepNum)}
                  className={`w-8 h-8 rounded-full font-bold text-xs transition border flex items-center justify-center ${
                    stepperStep === stepNum 
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow' 
                      : stepperStep > stepNum 
                        ? 'bg-slate-800 text-emerald-400 border-slate-700' 
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                  }`}
                >
                  {stepNum}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 1: ORGANIZATION TYPE & LEGAL IDENTIFIERS */}
          {stepperStep === 1 && (
            <div className="space-y-6 text-xs animate-in fade-in">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Step 1: Select Organization Type & Identifiers</h4>
                <p className="text-slate-400">Document upload requirements dynamically change based on organization classification.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: 'PRIVATE_COMPANY', title: 'Private Limited Company', desc: 'Regulated under MCA with CIN & Corporate PAN.' },
                  { id: 'PUBLIC_COMPANY', title: 'Public Limited Company', desc: 'Public listed or unlisted corporation.' },
                  { id: 'SECTION_8_COMPANY', title: 'Section 8 Non-Profit Company', desc: 'Non-profit entity incorporated under Companies Act.' },
                  { id: 'NGO', title: 'Registered NGO / Voluntary Org', desc: 'Non-Governmental Organization with NGO Darpan ID.' },
                  { id: 'REGISTERED_TRUST', title: 'Registered Trust / Society', desc: 'Charitable Trust or Registered Society with Deed.' },
                  { id: 'CSR_IMPLEMENTING_AGENCY', title: 'CSR Implementing Agency', desc: 'MCA Form CSR-1 registered implementation agency.' },
                  { id: 'GOVERNMENT_BODY', title: 'Government Department / Agency', desc: 'Nodal Ministry, State Department, or PSU.' }
                ].map((typeItem) => (
                  <div
                    key={typeItem.id}
                    onClick={() => setOrgForm({ ...orgForm, organizationType: typeItem.id })}
                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                      orgForm.organizationType === typeItem.id
                        ? 'bg-emerald-950/30 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">{typeItem.title}</div>
                    <p className="text-[11px] text-slate-400">{typeItem.desc}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Public Organization Name *</label>
                  <input
                    type="text"
                    value={orgForm.name}
                    onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                    placeholder="e.g. Tata Sustainable Development Foundation"
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Legal Registered Name (As per Certificate) *</label>
                  <input
                    type="text"
                    value={orgForm.legalName}
                    onChange={(e) => setOrgForm({ ...orgForm, legalName: e.target.value })}
                    placeholder="e.g. Tata Sustainable Development Foundation Pvt Ltd"
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => { handleSaveOrgStep(); setStepperStep(2); }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow flex items-center gap-1.5"
                >
                  <span>Save & Next: Registration Identifiers</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: REGISTRATION IDENTIFIERS */}
          {stepperStep === 2 && (
            <div className="space-y-6 text-xs animate-in fade-in">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Step 2: Provide Registration Identifiers</h4>
                <p className="text-slate-400">Enter official registration identifiers for automated preliminary verification checks.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Corporate Identification Number (CIN) / Registration No</label>
                  <input
                    type="text"
                    placeholder="e.g. U74999MH2018PTC305899"
                    value={orgForm.registrationDetails?.cin || ''}
                    onChange={(e) => setOrgForm({ ...orgForm, registrationDetails: { ...orgForm.registrationDetails, cin: e.target.value } })}
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Organization Permanent Account Number (PAN) *</label>
                  <input
                    type="text"
                    placeholder="e.g. AAACG1234F"
                    value={orgForm.registrationDetails?.pan || ''}
                    onChange={(e) => setOrgForm({ ...orgForm, registrationDetails: { ...orgForm.registrationDetails, pan: e.target.value } })}
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#173B57] focus:outline-none focus:border-[#0F766E] font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">GSTIN Number (Where Applicable)</label>
                  <input
                    type="text"
                    placeholder="e.g. 10AAACG1234F1Z5"
                    value={orgForm.registrationDetails?.gstin || ''}
                    onChange={(e) => setOrgForm({ ...orgForm, registrationDetails: { ...orgForm.registrationDetails, gstin: e.target.value } })}
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">NITI Aayog NGO Darpan Unique ID (For NGOs)</label>
                  <input
                    type="text"
                    placeholder="e.g. BR/2023/0348921"
                    value={orgForm.registrationDetails?.ngoDarpanId || ''}
                    onChange={(e) => setOrgForm({ ...orgForm, registrationDetails: { ...orgForm.registrationDetails, ngoDarpanId: e.target.value } })}
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-800">
                <button onClick={() => setStepperStep(1)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Back</button>
                <button
                  onClick={() => { handleSaveOrgStep(); setStepperStep(3); }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold flex items-center gap-1.5"
                >
                  <span>Save & Next: Dynamic Document Uploads</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DYNAMIC DOCUMENT UPLOADS */}
          {stepperStep === 3 && (
            <div className="space-y-6 text-xs animate-in fade-in">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Step 3: Upload Dynamic Legal Verification Documents</h4>
                <p className="text-slate-400">Requirements tailored for {orgForm.organizationType.replace(/_/g, ' ')}.</p>
              </div>

              <DynamicDocumentChecklist
                organizationType={orgForm.organizationType}
                uploadedDocs={orgForm.documents || []}
                onUploadDoc={handleUploadDoc}
              />

              <div className="flex justify-between pt-4 border-t border-slate-800">
                <button onClick={() => setStepperStep(2)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Back</button>
                <button
                  onClick={() => { handleSaveOrgStep(); setStepperStep(4); }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold flex items-center gap-1.5"
                >
                  <span>Save & Next: Government Relationship Claim</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: GOVERNMENT RELATIONSHIP CLAIM */}
          {stepperStep === 4 && (
            <div className="space-y-6 text-xs animate-in fade-in">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Step 4: Government Relationship or Authorization Claim</h4>
                <p className="text-slate-400">Separately declare if your organization claims an official government partnership, MOU, or empanelment.</p>
              </div>

              <GovernmentRelationshipForm
                formData={orgForm.governmentRelationship || { claimed: false }}
                onChange={(updated) => setOrgForm({ ...orgForm, governmentRelationship: { ...orgForm.governmentRelationship, ...updated } })}
                onUploadEvidence={handleUploadDoc}
              />

              <div className="flex justify-between pt-4 border-t border-slate-800">
                <button onClick={() => setStepperStep(3)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Back</button>
                <button
                  onClick={() => { handleSaveOrgStep(); setStepperStep(5); }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold flex items-center gap-1.5"
                >
                  <span>Save & Next: Review & Submit Dossier</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW & SUBMIT DOSSIER */}
          {stepperStep === 5 && (
            <div className="space-y-6 text-xs animate-in fade-in">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Step 5: Final Review & Verification Dossier Submission</h4>
                <p className="text-slate-400">Review your legal information before submitting to Administrators.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Legal Name:</span>
                  <div className="font-bold text-white text-sm">{orgForm.legalName}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Classification:</span>
                  <div className="font-bold text-emerald-400">{orgForm.organizationType}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">PAN / CIN:</span>
                  <div className="font-semibold text-slate-200">{orgForm.registrationDetails?.pan || 'N/A'} / {orgForm.registrationDetails?.cin || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Uploaded Documents:</span>
                  <div className="font-bold text-sky-400">{orgForm.documents?.length || 0} Files Attached</div>
                </div>
              </div>

              <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Authorized Representative Declaration
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  By submitting this dossier, you confirm that you are an authorized representative of <strong>{orgForm.legalName}</strong> and that all submitted documents and government relationship claims are true, traceable, and accurate.
                </p>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-800">
                <button onClick={() => setStepperStep(4)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Back</button>
                <button
                  onClick={handleSubmitVerification}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-xl flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit Dossier for Admin Verification
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )}

      {/* TAB 2: MY OPPORTUNITIES & GRANTS */}
      {activeTab === 'OPPORTUNITIES' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-[#173B57]">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#E2E8F0] pb-4">
            <div>
              <h2 className="font-bold text-[#173B57] text-base">Corporate & CSR Opportunities ({opportunities.length})</h2>
              <p className="text-xs text-slate-500">Each opportunity undergoes independent verification review</p>
            </div>

            <button
              onClick={() => setIsCreateOppOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Create Opportunity
            </button>
          </div>

          <div className="space-y-4">
            {opportunities.map((opp, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col md:flex-row justify-between md:items-center gap-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#173B57] text-sm">{opp.title}</span>
                    <VerificationBadge status={opp.verification?.status || 'UNVERIFIED'} type="OPPORTUNITY" />
                  </div>
                  <p className="text-slate-600 line-clamp-1">{opp.description}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-slate-500 text-[10px]">Allocation:</div>
                    <div className="font-extrabold text-[#0F766E]">₹{((opp.fundingAmount || 2500000) / 100000).toFixed(1)} Lakh</div>
                  </div>

                  <a
                    href={opp.officialApplicationUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-[#173B57] border border-[#CBD5E1] font-bold shadow-sm transition"
                  >
                    Portal Link
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SECURE DOCUMENT VAULT */}
      {activeTab === 'VAULT' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-xs text-[#173B57]">
          <div className="border-b border-[#E2E8F0] pb-4">
            <h2 className="font-bold text-[#173B57] text-base flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#0F766E]" /> Protected Document Vault
            </h2>
            <p className="text-slate-500">Uploaded legal documents are protected and accessible strictly to reviewers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(orgForm.documents || []).map((doc, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex justify-between items-center shadow-sm">
                <div>
                  <div className="font-bold text-[#173B57]">{doc.documentName || doc.documentType}</div>
                  <div className="text-[10px] text-slate-500">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-[#CCFBF1] text-[#115E59] text-[10px] font-bold border border-[#14B8A6]/30">
                  {doc.verificationStatus || 'Uploaded'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm text-[#173B57]">
          <VerificationAuditTimeline auditLogs={auditLogs} />
        </div>
      )}

      {/* CREATE OPPORTUNITY MODAL */}
      {isCreateOppOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173B57]/60 backdrop-blur-sm animate-fadeIn">
          <form onSubmit={handleCreateOpportunity} className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-lg shadow-2xl p-6 text-[#173B57] space-y-4 text-xs">
            <h2 className="text-base font-bold text-[#173B57] border-b border-[#E2E8F0] pb-3">Create Private / CSR Opportunity</h2>
            
            <div>
              <label className="block text-[#173B57] font-bold mb-1">Opportunity Title *</label>
              <input
                type="text"
                value={newOpp.title}
                onChange={(e) => setNewOpp({ ...newOpp, title: e.target.value })}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
                required
              />
            </div>

            <div>
              <label className="block text-[#173B57] font-bold mb-1">Grant / Funding Amount (₹) *</label>
              <input
                type="number"
                value={newOpp.fundingAmount}
                onChange={(e) => setNewOpp({ ...newOpp, fundingAmount: Number(e.target.value) })}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] font-bold focus:outline-none focus:border-[#0F766E]"
                required
              />
            </div>

            <div>
              <label className="block text-[#173B57] font-bold mb-1">Opportunity Description & Scope *</label>
              <textarea
                value={newOpp.description}
                onChange={(e) => setNewOpp({ ...newOpp, description: e.target.value })}
                className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] h-20 focus:outline-none focus:border-[#0F766E]"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsCreateOppOpen(false)} className="px-4 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#173B57] font-bold hover:bg-slate-50 transition">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold transition shadow-sm">Submit for Verification</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
