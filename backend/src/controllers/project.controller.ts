import { db } from "../config/firebase-admin";
import cloudinary from "../config/cloudinary";

export const ProjectController = {
    // ดึงโปรเจกต์ทั้งหมด
    async getProjects(userId: string) {
        try {
            const snapshot = await db.collection("users").doc(userId).collection("projects")
                .orderBy("created_at", "desc")
                .get();
                
            const projects = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return { status: "success", data: projects };
        } catch (error: any) {
            return { status: "error", message: error.message };
        }
    },

    // เพิ่มโปรเจกต์ใหม่
    async addProject(userId: string, data: any) {
        try {
            const projectRef = db.collection("users").doc(userId).collection("projects").doc();
            const now = new Date();
            const nowISO = now.toISOString();

            const newProject = {
                ...data,
                year: now.getFullYear().toString(),
                created_at: nowISO,
                updated_at: nowISO
            };

            await projectRef.set(newProject);
            return { status: "success", data: { id: projectRef.id, ...newProject } };
        } catch (error: any) {
            return { status: "error", message: error.message };
        }
    },

    // แก้ไขโปรเจกต์
    async editProject(userId: string, projectId: string, data: any) {
        try {
            const projectRef = db.collection("users").doc(userId).collection("projects").doc(projectId);
            
            const updateData = {
                ...data,
                updated_at: new Date().toISOString()
            };
            
            await projectRef.update(updateData);
            return { status: "success", message: "Project updated successfully" };
        } catch (error: any) {
            return { status: "error", message: error.message };
        }
    },

    // ลบโปรเจกต์
    async removeProject(userId: string, projectId: string) {
        try {
            await db.collection("users").doc(userId).collection("projects").doc(projectId).delete();
            return { status: "success", message: "Project deleted successfully" };
        } catch (error: any) {
            return { status: "error", message: error.message };
        }
    }
};
