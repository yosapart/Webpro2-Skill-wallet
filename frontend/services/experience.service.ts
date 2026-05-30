import { auth } from '../config/firebase';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001';

const getFreshToken = async (): Promise<string | null> => {
  await auth.authStateReady();
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken();
  }
  return localStorage.getItem('token');
};

export const ExperienceService = {
  async add(data: any) {
    try {
      const token = await getFreshToken();
      const response = await fetch(`${API_BASE}/api/user/experience`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding experience:', error);
      return null;
    }
  },

  async update(id: string, data: any) {
    try {
      const token = await getFreshToken();
      const response = await fetch(`${API_BASE}/api/user/experience/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating experience:', error);
      return null;
    }
  },

  async delete(id: string) {
    try {
      const token = await getFreshToken();
      const response = await fetch(`${API_BASE}/api/user/experience/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}` 
        }
      });
      const result = await response.json();
      return result.status === 'success';
    } catch (error) {
      console.error('Error deleting experience:', error);
      return false;
    }
  }
};
