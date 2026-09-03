import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Lock, Mail, Building2, HeartHandshake } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      login(res.data.data, res.data.data.token);
      navigate('/');
    } catch (err) {
      // Demo fallback login
      const demoUser = { _id: 'u_101', name: email.split('@')[0], email, role: 'BENEFICIARY' };
      login(demoUser, 'demo_jwt_token_123');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm space-y-6 text-[#173B57] text-xs">
        <div className="text-center space-y-3">
          <img src="/logo.png" alt="Yojna दृष्टि Logo" className="w-16 h-16 rounded-full object-contain mx-auto border border-[#E2E8F0] shadow-sm" />
          <div>
            <h1 className="text-xl font-black text-[#173B57]">Sign in to Yojna दृष्टि</h1>
            <p className="text-slate-500 text-xs mt-1">Discover. Apply. Track. — Citizen Portal</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[#173B57] font-bold mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. sunita@demo.in"
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
              required
            />
          </div>

          <div>
            <label className="block text-[#173B57] font-bold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold transition shadow-sm"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500 space-y-1">
          <div>Demo Accounts: <span className="font-mono text-slate-700">sunita.entrepreneur@demo.in</span></div>
          <div className="pt-2">
            Don't have an account? <Link to="/register" className="text-[#0F766E] font-bold hover:underline">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('BENEFICIARY');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', { name, email, password, role });
      login(res.data.data, res.data.data.token);
      navigate('/');
    } catch (err) {
      const newUser = { _id: 'u_' + Date.now(), name, email, role };
      login(newUser, 'demo_jwt_token_123');
      navigate('/');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm space-y-6 text-[#173B57] text-xs">
        <div className="text-center space-y-3">
          <img src="/logo.png" alt="Yojna दृष्टि Logo" className="w-16 h-16 rounded-full object-contain mx-auto border border-[#E2E8F0] shadow-sm" />
          <div>
            <h1 className="text-xl font-black text-[#173B57]">Create Yojna दृष्टि Account</h1>
            <p className="text-slate-500 text-xs mt-1">Select your ecosystem role to get started</p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[#173B57] font-bold mb-1">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#173B57] font-bold focus:outline-none focus:border-[#0F766E]"
            >
              <option value="BENEFICIARY">Citizen / Entrepreneur / Beneficiary</option>
              <option value="PROVIDER">Company / CSR Organization</option>
              <option value="SPONSOR">Individual Sponsor</option>
            </select>
          </div>

          <div>
            <label className="block text-[#173B57] font-bold mb-1">Full Name / Organization Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
              required
            />
          </div>

          <div>
            <label className="block text-[#173B57] font-bold mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
              required
            />
          </div>

          <div>
            <label className="block text-[#173B57] font-bold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-[#173B57] focus:outline-none focus:border-[#0F766E]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold transition shadow-sm"
          >
            Create Account
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500">
          Already have an account? <Link to="/login" className="text-[#0F766E] font-bold hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
