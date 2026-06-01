import { AuthService } from './auth.service';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://webpro2-skill-wallet-1.onrender.com";
const API_URL = `${API_BASE}/api/project`;

export interface ProjectData {
  id?: string;
  title: string;
  description: string;
  tech_stack: string[];
  cover_image: string;
  year?: string;
  created_at?: string;
  updated_at?: string;
}

export const ProjectService = {
  /**
   * อัปโหลดรูปภาพขึ้น Cloudinary ผ่าน Backend
   */
  async uploadImage(file: File): Promise<string> {
    const token = await AuthService.getFreshToken();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });

    const data = await response.json();
    if (data.status !== "success") {
      throw new Error(data.message || "Image upload failed");
    }
    return data.url;
  },

  /**
   * ดึงข้อมูลโปรเจกต์ทั้งหมด
   */
  async getMyProjects() {
    try {
      const token = await AuthService.getFreshToken();
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching projects:", error);
      return { status: "error", message: "Failed to connect to server" };
    }
  },

  /**
   * สร้างโปรเจกต์ใหม่ (ส่งเป็น JSON, cover_image เป็น URL แล้ว)
   */
  async createProject(data: Partial<ProjectData>) {
    const token = await AuthService.getFreshToken();
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  /**
   * แก้ไขโปรเจกต์ (ส่งเป็น JSON)
   */
  async updateProject(id: string, data: Partial<ProjectData>) {
    const token = await AuthService.getFreshToken();
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  /**
   * ลบโปรเจกต์
   */
  async deleteProject(id: string) {
    const token = await AuthService.getFreshToken();
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    return await response.json();
  }
};
