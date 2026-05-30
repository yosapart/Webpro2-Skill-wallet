import { useState, useEffect } from 'react';
import { SkillHubService } from '../../../../services/skill-hub.service';
import { ProjectService } from '../../../../services/project.service';
import { BadgeService } from '../../../../services/badge.service';

export interface ResumeData {
  name: string;
  title: string;
  address: string;
  phone: string;
  email: string;
  summary: string;
  avatar: string;
  education: { uni: string; degree: string; gpax: string; year: string }[];
  projects: { title: string; tech: string; desc: string }[];
  skills: string[];
  verifiedBadges: string[];
  feedbackBadge: any;
}

export const useResumeData = () => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes, badgesRes] = await Promise.all([
          SkillHubService.getMyProfile(),
          ProjectService.getMyProjects(),
          BadgeService.getMyEnrichedRequests()
        ]);

        let feedbackBadge = null;
        let verifiedBadgesList: string[] = [];
        let techSkills = new Set<string>();

        if (badgesRes?.data) {
          const approved = badgesRes.data.filter((b: any) => b.status === 'approved');
          verifiedBadgesList = approved.map((b: any) => b.badge_name || b.title);

          const withFeedback = approved.filter((b: any) => b.comment && b.comment.trim() !== "");
          if (withFeedback.length > 0) {
            feedbackBadge = withFeedback[Math.floor(Math.random() * withFeedback.length)];
          }
        }

        let projectsList: { title: string; tech: string; desc: string }[] = [];
        if (projectsRes?.data) {
          // Limit to at most 3 projects
          projectsList = projectsRes.data.slice(0, 3).map((p: any) => {
            if (p.tech_stack) p.tech_stack.forEach((t: string) => techSkills.add(t));
            return {
              title: p.title,
              tech: p.tech_stack?.join(", ") || "",
              desc: p.description
            };
          });
        }

        const p: any = profileRes?.profile || {};

        // Limit to at most 3 education entries
        const educationList = (profileRes?.education || []).slice(0, 3).map((edu: any) => ({
          uni: edu.organization || "",
          degree: edu.title || "",
          gpax: edu.gpax || "",
          year: edu.start_year ? `${edu.start_year} - ${edu.end_year || 'Present'}` : ""
        }));

        setResumeData({
          name: p.name || "Unknown",
          title: p.headline || "",
          address: p.location || "",
          phone: p.phone || "",
          email: profileRes?.email || "",
          summary: p.bio || "",
          avatar: p.avatar_url || "",
          education: educationList,
          projects: projectsList,
          skills: Array.from(techSkills),
          verifiedBadges: verifiedBadgesList,
          feedbackBadge: feedbackBadge
        });
      } catch (err) {
        console.error("Failed to load resume data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { resumeData, isLoading };
};
