import React from 'react';
import { Trash2, X, Globe, Edit3 } from 'lucide-react';
import { ProjectService } from '../../../../services/project.service';

interface ProjectPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any;
  onEdit: () => void;
  onRefresh: () => void;
}

const GithubIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const ProjectPreviewModal: React.FC<ProjectPreviewModalProps> = ({
  isOpen,
  onClose,
  project,
  onEdit,
  onRefresh
}) => {
  if (!isOpen || !project) return null;

  const handleDelete = async () => {
    const res = await ProjectService.deleteProject(project.id);
    if (res.status === "success") {
      if (onRefresh) onRefresh();
      onClose();
    } else {
      console.error("Failed to delete project: " + res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 text-left">
        {/* Banner Area */}
        <div className="h-64 sm:h-96 w-full relative">
          <img src={project.cover_image} className="w-full h-full object-cover" alt="Cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>

          {/* Top Actions */}
          <div className="absolute top-8 left-8 flex gap-3">
            <button
              onClick={handleDelete}
              className="p-3 bg-red-500/20 hover:bg-red-500 border border-red-500/30 rounded-full text-red-500 hover:text-white transition-all shadow-xl group cursor-pointer"
            >
              <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-3 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-[#ff4f40] transition-all group z-50 shadow-xl cursor-pointer"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Content Area - Overlapping Banner */}
        <div className="flex-1 overflow-y-auto p-10 sm:p-14 custom-scrollbar -mt-20 relative z-10">
          {/* Title & Buttons Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-4 min-w-0 flex-1">
              <div className="flex gap-2 flex-wrap">
                {(project.tech_stack || []).map((t: string) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-lg bg-[#ff4f40]/10 text-[#ff4f40] text-[10px] font-black uppercase tracking-widest border border-[#ff4f40]/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight break-all">
                {project.title}
              </h2>
            </div>

            <div className="flex gap-4">
              <a
                href={project.github_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all text-white"
              >
                <GithubIcon size={20} />
              </a>
              <a
                href={project.demo_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-[#ff4f40] hover:bg-[#e53e30] rounded-2xl transition-all text-white shadow-lg shadow-[#ff4f40]/20 flex items-center gap-2 font-bold text-sm"
              >
                Live Demo <Globe size={18} />
              </a>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                  Project Description <div className="h-px flex-1 bg-white/5"></div>
                </h3>
                <p className="text-lg text-slate-300 leading-relaxed font-light break-all whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Metadata Box */}
            <div className="space-y-8">
              <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 space-y-6">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest text-white">Metadata</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Status</span>
                    <span className="text-emerald-500 font-bold text-sm">{project.status || 'Completed'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Year</span>
                    <span className="text-white font-bold text-sm">{project.year || '2026'}</span>
                  </div>
                </div>
                <button
                  onClick={onEdit}
                  className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all text-sm font-bold flex items-center justify-center gap-2 text-white cursor-pointer"
                >
                  <Edit3 size={16} /> Edit Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
