"use client";

import React, { useState } from 'react';
import { Download, X, Settings } from 'lucide-react';
import { useResumeData } from './hooks/useResumeData';
import { useResumeExport } from './hooks/useResumeExport';
import { ConfigPanelContent, type ResumeConfig } from './components/ConfigPanel';
import { ResumePaper } from './components/ResumePaper';

export default function Preview() {
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [configOpen, setConfigOpen] = useState(false);
  const [config, setConfig] = useState<ResumeConfig>({
    profilePhoto: true,
    descriptionProfile: true,
    verifiedBadges: true,
    professorFeedback: true,
    personalProjects: true,
    technicalSkills: true
  });

  const { resumeData, isLoading } = useResumeData();
  const { resumeRef, wrapperRef, isExporting, scale, handleExportPDF } = useResumeExport();

  const toggleConfig = (key: keyof ResumeConfig) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full text-white text-sm">Loading resume...</div>;
  }

  return (
    <div className="flex flex-col h-full text-white font-lineseed selection:bg-[#ff4f40]/30 selection:text-white relative transition-all duration-300 pt-14 md:pt-0">

      {/* HEADER */}
      <header className="h-14 md:h-17.5 lg:h-22.5 border-b border-white/5 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-40 flex items-center shrink-0">
        <div className="w-full flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">Export Verified Resume</h1>
          <div className="flex items-center gap-2 shrink-0">
            {/* Config toggle button — mobile only */}
            <button
              onClick={() => setConfigOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className={`cursor-pointer bg-[#ff4f40] hover:bg-[#e53e30] text-white text-[14px] sm:text-[14px] font-bold px-4 sm:px-8 py-2.5 md:py-3 rounded-xl transition-all shadow-lg shadow-[#ff4f40]/20 flex items-center gap-2  ${isExporting ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
            >
              <Download size={16} /> <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export PDF'}</span><span className="sm:hidden">{isExporting ? '...' : 'Export'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="flex flex-1 overflow-hidden">

        {/* CONFIG PANEL — desktop: always visible left column */}
        <div className="hidden lg:flex w-100 bg-[#0a0a0a] border-r border-white/5 overflow-y-auto custom-scrollbar pl-10 pr-8 py-8 flex-col space-y-10 text-left shrink-0">
          <ConfigPanelContent
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            config={config}
            toggleConfig={toggleConfig}
          />
        </div>

        {/* CONFIG PANEL — mobile/tablet: bottom sheet drawer */}
        {configOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
              onClick={() => setConfigOpen(false)}
            />
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-70 bg-[#0a0a0a] border-t border-white/5 rounded-t-3xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
              {/* Handle */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5 sticky top-0 bg-[#0a0a0a] z-10">
                <p className="text-sm font-bold text-white">Resume Settings</p>
                <button onClick={() => setConfigOpen(false)} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>
              <div className="p-6 space-y-10">
                <ConfigPanelContent
                  selectedTemplate={selectedTemplate}
                  setSelectedTemplate={setSelectedTemplate}
                  config={config}
                  toggleConfig={toggleConfig}
                />
              </div>
            </div>
          </>
        )}

        {/* LIVE PREVIEW AREA */}
        <div className="flex-1 bg-[#050505] overflow-y-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-8 lg:py-12 flex justify-center items-start custom-scrollbar">
          <div ref={wrapperRef} className="w-full max-w-[840px] flex justify-center relative">
            <div
              style={{
                width: '840px',
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                marginBottom: `-${(1 - scale) * 1188}px`
              }}
              className="shadow-2xl animate-in fade-in zoom-in duration-700 origin-top shrink-0"
            >
              <div ref={resumeRef} className="w-full bg-white flex flex-col min-h-[1188px]">
                {resumeData && <ResumePaper template={selectedTemplate} config={config} data={resumeData} />}
              </div>
            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
      `}} />
    </div>
  );
}
