import { Elysia, t } from 'elysia';
import { BadgeRequestController } from '../controllers/badge_request.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const badgeRequestRoute = new Elysia({ prefix: '/badge-requests' })
    .use(authMiddleware)
    // POST /api/badge-requests/upload — upload file ผ่าน backend (ไม่มีปัญหา CORS)
    .post('/upload', async ({ body, user, set }: any) => {
        console.log("Upload endpoint hit!");
        try {
            console.log("User verified:", user.uid);

            const file: File = body?.file;
            if (!file) {
                console.log("No file found in body.");
                set.status = 400;
                return { status: "error", message: "No file provided." };
            }
            console.log("File received:", file.name, file.size, file.type);

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const cloudinary = (await import('../config/cloudinary')).default;

            const isRaw = file.name.match(/\.(zip|rar|7z|doc|docx|xls|xlsx|txt|csv|tar|gz)$/i);
            const resourceType = isRaw ? "raw" : "auto";

            // Cloudinary upload using stream
            const uploadPromise = new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: `badge_evidence/${user.uid}`,
                        resource_type: resourceType,
                        public_id: file.name,
                        use_filename: true,
                        unique_filename: true
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
                stream.end(buffer);
            });

            const result: any = await uploadPromise;

            return { status: "success", url: result.secure_url };
        } catch (error: any) {
            console.error("Upload error caught:", error);
            const errorMsg = error?.message || error?.error?.message || JSON.stringify(error) || "Unknown error";
            set.status = 500;
            return { status: "error", message: `Upload failed: ${errorMsg}` };
        }
    }, {
        isSignIn: true,
        body: t.Object({ file: t.File() }),
        detail: {
            tags: ['Badge Requests'],
            summary: 'Upload หลักฐานไฟล์ผ่าน Backend ไปยัง Firebase Storage'
        }
    })
    .post('/', async ({ body, user, set }: any) => {
        try {
            return await BadgeRequestController.createRequest(user.uid, body);
        } catch (error: any) {
            set.status = 500;
            return { status: "error", message: error.message };
        }
    }, {
        isSignIn: true,
        detail: {
            tags: ['Badge Requests'],
            summary: 'สร้างคำขอ Badge ใหม่ลงใน Collection badge_requests'
        }
    })
    .get('/my-requests', async ({ user, set }: any) => {
        try {
            return await BadgeRequestController.getMyRequests(user.uid);
        } catch (error: any) {
            set.status = 500;
            return { status: "error", message: error.message };
        }
    }, {
        isSignIn: true,
        detail: { tags: ['Badge Requests'], summary: 'ดึงข้อมูลคำขอ Badge ของผู้ใช้งานปัจจุบัน' }
    })
    // The /all route has been moved to professor.route.ts
    ;

