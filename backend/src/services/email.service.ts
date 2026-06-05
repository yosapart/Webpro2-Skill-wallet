import nodemailer from 'nodemailer';

// ✅ สร้าง transporter ครั้งเดียว (Singleton)
const createTransporter = () => nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // ✅ เพิ่ม timeout ป้องกัน hang
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
    pool: true,         // ✅ ใช้ connection pool แทนสร้างใหม่ทุกครั้ง
    maxConnections: 3
});

let transporter: nodemailer.Transporter | null = null;

export const EmailService = {
    async sendOtpEmail(to: string, otp: string) {
        // ✅ ใช้ transporter เดิมถ้ามีอยู่แล้ว
        if (!transporter) {
            transporter = createTransporter();
        }

        const mailOptions = {
            from: `"Ip&s Skill Wallet" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Your Verification Code - Ip&s Skill Wallet',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #050505; color: white;">
                    <div style="max-width: 500px; margin: 0 auto; background: #0a0a0a; padding: 40px; border-radius: 20px; text-align: center; border: 1px solid rgba(255,255,255,0.1);">
                        <h2 style="color: white; margin-bottom: 10px;">Verification Code</h2>
                        <p style="color: #94a3b8; font-size: 15px; margin-bottom: 30px;">
                            Here is your 6-digit verification code. It will expire in 5 minutes.
                        </p>
                        <h1 style="font-size: 40px; letter-spacing: 8px; color: #ff4f40; background: rgba(255,79,64,0.1); padding: 15px 30px; border-radius: 12px; display: inline-block; margin: 0; border: 1px solid rgba(255,79,64,0.2);">
                            ${otp}
                        </h1>
                        <p style="color: #64748b; font-size: 13px; margin-top: 40px;">
                            If you didn't request this code, please ignore this email.
                        </p>
                    </div>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            return true;
        } catch (error: any) {
            console.error("❌ Email send error:", error.message);
            // ✅ reset transporter ถ้า error เพื่อสร้างใหม่ครั้งหน้า
            transporter = null;
            return false;
        }
    }
};