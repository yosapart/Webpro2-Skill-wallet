import { AuthService } from './auth.service';

const API_BASE = 'http://localhost:3001';

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  profile: {
    name: string;
    headline?: string;
    bio?: string;
    avatar_url?: string;
    location?: string;
  };
  pinned_badges?: string[];
  experience?: any[];
  education?: any[];
}

export const SkillHubService = {
  async getMyProfile(): Promise<UserProfile | null> {
    try {
      const token = await AuthService.getFreshToken();
      if (!token) return null;

      const response = await fetch(`${API_BASE}/api/user/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      const data = await response.json();
      if (data.status === 'success') return data.data as UserProfile;
      return null;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      return null;
    }
  },

  async updateProfile(profileData: any): Promise<boolean> {
    try {
      const token = await AuthService.getFreshToken();
      if (!token) return false;

      const response = await fetch(`${API_BASE}/api/user/profile`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      return data.status === 'success';
    } catch (error) {
      console.error('Failed to update profile:', error);
      return false;
    }
  },

  async updatePinnedBadges(badgeIds: string[]): Promise<boolean> {
    try {
      const token = await AuthService.getFreshToken();
      if (!token) return false;

      const response = await fetch(`${API_BASE}/api/user/pinned-badges`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ badgeIds }),
      });

      const data = await response.json();
      return data.status === 'success';
    } catch (error) {
      console.error('Failed to update pinned badges:', error);
      return false;
    }
  },

  async addTimelineItem(type: 'experience' | 'education', data: any): Promise<boolean> {
    try {
      const token = await AuthService.getFreshToken();
      const response = await fetch(`${API_BASE}/api/user/${type}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result.status === 'success';
    } catch (error) {
      console.error(`Failed to add ${type}:`, error);
      return false;
    }
  },

  async updateTimelineItem(type: 'experience' | 'education', id: string, data: any): Promise<boolean> {
    try {
      const token = await AuthService.getFreshToken();
      const response = await fetch(`${API_BASE}/api/user/${type}/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result.status === 'success';
    } catch (error) {
      console.error(`Failed to update ${type}:`, error);
      return false;
    }
  },

  async deleteTimelineItem(type: 'experience' | 'education', id: string): Promise<boolean> {
    try {
      const token = await AuthService.getFreshToken();
      const response = await fetch(`${API_BASE}/api/user/${type}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      return result.status === 'success';
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
      return false;
    }
  }
};
