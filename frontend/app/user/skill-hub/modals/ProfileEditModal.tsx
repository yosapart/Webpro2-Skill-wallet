import React, { useState, useEffect, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { DEFAULT_AVATAR } from '../../../../services/auth.service';
import { SkillHubService } from '../../../../services/skill-hub.service';
import { ProjectService } from '../../../../services/project.service';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onRefresh: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profile,
  onRefresh
}) => {
  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    bio: '',
    location: '',
    phone: '',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(DEFAULT_AVATAR);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.profile?.name || '',
        headline: profile.profile?.headline || '',
        bio: profile.profile?.bio || '',
        location: profile.profile?.location || '',
        phone: profile.profile?.phone || '',
        avatar_url: profile.profile?.avatar_url || ''
      });
      setAvatarPreview(profile.profile?.avatar_url || DEFAULT_AVATAR);
    }
  }, [profile, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    let updatedAvatarUrl = formData.avatar_url;

    if (selectedFile) {
      try {
        updatedAvatarUrl = await ProjectService.uploadImage(selectedFile);
      } catch (error) {
        console.error("Error uploading avatar:", error);
        setLoading(false);
        return;
      }
    }

    const payload = {
      ...formData,
      avatar_url: updatedAvatarUrl
    };

    const success = await SkillHubService.updateProfile(payload);
    setLoading(false);

    if (success) {
      if (onRefresh) onRefresh();
      window.dispatchEvent(new Event('profileUpdated'));
      onClose();
    } else {
      console.error('Failed to update profile');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl p-8 md:p-10 space-y-8 animate-in zoom-in-95 text-left max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="cursor-pointer p-2 hover:bg-white/5 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* ── Photo Upload ── */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-28 h-28 rounded-3xl overflow-hidden border-2 border-white/10 group-hover:border-[#ff4f40]/60 transition-all shadow-2xl">
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 rounded-3xl bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
              <div className="flex flex-col items-center gap-1 text-white">
                <Upload size={22} />
                <span className="text-[9px] font-black uppercase tracking-widest">Change</span>
              </div>
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-[10px] font-black text-slate-500 hover:text-[#ff4f40] uppercase tracking-widest transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Upload size={12} /> Upload New Photo
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Yosaprt Raul"
              maxLength={50}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Headline</label>
            <input
              type="text"
              placeholder="e.g. Full Stack Developer"
              maxLength={167}
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white shadow-inner"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Bangkok"
                maxLength={214}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white shadow-inner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Phone</label>
              <input
                type="tel"
                placeholder="e.g. xxx-xxx-xxxx"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
                className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white shadow-inner"
              />
            </div>
          </div>
          <div className="space-y-2 relative">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Bio</label>
            <textarea
              value={formData.bio}
              placeholder="Tell about yourself..."
              maxLength={350}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-black border border-white/5 rounded-2xl p-6 text-sm min-h-[120px] focus:border-[#ff4f40]/50 outline-none text-white shadow-inner custom-scrollbar resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 md:gap-6 pt-6 border-t border-white/5">
          <button onClick={onClose} className="cursor-pointer px-6 py-3 text-slate-500 font-bold text-[14px] hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="cursor-pointer bg-[#ff4f40] text-white font-semibold px-8 md:px-10 py-4 rounded-3xl shadow-xl text-[14px] disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};
