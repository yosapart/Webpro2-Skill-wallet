"use client";

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle,
  Award,
  LayoutDashboard,
  FileOutput,
  MessageSquare,
  ShieldCheck,
  Code,
  Brain,
  Gamepad2,
  ShieldAlert,
  Menu,
  X,
  ExternalLink,
  Mail,
  Phone,
  CheckCircle2,
  Globe
} from 'lucide-react';

import Link from 'next/link';

const additionalStyles = `
  .animate-float {
    animation: float 4s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }

  .animate-fade-in {
    animation: fadeIn 0.8s ease-in forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.8s ease-out forwards;
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-40px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .animate-slide-in-right {
    animation: slideInRight 0.8s ease-out forwards;
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(40px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .animate-scale-in {
    animation: scaleIn 0.6s ease-out forwards;
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  .animate-bounce-in {
    animation: bounceIn 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  }
  @keyframes bounceIn {
    0% { opacity: 0; transform: scale(0.8); }
    50% { opacity: 1; }
    100% { transform: scale(1); }
  }

  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }

  
`;


const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);



export const LandingPage = ({ onLoginClick, onSignUpClick, onBackToLanding }: { onLoginClick?: () => void, onSignUpClick?: () => void, onBackToLanding?: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('[data-scroll]');
    scrollElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      scrollElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: additionalStyles }} />

      {/* 1. Navbar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div

            className="flex items-center justify-center cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tighter">
                <span className="text-[#ff4f40]">Ip</span>&s
              </span>
              <span className="text-[9px] text-[#ff4f40]  font-bold uppercase tracking-widest hidden sm:block mt-1">
                IT PORTFOLIO
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block mt-1">
                & SKILL
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            <div className="flex gap-8 font-bold text-slate-500">
              <a href="#features" className="hover:text-[#ff4f40] transition-colors">Features</a>
              <a href="#badges" className="hover:text-[#ff4f40] transition-colors">Badges</a>
              <a href="#verification" className="hover:text-[#ff4f40] transition-colors">Verification</a>
            </div>
            <Link href="./login"><div className="cursor-pointer bg-black text-white px-8 py-2.5 rounded-full font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95">
              Login
            </div></Link>
          </nav>

          <button className="md:hidden text-slate-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 p-6 flex flex-col gap-4 font-bold shadow-xl">
            <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
            <a href="#badges" onClick={() => setIsMenuOpen(false)}>Badges</a>
            <a href="#verification" onClick={() => setIsMenuOpen(false)}>Verification</a>

            <Link href="/login"><div className="bg-black text-white w-full py-3 rounded-full text-center cursor-pointer">Login</div></Link>
          </div>
        )}
      </header>

      {/* Hero Section  */}
      <section className="relative pt-20 pb-12 sm:pt-28 md:pt-32 lg:pt-48 md:pb-16 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{
          background: 'radial-gradient(ellipse 800px 400px at 50% 30%, rgba(255, 100, 70, 0.35) 0%, rgba(200, 150, 255, 0.25) 50%, transparent 100%)'
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-14 lg:gap-16 items-center">
          <div className="max-w-145 text-center lg:text-left animate-slide-in-left">
            <h1 className="text-3xl sm:text-4xl md:text-[3.5rem] lg:text-[4.2rem] font-bold text-slate-900 leading-[1.1] tracking-tight mb-2 sm:mb-3 md:mb-4">
              Beyond a Resume.
            </h1>
            <h1 className="text-3xl sm:text-4xl md:text-[3.5rem] lg:text-[4.2rem] font-bold text-[#ff4f40] leading-[1.1] tracking-tight mb-4 sm:mb-6 md:mb-8">
              Build Your Digital Legacy.
            </h1>
            <p className="text-base sm:text-lg md:text-lg text-slate-600 mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-125 mx-auto lg:mx-0">
              The ultimate digital badge wallet for tech students. Showcase your capabilities with credentials verified directly by your professors.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link href="./sign-up"><div className="cursor-pointer bg-[#ff4f40] text-white font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-full hover:bg-[#e53e30] transition-all shadow-xl shadow-rose-200 flex items-center justify-center gap-2 group text-sm sm:text-base">
                Get Started For Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div></Link>
              <button className="bg-white text-slate-500 font-bold px-6 sm:px-10 py-3 sm:py-4 rounded-full border-2 border-slate-100 hover:bg-slate-50 transition-colors text-sm sm:text-base">
                Learn More
              </button>
            </div>

          </div>

          {/* Abstract Mockup Illustration */}
          <div className="relative group animate-slide-in-right hidden md:block">
            {/* Main Card */}
            <div className="relative z-10 bg-white rounded-2xl sm:rounded-3xl md:rounded-[2.2rem] lg:rounded-[2.5rem] shadow-2xl border border-slate-100 p-6 sm:p-7 md:p-8 lg:p-10 transform rotate-2 hover:rotate-0 transition-transform duration-700">
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-slate-100 overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Student" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">Yosapart Raúl</h3>
                  <p className="text-[8px] sm:text-[10px] text-slate-400 font-light uppercase tracking-wider">Applied Computer Science • Student</p>
                </div>
              </div>
              <hr className="border-slate-200"></hr>
              <br></br>
              <div className="grid grid-cols-5 gap-6">
                <div className="col-span-3 bg-slate-50 rounded-3xl h-48 flex items-center justify-center relative border border-slate-100">
                  <div className="w-24 h-24 border-2 border-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                      < ShieldCheck className="text-blue-500" size={32} />
                    </div>
                  </div>
                  {/* Polygon Simulation */}
                  <svg className="absolute inset-0 w-full h-full p-6 text-blue-500/20" viewBox="0 0 100 100">
                    <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="currentColor" />
                    <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" fill="none" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </div>
                <div className="col-span-2 flex flex-col gap-4 text-[#ff4f40]">
                  {[
                    { color: 'blue', icon: <Code size={12} /> },
                    { color: 'rose', icon: <Brain size={12} /> },
                    { color: 'emerald', icon: <Gamepad2 size={12} /> }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white border border-slate-50 rounded-2xl p-3 shadow-sm flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-${item.color}-50 text-${item.color}-500 flex items-center justify-center`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full bg-${item.color}-500`} style={{ width: `${80 - idx * 15}%` }} />
                        </div>
                        <div className="h-1 w-2/3 bg-slate-50 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Badge (landing-page.png) */}
            <div className="absolute -top-6 -right-6 lg:-right-12 z-20 bg-white p-5 rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-4 animate-float">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-[#ff4f40]">
                <CheckCircle2 size={28} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">NEW BADGE</p>
                <p className="font-bold text-slate-800">Advanced HTML</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <br>
      </br>
      <br>
      </br>

      {/*Advanced Skill Management  */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-24 bg-white" id="features">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-[#ff4f40] mb-4 sm:mb-5 md:mb-6 scroll-fade-up" data-scroll>Advanced Skill Management</h2>
          <p className="text-base sm:text-lg md:text-lg text-slate-500 mb-12 sm:mb-16 md:mb-20 max-w-2xl mx-auto font-light leading-relaxed scroll-fade-up" data-scroll>
            Powerful tools to manage, verify, and leverage your professional growth on the blockchain.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-7 md:gap-8">
            {[
              { title: 'Badge System', sub: '(ระบบยืนยันสกิล)', desc: 'A secure, blockchain-backed system for verifying and issuing digital badges.', icon: <Award className="text-[#ff4f40]" size={28} /> },
              { title: 'Skill Hub', sub: '(ระบบรวมศูนย์สกิล)', desc: 'A centralized dashboard to manage all your technical achievements in one place.', icon: <LayoutDashboard className="text-[#ff4f40]" size={28} /> },
              { title: 'Data Export', sub: '(ระบบ Export ข้อมูล)', desc: 'Easily export your digital legacy into professional formats for job applications.', icon: <FileOutput className="text-[#ff4f40]" size={28} /> },
              { title: 'Feedback System', sub: '(ระบบ Feedback)', desc: 'Get direct, constructive feedback from professors on your skill progression.', icon: <MessageSquare className="text-[#ff4f40]" size={28} /> }
            ].map((f, i) => {
              const staggerClasses = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4'];
              return (
                <div key={i} className={`bg-white border border-slate-200 rounded-xl sm:rounded-2xl md:rounded-[2.2rem] lg:rounded-[2.5rem] p-6 sm:p-8 md:p-9 lg:p-10 text-left hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 flex flex-col group cursor-pointer animate-scale-in ${staggerClasses[i]} scroll-zoom`} data-scroll>
                  <div className="w-12 sm:w-14 md:w-14 h-12 sm:h-14 md:h-14 bg-rose-50 rounded-xl sm:rounded-xl md:rounded-2xl flex items-center justify-center mb-6 sm:mb-7 md:mb-8 group-hover:scale-110 transition-transform shrink-0">
                    {f.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 mb-1">{f.title}</h3>
                  <p className="text-xs font-bold text-[#1E1E1E] opacity-50 uppercase tracking-widest mb-3 md:mb-4">{f.sub}</p>
                  <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8 flex-1 leading-relaxed">{f.desc}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                    <span className="text-[#ff4f40] font-bold text-xs sm:text-sm">Learn More</span>
                    <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#ff4f40] group-hover:text-white transition-colors">
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Your Verified Expertise  */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-24 bg-white" id="badges">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-[#ff4f40] mb-4 sm:mb-5 md:mb-6 scroll-fade-up" data-scroll>Your Verified Expertise</h2>
          <p className="text-base sm:text-lg md:text-lg text-slate-500 mb-12 sm:mb-16 md:mb-20 max-w-3xl mx-auto font-light scroll-fade-up" data-scroll>
            Earn high-quality digital badges that represent your technical mastery in key industry domains.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {[
              { title: 'Software / Web Development', bgColor: 'bg-blue-50', textColor: 'text-blue-500', tag: 'Building', tagColor: 'text-blue-500', icon: <Code />, desc: 'With scalable architectures and modern frameworks.' },
              { title: 'Data / AI', bgColor: 'bg-rose-50', textColor: 'text-rose-500', tag: 'Analytics', tagColor: 'text-rose-500', icon: <Brain />, desc: 'Through neural networks and deep data insights.' },
              { title: 'Cyber / Network', bgColor: 'bg-yellow-50', textColor: 'text-yellow-500', tag: 'Protection', tagColor: 'text-yellow-500', icon: <ShieldAlert />, desc: 'With advanced security protocols and firewalls.' },
              { title: 'Game / Graphics', bgColor: 'bg-emerald-50', textColor: 'text-emerald-500', tag: 'Creation', tagColor: 'text-emerald-500', icon: <Gamepad2 />, desc: 'Using 3D modeling and immersive game engines.' }
            ].map((b, i) => {
              const bounceClasses = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4'];
              return (
                <div key={i} className={`bg-white rounded-xl sm:rounded-2xl md:rounded-4xl lg:rounded-[2.5rem] p-6 sm:p-7 md:p-8 border border-slate-200 hover:-translate-y-2 transition-all duration-500 text-left flex flex-col group animate-bounce-in ${bounceClasses[i]} scroll-zoom`} data-scroll>
                  <div className={`w-14 sm:w-16 md:w-16 h-14 sm:h-16 md:h-16 rounded-lg sm:rounded-xl md:rounded-[1.3rem] lg:rounded-3xl ${b.bgColor} ${b.textColor} flex items-center justify-center mb-6 md:mb-8 group-hover:rotate-6 transition-transform shrink-0`}>
                    {React.cloneElement(b.icon, { size: 26 })}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 mb-3 md:mb-4 leading-tight">{b.title}</h3>
                  <p className="text-xs sm:text-sm md:text-sm text-slate-500 leading-relaxed mb-4 md:mb-6">
                    Focusing on <span className={`font-bold ${b.tagColor}`}>{b.tag}</span> {b.desc}
                  </p>
                  <div className="mt-auto">
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div className={`h-full ${b.textColor} w-2/3 opacity-20`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/*Professor-Verified*/}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white" id="verification">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid lg:grid-cols-2 gap-8 sm:gap-12 md:gap-14 lg:gap-20 items-center">

          <div className="relative order-1 lg:order-2 animate-slide-in-right hidden sm:block">
            <div className="relative rounded-2xl sm:rounded-3xl md:rounded-[2.8rem] lg:rounded-[3rem] overflow-hidden shadow-2xl">
              <img
                src="/picture/teacher.jpg"
                alt="Professor"
                className="w-full  aspect-4/5 object-cover grayscale-[0.2]"
              />
            </div>

            {/* Floating Status UI */}
            <div className="absolute top-6 sm:top-10 md:top-12 -left-24 sm:-left-30 md:-left-32 lg:-left-35 bg-white p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-2xl md:rounded-4xl shadow-2xl border border-emerald-100 flex items-center gap-3 sm:gap-4 md:gap-5 animate-float z-20 max-w-65 sm:max-w-none">
              <div className="w-11 sm:w-13 md:w-14 h-11 sm:h-13 md:h-14 bg-emerald-50 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                <CheckCircle size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">STATUS</p>
                <p className="font-bold text-slate-800 text-sm sm:text-base md:text-lg">Verified by Data Professor</p>
              </div>
            </div>

            {/* Professor's Feedback UI */}
            <div className="absolute bottom-2 sm:bottom-8 md:bottom-10 -right-16 sm:-right-12 md:-right-10 bg-white p-3 sm:p-5 md:p-6 rounded-lg sm:rounded-2xl md:rounded-4xl shadow-2xl border border-blue-100 max-w-62.5 sm:max-w-75 md:max-w-[320px] animate-float z-20" style={{ animationDelay: '1s' }}>
              <div className="flex gap-2 sm:gap-3 md:gap-4">
                <div className="w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <MessageSquare size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5 md:mb-2">Professor's Feedback</p>
                  <p className="text-xs sm:text-sm md:text-sm font-medium text-slate-700 italic leading-tight sm:leading-relaxed">
                    "Outstanding work on the data model optimization. Clean and highly efficient code."
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-1 animate-slide-in-left scroll-fade-left" data-scroll>
            <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-1 sm:mb-2 md:mb-2">Professor-Verified</h2>
            <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-[#ff4f40] mb-6 sm:mb-7 md:mb-8">Direct Authentication</h2>
            <p className="text-base sm:text-lg md:text-lg text-slate-500 mb-8 sm:mb-10 md:mb-12 leading-relaxed font-light">
              Say goodbye to unverified claims. Every badge in your Ip&s wallet is authenticated by academic authorities through our secure blockchain platform.
            </p>

            <div className="space-y-8">
              {[
                { title: 'Direct Professor Endorsement', desc: 'Faculty members verify individual skills upon successful project completion.' },
                { title: 'Immutable Blockchain Record', desc: 'Records are permanent, secure, and cannot be falsified by third parties.' },
                { title: 'One-Click Employer Verification', desc: 'Recruiters can instantly confirm your skills via a unique wallet link.' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="mt-1 w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                    <CheckCircle className="text-[#ff4f40]" size={20} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800 mb-1">{item.title}</h4>
                    <p className="text-slate-500 font-light leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/*Footer*/}
      <footer className="bg-[#0a0a0a] text-white pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-8 sm:pb-10 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid sm:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <div className="scroll-fade-left" data-scroll>
              <div className="flex items-center gap-2 mb-6 sm:mb-7 md:mb-8">
                <span className="text-2xl sm:text-2xl md:text-3xl font-bold tracking-tighter">
                  <span className="text-[#ff4f40]">Ip</span>&s
                </span>
              </div>
              <p className="text-slate-400 max-w-sm font-light leading-relaxed text-sm sm:text-base md:text-lg\">
                The ultimate digital badge wallet for tech students. Build your digital legacy today.
              </p>
            </div>

            <div className="lg:text-right">
              <h4 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Contact Us</h4>
              <div className="flex flex-col lg:items-end gap-4 sm:gap-6 text-slate-400 font-light">
                <div className="flex flex-wrap lg:justify-end gap-4 sm:gap-8">
                  <a href="#" className="flex items-center gap-2 hover:text-[#ff4f40] transition-colors font-bold text-xs sm:text-sm"><FacebookIcon /> <span className="hidden sm:inline">facebook</span></a>
                  <a href="#" className="flex items-center gap-2 hover:text-[#ff4f40] transition-colors font-bold text-xs sm:text-sm"><LinkedinIcon /> <span className="hidden sm:inline">LinkedIn</span></a>
                  <a href="#" className="flex items-center gap-2 hover:text-[#ff4f40] transition-colors font-bold text-xs sm:text-sm"><Mail size={16} /> <span className="hidden sm:inline">Email</span></a>
                </div>
                <p className="flex items-center gap-2 font-bold text-white text-xs sm:text-sm"><Phone size={18} className="text-[#ff4f40]" /> 088-888-8888</p>
              </div>
            </div>
          </div>

          <div className="pt-8 sm:pt-10 border-t border-slate-500 text-slate-500 text-xs sm:text-sm font-light flex flex-col sm:flex-row justify-between gap-4">
            <p>© 2026 Ip&s IT Portfolio & Skill. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;