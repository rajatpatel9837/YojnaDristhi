import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GraduationCap, Sparkles, CheckCircle2, BookOpen, ExternalLink, Filter, ShieldCheck } from 'lucide-react';

export default function ScholarSetuPage() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  const [studentProfile, setStudentProfile] = useState({
    educationLevel: 'Undergraduate',
    courseName: 'B.Tech',
    category: 'SC',
    familyIncome: 200000,
    marksPercentage: 82,
    gender: 'Female'
  });

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/scholarships/match', studentProfile);
      setScholarships(res.data.data || []);
    } catch (err) {
      console.warn('Scholarship API error, using fallback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 text-[#173B57] space-y-4 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#CCFBF1] border border-[#14B8A6]/40 text-[#115E59] text-xs font-bold">
          <GraduationCap className="w-4 h-4 text-[#0F766E]" />
          ScholarSetu Extension Module
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">AI-Driven Scholarship Matching Platform</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          ScholarSetu demonstrates the reusability of Yojna दृष्टि's Eligibility Matching Engine. The same hard filter and compatibility architecture translates complex academic, financial, and category scholarship criteria into clear opportunities for students.
        </p>
      </div>

      {/* Student Profile Quick Controls */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm space-y-4 text-xs text-[#173B57]">
        <h2 className="font-bold text-sm text-[#173B57] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#0F766E]" />
          Student Eligibility Profile Criteria
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-[#173B57] font-bold mb-1">Education Level</label>
            <select
              value={studentProfile.educationLevel}
              onChange={(e) => setStudentProfile({ ...studentProfile, educationLevel: e.target.value })}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
            >
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Doctorate">Doctorate</option>
            </select>
          </div>

          <div>
            <label className="block text-[#173B57] font-bold mb-1">Social Category</label>
            <select
              value={studentProfile.category}
              onChange={(e) => setStudentProfile({ ...studentProfile, category: e.target.value })}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
            >
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="OBC">OBC</option>
              <option value="EWS">EWS</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-[#173B57] font-bold mb-1">Family Income (₹/yr)</label>
            <input
              type="number"
              value={studentProfile.familyIncome}
              onChange={(e) => setStudentProfile({ ...studentProfile, familyIncome: Number(e.target.value) })}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] font-bold focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          <div>
            <label className="block text-[#173B57] font-bold mb-1">Academic Marks (%)</label>
            <input
              type="number"
              value={studentProfile.marksPercentage}
              onChange={(e) => setStudentProfile({ ...studentProfile, marksPercentage: Number(e.target.value) })}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#173B57] font-bold focus:outline-none focus:border-[#0F766E]"
            />
          </div>
        </div>

        <button
          onClick={fetchScholarships}
          className="px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
        >
          <Sparkles className="w-4 h-4" /> Re-Evaluate Scholarship Fits
        </button>
      </div>

      {/* Matched Scholarships Cards */}
      <div className="space-y-4">
        <h2 className="font-bold text-[#173B57] text-sm">Matched Scholarship Schemes</h2>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-xs bg-white border border-[#E2E8F0] rounded-2xl">
            Evaluating scholarship rules...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {scholarships.map((item, idx) => {
              const sch = item.scholarship || item;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#E2E8F0] hover:border-[#0F766E] rounded-2xl p-6 shadow-sm hover:shadow-md space-y-4 flex flex-col justify-between transition"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#CCFBF1] text-[#115E59] border border-[#14B8A6]/30 text-[10px] font-bold">
                        {sch.providerType || 'Government'}
                      </span>
                      <span className="font-extrabold text-[#0F766E] text-sm">{item.matchScore}% Fit</span>
                    </div>

                    <h3 className="text-base font-bold text-[#173B57]">{sch.title}</h3>
                    <p className="text-slate-500 text-xs">{sch.provider}</p>
                    <p className="text-slate-600 text-xs leading-relaxed">{sch.description}</p>
                  </div>

                  <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Award Support:</span>
                      <span className="font-bold text-[#0F766E]">₹{sch.amountPerYear?.toLocaleString('en-IN')} / year</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Target Category:</span>
                      <span className="font-semibold text-[#173B57]">{(sch.categories || []).join(', ')}</span>
                    </div>
                  </div>

                  <a
                    href={sch.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-center block transition text-xs shadow-sm"
                  >
                    Apply via National Scholarship Portal <ExternalLink className="w-3.5 h-3.5 inline ml-1" />
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
