"use client";

import React, { useState } from 'react';
import {
  Clock,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  X,
  Loader2 // นำเข้าไอคอน Loading เพิ่มเติม
} from 'lucide-react';
import { BadgeRequest } from '../../../services/overview.service';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffD = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD < 7) return `${diffD}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const categoryColorClass: Record<string, string> = {
  'SOFTWARE / WEB': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  'DATA / AI': 'text-rose-500 bg-rose-500/10 border-rose-500/20',
  'CYBER / NETWORK': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  'GAME / GRAPHICS': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
};

export const Achivement = ({
  requests,
  loading,
  onViewAll // แนะนำให้ Parent Component ส่งฟังก์ชันที่ทำการ Fetch และ Return ข้อมูลกลับมา
}: {
  requests: BadgeRequest[];
  loading: boolean;
  // 1. ปรับ Type ให้รองรับการ Return Promise ที่มีข้อมูล BadgeRequest[]
  onViewAll?: () => Promise<BadgeRequest[]>;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. เพิ่ม State สำหรับเก็บข้อมูลทั้งหมดและสถานะการโหลดของ Modal
  const [allRequests, setAllRequests] = useState<BadgeRequest[]>([]);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const displayRequests = requests.slice(0, 3);

  const renderAchievementCard = (req: BadgeRequest) => {
    const catKey = (req.category || '').toUpperCase().trim();
    const catColor = categoryColorClass[catKey] || 'text-slate-400 bg-slate-400/5 border-slate-400/10';

    return (
      <div key={req.id} className="bg-[#050505] border border-white/5 rounded-2xl p-5 md:p-6 flex flex-col gap-4 hover:border-emerald-500/30 transition-all cursor-pointer group">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase border ${catColor}`}>
            {req.category || 'General'}
          </span>
          {req.status === 'pending' && (
            <div className="flex items-center gap-1.5 text-yellow-500 text-[10px] font-bold bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
              <Clock size={12} /> Pending
            </div>
          )}
          {(req.status === 'revision' || req.status === 'revisions') && (
            <div className="flex items-center gap-1.5 text-rose-500 text-[10px] font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              <RotateCcw size={12} /> Revisions
            </div>
          )}
          {req.status === 'approved' && (
            <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <ShieldCheck size={12} /> Approved
            </div>
          )}
          {req.status === 'rejected' && (
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold bg-slate-500/10 px-3 py-1 rounded-full border border-slate-500/20">
              <RotateCcw size={12} /> Rejected
            </div>
          )}
        </div>
        <h4 className="font-bold text-base md:text-lg text-left">{req.badge_name}</h4>
        <div className="flex justify-between items-center text-[10px] md:text-[11px] text-slate-500">
          <p>{req.verifier_id ? 'Verified by Prof.' : 'Awaiting Verification'}</p>
          <span className="uppercase font-bold text-slate-600 shrink-0 ml-2">
            {formatDate(req.verified_at || req.created_at)}
          </span>
        </div>
      </div>
    );
  };

  // 3. เปลี่ยนให้ฟังก์ชันนี้ทำงานแบบ Async
  const handleViewAllClick = async () => {
    setIsModalOpen(true);

    // ถ้าเคยโหลดมาแล้ว ไม่ต้องโหลดใหม่ (ลดการยิง API ซ้ำซ้อน)
    if (allRequests.length === 0) {
      if (onViewAll) {
        setIsModalLoading(true);
        try {
          const fullData = await onViewAll();
          if (fullData) {
            setAllRequests(fullData);
          }
        } catch (error) {
          console.error("Failed to fetch all achievements", error);
        } finally {
          setIsModalLoading(false);
        }
      } else {
        // Fallback ในกรณีที่ไม่ได้ส่ง Prop onViewAll มาให้ใช้ข้อมูลเดิม
        setAllRequests(requests);
      }
    }
  };

  return (
    <div className="xl:col-span-5 bg-[#0f0f11] border border-white/5 rounded-[2.5rem] p-6 md:p-10 flex flex-col min-h-[480px] shadow-2xl relative">
      <div className="flex items-center justify-between mb-8">
        <div className="text-left">
          <h3 className="text-xl font-bold">Recent Achievements</h3>
          <p className="text-xs text-slate-500 mt-1">Your latest verified badges</p>
        </div>
        {requests.length > 0 && (
          <button
            onClick={handleViewAllClick}
            className="text-xs font-bold text-[#ff4f40] hover:underline uppercase tracking-widest flex items-center gap-1 group cursor-pointer transition-all"
          >
            View All <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      <div className="space-y-4 flex-1">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-[#050505] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="h-5 w-24 bg-white/5 rounded-md" />
                <div className="h-5 w-20 bg-white/5 rounded-full" />
              </div>
              <div className="h-5 w-48 bg-white/5 rounded-md" />
              <div className="flex justify-between">
                <div className="h-3 w-32 bg-white/5 rounded" />
                <div className="h-3 w-20 bg-white/5 rounded" />
              </div>
            </div>
          ))
        ) : displayRequests.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12 gap-3">
            <ShieldCheck size={28} className="text-slate-700" />
            <p className="text-slate-500 text-sm">No badge requests yet.</p>
          </div>
        ) : (
          displayRequests.map(renderAchievementCard)
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="relative w-full max-w-3xl bg-[#0a0a0c] border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/5 shrink-0 bg-[#0f0f11]">
              <div className="text-left">
                <h3 className="text-lg md:text-xl font-bold flex items-center gap-3 text-white">
                  All Achievements
                </h3>
                {/* 4. แสดงจำนวนอ้างอิงจากข้อมูลที่โหลดมาครบแล้ว */}
                {!isModalLoading && (
                  <p className="text-xs text-slate-500 mt-1">Total {allRequests.length} records</p>
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar p-4 md:p-8 space-y-4">
              {/* 5. แสดงผล Loading ในระหว่างที่รอข้อมูลจากการ Fetch */}
              {isModalLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-3">
                  <Loader2 className="animate-spin text-[#ff4f40]" size={32} />
                  <p className="text-sm animate-pulse">Fetching all records...</p>
                </div>
              ) : allRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500 gap-3">
                  <p className="text-sm">No records found.</p>
                </div>
              ) : (
                allRequests.map(renderAchievementCard)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};