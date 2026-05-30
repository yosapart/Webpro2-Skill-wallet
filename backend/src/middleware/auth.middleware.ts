import { Elysia } from 'elysia';
import { auth, db } from '../config/firebase-admin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'web2promax-secret-key';

// สร้าง Middleware สำหรับตรวจสอบ Token และ Role
export const authMiddleware = new Elysia({ name: 'auth-middleware' })
    .derive(async ({ headers, request }) => {
        const authHeader = headers['authorization'] || request.headers.get('authorization');

        if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
            return { user: null as { uid: string; email?: string; role?: string } | null, authError: `No Token` };
        }

        const idToken = authHeader.split(' ')[1];

        try {
            let uid = "";
            let email = "";

            // 1. รองรับ Test Token (สำหรับระบบ Mock หรือตอน Dev)
            if (idToken.startsWith('test-')) {
                uid = idToken.replace('test-', '');
            } else {
                // 2. ลองตรวจสอบ JWT ของเราเองก่อน (สำหรับ Verifier)
                try {
                    const decoded = jwt.verify(idToken, JWT_SECRET) as any;
                    uid = decoded.uid;
                    email = decoded.email || "";
                } catch (err) {
                    // 3. ถ้าไม่ใช่ JWT ของเรา ลองเช็คกับ Firebase Auth (สำหรับ Student)
                    const decodedToken = await auth.verifyIdToken(idToken);
                    uid = decodedToken.uid;
                    email = decodedToken.email || "";
                }
            }

            // 4. ดึง Role จาก Firestore
            const userDoc = await db.collection('users').doc(uid).get();
            const role = userDoc.exists ? userDoc.data()?.role : 'user';

            return {
                user: { uid, email, role },
                authError: null as string | null
            };
        } catch (error: any) {
            return { user: null as { uid: string; email?: string; role?: string } | null, authError: error.message };
        }
    })
    .macro({
        // ตรวจสอบว่า Login หรือยัง
        isSignIn(enabled: boolean) {
            if (!enabled) return {};
            return {
                beforeHandle({ user, authError, set }: any) {
                    if (!user) {
                        set.status = 401;
                        return { status: "error", message: `Unauthorized: ${authError || "Please login"}` };
                    }
                }
            };
        },
        // ตรวจสอบ Role เฉพาะเจาะจง
        hasRole(role: string) {
            return {
                beforeHandle({ user, set }: any) {
                    if (!user || user.role !== role) {
                        set.status = 403;
                        return { status: "error", message: `Forbidden: Requires ${role} role` };
                    }
                }
            };
        }
    })
    .as('global');
