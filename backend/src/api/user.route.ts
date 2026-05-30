import { Elysia, t } from 'elysia';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const userRoute = new Elysia({ prefix: '/user' })
    .use(authMiddleware)
    
    // ดึงข้อมูลโปรไฟล์
    .get('/profile', async ({ user, set }: any) => {
        try {
            return await UserController.getProfile(user.uid);
        } catch (error: any) {
            set.status = 500;
            return { status: "error", message: error.message };
        }
    }, {
        isSignIn: true,
        detail: {
            tags: ['User'],
            summary: 'ดึงข้อมูลโปรไฟล์ผู้ใช้ปัจจุบัน'
        }
    })

    // อัปเดตข้อมูลโปรไฟล์
    .patch('/profile', async ({ body, user, set }: any) => {
        try {
            return await UserController.updateProfile(user.uid, body);
        } catch (error: any) {
            set.status = 500;
            return { status: "error", message: error.message };
        }
    }, {
        isSignIn: true,
        detail: {
            tags: ['User'],
            summary: 'อัปเดตข้อมูล Profile (Name, Headline, Bio, Location, Avatar)'
        }
    })

    // อัปเดต Badge ที่ปักหมุด
    .patch('/pinned-badges', async ({ body, user, set }: any) => {
        try {
            return await UserController.updatePinnedBadges(user.uid, body.badgeIds);
        } catch (error: any) {
            set.status = 500;
            return { status: "error", message: error.message };
        }
    }, {
        isSignIn: true,
        body: t.Object({
            badgeIds: t.Array(t.String())
        }),
        detail: {
            tags: ['User'],
            summary: 'อัปเดตรายการ Badge ที่เลือกปักหมุดไว้ในหน้า Skill Hub'
        }
    })

    // --- Experience Management ---
    .group('/experience', app => app
        .post('', async ({ body, user }: any) => {
            const { ExperienceController } = await import('../controllers/experience.controller');
            return await ExperienceController.addItem(user.uid, body);
        }, {
            body: t.Object({
                title: t.String(),
                organization: t.String(),
                start_year: t.String(),
                end_year: t.String(),
                description: t.Optional(t.String())
            }),
            detail: { tags: ['Experience'], summary: 'เพิ่มข้อมูลประสบการณ์การทำงาน' }
        })
        .patch('/:id', async ({ params: { id }, body, user }: any) => {
            const { ExperienceController } = await import('../controllers/experience.controller');
            return await ExperienceController.updateItem(user.uid, id, body);
        }, {
            detail: { tags: ['Experience'], summary: 'แก้ไขข้อมูลประสบการณ์การทำงาน' }
        })
        .delete('/:id', async ({ params: { id }, user }: any) => {
            const { ExperienceController } = await import('../controllers/experience.controller');
            return await ExperienceController.deleteItem(user.uid, id);
        }, {
            detail: { tags: ['Experience'], summary: 'ลบข้อมูลประสบการณ์การทำงาน' }
        })
    )

    // --- Education Management ---
    .group('/education', app => app
        .post('', async ({ body, user }: any) => {
            const { EducationController } = await import('../controllers/education.controller');
            return await EducationController.addItem(user.uid, body);
        }, {
            body: t.Object({
                title: t.String(),
                organization: t.String(),
                start_year: t.String(),
                end_year: t.String(),
                description: t.Optional(t.String()),
                gpax: t.Optional(t.String())
            }),
            detail: { tags: ['Education'], summary: 'เพิ่มข้อมูลประวัติการศึกษา' }
        })
        .patch('/:id', async ({ params: { id }, body, user }: any) => {
            const { EducationController } = await import('../controllers/education.controller');
            return await EducationController.updateItem(user.uid, id, body);
        }, {
            detail: { tags: ['Education'], summary: 'แก้ไขข้อมูลประวัติการศึกษา' }
        })
        .delete('/:id', async ({ params: { id }, user }: any) => {
            const { EducationController } = await import('../controllers/education.controller');
            return await EducationController.deleteItem(user.uid, id);
        }, {
            detail: { tags: ['Education'], summary: 'ลบข้อมูลประวัติการศึกษา' }
        })
    );
