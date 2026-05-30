import { Elysia, t } from 'elysia';
import { AuthController } from '../controllers/auth.controller';
import { OtpController } from '../controllers/otp.controller';
import { auth, db } from '../config/firebase-admin';
import { authMiddleware } from '../middleware/auth.middleware';

// backend/src/routes/auth.route.ts
export const authRoute = new Elysia({ prefix: '/auth' })
    .use(authMiddleware)

    .post('/login-check', async ({ body }) => {
        return await AuthController.loginCheck(body.idToken);
    }, {
        body: t.Object({ idToken: t.String() }),
        detail: { tags: ['Auth'], summary: 'Login ด้วย Token หรือ test-uid' }
    })
    // เส้นนี้เปิดให้หน้าบ้าน (นักศึกษา) ใช้สมัคร
    .post('/register/student', async ({ body }) => {
        const decodedToken = await auth.verifyIdToken(body.idToken);
        return await AuthController.registerStudent(decodedToken.uid, decodedToken.email || "", body.name);
    }, {
        body: t.Object({ idToken: t.String(), name: t.String() }),
        detail: { tags: ['Auth'], summary: 'สร้างบัญชีนักศึกษา' }
    })

    // GET /api/auth/me — ดึงข้อมูล user profile ของผู้ที่ login อยู่
    .get('/me', async ({ user, set }: any) => {
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (!userDoc.exists) {
                set.status = 404;
                return { status: 'error', message: 'User not found' };
            }
            return { status: 'success', data: { id: userDoc.id, ...userDoc.data() } };
        } catch (error: any) {
            set.status = 500;
            return { status: 'error', message: error.message };
        }
    }, {
        isSignIn: true,
        detail: { tags: ['Auth'], summary: 'ดึงข้อมูลผู้ใช้ที่ Login อยู่ปัจจุบัน' }
    })

    // เส้นทางสำหรับอาจารย์ล็อกอินด้วย Email และ Password
    .post('/login/verifier', async ({ body }) => {
        return await AuthController.loginVerifier(body.email, body.password);
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String()
        }),
        detail: { tags: ['Auth'], summary: 'Login สำหรับอาจารย์ (ใช้ Email + Password)' }
    })

    // ขอ Access Token ใหม่ด้วย Refresh Token
    .post('/refresh', async ({ body, set }) => {
        const result = await AuthController.refreshToken(body.refreshToken);
        if (result.status === "error") {
            set.status = 401; // Unauthorized
        }
        return result;
    }, {
        body: t.Object({
            refreshToken: t.String()
        }),
        detail: { tags: ['Auth'], summary: 'ขอ Access Token ใหม่ด้วย Refresh Token' }
    })

    // POST /api/auth/register/email
    .post('/register/email', async ({ body, set }: any) => {
        try {
            const { email, password, name } = body;
            
            // 1. Create in Firebase Auth
            const userRecord = await auth.createUser({
                email,
                password,
                displayName: name,
            });

            // 2. Save to Firestore
            await db.collection("users").doc(userRecord.uid).set({
                user_id: userRecord.uid,
                email: email,
                role: "user",
                password: password, // เก็บไว้เผื่อล็อคอินผ่าน Custom API
                profile: {
                    name: name || 'Student',
                    avatar_url: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    headline: "",
                    bio: "",
                    location: "Bangkok"
                },
                experience: [],
                education: []
            });

            return { status: "success", message: "User registered successfully" };
        } catch (error: any) {
            set.status = 500;
            return { status: "error", message: error.message };
        }
    }, {
        body: t.Object({
            email: t.String(),
            password: t.String(),
            name: t.String()
        }),
        detail: {
            tags: ['Authentication'],
            summary: 'สมัครสมาชิกด้วย Email และ Password (หลังจากยืนยัน OTP แล้ว)'
        }
    })

    // POST /api/auth/otp/send
    .post('/otp/send', async ({ body, set }: any) => {
        try {
            const { email, purpose } = body;
            return await OtpController.requestOtp(email, purpose);
        } catch (error: any) {
            set.status = 500;
            return { status: "error", message: error.message };
        }
    }, {
        body: t.Object({
            email: t.String(),
            purpose: t.String()
        }),
        detail: {
            tags: ['Authentication', 'OTP'],
            summary: 'ส่งรหัส OTP 6 หลักไปยัง Email'
        }
    })

    // POST /api/auth/otp/verify
    .post('/otp/verify', async ({ body, set }: any) => {
        try {
            const { email, otp, purpose } = body;
            return await OtpController.verifyOtp(email, otp, purpose);
        } catch (error: any) {
            set.status = 500;
            return { status: "error", message: error.message };
        }
    }, {
        body: t.Object({
            email: t.String(),
            otp: t.String(),
            purpose: t.String()
        }),
        detail: {
            tags: ['Authentication', 'OTP'],
            summary: 'ตรวจสอบความถูกต้องของรหัส OTP'
        }
    })

    // POST /api/auth/reset-password
    .post('/reset-password', async ({ body, set }: any) => {
        try {
            const { email, otp, newPassword } = body;
            
            // 1. Verify OTP first
            const verifyResult = await OtpController.verifyOtp(email, otp, "reset");
            if (verifyResult.status !== "success") {
                set.status = 400;
                return verifyResult;
            }

            // 2. Update password in Firebase Auth (for students)
            try {
                const userRecord = await auth.getUserByEmail(email);
                await auth.updateUser(userRecord.uid, { password: newPassword });
                await db.collection("users").doc(userRecord.uid).update({ password: newPassword });
            } catch (e: any) {
                // If not in Firebase auth, check if it's a Verifier in Firestore
                const snapshot = await db.collection("users").where("email", "==", email).get();
                if (!snapshot.empty) {
                    await snapshot.docs[0].ref.update({ password: newPassword });
                } else {
                    set.status = 404;
                    return { status: "error", message: "User not found" };
                }
            }

            return { status: "success", message: "Password reset successfully" };
        } catch (error: any) {
            set.status = 500;
            return { status: "error", message: error.message };
        }
    }, {
        body: t.Object({
            email: t.String(),
            otp: t.String(),
            newPassword: t.String()
        }),
        detail: {
            tags: ['Authentication'],
            summary: 'รีเซ็ตรหัสผ่านด้วย OTP'
        }
    })

    // เส้นนี้ "คุณ" เอาไว้ใช้สร้างบัญชีให้อาจารย์ผ่าน Swagger เท่านั้น (ไม่ต้องทำหน้าบ้าน)
    .post('/admin/create-verifier', async ({ body }) => {
        return await AuthController.createVerifier(body.user_id, body.email, body.name, body.position, body.password);
    }, {
        body: t.Object({
            user_id: t.String(),
            email: t.String(),
            name: t.String(),
            position: t.String(),
            password: t.Optional(t.String())
        }),
        detail: { tags: ['Admin Only'], summary: 'สร้างบัญชีอาจารย์ (Verifier)' }
    });