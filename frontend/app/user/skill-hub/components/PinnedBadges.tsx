import React from 'react';
import { Medal, ChevronRight, PinOff, ShieldCheck, ExternalLink } from 'lucide-react';
import { DEFAULT_AVATAR } from '../../../../services/auth.service';

interface PinnedBadgesProps {
  badges: any[];
  isBadgesLoading: boolean;
  pinnedBadgeIds: string[];
  togglePin: (id: string) => void;
  onOpenBadgeModal: () => void;
}

export const PinnedBadges: React.FC<PinnedBadgesProps> = ({
  badges,
  isBadgesLoading,
  pinnedBadgeIds,
  togglePin,
  onOpenBadgeModal
}) => {
  const displayBadges = badges.filter((b: any) => pinnedBadgeIds.includes(b.id));

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Medal className="text-[#ff4f40]" size={24} />
          <h3 className="text-2xl font-bold tracking-tight text-white">My Badges</h3>
        </div>
        <button
          onClick={onOpenBadgeModal}
          className="cursor-pointer text-xs font-black text-[#ff4f40] hover:underline uppercase tracking-widest flex items-center gap-1 group transition-all"
        >
          VIEW ALL{' '}
          <ChevronRight
            size={14}
            className="cursor-pointer group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {isBadgesLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#0f0f11] border border-white/5 rounded-[2.2rem] min-h-[340px] animate-pulse"></div>
          ))
        ) : displayBadges.length > 0 ? (
          displayBadges.map((badge: any) => (
            <div
              key={badge.id}
              className="bg-[#0f0f11] border border-white/5 shadow-2xl rounded-[2.2rem] p-8 flex flex-col min-h-[340px] group transition-all hover:border-[#ff4f40]/40 relative animate-in zoom-in-95 duration-500"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(badge.id);
                }}
                className="absolute top-6 right-6 p-2 rounded-xl bg-[#ff4f40] text-white hover:bg-rose-600 transition-all z-10 shadow-lg cursor-pointer"
              >
                <PinOff size={16} />
              </button>
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                <img src={badge.icon} className="w-10 h-10 object-contain" alt="badge icon" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="text-xl font-bold text-white mb-6 group-hover:text-[#ff4f40] transition-colors leading-tight">
                  {badge.badge_name || badge.title}
                </h4>
                <span className="inline-block px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/10 bg-white/5 text-slate-400">
                  {badge.category}
                </span>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={badge.verifier_avatar || DEFAULT_AVATAR}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                    }}
                    className="w-8 h-8 rounded-full border border-white/10 object-cover"
                    alt="Prof"
                  />
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1 text-emerald-500 text-[9px] font-extrabold uppercase tracking-tighter leading-none">
                      <ShieldCheck size={10} /> Verified
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {badge.verifier_name || badge.prof || 'Professor'}
                    </p>
                  </div>
                </div>
                <ExternalLink size={14} className="text-slate-600 group-hover:text-white transition-colors cursor-pointer" />
              </div>
            </div>
          ))
        ) : (
          <div
            onClick={onOpenBadgeModal}
            className="col-span-full bg-[#050505] border-2 border-dashed border-white/5 rounded-[2.2rem] p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-white/20 transition-all shadow-inner min-h-[200px]"
          >
            <PinOff size={32} className="text-slate-600 mb-4" />
            <h4 className="font-bold text-slate-400 uppercase tracking-widest text-xs">No Badges Pinned (Max 4)</h4>
            <p className="text-[10px] text-slate-600 mt-2">Select badges to showcase on your profile</p>
          </div>
        )}
      </div>
    </section>
  );
};
