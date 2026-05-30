import { db } from "../config/firebase-admin";

export const ProfessorController = {
    // ดึง badge requests ทั้งหมด (สำหรับ Professor)
    async getAllRequests() {
        try {
            const snapshot = await db.collection("badge_requests").orderBy("created_at", "desc").get();
            const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Enrich each request with student profile (name, avatar)
            const enriched = await Promise.all(requests.map(async (req: any) => {
                try {
                    const userDoc = await db.collection("users").doc(req.user_id).get();
                    const profile = userDoc.data()?.profile || {};
                    return {
                        ...req,
                        student_name: profile.name || "Unknown Student",
                        student_avatar: profile.avatar_url || "",
                    };
                } catch {
                    return { ...req, student_name: "Unknown Student", student_avatar: "" };
                }
            }));

            return { status: "success", data: enriched };
        } catch (error: any) {
            return { status: "error", message: "Failed to fetch all requests", detail: error.message };
        }
    },

    // ดึงข้อมูลนักเรียนทั้งหมดและคำนวณสถิติ
    async getAllStudents() {
        try {
            // Fetch all users with role 'user'
            const usersSnapshot = await db.collection("users").where("role", "==", "user").get();
            const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Fetch all approved badge requests
            const reqSnapshot = await db.collection("badge_requests").where("status", "==", "approved").get();
            const approvedRequests: any[] = reqSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const studentsData = users.map((user: any) => {
                const userId = user.id;
                const profile = user.profile || {};
                
                // Get this user's approved requests
                const userRequests = approvedRequests.filter(req => req.user_id === userId);
                
                // Calculate matrix
                let sw = 0, da = 0, gg = 0, cn = 0;
                userRequests.forEach(req => {
                    const cat = req.category || "";
                    if (cat === "SOFTWARE / WEB") sw = Math.min(100, sw + 20);
                    if (cat === "DATA / AI") da = Math.min(100, da + 20);
                    if (cat === "GAME / GRAPHICS") gg = Math.min(100, gg + 20);
                    if (cat === "CYBER / NETWORK") cn = Math.min(100, cn + 20);
                });

                // Determine focus based on max matrix score
                let focus = profile.track || "GENERAL";
                if (userRequests.length > 0) {
                    const scores = [
                        { cat: "SOFTWARE / WEB", score: sw },
                        { cat: "DATA / AI", score: da },
                        { cat: "GAME / GRAPHICS", score: gg },
                        { cat: "CYBER / NETWORK", score: cn }
                    ];
                    scores.sort((a, b) => b.score - a.score);
                    if (scores[0].score > 0) {
                        focus = scores[0].cat;
                    }
                }

                // All verifications (sort by updated_at desc)
                const latest = [...userRequests]
                    .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
                    .map(req => ({
                        title: req.badge_name,
                        date: new Date(req.updated_at || req.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
                        status: req.status
                    }));

                // Format student ID
                const displayId = userId.substring(0, 6).toUpperCase();
                const avatar = profile.avatar_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

                return {
                    id: displayId,
                    userId: userId,
                    name: profile.name || "Unknown User",
                    focus: focus,
                    avatar: avatar,
                    badgesCount: userRequests.length,
                    summary: profile.bio || "No summary provided.",
                    matrix: { sw, da, gg, cn },
                    latestVerifications: latest
                };
            });

            return { status: "success", data: studentsData };
        } catch (error: any) {
            return { status: "error", message: "Failed to fetch students", detail: error.message };
        }
    }
};
