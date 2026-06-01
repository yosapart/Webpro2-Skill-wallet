"use client";
import React, { useState } from 'react';
import { Quote, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthService } from '../../services/auth.service';

export const LoginPage = ({ onBackToLanding, onLoginSuccess }: { onBackToLanding?: () => void, onLoginSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const router = useRouter();

  const handleBackToLanding = () => {
    if (onBackToLanding) onBackToLanding();
    else router.push('/');
  };

  const handleLoginSuccess = (role?: string) => {
    if (onLoginSuccess) {
      onLoginSuccess();
    } else {
      if (role === 'verifier') {
        router.push('/professor/request');
      } else {
        router.push('/user/overview');
      }
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;

    try {
      setLoading(true);
      setError("");
      // ล็อกอินด้วยไอดีและรหัสผ่านอาจารย์
      const result = await AuthService.loginWithVerifierId(emailInput, passwordInput);
      if (result.success) {
        handleLoginSuccess(result.role);
      }
    } catch (err: any) {
      setError("Incorrect email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await AuthService.loginWithGoogle();

      if (result.requireRegistration) {
        // ถ้ายอมให้คนแปลกหน้าเข้ามาเป็นนักศึกษาอัตโนมัติ 
        // เราสามารถแอบเรียก register ตรงนี้ได้เลย หรือเด้งไปหน้าให้กรอกข้อมูลเพิ่ม
        await AuthService.registerStudent(result.idToken, result.name || "Student");
        localStorage.setItem("token", result.idToken);
        localStorage.setItem("userRole", "user");
        handleLoginSuccess();
      } else if (result.success) {
        handleLoginSuccess();
      }
    } catch (err: any) {
      const errMsg = String(err?.message || err || "");
      if (errMsg.includes("popup-closed-by-user") || errMsg.includes("cancelled-popup-request")) {
        setError("Login cancelled. Please try again.");
      } else {
        setError(errMsg || "Failed to login with Google");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen bg-[#050505] font-lineseed antialiased text-white overflow-hidden">

      {/* LEFT PANEL*/}
      <div className="w-full lg:w-[45%] flex flex-col items-center justify-center p-8 md:p-16 relative z-10">
        <button
          onClick={handleBackToLanding}
          className="cursor-pointer absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-slate-500 hover:text-white transition-all group focus:outline-none"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
        </button>
        <div className="w-full max-w-[400px]">
          {/* Logo Section */}
          <div
            onClick={onBackToLanding}
            className="flex items-center justify-center cursor-pointer group"
          >
            <div className="flex items-center gap-2 mb-16 justify-center lg:text-center">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold tracking-tighter text-[#ff4f40]">Ip</span>
                <span className="text-2xl font-bold tracking-tighter text-white">&s</span>
              </div>
              <div className="flex flex-col ml-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-none">
                  <span className="text-[#ff4f40]">IT portfolio&</span> skill
                </span>
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center lg:text-center mb-12">
            <h1 className="text-[42px] font-bold leading-tight tracking-tight text-white">Welcome Back</h1>
          </div>


          {/* Social Login (Google Only) */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-slate-800 rounded-full hover:bg-white/5 transition-all mb-8 group active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            ) : (
              <svg width="20" height="20" viewBox="0 0 48 48" className="group-hover:scale-110 transition-transform">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
            )}
            <span className="font-bold text-sm text-slate-200">
              Continue with Google
            </span>
          </button>

          {/* Separator */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-slate-600"></div>
            <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">or</span>
            <div className="h-px flex-1 bg-slate-600"></div>
          </div>

          {/* Auth Form */}
          <form className="space-y-4" onSubmit={handleManualLogin}>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter your Email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#121214] border border-slate-800/80 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[#ff4f40]/50 transition-all placeholder-slate-600 focus:ring-1 focus:ring-[#ff4f40]/20"
              />
            </div>

            <div className="space-y-2 relative">
              <input
                type="password"
                placeholder="Enter your Password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-[#121214] border border-slate-800/80 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[#ff4f40]/50 transition-all placeholder-slate-600 focus:ring-1 focus:ring-[#ff4f40]/20"
              />
              <div className="flex justify-end mt-2">
                <Link href="/forgot-password" className="text-[11px] font-light text-slate-500 hover:text-white transition-colors underline decoration-slate-700 underline-offset-4">forgot password?</Link>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm font-medium text-left w-full px-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer w-full bg-white text-black font-bold py-4 rounded-full hover:bg-slate-200 transition-all active:scale-[0.98] mt-6 shadow-xl disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Continue"}
            </button>
          </form>

          {/* Footer Text */}
          <p className="mt-12 text-[11px] text-center text-slate-500 leading-relaxed font-medium">
            By continuing, you agree to Ip&s{' '}
            <a href="#" className="text-white hover:underline transition-all">Terms of Service</a> and{' '}
            <a href="#" className="text-white hover:underline transition-all">Privacy Policy</a>.
          </p>

        </div>
      </div>

      {/*RIGHT PANEL*/}
      <div className="hidden lg:flex w-[55%] relative items-center justify-center overflow-hidden">

        {/* Mock Background Image*/}
        <img
          src="picture/bg-login.avif"
          alt="Technical Drawing"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity scale-110"
        />

        {/* Gradient Overlays based on login.jpg */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff4f40]/30 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/40 to-[#050505]"></div>

        {/* Abstract Background Blur Nodes */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#ff4f40]/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]"></div>

        {/* Quote Card (Glassmorphism) */}
        <div className="relative z-10 w-full max-w-[580px] h-full max-h-[593px] bg-white/[0.02] backdrop-blur-[30px] border border-white/10 rounded-[3rem] p-16 shadow-2xl overflow-hidden group">
          {/* Quote Icon */}
          <div className="relative">
            <div className="text-[#ff4f40] mb-6"><Quote size={27} /></div>
          </div>

          <h2 className="relative text-[2.2rem] font-bold leading-[1.15] text-white mb-6 tracking-tight">
            "This platform bridges the gap between academic theory and industry reality."
          </h2>

          <p className="relative text-[#868686] text-base leading-relaxed mb-10 font-light max-w-[480px]">
            The verified digital badges have completely transformed how we evaluate upcoming tech talent.
            It's no longer just about what's on a resume; it's about <span className="text-slate-300 font-medium">verified cryptographic proof of skill</span>.
          </p>

          <div className="relative h-px w-full bg-gradient-to-r from-white/10 via-white/90 to-transparent mb-10"></div>

          {/* Author Info */}
          <div className="relative flex items-center gap-5">
            <div className="relative">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl relative z-10">
                <img
                  src="picture/dr.png"
                  alt="Dr. Wittawin"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <p className="font-bold text-xl text-white tracking-wide">Dr. Wittawin Susutti</p>
              <p className="text-[#ff4f40] text-[8px] font-light uppercase tracking-[0.2em] mt-1 opacity-90">
                CHAIRPERSON OF THE APPLIED COMPUTER SCIENCE PROGRAM, KMUTT
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
