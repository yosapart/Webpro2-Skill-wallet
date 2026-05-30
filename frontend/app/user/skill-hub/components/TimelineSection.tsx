import React from 'react';
import { Briefcase, GraduationCap, Plus, ChevronRight } from 'lucide-react';

interface TimelineSectionProps {
  profile: any;
  onAddExperience: (data?: any) => void;
  onAddEducation: (data?: any) => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  profile,
  onAddExperience,
  onAddEducation
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 text-left">
      {/* Experience Column */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="text-[#ff4f40]" size={24} />
            <h3 className="text-2xl font-bold tracking-tight text-white">Experience</h3>
          </div>
          <button
            onClick={() => onAddExperience()}
            className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#ff4f40] transition-all flex items-center justify-center text-white shadow-lg transform active:scale-90 cursor-pointer"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="space-y-6">
          {profile?.experience?.length > 0 ? (
            profile.experience.map((exp: any) => (
              <div
                key={exp.id}
                className="bg-[#0f0f11] border border-white/5 rounded-[2.5rem] p-8 min-h-[280px] flex flex-col justify-between hover:border-[#ff4f40]/20 transition-all group shadow-xl relative overflow-hidden text-left"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-bold text-xl text-white break-all min-w-0">{exp.organization}</h4>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest shrink-0 mt-1">
                      {exp.start_year} - {exp.end_year || 'Present'}
                    </span>
                  </div>
                  <p className="text-[#ff4f40] font-bold text-sm break-all whitespace-pre-wrap">{exp.title}</p>
                  {exp.description && (
                    <p className="text-slate-500 text-sm font-light leading-relaxed break-all whitespace-pre-wrap">
                      {exp.description}
                    </p>
                  )}
                </div>
                <div className="pt-6 border-t border-white/5 text-right">
                  <button
                    onClick={() => onAddExperience(exp)}
                    className="text-[10px] font-black text-slate-500 hover:text-[#ff4f40] uppercase tracking-widest flex items-center gap-1 transition-all ml-auto font-bold cursor-pointer"
                  >
                    EDIT <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#0f0f11] border border-dashed border-white/5 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center opacity-30 min-h-[280px]">
              <h3 className="text-xs font-black uppercase tracking-[0.3em]">No Experience Added Yet</h3>
            </div>
          )}
        </div>
      </div>

      {/* Education Column */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-[#ff4f40]" size={24} />
            <h3 className="text-2xl font-bold tracking-tight text-white">Education</h3>
          </div>
          <button
            onClick={() => onAddEducation()}
            className="w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#ff4f40] transition-all flex items-center justify-center text-white shadow-lg transform active:scale-90 cursor-pointer"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="space-y-6">
          {profile?.education?.length > 0 ? (
            profile.education.map((edu: any) => (
              <div
                key={edu.id}
                className="bg-[#0f0f11] border border-white/5 rounded-[2.5rem] p-8 min-h-[280px] flex flex-col justify-between hover:border-[#ff4f40]/20 transition-all group shadow-xl relative overflow-hidden text-left"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-bold text-xl text-white break-all min-w-0">{edu.organization}</h4>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest shrink-0 mt-1">
                      {edu.start_year} - {edu.end_year || 'Present'}
                    </span>
                  </div>
                  <p className="text-[#ff4f40] font-bold text-sm break-all whitespace-pre-wrap">{edu.title}</p>
                  {edu.gpax && (
                    <p className="text-white font-bold text-xs uppercase tracking-widest mt-1 bg-white/5 inline-block px-3 py-1 rounded-md">
                      GPAX: <span className="text-[#ff4f40]">{edu.gpax}</span>
                    </p>
                  )}
                  {edu.description && (
                    <p className="text-slate-500 text-sm font-light leading-relaxed break-all whitespace-pre-wrap">
                      {edu.description}
                    </p>
                  )}
                </div>
                <div className="pt-6 border-t border-white/5 text-right">
                  <button
                    onClick={() => onAddEducation(edu)}
                    className="text-[10px] font-black text-slate-500 hover:text-[#ff4f40] uppercase tracking-widest flex items-center gap-1 transition-all ml-auto font-bold cursor-pointer"
                  >
                    EDIT <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#0f0f11] border border-dashed border-white/5 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center opacity-30 min-h-[280px]">
              <h3 className="text-xs font-black uppercase tracking-[0.3em]">No Education Added Yet</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
