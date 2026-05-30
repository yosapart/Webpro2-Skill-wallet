'use client';
import React, { useState } from 'react'; // 1. เพิ่ม useState
import {
  ShieldCheck,
  ChevronRight,
  Quote,
  MessageSquare,
  RotateCcw,
  X // 2. เพิ่มไอคอน X สำหรับปุ่มปิด
} from 'lucide-react';
import { BadgeRequest } from '../../../services/overview.service';
import { DEFAULT_AVATAR } from '../../../services/auth.service';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const categoryColor: Record<string, string> = {
  'SOFTWARE / WEB': 'text-blue-400 bg-blue-400/5 border-blue-400/10',
  'DATA / AI': 'text-rose-400 bg-rose-400/5 border-rose-400/10',
  'GAME / GRAPHICS': 'text-emerald-400 bg-emerald-400/5 border-emerald-400/10',
  'CYBER / NETWORK': 'text-yellow-400 bg-yellow-400/5 border-yellow-400/10',
};

export const FeedbackPage = ({
  requests,
  loading,
}: {
  requests: BadgeRequest[];
  loading: boolean;
}) => {
  // 3. สร้าง State ควบคุมการเปิด/ปิด ป็อปอัป
  const [isModalOpen, setIsModalOpen] = useState(false);

  // แสดงเฉพาะ 3 รายการล่าสุดสำหรับหน้าหลัก
  const display = requests.slice(0, 3);

  // ฟังก์ชันช่วยเรนเดอร์การ์ด (เพื่อให้หน้าหลักและป็อปอัปใช้ดีไซน์เดียวกัน)
  const renderFeedbackCard = (req: BadgeRequest) => {
    const catKey = (req.category || '').toUpperCase().trim();
    const catColor = categoryColor[catKey] || 'text-slate-400 bg-slate-400/5 border-slate-400/10';
    const isApproved = req.status === 'approved';

    const commentText = req.comment || (
      isApproved
        ? "No additional feedback provided. Verification completed successfully."
        : "No additional feedback provided. Please review the criteria requirements and resubmit."
    );

    return (
      <div key={req.id} className="flex flex-col gap-4 items-start w-full">
        <div className="flex items-center gap-3 flex-wrap">
          {isApproved ? (
            <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-extrabold bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 uppercase tracking-widest shrink-0">
              <ShieldCheck size={14} /> Approved
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-500 text-[10px] font-extrabold bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 uppercase tracking-widest shrink-0">
              <RotateCcw size={14} /> Revisions
            </div>
          )}
          <span className="text-[11px] text-slate-600 font-bold tracking-widest shrink-0">
            {formatDate(req.verified_at || req.updated_at)}
          </span>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase border shrink-0 ${catColor}`}>
            {req.category}
          </span>
        </div>

        <div className="text-left w-full">
          <h4 className="text-xl font-bold">{isApproved ? 'Credential Issued' : 'Credential Under Revision'}: {req.badge_name}</h4>
          {isApproved ? (
            <p className="text-sm text-slate-400 mt-1 leading-relaxed max-w-2xl">
              Prof. {req.verifier_name || 'Professor'} verified your submission and issued the credential to your wallet.
            </p>
          ) : (
            <p className="text-sm text-slate-400 mt-1 leading-relaxed max-w-2xl">
              Prof. {req.verifier_name || 'Professor'} requested revisions. Please review the comments below and resubmit your evidence.
            </p>
          )}
        </div>

        <div className="bg-[#050505] rounded-[2rem] p-6 md:p-8 border border-white/5 relative group w-full text-left overflow-hidden">
          <div className="absolute top-6 right-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            <Quote size={80} />
          </div>
          <div className="flex gap-4 md:gap-6 items-start relative z-10">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white/10 shrink-0 shadow-2xl bg-slate-800 flex items-center justify-center">
              {req.verifier_avatar ? (
                <img src={req.verifier_avatar} alt={req.verifier_name} className="w-full h-full object-cover" />
              ) : (
                <img
                  src={DEFAULT_AVATAR}
                  alt="Default Professor"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <p className="text-sm md:text-base text-slate-300 italic font-light leading-relaxed max-w-5xl">
              &ldquo;{commentText}&rdquo;
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0f0f11] border border-white/5 rounded-[2.5rem] p-6 md:p-10 flex flex-col space-y-8 shadow-2xl shadow-rose-500/5 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h3 className="text-xl font-bold">Professor Feedback &amp; Activity</h3>
          <p className="text-xs text-slate-500 mt-1">Track your evaluation history and comments from faculty</p>
        </div>
        {/* 4. เพิ่ม onClick ให้ปุ่ม View All */}
        {requests.length > 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-[#ff4f40] hover:underline uppercase tracking-widest flex items-center gap-1 group cursor-pointer transition-all shrink-0"
          >
            View All
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {loading ? (
        // Loading skeleton
        <div className="space-y-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-6 w-24 bg-white/5 rounded-full" />
                <div className="h-4 w-20 bg-white/5 rounded" />
              </div>
              <div className="h-6 w-64 bg-white/5 rounded" />
              <div className="bg-[#050505] rounded-[2rem] p-8 border border-white/5">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-full bg-white/5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="h-4 bg-white/5 rounded w-4/5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : display.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            <MessageSquare size={28} className="text-slate-600" />
          </div>
          <p className="text-slate-500 text-sm font-medium">No feedback yet.</p>
          <p className="text-slate-600 text-xs max-w-sm">
            Once a professor reviews and approves your badge request, their feedback will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {display.map(renderFeedbackCard)}
        </div>
      )}


      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">

          <div
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* กล่องเนื้อหา Modal */}
          <div className="relative w-full max-w-4xl bg-[#0a0a0c] border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] md:max-h-[80vh] overflow-hidden">

            {/* Header ของ Modal */}
            <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/5 shrink-0 bg-[#0f0f11]">
              <div>
                <h3 className="text-lg md:text-xl font-bold flex items-center gap-3 text-white">
                  All Professor Feedback
                </h3>
                <p className="text-xs text-slate-500 mt-1">Total {requests.length} records</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>


            <div className="overflow-y-auto custom-scrollbar p-5 md:p-8 space-y-10">
              {requests.map(renderFeedbackCard)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};