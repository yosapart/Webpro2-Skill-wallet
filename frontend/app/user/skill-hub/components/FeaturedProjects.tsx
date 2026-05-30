import React from 'react';
import { FolderOpen, Plus, ChevronRight } from 'lucide-react';

interface FeaturedProjectsProps {
  projects: any[];
  isLoading: boolean;
  onAddProject: () => void;
  onPreviewProject: (project: any) => void;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
  projects,
  isLoading,
  onAddProject,
  onPreviewProject
}) => {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-3">
        <FolderOpen className="text-[#ff4f40]" size={24} />
        <h3 className="text-2xl font-bold tracking-tight text-white">Featured Projects</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {projects.map((project: any) => (
          <div
            key={project.id}
            onClick={() => onPreviewProject(project)}
            className="bg-[#0f0f11] border border-white/5 rounded-[2.2rem] flex flex-col min-h-[360px] hover:border-[#ff4f40]/30 transition-all cursor-pointer group relative overflow-hidden shadow-xl"
          >
            <div className="h-48 bg-black/40 relative overflow-hidden">
              <img
                src={project.cover_image}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-60"
                alt={project.title}
              />
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-white">
                Project
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col text-left">
              <h4 className="font-bold text-xl leading-tight mb-3 group-hover:text-[#ff4f40] transition-colors text-white break-all">
                {project.title}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-3 font-light leading-relaxed mb-6 break-all whitespace-pre-wrap">
                {project.description}
              </p>
              <div className="mt-auto flex justify-between items-center">
                <div className="flex gap-2">
                  {project.tech_stack?.map((t: string) => (
                    <span key={t} className="px-2 py-1 rounded-md bg-white/5 text-slate-400 text-[9px] font-bold uppercase">
                      {t}
                    </span>
                  ))}
                </div>
                <ChevronRight
                  size={18}
                  className="text-slate-700 group-hover:text-[#ff4f40] transition-all transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </div>
        ))}

        {isLoading &&
          [1, 2].map((i) => (
            <div key={i} className="bg-[#0f0f11] border border-white/5 rounded-[2.2rem] min-h-[360px] animate-pulse"></div>
          ))}

        <div
          onClick={onAddProject}
          className="bg-[#050505] border-2 border-dashed border-white/5 rounded-[2.2rem] p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#ff4f40]/40 transition-all min-h-[360px] shadow-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-[#ff4f40] group-hover:text-white group-hover:scale-110 transition-all mb-6 shadow-inner">
            <Plus size={36} />
          </div>
          <h4 className="font-bold text-white text-xl mb-2 uppercase tracking-tight">Add New Project</h4>
          <p className="text-[11px] text-slate-500 uppercase font-black tracking-widest max-w-[200px] leading-relaxed">
            Upload and showcase your latest achievements.
          </p>
        </div>
      </div>
    </section>
  );
};
