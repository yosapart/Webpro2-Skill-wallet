import { Elysia, t } from 'elysia';
import { BadgeController } from '../controllers/badge.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const badgeRoute = new Elysia({ prefix: '/badges' })
    .use(authMiddleware)
    // เรียกใช้ Middleware เพื่อให้แน่ใจว่าคนที่จะดึงข้อมูล Badge ต้อง Login แล้ว
    .get('/', async ({ user, set }: any) => {
        try {
            // ถ้าผ่าน ให้ return ข้อมูล
            return await BadgeController.getAllBadges();
        } catch (error: any) {
            set.status = 500;
            return { status: "error", message: error.message };
        }
    }, {
        isSignIn: true,
        detail: {
            tags: ['Badges'],
            summary: 'ดึงรายการ Badge ทั้งหมดที่เปิดใช้งานสำหรับแสดงใน Catalog'
        }
    })

    // GET /api/badges/:id - ดึงรายละเอียด Badge ตัวเดียวตาม ID
    .get('/:id', async ({ params, user, set }: any) => {
        try {
            return await BadgeController.getBadgeById(params.id);
        } catch (error: any) {
            set.status = 500;
            return { status: "error", message: error.message };
        }
    }, {
        isSignIn: true,
        params: t.Object({ id: t.String() }),
        detail: {
            tags: ['Badges'],
            summary: 'ดึงรายละเอียดของ Badge ตาม ID ที่ระบุ'
        }
    });
