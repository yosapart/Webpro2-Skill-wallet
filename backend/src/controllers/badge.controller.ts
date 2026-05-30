import { db } from "../config/firebase-admin";

export const BadgeController = {
    // ดึงข้อมูล Badge ทั้งหมดเพื่อนำไปแสดงในหน้าเลือก (Catalog)
    async getAllBadges() {
        try {
            // ดึง Badge ทั้งหมด (เอา where is_active ออกชั่วคราวเพื่อเมคชัวร์ว่าดึงมาได้แน่นอน)
            const snapshot = await db.collection("badges").get();
            const badges = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            return { status: "success", data: badges };
        } catch (error: any) {
            return { status: "error", message: "Failed to fetch badges", detail: error.message };
        }
    },

    // ดึงรายละเอียด Badge ทีละตัว (ใช้ตอนคลิกเพื่อดูรายละเอียดเชิงลึก หรือทำ Request)
    async getBadgeById(badgeId: string) {
        try {
            const doc = await db.collection("badges").doc(badgeId).get();
            if (!doc.exists) {
                return { status: "error", message: "Badge not found" };
            }

            return { status: "success", data: { id: doc.id, ...doc.data() } };
        } catch (error: any) {
            return { status: "error", message: "Failed to fetch badge details", detail: error.message };
        }
    }
};
