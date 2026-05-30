import React from 'react';
import { Layout, FolderOpen, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ConfigToggleProps {
  label: string;
  sub: string;
  active: boolean;
  onClick: () => void;
}

export const ConfigToggle: React.FC<ConfigToggleProps> = ({ label, sub, active, onClick }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-all group">
    <div className="text-left space-y-0.5">
      <p className="text-sm font-bold text-white group-hover:text-[#ff4f40] transition-colors leading-none">{label}</p>
      <p className="text-[10px] text-slate-500 font-medium mt-1.5 leading-none">{sub}</p>
    </div>
    <button
      onClick={onClick}
      className={`w-11 h-6 rounded-full relative transition-all duration-300 shrink-0 ml-3 cursor-pointer ${active ? 'bg-[#ff4f40]' : 'bg-[#1a1a1a]'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${active ? 'left-6' : 'left-1'}`} />
    </button>
  </div>
);

export interface ResumeConfig {
  profilePhoto: boolean;
  descriptionProfile: boolean;
  verifiedBadges: boolean;
  professorFeedback: boolean;
  personalProjects: boolean;
  technicalSkills: boolean;
}

interface ConfigPanelContentProps {
  selectedTemplate: number;
  setSelectedTemplate: (t: number) => void;
  config: ResumeConfig;
  toggleConfig: (key: keyof ResumeConfig) => void;
}

export const ConfigPanelContent: React.FC<ConfigPanelContentProps> = ({
  selectedTemplate,
  setSelectedTemplate,
  config,
  toggleConfig
}) => (
  <>
    {/* Template Selection */}
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Layout className="text-[#ff4f40]" size={18} />
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Template Style</h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => setSelectedTemplate(i)}
            className={`cursor-pointer aspect-3/4 bg-[#121214] rounded-2xl border-2 transition-all p-3 relative ${
              selectedTemplate === i ? 'border-[#ff4f40]' : 'border-white/5 hover:border-white/10'
            }`}
          >
            <div className="w-full h-1 bg-white/10 rounded mb-1" />
            <div className="w-2/3 h-3 bg-white/5 rounded mb-4" />
            <div className="space-y-1">
              <div className="w-full h-1 bg-white/3 rounded" />
              <div className="w-full h-1 bg-white/3 rounded" />
            </div>
            {selectedTemplate === i && (
              <div className="absolute top-2 right-2">
                <CheckCircle2 size={12} className="text-[#ff4f40]" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>

    {/* Config Toggles */}
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FolderOpen className="text-[#ff4f40]" size={18} />
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Content Included</h3>
      </div>
      <div className="space-y-3">
        <ConfigToggle label="Profile Photo" sub="Include your avatar image" active={config.profilePhoto} onClick={() => toggleConfig('profilePhoto')} />
        <ConfigToggle label="About Me Section" sub="Shows career objective" active={config.descriptionProfile} onClick={() => toggleConfig('descriptionProfile')} />
        <ConfigToggle label="Verified Badges" sub="Shows university credentials" active={config.verifiedBadges} onClick={() => toggleConfig('verifiedBadges')} />
        <ConfigToggle label="Professor Feedback" sub="Quotes from faculty reviews" active={config.professorFeedback} onClick={() => toggleConfig('professorFeedback')} />
        <ConfigToggle label="Featured Projects" sub="Shows personal & class work" active={config.personalProjects} onClick={() => toggleConfig('personalProjects')} />
        <ConfigToggle label="Technical Skills" sub="Verified skills overview" active={config.technicalSkills} onClick={() => toggleConfig('technicalSkills')} />
      </div>
    </div>

    <div className="p-6 rounded-4xl bg-emerald-500/5 border border-emerald-500/10 space-y-4">
      <div className="flex items-center gap-3 text-emerald-500">
        <ShieldCheck size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest leading-none">Security Verified</span>
      </div>
      <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold tracking-tight">
        Every badge and project in this document has been cryptographically signed by authorized faculty.
      </p>
    </div>
  </>
);
