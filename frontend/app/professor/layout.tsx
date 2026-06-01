"use client";

import React, { useState, useEffect } from 'react';
import {
    Inbox,
    Users,
    Settings,
    AlignLeft,
    LogOut,
    X,
    ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AuthService } from '../../services/auth.service';

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function ProfessorLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showLogout, setShowLogout] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [professor, setProfessor] = useState<{ name: string; avatar_url: string } | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await AuthService.getFreshToken();
                if (!token) {
                    router.push('/login');
                    return;
                }
                const res = await fetch("https://webpro2-skill-wallet-1.onrender.com/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                
                if (data.status === "success") {
                    // ตรวจสอบว่าเป็นอาจารย์จริงๆ หรือไม่
                    if (data.data?.role !== 'verifier') {
                        router.push('/user/overview');
                        return;
                    }

                    setProfessor({
                        name: data.data?.profile?.name || "Professor",
                        avatar_url: data.data?.profile?.avatar_url || DEFAULT_AVATAR,
                    });
                } else {
                    router.push('/login');
                }
            } catch (e) {
                console.error("Failed to fetch professor profile:", e);
                router.push('/login');
            }
        };
        fetchProfile();
    }, [router]);

    const professorName = professor?.name || "Professor";
    const professorAvatar = professor?.avatar_url || DEFAULT_AVATAR;

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            router.push('/');
        } catch (e) {
            console.error("Logout failed:", e);
        }
    };

    const isActive = (path: string) => pathname === path;

    const navItems = [
        { href: '/professor/request', label: 'Evaluation Inbox', icon: <Inbox size={20} /> },
        { href: '/professor/stu-directory', label: 'Student Directory', icon: <Users size={20} /> },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-lineseed selection:bg-[#ff4f40]/30 selection:text-white">

            {/* ── SIDEBAR (desktop lg+ only) ── */}
            <aside className={`hidden lg:flex ${isCollapsed ? 'w-20' : 'w-64'} h-full bg-[#0a0a0a] border-r border-white/5 flex-col py-8 shrink-0 z-40 transition-all duration-300 ease-in-out relative`}>
                <div className={`px-6 mb-12 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 focus:outline-none transition-colors cursor-pointer">
                        <AlignLeft size={24} />
                    </button>
                    {!isCollapsed && <span className="text-xl font-bold tracking-tighter"><span className="text-[#ff4f40]">Ip</span>&s</span>}
                </div>

                <nav className="flex flex-col w-full px-4 gap-2">
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href}>
                            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3.5 rounded-xl text-sm font-medium relative overflow-hidden cursor-pointer transition-all
                                ${isActive(item.href)
                                    ? 'bg-white/5 text-white border border-white/10 font-bold'
                                    : 'border border-transparent text-slate-500 hover:text-white hover:bg-white/5'}`}>
                                {isActive(item.href) && !isCollapsed && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-[#ff4f40] rounded-r-full shadow-[2px_0_10px_rgba(255,79,64,0.5)]" />
                                )}
                                <span className={isActive(item.href) ? 'text-[#ff4f40] shrink-0' : 'shrink-0'}>{item.icon}</span>
                                {!isCollapsed && <span className="truncate leading-none">{item.label}</span>}
                            </div>
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto px-4 flex flex-col gap-4 relative">
                    <div className="relative">
                        <button onClick={() => setShowLogout(!showLogout)}
                            className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3.5 rounded-xl text-slate-500 hover:text-white transition-all text-sm font-medium cursor-pointer group focus:outline-none`}>
                            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                            {!isCollapsed && <span>Setting</span>}
                        </button>
                        {showLogout && (
                            <div className="absolute left-0 bottom-full mb-2 w-full min-w-30 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-60 animate-in slide-in-from-bottom-2">
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-colors cursor-pointer">
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="h-px bg-white/5 mx-2" />
                    <div className={`px-2 pb-2 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} group cursor-pointer`}>
                        <div className="relative shrink-0 shadow-2xl">
                            <img src={professorAvatar} className="w-11 h-11 rounded-full border-2 border-white/10 group-hover:border-[#ff4f40] transition-colors object-cover" alt="Prof" />
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col min-w-0 flex-1">
                                <p className="text-sm font-bold text-white truncate leading-none">{professorName}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1.5 opacity-60 leading-none">PROFESSOR</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* ── MOBILE / TABLET TOP BAR ── */}
            <div className="lg:hidden fixed top-0 inset-x-0 z-50 bg-[#0a0a0a] border-b border-white/5 h-14 flex items-center justify-between px-4">
                <button onClick={() => setDrawerOpen(true)} className="p-2 -ml-1 text-slate-400 hover:text-white transition-colors">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </button>
                <span className="text-base font-bold tracking-tighter"><span className="text-[#ff4f40]">Ip</span>&s</span>
                <img src={professorAvatar} className="w-8 h-8 rounded-full border border-white/10 object-cover" alt="Prof" />
            </div>

            {/* ── MOBILE DRAWER ── */}
            {drawerOpen && (
                <>
                    <div className="lg:hidden fixed inset-0 z-60 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
                    <div className="lg:hidden fixed top-0 left-0 bottom-0 z-70 w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col py-8 animate-in slide-in-from-left duration-200">
                        <div className="px-6 mb-12 flex items-center justify-between">
                            <span className="text-xl font-bold tracking-tighter"><span className="text-[#ff4f40]">Ip</span>&s</span>
                            <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"><X size={18} /></button>
                        </div>

                        <nav className="flex flex-col w-full px-4 gap-2">
                            {navItems.map(item => (
                                <Link key={item.href} href={item.href} onClick={() => setDrawerOpen(false)}>
                                    <div className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium relative overflow-hidden cursor-pointer transition-all
                                        ${isActive(item.href)
                                            ? 'bg-white/5 text-white border border-white/10 font-bold'
                                            : 'border border-transparent text-slate-500 hover:text-white hover:bg-white/5'}`}>
                                        {isActive(item.href) && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-[#ff4f40] rounded-r-full shadow-[2px_0_10px_rgba(255,79,64,0.5)]" />
                                        )}
                                        <span className={isActive(item.href) ? 'text-[#ff4f40] shrink-0' : 'shrink-0'}>{item.icon}</span>
                                        <span className="truncate leading-none">{item.label}</span>
                                    </div>
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto px-4 flex flex-col gap-4">
                            <div className="relative">
                                <button onClick={() => setShowLogout(!showLogout)}
                                    className="flex items-center w-full gap-4 px-4 py-3.5 rounded-xl text-slate-500 hover:text-white transition-all text-sm font-medium cursor-pointer focus:outline-none">
                                    <Settings size={20} />
                                    <span>Setting</span>
                                </button>
                                {showLogout && (
                                    <div className="absolute left-0 bottom-full mb-2 w-full bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-80">
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-colors cursor-pointer">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="h-px bg-white/5 mx-2" />
                            <div className="px-2 pb-2 flex items-center gap-3">
                                <div className="relative shrink-0">
                                    <img src={professorAvatar} className="w-10 h-10 rounded-full border-2 border-white/10 object-cover" alt="Prof" />
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]" />
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <p className="text-sm font-bold text-white truncate leading-none">{professorName}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1.5 opacity-60 leading-none">PROFESSOR</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── PAGE CONTENT ── */}
            <main className="flex-1 overflow-hidden flex flex-col pt-14 lg:pt-0">
                {children}
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
        </div>
    );
}
