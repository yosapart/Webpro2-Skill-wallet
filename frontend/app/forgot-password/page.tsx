"use client";
import React, { useState } from 'react';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://webpro2-skill-wallet-1.onrender.com/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'reset' }),
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] font-lineseed antialiased text-white overflow-hidden items-center justify-center relative p-4">
      {/* Background Blurs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-[#ff4f40]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <button
        onClick={() => router.back()}
        className="cursor-pointer absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-slate-500 hover:text-white transition-all group focus:outline-none z-20"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back</span>
      </button>

      <div className="w-full max-w-md bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white border border-white/10">
            <KeyRound size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 tracking-tight">Forgot Password</h2>
        <p className="text-slate-400 text-sm text-center mb-8 px-4">
          Enter your email address and we'll send you a 6-digit OTP to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email"
              className="w-full bg-[#121214] border border-slate-800/80 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[#ff4f40]/50 transition-all placeholder-slate-600 focus:ring-1 focus:ring-[#ff4f40]/20 text-white"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98] shadow-xl disabled:opacity-50 flex justify-center items-center disabled:cursor-not-allowed"
          >
            {loading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
