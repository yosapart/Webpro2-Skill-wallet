import { db } from "../config/firebase-admin";
import { EmailService } from "../services/email.service";

export const OtpController = {
    async requestOtp(email: string, purpose: string) {
        try {
            if (purpose === 'register') {
                const userSnapshot = await db.collection("users")
                    .where("email", "==", email).limit(1).get();
                if (!userSnapshot.empty) {
                    return { status: "error", message: "This email is already registered." };
                }
            }

            // ✅ เช็ค Cooldown 60 วินาที
            const existing = await db.collection('otps').doc(email).get();
            if (existing.exists) {
                const data = existing.data()!;
                if (data.createdAt) { // ✅ เช็คว่ามี createdAt (เผื่อเป็น OTP เก่าที่ค้างในระบบ)
                    const createdAt: Date = data.createdAt.toDate();
                    const secondsElapsed = (Date.now() - createdAt.getTime()) / 1000;
                    if (secondsElapsed < 60) {
                        const remaining = Math.ceil(60 - secondsElapsed);
                        return {
                            status: "error",
                            message: `Please wait ${remaining} seconds before requesting again`
                        };
                    }
                }
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 5);

            // ✅ เพิ่ม createdAt และ attempts สำหรับ tracking
            await db.collection('otps').doc(email).set({
                otp,
                expiresAt,
                createdAt: new Date(), // ← เพิ่ม
                purpose,
                attempts: 0            // ← เพิ่ม
            });

            // ✅ ส่ง Email พร้อม Timeout
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const emailPromise = EmailService.sendOtpEmail(email, otp);
                const timeoutPromise = new Promise<boolean>((_, reject) =>
                    setTimeout(() => reject(new Error("Email timeout")), 10000)
                );

                try {
                    const emailSent = await Promise.race([emailPromise, timeoutPromise]);
                    if (!emailSent) {
                        // ✅ ลบ OTP ออกถ้าส่ง email ไม่สำเร็จ
                        await db.collection('otps').doc(email).delete();
                        return { status: "error", message: "Failed to send OTP email" };
                    }
                } catch (emailError: any) {
                    // ✅ ลบ OTP ออกถ้า timeout
                    await db.collection('otps').doc(email).delete();
                    return { status: "error", message: `Email error: ${emailError.message}` };
                }
            } else {
                console.log(`[DEV MODE] OTP for ${email}: >>> ${otp} <<<`);
            }

            return { status: "success", message: "OTP sent to your email" };
        } catch (error) {
            console.error("OTP Request Error:", error);
            return { status: "error", message: "Error generating OTP" };
        }
    },

    async verifyOtp(email: string, otp: string, purpose: string) {
        try {
            const doc = await db.collection('otps').doc(email).get();
            if (!doc.exists) {
                return { status: "error", message: "OTP not found or expired" };
            }

            const data = doc.data()!;

            // ✅ เช็ค Attempt Limit (ป้องกัน brute force)
            if ((data.attempts || 0) >= 5) { // ✅ ใส่ fallback || 0 เผื่อเป็น OTP เก่า
                await db.collection('otps').doc(email).delete();
                return { status: "error", message: "Too many attempts. Please request a new OTP" };
            }

            // ตรวจสอบเวลาหมดอายุ
            if (new Date() > data.expiresAt.toDate()) {
                await db.collection('otps').doc(email).delete();
                return { status: "error", message: "OTP has expired" };
            }

            // ✅ นับ attempt ก่อนตรวจสอบ
            if (data.otp !== otp || data.purpose !== purpose) {
                const newAttempts = (data.attempts || 0) + 1; // ✅ ใส่ fallback || 0
                await db.collection('otps').doc(email).update({
                    attempts: newAttempts
                });
                const remaining = 5 - newAttempts;
                return {
                    status: "error",
                    message: `Invalid OTP code. ${remaining} attempts remaining`
                };
            }

            await db.collection('otps').doc(email).delete();
            return { status: "success", message: "OTP verified successfully" };
        } catch (error) {
            console.error("OTP Verify Error:", error);
            return { status: "error", message: "Error verifying OTP" };
        }
    }
};