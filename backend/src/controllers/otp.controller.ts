import { db } from "../config/firebase-admin";
import { EmailService } from "../services/email.service";

export const OtpController = {
    async requestOtp(email: string, purpose: string) {
        try {
            // ตรวจสอบว่าอีเมลนี้เคยสมัครหรือยัง (ถ้าจุดประสงค์คือการสมัครสมาชิก)
            if (purpose === 'register') {
                const userSnapshot = await db.collection("users").where("email", "==", email).limit(1).get();
                if (!userSnapshot.empty) {
                    return { status: "error", message: "This email is already registered." };
                }
            }

            // สร้างเลข 6 หลักแบบสุ่ม
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            
            // ตั้งเวลาหมดอายุ 5 นาทีจากตอนนี้
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 5);

            // บันทึกลง Firestore คอลเลกชัน 'otps'
            await db.collection('otps').doc(email).set({
                otp,
                expiresAt,
                purpose
            });

            // ส่ง Email ด้วย Nodemailer
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const emailSent = await EmailService.sendOtpEmail(email, otp);
                if (!emailSent) {
                    return { status: "error", message: "Failed to send OTP email" };
                }
            } else {
                console.log(`\n==============================================`);
                console.log(`[DEV MODE] EMAIL_USER not configured in .env!`);
                console.log(`[DEV MODE] OTP for ${email}: >>> ${otp} <<<`);
                console.log(`==============================================\n`);
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
            
            // ตรวจสอบเวลาหมดอายุ
            if (new Date() > data.expiresAt.toDate()) {
                await db.collection('otps').doc(email).delete(); // ลบทิ้งถ้าหมดอายุ
                return { status: "error", message: "OTP has expired" };
            }

            // ตรวจสอบรหัสผ่านและวัตถุประสงค์
            if (data.otp !== otp || data.purpose !== purpose) {
                return { status: "error", message: "Invalid OTP code" };
            }

            // ถ้าถูกต้อง ให้ลบ OTP ทิ้งเพื่อป้องกันการใช้ซ้ำ
            await db.collection('otps').doc(email).delete();

            return { status: "success", message: "OTP verified successfully" };
        } catch (error) {
            console.error("OTP Verify Error:", error);
            return { status: "error", message: "Error verifying OTP" };
        }
    }
};
