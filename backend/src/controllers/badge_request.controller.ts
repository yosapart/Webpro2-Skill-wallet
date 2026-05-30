import { db } from "../config/firebase-admin";

export const BadgeRequestController = {
    async createRequest(userId: string, body: any) {
        try {
            const { badge_id, badge_name, category, description, evidence_link, criteria, max_score } = body;

            // โครงสร้างที่ต้องการสำหรับ badge_requte (badge_requests)
            const newRequest = {
                user_id: userId,
                badge_id: badge_id || "",
                badge_name: badge_name || "",
                category: category || "",
                description: description || "",
                evidence_link: evidence_link || "",
                criteria: criteria || [],
                result: [],
                total_score: 0,
                max_score: max_score || 0,
                status: "pending",
                verifier_id: null,
                comment: "",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                verified_at: null
            };

            // สร้าง collection ใหม่ชื่อ badge_requests (หรือจะใช้ badge_requte ตามที่ระบุก็ได้ แต่แนะนำ requests ตามหลัก plural)
            const docRef = await db.collection("badge_requests").add(newRequest);

            return { status: "success", message: "Badge request submitted successfully", data: { id: docRef.id, ...newRequest } };
        } catch (error: any) {
            return { status: "error", message: "Failed to create badge request", detail: error.message };
        }
    },

    async getMyRequests(userId: string) {
        try {
            const snapshot = await db.collection("badge_requests").where("user_id", "==", userId).get();
            const requests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as any[];
            
            // ดึงข้อมูลอาจารย์มาทำการ Enrich Profile
            const uniqueVerifierIds = Array.from(
                new Set(requests.map(r => r.verifier_id).filter(id => !!id))
            ) as string[];

            const verifierProfiles: Record<string, { name: string; avatar_url: string }> = {};

            if (uniqueVerifierIds.length > 0) {
                const usersSnapshot = await db.collection("users")
                    .where("__name__", "in", uniqueVerifierIds)
                    .get();

                usersSnapshot.docs.forEach(doc => {
                    const data = doc.data() || {};
                    verifierProfiles[doc.id] = {
                        name: data.profile?.name || data.name || "Professor",
                        avatar_url: data.profile?.avatar_url || data.avatar_url || ""
                    };
                });
            }

            // แปะข้อมูลลงในแต่ละ request
            const enrichedRequests = requests.map(r => {
                if (r.verifier_id && verifierProfiles[r.verifier_id]) {
                    return {
                        ...r,
                        verifier_name: verifierProfiles[r.verifier_id].name,
                        verifier_avatar: verifierProfiles[r.verifier_id].avatar_url
                    };
                }
                return r;
            });

            enrichedRequests.sort((a: any, b: any) => {
                const timeA = new Date(a.verified_at || a.updated_at || a.created_at || 0).getTime();
                const timeB = new Date(b.verified_at || b.updated_at || b.created_at || 0).getTime();
                return timeB - timeA;
            });
            
            return { status: "success", data: enrichedRequests };
        } catch (error: any) {
            return { status: "error", message: "Failed to fetch requests", detail: error.message };
        }
    },
};
