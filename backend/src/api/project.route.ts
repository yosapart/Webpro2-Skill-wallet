import { Elysia, t } from 'elysia';
import { ProjectController } from '../controllers/project.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const projectRoute = new Elysia({ prefix: '/project' })
    .use(authMiddleware)

    // POST /api/project/upload — Upload รูปภาพ (ลอกจาก Badge Upload ที่ทำงานได้)
    .post('/upload', async ({ body, user, set }: any) => {
        console.log("Project Upload endpoint hit!");
        try {
            console.log("User verified:", user.uid);

            const file: File = body?.file;
            if (!file) {
                console.log("No file found in body.");
                set.status = 400;
                return { status: "error", message: "No file provided." };
            }
            console.log("File received:", file.name, file.size, file.type);

            console.log("Backend: Uploading to Cloudinary via REST API...", file.name);

            const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
            const API_KEY = process.env.CLOUDINARY_API_KEY!;
            const API_SECRET = process.env.CLOUDINARY_API_SECRET!;
            const folder = `projects/${user.uid}`;
            const timestamp = Math.floor(Date.now() / 1000).toString();

            // สร้าง signature สำหรับ Authenticated Upload
            const signaturePayload = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
            const encoder = new TextEncoder();
            const dataHash = encoder.encode(signaturePayload);
            const hashBuffer = await crypto.subtle.digest('SHA-1', dataHash);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            // สร้าง FormData สำหรับส่งไป Cloudinary
            const cloudinaryForm = new FormData();
            cloudinaryForm.append('file', file);
            cloudinaryForm.append('api_key', API_KEY);
            cloudinaryForm.append('timestamp', timestamp);
            cloudinaryForm.append('signature', signature);
            cloudinaryForm.append('folder', folder);

            const cloudinaryRes = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                { method: 'POST', body: cloudinaryForm }
            );

            const cloudinaryData = await cloudinaryRes.json() as any;
            console.log("Cloudinary REST response:", cloudinaryRes.status, cloudinaryData.secure_url || cloudinaryData.error);

            if (!cloudinaryRes.ok) {
                throw new Error(cloudinaryData.error?.message || 'Cloudinary upload failed');
            }

            console.log("Project image uploaded:", cloudinaryData.secure_url);
            return { status: "success", url: cloudinaryData.secure_url };
        } catch (error: any) {
            console.error("Project upload error:", error);
            const errorMsg = error?.message || JSON.stringify(error) || "Unknown error";
            set.status = 500;
            return { status: "error", message: `Upload failed: ${errorMsg}` };
        }
    }, {
        isSignIn: true,
        body: t.Object({ file: t.File() }),
        detail: { tags: ['Project'], summary: 'Upload รูปภาพ Cover ของ Project' }
    })
    // GET /api/project — ดึงโปรเจกต์ทั้งหมด
    .get('', async ({ user }: any) => {
        return await ProjectController.getProjects(user.uid);
    }, {
        isSignIn: true,
        detail: { tags: ['Project'], summary: 'ดึงข้อมูล Featured Projects ทั้งหมด' }
    })
    // POST /api/project — สร้างโปรเจกต์ใหม่ (รับ JSON + URL ของรูปที่ upload แล้ว)
    .post('', async ({ body, user }: any) => {
        console.log("Backend received POST /project (create)");
        const data = {
            ...body,
            tech_stack: typeof body.tech_stack === 'string' ? JSON.parse(body.tech_stack) : body.tech_stack
        };
        return await ProjectController.addProject(user.uid, data);
    }, {
        isSignIn: true,
        body: t.Object({
            title: t.String({ minLength: 1 }),
            description: t.String({ minLength: 1 }),
            tech_stack: t.Any(),
            cover_image: t.Optional(t.String()),
            status: t.Optional(t.String()),
            year: t.Optional(t.String())
        }),
        detail: { tags: ['Project'], summary: 'สร้าง Featured Project ใหม่' }
    })
    // PUT /api/project/:id — แก้ไขโปรเจกต์
    .put('/:id', async ({ params, body, user }: any) => {
        const data = {
            ...body,
            tech_stack: body.tech_stack && typeof body.tech_stack === 'string'
                ? JSON.parse(body.tech_stack) : body.tech_stack
        };
        return await ProjectController.editProject(user.uid, params.id, data);
    }, {
        isSignIn: true,
        params: t.Object({ id: t.String() }),
        body: t.Object({
            title: t.Optional(t.String()),
            description: t.Optional(t.String()),
            tech_stack: t.Optional(t.Any()),
            cover_image: t.Optional(t.String()),
            status: t.Optional(t.String()),
            year: t.Optional(t.String())
        }),
        detail: { tags: ['Project'], summary: 'แก้ไข Featured Project' }
    })
    // DELETE /api/project/:id — ลบโปรเจกต์
    .delete('/:id', async ({ params, user }: any) => {
        return await ProjectController.removeProject(user.uid, params.id);
    }, {
        isSignIn: true,
        params: t.Object({ id: t.String() }),
        detail: { tags: ['Project'], summary: 'ลบ Featured Project' }
    });
