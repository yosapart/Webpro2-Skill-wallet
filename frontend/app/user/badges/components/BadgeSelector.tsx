import React from 'react';
import { ChevronDown } from 'lucide-react';

interface BadgeSelectorProps {
  badgeDropdownOpen: boolean;
  setBadgeDropdownOpen: (open: boolean) => void;
  selectedBadge: any;
  setSelectedBadge: (badge: any) => void;
  filteredBadges: any[];
}

export const BadgeSelector: React.FC<BadgeSelectorProps> = ({
  badgeDropdownOpen,
  setBadgeDropdownOpen,
  selectedBadge,
  setSelectedBadge,
  filteredBadges,
}) => {
  return (
    <div className="relative">
      <button
        onClick={() => setBadgeDropdownOpen(!badgeDropdownOpen)}
        className="w-full flex items-center justify-between gap-3 bg-transparent border-b-2 border-white/10 hover:border-[#ff4f40]/50 focus:border-[#ff4f40] outline-none py-2 text-left transition-colors group cursor-pointer"
      >
        <span className={`text-xl sm:text-3xl font-bold tracking-tight truncate ${selectedBadge ? 'text-white' : 'text-slate-700'}`}>
          {selectedBadge ? selectedBadge.name : 'Select Badge Title...'}
        </span>
        <ChevronDown
          size={24}
          className={`shrink-0 text-slate-600 group-hover:text-white transition-all duration-200 ${badgeDropdownOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown list */}
      {badgeDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#141416] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-150">
          {filteredBadges.length === 0 ? (
            <div className="p-5 text-sm text-slate-500">No badges available for this category.</div>
          ) : (
            filteredBadges.map((badge, i) => (
              <button
                key={i}
                onClick={() => { setSelectedBadge(badge); setBadgeDropdownOpen(false); }}
                className={`w-full text-left px-5 py-3.5 text-sm font-semibold transition-colors flex items-center justify-between group/item border-b border-white/5 cursor-pointer last:border-0 ${selectedBadge?.id === badge.id
                  ? 'text-[#ff4f40] bg-white/5'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span>{badge.name}</span>
                {selectedBadge?.id === badge.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff4f40]" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
