import { useState, useEffect } from 'react';
import { SkillHubService, UserProfile } from '../../../../services/skill-hub.service';
import { ProjectService, ProjectData } from '../../../../services/project.service';
import { BadgeService } from '../../../../services/badge.service';

export const useSkillHubData = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);
  const [userBadges, setUserBadges] = useState<any[]>([]);
  const [isBadgesLoading, setIsBadgesLoading] = useState(true);
  const [allBadgesCatalog, setAllBadgesCatalog] = useState<any[]>([]);
  const [pinnedBadgeIds, setPinnedBadgeIds] = useState<string[]>([]);

  const fetchProfile = async () => {
    const data = await SkillHubService.getMyProfile();
    if (data) {
      setProfile(data);
      setPinnedBadgeIds(data.pinned_badges || []);
    }
  };

  const fetchProjects = async () => {
    try {
      setIsProjectsLoading(true);
      const res = await ProjectService.getMyProjects();
      if (res.status === "success") {
        setProjects(res.data);
      } else {
        console.error("Failed to fetch projects:", res.message);
      }
    } catch (error) {
      console.error("Error in fetchProjects:", error);
    } finally {
      setIsProjectsLoading(false);
    }
  };

  const fetchUserBadges = async () => {
    try {
      setIsBadgesLoading(true);
      const res = await BadgeService.getMyEnrichedRequests();
      if (res.status === "success") {
        setUserBadges(res.data);
        if (res.catalog) setAllBadgesCatalog(res.catalog);
      }
    } catch (error) {
      console.error("Failed to fetch user badges:", error);
    } finally {
      setIsBadgesLoading(false);
    }
  };

  const togglePin = async (id: string) => {
    // Clean up any ghost or unapproved pins from the count
    const validPinned = pinnedBadgeIds.filter(bid => userBadges.some((b: any) => b.id === bid && b.status === 'approved'));

    let newPinned;
    if (pinnedBadgeIds.includes(id)) {
      newPinned = pinnedBadgeIds.filter(bid => bid !== id);
    } else if (validPinned.length < 4) {
      newPinned = [...validPinned, id]; // Automatically cleans up ghost pins when adding a new one
    } else {
      return; // Max reached
    }

    setPinnedBadgeIds(newPinned);
    await SkillHubService.updatePinnedBadges(newPinned);
  };

  useEffect(() => {
    fetchProfile();
    fetchProjects();
    fetchUserBadges();
  }, []);

  return {
    profile,
    projects,
    isProjectsLoading,
    userBadges,
    isBadgesLoading,
    allBadgesCatalog,
    pinnedBadgeIds,
    setPinnedBadgeIds,
    fetchProfile,
    fetchProjects,
    fetchUserBadges,
    togglePin
  };
};
