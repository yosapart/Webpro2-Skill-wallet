import { AuthService } from './auth.service';

export const BadgeService = {
  // ดึงข้อมูล Badge ทั้งหมดเพื่อนำมาแสดงใน Modal
  async getAllBadges() {
    try {
      const token = await AuthService.getFreshToken();
      if (!token) throw new Error("No token found");

      const response = await fetch("http://localhost:3001/api/badges", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch badges:", error);
      return { status: "error", data: [] };
    }
  },

  // Upload ไฟล์ผ่าน Backend (ไม่มีปัญหา CORS)
  async uploadEvidence(file: File) {
    try {
      const token = await AuthService.getFreshToken();
      if (!token) throw new Error("No token found");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:3001/api/badge-requests/upload", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });

      const responseData = await response.json();
      if (!response.ok) {
        console.error("Backend upload error:", response.status, responseData);
      }
      return responseData;
    } catch (error) {
      console.error("Failed to upload file:", error);
      return { status: "error" };
    }
  },

  // ส่งคำขอสร้าง Badge ใหม่ไปยัง Collection badge_requests
  async createRequest(requestData: any) {
    try {
      const token = await AuthService.getFreshToken();
      if (!token) throw new Error("No token found");

      const response = await fetch("http://localhost:3001/api/badge-requests", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });
      return await response.json();
    } catch (error) {
      console.error("Failed to create badge request:", error);
      return { status: "error" };
    }
  },

  async getMyRequests() {
    try {
      const token = await AuthService.getFreshToken();
      if (!token) throw new Error("No token found");

      const response = await fetch("http://localhost:3001/api/badge-requests/my-requests", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      return { status: "error", data: [] };
    }
  },

  // Helper สำหรับดึงไอคอนมาตรฐานตามหมวดหมู่
  getCategoryDefaults(category: string) {
    if (category === 'SOFTWARE / WEB') return { profImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80", icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg', professor: "Prof. Wittawin" };
    if (category === 'DATA / AI') return { profImage: "https://i.pravatar.cc/100?u=2", icon: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg', professor: "Prof. Prapatsorn" };
    if (category === 'CYBER / NETWORK') return { profImage: "https://i.pravatar.cc/100?u=3", icon: 'https://www.svgrepo.com/show/303251/mysql-logo.svg', professor: "Prof. Somchai" };
    if (category === 'GAME / GRAPHICS') return { profImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80", icon: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg', professor: "Prof. Wittawin" };
    return { profImage: "https://i.pravatar.cc/100?u=4", icon: 'https://www.svgrepo.com/show/511054/code.svg', professor: "Professor" };
  },

  // ดึงข้อมูลคำขอที่รวมข้อมูลไอคอนและอาจารย์จาก Catalog เรียบร้อยแล้ว
  async getMyEnrichedRequests() {
    try {
      const catalogRes = await this.getAllBadges();
      const requestRes = await this.getMyRequests();

      if (catalogRes.status === "success" && requestRes.status === "success") {
        const catalog = catalogRes.data;
        const enriched = requestRes.data.map((req: any) => {
          const badgeInfo = catalog.find((b: any) => b.id?.toString() === req.badge_id?.toString());
          const defaults = this.getCategoryDefaults(req.category);

          return {
            ...req,
            icon: badgeInfo?.icon || badgeInfo?.image || defaults.icon,
            profImg: badgeInfo?.profImg || badgeInfo?.profImage || defaults.profImage,
            prof: badgeInfo?.prof || badgeInfo?.professor || req.prof || defaults.professor
          };
        });
        return { status: "success", data: enriched, catalog: catalog };
      }
      return requestRes;
    } catch (error) {
      console.error("Failed to fetch enriched requests:", error);
      return { status: "error", data: [] };
    }
  }
};
