import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function test() {
    try {
        console.log("Testing email configuration...");
        console.log("User:", process.env.EMAIL_USER);
        console.log("Pass:", process.env.EMAIL_PASS ? "Set" : "Not Set");
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'gyttt714@gmail.com',
            subject: 'Test Email',
            text: 'This is a test email'
        });
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

test();
