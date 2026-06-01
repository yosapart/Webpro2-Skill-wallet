"use client";

import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { useSkillHubData } from './hooks/useSkillHubData';
import { ProfileBanner } from './components/ProfileBanner';
import { FeaturedProjects } from './components/FeaturedProjects';
import { PinnedBadges } from './components/PinnedBadges';
import { TimelineSection } from './components/TimelineSection';
import { BadgeSelectModal } from './modals/BadgeSelectModal';
import { SubmissionModal } from './modals/SubmissionModal';
import { ProjectPreviewModal } from './modals/ProjectPreviewModal';
import { ProfileEditModal } from './modals/ProfileEditModal';
import { TimelineEditModal } from './modals/TimelineEditModal';

const CONTAINER_CLASS = "max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10";

export default function App() {
  const [activeTab, setActiveTab] = useState('skillhub');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>(null);

  const {
    profile,
    projects,
    isProjectsLoading,
    userBadges,
    isBadgesLoading,
    pinnedBadgeIds,
    fetchProfile,
    fetchProjects,
    togglePin
  } = useSkillHubData();

  const renderContent = () => {
    switch (activeTab) {
      case 'skillhub':
        return (
          <SkillHubView
            profile={profile}
            onOpenBadgeModal={() => setActiveModal('badge-select')}
            onAddProject={() => { setEditingData(null); setActiveModal('project-submit'); }}
            onPreviewProject={(p: any) => { setEditingData(p); setActiveModal('project-preview'); }}
            onEditProfile={() => setActiveModal('profile')}
            onAddExperience={(data: any) => { setEditingData(data || null); setActiveModal('experience'); }}
            onAddEducation={(data: any) => { setEditingData(data || null); setActiveModal('education'); }}
            pinnedBadgeIds={pinnedBadgeIds}
            togglePin={togglePin}
            projects={projects}
            isLoading={isProjectsLoading}
            badges={userBadges}
            isBadgesLoading={isBadgesLoading}
          />
        );
      default:
        return (
          <div className={`${CONTAINER_CLASS} py-20 text-center opacity-20`}>
            <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Section Coming Soon</h2>
          </div>
        );
    }
  };

  return (
    <>
      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto flex flex-col relative transition-all duration-300 w-full pt-14 md:pt-0">
        <header className="h-[70px] md:h-[90px] border-b border-white/5 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-40 flex items-center transition-all">
          <div className={CONTAINER_CLASS}>
            <div className="flex items-center justify-between">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">Skill Hub</h1>

            </div>
          </div>
        </header>
        {renderContent()}
      </main>

      {/* MODALS SYSTEM */}
      <BadgeSelectModal
        isOpen={activeModal === 'badge-select'}
        onClose={() => setActiveModal(null)}
        pinnedBadgeIds={pinnedBadgeIds}
        togglePin={togglePin}
        badges={userBadges}
      />
      <SubmissionModal
        isOpen={activeModal === 'project-submit'}
        onClose={() => setActiveModal(null)}
        type="project"
        initialData={editingData}
        onRefresh={fetchProjects}
      />
      <ProjectPreviewModal
        isOpen={activeModal === 'project-preview'}
        onClose={() => setActiveModal(null)}
        project={editingData}
        onEdit={() => setActiveModal('project-submit')}
        onRefresh={fetchProjects}
      />
      <ProfileEditModal
        isOpen={activeModal === 'profile'}
        onClose={() => setActiveModal(null)}
        profile={profile}
        onRefresh={fetchProfile}
      />
      <TimelineEditModal
        isOpen={activeModal === 'experience' || activeModal === 'education'}
        onClose={() => setActiveModal(null)}
        type={activeModal === 'experience' ? 'experience' : 'education'}
        initialData={editingData}
        onRefresh={fetchProfile}
      />
    </>
  );
}

const SkillHubView = ({
  profile,
  onOpenBadgeModal,
  onAddProject,
  onPreviewProject,
  onEditProfile,
  onAddExperience,
  onAddEducation,
  pinnedBadgeIds,
  togglePin,
  projects,
  isLoading,
  badges,
  isBadgesLoading
}: any) => {
  return (
    <div className={`${CONTAINER_CLASS} py-8 md:py-10 space-y-14 animate-in fade-in duration-700`}>
      {/* SECTION: Profile Banner */}
      <ProfileBanner profile={profile} onEditProfile={onEditProfile} />

      {/* SECTION: Featured Projects */}
      <FeaturedProjects
        projects={projects}
        isLoading={isLoading}
        onAddProject={onAddProject}
        onPreviewProject={onPreviewProject}
      />

      {/* SECTION: My Badges */}
      <PinnedBadges
        badges={badges}
        isBadgesLoading={isBadgesLoading}
        pinnedBadgeIds={pinnedBadgeIds}
        togglePin={togglePin}
        onOpenBadgeModal={onOpenBadgeModal}
      />

      {/* SECTION: Experience & Education */}
      <TimelineSection
        profile={profile}
        onAddExperience={onAddExperience}
        onAddEducation={onAddEducation}
      />

      <footer className="mt-auto py-12 border-t border-white/5 opacity-30 text-center uppercase font-bold tracking-[0.5em] text-[10px]">
        Ip&s IT Portfolio & Skill © 2026
      </footer>
    </div>
  );
};
