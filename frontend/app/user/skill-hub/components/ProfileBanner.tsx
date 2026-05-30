import React from 'react';
import { Edit3, MapPin, Mail, Phone } from 'lucide-react';
import { DEFAULT_AVATAR } from '../../../../services/auth.service';

interface ProfileBannerProps {
  profile: any;
  onEditProfile: () => void;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({ profile, onEditProfile }) => {
  return (
    <section>
      <div className="bg-[#0f0f11] border border-white/5 rounded-[2.5rem] overflow-hidden relative shadow-2xl group">
        <div className="h-32 md:h-48 bg-gradient-to-r from-[#1a1a1a] via-[#ff4f40]/10 to-[#1a1a1a]"></div>
        <div className="px-8 md:px-12 pb-10 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12 md:-mt-16 mb-8">
            <div className="w-24 h-24 md:w-40 md:h-40 rounded-3xl bg-[#0f0f11] border-4 border-[#050505] shadow-2xl overflow-hidden shrink-0">
              <img
                src={profile?.profile?.avatar_url || DEFAULT_AVATAR}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 space-y-2 md:pb-2 text-left min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white break-all">{profile?.profile?.name}</h2>
                <button onClick={onEditProfile} className="p-3 bg-white/5 hover:bg-[#ff4f40] hover:text-white rounded-2xl transition-all text-slate-400 group cursor-pointer">
                  <Edit3 size={18} />
                </button>
              </div>
              <p className={`font-bold text-sm md:text-base uppercase tracking-wider break-all ${profile?.profile?.headline ? 'text-[#ff4f40]' : 'text-slate-700 italic opacity-50'}`}>
                {profile?.profile?.headline || 'Not specified'}
              </p>
              <div className="flex flex-wrap gap-4 md:gap-6 pt-2 text-slate-500 text-xs sm:text-sm font-medium">
                <span className={`flex items-start gap-2 ${!profile?.profile?.location && 'opacity-40 italic'}`}>
                  <MapPin size={14} className="shrink-0 mt-0.5" /> 
                  <span className="break-all leading-tight">
                    {profile?.profile?.location ? (
                      profile.profile.location.length > 112 ? (
                        <>
                          {profile.profile.location.substring(0, 112)}<br />{profile.profile.location.substring(112)}
                        </>
                      ) : profile.profile.location
                    ) : 'Not specified'}
                  </span>
                </span>
                <span className={`flex items-center gap-2 underline decoration-white/10 ${!profile?.email && 'opacity-40 italic'}`}>
                  <Mail size={14} className="shrink-0" /> <span className="break-all">{profile?.email || 'Not specified'}</span>
                </span>
                <span className={`flex items-center gap-2 ${!profile?.profile?.phone && 'opacity-40 italic'}`}>
                  <Phone size={14} className="shrink-0" /> <span className="break-all">{profile?.profile?.phone || 'Not specified'}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="h-px bg-white/5 w-full mb-8"></div>
          <div className="space-y-4 text-left">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">About Me</h3>
            <p className={`text-sm md:text-base leading-relaxed max-w-5xl font-light break-all whitespace-pre-wrap ${profile?.profile?.bio ? 'text-slate-400' : 'text-slate-700 italic opacity-50'}`}>
              {profile?.profile?.bio || 'No information provided yet.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
