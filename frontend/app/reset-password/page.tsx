"use client";
import React, { useState, useRef, Suspense } from 'react';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^[0-9]+$/.test(value)) return;
    
    const newOtp = [...otp];
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split('');
      for (let i = 0; i < pastedData.length; i++) {
        if (index + i < 6) newOtp[index + i] = pastedData[i];
      }
      setOtp(newOtp);
      const lastFilledIndex = Math.min(index + pastedData.length, 5);
      inputRefs.current[lastFilledIndex]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length < 6) {
      setError('Please enter all 6 digits of the OTP.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch("http://localhost:3001/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue, newPassword })
      });
      const data = await res.json();
      
      if (data.status === "success") {
        alert("Password reset successfully! You can now login.");
        router.push('/login');
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err: any) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] font-lineseed antialiased text-white overflow-hidden items-center justify-center relative p-4">
      <div className="absolute top-20 left-20 w-64 h-64 bg-[#ff4f40]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <button
        onClick={() => router.push('/login')}
        className="cursor-pointer absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-slate-500 hover:text-white transition-all group focus:outline-none z-20"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Login</span>
      </button>

      <div className="w-full max-w-md bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-white border border-white/10">
            <LockKeyhole size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 tracking-tight">Reset Password</h2>
        <p className="text-slate-400 text-sm text-center mb-8 px-4">
          Enter the 6-digit OTP sent to your email and your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">OTP Code</label>
            <div className="flex justify-between gap-2 md:gap-3 mt-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-14 md:w-14 md:h-16 bg-[#121214] border border-slate-800/80 rounded-xl text-center text-xl font-bold focus:outline-none focus:border-[#ff4f40]/50 transition-all text-white focus:ring-1 focus:ring-[#ff4f40]/20 placeholder-slate-600"
                />
              ))}
            </div>
          </div>

          <div className="space-y-2 mt-6">
             <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full bg-[#121214] border border-slate-800/80 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[#ff4f40]/50 transition-all placeholder-slate-600 focus:ring-1 focus:ring-[#ff4f40]/20 text-white mt-2"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center mt-8"
          >
            {loading ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
