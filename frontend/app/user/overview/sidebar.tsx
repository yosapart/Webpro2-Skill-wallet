"use client";

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Medal,
  FolderOpen,
  FileUp,
  Settings,
  AlignLeft,
  LogOut,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SkillHubService, UserProfile } from '../../../services/skill-hub.service';
import { AuthService, DEFAULT_AVATAR } from '../../../services/auth.service';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { href: '/user/overview', icon: LayoutDashboard, label: 'Overview' },
  { href: '/user/badges', icon: Medal, label: 'My Badges' },
  { href: '/user/skill-hub', icon: FolderOpen, label: 'Skill Hub & CV' },
  { href: '/user/ex', icon: FileUp, label: 'Export Resume' },
];

export const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const pathname = usePathname();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [showLogout, setShowLogout] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());

  React.useEffect(() => {
    const fetchProfile = async () => {
      const data = await SkillHubService.getMyProfile();
      if (data) {
        setProfile(data);
        setTimestamp(Date.now());
      }
    };
    fetchProfile();

    window.addEventListener('profileUpdated', fetchProfile);
    return () => window.removeEventListener('profileUpdated', fetchProfile);
  }, []);

  const userName = profile?.profile?.name || 'Student';
  const userAvatar = profile?.profile?.avatar_url
    ? `${profile.profile.avatar_url}${profile.profile.avatar_url.includes('?') ? '&' : '?'}t=${timestamp}`
    : DEFAULT_AVATAR;

  const handleSignOut = async () => {
    try {
      await AuthService.logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error in sidebar:", error);
    }
  };

  return (
    <>
      {/* ── MOBILE TOP BAR (< md) ── */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 h-14 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 -ml-1 text-slate-400 hover:text-white transition-colors outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <span className="text-base font-bold tracking-tighter text-[#ffffff]">
          <span className="text-[#ff4f40]">Ip</span>&s
        </span>
        <div className="relative w-8 h-8">
          <img
            src={userAvatar}
            className="w-8 h-8 rounded-full border border-white/10 object-cover"
            alt="Avatar"
          />
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[#0a0a0a]" />
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {drawerOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="md:hidden fixed top-0 left-0 bottom-0 z-70 w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col py-8 animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="px-6 mb-12 flex items-center justify-between">
              <span className="text-xl font-bold tracking-tighter">
                <span className="text-[#ff4f40]">Ip</span>&s
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex flex-col w-full px-4 gap-2">
              {navItems.map(({ href, icon: Icon, label }) => {
                const isActive = pathname === href;
                return (
                  <Link key={href} href={href} onClick={() => setDrawerOpen(false)} className="outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0">
                    <div className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm cursor-pointer transition-all relative overflow-hidden outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${isActive
                      ? 'bg-white/5 text-white border border-transparent font-bold text-sm'
                      : 'border border-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-[#ff4f40] rounded-r-full shadow-[2px_0_10px_rgba(255,79,64,0.5)]" />
                      )}
                      <Icon size={20} className={isActive ? 'text-[#ff4f40] shrink-0' : 'shrink-0'} />
                      <span className="truncate">{label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="mt-auto px-4 flex flex-col gap-4">
              <div className="relative">
                <button
                  onClick={() => setShowLogout(!showLogout)}
                  className="flex items-center w-full gap-4 px-4 py-3.5 rounded-xl text-slate-500 hover:text-white transition-all text-sm font-medium cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                >
                  <Settings size={20} />
                  <span>Setting</span>
                </button>
                {showLogout && (
                  <div className="absolute left-0 bottom-full mb-2 w-full bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-80 animate-in slide-in-from-bottom-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-colors cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
              <div className="h-px bg-white/5 mx-2" />
              <div className="px-2 pb-2 flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full border-2 border-white/10 overflow-hidden bg-slate-800">
                    <img
                      src={userAvatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate">{userName}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Student View</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── DESKTOP SIDEBAR (md+) ── */}
      <aside className={`hidden md:flex ${isCollapsed ? 'w-20' : 'w-65'} h-full bg-[#0a0a0a] border-r border-white/5 flex-col py-8 shrink-0 z-50 transition-all duration-300 ease-in-out`}>
        {/* Header */}
        <div className={`px-6 mb-12 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} w-full`}>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <AlignLeft size={24} />
          </button>
          {!isCollapsed && (
            <span className="text-[#ffffff] text-xl font-bold tracking-tighter select-none animate-in fade-in duration-300">
              <span className="text-[#ff4f40]">Ip</span>&s
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col w-full px-4 gap-2">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href} className="outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0">
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3.5 rounded-xl text-sm cursor-pointer transition-all relative overflow-hidden group outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${isActive
                  ? 'bg-white/5 text-white border border-transparent font-bold'
                  : 'border border-transparent text-slate-400 hover:bg-white/5 font-medium'
                  }`}>
                  {isActive && !isCollapsed && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-[#ff4f40] rounded-r-full shadow-[2px_0_10px_rgba(255,79,64,0.5)]" />
                  )}
                  <span className={`shrink-0 ${isActive ? 'text-[#ff4f40]' : 'group-hover:text-white transition-colors'}`}>
                    <Icon size={20} />
                  </span>
                  {!isCollapsed && <span className="truncate">{label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto px-4 flex flex-col gap-4">
          <div className="relative">
            <button
              onClick={() => setShowLogout(!showLogout)}
              className={`flex items-center w-full ${isCollapsed ? 'justify-center' : 'gap-4'} px-4 py-3.5 rounded-xl text-slate-500 hover:text-white transition-all text-sm font-medium cursor-pointer group outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0`}
            >
              <Settings size={20} className="group-hover:rotate-90 transition-transform duration-500 shrink-0" />
              {!isCollapsed && <span className="truncate">Setting</span>}
            </button>
            {showLogout && (
              <div className={`absolute ${isCollapsed ? 'left-16' : 'left-0'} bottom-full mb-2 w-full min-w-30 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 duration-200 z-60`}>
                <button
                  onClick={handleSignOut}
                  className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-500/10 text-sm font-bold transition-colors outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          <div className="h-px bg-white/5 mx-2" />

          <div className={`px-2 pb-2 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} group cursor-pointer`}>
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full border-2 border-white/5 group-hover:border-[#ff4f40] transition-all overflow-hidden bg-slate-800 shadow-xl">
                <img
                  src={userAvatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1 animate-in slide-in-from-left-2 duration-300">
                <p className="text-sm font-bold text-white truncate">{userName}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Student View</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
