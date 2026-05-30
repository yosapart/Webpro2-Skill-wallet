import { Elysia, t } from 'elysia';
import { FeetbackController } from '../controllers/feetback.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export const feetbackRoute = new Elysia({ prefix: '/feetback' })
    .use(authMiddleware)
    .post('/', async ({ body, user, set }: any) => {
        try {
            const result = await FeetbackController.createFeedback(user.uid, body);
            if (result.status === "error") {
                set.status = 400;
            }
            return result;
        } catch (error: any) {
            set.status = 500;
            return { status: "error", message: error.message };
        }
    }, {
        isSignIn: true,
        body: t.Object({
            request_id: t.String(),
            status: t.String(),
            comment: t.String(),
            criteria_states: t.Any()
        }),
        detail: {
            tags: ['Feetback'],
            summary: 'สร้างการประเมินและ feedback สำหรับ Badge Request'
        }
    });
export default feetbackRoute;
