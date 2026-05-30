import { db } from "../config/firebase-admin";

export const FeetbackController = {
    async createFeedback(professorId: string, body: any) {
        try {
            const { request_id, status, comment, criteria_states } = body;

            if (!request_id) {
                return { status: "error", message: "Request ID is required" };
            }

            if (!status || !["approved", "revisions", "rejected"].includes(status)) {
                return { status: "error", message: "Invalid status" };
            }

            // 1. ดึงเอกสาร badge request จาก Firestore
            const requestRef = db.collection("badge_requests").doc(request_id);
            const requestDoc = await requestRef.get();

            if (!requestDoc.exists) {
                return { status: "error", message: "Badge request not found" };
            }

            const requestData = requestDoc.data() || {};
            const criteriaList = requestData.criteria || [];

            // 2. คำนวณคะแนนเกณฑ์แต่ละข้อตามที่อาจารย์ประเมิน (criteria_states คือ { c_0: true, c_1: false, ... })
            let totalScore = 0;
            const evaluatedCriteria = criteriaList.map((c: any, idx: number) => {
                const key = `c_${idx}`;
                const isPassed = !!criteria_states?.[key];
                const score = isPassed ? (c.max_score || 0) : 0;
                totalScore += score;
                return {
                    name: c.name || c.label || "Criterion",
                    description: c.description || c.desc || "",
                    max_score: c.max_score || 0,
                    score: score,
                    passed: isPassed
                };
            });

            // 3. สร้างข้อมูล Feedback สำหรับบันทึกลง Collection ใหม่ 'feedbacks' หรืออัปเดตทับอันเดิม
            const feedbackData: any = {
                request_id: request_id,
                student_id: requestData.user_id || "",
                professor_id: professorId,
                badge_id: requestData.badge_id || "",
                badge_name: requestData.badge_name || "",
                category: requestData.category || "",
                status: status,
                comment: comment || "",
                criteria_results: evaluatedCriteria,
                total_score: totalScore,
                max_score: requestData.max_score || 0,
                updated_at: new Date().toISOString()
            };

            let feedbackId = requestData.feedback_id || "";

            if (feedbackId) {
                // อัปเดตทับเอกสารเดิม
                const feedbackRef = db.collection("feedbacks").doc(feedbackId);
                const feedbackDoc = await feedbackRef.get();
                if (feedbackDoc.exists) {
                    const existingData = feedbackDoc.data() || {};
                    feedbackData.created_at = existingData.created_at || new Date().toISOString();
                    await feedbackRef.set(feedbackData);
                } else {
                    feedbackData.created_at = new Date().toISOString();
                    const feedbackDocRef = await db.collection("feedbacks").add(feedbackData);
                    feedbackId = feedbackDocRef.id;
                }
            } else {
                // ตรวจครั้งแรก -> สร้างใหม่
                feedbackData.created_at = new Date().toISOString();
                const feedbackDocRef = await db.collection("feedbacks").add(feedbackData);
                feedbackId = feedbackDocRef.id;
            }

            // 4. อัปเดตข้อมูลย้อนกลับไปยัง Collection 'badge_requests' (หรือตัว req_badge เดิม)
            const updatedRequestData = {
                status: status,
                result: evaluatedCriteria,
                total_score: totalScore,
                comment: comment || "",
                verifier_id: professorId,
                feedback_id: feedbackId,
                verified_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            await requestRef.update(updatedRequestData);

            return {
                status: "success",
                message: "Evaluation submitted and feedback created successfully",
                data: {
                    feedback_id: feedbackId,
                    badge_request: {
                        id: request_id,
                        ...updatedRequestData
                    }
                }
            };
        } catch (error: any) {
            console.error("Error creating feedback:", error);
            return { status: "error", message: "Failed to create feedback", detail: error.message };
        }
    }
};
