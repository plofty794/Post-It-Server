import { createComment, showPostComments } from '@controllers/commentControllers';
import { validateData } from '@middlewares/validationMiddleware';
import { verifyUserSession } from '@middlewares/verifyUserSession';
import { commentSchema } from '@validation/schemas';
import { Router } from 'express';

const router = Router();

router.get('/comments/:postID/:page', verifyUserSession, showPostComments);
router.post('/create-comment/:postID', validateData(commentSchema), verifyUserSession, createComment);

export default router;
