import React from 'react';
import {
  ShieldCheck, Quote, CheckCircle2,
  MapPin, Mail, Phone, User, GraduationCap, Briefcase,
  Code, Medal
} from 'lucide-react';
import type { ResumeConfig } from './ConfigPanel';
import type { ResumeData } from '../hooks/useResumeData';

interface ResumePaperProps {
  template: number;
  config: ResumeConfig;
  data: ResumeData;
}

export const ResumePaper: React.FC<ResumePaperProps> = ({ template, config, data }) => {
  if (!data) return null;
  return (
    <div className="w-full flex-1 bg-white text-slate-900 p-9 flex flex-col font-sans text-left relative">
      <div className="absolute top-6 right-6 opacity-[0.03] rotate-12 pointer-events-none select-none">
        <ShieldCheck size={120} className="w-50 h-50" />
      </div>

      {/* RESUME HEADER */}
      <header className={`flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-6 gap-4 ${template === 2 ? 'flex-row' : ''}`}>
        <div className="space-y-3 min-w-0 flex-1">
          <h1 className="text-4xl font-black tracking-tighter text-slate-950 uppercase leading-tight" style={{ wordBreak: 'break-all' }}>
            {data.name}
          </h1>
          <div className="space-y-1 text-slate-500 text-[11px] font-bold uppercase tracking-widest">
            {data.address && (
              <p className="flex items-start gap-2">
                <MapPin size={10} className="shrink-0 mt-0.5" />
                <span className="break-words leading-tight" style={{ wordBreak: 'break-all' }}>{data.address}</span>
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              {data.phone && (
                <p className="flex items-center gap-1.5">
                  <Phone size={10} className="shrink-0" /> {data.phone}
                </p>
              )}
              {data.email && (
                <p className="flex items-center gap-1.5 min-w-0">
                  <Mail size={10} className="shrink-0" />
                  <span className="break-words" style={{ wordBreak: 'break-all' }}>{data.email}</span>
                </p>
              )}
            </div>
          </div>
        </div>
        {config.profilePhoto && (
          <div className="w-24 h-24 bg-slate-100 rounded-3xl overflow-hidden shrink-0 shadow-lg flex items-center justify-center">
            {data.avatar ? (
              <img src={data.avatar} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <User size={32} className="text-slate-300" />
            )}
          </div>
        )}
      </header>

      {/* RESUME BODY */}
      <div className={`flex-1 flex ${template === 2 ? 'flex-row gap-6 gap-8' : 'flex-col gap-6'}`}>
        {/* Main column */}
        <div className={`${template === 2 ? 'w-2/3' : 'w-full'} space-y-6`}>
          {/* Profile Summary */}
          {config.descriptionProfile && (
            <section className="space-y-2">
              <h3 className="text-xs font-black text-[#ff4f40] uppercase tracking-[0.2em] border-b border-slate-100 pb-1.5 flex items-center gap-2">
                <User size={11} /> Profile Summary
              </h3>
              <p className="text-[12px] text-slate-600 leading-relaxed font-light" style={{ wordBreak: 'break-all' }}>
                {data.summary}
              </p>
            </section>
          )}

          {/* Education */}
          <section className="space-y-3">
            <h3 className="text-xs font-black text-[#ff4f40] uppercase tracking-[0.2em] border-b border-slate-100 pb-1.5 flex items-center gap-2">
              <GraduationCap size={11} /> Education
            </h3>
            <div className="space-y-2.5">
              {data.education.map((edu, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-[13px] text-slate-900 leading-snug" style={{ wordBreak: 'break-all' }}>{edu.uni}</h4>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0">{edu.year}</span>
                  </div>
                  <p className="text-[12px] text-slate-600" style={{ wordBreak: 'break-all' }}>{edu.degree}</p>
                  {edu.gpax && <p className="text-[11px] font-bold text-slate-900 mt-0.5">GPAX: {edu.gpax}</p>}
                </div>
              ))}
              {data.education.length === 0 && (
                <p className="text-[12px] text-slate-400 italic">No education history specified.</p>
              )}
            </div>
          </section>

          {/* Featured Projects */}
          {config.personalProjects && (
            <section className="space-y-4">
              <h3 className="text-xs font-black text-[#ff4f40] uppercase tracking-[0.2em] border-b border-slate-100 pb-1.5 flex items-center gap-2">
                <Briefcase size={11} /> Featured Projects
              </h3>
              <div className="space-y-3.5">
                {data.projects.map((proj, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-[13px] text-slate-900 underline decoration-slate-200 underline-offset-4 leading-snug" style={{ wordBreak: 'break-all' }}>
                        {proj.title}
                      </h4>
                      <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest shrink-0 text-right" style={{ wordBreak: 'break-all' }}>
                        {proj.tech}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-light" style={{ wordBreak: 'break-all' }}>
                      {proj.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Professor Feedback */}
          {config.professorFeedback && (
            <section className="space-y-3">
              <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em] border-b border-slate-100 pb-1.5 flex items-center gap-2">
                <Quote size={11} /> Professor Feedback
              </h3>
              <div className="bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
                {data.feedbackBadge ? (
                  <>
                    <p className="text-[11px] text-emerald-900 leading-relaxed">
                      &quot;{data.feedbackBadge.comment}&quot;
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle2 size={9} className="text-emerald-500 shrink-0" />
                      <p className="text-[9px] font-black text-emerald-700 uppercase">
                        — Verified by Prof. {data.feedbackBadge.verifier_name || data.feedbackBadge.prof || 'Professor'}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-[11px] text-emerald-700/60 leading-relaxed italic text-center py-2">
                    No verified feedback from professors yet. Request badges to get feedback!
                  </p>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Side column */}
        <div className={`${template === 2 ? 'w-1/3' : 'w-full'} space-y-6`}>
          {/* Verified Badges */}
          {config.verifiedBadges && (
            <section className="space-y-4">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 flex items-center gap-2">
                <Medal size={11} /> Verified Badges
              </h3>
              <div className={`grid gap-2 ${template === 2 ? 'grid-cols-1' : 'grid-cols-3'}`}>
                {data.verifiedBadges.map((badge) => (
                  <div key={badge} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-5 h-5 rounded-md bg-[#ff4f40] flex items-center justify-center text-white shrink-0">
                      <ShieldCheck size={10} />
                    </div>
                    <span className="text-[9px] font-black uppercase text-slate-700 leading-tight">{badge}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Technical Skills */}
          {config.technicalSkills && (
            <section className="space-y-6">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 flex items-center gap-2">
                <Code size={11} /> Technical Stack
              </h3>
              <div className="flex flex-wrap gap-2 pt-2">
                {data.skills.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* RESUME FOOTER */}
      <footer className="mt-auto pt-10 border-t border-slate-100 flex flex-row justify-between items-center gap-2 opacity-50">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ip&s IT Portfolio & Skill Wallet</span>
          <div className="block h-4 w-px bg-slate-300" />
          <span className="text-[10px] font-medium text-slate-500 italic">This document is digitally verified.</span>
        </div>
        <div className="text-[9px] font-black uppercase text-blue-600">
          KMUTT Applied Computer Science
        </div>
      </footer>
    </div>
  );
};
