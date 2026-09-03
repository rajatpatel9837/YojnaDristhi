import React, { useState } from 'react';
import axios from 'axios';
import { useVoice } from '../context/VoiceContext';
import { Mic, MicOff, Volume2, X, Send, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function AskYojnaSetuModal({ isOpen, onClose, onSelectScheme }) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Namaste! I am the Yojna दृष्टि AI Assistant. Ask me anything about government schemes, loans, subsidies, documents, or eligibility for your business!'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const { isListening, startListening, speakText } = useVoice();

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const prompt = textToSend || query;
    if (!prompt.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: prompt }];
    setMessages(newMsgs);
    setQuery('');
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/chat', { question: prompt });
      const aiData = res.data.data;

      setMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: aiData.reply,
          suggestedScheme: aiData.suggestedScheme,
          suggestedSchemeSlug: aiData.suggestedSchemeSlug
        }
      ]);

      speakText(aiData.reply);
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: 'PMEGP (up to ₹50L subsidy) and MUDRA (collateral-free up to ₹10L) are top matches for small entrepreneurs. Complete your profile wizard to view complete eligibility!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceClick = () => {
    startListening((recognizedText) => {
      setQuery(recognizedText);
      handleSend(recognizedText);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#173B57]/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col h-[520px] text-[#173B57]">
        
        {/* Header */}
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full object-contain border border-[#E2E8F0]" />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-[#173B57]">Yojna दृष्टि Assistant</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#CCFBF1] text-[#115E59] text-[10px] font-bold">
                  Live Voice & Text
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Discover. Apply. Track. • Ask in your language</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#173B57] hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#F8FAFC]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#0F766E] text-white font-medium rounded-br-none'
                    : 'bg-white text-[#173B57] border border-[#E2E8F0] rounded-bl-none'
                }`}
              >
                {m.text}
              </div>

              {m.suggestedScheme && (
                <div className="mt-2 p-3 bg-white border border-[#CCFBF1] rounded-xl shadow-sm text-xs space-y-1.5 max-w-[85%]">
                  <div className="flex items-center gap-1 text-[#0F766E] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Matched Recommended Scheme
                  </div>
                  <div className="font-bold text-[#173B57]">{m.suggestedScheme}</div>
                  <button
                    onClick={() => {
                      onClose();
                      if (onSelectScheme) onSelectScheme(m.suggestedSchemeSlug);
                    }}
                    className="text-[11px] text-[#0F766E] font-bold hover:underline"
                  >
                    View Scheme Details →
                  </button>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="text-xs text-slate-500 flex items-center gap-2 p-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0F766E] animate-spin" />
              <span>Analyzing official eligibility guidelines...</span>
            </div>
          )}
        </div>

        {/* Action Input */}
        <div className="p-3 bg-white border-t border-[#E2E8F0] flex items-center gap-2">
          <button
            onClick={handleVoiceClick}
            className={`p-2.5 rounded-xl border transition ${
              isListening
                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                : 'bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] border-[#14B8A6]/40'
            }`}
            title="Speak Question"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening to your voice..." : "Ask in English, हिंदी, or ਪੰਜਾਬੀ..."}
            className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#CBD5E1] text-[#173B57] text-xs placeholder-slate-400 focus:outline-none focus:border-[#0F766E]"
          />

          <button
            onClick={() => handleSend()}
            disabled={!query.trim()}
            className="px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs disabled:opacity-50 transition shadow-sm flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
