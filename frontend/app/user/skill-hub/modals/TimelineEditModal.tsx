import React, { useState, useEffect } from 'react';
import { GraduationCap, Briefcase, X, Calendar, Target, BookOpen, Trash2 } from 'lucide-react';
import { ExperienceService } from '../../../../services/experience.service';
import { EducationService } from '../../../../services/education.service';

interface TimelineEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  initialData: any;
  onRefresh: () => void;
}

export const TimelineEditModal: React.FC<TimelineEditModalProps> = ({
  isOpen,
  onClose,
  type,
  initialData,
  onRefresh
}) => {
  const [formData, setFormData] = useState({
    organization: '',
    title: '',
    start_year: '',
    end_year: '',
    description: '',
    gpax: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        organization: initialData.organization || '',
        title: initialData.title || '',
        start_year: initialData.start_year || '',
        end_year: initialData.end_year || '',
        description: initialData.description || '',
        gpax: initialData.gpax || ''
      });
    } else {
      setFormData({ organization: '', title: '', start_year: '', end_year: '', description: '', gpax: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;
  const isEdu = type === 'education';

  const handleSubmit = async () => {
    setLoading(true);
    let success = false;
    const service = isEdu ? EducationService : ExperienceService;
    if (initialData?.id) {
      success = await service.update(initialData.id, formData);
    } else {
      success = await service.add(formData);
    }

    if (success) {
      onRefresh();
      onClose();
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    const service = isEdu ? EducationService : ExperienceService;
    const success = await service.delete(initialData.id);
    if (success) {
      onRefresh();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 text-left">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-3 capitalize text-white">
            {isEdu ? <GraduationCap className="text-[#ff4f40]" /> : <Briefcase className="text-[#ff4f40]" />}
            {initialData ? 'Edit' : 'Add'} {type}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              {isEdu ? "University / School" : "Company / Organization"}
            </label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              placeholder={isEdu ? "e.g. KMUTT" : "e.g. Google Thailand"}
              className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white transition-all shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              {isEdu ? "Degree / Major" : "Job Title / Position"}
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={isEdu ? "e.g. B.Sc. Applied Computer Science" : "e.g. Software Engineer Intern"}
              className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white transition-all shadow-inner"
            />
          </div>
          <div className={`grid ${isEdu ? 'grid-cols-3' : 'grid-cols-2'} gap-4 pt-2`}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-center block">
                Start Year
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
                <input
                  type="text"
                  value={formData.start_year}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, start_year: val });
                  }}
                  placeholder="2021"
                  className="w-full bg-black border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-center text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-center block">
                End Year
              </label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
                <input
                  type="text"
                  value={formData.end_year === 'Present' ? '' : formData.end_year}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, end_year: val });
                  }}
                  placeholder="Present"
                  className="w-full bg-black border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-center text-white"
                />
              </div>
            </div>
            {isEdu && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 text-center block">
                  GPAX
                </label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
                  <input
                    type="text"
                    value={formData.gpax}
                    onChange={(e) => setFormData({ ...formData, gpax: e.target.value })}
                    placeholder="3.50"
                    className="w-full bg-black border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-center text-white"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={isEdu ? "Briefly describe your focus..." : "Briefly describe your role and achievements..."}
              className="w-full bg-black border border-white/5 rounded-2xl px-6 py-4 text-sm focus:border-[#ff4f40]/50 outline-none text-white transition-all shadow-inner h-32 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-white/5">
          <div>
            {initialData && (
              <button
                onClick={handleDelete}
                className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest cursor-pointer"
              >
                <Trash2 size={16} /> Delete
              </button>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-slate-500 font-bold text-[14px] hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#ff4f40] text-white font-bold px-10 py-4 rounded-[1.5rem] shadow-xl text-[14px] disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
