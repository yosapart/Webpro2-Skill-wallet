"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AuthService, getApiUrl } from '../../services/auth.service';

function OTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const purpose = searchParams.get('purpose') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleResend = async () => {
    if (!canResend || resendLoading) return;
    
    setResendLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${getApiUrl()}/auth/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose })
      });
      const data = await res.json();
      
      if (data.status === "success") {
        setCountdown(60);
        setCanResend(false);
      } else {
        setError(data.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      setError("Connection error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    // อนุญาตเฉพาะตัวเลข
    if (value && !/^[0-9]+$/.test(value)) return;

    const newOtp = [...otp];
    // รองรับการ Paste วางทีเดียว 6 ตัว
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

    // เลื่อนช่องโฟกัสอัตโนมัติ
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Verify OTP
      const verifyRes = await fetch(`${getApiUrl()}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue, purpose })
      });
      const verifyData = await verifyRes.json();

      if (verifyData.status !== "success") {
        setError(verifyData.message || "Invalid OTP code");
        setLoading(false);
        return;
      }

      // 2. ถ้ามาจากหน้าสมัครใหม่
      if (purpose === 'register') {
        const storedUser = sessionStorage.getItem('pendingUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);

          const regRes = await fetch(`${getApiUrl()}/auth/register/email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
          });
          const regData = await regRes.json();

          if (regData.status === "success") {
            sessionStorage.removeItem('pendingUser');
            // ล็อกอินอัตโนมัติเพื่อให้ได้ Token
            try {
              await AuthService.loginWithVerifierId(userData.email, userData.password);
            } catch (err) {
              console.error("Auto login failed", err);
            }
            router.push('/user/overview');
          } else {
            setError(regData.message || "Registration failed after OTP verification");
          }
        } else {
          setError("Session expired. Please try signing up again.");
        }
      } else {
        // อนาคตเผื่อไว้สำหรับลืมรหัสผ่าน
        alert("OTP verified successfully!");
      }
    } catch (err: any) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#050505] font-lineseed antialiased text-white overflow-hidden items-center justify-center relative p-4">
      {/* พื้นหลัง */}
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
          <div className="w-16 h-16 bg-[#ff4f40]/10 rounded-full flex items-center justify-center text-[#ff4f40] border border-[#ff4f40]/20 shadow-[0_0_15px_rgba(255,79,64,0.2)]">
            <ShieldCheck size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2 tracking-tight">Check your email</h2>
        <p className="text-slate-400 text-sm text-center mb-8 px-4">
          We've sent a 6-digit verification code to your email. Please enter it below to verify your identity.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2 md:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 md:w-14 md:h-16 bg-[#121214] border border-slate-800/80 rounded-xl text-center text-xl font-bold focus:outline-none focus:border-[#ff4f40]/50 transition-all text-white focus:ring-1 focus:ring-[#ff4f40]/20 placeholder-slate-600"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium animate-in slide-in-from-top-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-slate-200 transition-all active:scale-[0.98] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              "Verify Code"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Didn't receive the code?{' '}
            {canResend ? (
              <button 
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-white hover:text-[#ff4f40] font-semibold transition-colors cursor-pointer outline-none focus:outline-none disabled:opacity-50"
              >
                {resendLoading ? "Resending..." : "Resend now"}
              </button>
            ) : (
              <span className="text-[#ff4f40] font-semibold">
                Resend in {countdown}s
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading...</div>}>
      <OTPContent />
    </Suspense>
  );
}
