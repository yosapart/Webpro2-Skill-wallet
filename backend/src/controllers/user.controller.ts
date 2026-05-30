import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export const UserController = {
    // ดึงข้อมูลโปรไฟล์ผู้ใช้
    async getProfile(userId: string) {
        try {
            const userDoc = await db.collection("users").doc(userId).get();
            if (!userDoc.exists) {
                return { status: "error", message: "User not found" };
            }
            return { status: "success", data: userDoc.data() };
        } catch (error: any) {
            return { status: "error", message: error.message };
        }
    },

    // อัปเดตข้อมูล Profile
    async updateProfile(userId: string, data: any) {
        try {
            const { name, headline, bio, location, phone, avatar_url } = data;
            
            await db.collection("users").doc(userId).update({
                "profile.name": name,
                "profile.headline": headline,
                "profile.bio": bio,
                "profile.location": location,
                "profile.phone": phone,
                "profile.avatar_url": avatar_url,
                updated_at: new Date().toISOString()
            });

            return { status: "success", message: "Profile updated successfully" };
        } catch (error: any) {
            return { status: "error", message: "Failed to update profile", detail: error.message };
        }
    },

    // อัปเดตรายการ Badge ที่ปักหมุดไว้
    async updatePinnedBadges(userId: string, badgeIds: string[]) {
        try {
            await db.collection("users").doc(userId).update({
                pinned_badges: badgeIds,
                updated_at: new Date().toISOString()
            });
            return { status: "success", message: "Pinned badges updated successfully" };
        } catch (error: any) {
            return { status: "error", message: "Failed to update pinned badges", detail: error.message };
        }
    }
};
