import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // e.g., 'your.email@gmail.com'
        pass: process.env.EMAIL_PASS  // Gmail App Password
    }
});

export const EmailService = {
    async sendOtpEmail(to: string, otp: string) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
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
        } catch (error) {
            console.error("Error sending email:", error);
            return false;
        }
    }
}
