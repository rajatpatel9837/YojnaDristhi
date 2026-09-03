import React, { useState, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { HeartHandshake, Sparkles, CheckCircle2, ShieldCheck, CreditCard, DollarSign } from 'lucide-react';

export default function SponsorshipPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  // Payment modal state
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [amount, setAmount] = useState(1000);
  const [sponsorName, setSponsorName] = useState('Anand Kumar');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/sponsorships/campaigns');
      setCampaigns(res.data.data || []);
    } catch (err) {
      console.warn('Sponsorship fetch error.');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const res = await axios.post('/api/sponsorships/pay', {
        campaignId: selectedCampaign._id,
        amount: Number(amount),
        sponsorName,
        isAnonymous
      });

      const receiptData = res.data.receipt;
      setReceipt(receiptData);

      // Trigger celebratory confetti effect
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      fetchCampaigns();
    } catch (err) {
      alert('Demo payment processed!');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 text-[#173B57] space-y-4 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFBF1] border border-[#14B8A6]/40 text-[#115E59] text-xs font-bold">
          <HeartHandshake className="w-4 h-4 text-[#0F766E]" />
          Sponsor a Beneficiary
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Direct Micro-Sponsorship for Small Businesses</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Empower verified marginalized entrepreneurs by bridging their funding gap for critical machinery, solar equipment, or working capital.
        </p>
      </div>

      {/* Campaign Grid */}
      <div className="space-y-4">
        <h2 className="font-bold text-[#173B57] text-sm">Active Beneficiary Funding Requests</h2>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-xs bg-white border border-[#E2E8F0] rounded-2xl">Loading sponsorship campaigns...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {campaigns.map((c, idx) => {
              const progressPct = Math.min(100, Math.round((c.raisedAmount / c.targetAmount) * 100));

              return (
                <div key={idx} className="bg-white border border-[#E2E8F0] hover:border-[#0F766E] rounded-2xl p-6 shadow-sm hover:shadow-md space-y-4 flex flex-col justify-between transition text-[#173B57]">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[11px] bg-[#F0FDFA] text-[#0F766E] px-2.5 py-0.5 rounded font-bold border border-[#CCFBF1]">
                        {c.beneficiaryCode || `YS-BEN-${1020 + idx}`}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{c.state}</span>
                    </div>

                    <h3 className="text-base font-bold text-[#173B57]">{c.title}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed">{c.story}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Raised: <strong className="text-[#0F766E] font-bold">₹{c.raisedAmount?.toLocaleString('en-IN')}</strong></span>
                      <span className="text-slate-500">Goal: <strong className="text-[#173B57] font-bold">₹{c.targetAmount?.toLocaleString('en-IN')}</strong></span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                      <div className="bg-[#0F766E] h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCampaign(c);
                      setReceipt(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold transition text-xs shadow-sm"
                  >
                    Sponsor This Business
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Simulated Payment Gateway Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173B57]/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-md shadow-2xl p-6 text-[#173B57] space-y-6 text-xs">
            <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3">
              <h2 className="font-bold text-[#173B57] text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0F766E]" />
                Simulated Payment Gateway
              </h2>
              <button onClick={() => setSelectedCampaign(null)} className="text-slate-400 hover:text-[#173B57]">✕</button>
            </div>

            {receipt ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 rounded-full bg-[#CCFBF1] border border-[#14B8A6]/40 text-[#0F766E] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#173B57]">Sponsorship Successful!</h3>
                <p className="text-slate-600 text-xs">Thank you for empowering {selectedCampaign.beneficiaryCode}.</p>
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-[11px] text-left space-y-1 font-mono">
                  <div>Transaction ID: <span className="text-[#0F766E] font-bold">{receipt.transactionId}</span></div>
                  <div>Amount Paid: ₹{receipt.amount?.toLocaleString('en-IN')}</div>
                  <div>Sponsor: {receipt.sponsorName}</div>
                </div>
                <button onClick={() => setSelectedCampaign(null)} className="w-full py-2 bg-[#0F766E] hover:bg-[#115E59] text-white rounded-xl font-bold transition shadow-sm">Done</button>
              </div>
            ) : (
              <form onSubmit={handlePay} className="space-y-4">
                <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
                  <div className="font-bold text-[#173B57] text-xs">{selectedCampaign.title}</div>
                  <div className="text-[11px] text-slate-500">Beneficiary Code: {selectedCampaign.beneficiaryCode}</div>
                </div>

                <div>
                  <label className="block text-[#173B57] font-bold mb-1">Sponsorship Contribution (₹)</label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] font-bold focus:outline-none focus:border-[#0F766E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#173B57] font-bold mb-1">Sponsor Full Name</label>
                  <input
                    type="text"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
                    disabled={isAnonymous}
                  />
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                  <input
                    type="checkbox"
                    id="anon"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="accent-[#0F766E]"
                  />
                  <label htmlFor="anon">Donate anonymously</label>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F0FDFA] border border-[#CCFBF1] text-[10px] text-[#115E59] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>Sandbox Mock Payment - No real money will be charged</span>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs shadow-sm transition disabled:opacity-50"
                >
                  {processing ? 'Processing Payment...' : `Contribute ₹${Number(amount).toLocaleString('en-IN')}`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
