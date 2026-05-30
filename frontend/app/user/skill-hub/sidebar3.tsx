"use client";

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Medal,
  FolderOpen,
  FileUp,
  Settings,
  AlignLeft,
  Clock,
  RotateCcw,
  ShieldCheck,
  Quote,
  ChevronRight,
  ExternalLink,
  MoreVertical,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SkillHubService, UserProfile } from '../../../services/skill-hub.service';

const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

export const Sidebar3 = ({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) => {
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await SkillHubService.getMyProfile();
      if (data) {
        setProfile(data);
        if (data.profile?.name) setUserName(data.profile.name);
        if (data.profile?.avatar_url) setUserAvatar(data.profile.avatar_url);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    import('../../../config/firebase').then(({ auth }) => {
      const unsubscribe = auth.onAuthStateChanged((user: any) => {
        if (user) {
          // ใช้ Firebase displayName/email ก่อน
          const firebaseName = user.displayName || user.email?.split('@')[0] || 'Student';
          if (!userName) setUserName(firebaseName);
          if (!userAvatar) setUserAvatar(user.photoURL || '');
        }
      });
      return () => unsubscribe();
    });
  }, []);



  return (
    <div className="flex h-screen overflow-hidden bg-[#050505] text-white font-lineseed selection:bg-[#ff4f40]/30 selection:text-white">

      {/* 1. SIDEBAR (ปรับความกว้างตามสถานะ isCollapsed) */}
      <aside
        className={`hidden md:flex ${isCollapsed ? 'w-[80px]' : 'w-[260px]'} h-full bg-[#0a0a0a] border-r border-white/5 flex-col py-8 flex-shrink-0 z-50 transition-all duration-300 ease-in-out`}
      >

        {/* Sidebar Header: Hamburger | Logo (ซ่อนโลโก้เมื่อหดเมนู) */}
        <div className={`px-6 mb-12 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
          <button
            onClick={() => onToggle()}
            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors focus:outline-none cursor-pointer"
          >
            <AlignLeft size={24} />
          </button>
          {!isCollapsed && (
            <div className="flex items-center gap-1.5 select-none animate-in fade-in duration-300">
              <span className="text-xl font-bold tracking-tighter">
                <span className="text-[#ff4f40]">Ip</span>&s
              </span>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col w-full px-4 gap-2">
          {/* Overview (Active) */}
          <Link href="/user/overview"><div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3.5 rounded-xl text-slate-400 hover:bg-white/5 transition-all text-sm font-medium cursor-pointer group`}>

            <LayoutDashboard size={20} className="group-hover:text-white transition-colors shrink-0" />
            {!isCollapsed && <span className="truncate">Overview</span>}
          </div></Link>

          {/* My Badges */}
          <Link href="/user/badges"><div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3.5 rounded-xl text-slate-400 hover:bg-white/5 transition-all text-sm font-medium cursor-pointer group`}>

            <Medal size={20} className="group-hover:text-white transition-colors shrink-0" />
            {!isCollapsed && <span className="truncate">My Badges</span>}
          </div></Link>

          {/* Skill Hub */}
          <Link href="/user/skill-hub"><div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3.5 rounded-xl bg-white/5 text-white border border-white/10 text-sm font-bold relative overflow-hidden group cursor-pointer transition-all`}>
            {!isCollapsed && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-[#ff4f40] rounded-r-full shadow-[2px_0_10px_rgba(255,79,64,0.5)]"></div>
            )}
            <FolderOpen size={20} className="text-[#ff4f40] shrink-0" />
            {!isCollapsed && <span className="truncate">Skill Hub & CV</span>}
          </div>
          </Link>

          {/* Export Resume */}
          <Link href="/user/ex"><div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3.5 rounded-xl text-slate-400 hover:bg-white/5 transition-all text-sm font-medium cursor-pointer group`}>
            <FileUp size={20} className="group-hover:text-white transition-colors shrink-0" />
            {!isCollapsed && <span className="truncate">Export Resume</span>}
          </div>
          </Link>
        </nav>

        {/* Sidebar Footer: โปรไฟล์มุมซ้ายล่าง (เหลือแค่ Avatar เมื่อหดเมนู) */}
        <div className="mt-auto px-4 flex flex-col gap-4">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3.5 rounded-xl text-slate-500 hover:text-white transition-all text-sm font-medium cursor-pointer group`}>
            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500 shrink-0" />
            {!isCollapsed && <span className="truncate">Setting</span>}
          </div>

          <div className="h-px bg-white/5 mx-2"></div>

          {/* Profile Section */}
          <div className={`px-2 pb-2 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} group cursor-pointer`}>
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full border-2 border-white/5 group-hover:border-[#ff4f40] transition-all overflow-hidden bg-slate-800 shadow-xl flex items-center justify-center">
                {userAvatar
                  ? <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  : <span className="text-sm font-bold text-slate-300">{userName ? getInitials(userName) : 'U'}</span>
                }
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]"></span>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1 animate-in slide-in-from-left-2 duration-300">
                <p className="text-sm font-bold text-white truncate">{userName || 'Student'}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Student View</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
