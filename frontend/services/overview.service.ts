import { auth } from '../config/firebase';
import { UserProfile } from './skill-hub.service';

const API_BASE = 'http://localhost:3001';

const getFreshToken = async (): Promise<string | null> => {
  await auth.authStateReady();
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken();
  }
  return localStorage.getItem('token');
};

export interface BadgeRequest {
  id: string;
  badge_id: string;
  badge_name: string;
  category: string;
  description: string;
  evidence_link: string;
  status: 'pending' | 'approved' | 'revision' | 'revisions' | 'rejected';
  verifier_id: string | null;
  comment: string;
  created_at: string;
  updated_at: string;
  verified_at: string | null;
  total_score: number;
  max_score: number;
  result: any[];
  verifier_name?: string;
  verifier_avatar?: string;
}

export interface OverviewStats {
  totalVerified: number;
  totalPending: number;
  totalRevision: number;
  recentRequests: BadgeRequest[];
  approvedRequests: BadgeRequest[];
}

export const OverviewService = {
  async getMyRequests(): Promise<BadgeRequest[]> {
    try {
      const token = await getFreshToken();
      if (!token) return [];

      const response = await fetch(`${API_BASE}/api/badge-requests/my-requests`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.status === 'success') {
        return data.data as BadgeRequest[];
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      return [];
    }
  },

  computeStats(requests: BadgeRequest[]): OverviewStats {
    const approved = requests.filter((r) => r.status === 'approved');
    const pending = requests.filter((r) => r.status === 'pending');
    const revision = requests.filter((r) => r.status === 'revision' || r.status === 'revisions');
    const withFeedback = requests.filter((r) => r.status === 'approved' || r.status === 'revision' || r.status === 'revisions');

    return {
      totalVerified: approved.length,
      totalPending: pending.length,
      totalRevision: revision.length,
      recentRequests: requests.slice(0, 3),
      approvedRequests: withFeedback,
    };
  },

  // คำนวณ Skill Matrix จาก approved badges ตาม category
  computeSkillMatrix(requests: BadgeRequest[]) {
    const categories: Record<string, { total: number; count: number }> = {
      'SOFTWARE / WEB': { total: 0, count: 0 },
      'DATA / AI': { total: 0, count: 0 },
      'GAME / GRAPHICS': { total: 0, count: 0 },
      'CYBER / NETWORK': { total: 0, count: 0 },
    };

    const approved = requests.filter((r) => r.status === 'approved');

    for (const req of approved) {
      const cat = (req.category || '').toUpperCase().trim();
      if (categories[cat]) {
        // คำนวณ max_score จาก result array ถ้า field หลักเป็น 0
        const actualMax = req.max_score > 0
          ? req.max_score
          : (req.result || []).reduce((sum: number, r: any) => sum + (r.max_score || 0), 0);
        const score = actualMax > 0 ? req.total_score / actualMax : 0;
        categories[cat].total += score;
        categories[cat].count += 1;
      }
    }

    return Object.entries(categories).map(([name, { total, count }]) => ({
      name,
      // ให้ 1 badge ที่ได้คะแนนเต็มมีค่าเท่ากับ 1 วง (20% หรือ 0.2 ของกราฟทั้งหมด) 
      // โดยมี max อยู่ที่ 5 badge (เต็มขอบวงกลมสุดท้าย)
      score: total / 5,
    }));
  },
};
