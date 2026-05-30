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
  Plus,
  ExternalLink,
  X,
  FileIcon,
  Download,
  CheckCircle2,
  Menu,
  Bell,
  User,
  MoreVertical,
  MessageSquare,
  Upload,
  Link as LinkIcon,
  Badge
} from 'lucide-react';


import { RequestModal } from './request';
import { BadgePage } from './badge';

const CATEGORIES = [
  { id: 'all', label: 'All', color: 'bg-white text-black' },
  { id: 'software', label: 'SOFTWARE / WEB', color: 'bg-blue-500/10 border-blue-500/20 text-blue-500' },
  { id: 'data', label: 'DATA / AI', color: 'bg-rose-500/10 border-rose-500/20 text-rose-500' },
  { id: 'cyber', label: 'CYBER / NETWORK', color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' },
  { id: 'game', label: 'GAME / GRAPHICS', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' },
];

export default function MyBadgesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showRequestModal, setShowRequestModal] = useState(false);
  // Filter Logic



  const containerClass = "max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10";

  return (
    <div className="flex h-full overflow-hidden bg-[#050505] text-white font-lineseed selection:bg-[#ff4f40]/30 selection:text-white w-full">
      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto flex flex-col transition-all duration-300 relative pt-14 md:pt-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ff4f40]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        <header className="h-[70px] md:h-[90px] border-b border-white/5 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-40 flex items-center shrink-0">
          <div className={containerClass}>
            <div className="flex items-center justify-between">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">My Badges</h1>
            </div>
          </div>
        </header>

        <div className={`${containerClass} py-6 sm:py-8 md:py-10 space-y-6 sm:space-y-8 md:space-y-10`}>
          <div className="text-left space-y-1.5 sm:space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Your Verified Credentials</h2>
            <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-500 uppercase tracking-[0.2em] font-bold">
              SHOWCASE YOUR TECHNICAL CAPABILITIES TO FUTURE EMPLOYERS.
            </p>
          </div>


          <BadgePage />

        </div>

        <footer className="mt-auto p-10 text-center opacity-30">

          <p className="text-[10px] uppercase font-bold tracking-[0.4em]">Ip&s IT Portfolio & Skill © 2026</p>
        </footer>
      </main>
    </div>
  );
}