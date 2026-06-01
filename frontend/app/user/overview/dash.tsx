"use client";

import React, { useState, useEffect } from 'react';
import { AlignLeft } from 'lucide-react';
import { Achivement } from './achivement';
import { FeedbackPage } from './feeedback';
import { MatrixPage } from './matrix';
import { auth } from '../../../config/firebase';
import { OverviewService, BadgeRequest, OverviewStats } from '../../../services/overview.service';
import { SkillHubService } from '../../../services/skill-hub.service';

export const OverviewPage = ({ onLogout, onViewAll }: { onLogout?: () => void; onViewAll?: () => void }) => {
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [requests, setRequests] = useState<BadgeRequest[]>([]);
  const [stats, setStats] = useState<OverviewStats>({
    totalVerified: 0,
    totalPending: 0,
    totalRevision: 0,
    recentRequests: [],
    approvedRequests: [],
  });
  const [loading, setLoading] = useState(true);

  const containerClass = "max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10";

  // ดึงข้อมูล user และ badge requests
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // ตั้งค่าเบื้องต้นจาก Firebase
        setUserName(user.displayName || user.email?.split('@')[0] || 'Student');
        setUserAvatar(user.photoURL || '');

        // ดึงข้อมูลจริงจาก API
        setLoading(true);
        try {
          const [data, profile] = await Promise.all([
            OverviewService.getMyRequests(),
            SkillHubService.getMyProfile(),
          ]);
          setRequests(data);
          setStats(OverviewService.computeStats(data));

          if (profile?.profile?.name) {
            setUserName(profile.profile.name); // ลบ || prev ออกเพื่อให้ใช้ชื่อจาก DB เสมอ
          }
          if (profile?.profile?.avatar_url) {
            setUserAvatar(profile.profile.avatar_url);
          }
        } catch (err) {
          console.error("Error loading dashboard data:", err);
        } finally {
          setLoading(false);
        }
      } else {
        // ถ้าไม่มี user ให้เตรียม redirect หรือเคลียร์ data
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <div className="flex-1 bg-[#050505] text-white font-lineseed selection:bg-[#ff4f40]/30 selection:text-white w-full pt-14 md:pt-0">
      {/* Header Title */}
      <header className="h-[70px] md:h-[90px] border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl z-40 flex items-center">
        <div className={containerClass}>
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">Overview</h1>
          </div>
        </div>
      </header>

      {/* Welcome Text */}
      <div className={`${containerClass} py-8 sm:py-10 space-y-8 md:space-y-10`}>
        <div className="text-left space-y-2">
          <h2 className="text-4xl font-bold tracking-tight">Welcome back, {userName || '...'}!</h2>
          <p className="text-sm text-slate-500 uppercase tracking-[0.12em] font-bold">
            YOU&apos;VE SUCCESSFULLY UNLOCKED <span className="text-blue-500 font-extrabold underline decoration-blue-500/30 underline-offset-4">{stats.totalVerified} VERIFIED CREDENTIALS</span>, READY TO STAND OUT IN THE TECH INDUSTRY.
          </p>
        </div>

        {/* Top Row: Analytics & Recent List */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <MatrixPage requests={requests} />
          <Achivement requests={requests} loading={loading} />
        </div>
        <FeedbackPage requests={stats.approvedRequests} loading={loading} />
      </div>
      <footer className="mt-auto p-10 text-center opacity-30">
        <p className="text-[10px] uppercase font-bold tracking-[0.3em]">Ip&s IT Portfolio &amp; Skill © 2026</p>
      </footer>
    </div>
  );
};
