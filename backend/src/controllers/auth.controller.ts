// backend/src/controllers/auth.controller.ts
import { auth, db } from "../config/firebase-admin";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'web2promax-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'web2promax-refresh-secret-key';


export const AuthController = {
    // ใช้สำหรับนักศึกษาที่ Register เอง
    async registerStudent(user_id: string, email: string, name: string) {
        await db.collection("users").doc(user_id).set({
            user_id: user_id,
            email: email,
            role: "user",
            profile: {
                name: name,
                headline: "",
                bio: "",
                location: "Bangkok",
                avatar_url: ""
            },
            experience: [],
            education: []
        });
        return { status: "success", message: "Student registered" };
    },

    // ใช้สำหรับคุณ (Admin) สร้างให้อาจารย์เท่านั้น
    async createVerifier(user_id: string, email: string, name: string, position: string, password?: string) {
        // ใช้ crypto ในการ Hash รหัสผ่านเบื้องต้น หรือใช้ bcrypt ถ้าต้องการความปลอดภัยสูงสุด
        // แต่เพื่อให้เหมือนรอบที่แล้ว เราจะบันทึกเป็น Plain text ไปก่อนชั่วคราว หรือถ้าอยาก hash บอกได้ครับ
        await db.collection("users").doc(user_id).set({
            user_id: user_id,
            email: email,
            password: password || "123456", // ควร Hash ก่อนลง DB
            role: "verifier",
            profile: {
                name: name,
                position: position,
                organization: "KMUTT",
                expertise: [],
                avatar_url: ""
            }
        });
        return { status: "success", message: "Verifier account created with password" };
    },

    // ระบบ Login ด้วย Email และ Password (รองรับทั้งอาจารย์และนักศึกษา)
    async loginVerifier(email: string, password: string) {
        try {
            // ค้นหาในฐานข้อมูลด้วย email
            const snapshot = await db.collection("users")
                .where("email", "==", email)
                .limit(1)
                .get();

            if (snapshot.empty) {
                return { status: "error", message: "Email not found" };
            }

            const userData = snapshot.docs[0].data();
            const user_id = snapshot.docs[0].id;
            const role = userData?.role || "user";

            if (userData?.password !== password) {
                return { status: "error", message: "Incorrect password" };
            }

            // สร้าง Access Token แบบ JWT (อายุ 1 ชั่วโมง)
            const accessToken = jwt.sign(
                { uid: user_id, email: userData.email, role: role },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            // สร้าง Refresh Token (อายุ 7 วัน)
            const refreshToken = jwt.sign(
                { uid: user_id, email: userData.email, role: role },
                REFRESH_SECRET,
                { expiresIn: '7d' }
            );

            return {
                status: "success",
                role: role,
                user_id: user_id,
                accessToken: accessToken,
                refreshToken: refreshToken,
                data: userData
            };
        } catch (error) {
            return { status: "error", message: "Login failed" };
        }
    },

    // ขอ Access Token ใหม่ด้วย Refresh Token
    async refreshToken(token: string) {
        try {
            // ยืนยันความถูกต้องของ Refresh Token
            const decoded = jwt.verify(token, REFRESH_SECRET) as any;

            // ตรวจสอบว่าผู้ใช้ยังอยู่ในระบบจริงหรือไม่
            const userDoc = await db.collection("users").doc(decoded.uid).get();
            if (!userDoc.exists) {
                return { status: "error", message: "Invalid user" };
            }

            const userData = userDoc.data()!;
            const role = userData.role || "user";

            // สร้าง Access Token ใหม่ (อายุ 1 ชั่วโมง)
            const newAccessToken = jwt.sign(
                { uid: decoded.uid, email: userData.email, role: role },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            // สร้าง Refresh Token ใหม่ (อายุ 7 วัน) เพื่อต่ออายุการใช้งาน (Refresh Token Rotation)
            const newRefreshToken = jwt.sign(
                { uid: decoded.uid, email: userData.email, role: role },
                REFRESH_SECRET,
                { expiresIn: '7d' }
            );

            return {
                status: "success",
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            };
        } catch (error) {
            return { status: "error", message: "Invalid or expired refresh token" };
        }
    },

    // ระบบ Login (รองรับทั้ง Mock, JWT ของ Verifier และ Firebase Token จริง)
    async loginCheck(idToken: string) {
        try {
            let user_id = "";

            // 1. เช็คว่าเป็น Mock Login หรือไม่ (test-u1, test-u2)
            if (idToken.startsWith("test-")) {
                user_id = idToken.replace("test-", "");
            } else {
                // 2. ถ้าไม่ใช่ Mock ให้ลองเช็ค JWT ของเราก่อน (ฝั่งอาจารย์)
                try {
                    const decoded = jwt.verify(idToken, JWT_SECRET) as any;
                    user_id = decoded.uid;
                } catch (err) {
                    // 3. ถ้าไม่ใช่ JWT ของเรา หรือหมดอายุ ให้เช็คกับ Firebase (ฝั่งนักศึกษา)
                    const decodedToken = await auth.verifyIdToken(idToken);
                    user_id = decodedToken.uid;
                }
            }

            // ไปดึงข้อมูลจาก DB จริงๆ ตาม UID ที่ได้
            const userDoc = await db.collection("users").doc(user_id).get();

            if (!userDoc.exists) {
                return {
                    status: "not_registered",
                    message: "User not found in Firestore",
                    uid: user_id,
                };
            }

            const userData = userDoc.data();
            return {
                status: "success",
                role: userData?.role,
                data: userData
            };
        } catch (error) {
            console.error("Firebase verifyIdToken error:", error);
            return { status: "error", message: "Authentication Failed" };
        }
    }
};