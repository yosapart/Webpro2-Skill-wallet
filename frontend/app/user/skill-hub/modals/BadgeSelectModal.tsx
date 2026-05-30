import React from 'react';
import { X, Pin, Plus, Check } from 'lucide-react';
import { DEFAULT_AVATAR } from '../../../../services/auth.service';

interface BadgeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  pinnedBadgeIds: string[];
  togglePin: (id: string) => void;
  badges: any[];
}

export const BadgeSelectModal: React.FC<BadgeSelectModalProps> = ({
  isOpen,
  onClose,
  pinnedBadgeIds,
  togglePin,
  badges
}) => {
  if (!isOpen) return null;

  const validPinnedCount = badges.filter((b: any) => b.status === 'approved' && pinnedBadgeIds.includes(b.id)).length;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300 text-left">
        <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-[#0f0f11]">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Select Featured Badges</h2>
            <p className="text-sm text-slate-500 mt-1">
              Pin up to <span className="text-white font-bold">4 badges</span>
            </p>
          </div>
          <button onClick={onClose} className="cursor-pointer p-3 hover:bg-white/5 rounded-full text-slate-400">
            <X size={28} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges
            .filter((badge: any) => badge.status === 'approved')
            .map((badge: any) => {
              const isPinned = pinnedBadgeIds.includes(badge.id);
              const isFull = validPinnedCount >= 4 && !isPinned;
              return (
                <div
                  key={badge.id}
                  onClick={() => !isFull && togglePin(badge.id)}
                  className={`p-6 md:p-8 rounded-[2.5rem] border transition-all relative group cursor-pointer ${isPinned
                    ? 'bg-[#ff4f40]/5 border-[#ff4f40]/40 shadow-2xl'
                    : isFull
                      ? 'opacity-30 grayscale cursor-not-allowed border-white/5'
                      : 'bg-[#121214] border-white/5 hover:border-white/10'
                    }`}
                >
                  <div className="flex justify-between items-start mb-6 md:mb-8">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden ${isPinned ? 'bg-[#ff4f40]/20' : 'bg-white/5'
                        }`}
                    >
                      <img src={badge.icon} className="w-10 h-10 object-contain" alt="badge icon" />
                    </div>
                    <div
                      className={`p-2 rounded-xl transition-all ${isPinned ? 'bg-[#ff4f40] text-white scale-110 shadow-lg' : 'bg-white/5 text-slate-600'
                        }`}
                    >
                      {isPinned ? <Pin size={16} fill="currentColor" /> : <Plus size={16} />}
                    </div>
                  </div>
                  <h4 className="font-bold text-lg md:text-xl mb-2 text-white">{badge.badge_name || badge.title}</h4>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-6 ${isPinned ? 'text-[#ff4f40]' : 'text-slate-500'}`}>
                    {badge.category}
                  </p>
                  <div className="pt-5 border-t border-white/5 flex items-center gap-3">
                    <img
                      src={badge.verifier_avatar || DEFAULT_AVATAR}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                      }}
                      className="w-7 h-7 rounded-full object-cover"
                      alt="Verifier avatar"
                    />
                    <span className="text-[10px] text-slate-500 font-medium">{badge.verifier_name || badge.prof || 'Professor'}</span>
                  </div>
                  {isPinned && (
                    <div className="absolute -bottom-1 -right-1 p-4 bg-[#ff4f40] rounded-tl-3xl shadow-xl">
                      <Check size={14} strokeWidth={4} className="text-white" />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
        <div className="p-6 md:p-8 border-t border-white/5 bg-[#0f0f11] flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">
            <span className="text-white font-bold">{validPinnedCount}/4</span> Selected
          </span>
          <button
            onClick={onClose}
            className="bg-[#ff4f40] text-white font-bold px-8 md:px-12 py-4 rounded-3xl hover: transition-all text-[14px] shadow-xl transform active:scale-95 cursor-pointer"
          >
            Save Selection
          </button>
        </div>
      </div>
    </div>
  );
};
