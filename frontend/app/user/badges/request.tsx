"use client";
import React from 'react';
import {
  Clock,
  ShieldCheck,
  X,
  MessageSquare,
  Loader2
} from 'lucide-react';
import { useBadgeRequest } from './hooks/useBadgeRequest';
import { FileUploadArea } from './components/FileUploadArea';
import { BadgeSelector } from './components/BadgeSelector';

export const RequestModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const {
    badges,
    approvedBadgeIds,
    pendingBadgeIds,
    submitting,
    evidence,
    setEvidence,
    uploadedFiles,
    badgeDropdownOpen,
    setBadgeDropdownOpen,
    selectedBadge,
    setSelectedBadge,
    currentUser,
    isDragging,
    activeCategory,
    setActiveCategory,
    fileError,
    fileInputRef,
    addFiles,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSubmit
  } = useBadgeRequest(isOpen, onClose);

  if (!isOpen) return null;

  const getCategoryTheme = (category: string) => {
    const cat = (category || '').toUpperCase().trim();
    if (cat === 'SOFTWARE / WEB') {
      return { label: 'SOFTWARE / WEB', color: 'text-blue-400 border-blue-400/20 bg-blue-400/5', bg: 'bg-blue-400/5' };
    }
    if (cat === 'DATA / AI') {
      return { label: 'DATA / AI', color: 'text-rose-400 border-rose-400/20 bg-rose-400/5', bg: 'bg-rose-400/5' };
    }
    if (cat === 'GAME / GRAPHICS') {
      return { label: 'GAME / GRAPHICS', color: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5', bg: 'bg-emerald-400/5' };
    }
    if (cat === 'CYBER / NETWORK') {
      return { label: 'CYBER / NETWORK', color: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5', bg: 'bg-yellow-400/5' };
    }
    return { label: 'GENERAL', color: 'text-slate-400 border-slate-400/20 bg-slate-400/5', bg: 'bg-slate-400/5' };
  };

  const currentCat = getCategoryTheme(activeCategory);
  const filteredBadges = badges.filter(b =>
    b.category === activeCategory &&
    !approvedBadgeIds.includes(b.id?.toString()) &&
    !pendingBadgeIds.includes(b.id?.toString())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      <div className="cursor-pointer absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>

      <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">

        {/* ── HEADER ── */}
        <div className="p-6 sm:p-10 pb-6 border-b border-white/5 bg-[#0f0f11] shrink-0">
          <div className="flex flex-col space-y-6">

            {/* Row 1: Category Tabs and Close Button */}
            <div className="flex justify-between items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {['SOFTWARE / WEB', 'DATA / AI', 'CYBER / NETWORK', 'GAME / GRAPHICS'].map((cat) => {
                  const isActive = activeCategory === cat;
                  const theme = getCategoryTheme(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setSelectedBadge(null); // Reset selection
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${isActive
                        ? `${theme.color} border-current bg-white/5`
                        : 'text-slate-500 border-white/5 bg-[#141416]/50 hover:text-slate-300 hover:bg-white/5'
                        }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={onClose}
                className="cursor-pointer p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors shrink-0"
              >
                <X size={22} />
              </button>
            </div>

            {/* Row 2: Badge Title Dropdown */}
            <BadgeSelector
              badgeDropdownOpen={badgeDropdownOpen}
              setBadgeDropdownOpen={setBadgeDropdownOpen}
              selectedBadge={selectedBadge}
              setSelectedBadge={setSelectedBadge}
              filteredBadges={filteredBadges}
            />

            {/* Row 3: Student Info Pill and Track Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-[#1a1a1a] border border-white/5 rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2 sm:gap-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-600 flex items-center justify-center text-[7px] sm:text-[8px] font-bold text-white">
                  {currentUser?.displayName ? currentUser.displayName.substring(0, 2).toUpperCase() : 'YR'}
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-300">
                  {currentUser?.displayName || 'Student'} <span className="text-slate-500 ml-1 font-normal">ID: {currentUser?.uid ? currentUser.uid.substring(0, 6).toUpperCase() : '000001'}</span>
                </span>
              </div>
              <div className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${currentCat.bg} ${currentCat.color}`}>
                {currentCat.label}
              </div>
            </div>

          </div>
        </div>

        {/* ── BODY (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-10 py-6 sm:py-10 space-y-8 sm:space-y-10 custom-scrollbar bg-[#0a0a0a]">

          {/* Evidence */}
          <section className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-3 text-white">
              <MessageSquare size={18} className="text-[#ff4f40]" /> Your Evidence & Note
            </h3>
            <div className="bg-[#0f0f11] border border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4 sm:space-y-6">
              <textarea
                placeholder="เขียนคำบรรยายหรือแนบลิงก์โครงการที่นี่เพื่อให้อาจารย์ตรวจสอบ..."
                className="w-full bg-black border border-white/15 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-sm min-h-25 sm:min-h-30 outline-none focus:border-[#ff4f40]/50 transition-all placeholder:text-slate-700 font-medium leading-relaxed text-white resize-none"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
              />

              {/* ── UPLOAD AREA ── */}
              <FileUploadArea
                isDragging={isDragging}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleDrop={handleDrop}
                fileInputRef={fileInputRef}
                addFiles={addFiles}
                uploadedFiles={uploadedFiles}
                removeFile={removeFile}
              />
              {fileError && (
                <p className="text-red-500 text-sm font-medium mt-1 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{fileError}</p>
              )}
            </div>
          </section>

          {/* Criteria info */}
          <section className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-3 text-white">
              <ShieldCheck size={18} className="text-[#ff4f40]" /> Expected Evaluation Criteria
            </h3>
            <div className="border border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0f0f11] divide-y divide-white/5">
              {selectedBadge?.criteria_template && selectedBadge.criteria_template.length > 0 ? (
                selectedBadge.criteria_template.map((criteria: any, idx: number) => (
                  <div key={idx} className="p-5 sm:p-8 flex gap-4 sm:gap-5 items-start text-left">
                    <div className="mt-1 shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-slate-700 flex items-center justify-center">
                      <Clock size={12} className="text-slate-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-lg">{criteria.name}</h4>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed font-medium">
                        {criteria.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-5 sm:p-8 flex gap-4 sm:gap-5 items-start text-left">
                  <div className="mt-1 shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-slate-700 flex items-center justify-center">
                    <Clock size={12} className="text-slate-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm sm:text-lg">Standard Verification Process</h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                      Your professor will evaluate your submission based on technical accuracy, code quality, and alignment with the track objectives.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ── FOOTER ── */}
        <div className="px-5 sm:px-10 py-4 sm:py-8 border-t border-white/5 bg-[#0f0f11] flex items-center justify-end gap-3 sm:gap-4 shrink-0">
          <button
            onClick={onClose}
            className="cursor-pointer px-5 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-slate-500 font-semibold text-[14px] sm:text-xs hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedBadge || submitting}
            className="cursor-pointer px-7 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-[#ff4f40] disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold text-[14px] sm:text-xs hover:bg-[#e53e30] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ff4f40]/20 active:scale-95"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending...
              </>
            ) : "Send Request"}
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
};