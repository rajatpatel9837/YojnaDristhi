import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { 
  FileCheck, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  Search,
  Sliders,
  CheckCircle2,
  Lock,
  Building,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import ApplicationProgressTracker from '../components/ApplicationProgressTracker';

export default function TrackApplicationPage() {
  const { t } = useLanguage();
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Officer Update Modal state
  const [showOfficerModal, setShowOfficerModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState('DOCUMENT_VERIFICATION');
  const [sanctionAmount, setSanctionAmount] = useState(50000);
  const [officerRemarks, setOfficerRemarks] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/applications');
      if (res.data && res.data.data) {
        setApplications(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedAppId(res.data.data[0]._id || res.data.data[0].applicationNumber);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedApp = applications.find(a => (a._id === selectedAppId || a.applicationNumber === selectedAppId));

  const filteredApps = applications.filter(a => 
    a.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.schemeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.applicantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOfficerUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setUpdating(true);
    setUpdateMessage(null);

    try {
      // 1. Update Application Status
      await axios.patch(`/api/officer/applications/${selectedApp._id || selectedApp.applicationNumber}/status`, {
        targetStatus,
        remarks: officerRemarks || `Officer verified and updated status to ${targetStatus}`,
        officerName: 'State Nodal Verification Officer'
      });

      // 2. If status is SANCTIONED or RELEASED or PAYMENT_SUCCESS, update financial status as well
      if (['SANCTIONED', 'RELEASED', 'PAYMENT_SUCCESS'].includes(targetStatus)) {
        await axios.patch(`/api/officer/applications/${selectedApp._id || selectedApp.applicationNumber}/financial-status`, {
          sanction: targetStatus === 'SANCTIONED' ? {
            status: 'SANCTIONED',
            amount: Number(sanctionAmount),
            referenceId: `SAN-${Math.floor(10000 + Math.random() * 90000)}`,
            date: new Date()
          } : undefined,
          release: targetStatus === 'RELEASED' ? {
            status: 'RELEASED',
            amount: Number(sanctionAmount),
            date: new Date()
          } : undefined,
          payment: targetStatus === 'PAYMENT_SUCCESS' ? {
            status: 'PAYMENT_SUCCESS',
            transactionReference: `TXN****${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date()
          } : undefined,
          officerName: 'State Nodal Verification Officer'
        });
      }

      setUpdateMessage('✓ Status updated successfully!');
      setShowOfficerModal(false);
      fetchApplications();
    } catch (err) {
      console.error('Officer update error:', err);
      setUpdateMessage(`⚠ Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#0F766E] font-bold uppercase text-xs tracking-wider mb-1">
            <FileCheck className="w-4 h-4 text-[#0F766E]" />
            National Portal for Application & Fund Disbursal Tracking
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#173B57]">
            {t('track_title', 'Track Scheme Application & PFMS Disbursal')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t('track_subtitle', 'Transparent real-time tracking from Verification and Ministry Sanction to Direct Benefit Transfer (DBT) settlement.')}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowOfficerModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold text-xs shadow-sm transition flex items-center gap-2"
          >
            <Sliders className="w-4 h-4" />
            <span>Officer Portal Mode (Update Status)</span>
          </button>
        </div>
      </div>

      {/* Application Selector Grid */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-sm font-bold text-[#173B57] flex items-center gap-2">
            <Building className="w-4 h-4 text-[#0F766E]" /> Active Applications ({filteredApps.length})
          </h2>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t('track_placeholder', 'Search Application ID or Scheme...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#173B57] text-xs placeholder-slate-400 focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 bg-white border border-[#E2E8F0] rounded-2xl">
            <RefreshCw className="w-6 h-6 text-[#0F766E] animate-spin mx-auto mb-2" />
            <p className="text-xs">Loading application records...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredApps.map((app) => {
              const isSelected = (app._id === selectedAppId || app.applicationNumber === selectedAppId);
              return (
                <div
                  key={app._id || app.applicationNumber}
                  onClick={() => setSelectedAppId(app._id || app.applicationNumber)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-[#F0FDFA] border-2 border-[#0F766E] shadow-sm'
                      : 'bg-white border-[#E2E8F0] hover:border-[#14B8A6] hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[11px] font-extrabold text-[#0F766E] uppercase tracking-wider block font-mono">
                        {app.applicationNumber}
                      </span>
                      <h3 className="font-bold text-[#173B57] text-xs line-clamp-1 mt-0.5">{app.schemeName}</h3>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#115E59] border border-[#14B8A6]/30 text-[10px] font-bold shrink-0">
                      {app.applicationStatus}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Amount: <strong className="text-[#173B57]">₹{(app.requestedAmount || 50000).toLocaleString('en-IN')}</strong></span>
                    <span className="text-[#0F766E] font-bold">{app.progressPercentage || 15}% Completed</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Primary Application Progress & Financial Tracker */}
      {selectedApp ? (
        <ApplicationProgressTracker
          application={selectedApp}
          onSyncComplete={() => fetchApplications()}
        />
      ) : (
        <div className="text-center py-16 bg-white border border-[#E2E8F0] rounded-2xl text-slate-500">
          <p className="text-xs">Select an application above to view detailed progress and financial status.</p>
        </div>
      )}

      {/* Officer Mode Update Status Modal */}
      {showOfficerModal && (
        <div className="fixed inset-0 z-50 bg-[#173B57]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            
            <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F59E0B] flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" /> Government Verification Officer Portal
                </span>
                <h3 className="text-base font-extrabold text-[#173B57]">Update Application Lifecycle Status</h3>
              </div>
              <button 
                onClick={() => setShowOfficerModal(false)}
                className="text-slate-400 hover:text-[#173B57] font-bold text-base p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOfficerUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#173B57] font-bold mb-1">Target Application ID</label>
                <input
                  type="text"
                  disabled
                  value={selectedApp?.applicationNumber || ''}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F766E] font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[#173B57] font-bold mb-1">Authoritative Lifecycle Stage</label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white border border-[#CBD5E1] text-[#173B57] font-semibold focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#CCFBF1]"
                >
                  <option value="DOCUMENT_VERIFICATION">1. Documents Verification</option>
                  <option value="ELIGIBILITY_VERIFICATION">2. Eligibility Verification</option>
                  <option value="APPROVED">3. Officer Approval (Application Approved)</option>
                  <option value="SANCTIONED">4. Sanctioned (Ministry Sanction Letter Issued)</option>
                  <option value="RELEASED">5. Fund Released (Nodal Treasury Release Order)</option>
                  <option value="PAYMENT_SUCCESS">6. Payment/Credit (DBT Credit Settled to Bank)</option>
                  <option value="COMPLETED">7. Completed (Application Journey Complete)</option>
                  <option value="REJECTED">8. Rejected</option>
                </select>
              </div>

              {['SANCTIONED', 'RELEASED', 'PAYMENT_SUCCESS'].includes(targetStatus) && (
                <div>
                  <label className="block text-[#173B57] font-bold mb-1">Sanction / Disbursal Amount (₹)</label>
                  <input
                    type="number"
                    value={sanctionAmount}
                    onChange={(e) => setSanctionAmount(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-white border border-[#CBD5E1] text-[#173B57] font-bold focus:outline-none focus:border-[#0F766E]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#173B57] font-bold mb-1">Verification Officer Remarks</label>
                <textarea
                  rows={3}
                  value={officerRemarks}
                  onChange={(e) => setOfficerRemarks(e.target.value)}
                  placeholder="Enter verification notes, sanction order number, or treasury release details..."
                  className="w-full p-2.5 rounded-lg bg-white border border-[#CBD5E1] text-[#173B57] focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowOfficerModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#173B57] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white font-bold shadow-sm disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
